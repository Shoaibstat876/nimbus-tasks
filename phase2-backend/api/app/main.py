from fastapi import FastAPI
from .database import create_db_and_tables
from .routes.health import router as health_router
from .routes.tasks import router as tasks_router
from .routes.auth_routes import router as auth_router

app = FastAPI(title="Nimbus API", version="0.1.0")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(health_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
