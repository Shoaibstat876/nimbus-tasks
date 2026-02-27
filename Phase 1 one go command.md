$ErrorActionPreference="Stop"
cd "D:\Shoaib Project\nimbus-tasks"

@"
add Buy milk
add Read book
list
help
exit
"@ | python "phase1-console\app.py"