# Spec: <TITLE>

## Goal
Describe what we are building and why.

## Scope
### In Scope
- ...

### Out of Scope
- ...

## Requirements (Must)
- [ ] R1 ...
- [ ] R2 ...

## API Contract
### Endpoints
- METHOD PATH → request/response
- Example:
  - POST /api/auth/login → {access_token, token_type}

## Data Model
- Entities:
  - Task: id, title, is_completed, user_id, created_at, updated_at
  - User: id, email, hashed_password

## Validation Rules
- title: required, trimmed, max length: <n>

## Ownership & Security
- Every Task query must filter by current_user.id

## Acceptance Criteria (Gates)
- [ ] Swagger gate: endpoints behave as expected
- [ ] Ownership gate: other user cannot access tasks
- [ ] Tests gate: pytest green
- [ ] Evidence gate: logs saved and linked
