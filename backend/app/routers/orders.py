from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas
from ..database.database import get_db
from ..controllers.order_controller import OrderController
from .base import get_current_user, CommonQueryParams

router = APIRouter(prefix="/orders", tags=["orders"])
order_controller = OrderController()

@router.get("/", response_model=List[schemas.Order])
def list_orders(
    commons: CommonQueryParams = Depends(),
    status: Optional[models.OrderStatus] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    List all orders. Filterable by status.
    """
    if current_user.role == "admin":
        if status:
            return order_controller.get_multi_by_status(
                db, status=status, skip=commons.skip, limit=commons.limit
            )
        return order_controller.get_multi(
            db, skip=commons.skip, limit=commons.limit
        )
    else:
        # Regular users can only see their own orders
        return order_controller.get_multi_by_user(
            db, user_id=current_user.id, skip=commons.skip, limit=commons.limit
        )

@router.post("/", response_model=schemas.Order, status_code=status.HTTP_201_CREATED)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create a new order.
    """
    # Only consumers can create orders
    if current_user.role != "consumer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only consumers can create orders"
        )
    
    return order_controller.create_with_items(
        db, obj_in=order, user_id=current_user.id
    )

@router.get("/{order_id}", response_model=schemas.Order)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get a specific order by ID.
    """
    order = order_controller.get(db, id=order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if user has permission to view this order
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to view this order"
        )
    
    return order

@router.put("/{order_id}/status", response_model=schemas.Order)
def update_order_status(
    order_id: int,
    status: models.OrderStatus,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update order status (admin or supplier only).
    """
    order = order_controller.get(db, id=order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if user has permission to update this order
    if current_user.role not in ["admin", "supplier"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this order"
        )
    
    return order_controller.update_status(
        db, db_obj=order, status=status
    )

@router.get("/user/{user_id}", response_model=List[schemas.Order])
def get_orders_by_user(
    user_id: int,
    commons: CommonQueryParams = Depends(),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get orders for a specific user (admin only).
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view orders by user"
        )
    
    return order_controller.get_multi_by_user(
        db, user_id=user_id, skip=commons.skip, limit=commons.limit
    )
