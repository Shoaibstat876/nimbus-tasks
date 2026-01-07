# Phase II Plan — Execution Order (No Regression)

## Build Order (Must Follow)
1) Specs lock (this folder only)
2) Backend + DB (FastAPI + SQLModel + Neon) — prove persistence
3) Auth (hard blocker) — protect routes
4) Frontend connects to API (reuse existing apps/web if already present)
5) Wizard UX (L3)
6) Design system polish (L3.1)
7) Gate checklist completion + demo + submission
8) Freeze Phase II

## Proof Requirements
Backend proof:
- Neon connected (SSL)
- CRUD works via /docs (Swagger)
- Data persists after restart

Frontend proof:
- UI calls API
- Tasks persist after refresh/restart

Auth proof:
- sign-in/sign-out works
- protected routes enforced
- tasks user-scoped OR clearly protected

## “No Manual Code” Operating Mode
- Any code changes must come from:
  - spec updates → generation → refinement
- If output is wrong: fix spec first.

## Definition of Done (Gate)
Phase II is DONE only when:
- API works
- DB persists in Neon
- Auth works
- Frontend consumes API
- Wizard + design system meet spec
- Demo recorded + links submitted
Then Phase II becomes frozen forever.
