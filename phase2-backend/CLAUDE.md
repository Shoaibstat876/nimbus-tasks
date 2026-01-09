# Nimbus Phase 2 Backend — Operating Rules & Phase 2 Guide

This repository is governed by `.specify/`.

## Single Source of Truth
- Read first: `.specify/README.md`
- Long-term context: `.specify/memory/project-memory.md`
- Decisions: `.specify/memory/decisions.md`
- Templates: `.specify/templates/`

## Non-Negotiable Workflow (Always)
1) Spec first (use `.specify/templates/spec-template.md`)
2) Plan from spec
3) Implement only what spec allows
4) Run tests
5) Save evidence (logs/screenshots)
6) Write a checkpoint in `history/logs/`

## Evidence Requirement
Every completed gate must have evidence under:
- `api/evidence/logs/`
- `api/evidence/screenshots/`
- `history/logs/`

## Rules of Change
- No refactors or new structure unless a spec exists.
- If something conflicts: teacher rules win.

---

# Phase 2: Build & Run

## Build & Run Commands
- **Activate Environment**
  `.\.venv\Scripts\Activate.ps1`

- **Run Server**
  `uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --env-file .env`

- **Swagger UI**
  `http://127.0.0.1:8000/docs`

## API Endpoints

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register` — Create new user
- `POST /api/auth/login` — Obtain JWT token
- `GET /api/auth/me` — Get current authenticated user

### Tasks (JWT Required)
- `GET /api/tasks` — List user tasks
- `POST /api/tasks` — Create new task
- `PUT /api/tasks/{task_id}` — Update task title
- `PATCH /api/tasks/{task_id}/toggle` — Toggle completion status
- `DELETE /api/tasks/{task_id}` — Delete task

## Core Rules (Runtime + Security)
- All task routes require a valid **Bearer token**
- Ownership is strictly enforced (`task.user_id == current_user.id`)
- Task title is required
- Unauthorized or non-owned access returns **404**

## Testing
Run automated tests:
`pytest -q`
