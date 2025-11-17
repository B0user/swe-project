# Import all controllers here to make them available when importing from app.controllers
from .user_controller import UserController
from .product_controller import ProductController
from .order_controller import OrderController

__all__ = [
    'UserController',
    'ProductController',
    'OrderController',
]
