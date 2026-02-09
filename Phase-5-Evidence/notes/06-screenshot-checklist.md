# Phase V Screenshot Checklist (Step 11)

- [ ] Cloud context (kubectl current-context)
- [ ] Cluster info (kubectl cluster-info)
- [ ] Nodes list (kubectl get nodes -o wide)
- [ ] Dapr system pods (kubectl get pods -n dapr-system)
- [ ] Nimbus components (kubectl get components -n nimbus)
- [ ] Pods running (kubectl -n nimbus get pods -o wide)
- [ ] Ingress (kubectl -n nimbus get ingress)
- [ ] Public URL in browser: http://129.212.246.79/
- [ ] GitHub Actions run is GREEN (Phase V - Build & Push Images (GHCR))
- [ ] GHCR packages show tags: phase5 + latest commit SHA
