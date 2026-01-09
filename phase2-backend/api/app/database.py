# app/database.py

import os
from typing import Generator

from sqlmodel import SQLModel, Session, create_engine


# ============================================================
# Database configuration (fail-fast, spec-aligned)
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is missing. "
        "Define it in phase2-backend/api/.env"
    )


engine = create_engine(
    DATABASE_URL,
    echo=False,           # No SQL noise in production / tests
    pool_pre_ping=True,   # Safer connections
)


# ============================================================
# Lifecycle helpers
# ============================================================

def create_db_and_tables() -> None:
    """
    Create all tables defined in SQLModel metadata.
    Called once on application startup.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency-injected database session.
    One session per request.
    """
    with Session(engine) as session:
        yield session
