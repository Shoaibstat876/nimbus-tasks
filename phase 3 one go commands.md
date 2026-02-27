$ErrorActionPreference="Stop"

"=== PHASE 3: WAKE BACKEND (RENDER) ==="
curl.exe -s -i "https://nimbus-backend-sc34.onrender.com/api/health"

""
"=== PHASE 3: SWAGGER REACHABLE (RENDER) ==="
curl.exe -s -I "https://nimbus-backend-sc34.onrender.com/docs"

""
"=== PHASE 3: FRONTEND LOGIN REACHABLE (VERCEL) ==="
curl.exe -s -I "https://nimbus-tasks-web.vercel.app/login"


""
"=== NOW OPEN THESE IN BROWSER FOR VISUAL DEMO ==="
"Backend Health:  https://nimbus-backend-sc34.onrender.com/api/health"
"Swagger UI:      https://nimbus-backend-sc34.onrender.com/docs"
"Frontend Login:  https://nimbus-tasks-web.vercel.app/login"
"Tasks Page:      https://nimbus-tasks-web.vercel.app/tasks"