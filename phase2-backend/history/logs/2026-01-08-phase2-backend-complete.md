\# Hackathon 2 – Phase 2 Backend Completion Log

Date: 2026-01-08

Project: Nimbus Tasks API

Author: Muhammad Shoaib



\## Objective

Build a secure FastAPI backend with authentication, task CRUD, ownership enforcement, and automated testing using pytest.



\## Environment

\- Python 3.12

\- FastAPI

\- SQLModel + SQLite

\- Pytest

\- OAuth2 Password Flow (JWT)



\## Backend Implementation

\- Auth routes implemented:

&nbsp; - POST /api/auth/login

&nbsp; - GET /api/auth/me

\- Task routes implemented:

&nbsp; - Create task

&nbsp; - List tasks (user-owned only)

&nbsp; - Update task

&nbsp; - Toggle completion

&nbsp; - Delete task

\- Ownership enforced at query level (user\_id match)

\- Database initialized on startup



\## Testing Strategy

Created automated tests under `tests/` using pytest.



\### Health Tests

\- test\_health.py

\- Verified `/api/health` returns `{ "ok": true }`



\### Auth Tests

\- test\_auth.py

\- Invalid login returns 400/401

\- Protected endpoint `/api/auth/me` rejects unauthenticated access

\- Seeded test user allows successful login and token usage



\### Task Tests

\- test\_tasks.py

\- Full CRUD flow tested:

&nbsp; - Create

&nbsp; - List

&nbsp; - Update

&nbsp; - Toggle

&nbsp; - Delete

\- Ownership verified

\- All tests passing



\## Test Commands Used

```bash

python -m pytest -q



