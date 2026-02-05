# Dapr Spec (Full Dapr Required)

## Must Use (Local + Cloud)
1) Pub/Sub: pubsub.kafka
2) State: minimal state store (can be redis or postgres via component)
3) Bindings: cron binding for reminder scan
4) Secrets: secretstores.kubernetes
5) Service Invocation: at least one demonstrated invocation path

## Required Proof
- dapr installed: `kubectl get pods -n dapr-system`
- components applied: `kubectl get components -A` (or namespace components)
- pub/sub works: publish + subscribe logs
- cron triggers endpoint call
