# Kubernetes Deployment Configuration

This directory contains the Kubernetes configuration files for deploying the Migratio platform to different environments.

## Directory Structure

```
kubernetes/
├── base/                 # Base configurations shared across environments
│   ├── api-gateway/      # API Gateway service configurations
│   ├── user-service/     # User service configurations
│   ├── assessment/       # Assessment service configurations
│   ├── recommendation/   # Recommendation service configurations
│   ├── program-service/  # Program service configurations
│   ├── roadmap-service/  # Roadmap service configurations
│   ├── pdf-service/      # PDF service configurations
│   ├── client/           # Frontend client configurations
│   ├── mongodb/          # MongoDB database configurations
│   └── redis/            # Redis cache configurations
├── staging/              # Staging environment-specific configurations
├── production/           # Production environment-specific configurations
└── local/                # Local development configurations
```

## Deployment Strategy

The Migratio platform uses Kustomize for managing environment-specific configurations. Each environment (staging, production) extends the base configurations with environment-specific settings.

## Usage

To deploy to a specific environment:

```bash
# Deploy to staging
kubectl apply -k kubernetes/staging/

# Deploy to production
kubectl apply -k kubernetes/production/

# Deploy to local development
kubectl apply -k kubernetes/local/
```

## Environment Configuration

Each environment has its own configuration values defined in:

- `configmap.yaml`: Non-sensitive configuration values
- `secrets.yaml`: Sensitive configuration values (encrypted)

## Monitoring and Logging

The Kubernetes configurations include:

- Prometheus for metrics collection
- Grafana for metrics visualization
- ELK stack for log aggregation and analysis

## Network Policies

Network policies are defined to restrict communication between services, following the principle of least privilege.

## Resource Management

Resource requests and limits are defined for all services to ensure efficient resource utilization and prevent resource starvation.

## Scaling

Horizontal Pod Autoscalers (HPA) are configured for services that require dynamic scaling based on CPU/memory usage or custom metrics.

## Backup and Disaster Recovery

Backup configurations for databases and persistent volumes are included to ensure data durability and disaster recovery capabilities.
