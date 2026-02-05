# Feature Spec: Search + Filter + Sort (Phase V)

## User Stories
- As a user, I can search tasks by keyword in title/description.
- As a user, I can filter by status, priority, tag, due date range.
- As a user, I can sort by created date, due date, priority, title.

## Acceptance Criteria
- API supports query parameters:
  - q (keyword)
  - status (all/pending/completed)
  - priority (low/medium/high)
  - tag (single tag filter)
  - due_before, due_after
  - sort (created_at, due_at, priority, title)
  - order (asc/desc)
- Owner-only enforcement remains intact.

## Proof
- curl calls demonstrating search/filter/sort are acceptable.
