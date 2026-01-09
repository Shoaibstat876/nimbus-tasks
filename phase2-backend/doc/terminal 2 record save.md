PS D:\Shoaib Project\nimbus-tasks> cd "D:\Shoaib Project\nimbus-tasks\phase2-backend\api"
>> 
PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> curl -X POST "http://127.0.0.1:8000/api/auth/register" `
>>   -H "Content-Type: application/json" `
>>   -d "{\"email\":\"owner.a@test.com\",\"password\":\"pass1234\"}"
>> 
Invoke-WebRequest : Cannot bind parameter 'Headers'. Cannot convert the "Content-Type: 
application/json" value of type "System.String" to type "System.Collections.IDictionary".
At line:2 char:6
+   -H "Content-Type: application/json" `
+      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidArgument: (:) [Invoke-WebRequest], ParameterBindingException    
    + FullyQualifiedErrorId : CannotConvertArgumentNoMessage,Microsoft.PowerShell.Commands.InvokeWe  
   bRequestCommand

PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> Invoke-RestMethod `
>>   -Method POST `
>>   -Uri "http://127.0.0.1:8000/api/auth/register" `
>>   -Headers @{ "Content-Type" = "application/json" } `
>>   -Body '{"email":"owner.a@test.com","password":"pass1234"}'
>>

  ok id email                                         Invoke-RestMethod `
>>   -Method POST `
>>   -Uri "http://127.0.0.1:8000/api/auth/register" `
>>   -Headers @{ "Content-Type" = "application/json" } `
>>   -Body '{"email":"owner.b@test.com","password":"pass1234"}'
>> D:\Shoaib Project\nimbus-tasks\phase2-backend\api>

  ok id email
  -- -- -----
True 10 owner.b@test.com


PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> $A = Invoke-RestMethod `
>>   -Method POST `
>>   -Uri "http://127.0.0.1:8000/api/auth/login" `
>>   -Headers @{ "Content-Type" = "application/x-www-form-urlencoded" } `
>>   -Body "username=owner.a@test.com&password=pass1234"
>> 
>> $TOKEN_A = $A.access_token
>> $TOKEN_A
>> 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5IiwiaWF0IjoxNzY3OTE4NTA2LCJleHAiOjE3NjgwMDQ5MDZ9.DQjTHJ24FdRyxpFiKmikniQj2PUnBH5-oefJB3UNXJQ
PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> $B = Invoke-RestMethod `
>>   -Method POST `
>>   -Uri "http://127.0.0.1:8000/api/auth/login" `
>>   -Headers @{ "Content-Type" = "application/x-www-form-urlencoded" } `
>>   -Body "username=owner.b@test.com&password=pass1234"
>> 
>> $TOKEN_B = $B.access_token
>> $TOKEN_B
>> 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMCIsImlhdCI6MTc2NzkxODUzMSwiZXhwIjoxNzY4MDA0OTMxfQ.fI-NUQ78DHd6IBI2bxqlmHbJq25_GcioDzbV94jy3jY
PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> $T = Invoke-RestMethod `
>>   -Method POST `
>>   -Uri "http://127.0.0.1:8000/api/tasks" `
>>   -Headers @{ "Authorization" = "Bearer $TOKEN_A"; "Content-Type" = "application/json" } `        
>>   -Body '{"title":"A private task"}'
>>
>> $TASK_ID = $T.id
>> $TASK_ID
>>
8
PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> try {
>>   Invoke-RestMethod `
>>     -Method PUT `
>>     -Uri "http://127.0.0.1:8000/api/tasks/8" `
>>     -Headers @{ "Authorization" = "Bearer $TOKEN_B"; "Content-Type" = "application/json" } `      
>>     -Body '{"title":"Hacked by B"}'
>>   "❌ Unexpected: update succeeded"
>> } catch {
>>   $_.Exception.Response.StatusCode.value__
>> }
>>
404
PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> try {
>>   Invoke-RestMethod `
>>     -Method PUT `
>>     -Uri "http://127.0.0.1:8000/api/tasks/8" `
>>     -Headers @{ "Authorization" = "Bearer $TOKEN_B"; "Content-Type" = "application/json" } `      
>>     -Body '{"title":"Hacked by B"}'
>>   "❌ Unexpected: update succeeded"
>> } catch {
>>   $_.Exception.Response.StatusCode.value__
>> }
>>
404
PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> try {
>>   Invoke-RestMethod `
>>     -Method PATCH `
>>     -Uri "http://127.0.0.1:8000/api/tasks/8/toggle" `
>>     -Headers @{ "Authorization" = "Bearer $TOKEN_B" }
>>   "❌ Unexpected: toggle succeeded"
>> } catch {
>>   $_.Exception.Response.StatusCode.value__
>> }
>>
404
PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> try {
>>   Invoke-RestMethod `
>>     -Method DELETE `
>>     -Uri "http://127.0.0.1:8000/api/tasks/8" `
>>     -Headers @{ "Authorization" = "Bearer $TOKEN_B" }
>>   "❌ Unexpected: delete succeeded"
>> } catch {
>>   $_.Exception.Response.StatusCode.value__
>> }
>>
404
PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> Invoke-RestMethod `
>>   -Method GET `
>>   -Uri "http://127.0.0.1:8000/api/tasks" `
>>   -Headers @{ "Authorization" = "Bearer $TOKEN_A" }
>>


id           : 8
user_id      : 9
title        : A private task
is_completed : False
created_at   : 2026-01-09T00:29:17.656231
updated_at   : 2026-01-09T00:29:17.656231



PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> Invoke-RestMethod `
>>   -Method GET `
>>   -Uri "http://127.0.0.1:8000/api/tasks" `
>>   -Headers @{ "Authorization" = "Bearer $TOKEN_A" }
>>


id           : 8
user_id      : 9
title        : A private task
is_completed : False
created_at   : 2026-01-09T00:29:17.656231
updated_at   : 2026-01-09T00:29:17.656231



PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> Invoke-RestMethod `
>>   -Method GET `
>>   -Uri "http://127.0.0.1:8000/api/tasks" `
>>   -Headers @{ "Authorization" = "Bearer $TOKEN_B" }
>>
PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api> $BTasks = Invoke-RestMethod `
>>   -Method GET `
>>   -Uri "http://127.0.0.1:8000/api/tasks" `
>>   -Headers @{ "Authorization" = "Bearer $TOKEN_B" }
>>
>> $BTasks | ConvertTo-Json                           curl.exe -X GET "http://127.0.0.1:8000/api/health"
>> D:\Shoaib Project\nimbus-tasks\phase2-backend\api>
{"ok":true}
PS D:\Shoaib Project\nimbus-tasks\phase2-backend\api>