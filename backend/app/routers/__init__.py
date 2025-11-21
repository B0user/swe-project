from fastapi import APIRouter
from . import users, products, auth, orders, suppliers, messages, team, dashboard

api_router = APIRouter()

# Include all routers
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(products.router)
api_router.include_router(orders.router)
api_router.include_router(suppliers.router)
api_router.include_router(messages.router)
api_router.include_router(team.router)
api_router.include_router(dashboard.router)

__all__ = ["api_router"]
