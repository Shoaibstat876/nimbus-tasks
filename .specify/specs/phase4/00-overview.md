# Phase IV — Overview

Phase IV converts the Nimbus system from application code into a deployable cloud-native system.

## Goals
- Containerize frontend and backend
- Deploy using Kubernetes
- Expose via Ingress
- Parameterize using Helm
- Produce judge-verifiable proof

## Out of Scope
- CI/CD
- Cloud provider deployment
- Autoscaling

## Success Criteria
- `helm install` succeeds
- Pods reach Running state
- Ingress responds
- API auth works through Ingress
