# Phase V — Backend publishes events + cron + secrets + invocation

## Goal
Backend must:
1) publish task lifecycle events via Dapr Pub/Sub
2) expose a cron-triggered reminder scan endpoint
3) prove Dapr secrets access (runtime-safe)
4) prove service invocation to the worker

## Constraints (LOCKED)
- Backend-only step (no Helm edits, no cloud deploy)
- Publish only after DB commit
- Safe logs only (no payload dumps, no secrets)

---

## Pub/Sub (Dapr HTTP)
Component: kafka-pubsub

Topics:
- 	ask-events
- eminders

Publish endpoints (via Dapr sidecar):
- POST http://localhost:3500/v1.0/publish/kafka-pubsub/task-events
- POST http://localhost:3500/v1.0/publish/kafka-pubsub/reminders

Minimum event payload:
- event_name
- occurred_at (UTC ISO)
- producer = "nimbus-backend"
- data: task_id, user_id, title, priority, tags, due_at, remind_at, recurrence, is_completed

Events emitted after DB commit:
- task.created
- task.updated
- task.completed
- task.deleted

---

## Cron endpoint (LOCKED)
Endpoint:
- POST /api/reminder-cron

Logic:
- Scan tasks where: remind_at <= now AND reminded_at IS NULL AND is_completed=false
- Set reminded_at = now (UTC) and commit
- Publish reminder.triggered to eminders
- Response: { ok:true, scanned:N, published:M }

---

## Secrets proof (runtime-safe)
Read via Dapr:
- GET http://localhost:3500/v1.0/secrets/secretstore/phase5-proof

Log only (no secret values):
- "dapr secret read ok: phase5-proof"

If Dapr unavailable:
- warn only, do not crash

---

## Service invocation proof (LOCKED)
Worker:
- GET /internal/ping -> { "ok": true }

Backend:
- GET /api/internal/invoke-worker
Backend invokes via Dapr:
- GET http://localhost:3500/v1.0/invoke/nimbus-worker/method/internal/ping

Log:
- "invoked worker ok"
