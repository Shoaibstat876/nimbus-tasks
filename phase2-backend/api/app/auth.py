# app/auth.py

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

# ============================================================
# Password hashing (stable)
# ============================================================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _get_env_str(name: str, default: str = "") -> str:
    """
    Read a string env var and strip whitespace.
    """
    return os.getenv(name, default).strip()


def _require_env_str(name: str) -> str:
    """
    Read a required env var. Raises RuntimeError if missing/empty.
    """
    value = _get_env_str(name)
    if not value:
        raise RuntimeError(f"{name} is missing in environment (.env)")
    return value


def _get_env_int(name: str, default: int) -> int:
    """
    Read an integer env var. Raises RuntimeError if not an integer.
    """
    raw = _get_env_str(name, str(default))
    try:
        return int(raw)
    except ValueError:
        raise RuntimeError(f"{name} must be an integer, got: {raw!r}")


# ============================================================
# JWT configuration (loaded once at import; fail-fast)
# ============================================================
JWT_SECRET = _require_env_str("JWT_SECRET")
JWT_ALGORITHM = _get_env_str("JWT_ALGORITHM", "HS256")
EXPIRE_MINUTES = _get_env_int("ACCESS_TOKEN_EXPIRE_MINUTES", 1440)

if JWT_ALGORITHM not in {"HS256", "HS384", "HS512"}:
    raise RuntimeError(f"JWT_ALGORITHM must be HS256/HS384/HS512, got: {JWT_ALGORITHM!r}")

if EXPIRE_MINUTES <= 0:
    raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES must be > 0")


# ============================================================
# Password helpers (Auth gate)
# ============================================================
def hash_password(password: str) -> str:
    """
    Hash a plaintext password for storage.
    """
    password = (password or "").strip()
    if not password:
        raise ValueError("Password is required")
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    """
    Verify plaintext password against a stored hash.
    Returns False on any invalid input.
    """
    if not password or not hashed:
        return False
    return pwd_context.verify(password, hashed)


# ============================================================
# Token helpers (Auth gate)
# ============================================================
def create_access_token(subject: str) -> str:
    """
    Create a JWT access token with:
      - sub: subject (we use user_id as string)
      - iat: issued-at (unix seconds)
      - exp: expiry (unix seconds)
    """
    subject = (subject or "").strip()
    if not subject:
        raise ValueError("Token subject is required")

    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=EXPIRE_MINUTES)

    payload = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> Optional[str]:
    """
    Decode JWT and return subject (sub) if valid, otherwise None.
    """
    token = (token or "").strip()
    if not token:
        return None

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        sub = payload.get("sub")
        return str(sub) if sub else None
    except JWTError:
        return None
