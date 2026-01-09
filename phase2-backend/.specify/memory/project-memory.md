# Project Memory — Nimbus Phase 2 Backend

## Identity
- Project: Nimbus Tasks
- Phase: Phase 2 Backend (FastAPI + SQLModel)
- Path: D:\Shoaib Project\nimbus-tasks\phase2-backend

## Non-Negotiable Laws
- Teacher rules are supreme.
- Spec-Driven Development only (spec first; if wrong → fix spec, regenerate).
- One app evolves through phases (Nimbus = nimbus-tasks).
- No next level until gate passes (YES/DONE only).
- 3-chat rule per level: PLAN / BUILD / QA (keep changes deliberate and logged).

## Backend Contract (Stable)
- API prefix: /api
- Health: GET /api/health
- Auth: POST /api/auth/login → returns bearer token
- Tasks: owner-only CRUD under /api/tasks

## Quality Bar
- Input validation (title required, trimmed, max length if enforced).
- Ownership enforced at query level (where user_id == current_user.id).
- Consistent timestamps (created_at/updated_at).
- Tests: pytest green.
- Evidence: logs saved under evidence/ + history/logs.

## Evidence Location (Preferred)
- phase2-backend/api/evidence/
- phase2-backend/history/logs/
