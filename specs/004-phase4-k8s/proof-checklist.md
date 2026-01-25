@'

\# ✅ Phase IV Proof Checklist (Gate-Based)



> Rule: No checkbox may be marked complete without evidence (screenshot/log) saved under `evidence-4/`.



---



\## Level 0 — Freeze \& Integrity (CRYPTOGRAPHIC)

\- \[ ] Branch is `phase4-k8s`

\- \[ ] Tag exists: `phase3-complete`

\- \[ ] PHASE\_III\_FREEZE\_COMMIT recorded in MASTER spec

\- \[ ] `git diff --name-only PHASE\_III\_FREEZE\_COMMIT..HEAD` shows \*\*no Phase III app logic changes\*\*

&nbsp; - Allowed changes only: Dockerfiles, Helm, specs/docs, evidence



Evidence:

\- `evidence-4/level-0-freeze/`



---



\## Level 1 — Spec Pack (Specs Before Infra)

\- \[ ] `specs/004-phase4-k8s/` exists with all mandatory files

\- \[ ] MASTER\_PHASE\_IV\_SPEC.md populated (includes addendum decisions)

\- \[ ] Specs committed to `phase4-k8s`



Evidence:

\- `evidence-4/level-1-spec-pack/`



---



\## Level 2 — Backend Docker (Local Proof)

\- \[ ] `phase2-backend/api/Dockerfile` exists

\- \[ ] `docker build` backend succeeds

\- \[ ] `docker run` backend succeeds

\- \[ ] Health endpoint responds: `/api/health`



Evidence:

\- `evidence-4/level-2-docker-backend/`



---



\## Level 3 — Frontend Docker (Local Proof)

\- \[ ] `phase2-frontend/Dockerfile` exists

\- \[ ] `docker build` frontend succeeds

\- \[ ] `docker run` frontend succeeds

\- \[ ] Frontend loads (login page)

\- \[ ] Frontend points to backend via env (no hardcoding)



Evidence:

\- `evidence-4/level-3-docker-frontend/`



---



\## Level 4 — Helm Packaging (Umbrella Chart)

\- \[ ] `helm/nimbus/Chart.yaml` exists

\- \[ ] `helm/nimbus/values.yaml` exists (values-driven config)

\- \[ ] Templates exist:

&nbsp; - \[ ] backend Deployment + Service

&nbsp; - \[ ] frontend Deployment + Service

\- \[ ] `helm lint` passes



Evidence:

\- `evidence-4/level-4-helm/`



---



\## Level 5 — Minikube Deployment (K8s Proof)

\- \[ ] `minikube start` succeeds

\- \[ ] `helm install nimbus ./helm/nimbus -n nimbus --create-namespace` exits 0

\- \[ ] Pods are Running/Ready (READY=1/1) within 60 seconds

\- \[ ] No CrashLoopBackOff / ImagePullBackOff

\- \[ ] Services exist: `kubectl get svc -n nimbus`

\- \[ ] Reachability proof: `minikube service <frontend-service> -n nimbus`



Evidence:

\- `evidence-4/level-5-minikube/`



---



\## Level 6 — App Behavior Proof (Phase III preserved)

\- \[ ] Login works

\- \[ ] Task CRUD works (add/edit/toggle/delete)

\- \[ ] Urdu chatbot works

\- \[ ] Owner-only behavior unchanged



Evidence:

\- `evidence-4/level-6-app-proof/`



---



\## Level 7 — External Neon DB Proof (No DB in cluster)

\- \[ ] No database pod exists: `kubectl get pods -n nimbus`

\- \[ ] Backend env points to Neon (not localhost/sqlite)

\- \[ ] Logs/describe prove Neon host (without leaking secrets)



Evidence:

\- `evidence-4/level-7-neon-proof/`



---



\## Level 8 — AI-Ops (Causal Chain Proof)

\- \[ ] AI tool used (Claude Code / kubectl-ai / kagent)

\- \[ ] Prompt captured

\- \[ ] Diagnosis captured

\- \[ ] Action taken (kubectl/helm/docker)

\- \[ ] Result improvement captured (pods Running / error resolved)



Evidence:

\- `evidence-4/level-8-aiops/`



---



\## Level 9 — Proof Pack + Demo

\- \[ ] proof pack complete (commands + screenshots)

\- \[ ] demo-script-90s.md final

\- \[ ] Fail-safe clips recorded (Helm install, pods ready, service reachable, AI-Ops moment)



Evidence:

\- `evidence-4/level-9-demo/`



---



\# ✅ Completion Rule (Final Authority)

Phase IV is complete when \*\*all levels above\*\* are checked and evidence exists for each.

'@ | Set-Content -Encoding UTF8 specs\\004-phase4-k8s\\proof-checklist.md



