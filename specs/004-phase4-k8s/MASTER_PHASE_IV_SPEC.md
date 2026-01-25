# 🏛️ NIMBUS — PHASE IV MASTER SPEC
## L5 — “The Operational Sovereign”

This file is the **single source of truth** for Phase IV.
If any conflict occurs, **this file wins**.

---

## Objective (Judge-Safe)
Phase IV operationalizes the Phase III AI Todo Chatbot by containerizing the frontend and backend, packaging them with Helm charts, and deploying them on a local Kubernetes cluster (Minikube), using AI-assisted DevOps tools.

---

## Phase III Freeze Law (CRYPTOGRAPHIC)
PHASE_III_FREEZE_COMMIT = ebff69c639e7d8bce9da4252694185810267194b

Any modification after this commit to:
- phase2-backend/api/app/**
- phase2-frontend/app/**

invalidates Phase IV.

Verification commands:
- git diff --name-only PHASE_III_FREEZE_COMMIT..HEAD
- git diff --stat PHASE_III_FREEZE_COMMIT..HEAD

Expected: only Phase IV infrastructure/spec/proof files change.

---

## Non-Negotiables
- Phase III behavior must remain correct
- No new features (no UI polish, no new endpoints)
- No backend logic refactors unless deployment requires it
- No DB/schema changes (Neon remains external)
- Docker must work before Kubernetes
- Helm is required
- Proof > aesthetics

---

## One Sentence Architecture
Frontend Pod + Backend Pod + External Neon DB, packaged via Docker, orchestrated by Helm, deployed to Minikube, observed via AI DevOps tools.

---

## Forbidden Architecture (Phase IV)
- Frontend talking directly to DB
- Kubernetes Jobs/CronJobs
- StatefulSets
- In-cluster database (Postgres/MySQL)
- Optional systems (Kafka/Dapr/etc.) — deferred to Phase V+

---

## Deployment Blueprint Declaration
The folder `specs/004-phase4-k8s/` constitutes the official
**Infrastructure Automation Deployment Blueprint** for Phase IV.

This blueprint defines:
- containerization rules
- Kubernetes topology
- Helm packaging
- AI-assisted operational procedures
- verification and proof protocols

---

## Helm Chart Structure (Authoritative Choice)
Phase IV adopts **one umbrella Helm chart** for simplicity, clarity, and demo safety.

Canonical structure:
helm/
  nimbus/
    Chart.yaml
    values.yaml
    templates/
      frontend-deployment.yaml
      frontend-service.yaml
      backend-deployment.yaml
      backend-service.yaml

Rationale:
- single helm install command
- fewer moving parts
- lower demo risk
- fully compliant with Helm requirement

---

## Helm Success Definition (Measurable)
Helm is successful ONLY if ALL are true:
1) `helm install` exits with code 0
2) All pods become Running (or Completed)
3) No CrashLoopBackOff or ImagePullBackOff occurs within 60 seconds
4) Services exist and endpoints are resolvable inside cluster

Required proof commands:
- helm lint
- helm install nimbus ./helm/nimbus --namespace nimbus --create-namespace
- kubectl get pods -n nimbus -w
- kubectl get svc -n nimbus
- kubectl get events -n nimbus --sort-by=.metadata.creationTimestamp

---

## Environment & Secrets (Safe Mode)
- No secrets baked into images
- .env never committed
- env values injected via Helm values (and referenced in templates)
- Neon DB remains external (no DB pods in cluster)

Forbidden commits:
- .env, .env.local, .env.*
- values.secret.yaml
- .kube/config, .kube/
- *.pem, *.key
- *.tar, *.tar.gz
- secret manifests containing real values

---

## External Neon DB Proof Law
Phase IV must prove:
- No database pod exists in the cluster
- Backend is configured to point to Neon (external)
- Logs/describe confirm env points to Neon host (not localhost/sqlite)

Required proof:
- kubectl get pods -n nimbus
- kubectl describe pod -n nimbus <backend-pod>  (show env names; do not leak secrets)
- kubectl logs -n nimbus <backend-pod> --tail=80

---

## AI-Assisted DevOps Rule (Judge-Safe)
Phase IV follows a **spec-first, AI-assisted infrastructure workflow**.

Clarified rule:
Infrastructure artifacts (Dockerfiles, Helm charts, Kubernetes manifests) are designed from written specs first and generated or refined using AI-assisted DevOps tools (e.g., Claude Code, kubectl-ai, kagent), with evidence captured.

Manual editing is not forbidden, but AI assistance must be demonstrated with proof.

AI→Action Chain Proof must include:
1) AI prompt
2) AI diagnosis/recommendation
3) Exact action taken (kubectl/helm/docker)
4) Resulting improvement (pods Running / error resolved)

---

## Implementation Order (No Chaos)
1) Specs written (this folder)
2) Dockerfiles created
3) Docker images tested locally (docker run)
4) Helm chart written
5) Deploy to Minikube using Helm
6) Service reachability proof (minikube service)
7) AI-Ops observation + causal proof
8) Proof pack finalized
9) Demo ≤ 90 seconds

Skipping order = instability.

---

## Demo Fail-Safe Protocol
If live Minikube demo hiccups, the pre-recorded proof clips listed in `proof-checklist.md`
are the authoritative evidence for scoring.

---

## Recommended Review Order (Examiner Guidance)
MASTER_PHASE_IV_SPEC.md → proof-checklist.md → helm/ → Dockerfiles → minikube.md → aiops.md

---

## Final Seal — Conflict Resolution
If any wording in earlier Phase IV notes conflicts with this Master Spec,
this Master Spec takes precedence for judge interpretation.
