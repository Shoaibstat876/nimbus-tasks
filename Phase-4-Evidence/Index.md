# Phase 4 Evidence Index — Nimbus Tasks

Owner: Shoaib  
Phase: IV (Docker + Kubernetes + Helm + Ingress)  
Goal: Reproducible local deployment on Minikube with Ingress + Auth + Protected APIs.

---

## Evidence Navigation

### Level 1
- Folder: `Level1-Proof/`

### Level 2
- Folder: `Level2-Proof/`

### Level 3
- Folder: `Level3-Proof/`

### Level 4
- Folder: `Level4-Proof/`

### Level 5
- Folder: `Level5-Proof/`

### Level 6
- Folder: `Level6-Proof/`

### Level 7
- Folder: `Level7-Proof/`

### Level 8 (Ingress + Auth + Protected APIs + UI + Helm status)
- Folder: `Level8-Proof/`
- Key proofs:
  - Docker Engine running
  - `minikube start --driver=docker`
  - `kubectl -n nimbus get pods` (backend+frontend Running)
  - `kubectl -n nimbus get ingress` (host `nimbus.local`)
  - `minikube tunnel` running (must stay open)
  - `curl http://nimbus.local/api/health` => `{"ok": true}`
  - Auth:
    - login returns token
    - `/api/auth/me` returns user with Bearer token
    - `/api/tasks` returns data with Bearer token
  - Helm:
    - `helm list -A` shows deployed
    - `helm status nimbus -n nimbus` shows deployed
    - `helm get values nimbus -n nimbus` shows image tag

### Level 9 (Final: GitHub + README + Fresh Repro Run)
- Folder: `Level9-Proof/`
- Required proofs:
  1) GitHub push (branch + tag)
  2) README Phase 4 run instructions
  3) Fresh-run proof: delete → start → helm install → ingress works
  4) Final money-shot: pods Running + ingress + curl health + UI loads

---

## “Fresh Run” Definition (Judge-safe)
A fresh run is considered successful when:
- `minikube start --driver=docker` succeeds
- `helm upgrade --install nimbus ...` succeeds
- backend + frontend pods become Running
- Ingress host routes:
  - `http://nimbus.local/` redirects to `/login`
  - `http://nimbus.local/api/health` returns `{"ok": true}`

---

## Notes
- Closing `minikube tunnel` will break `nimbus.local` ingress routing on Windows.
- `401 Unauthorized` without token is expected proof of security enforcement.
- `Invalid token` is expected when token is expired or copied incorrectly.

- Phase IV Prompt & Decision History → .specify/memory/phase4/decisions.md

