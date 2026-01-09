# tests/conftest.py

import os
from pathlib import Path


# ============================================================
# Test environment (must be set BEFORE importing app modules)
# ============================================================

TEST_DB = Path(__file__).resolve().parent / "test.db"
TEST_DB.unlink(missing_ok=True)  # clean slate each test run

os.environ.setdefault("DATABASE_URL", f"sqlite:///{TEST_DB.as_posix()}")
os.environ.setdefault("JWT_SECRET", "test-secret-key-12345")
os.environ.setdefault("JWT_ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

TEST_EMAIL = "test.user@example.com"
TEST_PASSWORD = "testpass123"


def pytest_configure():
    """
    Test DB bootstrap + seed user.
    Evidence Gate: keeps tests deterministic and repeatable.
    """
    # Import AFTER env vars are set (important because auth/database fail-fast)
    import app.models  # noqa: F401 (register SQLModel metadata)

    from sqlmodel import Session, select

    from app.auth import hash_password
    from app.database import create_db_and_tables, engine
    from app.models import User

    create_db_and_tables()

    # seed one user in test DB
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == TEST_EMAIL)).first()
        if not existing:
            u = User(email=TEST_EMAIL, hashed_password=hash_password(TEST_PASSWORD))
            session.add(u)
            session.commit()

    # expose credentials to tests
    os.environ["TEST_USER_EMAIL"] = TEST_EMAIL
    os.environ["TEST_USER_PASSWORD"] = TEST_PASSWORD
