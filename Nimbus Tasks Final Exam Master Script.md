# 🏆 NIMBUS TASKS — FINAL MASTER EXAM SCRIPT

**Hackathon 2 — Phase I to Phase V**  
**Author:** Shoaib  
**Project:** Nimbus Tasks  
**Scope:** Console → Backend → Frontend → Kubernetes → Cloud-Native Event-Driven Architecture  

---

## 🎬 INTRO

Hello, my name is Shoaib.

Today I will demonstrate **Nimbus Tasks** — a system that evolved from a simple console-based task engine into a fully cloud-native, distributed, event-driven architecture running on Kubernetes with Dapr.

This demonstration covers five engineering layers:

- **Phase I — Console Engine**
- **Phase II — Backend API (Authentication + Database)**
- **Phase III — Production Deployment + Reusable Intelligence**
- **Phase IV — Docker + Kubernetes + Ingress + Protected APIs**
- **Phase V — Cloud-Native Event-Driven Architecture (DOKS + Dapr)**

---

# 🟢 PHASE I — Console Engine (Foundation Layer)

## 🎯 Objective

Validate core task business logic before adding database, UI, or infrastructure.

---

## Step 1 — Navigate to Repository

```powershell
cd "D:\Shoaib Project\nimbus-tasks"
```

---

## Step 2 — Run Console Application (Blocking)

```powershell
python "phase1-console\app.py"
```

⚠ This terminal remains active.

---

## Step 3 — Demonstrate CRUD Operations

Inside the console application:

```
add Buy milk
add Read book
list
toggle <valid-id>
list completed
update <valid-id> Buy almond milk
delete <valid-id>
exit
```

### ✅ What This Proves

- UUID-based task identification
- Full CRUD operations
- Filtering (active/completed)
- Input validation & error handling
- In-memory execution (no persistence yet)

> Phase I establishes business logic before infrastructure complexity.

---

# 🔵 PHASE II — Backend API (FastAPI + Auth + Database)

## 🎯 Objective

Transform business logic into secure REST APIs with authentication and persistent storage.

---

## Step 1 — Start Backend (Blocking)

```powershell
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000 --env-file .env
```

---

## Step 2 — Health Check

```powershell
curl.exe http://127.0.0.1:8000/api/health
```

Expected response:

```json
{"ok":true}
```

---

## Step 3 — Swagger Documentation

Open in browser:

```
http://127.0.0.1:8000/docs
```

### ✅ This Confirms

- Auto-generated API documentation
- Proper schema validation
- Production-ready REST design

---

## Step 4 — Authentication & Owner-Only Security

Demonstrate:

- 401 Unauthorized (no token)
- 200 OK (valid token)
- 404 Not Found (non-owner attempting access)

### ✅ What This Proves

- JWT-based authentication
- Protected endpoints
- Owner-only access enforcement
- Secure database persistence

---

# 🟣 PHASE III — Production Deployment + Reusable Intelligence

## 🎯 Objective

Prove live production deployment and intelligent intent handling.

---

## Step 1 — Backend Health (Render)

```
https://nimbus-backend-sc34.onrender.com/api/health
```

Expected:

```json
{"ok":true}
```

---

## Step 2 — Production Swagger

```
https://nimbus-backend-sc34.onrender.com/docs
```

---

## Step 3 — Frontend Deployment (Vercel)

```
https://nimbus-tasks-web.vercel.app/login
```

Login successfully.

---

## Step 4 — CRUD in Production

Demonstrate via UI:

- Add task
- Update task
- Mark complete
- Delete task

### ✅ This Confirms

- Frontend ↔ Backend integration
- Secure production environment
- Live database persistence

---

## Step 5 — Reusable Intelligence (English)

### Intent Priority Order

1. Delete  
2. Complete  
3. Update  
4. List  
5. Add  

Example commands:

- “Add a new task called Neon Blast.”
- “Show all my tasks.”
- “Update Milk to Buy Milk.”
- “Mark Water as completed.”
- “Delete Neon Blast.”

### ✅ What This Proves

- Deterministic intent detection
- Rule-based priority logic
- Modular AI skill architecture
- No hard-coded behavior

---

## Step 6 — Urdu Multilingual Proof

Demonstrate the same operations in Urdu:

- Add
- List
- Update
- Complete
- Delete

Ask:

> “تم اردو اور انگریزی دونوں کیسے سمجھتے ہو؟”

### ✅ This Proves

- Language routing
- Multilingual intent handling
- Clean separation of AI logic

---

# 🟡 PHASE IV — Docker + Kubernetes + Ingress + Protected APIs

## 🎯 Objective

Demonstrate production-grade container orchestration.

---

## Step 1 — Start Minikube

```powershell
minikube start --driver=docker
```

---

## Step 2 — Verify Cluster

```powershell
kubectl get nodes
kubectl -n nimbus get pods
kubectl -n nimbus get ingress
```

### ✅ This Confirms

- Node is Ready
- Backend & frontend pods are Running
- Ingress configured

---

## Step 3 — Start Tunnel (Blocking)

```powershell
minikube tunnel
```

---

## Step 4 — Ingress Routing Proof

```powershell
curl.exe -I http://nimbus.local/
```

Expected:

- 307 Temporary Redirect
- `location: /login`

---

## Step 5 — Unauthorized Protected Endpoint

```powershell
curl.exe -i http://nimbus.local/api/auth/me
```

Expected:

```
401 Unauthorized
```

---

## Step 6 — Authenticated Access (Auto Token)

```powershell
$TOKEN = ( '{ "email": "test@user.com", "password": "test123" }' |
  curl.exe -s -H "Content-Type: application/json" --data-binary "@-" "http://nimbus.local/api/auth/login" |
  ConvertFrom-Json ).access_token

"Token length:"
$TOKEN.Length

curl.exe -i http://nimbus.local/api/auth/me -H "Authorization: Bearer $TOKEN"
curl.exe -i http://nimbus.local/api/tasks   -H "Authorization: Bearer $TOKEN"
```

### ✅ This Proves

- JWT works inside Kubernetes
- Protected endpoints enforced
- Owner-only task isolation

---

## Step 7 — Helm Proof (Optional)

Only if Helm is installed:

```powershell
helm version
helm list -A
helm status nimbus -n nimbus
```

---

# 🔴 PHASE V — Cloud-Native Event-Driven Architecture (DOKS + Dapr)

## 🎯 Objective

Demonstrate distributed, scalable cloud-native architecture.

---

## Step 1 — Verify Cloud Context

```powershell
kubectl config current-context
kubectl get ns
```

Confirm you are connected to the cloud cluster (not Minikube).

---

## Step 2 — Workload Health

```powershell
kubectl -n nimbus get pods -o wide
kubectl -n nimbus rollout status deploy/nimbus-backend
kubectl -n nimbus rollout status deploy/nimbus-worker
kubectl -n nimbus rollout status deploy/nimbus-frontend
```

---

## Step 3 — Dapr Sidecar Injection

```powershell
kubectl -n nimbus describe pod -l app=nimbus-backend
```

Look for `daprd` container.

---

## Step 4 — Dapr Components

```powershell
kubectl -n nimbus get components
```

Confirm:

- PubSub
- Cron
- Secret Store

---

## Step 5 — Ingress Routing

```powershell
kubectl -n nimbus describe ingress nimbus-ingress
```

Confirm:

- `/api` → backend
- `/` → frontend

---

## Step 6 — Cloud Protected Endpoint

```powershell
$TOKEN = ( '{ "email": "test@user.com", "password": "test123" }' |
  curl.exe -s -H "Content-Type: application/json" --data-binary "@-" "http://nimbus.local/api/auth/login" |
  ConvertFrom-Json ).access_token

curl.exe -i -H "Authorization: Bearer $TOKEN" "http://nimbus.local/api/internal/secret-proof"
```

### ✅ This Proves

- JWT validated in cluster
- Internal endpoint protection
- Secure service-to-service communication
- Distributed event-driven architecture

---

# 🧠 FINAL ARCHITECTURE SUMMARY

Nimbus evolved through five engineering layers:

- Phase I — Core business logic
- Phase II — Secure REST API
- Phase III — Production deployment
- Phase IV — Container orchestration
- Phase V — Cloud-native distributed system

---

## 🚀 System Capabilities

- JWT authentication
- Owner-only security
- Deterministic multilingual AI
- Docker containerization
- Kubernetes orchestration
- Ingress routing
- Dapr sidecars
- Pub/Sub architecture
- Cloud scalability

---

# 🏁 FINAL CLOSING

This completes the full demonstration of Nimbus Tasks — from a console application to a fully cloud-native, distributed, event-driven system.

Thank you.

---

## ⏱ Recommended Demo Timing

- Phase I: 2 minutes  
- Phase II: 3–4 minutes  
- Phase III: 4–5 minutes  
- Phase IV: 4–5 minutes  
- Phase V: 4–5 minutes  

**Total: ~18–20 minutes**
