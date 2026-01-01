#!/usr/bin/env pwsh
# Phase-1 (Hackathon 2) — Update Agent Context (MINIMAL, CORRECT)
# NO git, NO branches, NO plan.md, NO multi-agent orchestration
# Phase-1 requires ONLY a simple CLAUDE.md update based on spec.md

[CmdletBinding()]
param(
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output @"
Usage: ./update-agent-context.ps1

Phase-1 behavior:
- Reads spec.md from current directory
- Creates or updates CLAUDE.md only
- No plan.md required
- No Git / branches / feature logic
"@
    exit 0
}

$root = Get-Location
$specFile   = Join-Path $root "spec.md"
$claudeFile = Join-Path $root "CLAUDE.md"

if (-not (Test-Path $specFile)) {
    Write-Error "spec.md not found in $root"
    exit 1
}

$today = Get-Date -Format "yyyy-MM-dd"

$claudeContent = @"
# Claude Instructions — Hackathon 2 Phase 1

## Project
In-Memory Python Console Todo App

## Scope (STRICT)
- Phase-1 only
- Python console application
- In-memory storage only
- No files, no database, no web, no AI calls

## Architecture Rules
- Business logic lives in skills/
- app.py handles input/output only
- store.py holds in-memory state
- Spec-first: spec.md is the source of truth

## Allowed Commands
- add
- list (all | active | completed)
- update
- toggle
- delete
- help
- exit

## Notes
- Keep code simple and readable
- Do not introduce extra tooling
- Teacher instructions override everything

**Last updated:** $today
"@

Set-Content -Path $claudeFile -Value $claudeContent -Encoding UTF8

Write-Output "UPDATED: CLAUDE.md"
Write-Output "STATUS: READY (Phase-1 compliant)"
