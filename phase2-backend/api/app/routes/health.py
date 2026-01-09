from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["health"])


class HealthOut(BaseModel):
    ok: bool


@router.get("/health", response_model=HealthOut)
def health():
    """
    Health check endpoint.
    Used for liveness / sanity verification.
    """
    return {"ok": True}
