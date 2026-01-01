# TodoList Subagents

This folder contains purpose-built AI subagents for the Hackathon-2 TodoList project.

## Design Philosophy
- Each agent has ONE responsibility
- Agents align strictly with the `.specify` workflow
- No cross-project contamination (no textbook, no RAG)

## Subagents Overview

| Agent | Responsibility |
|-----|---------------|
| requirements-agent | Spec clarity & completeness |
| tasks-agent | Executable task breakdown |
| implementation-agent | Disciplined task execution |
| qa-agent | Consistency & checklist validation |
| ux-agent | User flow & UX requirement coverage |

## Why This Matters
This structure demonstrates:
- Professional engineering discipline
- Traceability from idea → spec → code
- Low risk, high clarity delivery

Judges can clearly see **how decisions flow through the system**.
