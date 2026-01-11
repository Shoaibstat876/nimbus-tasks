# 030 — UI States + Validation

## Goal
UI never feels broken: always shows clear states and validation.

## Acceptance Criteria
- Every async view shows:
  - Loading state
  - Error state (friendly message)
  - Empty state
- Title validation:
  - trim
  - required
  - max length (80)
- Buttons disable during submit to prevent duplicates

## Evidence
- Screenshot: loading indicator
- Screenshot: validation message for empty title
- Screenshot: error state (backend down / wrong URL)

## Scope
Applies to features/specs: 010 (Auth) and 020 (Tasks CRUD).
Does not add new endpoints; only UI behavior + validation standardization.
