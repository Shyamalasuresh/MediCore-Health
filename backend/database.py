from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Supabase PostgreSQL Configuration
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:SURESHshyamala@db.expclkrnqwnhvmoadpve.supabase.co:5432/postgres")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True  # Recommended for remote DBs like Supabase to handle idle timeouts
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
