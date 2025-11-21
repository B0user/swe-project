import logging
from typing import Dict, Any, List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from .. import models
from ..database.database import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/consumer/{user_id}", response_model=Dict[str, Any])
def get_consumer_dashboard(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get consumer dashboard with summary statistics and recent orders.
    """
    try:
        # Verify user exists and is a consumer
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get order statistics
        total_orders = db.query(func.count(models.Order.id)).filter(
            models.Order.user_id == user_id
        ).scalar() or 0
        
        completed_orders = db.query(func.count(models.Order.id)).filter(
            (models.Order.user_id == user_id) &
            (models.Order.status == "delivered")
        ).scalar() or 0
        
        pending_orders = db.query(func.count(models.Order.id)).filter(
            (models.Order.user_id == user_id) &
            (models.Order.status.in_(["processing", "in-transit"]))
        ).scalar() or 0
        
        # Get total spending
        total_spent = db.query(func.sum(models.Order.total_amount)).filter(
            models.Order.user_id == user_id
        ).scalar() or 0
        
        # Get recent orders (last 5)
        recent_orders = db.query(models.Order).filter(
            models.Order.user_id == user_id
        ).order_by(models.Order.created_at.desc()).limit(5).all()
        
        # Get favorite suppliers (most ordered from)
        favorite_suppliers = db.query(
            models.Supplier.id,
            models.Supplier.name,
            func.count(models.Order.id).label("order_count")
        ).join(
            models.Order,
            models.Order.supplier_id == models.Supplier.id
        ).filter(
            models.Order.user_id == user_id
        ).group_by(
            models.Supplier.id,
            models.Supplier.name
        ).order_by(
            func.count(models.Order.id).desc()
        ).limit(5).all()
        
        logger.info(f"Consumer dashboard retrieved for user_id={user_id}")
        
        return {
            "user_id": user_id,
            "total_orders": total_orders,
            "completed_orders": completed_orders,
            "pending_orders": pending_orders,
            "total_spent": float(total_spent),
            "recent_orders": [
                {
                    "id": order.id,
                    "supplier_id": order.supplier_id,
                    "status": order.status,
                    "total_amount": float(order.total_amount),
                    "created_at": order.created_at.isoformat() if order.created_at else None
                }
                for order in recent_orders
            ],
            "favorite_suppliers": [
                {
                    "id": supplier[0],
                    "name": supplier[1],
                    "order_count": supplier[2]
                }
                for supplier in favorite_suppliers
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving consumer dashboard: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dashboard"
        )


@router.get("/supplier/{user_id}", response_model=Dict[str, Any])
def get_supplier_dashboard(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get supplier dashboard with sales metrics and inventory status.
    """
    try:
        # Verify user exists and is a supplier
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get supplier info
        supplier = db.query(models.Supplier).filter(models.Supplier.user_id == user_id).first()
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Supplier profile not found"
            )
        
        # Get sales statistics
        total_orders = db.query(func.count(models.Order.id)).filter(
            models.Order.supplier_id == supplier.id
        ).scalar() or 0
        
        total_revenue = db.query(func.sum(models.Order.total_amount)).filter(
            models.Order.supplier_id == supplier.id
        ).scalar() or 0
        
        # Get orders from last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_revenue = db.query(func.sum(models.Order.total_amount)).filter(
            (models.Order.supplier_id == supplier.id) &
            (models.Order.created_at >= thirty_days_ago)
        ).scalar() or 0
        
        # Get inventory status
        total_products = db.query(func.count(models.Product.id)).filter(
            models.Product.supplier_id == supplier.id
        ).scalar() or 0
        
        low_stock_products = db.query(func.count(models.Product.id)).filter(
            (models.Product.supplier_id == supplier.id) &
            (models.Product.stock < 10)
        ).scalar() or 0
        
        # Get recent orders
        recent_orders = db.query(models.Order).filter(
            models.Order.supplier_id == supplier.id
        ).order_by(models.Order.created_at.desc()).limit(10).all()
        
        # Get top products
        top_products = db.query(
            models.Product.id,
            models.Product.name,
            func.count(models.OrderItem.id).label("order_count")
        ).join(
            models.OrderItem,
            models.OrderItem.product_id == models.Product.id
        ).filter(
            models.Product.supplier_id == supplier.id
        ).group_by(
            models.Product.id,
            models.Product.name
        ).order_by(
            func.count(models.OrderItem.id).desc()
        ).limit(5).all()
        
        logger.info(f"Supplier dashboard retrieved for user_id={user_id}, supplier_id={supplier.id}")
        
        return {
            "user_id": user_id,
            "supplier_id": supplier.id,
            "supplier_name": supplier.name,
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "recent_revenue": float(recent_revenue),
            "total_products": total_products,
            "low_stock_products": low_stock_products,
            "recent_orders": [
                {
                    "id": order.id,
                    "user_id": order.user_id,
                    "status": order.status,
                    "total_amount": float(order.total_amount),
                    "created_at": order.created_at.isoformat() if order.created_at else None
                }
                for order in recent_orders
            ],
            "top_products": [
                {
                    "id": product[0],
                    "name": product[1],
                    "order_count": product[2]
                }
                for product in top_products
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving supplier dashboard: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dashboard"
        )
