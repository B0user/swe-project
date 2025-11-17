from typing import List, Optional
from sqlalchemy.orm import Session
from .. import models, schemas
from .base_controller import BaseController

class OrderController(BaseController[models.Order, schemas.OrderCreate, schemas.OrderUpdate]):
    """
    Order controller with default CRUD operations and additional business logic.
    """
    def __init__(self):
        super().__init__(models.Order)
    
    def get_multi_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[models.Order]:
        """
        Retrieve orders for a specific user.
        """
        return (
            db.query(self.model)
            .filter(models.Order.user_id == user_id)
            .order_by(models.Order.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_multi_by_status(
        self, db: Session, *, status: models.OrderStatus, skip: int = 0, limit: int = 100
    ) -> List[models.Order]:
        """
        Retrieve orders by status.
        """
        return (
            db.query(self.model)
            .filter(models.Order.status == status)
            .order_by(models.Order.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def create_with_items(
        self, db: Session, *, obj_in: schemas.OrderCreate, user_id: int
    ) -> models.Order:
        """
        Create a new order with order items.
        """
        # Calculate total amount
        total_amount = sum(
            item.quantity * item.unit_price 
            for item in obj_in.items
        )
        
        # Create the order
        db_order = models.Order(
            user_id=user_id,
            total_amount=total_amount,
            status=obj_in.status,
            shipping_address=obj_in.shipping_address,
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        
        # Create order items
        for item in obj_in.items:
            db_item = models.OrderItem(
                order_id=db_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=item.unit_price,
            )
            db.add(db_item)
        
        db.commit()
        db.refresh(db_order)
        return db_order
    
    def update_status(
        self, db: Session, *, db_obj: models.Order, status: models.OrderStatus
    ) -> models.Order:
        """
        Update order status.
        """
        db_obj.status = status
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
