from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas
from ..database.database import get_db
from ..controllers.product_controller import ProductController
from .base import get_current_user, CommonQueryParams

router = APIRouter(prefix="/products", tags=["products"])
product_controller = ProductController()

@router.get("/", response_model=List[schemas.Product])
def list_products(
    commons: CommonQueryParams = Depends(),
    db: Session = Depends(get_db),
    category: Optional[models.ProductCategory] = None
):
    """
    Retrieve products with optional filtering by category and search query.
    """
    if commons.q:
        return product_controller.search(
            db, query=commons.q, skip=commons.skip, limit=commons.limit
        )
    elif category:
        return product_controller.get_multi_by_category(
            db, category=category, skip=commons.skip, limit=commons.limit
        )
    else:
        return product_controller.get_multi(
            db, skip=commons.skip, limit=commons.limit
        )

@router.post("/", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create a new product (requires authentication).
    """
    # Only suppliers and admins can create products
    if current_user.role not in ["supplier", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only suppliers can create products"
        )
    
    # Set the owner to the current user
    product_dict = product.dict()
    product_dict["owner_id"] = current_user.id
    
    return product_controller.create(db, obj_in=product_dict)

@router.get("/{product_id}", response_model=schemas.Product)
def read_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific product by ID.
    """
    product = product_controller.get(db, id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

@router.put("/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int,
    product_in: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update a product (requires ownership or admin privileges).
    """
    product = product_controller.get(db, id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if user is the owner or an admin
    if product.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return product_controller.update(
        db, db_obj=product, obj_in=product_in
    )

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Delete a product (requires ownership or admin privileges).
    """
    product = product_controller.get(db, id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if user is the owner or an admin
    if product.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    product_controller.remove(db, id=product_id)
    return None
