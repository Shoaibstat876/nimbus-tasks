# 🏛️ NIMBUS — PHASE V MASTER SPEC (Teacher-Exact)

**Repo:** nimbus-tasks (monorepo)  
**Phase:** V — Advanced Cloud Deployment  
**Must Include:** Intermediate + Advanced Todo features, Kafka, Full Dapr, Minikube + Cloud K8s, CI/CD, Proof  
**This file wins any conflict.**

---

## 1) Objective (Judge-Safe)
Phase V implements Intermediate and Advanced Todo features and delivers a cloud-native, event-driven deployment using Kafka + Full Dapr, deployed on Minikube and on a managed cloud Kubernetes cluster, with CI/CD and a ≤90s demo.

---

## 2) Required Feature Set
### Intermediate (must implement)
- Priorities
- Tags/Categories
- Search & Filter
- Sort

### Advanced (must implement)
- Due Dates & Reminders
- Recurring Tasks

---

## 3) Event-Driven Requirements (must implement)
- Kafka-compatible broker (Recommended: Redpanda Cloud)
- Publish events for task lifecycle:
  - task.created
  - task.updated
  - task.completed
  - task.deleted
- Reminders must be triggered asynchronously (cron binding acceptable)

---

## 4) Full Dapr Requirements (must implement on Minikube AND Cloud)
- Pub/Sub (Kafka abstraction)
- State (minimal allowed)
- Bindings (cron)
- Secrets (kubernetes secret store)
- Service Invocation (at least one real invocation OR explicit use in architecture + demoed endpoint path)

---

## 5) Deployment Requirements
### Local (Minikube)
- Install Dapr on Minikube
- Deploy app with Helm
- Apply Dapr components
- Demonstrate pub/sub + binding + secret usage (logs proof acceptable)

### Cloud (Managed K8s)
- DOKS (preferred) or GKE/AKS
- Install Dapr on cluster
- Deploy app with Helm (reuse Phase IV charts)
- Ingress has public address
- Demonstrate same Phase V behaviors on cloud

---

## 6) CI/CD Requirements (Light but real)
- GitHub Actions workflow builds and pushes images (backend required, frontend optional)
- Registry: GHCR preferred
- Manual helm upgrade is allowed

---

## 7) Completion Criteria (All must be true)
- Feature set complete (intermediate + advanced)
- Kafka + events are real (producer + consumer proof)
- Full Dapr in both environments (local + cloud) with proof
- Minikube works
- Cloud works with public ingress
- CI/CD workflow green + image published
- README updated with exact runbook
- Demo video ≤ 90 seconds
