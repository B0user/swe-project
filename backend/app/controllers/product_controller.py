from typing import List, Optional
from sqlalchemy.orm import Session
from .. import models, schemas
from .base_controller import BaseController

class ProductController(BaseController[models.Product, schemas.ProductCreate, schemas.ProductUpdate]):
    """
    Product controller with default CRUD operations and additional business logic.
    """
    def __init__(self):
        super().__init__(models.Product)
    
    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[models.Product]:
        """
        Retrieve products for a specific owner.
        """
        return (
            db.query(self.model)
            .filter(models.Product.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_multi_by_category(
        self, db: Session, *, category: models.ProductCategory, skip: int = 0, limit: int = 100
    ) -> List[models.Product]:
        """
        Retrieve products by category.
        """
        return (
            db.query(self.model)
            .filter(models.Product.category == category)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def update_stock(
        self, db: Session, *, db_obj: models.Product, quantity_change: int
    ) -> models.Product:
        """
        Update product stock quantity.
        """
        db_obj.stock_quantity += quantity_change
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def search(
        self, db: Session, *, query: str, skip: int = 0, limit: int = 100
    ) -> List[models.Product]:
        """
        Search products by name or description.
        """
        search = f"%{query}%"
        return (
            db.query(self.model)
            .filter(
                (models.Product.name.ilike(search)) |
                (models.Product.description.ilike(search))
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
