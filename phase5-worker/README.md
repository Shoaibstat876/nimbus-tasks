# Phase 5 Worker (local-ready)

Run locally:

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001

Endpoints:
- GET /health
- POST /dapr/subscribe
- POST /events/task-events
- POST /events/reminders

No Helm edits in Step 6.
