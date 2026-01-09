# app/main.py

from contextlib import asynccontextmanager

from fastapi import FastAPI

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

# Architectural Purity: all routers mounted under /api
app.include_router(health_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
