param(
  [Parameter(Mandatory=$true)][string]$Title
)

$specifyRoot = Split-Path -Parent $PSScriptRoot
$template = Join-Path $specifyRoot "templates\spec-template.md"
$stamp = Get-Date -Format "yyyy-MM-dd"
$safe = ($Title -replace '[^\w\- ]','').Trim() -replace '\s+','-'
$outDir = Join-Path $specifyRoot "..\history\prompts\001-todo-list"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

$outFile = Join-Path $outDir "$stamp-spec-$safe.md"
(Get-Content $template -Raw) -replace "<TITLE>", $Title | Set-Content $outFile -Encoding UTF8

Write-Host "✅ New spec created: $outFile"
