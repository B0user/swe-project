from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.database import engine, get_db
from . import models
from .routers import api_router
from .core.security import get_password_hash

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Supply Chain API",
    description="API for managing supply chain operations",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(api_router, prefix="/api")

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Supply Chain API is running"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the Supply Chain API",
        "docs": "/api/docs",
        "redoc": "/api/redoc"
    }

# Create first admin user if not exists
@app.on_event("startup")
def create_first_admin():
    db = next(get_db())
    try:
        admin = db.query(models.User).filter(models.User.email == "admin@example.com").first()
        if not admin:
            admin_user = models.User(
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Admin User",
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("Created default admin user: admin@example.com / admin123")
    except Exception as e:
        print(f"Error creating admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)