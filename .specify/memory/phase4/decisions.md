# Phase IV Architecture Decisions (ADR)

## ADR-001: Docker Driver for Minikube
**Decision:** Use Docker driver instead of VM.
**Reason:** Faster builds, simpler proof, judge-friendly.

## ADR-002: Same-Origin Architecture
**Decision:** Frontend and backend served under same domain via Ingress.
**Reason:** Eliminates CORS risk, production-aligned.

## ADR-003: Helm over Raw YAML
**Decision:** Helm charts are mandatory.
**Reason:** Parameterization, repeatability, professional standard.

## ADR-004: Values-Driven Configuration
**Decision:** No environment logic inside templates.
**Reason:** Clean separation of config and logic.

## ADR-005: Evidence-First Proof
**Decision:** CLI output is primary proof.
**Reason:** Screenshots alone are insufficient.

Status: ACCEPTED

---

## Phase IV — Prompt & Decision History (Audit Trail)

🔹 Stage 0 — Phase IV Entry (Planning Prompt)

Prompt Intent

“Begin Phase IV: containerize backend and frontend, deploy on local Kubernetes using Minikube, and ensure reproducible deployment.”

Decision

Phase IV scope locked to Docker + Minikube + Helm

No feature development allowed

Phase III functionality frozen

Outcome

Clear boundary between application logic and infrastructure work

🔹 Stage 1 — Backend Dockerization Prompt

Prompt Intent

“Create a production-ready backend Docker image with health check verification.”

Decision

Use multi-stage Docker build

Expose only required port

Verify /api/health before proceeding

Outcome

Backend image built and verified independently

Docker runtime confirmed stable

🔹 Stage 2 — Frontend Dockerization Prompt

Prompt Intent

“Dockerize frontend without breaking build-time environment assumptions.”

Critical Discovery

NEXT_PUBLIC_* variables are build-time, not runtime

Decision

Use relative /api paths

Avoid runtime env injection

Keep frontend logic unchanged (freeze respected)

Outcome

Frontend container runs correctly

Avoided future Kubernetes env bugs

🔹 Stage 3 — Helm Introduction Prompt

Prompt Intent

“Introduce Helm for repeatable Kubernetes deployment of frontend and backend.”

Decision

Create a single umbrella chart

Use ClusterIP services

Defer ingress until services are stable

Outcome

Helm lint passes

Templates render correctly

Images referenced consistently

🔹 Stage 4 — Minikube Cluster Prompt

Prompt Intent

“Deploy Helm chart on Minikube using Docker driver.”

Decision

Use Docker Desktop as runtime

Avoid cloud providers

Validate cluster health before app install

Outcome

Minikube cluster running

Kubernetes nodes healthy

🔹 Stage 5 — ImagePullBackOff Diagnosis Prompt (AI-Ops)

Prompt Intent

“Diagnose ImagePullBackOff errors without modifying application code.”

Discovery

Minikube cannot pull local Docker images automatically

Decision

Load images explicitly into Minikube

Keep imagePullPolicy: IfNotPresent

Outcome

Pods scheduled correctly

Containers start as expected

🔹 Stage 6 — Runtime Failure Diagnosis Prompt (Database)

Prompt Intent

“Diagnose backend crash after pod startup.”

Discovery

DATABASE_URL missing in Kubernetes environment

Decision

Create Kubernetes Secret from sanitized .env

Inject via Helm without committing secrets

Outcome

Backend pod transitions to Running

Database connectivity restored

🔹 Stage 7 — Ingress Decision Prompt

Prompt Intent

“Decide whether to introduce Ingress or keep port-forward proof.”

Risk Assessment

Ingress not strictly required for Phase IV

Ingress beneficial for Phase V and demo clarity

Decision

Implement Ingress carefully

Keep rollback option via Helm

Outcome

nimbus.local routes frontend and backend

Same-origin architecture achieved

CORS issues eliminated

🔹 Stage 8 — Security & Auth Verification Prompt

Prompt Intent

“Prove authentication and authorization under Kubernetes + Ingress.”

Verification Steps

401 without token

Login returns JWT

/auth/me works with token

/tasks enforces owner-only access

Outcome

Security guarantees preserved after infra changes

No regression from Phase III

🔹 Stage 9 — Evidence & Reproducibility Prompt

Prompt Intent

“Prepare judge-safe evidence and reproducible walkthrough.”

Decision

Organize proofs by level

Add clear index and run definition

Document minikube tunnel requirement

Outcome

Phase IV evidence complete

Deployment reproducible

Ready for review or Phase V transition