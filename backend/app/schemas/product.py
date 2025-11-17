from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from ..models.product import ProductCategory

# Shared properties
class ProductBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    unit: str = Field("kg", max_length=20)
    category: ProductCategory
    stock_quantity: int = Field(0, ge=0)
    image_url: Optional[HttpUrl] = None

# Properties to receive on product creation
class ProductCreate(ProductBase):
    pass

# Properties to receive on product update
class ProductUpdate(ProductBase):
    name: Optional[str] = Field(None, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)

# Properties shared by models stored in DB
class ProductInDBBase(ProductBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Additional properties to return via API
class Product(ProductInDBBase):
    pass

# Additional properties stored in DB
class ProductInDB(ProductInDBBase):
    pass
