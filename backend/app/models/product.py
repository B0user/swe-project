from sqlalchemy import Column, String, Float, Integer, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from .base import BaseModel
import enum

class ProductCategory(str, enum.Enum):
    VEGETABLES = "vegetables"
    FRUITS = "fruits"
    DAIRY = "dairy"
    BAKERY = "bakery"
    MEAT = "meat"
    SEAFOOD = "seafood"
    BEVERAGES = "beverages"
    OTHER = "other"

class Product(BaseModel):
    __tablename__ = "products"
    
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    unit = Column(String(20), default="kg", nullable=False)
    category = Column(Enum(ProductCategory), nullable=False)
    stock_quantity = Column(Integer, default=0, nullable=False)
    image_url = Column(String(255), nullable=True)
    
    # Relationships
    owner_id = Column(Integer, ForeignKey("users.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    owner = relationship("User", back_populates="products")
    supplier = relationship("Supplier", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
