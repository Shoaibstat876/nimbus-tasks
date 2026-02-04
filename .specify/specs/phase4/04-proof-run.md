# Phase IV — Proof Run Specification

## Required Proofs
1. Minikube start
2. Namespace creation
3. Helm install output
4. Pods running
5. Ingress available
6. curl to domain
7. Auth endpoint success

## Proof Rules
- Commands shown fully
- No cuts during critical steps
- Terminal preferred over UI

## Env & Skills Verification

### Frontend env verification
Command:
- node scripts/verify-env.mjs

Evidence:
- evidence-4/level-x-verify-env.png

### Skills runner (Phase 4)
Command:
- python scripts/phase4/agents/run.py

Evidence:
- evidence-4/level-x-skills-run.png
