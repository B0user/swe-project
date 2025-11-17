# Supply Chain Management System - Backend

This is the backend for a Supply Chain Management System built with FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- User authentication with JWT tokens
- Role-based access control (Admin, Supplier, Consumer)
- Product management
- Order processing
- RESTful API endpoints
- PostgreSQL database integration
- Pydantic data validation
- SQLAlchemy ORM

## Prerequisites

- Python 3.8+
- PostgreSQL 13+
- pip (Python package manager)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd supply-chain-backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_SERVER=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=supply_chain
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/supply_chain

   # Security
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Run the application**
   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/api/docs`
   - Alternative Documentation: `http://localhost:8000/api/redoc`

## API Endpoints

### Authentication
- `POST /api/token` - Login and get access token
- `POST /api/register` - Register a new user

### Users
- `GET /api/users/me` - Get current user details
- `PUT /api/users/me` - Update current user
- `GET /api/users/` - List all users (admin only)
- `GET /api/users/{user_id}` - Get user by ID (admin only)
- `PUT /api/users/{user_id}` - Update user (admin only)
- `DELETE /api/users/{user_id}` - Delete user (admin only)

### Products
- `GET /api/products/` - List all products
- `POST /api/products/` - Create a new product (supplier/admin only)
- `GET /api/products/{product_id}` - Get product by ID
- `PUT /api/products/{product_id}` - Update product (owner/admin only)
- `DELETE /api/products/{product_id}` - Delete product (owner/admin only)

### Orders
- `GET /api/orders/` - List all orders (admin) or user's orders (consumer)
- `POST /api/orders/` - Create a new order (consumer only)
- `GET /api/orders/{order_id}` - Get order by ID
- `PUT /api/orders/{order_id}/status` - Update order status (supplier/admin only)

## Project Structure

```
backend/
├── alembic/                 # Database migrations
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── core/                # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py        # Application configuration
│   │   └── security.py      # Authentication and security
│   ├── database/            # Database configuration
│   │   ├── __init__.py
│   │   └── database.py      # Database session and engine
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── schemas/             # Pydantic models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── controllers/         # Business logic
│   │   ├── __init__.py
│   │   ├── base_controller.py
│   │   ├── user_controller.py
│   │   ├── product_controller.py
│   │   └── order_controller.py
│   └── routers/             # API routes
│       ├── __init__.py
│       ├── base.py
│       ├── auth.py
│       ├── users.py
│       ├── products.py
│       └── orders.py
├── tests/                   # Test files
├── .env.example             # Example environment variables
├── .gitignore
├── alembic.ini              # Alembic configuration
├── requirements.txt         # Project dependencies
└── README.md               # This file
```

## Testing

To run the tests:

```bash
pytest
```

## Deployment

### Production
For production deployment, it's recommended to use:
- Gunicorn as the ASGI server
- Nginx as a reverse proxy
- PostgreSQL as the database
- Environment variables for configuration

Example Gunicorn command:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Write tests for your changes
5. Run tests and ensure they pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
