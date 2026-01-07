# Phase II Spec — Full-Stack Web Todo (Teacher PDF Aligned)

## Goal (Teacher Requirement)
Build a full-stack web todo application:
- Frontend: Next.js
- Backend: FastAPI
- ORM: SQLModel
- Database: Neon Postgres (SSL)
- Points: 150
- Scope: Phase II only (NO AI, NO Docker/K8s, NO Cloud extras)

## Non-Negotiable Constraints
- Phase I (phase1-console/) is frozen — do not modify.
- Spec-Driven Development only: spec → generate → refine (no manual coding).
- UI must NOT talk directly to DB. All DB access is through API.
- Auth is minimal + teacher-safe (enough to protect data).

## Architecture (Boundary Map)
Frontend (Next.js) ↔ Backend (FastAPI) ↔ DB (Neon Postgres)
- UI is a skin
- API is the gatekeeper (business rules + auth)
- DB is memory

## Data Model (SQLModel)
Task fields (minimum):
- id: UUID or string (primary key)
- user_id: string (or UUID) (required if auth is user-scoped)
- title: string (1..80)
- is_completed: bool (default false)
- created_at: datetime
- updated_at: datetime

## API Contract (Endpoints)
Base: /api

### Auth
- POST /api/auth/register (optional if chosen)
- POST /api/auth/login
- POST /api/auth/logout
- GET  /api/auth/me

### Tasks (Protected)
- GET    /api/tasks?filter=all|active|completed
- POST   /api/tasks
- GET    /api/tasks/{id}
- PUT    /api/tasks/{id}
- DELETE /api/tasks/{id}
- PATCH  /api/tasks/{id}/toggle

Rules:
- All task operations must be scoped to the authenticated user (or protected per teacher-safe spec).
- No silent destructive actions (delete requires confirm on UI; backend returns clear errors).

## Frontend Requirements (Next.js)
Pages (minimum):
- /login (or auth entry)
- / (tasks list + create)
- /tasks/[id] (optional edit page) OR inline edit in list

Behaviors:
- CRUD uses API only
- Refresh-safe (data persists via Neon)
- Clear error handling (no crashes)

## Wizard UX (L3) — Phase II
First-run onboarding wizard (minimal but polished):
- Step 1: Welcome + short explanation
- Step 2: Create first task
- Step 3: Show how to complete & filter
- Step 4: Finish → go to main app

## Design System (L3.1) — Phase II
- Consistent spacing, buttons, inputs
- Toasts/alerts for success and errors
- Professional baseline UI (not flashy, but consistent)

## Forbidden (Until Phase III+)
- Chatbot, ChatKit, Agents SDK, MCP
- Docker, Kubernetes
- Kafka, Dapr, DOKS
- Bonus features
