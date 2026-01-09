cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000 --env-file .env


cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
.\.venv\Scripts\Activate.ps1

$token = "PASTE_YOUR_ACCESS_TOKEN"
curl http://127.0.0.1:8000/api/auth/me `
  -H "Authorization: Bearer $token"

  

terminal 3 :
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
sqlite3 nimbus.db

.tables
select id, title, user_id from task;
select id, email from user;
.quit

terminal 4:
cd "D:\Shoaib Project\nimbus-tasks"
git status
git add .
git commit -m "feat: updated project structure and verified backend"
git push origin main



--------------------------------------------------------------------------------------------------
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
.venv\Scripts\activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --env-file .env


terminal 2
curl http://127.0.0.1:8000/api/health


------------------------------------------------------------------------
terminal 2:
Invoke-WebRequest http://127.0.0.1:8000/api/health -UseBasicParsing

step 1:
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"

$r = Invoke-RestMethod -Method Post `
  -Uri "http://127.0.0.1:8000/api/auth/login" `
  -ContentType "application/x-www-form-urlencoded" `
  -Body @{
    username = "nimbus.user3@test.com"
    password = "Nimbus@12345"
  }

$r


-----------------------------------------------------------------------------------
$body = @{
    username = "new_tester@example.com"
    password = "star876"
}
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/auth/login" -Method Post -Body $body
$response
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
curl.exe -X POST "http://127.0.0.1:8000/api/auth/login" -H "Content-Type: application/x-www-form-urlencoded" -d "username=new_tester@example.com&password=star876"
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Replace YOUR_TOKEN_STRING with the actual long code you just received
curl.exe -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwiaWF0IjoxNzY3OTA2NDc3LCJleHAiOjE3Njc5OTI4Nzd9.o9cizC7K8Wff_4I8ftSbUffGQkMUG0tKGqVdX3Be56g" "http://127.0.0.1:8000/api/auth/me"
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

curl.exe -X GET "http://127.0.0.1:8000/api/health"
