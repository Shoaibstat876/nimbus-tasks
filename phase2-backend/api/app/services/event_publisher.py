from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict

import httpx


DAPR_HTTP = "http://localhost:3500"
PUBSUB = "kafka-pubsub"
TOPIC_TASK_EVENTS = "task-events"
TOPIC_REMINDERS = "reminders"
PRODUCER = "nimbus-backend"


def _utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


async def publish_event(topic: str, payload: Dict[str, Any], timeout_s: float = 2.5) -> bool:
    """Publish a single event via Dapr Pub/Sub HTTP. Safe logging only."""
    url = f"{DAPR_HTTP}/v1.0/publish/{PUBSUB}/{topic}"
    try:
        async with httpx.AsyncClient(timeout=timeout_s) as client:
            r = await client.post(url, json=payload)
            r.raise_for_status()
        # Safe log: do NOT dump payload
        print(
            f"published {payload.get('event_name')} topic={topic} "
            f"task_id={payload.get('data', {}).get('task_id')}"
        )
        return True
    except Exception as e:
        # Safe warning only
        print(f"warn: publish failed topic={topic} err={type(e).__name__}")
        return False


async def emit_task_event(event_name: str, task: Any) -> bool:
    payload = {
        "event_name": event_name,
        "occurred_at": _utc_iso(),
        "producer": PRODUCER,
        "data": {
            "task_id": getattr(task, "id", None),
            "user_id": getattr(task, "user_id", None),
            "title": getattr(task, "title", None),
            "priority": getattr(task, "priority", None),
            "tags": getattr(task, "tags", None),
            "due_at": getattr(task, "due_at", None),
            "remind_at": getattr(task, "remind_at", None),
            "recurrence": getattr(task, "recurrence", None),
            "is_completed": getattr(task, "is_completed", None),
        },
    }
    return await publish_event(TOPIC_TASK_EVENTS, payload)


async def emit_reminder_triggered(task: Any) -> bool:
    payload = {
        "event_name": "reminder.triggered",
        "occurred_at": _utc_iso(),
        "producer": PRODUCER,
        "data": {
            "task_id": getattr(task, "id", None),
            "user_id": getattr(task, "user_id", None),
            "title": getattr(task, "title", None),
            "priority": getattr(task, "priority", None),
            "tags": getattr(task, "tags", None),
            "due_at": getattr(task, "due_at", None),
            "remind_at": getattr(task, "remind_at", None),
            "recurrence": getattr(task, "recurrence", None),
            "is_completed": getattr(task, "is_completed", None),
        },
    }
    return await publish_event(TOPIC_REMINDERS, payload)


async def try_read_dapr_secret(secret_name: str = "phase5-proof", timeout_s: float = 2.5) -> bool:
    """Runtime-safe: warn only if Dapr not available."""
    url = f"{DAPR_HTTP}/v1.0/secrets/secretstore/{secret_name}"
    try:
        async with httpx.AsyncClient(timeout=timeout_s) as client:
            r = await client.get(url)
            r.raise_for_status()
        # Do not log secret value
        print(f"dapr secret read ok: {secret_name}")
        return True
    except Exception as e:
        print(f"warn: dapr secret read failed name={secret_name} err={type(e).__name__}")
        return False


async def invoke_worker_ping(app_id: str = "nimbus-worker", timeout_s: float = 2.5) -> bool:
    url = f"{DAPR_HTTP}/v1.0/invoke/{app_id}/method/internal/ping"
    try:
        async with httpx.AsyncClient(timeout=timeout_s) as client:
            r = await client.get(url)
            r.raise_for_status()
        print("invoked worker ok")
        return True
    except Exception as e:
        print(f"warn: invoke worker failed err={type(e).__name__}")
        return False
