“Hello, this is Shoaib.
In this video, I will demonstrate Phase 4 proof for my Nimbus Tasks project.
This includes Docker, Minikube, Kubernetes Ingress, backend authentication, protected APIs, and Helm deployment.
I will show everything step by step with live commands and outputs.”

##find minikube:
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")

##now test :
where.exe minikube
minikube version

##now apply this:
minikube start --driver=docker

🔹 STEP 1 — Docker Engine Proof

“First, I am starting Docker Engine from the Start Menu.
Docker is required as the container runtime for Minikube.”

🎥 Show Docker Desktop open and running

“Docker is running successfully.”

🔹 STEP 2 — Start Minikube with Docker

“Now I am starting Minikube using the Docker driver.”

🎥 Type and run command

minikube start --driver=docker


“Minikube has started successfully using Docker as the driver.”

🔹 STEP 3 — Verify Kubernetes Cluster

“Next, I will verify the Kubernetes cluster and namespace resources.”

🎥 Navigate to project directory

cd "D:\Shoaib Project\nimbus-tasks"


🎥 Show nodes

kubectl get nodes


“The Kubernetes node is in Ready state.”

🎥 Show pods

kubectl -n nimbus get pods


“Both backend and frontend pods are running.”

🎥 Show ingress

kubectl -n nimbus get ingress


“Ingress is configured for the Nimbus application.”

🔹 STEP 4 — Start Minikube Tunnel

“Now I am starting the Minikube tunnel.
This is required for Ingress to work on a local machine.
This command will remain running and will not be interrupted.”

🎥 Run command

minikube tunnel


“The tunnel is now active.”

🔹 STEP 5 — Ingress Proof
Frontend Redirect

“Now I will verify ingress routing through the domain nimbus dot local.”

🎥

curl.exe -I http://nimbus.local/ | findstr /i "HTTP/ location:"


“The frontend correctly redirects to the login page, which confirms ingress routing is working.”

Unauthorized API Check

“Next, I will access a protected API endpoint without authentication.”

🎥

curl.exe -i http://nimbus.local/api/auth/me


“As expected, the API returns 401 Unauthorized, confirming authentication enforcement.”

🔹 STEP 6 — Backend Authentication Proof

“Now I will authenticate a user using the backend API.”

🎥 Create login payload

@'
{"email":"test@user.com","password":"test123"}
'@ | Out-File -Encoding ascii .\login.json


🎥 Login request

curl.exe -i -X POST "http://nimbus.local/api/auth/login" `
  -H "Content-Type: application/json" `
  --data-binary "@login.json"


“The backend returns a valid JWT access token.”

🎥 Store token

$TOKEN="PASTE_TOKEN_HERE"

Authenticated User Proof

“Now I will access the authenticated user endpoint using the token.”

🎥

curl.exe -i "http://nimbus.local/api/auth/me" `
  -H "Authorization: Bearer $TOKEN"


“The API returns the authenticated user details successfully.”

🔹 STEP 7 — Protected API (Tasks)

“Next, I will access a protected tasks API using the same token.”

🎥

curl.exe -i "http://nimbus.local/api/tasks" `
  -H "Authorization: Bearer $TOKEN"


“The API returns task data belonging to the authenticated user, proving owner-only access.”

🎥 Optional

$TOKEN.Length


“This confirms the token integrity.”

🔹 STEP 8 — Helm Deployment Proof

“Now I will show the Helm deployment used to manage the application.”

🎥

helm version


“This confirms Helm is installed.”

🎥

helm env


🎥

helm list -A


“The Nimbus Helm release is deployed in the nimbus namespace.”

🎥

helm status nimbus -n nimbus


“The release status is deployed.”

🎥

helm get values nimbus -n nimbus


“These are the user-supplied Helm values for the frontend image.”

🎬 OUTRO (5–10 seconds)

“This completes the Level 8 proof for my Nimbus Tasks project.
All components are running successfully using Docker, Minikube, Kubernetes Ingress, secure authentication, protected APIs, and Helm deployment.
Thank you.”