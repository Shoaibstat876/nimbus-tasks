# Phase II Tasks — Checklist (YES/DONE Gate Driven)

## L2 — Backend + DB
- [ ] DONE: Create SQLModel models for Task (and User if needed)
- [ ] DONE: Configure Neon DB connection (SSL)
- [ ] DONE: DB migration/creation strategy defined (auto-create acceptable if teacher-safe)
- [ ] DONE: Implement CRUD endpoints for tasks
- [ ] DONE: Verify via Swagger (/docs)
- [ ] DONE: Proof: data persists after server restart

## L2.2 — Authentication (Hard Blocker)
- [ ] DONE: Choose minimal auth approach (teacher-safe)
- [ ] DONE: Implement login/logout/me
- [ ] DONE: Protect /api/tasks routes
- [ ] DONE: Ensure tasks scoped to user OR protected correctly
- [ ] DONE: Proof: unauthorized requests blocked

## L2.1 — Frontend Integration (Reuse apps/web)
- [ ] DONE: Point frontend to FastAPI base URL
- [ ] DONE: Replace mock/local state persistence with API calls
- [ ] DONE: CRUD flows working end-to-end
- [ ] DONE: Refresh-safe behavior confirmed

## L3 — Wizard UX
- [ ] DONE: First-run wizard pages/components exist
- [ ] DONE: Wizard guides user through first task + complete + filter
- [ ] DONE: Wizard ends in main app cleanly

## L3.1 — Design System Polish
- [ ] DONE: Consistent UI components (inputs/buttons)
- [ ] DONE: Toast/error handling everywhere
- [ ] DONE: No broken layouts

## Final Gate
- [ ] DONE: Phase II Gate Checklist is 100% checked
- [ ] DONE: Demo video recorded
- [ ] DONE: README updated with run steps
- [ ] DONE: Submission form updated
- [ ] DONE: Phase II frozen forever
