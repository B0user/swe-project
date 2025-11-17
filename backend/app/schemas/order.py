from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from ..models.order import OrderStatus

# Shared properties for OrderItem
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)

# Properties to receive on order item creation
class OrderItemCreate(OrderItemBase):
    pass

# Properties shared by models stored in DB
class OrderItemInDBBase(OrderItemBase):
    id: int
    order_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Additional properties to return via API
class OrderItem(OrderItemInDBBase):
    pass

# Shared properties for Order
class OrderBase(BaseModel):
    shipping_address: str = Field(..., max_length=255)
    status: OrderStatus = OrderStatus.PENDING

# Properties to receive on order creation
class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

# Properties to receive on order update
class OrderUpdate(OrderBase):
    status: Optional[OrderStatus] = None

# Properties shared by models stored in DB
class OrderInDBBase(OrderBase):
    id: int
    user_id: int
    total_amount: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Additional properties to return via API
class Order(OrderInDBBase):
    items: List[OrderItem] = []

# Additional properties stored in DB
class OrderInDB(OrderInDBBase):
    pass
