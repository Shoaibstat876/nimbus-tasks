#!/usr/bin/env pwsh

<#
Phase-1 Prerequisite Checker
Hackathon 2 — Phase 1 (Python In-Memory Console App)

Purpose:
- Validate Phase-1 structure only
- No Git enforcement
- No feature branches
- No plan.md / tasks.md
- Python-only discipline
#>

[CmdletBinding()]
param(
    [switch]$Json,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output @"
Usage: check-prerequisites.ps1 [-Json]

Validates Hackathon 2 Phase-1 Python project structure.

Checks:
- app.py
- store.py
- skills/ directory
- spec.md
- README.md

No Git, no tasks.md, no plan.md required.
"@
    exit 0
}

$ROOT = Get-Location

$requiredFiles = @(
    "app.py",
    "store.py",
    "spec.md",
    "README.md"
)

$requiredDirs = @(
    "skills"
)

$missingFiles = @()
$missingDirs = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path (Join-Path $ROOT $file))) {
        $missingFiles += $file
    }
}

foreach ($dir in $requiredDirs) {
    if (-not (Test-Path (Join-Path $ROOT $dir) -PathType Container)) {
        $missingDirs += $dir
    }
}

$result = [PSCustomObject]@{
    PROJECT_ROOT = $ROOT.Path
    STATUS       = if ($missingFiles.Count -eq 0 -and $missingDirs.Count -eq 0) { "PASS" } else { "FAIL" }
    MISSING_FILES = $missingFiles
    MISSING_DIRS  = $missingDirs
}

if ($Json) {
    $result | ConvertTo-Json -Compress
    exit 0
}

Write-Output "PROJECT_ROOT: $($ROOT.Path)"
Write-Output "STATUS: $($result.STATUS)"

if ($missingFiles.Count -gt 0) {
    Write-Output "Missing Files:"
    $missingFiles | ForEach-Object { Write-Output "  - $_" }
}

if ($missingDirs.Count -gt 0) {
    Write-Output "Missing Directories:"
    $missingDirs | ForEach-Object { Write-Output "  - $_" }
}

if ($result.STATUS -eq "FAIL") {
    exit 1
}

exit 0
