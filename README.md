# Nimbus Tasks — Hackathon 2 (Phase 2) — Full-Stack Web App

## Goal (Phase 2)
Build a working, provable full-stack tasks app:
- Backend: FastAPI + SQLModel
- Auth: JWT (OAuth2 password flow)
- CRUD: User-owned tasks (owner-only enforcement)
- Proof: tests + logs + screenshots (+ optional video)

> This submission prioritizes correctness + proof over polish.

---

## What is DONE (Frozen)
### ✅ Backend Contract (FastAPI)
- Health: `GET /api/health`
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login` (Swagger OAuth2 form flow)
  - `GET /api/auth/me`
- Tasks (Owner-only):
  - `GET /api/tasks`
  - `POST /api/tasks`
  - `PUT /api/tasks/{task_id}`
  - `PATCH /api/tasks/{task_id}/toggle`
  - `DELETE /api/tasks/{task_id}`

### ✅ Owner-only Security (Key Requirement)
Ownership is enforced at the database query level:
- Every task fetch/mutation includes `where(Task.user_id == current_user.id)`
- Non-owners receive privacy-preserving **404**.

### ✅ Tests & Proof
- Pytest suite passes.
- Manual ownership attack proof (2 users, real tokens) confirms 404 behavior for non-owner update/toggle/delete and list isolation.

---

## What is NOT DONE YET (Planned Next)
- Neon PostgreSQL integration (DATABASE_URL -> Neon)
- Next.js frontend (/register, /login, /dashboard)
- Frontend ↔ backend integration (CORS + env var `NEXT_PUBLIC_API_URL`)
- Deployment (backend + frontend live URLs)
- Final proof video (optional)

---

## How to Run (Local)
### Backend
```powershell
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --env-file .env
