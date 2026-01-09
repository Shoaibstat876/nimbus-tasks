# Creates the .specify structure (safe to re-run)
$root = Split-Path -Parent $PSScriptRoot
$paths = @(
  "$root\memory",
  "$root\scripts",
  "$root\templates"
)

foreach ($p in $paths) {
  if (!(Test-Path $p)) { New-Item -ItemType Directory -Path $p | Out-Null }
}

Write-Host "✅ .specify folders ensured at: $root"
