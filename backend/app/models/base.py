from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy import Column, Integer, DateTime, func
from ..database.database import Base

class BaseModel(Base):
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()
