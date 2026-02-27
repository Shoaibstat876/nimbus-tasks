$ErrorActionPreference="Stop"
cd "D:\Shoaib Project\nimbus-tasks"

"=== PHASE 5: CLOUD CONTEXT (DOKS) ==="
kubectl config current-context
kubectl get ns

""
"=== PHASE 5: WORKLOAD HEALTH (PODS + ROLLOUT) ==="
kubectl -n nimbus get pods -o wide
kubectl -n nimbus rollout status deploy/nimbus-backend
kubectl -n nimbus rollout status deploy/nimbus-worker
kubectl -n nimbus rollout status deploy/nimbus-frontend

""
"=== PHASE 5: DAPR SIDECAR + IMAGE PROOF ==="
kubectl -n nimbus describe pod -l app=nimbus-backend
kubectl -n nimbus describe pod -l app=nimbus-worker

""
"=== PHASE 5: DAPR COMPONENTS (PUBSUB / CRON / SECRETSTORE) ==="
kubectl -n nimbus get components

""
"=== PHASE 5: INGRESS ROUTES ==="
kubectl -n nimbus get ingress
kubectl -n nimbus describe ingress nimbus-ingress

""
"=== PHASE 5: LIVE HTTP PROOF ==="
curl.exe -s -I http://nimbus.local/
curl.exe -s -i http://nimbus.local/api/health

""
"=== PHASE 5: AUTH + PROTECTED ENDPOINT PROOF ==="
$TOKEN = ( '{ "email": "test@user.com", "password": "test123" }' |
  curl.exe -s -H "Content-Type: application/json" --data-binary "@-" "http://nimbus.local/api/auth/login" |
  ConvertFrom-Json ).access_token

"Token length:"
$TOKEN.Length

curl.exe -s -i -H "Authorization: Bearer $TOKEN" "http://nimbus.local/api/internal/secret-proof"