# app/main.py

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import create_db_and_tables
from .routes.auth_routes import router as auth_router
from .routes.chat import router as chat_router
from .routes.health import router as health_router
from .routes.tasks import router as tasks_router
from .routes.chat_history import router as chat_history_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup/shutdown lifecycle.
    Spec-aligned: create DB tables on startup.
    """
    create_db_and_tables()
    yield


app = FastAPI(
    title="Nimbus API",
    version="0.1.0",
    lifespan=lifespan,
)

# ============================================================
# CORS CONFIGURATION (VERCEL + LOCALHOST + AUTH SAFE)
# - Explicit origins (NO "*")
# - Credentials allowed (Authorization header / cookies safe)
# - Explicit methods + headers to avoid browser preflight edge-cases
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nimbus-tasks-web.vercel.app",
        "https://nimbus-tasks-web-git-main-shoaibstat876s-projects.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    # This covers ALL vercel preview domains safely
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
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
# Routers (Architectural Purity: all under /api)
# ============================================================
app.include_router(health_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(chat_history_router, prefix="/api")
