from datetime import datetime
from typing import Annotated, List

from fastapi import Depends, FastAPI, Header, HTTPException, status

from . import auth
from .models import Role, User

app = FastAPI(title="Farmer Portal API", version="0.1.0")

# In-memory store for demonstration; replace with MongoDB collection access.
FAKE_USERS = {
    "farmer@example.com": User(
        email="farmer@example.com",
        hashed_password=auth.get_password_hash("password"),
        roles=[Role.farmer],
        profile={"full_name": "Kiran", "language": "hi"},
        is_verified=True,
    )
}


async def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
    allowed_roles: List[str] | None = None,
    mfa_required: bool = False,
) -> User:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth header")

    payload = auth.decode_token(token)
    auth.ensure_token_type(payload, "access")
    auth.ensure_role(payload, allowed_roles or [])
    auth.ensure_mfa(payload, mfa_required)

    user = FAKE_USERS.get(payload["sub"])
    if not user or user.disabled:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User disabled")
    return user


def role_guard(*roles: Role, mfa_required: bool = False):
    async def dependency(authorization: Annotated[str | None, Header()] = None) -> User:
        return await get_current_user(
            authorization=authorization,
            allowed_roles=[role.value for role in roles],
            mfa_required=mfa_required,
        )

    return dependency


@app.post("/auth/login")
async def login(email: str, password: str):
    user = FAKE_USERS.get(email)
    if not user or not auth.verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = auth.create_access_token(subject=user.email, role=user.roles[0], mfa_verified=False)
    refresh_token = auth.create_refresh_token(subject=user.email)
    user.audit.last_login_at = datetime.utcnow()
    return {"access_token": access_token, "refresh_token": refresh_token}


@app.post("/auth/refresh")
async def refresh(refresh_token: str):
    payload = auth.decode_token(refresh_token)
    auth.ensure_token_type(payload, "refresh")
    email = payload["sub"]
    user = FAKE_USERS.get(email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access_token = auth.create_access_token(subject=email, role=user.roles[0], mfa_verified=True)
    return {"access_token": access_token}


@app.post("/auth/mfa/challenge")
async def send_mfa_challenge(user: Annotated[User, Depends(role_guard(*Role))]):
    user.audit.last_mfa_at = datetime.utcnow()
    # Integrate SMS/email OTP or TOTP provisioning here.
    return {"message": "OTP dispatched", "mfa_required_for": user.email}


@app.get("/users/me")
async def read_me(user: Annotated[User, Depends(role_guard(*Role))]):
    return user


@app.get("/admin/overview")
async def admin_only(user: Annotated[User, Depends(role_guard(Role.admin, mfa_required=True))]):
    return {"email": user.email, "roles": user.roles, "verified": user.is_verified}
