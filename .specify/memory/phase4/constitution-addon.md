# Phase IV Constitution Addendum
(Kubernetes + Helm Deployment)

## Scope
This addendum governs Phase IV only. All prior constitutions remain in force unless explicitly extended here.

## Non-Negotiable Laws

1. **Container First**
   - Every runtime component MUST be built as a Docker image.
   - No local dev shortcuts (localhost, ports, host assumptions).

2. **Kubernetes as Source of Truth**
   - Application state is defined by Kubernetes manifests or Helm templates only.
   - Manual pod edits are forbidden.

3. **Ingress = Single Entry Point**
   - Frontend and backend MUST be same-origin behind Ingress.
   - No cross-origin frontend → backend communication.

4. **Helm Is Mandatory**
   - Raw manifests may exist for learning, but deployment MUST happen via Helm.
   - Values.yaml controls all environment-specific behavior.

5. **Proof Over Assumption**
   - Every claim requires CLI proof (kubectl, helm, curl).
   - Screenshots and logs are mandatory for evaluation.

## Forbidden
- Hardcoded IPs
- Hardcoded secrets
- Manual kubectl edits to running resources
- Skipping evidence

## Definition of Done (Phase IV)
- Docker images build successfully
- Helm install succeeds
- Pods are Running
- Ingress responds via domain
- Auth + API reachable
- Evidence captured
