# app/main.py

from contextlib import asynccontextmanager
import json
import os
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import create_db_and_tables
from .routes.auth_routes import router as auth_router
from .routes.chat import router as chat_router
from .routes.health import router as health_router
from .routes.tasks import router as tasks_router
from .routes.chat_history import router as chat_history_router


# ============================================================
# CORS settings
# ============================================================

# We use credentials (Authorization header / cookies).
# Therefore: allow_origins cannot be "*" in browsers.
ALLOW_CREDENTIALS = True


def _parse_cors_origins(raw: str | None) -> List[str]:
    """
    Supports:
      - JSON list: '["http://nimbus.local","http://localhost:3000"]'
      - CSV:       'http://nimbus.local,http://localhost:3000'
      - Single:    'http://nimbus.local'
      - Star:      '*' (DEV convenience only; blocked when credentials are enabled)
    """
    if not raw:
        return []

    raw = raw.strip()
    if not raw:
        return []

    # DEV convenience only (NEVER valid with credentials in browsers)
    if raw == "*":
        return ["*"]

    # JSON array
    if raw.startswith("["):
        try:
            data = json.loads(raw)
            if isinstance(data, list):
                return [str(x).strip() for x in data if str(x).strip()]
        except Exception:
            pass

    # CSV fallback
    return [p.strip() for p in raw.split(",") if p.strip()]


def _default_cors_origins() -> List[str]:
    """
    Stable defaults that cover:
      - Vercel prod + known preview
      - local dev
      - minikube ingress domain
    """
    return [
        # Vercel prod + known preview
        "https://nimbus-tasks-web.vercel.app",
        "https://nimbus-tasks-web-git-main-shoaibstat876s-projects.vercel.app",
        # Local dev
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # Minikube ingress domain
        "http://nimbus.local",
    ]


def _dedupe_preserve_order(items: List[str]) -> List[str]:
    seen = set()
    out: List[str] = []
    for x in items:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out


def _effective_cors_origins() -> List[str]:
    """
    Rules:
      - Helm env (CORS_ORIGINS) is the source of truth IF non-empty.
      - If Helm sets it empty/malformed, fall back to defaults.
      - Always allow http://nimbus.local (Phase IV/V ingress).
      - If credentials are enabled, '*' is not allowed (browser rule).
    """
    env_list = _parse_cors_origins(os.getenv("CORS_ORIGINS"))
    origins = env_list if env_list else _default_cors_origins()

    # Always allow ingress host
    if "http://nimbus.local" not in origins:
        origins.append("http://nimbus.local")

    origins = _dedupe_preserve_order(origins)

    # Browser-correct safety: credentials + "*" is invalid.
    if ALLOW_CREDENTIALS and "*" in origins:
        # Fail-safe: remove "*" rather than shipping a broken CORS config.
        origins = [o for o in origins if o != "*"]

    return origins


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Nimbus API",
    version="0.1.0",
    lifespan=lifespan,
)

# ============================================================
# CORS (PERMANENT & STABLE)
#
# - Helm env (CORS_ORIGINS) is source of truth IF non-empty
# - Explicit origins only (no regex)
# - Credentials allowed (Authorization header / cookies)
# - Always permits http://nimbus.local (Phase IV/V ingress)
# - Blocks '*' when credentials are enabled (browser rule)
# ============================================================

allow_origins = _effective_cors_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=ALLOW_CREDENTIALS,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
)

# ============================================================
# Routers
# ============================================================
app.include_router(health_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(chat_history_router, prefix="/api")
