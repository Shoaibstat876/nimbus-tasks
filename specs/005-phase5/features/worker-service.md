# Phase V — Worker Service (Step 6)

## Goal
Introduce a separate worker service for Phase V event-driven behavior.
Worker is local-ready only. No Helm edits in Step 6.

## Endpoints
- GET /health -> 200 {"status":"ok"}
- POST /dapr/subscribe -> Dapr topic subscriptions
- POST /events/task-events -> handle task events (recurrence + idempotency)
- POST /events/reminders -> handle reminder events (log proof)

## Idempotency
Use Dapr State Store HTTP API (statestore).
Key: recurring:{task_id}:{occurred_at}
If key exists -> ignore duplicate.

## Recurrence increments
- daily -> +1 day
- weekly -> +7 days
- monthly -> +30 days

## Outputs / Proof
- tree of phase5-worker folder
- curl /health output
- curl /dapr/subscribe output
- curl /events/task-events twice (idempotent logs)
- curl /events/reminders (log line includes task_id,user_id,remind_at)

## Boundaries
- No Helm changes
- No backend changes
- No cloud deployment
