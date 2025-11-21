# Troubleshooting Guide

## Backend Issues

### 1. SQLAlchemy Mapper Initialization Error ✅ FIXED
**Error:**
```
sqlalchemy.exc.InvalidRequestError: One or more mappers failed to initialize
Could not determine join condition between parent/child tables on relationship
```

**Cause:** Missing foreign keys in child models

**Solution:** ✅ Already fixed - Added `supplier_id` to Product and Order models

---

### 2. Backend Won't Start
**Error:**
```
ERROR: Application startup failed
```

**Solutions:**
1. Check if port 8000 is already in use:
   ```bash
   netstat -ano | findstr :8000  # Windows
   lsof -i :8000  # Mac/Linux
   ```

2. Kill existing process and restart:
   ```bash
   # Windows
   taskkill /PID <PID> /F
   
   # Mac/Linux
   kill -9 <PID>
   ```

3. Reinitialize database:
   ```bash
   python init_db.py
   ```

4. Restart backend:
   ```bash
   python3 run.py
   ```

---

### 3. Database Connection Error
**Error:**
```
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) could not connect to server
```

**Solutions:**
1. Verify PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

4. Create database if missing:
   ```bash
   python init_db.py
   ```

---

### 4. Admin User Not Created
**Error:**
```
Login fails with admin@example.com / admin123
```

**Solutions:**
1. Check if admin user exists:
   ```bash
   psql -U postgres -d supply_chain
   SELECT * FROM users WHERE email = 'admin@example.com';
   ```

2. Create admin manually:
   ```bash
   python -c "
   from app.database.database import SessionLocal
   from app.models import User
   from app.core.security import get_password_hash
   
   db = SessionLocal()
   admin = User(
       email='admin@example.com',
       hashed_password=get_password_hash('admin123'),
       full_name='Admin User',
       role='admin',
       is_active=True
   )
   db.add(admin)
   db.commit()
   print('Admin user created')
   "
   ```

---

## Frontend Issues

### 1. CORS Error
**Error:**
```
Access to XMLHttpRequest at 'http://localhost:8000/api/token' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Cause:** Backend CORS configuration doesn't include frontend origin

**Solution:** ✅ Already fixed - Updated CORS in `main.py` to include:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

**Verify:**
```python
# In app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 2. Login Fails with Network Error
**Error:**
```
Login error: {message: 'Network error. Please check your connection.', status: 0}
```

**Causes & Solutions:**

1. **Backend not running:**
   ```bash
   # Start backend
   cd backend
   python3 run.py
   ```

2. **Wrong API URL:**
   - Check `src/config.js`
   - Should be `http://localhost:8000/api`

3. **CORS issue:**
   - Check browser console for CORS error
   - Verify CORS configuration in backend

4. **Database issue:**
   - Check if user exists in database
   - Verify admin user was created

---

### 3. Products Not Loading
**Error:**
```
No items found matching your search
```

**Causes & Solutions:**

1. **Backend not running:**
   ```bash
   python3 run.py
   ```

2. **No products in database:**
   - Create products via API or manually
   - Check database: `SELECT * FROM products;`

3. **API endpoint issue:**
   - Verify endpoint: `GET /api/products`
   - Check network tab in DevTools

4. **Service error:**
   - Check browser console for errors
   - Verify productService is imported correctly

---

### 4. Orders Not Loading
**Error:**
```
No orders found
```

**Causes & Solutions:**

1. **User not authenticated:**
   - Login first
   - Check token in localStorage

2. **No orders for user:**
   - Create an order first
   - Check database: `SELECT * FROM orders WHERE user_id = 1;`

3. **Backend issue:**
   - Check backend logs
   - Verify orderService endpoint

---

### 5. Frontend Won't Start
**Error:**
```
Port 5173 already in use
```

**Solutions:**
1. Kill existing process:
   ```bash
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -i :5173
   kill -9 <PID>
   ```

2. Use different port:
   ```bash
   npm run dev -- --port 3000
   ```

---

## Database Issues

### 1. Database Already Exists
**Error:**
```
psycopg2.errors.DuplicateDatabase: database "supply_chain" already exists
```

**Solution:**
```bash
# Drop and recreate
python init_db.py  # It will handle existing database
```

---

### 2. Table Already Exists
**Error:**
```
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.DuplicateTable)
```

**Solution:**
```bash
# Drop all tables and recreate
python -c "
from app.database.database import engine
from app import models
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)
print('Database reset')
"
```

---

### 3. Foreign Key Constraint Error
**Error:**
```
sqlalchemy.exc.IntegrityError: (psycopg2.errors.ForeignKeyViolation)
```

**Solution:**
- Ensure parent record exists before creating child record
- Example: Create user before creating product with user_id

---

## Common Workflows

### Full Reset
```bash
# 1. Stop backend and frontend
# Ctrl+C in both terminals

# 2. Reset database
cd backend
python -c "
from app.database.database import engine
from app import models
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)
print('Database reset')
"

# 3. Restart backend
python3 run.py

# 4. In new terminal, restart frontend
cd frontend
npm run dev
```

### Test Login
```bash
# 1. Verify backend is running
curl http://localhost:8000/api/health

# 2. Test login endpoint
curl -X POST http://localhost:8000/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=admin123"

# 3. Should return access_token
```

### Test Product Endpoint
```bash
# Get all products
curl http://localhost:8000/api/products

# Search products
curl "http://localhost:8000/api/products?search=tomato"

# Filter by category
curl "http://localhost:8000/api/products?category=vegetables"
```

---

## Debug Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] PostgreSQL running
- [ ] Database `supply_chain` exists
- [ ] Admin user created (admin@example.com)
- [ ] CORS configured correctly
- [ ] API URL correct in frontend config
- [ ] Token stored in localStorage after login
- [ ] Network tab shows successful API calls
- [ ] Browser console has no errors

---

## Getting Help

### Check Logs
```bash
# Backend logs
# Look for errors in terminal where `python3 run.py` is running

# Frontend logs
# Open browser DevTools (F12)
# Check Console tab for errors
# Check Network tab for failed requests
```

### Verify Endpoints
```bash
# Health check
curl http://localhost:8000/api/health

# API docs
# Visit http://localhost:8000/api/docs
# Try endpoints in Swagger UI
```

### Check Database
```bash
# Connect to database
psql -U postgres -d supply_chain

# List tables
\dt

# Check users
SELECT * FROM users;

# Check products
SELECT * FROM products;

# Check orders
SELECT * FROM orders;
```

---

## Summary

✅ **Backend:** All SQLAlchemy errors fixed
✅ **CORS:** Configured for frontend origins
✅ **Database:** Relationships properly established
✅ **Frontend:** Services integrated with axios
✅ **Components:** Connected to real API

If issues persist, check the debug checklist and verify all services are running correctly.

---

**Last Updated:** November 17, 2025
**Status:** ✅ Ready for testing
