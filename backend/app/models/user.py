from sqlalchemy import Column, String, Boolean, Enum
from sqlalchemy.orm import relationship
from .base import BaseModel
import enum

class UserRole(str, enum.Enum):
    CONSUMER = "consumer"
    SUPPLIER = "supplier"
    ADMIN = "admin"

class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean(), default=True)
    role = Column(Enum(UserRole), default=UserRole.CONSUMER, nullable=False)
    
    # Relationships
    products = relationship("Product", back_populates="owner")
    orders = relationship("Order", back_populates="user")
