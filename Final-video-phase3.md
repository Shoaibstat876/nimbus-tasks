Step 1:
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000 --env-file .env

step 2:
cd "D:\Shoaib Project\nimbus-tasks\phase2-frontend"
npm run dev

step 3:
first run app by visual dont show anything more 

step 4:
login page 

step 5: add,edit,toggle and delete task 

step 6: chatbot with urdu 

step 7: resuable intelligence proof test

0) Start backend (Terminal 2):

cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --env-file .env

1) Health check (Terminal 1)
curl.exe -i http://127.0.0.1:8000/api/health

2) Prove “skills exist” (Terminal 1):
tree phase2-backend\api\app\services\skills /f

3) Prove “agent uses skills” (Terminal 1):

Select-String -Path phase2-backend\api\app\services\chat_agent.py `
  -Pattern "from \.skills|resolve_language\(|detect_intent\(" -CaseSensitive

4) Login and store token (Terminal 1):

@'
{"email":"user1@test.com","password":"Pass12345!"}
'@ | Set-Content -Encoding utf8 loginA.json

$respA = curl.exe -s -X POST "http://127.0.0.1:8000/api/auth/login/json" `
  -H "Content-Type: application/json" --data-binary "@loginA.json"

$TOKEN_A = ($respA | ConvertFrom-Json).access_token
$TOKEN_A

5) Intelligence Test A — Urdu routing (language_router_skill):

@'
{"message":"میری لسٹ دکھاؤ"}
'@ | Set-Content -Encoding utf8 urdu.json

$urdu = curl.exe -s -X POST "http://127.0.0.1:8000/api/chat" `
  -H "Authorization: Bearer $TOKEN_A" `
  -H "Content-Type: application/json" `
  --data-binary "@urdu.json"

$urdu


✅ Proof target: response should be in Urdu (or clearly Urdu-friendly), showing routing happened.

6) Intelligence Test B — Intent hint (task_intent_skill):

@'
{"message":"delete task 3"}
'@ | Set-Content -Encoding utf8 intent.json

$del = curl.exe -s -X POST "http://127.0.0.1:8000/api/chat" `
  -H "Authorization: Bearer $TOKEN_A" `
  -H "Content-Type: application/json" `
  --data-binary "@intent.json"

$del
($del | ConvertFrom-Json).tool_calls | ConvertTo-Json -Depth 20


✅ Proof target: you should see tool_calls OR a confirmation flow starting (delete should not silently delete).

7) Cleanup (optional):

Remove-Item loginA.json, urdu.json, intent.json -ErrorAction SilentlyContinue

https://nimbus-tasks-web.vercel.app/tasks