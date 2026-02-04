# Phase IV — Kubernetes Specification

## Namespace
All resources MUST run in `nimbus` namespace.

## Deployments
- Separate deployments for frontend and backend
- One container per pod

## Services
- ClusterIP only
- No NodePort

## Ingress
- Host-based routing
- Path routing for /api

## Verification
- kubectl get pods
- kubectl get svc
- kubectl get ingress
