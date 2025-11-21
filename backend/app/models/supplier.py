from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    response_time = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="supplier")
    products = relationship("Product", back_populates="supplier")
    orders = relationship("Order", back_populates="supplier")
    team_members = relationship("TeamMember", back_populates="supplier")
    link_requests = relationship("LinkRequest", back_populates="supplier")
