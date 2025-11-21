# Frontend-Backend Integration Guide

## Overview
The frontend has been connected to the backend API. All authentication, product, order, and supplier endpoints are now integrated.

---

## What Was Updated

### 1. Configuration (`src/config.js`)
- Updated `API_BASE_URL` from `http://localhost:5000/api` to `http://localhost:8000/api`
- Updated all API endpoints to match backend routes
- Added endpoints for suppliers, messages, team, and dashboard

### 2. Authentication Service (`src/services/authService.js`)
- Updated to use real backend authentication
- Login now uses form-encoded data for `/token` endpoint
- Register sends JSON data to `/register` endpoint
- Token stored in `localStorage` with key `accessToken`
- User data stored in `localStorage` with key `user`

### 3. Auth Context (`src/contexts/AuthContext.jsx`)
- Updated to use real `authService` instead of mock
- `login()` and `register()` now make actual API calls
- Added error handling and loading states
- User role is now `user?.role` (consumer/supplier/admin)

### 4. Login Component (`src/components/auth/Login.jsx`)
- Removed mock authentication
- Now calls `login()` from AuthContext
- Removed user type selector (determined by backend)
- Redirects based on user role from backend

### 5. Signup Component (`src/components/auth/Signup.jsx`)
- Removed mock registration
- Now calls `register()` from AuthContext
- Updated password validation to 8 characters minimum
- Redirects based on user role from backend

### 6. New Service Files Created
- `src/services/productService.js` - Product CRUD operations
- `src/services/orderService.js` - Order management
- `src/services/supplierService.js` - Supplier operations

---

## How to Use

### Authentication

#### Login
```javascript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { login, loading, error } = useAuth()

  const handleLogin = async () => {
    try {
      const result = await login('user@example.com', 'password123')
      console.log('Logged in:', result.user)
    } catch (err) {
      console.error('Login failed:', err.message)
    }
  }

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
    </button>
  )
}
```

#### Register
```javascript
const { register, loading, error } = useAuth()

const handleRegister = async () => {
  try {
    const result = await register(
      'newuser@example.com',
      'password123',
      'John Doe',
      'consumer'
    )
    console.log('Registered:', result.user)
  } catch (err) {
    console.error('Registration failed:', err.message)
  }
}
```

#### Logout
```javascript
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
  // User is logged out, redirect to login
}
```

### Products

#### Get All Products
```javascript
import productService from '../services/productService'

const [products, setProducts] = useState([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getProducts(0, 10, 'vegetables', 'tomato')
      setProducts(data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  fetchProducts()
}, [])
```

#### Get Single Product
```javascript
const product = await productService.getProduct(1)
```

#### Create Product (Supplier Only)
```javascript
const newProduct = await productService.createProduct({
  name: 'Organic Tomatoes',
  description: 'Fresh organic tomatoes',
  category: 'Vegetables',
  price: 4.99,
  unit: 'kg',
  stock: 100,
  min_order: 5
})
```

#### Update Product
```javascript
const updated = await productService.updateProduct(1, {
  price: 5.99,
  stock: 80
})
```

#### Delete Product
```javascript
await productService.deleteProduct(1)
```

### Orders

#### Get All Orders
```javascript
import orderService from '../services/orderService'

const orders = await orderService.getOrders(0, 10, 'processing')
```

#### Get Single Order
```javascript
const order = await orderService.getOrder(1)
```

#### Create Order
```javascript
const newOrder = await orderService.createOrder({
  supplier_id: 1,
  items: [
    { product_id: 1, quantity: 5 },
    { product_id: 2, quantity: 3 }
  ],
  shipping_address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zip_code: '10001'
})
```

#### Update Order Status
```javascript
const updated = await orderService.updateOrderStatus(
  1,
  'in-transit',
  'TRK123456'
)
```

#### Cancel Order
```javascript
const cancelled = await orderService.cancelOrder(1)
```

### Suppliers

#### Get All Suppliers
```javascript
import supplierService from '../services/supplierService'

const suppliers = await supplierService.getSuppliers(0, 10, 'vegetables', 'green')
```

#### Get Single Supplier
```javascript
const supplier = await supplierService.getSupplier(1)
```

#### Send Link Request
```javascript
const request = await supplierService.sendLinkRequest(
  1,  // supplier_id
  2,  // user_id
  'I would like to connect'  // message
)
```

#### Get User's Link Requests
```javascript
const requests = await supplierService.getUserLinkRequests(2, 'pending')
```

#### Get Supplier's Link Requests
```javascript
const requests = await supplierService.getSupplierLinkRequests(1, 'pending')
```

#### Update Link Request
```javascript
const updated = await supplierService.updateLinkRequest(1, 'accepted')
```

---

## Component Integration Examples

### SearchItems Component
```javascript
import { useEffect, useState } from 'react'
import productService from '../services/productService'

export const SearchItems = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const data = await productService.getProducts(
          0,
          10,
          category || undefined,
          searchTerm || undefined
        )
        setItems(data)
      } catch (err) {
        console.error('Failed to fetch items:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [searchTerm, category])

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search items..."
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="vegetables">Vegetables</option>
        <option value="fruits">Fruits</option>
      </select>
      
      {loading && <p>Loading...</p>}
      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>${item.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### Orders Component
```javascript
import { useEffect, useState } from 'react'
import orderService from '../services/orderService'

export const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('processing')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await orderService.getOrders(0, 10, filter)
        setOrders(data)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [filter])

  const handleCancel = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId)
      // Refresh orders
      const data = await orderService.getOrders(0, 10, filter)
      setOrders(data)
    } catch (err) {
      console.error('Failed to cancel order:', err)
    }
  }

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="processing">Processing</option>
        <option value="in-transit">In Transit</option>
        <option value="delivered">Delivered</option>
      </select>

      {loading && <p>Loading...</p>}
      {orders.map((order) => (
        <div key={order.id}>
          <h3>Order #{order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total_amount}</p>
          {order.status === 'processing' && (
            <button onClick={() => handleCancel(order.id)}>Cancel</button>
          )}
        </div>
      ))}
    </div>
  )
}
```

### SearchSuppliers Component
```javascript
import { useEffect, useState } from 'react'
import supplierService from '../services/supplierService'

export const SearchSuppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true)
        const data = await supplierService.getSuppliers(
          0,
          10,
          undefined,
          searchTerm || undefined
        )
        setSuppliers(data)
      } catch (err) {
        console.error('Failed to fetch suppliers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [searchTerm])

  const handleConnect = async (supplierId) => {
    try {
      await supplierService.sendLinkRequest(supplierId, 1, 'I would like to connect')
      alert('Link request sent!')
    } catch (err) {
      console.error('Failed to send link request:', err)
    }
  }

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search suppliers..."
      />

      {loading && <p>Loading...</p>}
      {suppliers.map((supplier) => (
        <div key={supplier.id}>
          <h3>{supplier.name}</h3>
          <p>{supplier.description}</p>
          <p>Rating: {supplier.rating}/5</p>
          <button onClick={() => handleConnect(supplier.id)}>Connect</button>
        </div>
      ))}
    </div>
  )
}
```

---

## Error Handling

All service functions throw errors that can be caught:

```javascript
try {
  const result = await productService.getProducts()
} catch (error) {
  console.error('Error:', error.message)
  // Handle error - show toast, alert, etc.
}
```

Common errors:
- `401 Unauthorized` - Token expired or missing
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Token Management

The token is automatically:
- Stored in `localStorage` after login
- Sent with every authenticated request
- Cleared on logout or 401 response

To get the current token:
```javascript
import { JWT_CONFIG } from '../config'

const token = localStorage.getItem(JWT_CONFIG.ACCESS_TOKEN_KEY)
```

---

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000/api
```

Or use the default: `http://localhost:8000/api`

---

## Testing the Integration

### 1. Start Backend
```bash
cd backend
python -m uvicorn app.main:app --reload
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Login
- Go to http://localhost:5173/login
- Use credentials from backend (admin@example.com / admin123)
- Should redirect to dashboard

### 4. Test Products
- Go to `/consumer/search-items`
- Should load products from backend

### 5. Test Orders
- Go to `/consumer/orders`
- Should load user's orders from backend

### 6. Test Suppliers
- Go to `/consumer/search-suppliers`
- Should load suppliers from backend

---

## Remaining Components to Integrate

The following components still need API integration:

1. **ItemManagement.jsx** - Connect to product CRUD
2. **Checkout.jsx** - Connect to order creation
3. **Chat.jsx** - Connect to messaging endpoints
4. **TeamManagement.jsx** - Connect to team endpoints
5. **Dashboard.jsx** - Connect to dashboard endpoints
6. **LinkRequests.jsx** - Connect to link request endpoints

---

## Next Steps

1. **Integrate remaining components** using the service files
2. **Add error boundaries** for better error handling
3. **Add loading skeletons** for better UX
4. **Add form validation** before API calls
5. **Add success notifications** for user feedback
6. **Implement pagination** for list endpoints
7. **Add caching** for frequently accessed data
8. **Implement real-time updates** with WebSocket for messages

---

## Troubleshooting

### CORS Error
- Ensure backend is running on `http://localhost:8000`
- Check that CORS is enabled in backend (`main.py`)

### 401 Unauthorized
- Token may have expired
- Try logging out and logging back in
- Check that token is being sent in Authorization header

### 404 Not Found
- Check that endpoint URL is correct
- Verify backend is running
- Check API_ENDPOINTS in `config.js`

### Network Error
- Ensure backend server is running
- Check network tab in browser DevTools
- Verify API_BASE_URL is correct

---

## Summary

✅ Authentication fully integrated
✅ Product endpoints connected
✅ Order endpoints connected
✅ Supplier endpoints connected
✅ Error handling implemented
✅ Token management implemented

The frontend is now ready to communicate with the backend!
