# Decisions (ADR-lite)

## Decision 001 — Owner-only data access
We enforce ownership at the database query level:
- select(Task).where(Task.user_id == current_user.id)
Reason: prevents accidental data leakage.

## Decision 002 — API prefix /api
All routers mounted under /api for clarity and gateway alignment.

## Decision 003 — Validation rules
At minimum:
- title is required
- title is trimmed
Optionally:
- max length (e.g., 80)
Reason: prevents empty/garbage data and keeps UI consistent.

## Decision 004 — Evidence-first submissions
Every gate must have evidence:
- swagger screenshots or curl logs
- pytest results log
- checkpoint logs in history
