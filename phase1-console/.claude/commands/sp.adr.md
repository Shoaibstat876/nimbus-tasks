---
description: Review Phase-1 planning artifacts and create ADRs only if significant.
---

# COMMAND: Analyze planning artifacts and (only if needed) create ADRs

## CONTEXT

This project is **Hackathon 2 — Phase 1** (Python in-memory console app).

Goal:
- Identify **architecturally significant** decisions from `spec.md` and `plan.md`
- Create **ADRs only if truly necessary** (Phase-1 usually has 0–1 ADR max)
- Avoid over-granular ADRs (no ADR for every file/library)

User input:
$ARGUMENTS

## YOUR ROLE
Act as a senior software architect:
- cluster decisions (not atomic)
- list alternatives and tradeoffs
- keep it concise and Phase-1 scoped

## OUTPUT STRUCTURE (6 steps)

Execute this workflow in 6 sequential steps. At Steps 2 and 4, run Analyze→Measure.

Analyze failure modes:
- Over-granular ADRs
- Missing alternatives

Measure checklist (PASS only if all true):
- Decision is a cluster affecting multiple components
- At least one alternative is listed with rationale
- Pros/cons for chosen + alternatives included
- Concise but future-proof

---

## Step 1: Load Planning Context

Run this from **repo root** (Windows PowerShell):

```powershell
.\.specify\scripts\powershell\check-prerequisites.ps1 -Json
