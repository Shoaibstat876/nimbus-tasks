# ADR-001: Phase-1 Console Todo Architecture

- **Status:** Accepted
- **Date:** 2025-12-27
- **Scope:** Hackathon 2 — Phase 1

## Context
Hackathon 2 Phase-1 requires a **Python in-memory console application**.
The scope is intentionally limited to validate:
- Spec-first thinking
- Clean separation of concerns
- Reusable skills/functions

No persistence, no web stack, no AI orchestration, no deployment concerns are allowed.

## Decision
We will implement a **Python console-based Todo application** with:

- In-memory storage only
- Business logic isolated into reusable skills
- A thin CLI layer for input/output
- No external services or frameworks

### Architecture Cluster
- Language: Python
- Interface: Terminal (stdin/stdout)
- Storage: In-memory (process-lifetime only)
- Structure:
  - `app.py` → CLI + command routing
  - `skills/` → reusable task operations
  - `store.py` → shared in-memory state
  - `spec.md` → source of truth

## Consequences

### Positive
- Fully aligned with teacher instructions
- Simple, testable, and easy to reason about
- Clear foundation for later phases

### Negative
- No persistence between runs
- Not production-ready (by design)

## Alternatives Considered
- File-based persistence → rejected (violates Phase-1)
- Database storage → rejected (Phase-2+ only)
- Web UI → rejected (out of scope)

## References
- Feature Spec: `spec.md`
- README: `README.md`
