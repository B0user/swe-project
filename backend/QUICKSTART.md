# Backend Quick Start Guide

## Prerequisites
- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

## Installation

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
Create a `.env` file in the backend directory:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=supply_chain
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Initialize Database
```bash
python init_db.py
```

This will:
- Create the PostgreSQL database
- Create all tables
- Set up relationships

## Running the Server

### Start Development Server
```bash
python -m uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`

### API Documentation
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## Testing Endpoints

### Option 1: Using VS Code REST Client
1. Install the "REST Client" extension in VS Code
2. Open `api.rest` file
3. Click "Send Request" above each endpoint

### Option 2: Using cURL
```bash
# Register a user
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "role": "consumer"
  }'

# Login
curl -X POST http://localhost:8000/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password123"
```

### Option 3: Using Postman
1. Import the endpoints from `api.rest`
2. Set the base URL to `http://localhost:8000/api`
3. Add Bearer token to Authorization header for protected endpoints

## Project Structure

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py          # Configuration settings
│   │   ├── security.py        # Password hashing & JWT
│   │   └── __init__.py
│   ├── database/
│   │   ├── database.py        # Database connection
│   │   └── __init__.py
│   ├── models/
│   │   ├── base.py            # Base model
│   │   ├── user.py            # User model
│   │   ├── product.py         # Product model
│   │   ├── order.py           # Order model
│   │   ├── supplier.py        # Supplier model
│   │   ├── link_request.py    # Link request model
│   │   ├── conversation.py    # Conversation model
│   │   ├── message.py         # Message model
│   │   ├── team_member.py     # Team member model
│   │   └── __init__.py
│   ├── schemas/
│   │   ├── user.py            # User schemas
│   │   ├── product.py         # Product schemas
│   │   ├── order.py           # Order schemas
│   │   ├── supplier.py        # Supplier schemas
│   │   ├── message.py         # Message schemas
│   │   ├── team.py            # Team schemas
│   │   └── __init__.py
│   ├── routers/
│   │   ├── auth.py            # Authentication routes
│   │   ├── users.py           # User routes
│   │   ├── products.py        # Product routes
│   │   ├── orders.py          # Order routes
│   │   ├── suppliers.py       # Supplier routes
│   │   ├── messages.py        # Message routes
│   │   ├── team.py            # Team routes
│   │   ├── dashboard.py       # Dashboard routes
│   │   └── __init__.py
│   ├── controllers/
│   │   ├── user_controller.py # User business logic
│   │   └── __init__.py
│   └── main.py                # FastAPI app entry point
├── init_db.py                 # Database initialization
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
├── .gitignore                 # Git ignore file
├── README.md                  # Project documentation
├── API_ENDPOINTS.md           # API documentation
├── IMPLEMENTATION_SUMMARY.md  # Implementation details
└── QUICKSTART.md              # This file
```

## API Endpoints Overview

### Authentication (2 endpoints)
- `POST /register` - Register new user
- `POST /token` - Login and get JWT token

### Users (5 endpoints)
- `GET /users` - List all users
- `GET /users/{id}` - Get user by ID
- `GET /users/me` - Get current user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Products (7 endpoints)
- `GET /products` - List products
- `GET /products/{id}` - Get product
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Orders (5 endpoints)
- `GET /orders` - List orders
- `GET /orders/{id}` - Get order
- `POST /orders` - Create order
- `PUT /orders/{id}/status` - Update order status
- `PUT /orders/{id}/cancel` - Cancel order

### Suppliers (6 endpoints)
- `GET /suppliers` - List suppliers
- `GET /suppliers/{id}` - Get supplier
- `POST /suppliers/link-request` - Send link request
- `GET /suppliers/link-requests/user/{id}` - Get user's requests
- `GET /suppliers/link-requests/supplier/{id}` - Get supplier's requests
- `PUT /suppliers/link-requests/{id}` - Accept/reject request

### Messages (7 endpoints)
- `GET /messages/conversations` - List conversations
- `GET /messages/conversations/{id}` - Get conversation
- `GET /messages/conversations/{id}/messages` - Get messages
- `POST /messages/conversations` - Create conversation
- `POST /messages/` - Send message
- `GET /messages/{id}` - Get message
- `DELETE /messages/{id}` - Delete message

### Team (5 endpoints)
- `GET /team/members` - List team members
- `GET /team/members/{id}` - Get team member
- `POST /team/members` - Add team member
- `PUT /team/members/{id}` - Update team member
- `DELETE /team/members/{id}` - Remove team member

### Dashboard (2 endpoints)
- `GET /dashboard/consumer/{id}` - Consumer dashboard
- `GET /dashboard/supplier/{id}` - Supplier dashboard

**Total: 39 endpoints**

## Common Tasks

### Create a New User
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "full_name": "New User",
    "role": "consumer"
  }'
```

### Get JWT Token
```bash
curl -X POST http://localhost:8000/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=newuser@example.com&password=password123"
```

### List Products
```bash
curl http://localhost:8000/api/products?skip=0&limit=10
```

### Create Product (Requires Auth)
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Organic Tomatoes",
    "description": "Fresh organic tomatoes",
    "category": "Vegetables",
    "price": 4.99,
    "unit": "kg",
    "stock": 100,
    "min_order": 5
  }'
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `python init_db.py`

### Port Already in Use
```bash
# Use a different port
python -m uvicorn app.main:app --reload --port 8001
```

### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Database Errors
```bash
# Reset database
python init_db.py
```

## Development Tips

### Enable Debug Logging
Add to `app/main.py`:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### View Database Schema
```bash
# Connect to PostgreSQL
psql -U postgres -d supply_chain

# List tables
\dt

# Describe table
\d users
```

### Hot Reload
The server automatically reloads when you change files (with `--reload` flag)

## Next Steps

1. **Frontend Integration**: Connect the React frontend to these endpoints
2. **Database Seeding**: Add sample data for testing
3. **Testing**: Write unit and integration tests
4. **Deployment**: Deploy to production server
5. **Monitoring**: Set up logging and monitoring

## Documentation

- **API_ENDPOINTS.md** - Complete API documentation with examples
- **IMPLEMENTATION_SUMMARY.md** - Implementation details
- **README.md** - Project overview
- **Swagger UI** - Interactive API docs at `/api/docs`

## Support

For issues or questions:
1. Check the API documentation
2. Review the error logs
3. Check the Swagger UI for endpoint details
4. Review the implementation summary

---

**Backend is ready for development!** 🚀
