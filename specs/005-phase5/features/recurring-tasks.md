# Feature Spec: Recurring Tasks (Phase V)

## User Stories
- As a user, I can mark a task as recurring (daily/weekly/monthly).
- When I complete a recurring task, the next occurrence is created automatically.

## Acceptance Criteria
- Task supports recurrence:
  - recurrence: enum ["none","daily","weekly","monthly"] default "none"
- On task completion:
  - backend publishes event task.completed (with recurrence info)
- Worker consumes task.completed:
  - if recurrence != none, create the next task with updated due date
  - publish task.created for new task

## Proof
- Show completing a recurring task results in a new task appearing
- Logs + DB/API listing acceptable
