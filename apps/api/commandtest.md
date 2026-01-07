cd "D:\Shoaib Project\nimbus-tasks\apps\api"

.\.venv\Scripts\Activate.ps1

uvicorn app.main:app --reload --port 8000 --env-file .env


second terminal 

cd "D:\Shoaib Project\nimbus-tasks\apps\api"
.\.venv\Scripts\Activate.ps1

$token = "PASTE_YOUR_ACCESS_TOKEN"
curl http://127.0.0.1:8000/api/auth/me `
  -H "Authorization: Bearer $token"

  

terminal 3 :
cd "D:\Shoaib Project\nimbus-tasks\apps\api"
sqlite3 nimbus.db

.tables
select id, title, user_id from task;
select id, email from user;

terminal 4:
cd "D:\Shoaib Project\nimbus-tasks"

git status
git diff





