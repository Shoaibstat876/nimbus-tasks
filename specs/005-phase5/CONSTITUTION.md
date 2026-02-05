# Phase V Constitution — Nimbus Tasks (Teacher-Exact)

## Phase V Objective
Implement Intermediate + Advanced Todo features and deliver an event-driven cloud-native architecture using Kafka + Full Dapr, deployed on Minikube and on a managed cloud Kubernetes cluster (DOKS), with CI/CD and proof.

## Non-Negotiable Laws

### Law 1 — Teacher Scope
Phase V MUST include:
- Intermediate: priorities, tags/categories, search, filter, sort
- Advanced: recurring tasks, due dates & reminders
- Kafka integration (use Redpanda Cloud preferred)
- Full Dapr: pubsub, state, bindings (cron), secrets, service invocation
- Deploy on Minikube AND cloud Kubernetes
- CI/CD build + push
- Proof + 90s demo

### Law 2 — Reuse Phase IV Helm
Phase IV Helm charts remain canonical.
We may add Phase V overlays/values and Dapr annotations, but do not rewrite the chart structure.

### Law 3 — Minimal Risk to Existing Phases
No refactors unless required for Phase V features.
No breaking Phase II/III hosted deployments.
All Phase V work happens on a dedicated Phase V branch.

### Law 4 — Secrets Zero-Leak
Never commit: kubeconfigs, tokens, .env, API keys.
Use:
- GitHub Secrets (CI)
- Kubernetes Secrets (runtime)
- Dapr secret store component

### Law 5 — Event-Driven Must Be Real
README-only explanations are not enough.
There must be a working minimal flow:
- backend publishes at least one event (e.g., task.created)
- consumer receives it (worker/log proof)
- reminder cron binding triggers a scan or event

### Law 6 — Reminders and Recurring Must Be Demonstrable
- Due date + reminder produces an event or action (log proof acceptable)
- Recurring task completion creates the next occurrence (DB proof)

### Law 7 — Proof First
For every major step, capture command logs and screenshots.
Judges watch only first 90 seconds.

## Completion Criteria (All must be true)
- Features implemented and demoable (intermediate + advanced)
- Kafka + Dapr components deployed and working (local + cloud)
- Minikube deployment works
- Cloud deployment works with public ingress
- CI/CD workflow green + images pushed
- README instructions clear
- Demo video ≤ 90 seconds
