from __future__ import annotations

from fastapi import APIRouter

from app.services.event_publisher import invoke_worker_ping, try_read_dapr_secret

router = APIRouter(prefix="/api/internal", tags=["internal"])


@router.get("/invoke-worker")
async def invoke_worker():
    ok = await invoke_worker_ping()
    return {"ok": bool(ok)}


@router.get("/secret-proof")
async def secret_proof():
    ok = await try_read_dapr_secret("phase5-proof")
    return {"ok": bool(ok)}
