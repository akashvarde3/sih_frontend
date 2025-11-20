from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class Role(str, Enum):
    farmer = "farmer"
    officer = "officer"
    admin = "admin"


class UserProfile(BaseModel):
    full_name: str = Field(..., description="Display name for greetings and receipts")
    phone: Optional[str] = Field(None, description="Verified mobile number")
    language: str = Field(default="en", description="Preferred UI language code")
    address: Optional[str] = None


class AuditFields(BaseModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: Optional[str] = None
    last_login_at: Optional[datetime] = None
    last_mfa_at: Optional[datetime] = None


class User(BaseModel):
    email: EmailStr
    hashed_password: str
    roles: List[Role] = Field(default_factory=lambda: [Role.farmer])
    profile: UserProfile
    is_verified: bool = False
    mfa_secret: Optional[str] = Field(
        default=None, description="TOTP secret or OTP channel identifier"
    )
    audit: AuditFields = Field(default_factory=AuditFields)
    disabled: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "email": "farmer@example.com",
                "hashed_password": "bcrypt$...",
                "roles": ["farmer"],
                "profile": {
                    "full_name": "Asha Patel",
                    "phone": "+919999999999",
                    "language": "hi",
                    "address": "Village Road, Gujarat",
                },
                "is_verified": True,
                "mfa_secret": "JBSWY3DPEHPK3PXP",
                "audit": {
                    "created_at": "2024-01-01T00:00:00Z",
                    "created_by": "system",
                    "last_login_at": "2024-05-10T08:00:00Z",
                },
            }
        }
