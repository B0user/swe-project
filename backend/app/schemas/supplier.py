from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SupplierBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    verified: Optional[bool] = False
    response_time: Optional[str] = None


class SupplierCreate(SupplierBase):
    user_id: int


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    verified: Optional[bool] = None
    response_time: Optional[str] = None


class Supplier(SupplierBase):
    id: int
    user_id: int
    rating: float
    review_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LinkRequestBase(BaseModel):
    supplier_id: int
    user_id: int
    message: Optional[str] = None


class LinkRequest(LinkRequestBase):
    pass


class LinkRequestCreate(LinkRequestBase):
    pass


class LinkRequestUpdate(BaseModel):
    status: str  # pending, accepted, rejected


class LinkRequestResponse(BaseModel):
    id: int
    supplier_id: int
    user_id: int
    message: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
