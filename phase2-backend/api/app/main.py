# app/main.py

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import create_db_and_tables
from .routes.auth_routes import router as auth_router
from .routes.health import router as health_router
from .routes.tasks import router as tasks_router


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
# CORS CONFIGURATION (Frontend ↔ Backend Bridge)
# ============================================================
# Allows Next.js frontend (localhost:3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Routers (Architectural Purity: all under /api)
# ============================================================
app.include_router(health_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
