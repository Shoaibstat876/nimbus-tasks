terminal A:
$ErrorActionPreference="Stop"
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000 --env-file .env

terminal B:
$ErrorActionPreference="Stop"

"=== BACKEND HEALTH ==="
curl.exe -s -i http://127.0.0.1:8000/api/health

""
"=== SWAGGER (OPEN IN BROWSER) ==="
"http://127.0.0.1:8000/docs"

terminal 3:
$ErrorActionPreference="Stop"

"=== HEALTH ==="
curl.exe -s -i http://127.0.0.1:8000/api/health

""
"=== UNAUTHORIZED CHECK ==="
curl.exe -s -i http://127.0.0.1:8000/api/auth/me

""
"=== LOGIN ==="
$TOKEN = ( '{ "email": "test@user.com", "password": "test123" }' |
  curl.exe -s -H "Content-Type: application/json" --data-binary "@-" "http://127.0.0.1:8000/api/auth/login" |
  ConvertFrom-Json ).access_token

"Token length:"
$TOKEN.Length

""
"=== AUTHORIZED CHECK ==="
curl.exe -s -i http://127.0.0.1:8000/api/auth/me `
  -H "Authorization: Bearer $TOKEN"