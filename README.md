# Nimbus Tasks — Hackathon 2 Full-Stack Task Management App

Nimbus Tasks is a full-stack task management application built with a Next.js frontend, FastAPI backend, JWT authentication, CRUD APIs, owner-only task security, AI task-command handling, and Kubernetes/cloud deployment proof.

This project was developed phase-wise for Hackathon 2 and is presented as a practical full-stack engineering project.

---

## Live / Deployment Links

- Frontend UI: https://nimbus-tasks-web.vercel.app/login
- Backend Deployment: Render deployment completed previously; currently requires service resume on Render.
- Backend Swagger Docs: Available after Render service is resumed.

> Note: The frontend UI is deployed on Vercel. The backend was deployed on Render, but the Render service is currently suspended and may need to be resumed before live login/API testing works again.

---

## Important Branches

- `main` — recruiter-facing overview and final README
- `phase5-cloud` — final cloud/Kubernetes/Dapr proof branch
- `phase4-k8s` — Docker, Minikube, Kubernetes Ingress, and Helm proof
- `phase3-bonus` — deployed frontend/backend and AI command proof

## Project Goal

The goal of Nimbus Tasks is to demonstrate a working, secure, and deployable full-stack task management system.

The project includes:

- User registration and login
- JWT-based authentication
- Protected API routes
- User-owned task management
- Create, read, update, complete, and delete tasks
- Owner-only task access
- Frontend and backend deployment
- Kubernetes, Helm, and cloud deployment proof
- AI-style task command handling in English and Urdu

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Vercel

### Backend

- FastAPI
- Python
- SQLModel
- JWT Authentication
- Uvicorn
- Render

### DevOps / Deployment

- Docker
- Minikube
- Kubernetes
- Ingress
- Helm
- Dapr
- Cloud Kubernetes proof

---

## Key Features

### Authentication

Nimbus Tasks supports secure authentication using JWT tokens.

Implemented endpoints:

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Task Management

Authenticated users can manage their own tasks.

Implemented endpoints:

```http
GET /api/tasks
POST /api/tasks
PUT /api/tasks/{task_id}
PATCH /api/tasks/{task_id}/toggle
DELETE /api/tasks/{task_id}
```

### Owner-Only Security

A key requirement of this project is owner-only task access.

Every task operation is restricted to the authenticated user who owns the task.

Non-owners receive:

```http
404 Not Found
```

This prevents other users from viewing, updating, toggling, or deleting tasks they do not own.

---

## Phase Summary

| Phase | Focus | Status |
|---|---|---|
| Phase 1 | Local frontend/backend proof | Completed |
| Phase 2 | Backend contract, auth, CRUD, owner-only security | Completed |
| Phase 3 | Render + Vercel deployment and AI command proof | Completed |
| Phase 4 | Docker, Minikube, Kubernetes Ingress, Helm proof | Completed |
| Phase 5 | Cloud Kubernetes, Dapr, worker, and protected endpoint proof | Completed |

---

## Phase 1 — Local Full-Stack Proof

Phase 1 proved that the frontend and backend could run locally together.

### Run Backend Locally

```powershell
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000 --env-file .env
```

### Backend Health Check

```powershell
curl.exe -X GET "http://127.0.0.1:8000/api/health"
```

Expected response:

```json
{"ok": true}
```

### Run Frontend Locally

```powershell
cd "D:\Shoaib Project\nimbus-tasks\phase2-frontend"
npm run dev
```

Local frontend:

```txt
http://localhost:3000/login
```

---

## Phase 2 — Backend Contract and Owner-Only Proof

Phase 2 focused on backend correctness, authentication, CRUD behavior, and security.

### Live Backend Health Proof

```powershell
curl.exe -i "https://nimbus-backend-sc34.onrender.com/api/health"
```

Expected result:

```http
HTTP/1.1 200 OK
```

Expected response:

```json
{"ok": true}
```

### Login Proof

```powershell
curl.exe -i -X POST "https://nimbus-backend-sc34.onrender.com/api/auth/login" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=test@user.com&password=test123"
```

Expected result:

```http
HTTP/1.1 200 OK
```

The response returns a JWT access token.

---

## Owner-Only Security Proof

A second user attempted to delete another user's task.

```powershell
curl.exe -i -X DELETE "https://nimbus-backend-sc34.onrender.com/api/tasks/37" `
  -H "Authorization: Bearer SECOND_USER_TOKEN"
```

Expected result:

```http
HTTP/1.1 404 Not Found
```

Expected response:

```json
{"detail":"Task not found"}
```

Then the real owner listed tasks and confirmed the task still existed.

This proves owner-only task protection.

### Owner Delete Proof

When the actual owner deletes the task:

```powershell
curl.exe -i -X DELETE "https://nimbus-backend-sc34.onrender.com/api/tasks/37" `
  -H "Authorization: Bearer OWNER_TOKEN"
```

Expected result:

```http
HTTP/1.1 204 No Content
```

This proves only the owner can delete their own task.

---

## Phase 3 — Deployment and AI Command Proof

Phase 3 proved that the frontend and backend were deployed and connected.

### Deployed Frontend

```txt
https://nimbus-tasks-web.vercel.app/login
```

### Deployed Backend Docs

```txt
https://nimbus-backend-sc34.onrender.com/docs
```

### Demonstrated Operations

- Login
- Add task
- Update task
- Complete task
- Delete task
- List tasks

---

## AI / Reusable Intelligence Proof

Nimbus Tasks includes chatbot-style task commands.

Intent priority order:

1. Delete
2. Complete
3. Update
4. List
5. Add

This helps the system detect task commands in a predictable way.

### English Examples

```txt
Add a new task called Neon Blast.
Add a task named Milk.
Create a new task called Water.
Show all my tasks.
Update the task Milk to Buy Milk.
Mark Water as completed.
Delete the task Neon Blast.
```

### Urdu Examples

```txt
ایک نیا کام شامل کرو: بل بجلی جمع کرو
ایک نیا کام شامل کرو: کتاب خریدنی ہے
ایک نیا کام شامل کرو: دفتر جانا ہے
میرے سارے کام دکھاؤ
کتاب خریدنی ہے والے کام کا نام بدل دو
دفتر جانا ہے والا کام مکمل کر دو
بل بجلی جمع کرو والا کام حذف کر دو
```

This demonstrates multilingual task command handling in English and Urdu.

---

## Phase 4 — Docker, Minikube, Kubernetes, and Helm Proof

Phase 4 proved local Kubernetes deployment.

### Start Minikube

```powershell
minikube start --driver=docker
```

### Check Kubernetes Node

```powershell
kubectl get nodes
```

### Check Nimbus Pods

```powershell
kubectl -n nimbus get pods
```

### Check Ingress

```powershell
kubectl -n nimbus get ingress
```

### Start Minikube Tunnel

```powershell
minikube tunnel
```

### Frontend Ingress Proof

```powershell
curl.exe -I http://nimbus.local/ | findstr /i "HTTP/ location:"
```

### Protected API Proof

```powershell
curl.exe -i http://nimbus.local/api/auth/me
```

Expected result:

```http
HTTP/1.1 401 Unauthorized
```

This proves protected routes require authentication.

---

## Helm Proof

```powershell
helm version
helm list -A
helm status nimbus -n nimbus
helm get values nimbus -n nimbus
```

This proves the Nimbus application can be managed through Helm.

---

## Phase 5 — Cloud Kubernetes and Dapr Proof

Phase 5 proved cloud Kubernetes readiness with Dapr and worker components.

### Cloud Context

```powershell
kubectl config current-context
kubectl get ns
```

### Workload Health

```powershell
kubectl -n nimbus get pods -o wide
kubectl -n nimbus rollout status deploy/nimbus-backend
kubectl -n nimbus rollout status deploy/nimbus-worker
kubectl -n nimbus rollout status deploy/nimbus-frontend
```

### Dapr Components

```powershell
kubectl -n nimbus get components
```

Expected components include:

```txt
pubsub
cron
secretstore
```

### Ingress Proof

```powershell
kubectl -n nimbus get ingress
kubectl -n nimbus describe ingress nimbus-ingress
```

### Live HTTP Proof

```powershell
curl.exe -I http://nimbus.local/ | findstr /i "HTTP/"
curl.exe -i http://nimbus.local/api/health
```

### Protected Internal Endpoint Proof

```powershell
curl.exe -i -H "Authorization: Bearer TOKEN" "http://nimbus.local/api/internal/secret-proof"
```

Expected result:

```http
HTTP/1.1 200 OK
```

---

## Security Notes

- JWT tokens are not committed.
- Environment variables are not committed.
- Protected routes require valid authentication.
- Non-owner task access returns `404 Not Found`.
- Owner-only task access is enforced at the backend level.

---

## Review Notes

This project was developed phase-wise using separate branches for backend, frontend, deployment, Kubernetes, and cloud proof.

Recommended review path:

1. Start with the backend Swagger documentation.
2. Check the backend health endpoint.
3. Review authentication and CRUD behavior.
4. Review owner-only security proof.
5. Review frontend deployment.
6. Review Kubernetes, Helm, and cloud proof from phase branches.

The main branch is used as the public project landing page for recruiters and reviewers.

---

## Current Status

Nimbus Tasks demonstrates:

- Full-stack web development
- API design
- JWT authentication
- Secure CRUD operations
- Owner-only authorization
- Frontend/backend deployment
- AI-style command handling
- English and Urdu command support
- Docker and Kubernetes proof
- Helm deployment proof
- Dapr and cloud Kubernetes proof

This project shows practical full-stack engineering ability with deployment and security awareness.
