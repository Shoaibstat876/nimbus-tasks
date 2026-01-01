# ADR-002: Skill-Based Domain Logic

**Status**: Accepted  
**Date**: 2025-12-09  

## Context
Business logic needed to be modular and testable.

## Decision
All domain actions are implemented as **isolated skills**:
- add_task
- list_tasks
- update_task
- toggle_task
- delete_task

## Consequences
### Positive
- Clean separation of concerns
- Easy reuse in agents/workflows

### Negative
- Slight boilerplate increase

## Alternatives
- Monolithic handler (rejected: poor scalability)
