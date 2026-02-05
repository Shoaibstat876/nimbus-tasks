# Feature Spec: Due Dates + Reminders (Phase V)

## User Stories
- As a user, I can set a due date/time for a task.
- As a user, I can set a reminder time.
- The system triggers reminders asynchronously (event-driven).

## Acceptance Criteria
- Task supports:
  - due_at (datetime, optional)
  - remind_at (datetime, optional)
- A scheduled process (Dapr cron binding) runs every N minutes:
  - finds tasks where remind_at <= now and not already reminded
  - publishes an event "reminder.triggered" to topic reminders
- Worker consumes reminders and performs an action:
  - log output is acceptable as proof (notification system can be stubbed)

## Idempotency
- ensure reminder is not sent twice:
  - store reminded_at OR a boolean flag
