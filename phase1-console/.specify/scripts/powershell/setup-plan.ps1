#!/usr/bin/env pwsh
# Phase-1 (Hackathon 2) — Setup Spec/Plan Files (NO git, NO branches, NO specs/<feature>)
# Creates spec.md if missing. Does NOT create plan.md (Phase-1 doesn't require it).

[CmdletBinding()]
param(
    [switch]$Json,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output @"
Usage: ./setup-plan.ps1 [-Json]

Phase-1 helper:
- Ensures spec.md exists in the current directory (Phase-1 root).
- Phase-1 does NOT require plan.md / tasks.md, so they are not created.

Run this INSIDE:
  D:\Shoaib Project\hackathon2_phase1_python
"@
    exit 0
}

$root = (Get-Location).Path

$specPath = Join-Path $root "spec.md"

$specContent = @"
# Hackathon 2 — Phase 1 Spec

## Goal
Build a Python in-memory console todo app using spec-first and reusable skills.

## Commands
- add
- list (all / active / completed)
- update
- toggle
- delete
- help
- exit

## Rules
- In-memory only
- No files, DB, web, AI
- Skills contain logic
- app.py handles I/O only
"@

if (-not (Test-Path $specPath -PathType Leaf)) {
    Set-Content -Path $specPath -Value $specContent -Encoding UTF8
}

$out = [PSCustomObject]@{
    PROJECT_ROOT = $root
    SPEC_FILE    = $specPath
    STATUS       = "READY"
}

if ($Json) {
    $out | ConvertTo-Json -Compress
} else {
    Write-Output "PROJECT_ROOT: $($out.PROJECT_ROOT)"
    Write-Output "SPEC_FILE:    $($out.SPEC_FILE)"
    Write-Output "STATUS:       $($out.STATUS)"
}
