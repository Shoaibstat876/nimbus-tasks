from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.services.event_publisher import invoke_worker_ping, try_read_dapr_secret, emit_reminder_triggered
from app.database import get_session
from app.models import Task
from app.routes.auth_routes import get_current_user
from app.models import User

router = APIRouter(prefix="/api", tags=["internal"])


@router.post("/reminder-cron")
async def reminder_cron(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    LOCKED behavior:
    Scan tasks where: remind_at <= now AND reminded_at IS NULL AND is_completed=false
    Set reminded_at = now (UTC) and commit
    Publish reminder.triggered to reminders
    Response: { ok:true, scanned:N, published:M }
    """
    now = datetime.now(timezone.utc)

    stmt = (
        select(Task)
        .where(Task.user_id == current_user.id)
        .where(Task.is_completed.is_(False))
        .where(Task.remind_at.is_not(None))
        .where(Task.remind_at <= now)
        .where(Task.reminded_at.is_(None))
    )

    tasks = session.exec(stmt).all()
    scanned = len(tasks)
    published = 0

    for t in tasks:
        t.reminded_at = now
        session.add(t)

    session.commit()

    for t in tasks:
        try:
            ok = await emit_reminder_triggered(t)
            if ok:
                published += 1
        except Exception:
            pass

    return {"ok": True, "scanned": scanned, "published": published}


@router.get("/internal/invoke-worker")
async def invoke_worker():
    ok = await invoke_worker_ping()
    return {"ok": bool(ok)}


@router.get("/internal/secret-proof")
async def secret_proof():
    ok = await try_read_dapr_secret("phase5-proof")
    return {"ok": bool(ok)}
