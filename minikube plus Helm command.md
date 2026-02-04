PS D:\Shoaib Project\nimbus-tasks> minikube stop
>> minikube delete
>> 
E0128 04:30:47.174500    9640 daemonize_windows.go:38] error terminating scheduled stop for profile minikube: stopping schedule-stop service for profile minikube: NewSession: new client: new client: Error creating new ssh host from driver: Error getting ssh port for driver: get ssh host-port: unable to inspect a not running container to get SSH port
✋  Stopping node "minikube"  ...
🛑  1 node stopped.
🔥  Deleting "minikube" in docker ...
🔥  Deleting container "minikube" ...
🔥  Removing C:\Users\Shoaib\.minikube\machines\minikube ...
💀  Removed all traces of the "minikube" cluster.
PS D:\Shoaib Project\nimbus-tasks> minikube start --driver=docker
>> 
😄  minikube v1.37.0 on Microsoft Windows 11 Pro 10.0.26200.7628 Build 26200.7628
✨  Using the docker driver based on user configuration
📌  Using Docker Desktop driver with root privileges
👍  Starting "minikube" primary control-plane node in "minikube" cluster
🚜  Pulling base image v0.0.48 ...
🔥  Creating docker container (CPUs=2, Memory=4000MB) ... 
❗  Failing to connect to https://registry.k8s.io/ from both inside the minikube container and host machine
💡  To pull new external images, you may need to configure a proxy: https://minikube.sigs.k8s.io/docs/reference/networking/proxy/
🐳  Preparing Kubernetes v1.34.0 on Docker 28.4.0 ... 
🔗  Configuring bridge CNI (Container Networking Interface) ...
🔎  Verifying Kubernetes components...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
PS D:\Shoaib Project\nimbus-tasks> kubectl get nodes
>> kubectl cluster-info
>>
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   24s   v1.34.0
Kubernetes control plane is running at https://127.0.0.1:60365
CoreDNS is running at https://127.0.0.1:60365/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
PS D:\Shoaib Project\nimbus-tasks> $env:PATH = "$env:USERPROFILE\tools\helm;$env:PATH"
>> helm version
>>
version.BuildInfo{Version:"v3.14.4", GitCommit:"81c902a123462fd4052bc5e9aa9c513c4c8fc142", GitTreeState:"clean", GoVersion:"go1.21.9"}
PS D:\Shoaib Project\nimbus-tasks> helm install nimbus .\helm\nimbus --namespace nimbus --create-namespace
>>
NAME: nimbus
LAST DEPLOYED: Wed Jan 28 04:33:18 2026
NAMESPACE: nimbus
STATUS: deployed
REVISION: 1
TEST SUITE: None
PS D:\Shoaib Project\nimbus-tasks> 