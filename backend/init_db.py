"""
Initialize the database by creating it and running migrations.
"""
import subprocess
import sys
from sqlalchemy import create_engine, text
from app.core.config import settings

def create_database():
    """Create the database if it doesn't exist."""
    # Connect to the default postgres database
    default_url = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/postgres"
    
    try:
        engine = create_engine(default_url, isolation_level="AUTOCOMMIT")
        with engine.connect() as conn:
            # Check if database exists
            result = conn.execute(
                text(f"SELECT 1 FROM pg_database WHERE datname = '{settings.POSTGRES_DB}'")
            )
            if not result.fetchone():
                # Database doesn't exist, create it
                conn.execute(text(f"CREATE DATABASE {settings.POSTGRES_DB}"))
                print(f"✓ Database '{settings.POSTGRES_DB}' created successfully")
            else:
                print(f"✓ Database '{settings.POSTGRES_DB}' already exists")
    except Exception as e:
        print(f"✗ Error creating database: {e}")
        sys.exit(1)

def create_tables():
    """Create all tables."""
    try:
        from app.database.database import engine
        from app import models
        
        models.Base.metadata.create_all(bind=engine)
        print("✓ All tables created successfully")
    except Exception as e:
        print(f"✗ Error creating tables: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("Initializing database...")
    create_database()
    create_tables()
    print("\n✓ Database initialization complete!")
    print(f"Database: {settings.POSTGRES_DB}")
    print(f"Host: {settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}")
