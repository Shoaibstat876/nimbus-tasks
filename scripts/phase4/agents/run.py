import subprocess
import sys

def run(cmd: str):
    print(f"\n$ {cmd}")
    try:
        subprocess.run(cmd, shell=True, check=False)
    except Exception as e:
        print(f"[warn] {e}")

print("=" * 60)
print("NIMBUS TASKS — PHASE IV SKILLS RUN")
print("Docker + Kubernetes + Helm (Local)")
print("=" * 60)

# ---- Versions ----
print("\n[1] Tool Versions")
run("docker version")
run("kubectl version --client")
run("helm version")
run("minikube version")

# ---- Cluster Status ----
print("\n[2] Kubernetes Cluster Status")
run("kubectl get nodes")
run("kubectl -n nimbus get pods")
run("kubectl -n nimbus get svc")
run("kubectl -n nimbus get ingress")

# ---- Helm Proof ----
print("\n[3] Helm Release Proof")
run("helm list -n nimbus")
run("helm status nimbus -n nimbus")

# ---- Ingress Proof ----
print("\n[4] Ingress Routing Proof")
run('curl -I http://nimbus.local/ | findstr /i "HTTP/ location:"')
run("curl http://nimbus.local/api/health")

print("\n✔ Phase IV skill run completed (read-only verification)")
