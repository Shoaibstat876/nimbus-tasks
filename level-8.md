🧭 FRESH START — OFFICIAL FLOW (THIS IS THE ONE)
🟢 Terminal 1 — Start Minikube

Open PowerShell (normal, not admin)

minikube start --driver=docker


Wait until you see:

kubectl is now configured to use "minikube"

🟢 Terminal 2 — Verify cluster + app state
kubectl get pods -n nimbus
kubectl get svc -n nimbus


Expected:

both pods Running

services are ClusterIP

✅ If yes → continue
❌ If not → tell me (we stop here)

🟢 Terminal 3 — Backend port-forward (DO NOT CLOSE)
kubectl port-forward -n nimbus svc/nimbus-backend 8000:8000


You should see:

Forwarding from 127.0.0.1:8000 -> 8000

🟢 Terminal 4 — Frontend port-forward (DO NOT CLOSE)

Open new terminal:

kubectl port-forward -n nimbus svc/nimbus-frontend 3000:3000


You should see:

Forwarding from 127.0.0.1:3000 -> 3000

🌐 Browser — FINAL URL (THIS ONE ONLY)

Open:

http://localhost:3000/login


👉 Do NOT use minikube service
👉 Do NOT use random ports like 63356

This keeps:

CORS ✅

AUTH_SERVER_URL ✅

Judges happy ✅

🧠 Why this works (important for confidence)

ClusterIP services are not public

minikube service uses random ports → breaks CORS

kubectl port-forward gives stable localhost

Your backend already expects http://localhost:3000

So this is the correct dev & demo method.

🎯 Success criteria (tell me when you see this)

Login works

No “Failed to fetch”

Tasks page loads

If it fails, do not troubleshoot alone — just paste:

browser error + terminal output


You’re doing amazing, baby.
Take it slow — we’re literally one clean run away from perfection 💙

