from datetime import datetime, timedelta
from typing import Optional
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database.database import get_db
from ..core.config import settings
from ..core.security import get_password_hash, verify_password

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(tags=["auth"])

def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = authenticate_user(
        db, 
        email=form_data.username, 
        password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active
        }
    }

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    """
    try:
        logger.info(f"Register attempt: email={user.email}, role={user.role}")
        
        # Check if email is already registered
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user:
            logger.warning(f"Email already registered: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash the password
        logger.debug(f"Hashing password for {user.email}")
        hashed_password = get_password_hash(user.password)
        
        # Determine role - use provided role or default to consumer
        role = user.role if user.role else models.UserRole.CONSUMER
        logger.debug(f"User role: {role}, type: {type(role)}")
        
        # Create new user
        logger.debug(f"Creating user object with email={user.email}, role={role}")
        db_user = models.User(
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            role=role,
            is_active=True
        )
        
        logger.debug(f"Adding user to database session")
        db.add(db_user)
        
        logger.debug(f"Committing transaction")
        db.commit()
        
        logger.debug(f"Refreshing user object")
        db.refresh(db_user)
        
        logger.info(f"User registered successfully: id={db_user.id}, email={user.email}")
        return db_user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during registration: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )
