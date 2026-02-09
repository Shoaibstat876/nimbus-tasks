# Nimbus Tasks — Hackathon 2 — Phase V (90s Demo Script)

**Published URL:** http://129.212.246.79/

## 0–10s — Intro
Hi, this is Nimbus Tasks Phase V. I’m showing a cloud-deployed, event-driven app on Kubernetes with Dapr sidecars and CI/CD to GHCR.

## 10–30s — App + Ingress
Open http://129.212.246.79/ and show the UI loads through the Kubernetes Ingress.

## 30–55s — Kubernetes proof
Show pods in the nimbus namespace are healthy:
- backend (2/2, with daprd sidecar)
- worker (2/2, with daprd sidecar)
- frontend (1/1)

Show ingress host nimbus.local mapped to the public IP.

## 55–75s — Event-driven proof
Explain backend publishes task events and reminder events via Dapr pubsub, and the worker consumes them.
Show last lines of backend + worker logs as evidence.

## 75–90s — CI/CD proof
Show GitHub Actions workflow "Phase V - Build & Push Images (GHCR)" is green.
Show GHCR packages for nimbus-backend and nimbus-worker with tags:
- phase5
- <commit-sha>

Done.
