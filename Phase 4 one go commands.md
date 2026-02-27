terminal 1:
$ErrorActionPreference="Stop"
minikube tunnel

terminal 2:
$ErrorActionPreference="Stop"
cd "D:\Shoaib Project\nimbus-tasks"

"=== PHASE 4: CLUSTER PROOF ==="
kubectl get nodes
kubectl -n nimbus get pods
kubectl -n nimbus get ingress

""
"=== PHASE 4: INGRESS FRONTEND REDIRECT ==="
curl.exe -s -I http://nimbus.local/

""
"=== PHASE 4: UNAUTHORIZED PROTECTED ENDPOINT ==="
curl.exe -s -i http://nimbus.local/api/auth/me

""
"=== PHASE 4: LOGIN -> AUTO TOKEN (NO PASTE) ==="
$TOKEN = ( '{ "email": "test@user.com", "password": "test123" }' |
  curl.exe -s -H "Content-Type: application/json" --data-binary "@-" "http://nimbus.local/api/auth/login" |
  ConvertFrom-Json ).access_token

"Token length:"
$TOKEN.Length

""
"=== PHASE 4: AUTHENTICATED USER ==="
curl.exe -s -i http://nimbus.local/api/auth/me -H "Authorization: Bearer $TOKEN"

""
"=== PHASE 4: PROTECTED TASKS ENDPOINT ==="
curl.exe -s -i http://nimbus.local/api/tasks -H "Authorization: Bearer $TOKEN"

""
"=== PHASE 4: REPO CLEANLINESS CHECK ==="
git status -sb

