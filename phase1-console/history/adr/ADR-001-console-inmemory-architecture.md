# ADR-001: Console + In-Memory Architecture

**Status**: Accepted  
**Date**: 2025-12-08  
**Scope**: Hackathon 2 – Phase 1

## Context
Phase 1 requires a minimal, testable backend without persistence or UI.

## Decision
- Use **console-based CLI**
- Maintain **in-memory task store**
- No database or external services

## Consequences
### Positive
- Fast development
- Easy reasoning
- Meets Phase 1 scope exactly

### Negative
- Data not persisted
- Not production-ready

## Alternatives Considered
- Database-backed system (rejected: overkill for Phase 1)
- Web UI (rejected: not required)
