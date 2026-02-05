# Feature Spec: Priorities + Tags/Categories (Phase V)

## User Stories
- As a user, I can set a task priority (low/medium/high).
- As a user, I can add one or more tags/categories to a task.

## Acceptance Criteria
- Create task supports priority + tags
- Update task supports changing priority + tags
- List tasks returns priority + tags fields

## Data Model
- priority: enum ["low","medium","high"] default "medium"
- tags: list[string] default []

## API
- POST/PUT accept priority + tags
- GET returns them

## UI
- Minimal UI fields are acceptable
- If UI is too risky, implement API-first and show via curl
