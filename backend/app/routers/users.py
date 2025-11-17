from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database.database import get_db
from ..controllers.user_controller import UserController
from .base import get_current_user, get_current_admin_user, CommonQueryParams

router = APIRouter(prefix="/users", tags=["users"])
user_controller = UserController()

@router.post("/", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new user (open registration).
    """
    # Check if email is already registered
    db_user = user_controller.get_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Default role is 'consumer' for new users
    user_dict = user.dict()
    user_dict["role"] = "consumer"
    
    return user_controller.create(db, obj_in=user_dict)

@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.User = Depends(get_current_user)
):
    """
    Get current user details.
    """
    return current_user

@router.put("/me", response_model=schemas.User)
def update_user_me(
    user_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update current user details.
    """
    return user_controller.update(
        db, db_obj=current_user, obj_in=user_in
    )

# Admin-only endpoints
@router.get("/", response_model=List[schemas.User])
def list_users(
    commons: CommonQueryParams = Depends(),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """
    Retrieve all users (admin only).
    """
    return user_controller.get_multi(
        db, skip=commons.skip, limit=commons.limit
    )

@router.get("/{user_id}", response_model=schemas.User)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """
    Get a specific user by ID (admin only).
    """
    user = user_controller.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/{user_id}", response_model=schemas.User)
def update_user(
    user_id: int,
    user_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """
    Update a user (admin only).
    """
    user = user_controller.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user_controller.update(db, db_obj=user, obj_in=user_in)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """
    Delete a user (admin only).
    """
    user = user_controller.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    user_controller.remove(db, id=user_id)
    return None
