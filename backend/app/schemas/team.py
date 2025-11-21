from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TeamMemberBase(BaseModel):
    supplier_id: int
    user_id: int
    role: str


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None


class TeamMember(TeamMemberBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
