"""
Database connection and models for FinIntel using Neon PostgreSQL.
"""
import os
import json
import datetime
from pathlib import Path
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from sqlalchemy import (
    create_engine, Column, String, Float, DateTime, Text, JSON, func, text
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

# Normalize URL for SQLAlchemy with psycopg2 driver
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)

# Remove channel_binding if present as psycopg2 might not support it directly in URI query
if "channel_binding=" in DATABASE_URL:
    import re
    DATABASE_URL = re.sub(r'[?&]channel_binding=[^&]+', '', DATABASE_URL)
    if '?' not in DATABASE_URL and '&' in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace('&', '?', 1)

engine = None
SessionLocal = None
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    salt = Column(String(64), nullable=False)
    risk_profile = Column(String(32), default="balanced")
    risk_answers = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class VerdictLog(Base):
    __tablename__ = "verdict_logs"

    id = Column(String(64), primary_key=True)
    user_id = Column(String(64), index=True, nullable=True)
    ticker = Column(String(32), index=True, nullable=False)
    verdict = Column(String(16), nullable=False)  # BUY, SELL, HOLD
    confidence = Column(Float, default=0.0)
    rationale = Column(Text, nullable=True)
    price_at_verdict = Column(Float, nullable=False)
    current_price = Column(Float, nullable=True)
    alpha = Column(Float, nullable=True)
    status = Column(String(32), default="pending")  # pending, scored
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(String(64), primary_key=True)
    user_id = Column(String(64), index=True, nullable=False)
    name = Column(String(128), default="Primary Portfolio")
    holdings = Column(Text, default="[]")  # JSON string of holdings
    total_value = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class LedgerPosition(Base):
    __tablename__ = "ledger_positions"

    id = Column(String(64), primary_key=True)
    user_id = Column(String(64), index=True, nullable=False)
    ticker = Column(String(32), nullable=False)
    action = Column(String(16), nullable=False)  # BUY or SELL
    shares = Column(Float, default=0.0)
    entry_price = Column(Float, nullable=False)
    allocated_capital = Column(Float, default=100000.0)
    mark_to_market = Column(Float, nullable=True)
    alpha_vs_nifty = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


def init_db():
    global engine, SessionLocal
    if not DATABASE_URL:
        print("[DB] Warning: DATABASE_URL not set.")
        return None
    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300,
            pool_size=5,
            max_overflow=10
        )
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base.metadata.create_all(bind=engine)
        print("[DB] Neon PostgreSQL connected and tables initialized successfully.")
        return engine
    except Exception as e:
        print(f"[DB] Error connecting to Neon PostgreSQL: {e}")
        raise e


def get_db_session() -> Session:
    global SessionLocal
    if SessionLocal is None:
        init_db()
    return SessionLocal()


def get_db():
    db = get_db_session()
    try:
        yield db
    finally:
        db.close()


def test_connection() -> Dict[str, Any]:
    """Test connection and return server metadata."""
    if not DATABASE_URL:
        return {"status": "error", "message": "DATABASE_URL is missing"}
    try:
        temp_engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        with temp_engine.connect() as conn:
            result = conn.execute(text("SELECT version(), current_database(), current_user;")).fetchone()
            return {
                "status": "connected",
                "database": result[1],
                "user": result[2],
                "postgres_version": result[0]
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}
