http://localhost:3000/login

test ui 



curl http://127.0.0.1:8000/api/health

show that after doing task page loaded 



terminal 1: (backend)
cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000 --env-file .env


SWAGGER UI 
TASK:
{
  "title": "Video proof task"
}

EMAIL: owner.a@test.com
PASWORD: test1234


terminal 2: (fronted)
cd "D:\Shoaib Project\nimbus-tasks\phase2-frontend"
npm run dev

auth working:
http://localhost:3000/login

go to task for test ui 

terminal 3 or any paste it to check the health

curl.exe -X GET "http://127.0.0.1:8000/api/health"

tree: cd "D:\Shoaib Project\nimbus-tasks"
git ls-files
