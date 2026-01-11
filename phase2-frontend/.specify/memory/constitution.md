# Nimbus Phase 2 Frontend — Constitution (Non-Negotiable Laws)

## 1) Spec-Driven Law
- No feature work begins without a written spec in `.specify/specs/`.
- Every spec must include: goal, scope, acceptance criteria, test/evidence checklist.

## 2) Single API Boundary Law
- UI components MUST NOT call `fetch()` directly.
- All network calls go through one boundary module: `lib/services/apiClient.ts`.

## 3) Single Token Authority Law
- Token read/write/clear occurs only in `lib/services/auth.ts`.
- Requests attach token as `Authorization: Bearer <token>`.

## 4) Owner-Only Behavior Law
- The frontend must behave as owner-only:
  - list shows only current user’s tasks
  - “not found” and “not yours” are treated the same UI-wise (404 style behavior)
- Never show or hint other users’ tasks.

## 5) UI State Law
Every async screen must have:
- Loading state
- Error state
- Empty state

## 6) Input Validation Law
Task title must be:
- trimmed
- non-empty
- <= max length (use 80 unless backend differs)
UI must show a friendly validation message.

## 7) Evidence Law
For every spec, store proof:
- screenshot(s) in `evidence/screenshots/`
- and/or log snippets in `evidence/logs/`
Naming must match the spec id (e.g., `020-...`).

## 8) Don’t Break Working Code Law
Changes must be incremental:
- add adapters/wrappers instead of rewriting working flows
- prefer small commits aligned to specs
