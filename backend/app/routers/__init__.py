from fastapi import APIRouter
from . import users, products, auth, orders

api_router = APIRouter()

# Include all routers
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(products.router)
api_router.include_router(orders.router)

__all__ = ["api_router"]
