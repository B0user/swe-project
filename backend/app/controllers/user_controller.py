from typing import Optional
from sqlalchemy.orm import Session
from .. import models, schemas
from ..core.security import get_password_hash, verify_password
from .base_controller import BaseController

class UserController(BaseController[models.User, schemas.UserCreate, schemas.UserUpdate]):
    """
    User controller with default CRUD operations and additional business logic.
    """
    def __init__(self):
        super().__init__(models.User)
    
    def get_by_email(self, db: Session, email: str) -> Optional[models.User]:
        """
        Get user by email.
        """
        return db.query(self.model).filter(models.User.email == email).first()
    
    def create(self, db: Session, *, obj_in: schemas.UserCreate) -> models.User:
        """
        Create a new user with hashed password.
        """
        db_obj = models.User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            role=obj_in.role if obj_in.role else "consumer"
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def authenticate(self, db: Session, email: str, password: str) -> Optional[models.User]:
        """
        Authenticate user with email and password.
        """
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
