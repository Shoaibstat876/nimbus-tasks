# Hackathon 2 — Phase 1 Constitution

## Core Principles (Phase-1 Only)

### 1. Spec-First (Non-Negotiable)
- Every feature must be defined in `spec.md` before coding.
- If implementation conflicts with spec, the spec is corrected first.
- No manual “vibe coding”.

### 2. Reusable Skills Over Monolithic Code
- Business logic lives in reusable skills under `skills/`.
- `app.py` handles input/output only.
- Skills must not perform `input()` or `print()`.

### 3. In-Memory Only
- No database.
- No files.
- All state resets on app restart.
- This behavior is intentional and correct.

### 4. Minimal Scope Discipline
- Only commands required by Phase-1 are implemented.
- No web, no auth, no AI, no Docker, no cloud.

### 5. Teacher Rules Supremacy
- Teacher instructions override all internal ideas.
- Extra architecture must not interfere with grading.

## Governance
This constitution applies **only to Phase-1**.  
Future phases may introduce stricter rules.

**Version:** 1.0  
**Scope:** Hackathon-2 Phase-1 only
