# Kubernetes Homelab vs AWS EKS## About This Project

## About This Project

This project is a comparative study of Kubernetes running in two different environments: a local homelab using VirtualBox and a managed cloud environment using AWS EKS (Elastic Kubernetes Service). A three-tier "Book Review" microservice application was deployed in both environments to analyze the differences in setup complexity, networking, storage, scalability, and operational overhead.

## Project Structure

k8s-homelab-vs-eks/
├── backend/                  # Node.js REST API
├── frontend/                 # Next.js web application
├── k8s/
│   ├── homelab/              # Kubernetes manifests for VirtualBox environment
│   └── eks/                  # Kubernetes manifests for AWS EKS environment
├── .github/workflows/        # GitHub Actions CI/CD pipeline
└── eks-cluster.yaml          # EKS cluster definition for eksctl

## Tech Stack

| Category | Tool |
|---|---|
| Container Orchestration | Kubernetes (kubeadm / AWS EKS) |
| Virtualization (Homelab) | VirtualBox |
| Cloud Provider | AWS (EKS, ELB, EBS) |
| GitOps | Argo CD |
| CI/CD | GitHub Actions |
| Observability | Prometheus & Grafana |
| Container Registry | Docker Hub |
| Networking (Homelab) | MetalLB, Nginx Ingress Controller |

## Environment Setup

### Homelab (VirtualBox)

**Requirements:**
- Windows 11 + VirtualBox
- 3 VMs: 1 master + 2 workers (Ubuntu 22.04, 2 vCPU, 4GB RAM each)

**Deploy the application:**
```bash
kubectl apply -f k8s/homelab/
```

**Install Argo CD:**
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

---

### AWS EKS

**Requirements:**
- AWS CLI (configured with IAM user credentials)
- eksctl
- kubectl
- Helm

**Create the EKS cluster:**
```bash
eksctl create cluster -f eks-cluster.yaml
```

**Install EBS CSI Driver (required for persistent storage):**
```bash
eksctl utils associate-iam-oidc-provider --cluster book-review-eks --region eu-north-1 --approve

eksctl create addon --name aws-ebs-csi-driver --cluster book-review-eks --region eu-north-1

eksctl create iamserviceaccount \
  --name ebs-csi-controller-sa \
  --namespace kube-system \
  --cluster book-review-eks \
  --region eu-north-1 \
  --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
  --approve \
  --override-existing-serviceaccounts
```

**Deploy the application:**
```bash
kubectl apply -f k8s/eks/
```

**Install Argo CD:**
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

**Install Prometheus & Grafana:**
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring
helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring
kubectl patch svc prometheus-grafana -n monitoring -p '{"spec": {"type": "LoadBalancer"}}'
```

**Delete the cluster (to stop AWS billing):**
```bash
eksctl delete cluster --name book-review-eks --region eu-north-1 --disable-nodegroup-eviction
```

---

## CI/CD Pipeline

On every push to the `main` branch, GitHub Actions automatically:
1. Builds new Docker images for backend and frontend
2. Pushes them to Docker Hub
3. Updates the image tags in the Kubernetes manifests
4. Argo CD detects the change and syncs the cluster to the new state

---

## Key Findings

| Parameter | Homelab (VirtualBox) | AWS EKS |
|---|---|---|
| Setup time | ~2-4 hours | ~14 minutes |
| Load Balancer | MetalLB (manual) | AWS ELB (automatic) |
| Storage | hostPath / manual PV | EBS (dynamic provisioning) |
| Networking | VirtualBox internal + MetalLB | AWS VPC + Security Groups |
| Estimated cost | ~5€/month (electricity) | ~$186/month |
| Scaling | Manual | Automatic (Auto Scaling Group) |
| Disaster recovery | VM Snapshots | AWS managed |
| Learning value | High | Medium |
| Production readiness | Low | High |

---

## Conclusions

The homelab environment required significantly more manual configuration at every layer — networking, storage, and load balancing — making it an excellent environment for learning the internals of Kubernetes. AWS EKS abstracts most of this complexity, reducing setup time from hours to minutes and providing production-grade reliability out of the box.

Despite the infrastructure differences, the same GitOps workflow powered by Argo CD worked consistently across both environments, demonstrating that application delivery can be standardized regardless of the underlying platform.






