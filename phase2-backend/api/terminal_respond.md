PS D:\Shoaib Project\nimbus-tasks> $body = @{
>>     username = "new_tester@example.com"
>>     password = "star876"
>> }
>> $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/auth/login" -Method Post -Body $body
>> $response

access_token
------------
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwiaWF0IjoxNzY3OTA2NDMyLCJleHAiOjE3Njc5OTI4MzJ9.xy... 


PS D:\Shoaib Project\nimbus-tasks> curl.exe -X POST "http://127.0.0.1:8000/api/auth/login" -H "Content-Type: application/x-www-form-urlencoded" -d "username=new_tester@example.com&password=star876"
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwiaWF0IjoxNzY3OTA2NDc3LCJleHAiOjE3Njc5OTI4Nzd9.o9cizC7K8Wff_4I8ftSbUffGQkMUG0tKGqVdX3Be56g","token_type":"bearer"}
PS D:\Shoaib Project\nimbus-tasks> # Replace YOUR_TOKEN_STRING with the actual long code you just received
>> curl.exe -H "Authorization: Bearer YOUR_TOKEN_STRING" "http://127.0.0.1:8000/api/auth/me"
{"detail":"Invalid token"}
PS D:\Shoaib Project\nimbus-tasks> # Replace YOUR_TOKEN_STRING with the actual long code you just received
>> curl.exe -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwiaWF0IjoxNzY3OTA2NDc3LCJleHAiOjE3Njc5OTI4Nzd9.o9cizC7K8Wff_4I8ftSbUffGQkMUG0tKGqVdX3Be56g" "http://127.0.0.1:8000/api/auth/me"
{"id":8,"email":"new_tester@example.com"}
PS D:\Shoaib Project\nimbus-tasks> # First, create a task to get an ID
>> curl.exe -X POST "http://127.0.0.1:8000/api/tasks" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwiaWF0IjoxNzY3OTA2NDc3LCJleHAiOjE3Njc5OTI4Nzd9.o9cizC7K8Wff_4I8ftSbUffGQkMUG0tKGqVdX3Be56g" -H "Content-Type: application/json" -d '{"title": "Terminal Cleanup Test"}'
>>
>> # Then, use the ID from the response (e.g., 12) to delete it
>> curl.exe -X DELETE "http://127.0.0.1:8000/api/tasks/12" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwiaWF0IjoxNzY3OTA2NDc3LCJleHAiOjE3Njc5OTI4Nzd9.o9cizC7K8Wff_4I8ftSbUffGQkMUG0tKGqVdX3Be56g"
{"detail":[{"type":"json_invalid","loc":["body",1],"msg":"JSON decode error","input":{},"ctx":{"error":"Expecting property name enclosed in double quotes"}}]}curl: (6) Could not resolve host: Cleanup
curl: (3) unmatched close brace/bracket in URL position 5:
Test}
    ^
{"detail":"Task not found"}
PS D:\Shoaib Project\nimbus-tasks>