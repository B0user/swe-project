# Frontend API Endpoints Audit

## Overview
This document audits the frontend application to identify all required API endpoints and their current implementation status.

---

## 1. AUTHENTICATION ENDPOINTS

### Status: ✅ PARTIALLY IMPLEMENTED
Currently using mock authentication in frontend. Backend endpoints exist but need frontend integration.

| Endpoint | Method | Frontend Usage | Backend Status | Notes |
|----------|--------|----------------|----------------|-------|
| `/api/register` | POST | Signup.jsx | ✅ Implemented | User registration with email, password, name, role |
| `/api/token` | POST | Login.jsx | ✅ Implemented | OAuth2 login, returns JWT token |
| `/api/users/me` | GET | AuthContext.jsx | ❌ Not Used | Get current user profile |
| `/api/users/me` | PUT | AuthContext.jsx | ❌ Not Used | Update current user profile |

**Frontend Implementation:**
- Login.jsx: Mock authentication (setTimeout 1000ms)
- Signup.jsx: Mock registration (setTimeout 1000ms)
- AuthContext.jsx: Stores user data in context

**Required Changes:**
- Replace mock auth with actual API calls
- Store JWT token in localStorage/sessionStorage
- Add token to Authorization headers for authenticated requests

---

## 2. USER MANAGEMENT ENDPOINTS

### Status: ❌ NOT IMPLEMENTED IN FRONTEND

| Endpoint | Method | Required For | Backend Status | Frontend Status |
|----------|--------|--------------|----------------|-----------------|
| `/api/users` | GET | Admin dashboard | ✅ Implemented | ❌ Not Used |
| `/api/users/{id}` | GET | User profile view | ✅ Implemented | ❌ Not Used |
| `/api/users/{id}` | PUT | User profile edit | ✅ Implemented | ❌ Not Used |
| `/api/users/{id}` | DELETE | Admin user management | ✅ Implemented | ❌ Not Used |

**Notes:**
- No admin dashboard exists in frontend yet
- User profile editing not implemented
- User management features needed for future admin panel

---

## 3. PRODUCT ENDPOINTS

### Status: ⚠️ PARTIALLY NEEDED

| Endpoint | Method | Frontend Usage | Backend Status | Frontend Status | Priority |
|----------|--------|----------------|----------------|-----------------|----------|
| `/api/products` | GET | SearchItems.jsx | ✅ Implemented | ❌ Mock Data | HIGH |
| `/api/products?category={cat}` | GET | SearchItems.jsx | ✅ Implemented | ❌ Mock Data | HIGH |
| `/api/products?q={query}` | GET | SearchItems.jsx | ✅ Implemented | ❌ Mock Data | HIGH |
| `/api/products/{id}` | GET | Product detail view | ✅ Implemented | ❌ Not Used | MEDIUM |
| `/api/products` | POST | ItemManagement.jsx | ✅ Implemented | ❌ Mock Data | HIGH |
| `/api/products/{id}` | PUT | ItemManagement.jsx | ✅ Implemented | ❌ Mock Data | HIGH |
| `/api/products/{id}` | DELETE | ItemManagement.jsx | ✅ Implemented | ❌ Mock Data | HIGH |

**Frontend Components Using Products:**
- **SearchItems.jsx**: Lists products with filtering by category and search
  - Mock data: 3 products (Tomatoes, Bread, Salmon)
  - Features: Search, category filter, product cards with rating/location
  - Needs: Replace mockItems with API call to GET /api/products

- **ItemManagement.jsx**: Supplier product management
  - Mock data: 3 products with full details
  - Features: Add, edit, delete, search, filter by category, toggle active status
  - Needs: Integrate CRUD operations with backend

**Required Changes:**
1. SearchItems.jsx:
   - Replace mockItems with useEffect + API call
   - Add loading/error states
   - Implement pagination

2. ItemManagement.jsx:
   - Connect add/edit/delete dialogs to API
   - Add success/error notifications
   - Implement real-time updates

---

## 4. ORDER ENDPOINTS

### Status: ⚠️ PARTIALLY NEEDED

| Endpoint | Method | Frontend Usage | Backend Status | Frontend Status | Priority |
|----------|--------|----------------|----------------|-----------------|----------|
| `/api/orders` | GET | Orders.jsx | ✅ Implemented | ❌ Mock Data | HIGH |
| `/api/orders` | POST | Checkout.jsx | ✅ Implemented | ❌ Not Connected | HIGH |
| `/api/orders/{id}` | GET | Order detail view | ✅ Implemented | ❌ Not Used | MEDIUM |
| `/api/orders/{id}/status` | PUT | Order status update | ✅ Implemented | ❌ Not Used | MEDIUM |
| `/api/orders/user/{id}` | GET | User orders list | ✅ Implemented | ❌ Not Used | HIGH |

**Frontend Components Using Orders:**
- **Orders.jsx**: Consumer order history
  - Mock data: 3 orders with different statuses (processing, in-transit, delivered)
  - Features: Filter by status (Active, Completed, Cancelled), view details, cancel order, reorder
  - Needs: Replace mockOrders with API call to GET /api/orders

- **Checkout.jsx**: Order creation
  - Mock data: 3 cart items
  - Features: Multi-step checkout (Cart → Shipping → Payment → Review)
  - Needs: Connect final step to POST /api/orders

**Required Changes:**
1. Orders.jsx:
   - Replace mockOrders with useEffect + API call
   - Add loading/error states
   - Implement order status filtering
   - Add cancel order functionality

2. Checkout.jsx:
   - Connect "Place Order" button to POST /api/orders
   - Pass cart items, shipping address, payment method
   - Handle order confirmation response
   - Redirect to orders page on success

---

## 5. SUPPLIER ENDPOINTS

### Status: ❌ NOT IMPLEMENTED

| Endpoint | Method | Frontend Usage | Backend Status | Frontend Status | Notes |
|----------|--------|----------------|----------------|-----------------|-------|
| `/api/suppliers` | GET | SearchSuppliers.jsx | ❌ Not Implemented | ❌ Mock Data | Needed |
| `/api/suppliers/{id}` | GET | Supplier detail | ❌ Not Implemented | ❌ Not Used | Needed |
| `/api/suppliers/link-request` | POST | LinkRequests.jsx | ❌ Not Implemented | ❌ Not Used | Needed |

**Frontend Components:**
- **SearchSuppliers.jsx**: Browse suppliers
  - Mock data: 3 suppliers (Green Farms, Bakery Co, Seafood Direct)
  - Features: Search, filter by category, view rating/reviews
  - Needs: Backend supplier endpoints

- **LinkRequests.jsx**: Send/manage supplier link requests
  - Mock data: Link request management UI
  - Features: Send request, view pending/accepted requests
  - Needs: Backend endpoints for link requests

**Required Backend Endpoints:**
- `GET /api/suppliers` - List all suppliers with filtering
- `GET /api/suppliers/{id}` - Get supplier details
- `POST /api/suppliers/link-request` - Send link request
- `GET /api/suppliers/link-requests` - Get user's link requests
- `PUT /api/suppliers/link-requests/{id}` - Accept/reject link request

---

## 6. MESSAGING/CHAT ENDPOINTS

### Status: ❌ NOT IMPLEMENTED

| Endpoint | Method | Frontend Usage | Backend Status | Frontend Status | Notes |
|----------|--------|----------------|----------------|-----------------|-------|
| `/api/messages` | GET | Chat.jsx | ❌ Not Implemented | ❌ Mock Data | Needed |
| `/api/messages` | POST | Chat.jsx | ❌ Not Implemented | ❌ Not Used | Needed |
| `/api/conversations` | GET | Chat.jsx | ❌ Not Implemented | ❌ Mock Data | Needed |

**Frontend Components:**
- **Chat.jsx**: Messaging between users
  - Mock data: Chat messages and conversations
  - Features: Send/receive messages, conversation list
  - Needs: WebSocket or polling for real-time messages

**Required Backend Endpoints:**
- `GET /api/conversations` - List user's conversations
- `GET /api/conversations/{id}/messages` - Get messages in conversation
- `POST /api/messages` - Send message
- `WebSocket /ws/chat/{conversation_id}` - Real-time messaging (optional)

---

## 7. TEAM MANAGEMENT ENDPOINTS

### Status: ❌ NOT IMPLEMENTED

| Endpoint | Method | Frontend Usage | Backend Status | Frontend Status | Notes |
|----------|--------|----------------|----------------|-----------------|-------|
| `/api/team/members` | GET | TeamManagement.jsx | ❌ Not Implemented | ❌ Mock Data | Needed |
| `/api/team/members` | POST | TeamManagement.jsx | ❌ Not Implemented | ❌ Not Used | Needed |
| `/api/team/members/{id}` | DELETE | TeamManagement.jsx | ❌ Not Implemented | ❌ Not Used | Needed |

**Frontend Components:**
- **TeamManagement.jsx**: Supplier team management
  - Mock data: Team members list
  - Features: Add/remove team members, manage roles
  - Needs: Backend team management endpoints

---

## 8. DASHBOARD ENDPOINTS

### Status: ⚠️ PARTIALLY NEEDED

| Endpoint | Method | Frontend Usage | Backend Status | Frontend Status | Priority |
|----------|--------|----------------|----------------|-----------------|----------|
| `/api/dashboard/consumer` | GET | Consumer Dashboard | ❌ Not Implemented | ❌ Not Used | MEDIUM |
| `/api/dashboard/supplier` | GET | Supplier Dashboard | ❌ Not Implemented | ❌ Not Used | MEDIUM |

**Frontend Components:**
- **Consumer Dashboard**: Summary of recent orders, recommendations
- **Supplier Dashboard**: Sales metrics, inventory status

---

## SUMMARY TABLE

### Implementation Status Overview

| Category | Total Endpoints | Backend ✅ | Frontend ✅ | Frontend ⚠️ | Frontend ❌ |
|----------|-----------------|-----------|-----------|-----------|-----------|
| Authentication | 4 | 4 | 0 | 2 | 2 |
| Users | 4 | 4 | 0 | 0 | 4 |
| Products | 7 | 7 | 0 | 2 | 5 |
| Orders | 5 | 5 | 0 | 2 | 3 |
| Suppliers | 5 | 0 | 0 | 0 | 5 |
| Messages | 3 | 0 | 0 | 0 | 3 |
| Team | 3 | 0 | 0 | 0 | 3 |
| Dashboard | 2 | 0 | 0 | 0 | 2 |
| **TOTAL** | **33** | **25** | **0** | **6** | **27** |

---

## PRIORITY IMPLEMENTATION ORDER

### Phase 1: CRITICAL (Must Have)
1. **Authentication Integration**
   - Connect Login.jsx to `/api/token`
   - Connect Signup.jsx to `/api/register`
   - Implement JWT token storage and header injection

2. **Product Listing**
   - Connect SearchItems.jsx to `/api/products`
   - Implement search and category filtering
   - Add loading/error states

3. **Order Management**
   - Connect Orders.jsx to `/api/orders`
   - Connect Checkout.jsx to create orders
   - Implement order status filtering

### Phase 2: IMPORTANT (Should Have)
1. **Supplier Management**
   - Implement `/api/suppliers` endpoints
   - Connect SearchSuppliers.jsx
   - Implement link request system

2. **Item Management**
   - Connect ItemManagement.jsx to product CRUD
   - Implement add/edit/delete functionality

3. **User Profile**
   - Implement user profile view/edit
   - Connect to `/api/users/me`

### Phase 3: NICE TO HAVE (Could Have)
1. **Messaging System**
   - Implement chat endpoints
   - Add real-time messaging

2. **Team Management**
   - Implement team member management

3. **Dashboard Analytics**
   - Create dashboard endpoints
   - Add metrics and analytics

---

## REQUIRED BACKEND ENDPOINTS TO CREATE

### New Endpoints Needed
1. **Suppliers** (5 endpoints)
   - `GET /api/suppliers`
   - `GET /api/suppliers/{id}`
   - `POST /api/suppliers/link-request`
   - `GET /api/suppliers/link-requests`
   - `PUT /api/suppliers/link-requests/{id}`

2. **Messages** (3 endpoints)
   - `GET /api/conversations`
   - `GET /api/conversations/{id}/messages`
   - `POST /api/messages`

3. **Team** (3 endpoints)
   - `GET /api/team/members`
   - `POST /api/team/members`
   - `DELETE /api/team/members/{id}`

4. **Dashboard** (2 endpoints)
   - `GET /api/dashboard/consumer`
   - `GET /api/dashboard/supplier`

---

## FRONTEND INTEGRATION CHECKLIST

### Authentication
- [ ] Create API service/utility for auth calls
- [ ] Update Login.jsx to use real API
- [ ] Update Signup.jsx to use real API
- [ ] Implement JWT token storage
- [ ] Add Authorization header to all requests
- [ ] Implement token refresh logic
- [ ] Add logout functionality

### Products
- [ ] Create product API service
- [ ] Update SearchItems.jsx with API integration
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement pagination
- [ ] Update ItemManagement.jsx with CRUD
- [ ] Add success/error notifications

### Orders
- [ ] Create order API service
- [ ] Update Orders.jsx with API integration
- [ ] Update Checkout.jsx to create orders
- [ ] Implement order status filtering
- [ ] Add cancel order functionality
- [ ] Add order tracking

### Suppliers
- [ ] Create supplier API service
- [ ] Update SearchSuppliers.jsx
- [ ] Implement link request system
- [ ] Add supplier filtering

### Messages
- [ ] Create messaging API service
- [ ] Update Chat.jsx
- [ ] Implement real-time updates (WebSocket or polling)

### Team
- [ ] Create team API service
- [ ] Update TeamManagement.jsx
- [ ] Implement member management

---

## NOTES

1. **Mock Data**: Currently using mock data in all components. Need to replace with API calls.
2. **Error Handling**: Add try-catch and error boundaries throughout frontend.
3. **Loading States**: Implement skeleton loaders or spinners for better UX.
4. **Validation**: Add client-side validation before API calls.
5. **Caching**: Consider implementing caching for frequently accessed data.
6. **Real-time Updates**: Consider WebSocket for messages and live notifications.
7. **Pagination**: Implement pagination for list endpoints.
8. **Filtering**: Implement advanced filtering for products and orders.
