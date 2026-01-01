#!/usr/bin/env pwsh
# Phase-1 Common PowerShell Functions (Python Console App)
# Minimal + no Git/branch/specs workflow assumptions.

function Get-ProjectRoot {
    # Use current working directory as the Phase-1 project root
    return (Get-Location).Path
}

function Test-FileExists {
    param([string]$Path, [string]$Description)

    if (Test-Path -Path $Path -PathType Leaf) {
        Write-Output "  ✓ $Description"
        return $true
    } else {
        Write-Output "  ✗ $Description"
        return $false
    }
}

function Test-DirExists {
    param([string]$Path, [string]$Description)

    if (Test-Path -Path $Path -PathType Container) {
        Write-Output "  ✓ $Description"
        return $true
    } else {
        Write-Output "  ✗ $Description"
        return $false
    }
}

function Get-Phase1Paths {
    $root = Get-ProjectRoot

    [PSCustomObject]@{
        PROJECT_ROOT = $root
        APP          = Join-Path $root 'app.py'
        STORE        = Join-Path $root 'store.py'
        SPEC         = Join-Path $root 'spec.md'
        README       = Join-Path $root 'README.md'
        SKILLS_DIR   = Join-Path $root 'skills'
    }
}
