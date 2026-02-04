Phase IV Evidence Index — Nimbus Tasks

Owner: Shoaib
Phase: IV — Docker + Kubernetes + Helm + Ingress
Goal: Fully reproducible local deployment on Minikube with Ingress, Authentication, and Protected APIs.

Evidence Navigation (Level-wise)
Level 1 — Planning & Entry

Folder: Level1-Proof/

Proof focus:

Phase IV scope definition

Specs and execution plan

Phase boundary (Phase III frozen)

Level 2 — Governance & Readiness

Folder: Level2-Proof/

Proof focus:

Spec-Kit compliance

Proof checklist

Tool readiness confirmation

Level 3 — Docker Build

Folder: Level3-Proof/

Proof focus:

Backend Docker image build

Frontend Docker image build

/api/health verification in container

Docker Desktop running

Level 4 — Local Runtime Validation

Folder: Level4-Proof/

Proof focus:

Backend container running

Frontend container running

Login page loads

Auth works locally

UI and API functional before Kubernetes

Level 5 — Helm Validation

Folder: Level5-Proof/

Proof focus:

helm version

helm lint

helm template

Image tags and values verified

Level 6 — Kubernetes Cluster

Folder: Level6-Proof/

Proof focus:

minikube start --driver=docker

kubectl get nodes

kubectl cluster-info

Cluster health verification

Level 7 — Helm Deployment

Folder: Level7-Proof/

Proof focus:

helm install / upgrade

Backend + frontend deployments

Pods in Running state

Services created correctly

Images resolved from local Minikube registry

Level 8 — Ingress + Auth + UI (Money Shot)

Folder: Level8-Proof/

Proof focus:

Docker Engine running

Minikube cluster active

kubectl -n nimbus get pods → backend & frontend Running

kubectl -n nimbus get ingress → host nimbus.local

minikube tunnel running (must remain open on Windows)

Ingress & API Proofs

curl http://nimbus.local/ → redirects to /login

curl http://nimbus.local/api/health → {"ok": true}

Authentication Proofs

Login returns JWT token

/api/auth/me returns user with Bearer token

/api/tasks returns protected data

401 Unauthorized without token (expected)

Helm Proofs

helm list -A shows deployed release

helm status nimbus -n nimbus → deployed

helm get values nimbus -n nimbus shows correct image tags

Level 9 — Finalization & Reproducibility

Folder: Level9-Proof/

Required Proofs

GitHub push (final branch + tag)

README updated with Phase IV run instructions

Fresh-run proof:

delete cluster

start minikube

helm install / upgrade

ingress works

Final money-shot:

Pods Running

Ingress active

curl /api/health

UI loads at nimbus.local

Fresh Run Definition (Judge-Safe)

A fresh run is considered successful when:

minikube start --driver=docker succeeds

helm upgrade --install nimbus ... succeeds

Backend and frontend pods reach Running

Ingress routing works:

http://nimbus.local/ → /login

http://nimbus.local/api/health → {"ok": true}

Notes & Clarifications

Closing minikube tunnel will break nimbus.local ingress routing on Windows.

401 Unauthorized without a token is expected and proves security enforcement.

Invalid token indicates expiration or copy error and is expected behavior.

Phase IV Prompt & Decision History:

.specify/memory/phase4/decisions.md

Phase IV Status

Status: ✅ COMPLETE — FROZEN
No further infrastructure changes are allowed under Phase IV.