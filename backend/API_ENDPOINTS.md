# FastAPI Backend - Complete API Endpoints Documentation

## Base URL
```
http://localhost:8000/api
```

---

## Authentication Endpoints

### Register User
**POST** `/register`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "consumer"
}
```
**Response:** User object with id, email, full_name, role, is_active

### Login
**POST** `/token`
```
Content-Type: application/x-www-form-urlencoded
username=user@example.com&password=password123
```
**Response:** 
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": { ... }
}
```

---

## User Endpoints

### List Users
**GET** `/users?skip=0&limit=10`
**Auth:** Required (Bearer token)
**Response:** List of User objects

### Get User by ID
**GET** `/users/{user_id}`
**Auth:** Required
**Response:** User object

### Update User
**PUT** `/users/{user_id}`
**Auth:** Required
```json
{
  "email": "newemail@example.com",
  "full_name": "Updated Name",
  "role": "supplier"
}
```
**Response:** Updated User object

### Delete User
**DELETE** `/users/{user_id}`
**Auth:** Required
**Response:** 204 No Content

### Get Current User
**GET** `/users/me`
**Auth:** Required
**Response:** Current User object

---

## Product Endpoints

### List Products
**GET** `/products?skip=0&limit=10&category=vegetables&search=tomato`
**Auth:** Optional
**Response:** List of Product objects

### Get Product by ID
**GET** `/products/{product_id}`
**Auth:** Optional
**Response:** Product object

### Create Product
**POST** `/products`
**Auth:** Required (Supplier only)
```json
{
  "name": "Organic Tomatoes",
  "description": "Fresh organic tomatoes",
  "category": "Vegetables",
  "price": 4.99,
  "unit": "kg",
  "stock": 100,
  "min_order": 5
}
```
**Response:** Created Product object

### Update Product
**PUT** `/products/{product_id}`
**Auth:** Required (Owner only)
```json
{
  "name": "Updated Name",
  "price": 5.99,
  "stock": 80
}
```
**Response:** Updated Product object

### Delete Product
**DELETE** `/products/{product_id}`
**Auth:** Required (Owner only)
**Response:** 204 No Content

---

## Order Endpoints

### List Orders
**GET** `/orders?skip=0&limit=10&status=processing`
**Auth:** Required
**Response:** List of Order objects

### Get Order by ID
**GET** `/orders/{order_id}`
**Auth:** Required
**Response:** Order object with OrderItems

### Create Order
**POST** `/orders`
**Auth:** Required
```json
{
  "supplier_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 5
    },
    {
      "product_id": 2,
      "quantity": 3
    }
  ],
  "shipping_address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip_code": "10001"
}
```
**Response:** Created Order object

### Update Order Status
**PUT** `/orders/{order_id}/status`
**Auth:** Required (Supplier or Admin)
```json
{
  "status": "in-transit",
  "tracking_number": "TRK123456"
}
```
**Response:** Updated Order object

### Cancel Order
**PUT** `/orders/{order_id}/cancel`
**Auth:** Required (Owner or Admin)
**Response:** Updated Order object with status "cancelled"

---

## Supplier Endpoints

### List Suppliers
**GET** `/suppliers?skip=0&limit=10&category=vegetables&search=green`
**Auth:** Optional
**Response:** List of Supplier objects

### Get Supplier by ID
**GET** `/suppliers/{supplier_id}`
**Auth:** Optional
**Response:** Supplier object

### Send Link Request
**POST** `/suppliers/link-request`
**Auth:** Required
```json
{
  "supplier_id": 1,
  "user_id": 2,
  "message": "I'd like to connect with you"
}
```
**Response:** 
```json
{
  "id": 1,
  "status": "pending",
  "message": "Link request sent successfully"
}
```

### Get User's Link Requests
**GET** `/suppliers/link-requests/user/{user_id}?status=pending`
**Auth:** Required
**Response:** List of LinkRequest objects

### Get Supplier's Link Requests
**GET** `/suppliers/link-requests/supplier/{supplier_id}?status=pending`
**Auth:** Required (Supplier only)
**Response:** List of LinkRequest objects

### Update Link Request
**PUT** `/suppliers/link-requests/{request_id}`
**Auth:** Required (Supplier only)
```json
{
  "status": "accepted"
}
```
**Response:** Updated LinkRequest object

---

## Message Endpoints

### List Conversations
**GET** `/messages/conversations?user_id=1&skip=0&limit=10`
**Auth:** Required
**Response:** List of Conversation objects

### Get Conversation
**GET** `/messages/conversations/{conversation_id}`
**Auth:** Required
**Response:** Conversation object

### Get Conversation Messages
**GET** `/messages/conversations/{conversation_id}/messages?skip=0&limit=50`
**Auth:** Required
**Response:** List of Message objects

### Create Conversation
**POST** `/messages/conversations`
**Auth:** Required
```json
{
  "user1_id": 1,
  "user2_id": 2
}
```
**Response:** Conversation object

### Send Message
**POST** `/messages/`
**Auth:** Required
```json
{
  "conversation_id": 1,
  "sender_id": 1,
  "content": "Hello, how are you?"
}
```
**Response:** Message object

### Get Message
**GET** `/messages/{message_id}`
**Auth:** Required
**Response:** Message object

### Delete Message
**DELETE** `/messages/{message_id}`
**Auth:** Required (Owner only)
**Response:** 204 No Content

---

## Team Endpoints

### List Team Members
**GET** `/team/members?supplier_id=1&skip=0&limit=10`
**Auth:** Required (Supplier only)
**Response:** List of TeamMember objects

### Get Team Member
**GET** `/team/members/{member_id}`
**Auth:** Required
**Response:** TeamMember object

### Add Team Member
**POST** `/team/members`
**Auth:** Required (Supplier only)
```json
{
  "supplier_id": 1,
  "user_id": 2,
  "role": "manager"
}
```
**Response:** Created TeamMember object (201 Created)

### Update Team Member
**PUT** `/team/members/{member_id}`
**Auth:** Required (Supplier only)
```json
{
  "role": "staff",
  "is_active": true
}
```
**Response:** Updated TeamMember object

### Remove Team Member
**DELETE** `/team/members/{member_id}`
**Auth:** Required (Supplier only)
**Response:** 204 No Content

---

## Dashboard Endpoints

### Consumer Dashboard
**GET** `/dashboard/consumer/{user_id}`
**Auth:** Required
**Response:**
```json
{
  "user_id": 1,
  "total_orders": 10,
  "completed_orders": 8,
  "pending_orders": 2,
  "total_spent": 250.50,
  "recent_orders": [ ... ],
  "favorite_suppliers": [ ... ]
}
```

### Supplier Dashboard
**GET** `/dashboard/supplier/{user_id}`
**Auth:** Required (Supplier only)
**Response:**
```json
{
  "user_id": 1,
  "supplier_id": 1,
  "supplier_name": "Green Farms",
  "total_orders": 50,
  "total_revenue": 5000.00,
  "recent_revenue": 1200.00,
  "total_products": 15,
  "low_stock_products": 3,
  "recent_orders": [ ... ],
  "top_products": [ ... ]
}
```

---

## Error Responses

All endpoints return standard error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Token is obtained from the `/token` endpoint after login.

---

## Pagination

List endpoints support pagination with query parameters:
- `skip`: Number of items to skip (default: 0)
- `limit`: Number of items to return (default: 10)

Example:
```
GET /products?skip=20&limit=10
```

---

## Filtering

Some endpoints support filtering:

### Products
- `category`: Filter by category
- `search`: Search by name or description

### Orders
- `status`: Filter by status (processing, in-transit, delivered, cancelled)

### Suppliers
- `category`: Filter by category
- `search`: Search by name or description

### Messages
- `status`: Filter by status (pending, accepted, rejected)

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Data Models

### User
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "consumer",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Product
```json
{
  "id": 1,
  "name": "Organic Tomatoes",
  "description": "Fresh organic tomatoes",
  "category": "Vegetables",
  "price": 4.99,
  "unit": "kg",
  "stock": 100,
  "min_order": 5,
  "supplier_id": 1,
  "is_active": true,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Order
```json
{
  "id": 1,
  "user_id": 1,
  "supplier_id": 1,
  "status": "processing",
  "total_amount": 49.95,
  "shipping_address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip_code": "10001",
  "items": [ ... ],
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Supplier
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Green Farms",
  "description": "Organic vegetables supplier",
  "category": "Vegetables",
  "location": "California",
  "rating": 4.5,
  "review_count": 128,
  "verified": true,
  "response_time": "2 hours",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. This should be added for production.

---

## CORS

CORS is configured to allow requests from the frontend. Update `main.py` to restrict origins in production.

---

## API Versioning

All endpoints are under `/api` prefix. Future versions can use `/api/v2`, etc.
