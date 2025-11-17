from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from ..models.user import UserRole

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[UserRole] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    
    class Config:
        use_enum_values = False

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = Field(None, min_length=8)

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Additional properties to return via API
class User(UserInDBBase):
    pass

# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str

# Token response
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[Dict[str, Any]] = None
