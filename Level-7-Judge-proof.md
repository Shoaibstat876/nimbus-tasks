#TERMINAL OUTPUT (FRESH)
PS D:\Shoaib Project\nimbus-tasks> $env:PATH = "$env:USERPROFILE\tools\helm;$env:PATH"
>> helm list -n nimbus
>> 
NAME    NAMESPACE       REVISION        UPDATED                                 STATUS          CHART              APP VERSION
nimbus  nimbus          3               2026-01-28 06:34:09.8292426 +0500 PKT   deployed        nimbus-0.1.0       phase4     
PS D:\Shoaib Project\nimbus-tasks> kubectl get pods -n nimbus
>> 
NAME                              READY   STATUS    RESTARTS   AGE
nimbus-backend-94d4fcfd8-b5jh7    1/1     Running   0          2m9s
nimbus-frontend-f8c7db4d9-24nmx   1/1     Running   0          70m
PS D:\Shoaib Project\nimbus-tasks> kubectl get deploy -n nimbus
>> 
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
nimbus-backend    1/1     1            1           123m
nimbus-frontend   1/1     1            1           123m
PS D:\Shoaib Project\nimbus-tasks> kubectl get svc -n nimbus
>> 
NAME              TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
nimbus-backend    ClusterIP   10.109.17.236    <none>        8000/TCP   125m
nimbus-frontend   ClusterIP   10.102.180.160   <none>        3000/TCP   125m
PS D:\Shoaib Project\nimbus-tasks> docker images | findstr /I "nimbus-backend nimbus-frontend"
>> 
WARNING: This output is designed for human readability. For machine-readable output, please use --format.
nimbus-backend:phase4                                                                                 d55d5b71a408       2.01GB          469MB        
nimbus-frontend:phase4                                                                                750c954995fe        817MB          159MB        
PS D:\Shoaib Project\nimbus-tasks> minikube image ls | findstr /I "nimbus-backend nimbus-frontend"
>> 
docker.io/library/nimbus-frontend:phase4
docker.io/library/nimbus-backend:phase4
PS D:\Shoaib Project\nimbus-tasks> kubectl get all -n nimbus
>>
NAME                                  READY   STATUS    RESTARTS   AGE
pod/nimbus-backend-94d4fcfd8-b5jh7    1/1     Running   0          8m20s
pod/nimbus-frontend-f8c7db4d9-24nmx   1/1     Running   0          76m

NAME                      TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
service/nimbus-backend    ClusterIP   10.109.17.236    <none>        8000/TCP   129m
service/nimbus-frontend   ClusterIP   10.102.180.160   <none>        3000/TCP   129m

NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nimbus-backend    1/1     1            1           129m
deployment.apps/nimbus-frontend   1/1     1            1           129m

NAME                                         DESIRED   CURRENT   READY   AGE
replicaset.apps/nimbus-backend-94d4fcfd8     1         1         1       8m20s
replicaset.apps/nimbus-backend-9767c8544     0         0         0       129m
replicaset.apps/nimbus-backend-c5c78884b     0         0         0       103m
replicaset.apps/nimbus-frontend-6479db7657   0         0         0       129m
replicaset.apps/nimbus-frontend-f8c7db4d9    1         1         1       103m
PS D:\Shoaib Project\nimbus-tasks> 