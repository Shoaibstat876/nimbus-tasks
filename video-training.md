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


final test:
PS D:\Shoaib Project\nimbus-tasks> curl.exe -i "https://nimbus-backend-sc34.onrender.com/api/health"
>> 
HTTP/1.1 200 OK
Date: Thu, 22 Jan 2026 21:47:25 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c223fe88b0621f2-KHI
rndr-id: cab42586-d27c-47dd
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

{"ok":true}
PS D:\Shoaib Project\nimbus-tasks> curl.exe -i -X POST "https://nimbus-backend-sc34.onrender.com/api/auth/login" `
>>   -H "Content-Type: application/x-www-form-urlencoded" `
>>   -d "username=test@user.com&password=test123"
>> 
HTTP/1.1 200 OK
Date: Thu, 22 Jan 2026 21:47:39 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c224040dab421e8-KHI
rndr-id: d4de8a60-cec7-4ece
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOSIsImlhdCI6MTc2OTExODQ1OSwiZXhwIjoxNzY5MjA0ODU5fQ.y3jMAh3ybbnyY8Msi5ZbiZBUiWR8o-ki0Ur89vVhNm0","token_type":"bearer"}
PS D:\Shoaib Project\nimbus-tasks> -d "email=test@user.com&password=test123"
>>
-d : The term '-d' is not recognized as the name of a cmdlet, function, script file, or operable 
program. Check the spelling of the name, or if a path was included, verify that the path is        
correct and try again.
At line:1 char:1
+ -d "email=test@user.com&password=test123"
+ ~~
    + CategoryInfo          : ObjectNotFound: (-d:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException

PS D:\Shoaib Project\nimbus-tasks> always use this format
always : The term 'always' is not recognized as the name of a cmdlet, function, script file, or 
operable program. Check the spelling of the name, or if a path was included, verify that the path  
is correct and try again.
At line:1 char:1
+ always use this format
+ ~~~~~~
    + CategoryInfo          : ObjectNotFound: (always:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException

PS D:\Shoaib Project\nimbus-tasks> curl.exe -i -X POST "https://nimbus-backend-sc34.onrender.com/api/auth/register" `
>>   -H "Content-Type: application/x-www-form-urlencoded" `
>>   -d "email=newuser2@test.com&password=test123"
>>
HTTP/1.1 201 Created
Date: Thu, 22 Jan 2026 21:48:27 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c224168d88621f0-KHI
rndr-id: 72e4b805-6ded-40f0
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

{"ok":true,"id":21,"email":"newuser2@test.com"}
PS D:\Shoaib Project\nimbus-tasks> 

Set-Content -Path .\task.json -Value '{ "title": "Task created from Render backend" }' -Encoding utf8
------------------------------------------------------------------------------------------
Now Step 7 (Owner-only proof in 60 seconds):
Now Step 7 (Owner-only proof in 60 seconds)

We will prove “owner-only” by using a different user token and trying to delete id=37.

1) Register a second user
curl.exe -i -X POST "https://nimbus-backend-sc34.onrender.com/api/auth/register" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "email=otheruser@test.com&password=test123"

2) Login second user and copy token
curl.exe -i -X POST "https://nimbus-backend-sc34.onrender.com/api/auth/login" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=otheruser@test.com&password=test123"

3) Try to delete YOUR task (id 37) with second token
$token2 = "PASTE_SECOND_USER_TOKEN"

curl.exe -i -X DELETE "https://nimbus-backend-sc34.onrender.com/api/tasks/37" `
  -H "Authorization: Bearer $token2"


✅ Expected: 404 Not Found (owner-only law)

Quick cleanup (git status)

You created local files for testing. Do this so repo stays clean:

del task.json, login.json, body.json -ErrorAction SilentlyContinue


Then check:

git status -sb


Tell me: do you want next (A) fix frontend Vercel fetch (connect NEXT_PUBLIC_API_BASE_URL)
or (B) finish owner-only proof first?

PS D:\Shoaib Project\nimbus-tasks> curl.exe -i -X POST "https://nimbus-backend-sc34.onrender.com/api/auth/register" 
>>   -H "Content-Type: application/x-www-form-urlencoded" 
>>   -d "email=otheruser@test.com&password=test123"
>> 
HTTP/1.1 201 Created
Date: Thu, 22 Jan 2026 21:56:32 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c224d41197f21f2-KHI
rndr-id: d85691d5-7bf1-42df
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

{"ok":true,"id":22,"email":"otheruser@test.com"}
PS D:\Shoaib Project\nimbus-tasks> curl.exe -i -X POST "https://nimbus-backend-sc34.onrender.com/api/auth/login" 
>>   -H "Content-Type: application/x-www-form-urlencoded" 
>>   -d "username=otheruser@test.com&password=test123"
>> 
HTTP/1.1 200 OK
Date: Thu, 22 Jan 2026 21:56:39 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c224d6dcf0d21f0-KHI
rndr-id: c885fc67-3fd0-4de6
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMiIsImlhdCI6MTc2OTExODk5OSwiZXhwIjoxNzY5MjA1Mzk5fQ.k_HRh-qPfDBxSuj_Z7A6BbuAPV2R-ejGc_O2zI-UoYE","token_type":"bearer"}
PS D:\Shoaib Project\nimbus-tasks> $token2 = "PASTE_SECOND_USER_TOKEN"
>>
>> curl.exe -i -X DELETE "https://nimbus-backend-sc34.onrender.com/api/tasks/37" 
>>   -H "Authorization: Bearer $token2"
>>
HTTP/1.1 401 Unauthorized
Date: Thu, 22 Jan 2026 21:56:51 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c224dbe8aad21f0-KHI
rndr-id: 0d5f9892-e6f9-4c92
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

{"detail":"Invalid token"}
PS D:\Shoaib Project\nimbus-tasks> del task.json, login.json, body.json -ErrorAction SilentlyContinue
>>
PS D:\Shoaib Project\nimbus-tasks> git status -sb
>>
## main...origin/main
 M video-training.md
PS D:\Shoaib Project\nimbus-tasks> 

Baby you did EVERYTHING right — only one tiny mistake:

You didn’t paste the real token into $token2.
You kept it as "PASTE_SECOND_USER_TOKEN" so backend correctly said Invalid token ✅ (this is expected).

Let’s do the owner-only proof properly now.

Step 1 — set the REAL token2 (copy from your login output)

Use THIS exact token you got:

$token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMiIsImlhdCI6MTc2OTExODk5OSwiZXhwIjoxNzY5MjA1Mzk5fQ.k_HRh-qPfDBxSuj_Z7A6BbuAPV2R-ejGc_O2zI-UoYE"

Step 2 — try deleting task 37 using token2
curl.exe -i -X DELETE "https://nimbus-backend-sc34.onrender.com/api/tasks/37" `
  -H "Authorization: Bearer $token2"


✅ Expected result (Owner-only law proof):

404 Not Found (because task 37 belongs to user 19, not user 22)

If you get 404, it’s PERFECT and judge-safe.

Step 3 — confirm task 37 still exists (with your original token)
curl.exe -i "https://nimbus-backend-sc34.onrender.com/api/tasks" `
  -H "Authorization: Bearer $token"


✅ Expected: task id: 37 still in list.

Your git status is clean ✅

Only video-training.md modified — that’s fine.

Run Step 2 now and paste the HTTP status line you get (like HTTP/1.1 404 Not Found).

PS D:\Shoaib Project\nimbus-tasks> del task.json, login.json, body.json -ErrorAction SilentlyContinue
>>
PS D:\Shoaib Project\nimbus-tasks> git status -sb
>>
## main...origin/main
 M video-training.md
PS D:\Shoaib Project\nimbus-tasks> $token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMiIsImlhdCI6MTc2OTExODk5OSwiZXhwIjoxNzY5MjA1Mzk5fQ.k_HRh-qPfDBxSuj_Z7A6BbuAPV2R-ejGc_O2zI-UoYE"        
>>
PS D:\Shoaib Project\nimbus-tasks> curl.exe -i -X DELETE "https://nimbus-backend-sc34.onrender.com/api/tasks/37" 
>>   -H "Authorization: Bearer $token2"
>>
HTTP/1.1 404 Not Found
Date: Thu, 22 Jan 2026 21:58:22 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c224ff669aa21e8-KHI
rndr-id: f79ba811-12f7-422c
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

{"detail":"Task not found"}
PS D:\Shoaib Project\nimbus-tasks> curl.exe -i "https://nimbus-backend-sc34.onrender.com/api/tasks"
 
>>   -H "Authorization: Bearer $token"
>>
HTTP/1.1 200 OK
Date: Thu, 22 Jan 2026 21:58:42 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c22506fafb821e8-KHI
rndr-id: ec059aab-c048-4131
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

[{"id":37,"user_id":19,"title":"Task created from Render backend","is_completed":false,"created_at":"2026-01-22T21:54:16.866027","updated_at":"2026-01-22T21:54:16.866084"},{"id":35,"user_id":19,"title":"Neon Blast","is_completed":true,"created_at":"2026-01-21T15:01:15.092412","updated_at":"2026-01-21T15:01:27.480681"},{"id":34,"user_id":19,"title":"Neon Task","is_completed":false,"created_at":"2026-01-21T15:01:01.370678","updated_at":"2026-01-21T15:01:01.371698"}]
PS D:\Shoaib Project\nimbus-tasks>

Perfect, baby. ✅✅✅

This is EXACTLY the “Owner-only = behaves like 404” law working correctly.

What you proved (judge-safe)

User 22 tried: DELETE /api/tasks/37
✅ got 404 Not Found → {"detail":"Task not found"}

Then user 19 listed tasks
✅ task 37 is still there (so it was NOT deleted)

That’s the strongest possible proof.

Next Step (one step only): prove PATCH toggle also returns 404 for non-owner

Run this with token2:

curl.exe -i -X PATCH "https://nimbus-backend-sc34.onrender.com/api/tasks/37/toggle" `
  -H "Authorization: Bearer $token2"


✅ Expected: 404 Not Found

Then we’ll do the same toggle with token (user 19) and show it works.

Send me the output of that PATCH.

PS D:\Shoaib Project\nimbus-tasks> curl.exe -i -X PATCH "https://nimbus-backend-sc34.onrender.com/api/tasks/37/toggle" `
>>   -H "Authorization: Bearer $token"
>>
HTTP/1.1 200 OK
Date: Thu, 22 Jan 2026 22:02:03 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c2255586b3b21ea-KHI
rndr-id: 7a9fc2bf-c6ab-4c35
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

{"id":37,"user_id":19,"title":"Task created from Render backend","is_completed":true,"created_at":"2026-01-22T21:54:16.866027","updated_at":"2026-01-22T22:02:03.069096"}
PS D:\Shoaib Project\nimbus-tasks> curl.exe -i "https://nimbus-backend-sc34.onrender.com/api/tasks" `
  -H "Authorization: Bearer $token"


      curl.exe -i "https://nimbus-backend-sc34.onrender.com/api/tasks"
 `
>>   -H "Authorization: Bearer $token"
>>
HTTP/1.1 200 OK
Date: Thu, 22 Jan 2026 22:03:17 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c22572aac7021e4-KHI
rndr-id: c6f9e2da-e57d-4fcf
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

[{"id":37,"user_id":19,"title":"Task created from Render backend","is_completed":true,"created_at":"2026-01-22T21:54:16.866027","updated_at":"2026-01-22T22:02:03.069096"},{"id":35,"user_id":19,"title":"Neon Blast","is_completed":true,"created_at":"2026-01-21T15:01:15.092412","updated_at":"2026-01-21T15:01:27.480681"},{"id":34,"user_id":19,"title":"Neon Task","is_completed":false,"created_at":"2026-01-21T15:01:01.370678","updated_at":"2026-01-21T15:01:01.371698"}]
PS D:\Shoaib Project\nimbus-tasks> 

                                   curl.exe -i -X DELETE "https://nimbus-backend-sc34.onrender.com/api/tasks/37" `
>>   -H "Authorization: Bearer $token2"
>>
HTTP/1.1 404 Not Found
Date: Thu, 22 Jan 2026 22:04:13 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c2258853e3b21f5-KHI
rndr-id: b0d616e6-b149-4e70
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

{"detail":"Task not found"}
PS D:\Shoaib Project\nimbus-tasks> 



                                   curl.exe -i -X DELETE "https://nimbus-backend-sc34.onrender.com/api/tasks/37" `
>>   -H "Authorization: Bearer $token"
>>
HTTP/1.1 204 No Content
Date: Thu, 22 Jan 2026 22:05:12 GMT
Content-Type: application/json
Connection: keep-alive
CF-RAY: 9c2259f67c7521f2-KHI
Content-Encoding: br
rndr-id: 97c73a1c-40be-4e37
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

PS D:\Shoaib Project\nimbus-tasks> curl.exe -i "https://nimbus-backend-sc34.onrender.com/api/tasks"
 `
>>   -H "Authorization: Bearer $token"
>>
HTTP/1.1 200 OK
Date: Thu, 22 Jan 2026 22:05:27 GMT
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
CF-RAY: 9c225a545bf921f0-KHI
rndr-id: 3af9fdc7-37d6-43f5
vary: Accept-Encoding
x-render-origin-server: uvicorn
cf-cache-status: DYNAMIC
Server: cloudflare
alt-svc: h3=":443"; ma=86400

[{"id":35,"user_id":19,"title":"Neon Blast","is_completed":true,"created_at":"2026-01-21T15:01:15.092412","updated_at":"2026-01-21T15:01:27.480681"},{"id":34,"user_id":19,"title":"Neon Task","is_completed":false,"created_at":"2026-01-21T15:01:01.370678","updated_at":"2026-01-21T15:01:01.371698"}]
PS D:\Shoaib Project\nimbus-tasks>