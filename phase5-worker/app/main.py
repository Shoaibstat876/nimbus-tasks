from fastapi import FastAPI, Response
from datetime import datetime, timezone, timedelta
from .models import CloudEvent
from .database import state_get, state_put

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/dapr/subscribe")
def dapr_subscribe():
    return [
        {"pubsubname": "kafka-pubsub", "topic": "task-events", "route": "/events/task-events"},
        {"pubsubname": "kafka-pubsub", "topic": "reminders", "route": "/events/reminders"},
    ]

def bump_due(recurrence: str, occurred_at: datetime) -> datetime:
    r = (recurrence or "none").lower()
    if r == "daily":
        return occurred_at + timedelta(days=1)
    if r == "weekly":
        return occurred_at + timedelta(days=7)
    if r == "monthly":
        return occurred_at + timedelta(days=30)
    return occurred_at

@app.post("/events/task-events")
async def task_events(evt: CloudEvent):
    data = evt.data or {}
    task_id = data.get("task_id")
    occurred_at_raw = data.get("occurred_at")
    recurrence = data.get("recurrence", "none")

    # Parse occurred_at (ISO Z)
    occurred_at = datetime.now(timezone.utc)
    if isinstance(occurred_at_raw, str) and occurred_at_raw:
        occurred_at = datetime.fromisoformat(occurred_at_raw.replace("Z", "+00:00"))

    key = f"recurring:{task_id}:{occurred_at.isoformat()}"

    # Idempotency using Dapr state store (best-effort)
    try:
        if await state_get(key):
            print(f"IDEMPOTENT duplicate ignored key={key}")
            return Response(status_code=204)
        await state_put(key, "1")
    except Exception as e:
        # If state store isn't running, we still accept the event (local-ready)
        print(f"IDEMPOTENT state store unavailable: {e}")

    next_due = bump_due(str(recurrence), occurred_at)
    print(f"PROCESSED task-events task_id={task_id} recurrence={recurrence} next_due={next_due.isoformat()}")
    return Response(status_code=204)

@app.post("/events/reminders")
async def reminders(evt: CloudEvent):
    data = evt.data or {}
    task_id = data.get("task_id")
    user_id = data.get("user_id")
    remind_at = data.get("remind_at")
    print(f"REMINDER received task_id={task_id} user_id={user_id} remind_at={remind_at}")
    return Response(status_code=204)
