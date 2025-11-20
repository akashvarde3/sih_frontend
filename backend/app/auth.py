import datetime
from typing import Optional

import jwt
from fastapi import HTTPException, status
from passlib.context import CryptContext

SECRET_KEY = "change-me"  # replace via env vars in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def _encode_token(payload: dict, expires_delta: datetime.timedelta) -> str:
    to_encode = payload.copy()
    expire = datetime.datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_access_token(subject: str, role: str, mfa_verified: bool = False) -> str:
    return _encode_token(
        {"sub": subject, "role": role, "mfa": mfa_verified, "type": "access"},
        datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(subject: str) -> str:
    return _encode_token(
        {"sub": subject, "type": "refresh"},
        datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError as exc:  # pragma: no cover - illustrative
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from exc


def ensure_token_type(payload: dict, expected_type: str) -> None:
    if payload.get("type") != expected_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token type mismatch",
        )


def ensure_role(payload: dict, allowed_roles: list[str]) -> None:
    if allowed_roles and payload.get("role") not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )


def ensure_mfa(payload: dict, required: bool) -> None:
    if required and not payload.get("mfa"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="MFA not verified",
        )
