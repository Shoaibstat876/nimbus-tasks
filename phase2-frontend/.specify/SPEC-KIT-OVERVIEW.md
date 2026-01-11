# Nimbus Phase 2 — Spec-Kit Compliance Overview (No Vibe Coding)

This repo follows Spec-Driven Development for Phase 2. Work is executed as:
**Spec → Implement → Evidence → Checkpoint/ADR (if needed)**.

## 1) Governing Documents (Source of Truth)
- **Constitution:** `.specify/memory/constitution.md`
  - Non-negotiable laws: API boundary, token authority, owner-only UX, UI states, validation, evidence, incremental change.
- **Specs:** `.specify/specs/`
  - 010: Auth (login + token flow)
  - 020: Owner-only CRUD
  - 030: UI states + validation
  - 040: Evidence pack + DoD

## 2) How We Prevent “Vibe Coding”
Every change must satisfy:
- A written spec with acceptance criteria and evidence checklist.
- Minimal incremental diffs (adapters/wrappers over rewrites).
- Proof captured under `evidence/` with filenames matching spec IDs.

## 3) Architecture Enforcement (Laws in Code)
- **Single API Boundary (Law 2):** UI never calls `fetch()` directly.
  - All network calls go through: `lib/services/apiClient.ts`
- **Single Token Authority (Law 3):** Only auth service touches tokens.
  - Token read/write/clear only in: `lib/services/auth.ts`
- **Owner-Only UX (Law 4):** “Not yours” behaves like “not found”.
  - UI avoids leaking existence of other users’ tasks.
- **UI States (Law 5):** Every async view has Loading / Error / Empty.
- **Validation (Law 6):** Title is trimmed, required, max 80 before API call.

## 4) Evidence Protocol (What Reviewers Should Check)
Evidence is stored in:
- `evidence/screenshots/`
- `evidence/logs/`

Naming matches spec IDs:
- `010-*.png`, `020-*.png`, `030-*.png`, `040-*.txt`

Minimum proof:
- 010: login screen + success → tasks
- 020: empty → create 2 → toggle → delete
- 030: loading + error + validation (empty/too long)
- 040: build/run notes or logs

## 5) Review Map (Fast Audit)
Start here:
1) `.specify/memory/constitution.md`
2) `.specify/specs/`
3) `lib/services/auth.ts` + `lib/services/apiClient.ts`
4) UI pages (login/tasks)
5) `evidence/`
