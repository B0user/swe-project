from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Optional
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.database import get_db
from app.models import User

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency to get current user from token
async def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# Dependency to check if user is admin
async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions"
        )
    return current_user

# Common query parameters
class CommonQueryParams:
    def __init__(
        self,
        skip: int = 0,
        limit: int = 100,
        q: Optional[str] = None
    ):
        self.skip = skip
        self.limit = limit
        self.q = q
