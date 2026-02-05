# Kafka Spec (Phase V)

## Broker Choice
- Redpanda Cloud (Kafka compatible), serverless

## Topics (minimum)
- task-events
- reminders

## Event Types (minimum)
- task.created
- task.updated
- task.completed
- task.deleted
- reminder.triggered

## Schema (minimal required fields)
- event_name
- occurred_at
- producer
- data (task snapshot)

## Proof
- backend publishes at least one event
- worker consumes at least one event
- logs captured on Minikube and on Cloud
