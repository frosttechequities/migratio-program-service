# CI/CD Pipeline Configuration

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Migratio platform.

## Overview

The CI/CD pipeline automates the building, testing, and deployment of the Migratio platform, ensuring consistent and reliable releases. The pipeline is implemented using GitHub Actions and follows a trunk-based development approach with feature branches.

## Pipeline Stages

The CI/CD pipeline consists of the following stages:

1. **Code Validation**: Linting, formatting, and static code analysis
2. **Unit Testing**: Running unit tests for all components
3. **Integration Testing**: Running integration tests across services
4. **Build**: Building Docker images for all services
5. **Staging Deployment**: Deploying to the staging environment
6. **E2E Testing**: Running end-to-end tests in the staging environment
7. **Production Deployment**: Deploying to the production environment

## Workflow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Feature    │────▶│  Pull       │────▶│  Develop    │────▶│  Release    │
│  Branch     │     │  Request    │     │  Branch     │     │  Branch     │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │             │     │             │     │             │
                    │  Validate   │     │  Deploy to  │     │  Deploy to  │
                    │  & Test     │     │  Staging    │     │  Production │
                    │             │     │             │     │             │
                    └─────────────┘     └─────────────┘     └─────────────┘
```

## GitHub Actions Workflows

### 1. Pull Request Workflow

This workflow runs on every pull request to the `develop` branch:

```yaml
# .github/workflows/pull-request.yml
name: Pull Request

on:
  pull_request:
    branches: [ develop ]

jobs:
  validate:
    name: Validate Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Lint code
        run: npm run lint
      - name: Check formatting
        run: npm run format:check
      - name: Run static code analysis
        run: npm run analyze

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm test
      - name: Upload coverage reports
        uses: codecov/codecov-action@v2
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: true

  integration-test:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: test
    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017
      redis:
        image: redis:6
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run integration tests
        run: npm run test:integration
        env:
          MONGODB_URI: mongodb://localhost:27017/migratio_test
          REDIS_HOST: localhost
          REDIS_PORT: 6379

  build:
    name: Build Docker Images
    runs-on: ubuntu-latest
    needs: integration-test
    steps:
      - uses: actions/checkout@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Build API Gateway
        uses: docker/build-push-action@v2
        with:
          context: ./server/api-gateway
          push: false
          tags: migratio/api-gateway:pr-${{ github.event.pull_request.number }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      # Repeat for other services
      - name: Build User Service
        uses: docker/build-push-action@v2
        with:
          context: ./server/user-service
          push: false
          tags: migratio/user-service:pr-${{ github.event.pull_request.number }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      # ... other services
      - name: Build Client
        uses: docker/build-push-action@v2
        with:
          context: ./client
          push: false
          tags: migratio/client:pr-${{ github.event.pull_request.number }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 2. Develop Branch Workflow

This workflow runs when code is merged into the `develop` branch:

```yaml
# .github/workflows/develop.yml
name: Develop

on:
  push:
    branches: [ develop ]

jobs:
  build-and-push:
    name: Build and Push Images
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build and push API Gateway
        uses: docker/build-push-action@v2
        with:
          context: ./server/api-gateway
          push: true
          tags: migratio/api-gateway:develop
          cache-from: type=gha
          cache-to: type=gha,mode=max
      # Repeat for other services
      - name: Build and push User Service
        uses: docker/build-push-action@v2
        with:
          context: ./server/user-service
          push: true
          tags: migratio/user-service:develop
          cache-from: type=gha
          cache-to: type=gha,mode=max
      # ... other services
      - name: Build and push Client
        uses: docker/build-push-action@v2
        with:
          context: ./client
          push: true
          tags: migratio/client:develop
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build-and-push
    steps:
      - uses: actions/checkout@v2
      - name: Install kubectl
        uses: azure/setup-kubectl@v1
      - name: Set Kubernetes context
        uses: azure/k8s-set-context@v1
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG_STAGING }}
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f ./infrastructure/kubernetes/staging/
          kubectl set image deployment/api-gateway api-gateway=migratio/api-gateway:develop
          kubectl set image deployment/user-service user-service=migratio/user-service:develop
          # ... other services
          kubectl set image deployment/client client=migratio/client:develop
          kubectl rollout status deployment/api-gateway
          kubectl rollout status deployment/user-service
          # ... other services
          kubectl rollout status deployment/client

  e2e-tests:
    name: End-to-End Tests
    runs-on: ubuntu-latest
    needs: deploy-staging
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          E2E_BASE_URL: https://staging.migratio.com
          E2E_USERNAME: ${{ secrets.E2E_USERNAME }}
          E2E_PASSWORD: ${{ secrets.E2E_PASSWORD }}
```

### 3. Release Workflow

This workflow runs when a release branch is created:

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches:
      - 'release/**'

jobs:
  tag-release:
    name: Tag Release
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.extract_version.outputs.version }}
    steps:
      - uses: actions/checkout@v2
      - name: Extract version
        id: extract_version
        run: echo "::set-output name=version::$(echo ${{ github.ref }} | sed 's/refs\/heads\/release\///')"
      - name: Create tag
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git tag -a v${{ steps.extract_version.outputs.version }} -m "Release v${{ steps.extract_version.outputs.version }}"
          git push origin v${{ steps.extract_version.outputs.version }}

  build-and-push:
    name: Build and Push Images
    runs-on: ubuntu-latest
    needs: tag-release
    steps:
      - uses: actions/checkout@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build and push API Gateway
        uses: docker/build-push-action@v2
        with:
          context: ./server/api-gateway
          push: true
          tags: |
            migratio/api-gateway:latest
            migratio/api-gateway:${{ needs.tag-release.outputs.version }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      # Repeat for other services
      - name: Build and push User Service
        uses: docker/build-push-action@v2
        with:
          context: ./server/user-service
          push: true
          tags: |
            migratio/user-service:latest
            migratio/user-service:${{ needs.tag-release.outputs.version }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      # ... other services
      - name: Build and push Client
        uses: docker/build-push-action@v2
        with:
          context: ./client
          push: true
          tags: |
            migratio/client:latest
            migratio/client:${{ needs.tag-release.outputs.version }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [tag-release, build-and-push]
    environment: production
    steps:
      - uses: actions/checkout@v2
      - name: Install kubectl
        uses: azure/setup-kubectl@v1
      - name: Set Kubernetes context
        uses: azure/k8s-set-context@v1
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG_PRODUCTION }}
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f ./infrastructure/kubernetes/production/
          kubectl set image deployment/api-gateway api-gateway=migratio/api-gateway:${{ needs.tag-release.outputs.version }}
          kubectl set image deployment/user-service user-service=migratio/user-service:${{ needs.tag-release.outputs.version }}
          # ... other services
          kubectl set image deployment/client client=migratio/client:${{ needs.tag-release.outputs.version }}
          kubectl rollout status deployment/api-gateway
          kubectl rollout status deployment/user-service
          # ... other services
          kubectl rollout status deployment/client

  create-release:
    name: Create GitHub Release
    runs-on: ubuntu-latest
    needs: [tag-release, deploy-production]
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Generate changelog
        id: changelog
        uses: metcalfc/changelog-generator@v1.0.0
        with:
          myToken: ${{ secrets.GITHUB_TOKEN }}
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ needs.tag-release.outputs.version }}
          release_name: Release v${{ needs.tag-release.outputs.version }}
          body: |
            ## Changes in this Release
            ${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: false
```

### 4. Hotfix Workflow

This workflow runs when a hotfix branch is created:

```yaml
# .github/workflows/hotfix.yml
name: Hotfix

on:
  push:
    branches:
      - 'hotfix/**'

jobs:
  validate-and-test:
    name: Validate and Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Lint code
        run: npm run lint
      - name: Run unit tests
        run: npm test

  tag-hotfix:
    name: Tag Hotfix
    runs-on: ubuntu-latest
    needs: validate-and-test
    outputs:
      version: ${{ steps.extract_version.outputs.version }}
    steps:
      - uses: actions/checkout@v2
      - name: Extract version
        id: extract_version
        run: echo "::set-output name=version::$(echo ${{ github.ref }} | sed 's/refs\/heads\/hotfix\///')"
      - name: Create tag
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git tag -a v${{ steps.extract_version.outputs.version }} -m "Hotfix v${{ steps.extract_version.outputs.version }}"
          git push origin v${{ steps.extract_version.outputs.version }}

  build-and-push:
    name: Build and Push Images
    runs-on: ubuntu-latest
    needs: tag-hotfix
    steps:
      - uses: actions/checkout@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      # Build and push only the affected services
      # This example assumes the API Gateway is affected
      - name: Build and push API Gateway
        uses: docker/build-push-action@v2
        with:
          context: ./server/api-gateway
          push: true
          tags: |
            migratio/api-gateway:${{ needs.tag-hotfix.outputs.version }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-hotfix:
    name: Deploy Hotfix
    runs-on: ubuntu-latest
    needs: [tag-hotfix, build-and-push]
    environment: production
    steps:
      - uses: actions/checkout@v2
      - name: Install kubectl
        uses: azure/setup-kubectl@v1
      - name: Set Kubernetes context
        uses: azure/k8s-set-context@v1
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG_PRODUCTION }}
      - name: Deploy to Kubernetes
        run: |
          # Deploy only the affected services
          # This example assumes the API Gateway is affected
          kubectl set image deployment/api-gateway api-gateway=migratio/api-gateway:${{ needs.tag-hotfix.outputs.version }}
          kubectl rollout status deployment/api-gateway

  create-hotfix-release:
    name: Create GitHub Hotfix Release
    runs-on: ubuntu-latest
    needs: [tag-hotfix, deploy-hotfix]
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Generate changelog
        id: changelog
        uses: metcalfc/changelog-generator@v1.0.0
        with:
          myToken: ${{ secrets.GITHUB_TOKEN }}
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ needs.tag-hotfix.outputs.version }}
          release_name: Hotfix v${{ needs.tag-hotfix.outputs.version }}
          body: |
            ## Hotfix Changes
            ${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: false
```

## Branching Strategy

The Migratio platform follows a trunk-based development approach with the following branches:

1. **develop**: The main development branch where all feature branches are merged
2. **feature/xxx**: Feature branches for new features or enhancements
3. **bugfix/xxx**: Bugfix branches for non-critical bug fixes
4. **release/x.x.x**: Release branches for preparing releases
5. **hotfix/x.x.x**: Hotfix branches for critical production fixes

### Branch Flow

```
develop ──────────────────────────────────────────────────────────────▶
   │                 │                  │                  │
   │                 │                  │                  │
   ▼                 ▼                  ▼                  ▼
feature/a        feature/b         release/1.0.0       hotfix/1.0.1
   │                 │                  │                  │
   └─────────────────┘                  │                  │
            │                           │                  │
            └───────────────────────────┘                  │
                        │                                  │
                        └──────────────────────────────────┘
                                       │
                                       ▼
                                    main
```

## Environments

The Migratio platform uses the following environments:

1. **Development**: Local development environment
2. **Staging**: Pre-production environment for testing
3. **Production**: Live environment for end users

### Environment Configuration

Environment-specific configuration is managed using Kubernetes ConfigMaps and Secrets:

```yaml
# infrastructure/kubernetes/staging/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: migratio-config
  namespace: migratio-staging
data:
  NODE_ENV: "staging"
  API_URL: "https://api.staging.migratio.com"
  CLIENT_URL: "https://staging.migratio.com"
  LOG_LEVEL: "info"
  # ... other configuration values
```

```yaml
# infrastructure/kubernetes/staging/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: migratio-secrets
  namespace: migratio-staging
type: Opaque
data:
  JWT_SECRET: <base64-encoded-value>
  MONGODB_URI: <base64-encoded-value>
  REDIS_PASSWORD: <base64-encoded-value>
  # ... other secret values
```

## Deployment Strategy

The Migratio platform uses a rolling update deployment strategy to minimize downtime:

```yaml
# infrastructure/kubernetes/production/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: migratio-production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: migratio/api-gateway:latest
        ports:
        - containerPort: 8000
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 15
          periodSeconds: 20
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        envFrom:
        - configMapRef:
            name: migratio-config
        - secretRef:
            name: migratio-secrets
```

## Monitoring and Alerting

The CI/CD pipeline includes monitoring and alerting for deployment status:

```yaml
# .github/workflows/monitoring.yml
name: Deployment Monitoring

on:
  workflow_run:
    workflows: ["Develop", "Release", "Hotfix"]
    types:
      - completed

jobs:
  monitor-deployment:
    name: Monitor Deployment
    runs-on: ubuntu-latest
    steps:
      - name: Check deployment status
        id: check_status
        run: |
          if [[ "${{ github.event.workflow_run.conclusion }}" == "success" ]]; then
            echo "::set-output name=status::success"
          else
            echo "::set-output name=status::failure"
          fi
      
      - name: Send success notification
        if: steps.check_status.outputs.status == 'success'
        uses: rtCamp/action-slack-notify@v2
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
          SLACK_CHANNEL: deployments
          SLACK_COLOR: good
          SLACK_TITLE: Deployment Successful
          SLACK_MESSAGE: "Workflow ${{ github.event.workflow_run.name }} completed successfully!"
      
      - name: Send failure notification
        if: steps.check_status.outputs.status == 'failure'
        uses: rtCamp/action-slack-notify@v2
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
          SLACK_CHANNEL: deployments
          SLACK_COLOR: danger
          SLACK_TITLE: Deployment Failed
          SLACK_MESSAGE: "Workflow ${{ github.event.workflow_run.name }} failed! Please check the logs: ${{ github.event.workflow_run.html_url }}"
```

## Security Scanning

The CI/CD pipeline includes security scanning for vulnerabilities:

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * *'  # Run daily at midnight
  workflow_dispatch:  # Allow manual triggering

jobs:
  dependency-scan:
    name: Dependency Vulnerability Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Run npm audit
        run: npm audit --audit-level=high
      
  docker-scan:
    name: Docker Image Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Build API Gateway image
        uses: docker/build-push-action@v2
        with:
          context: ./server/api-gateway
          push: false
          tags: migratio/api-gateway:scan
          outputs: type=docker,dest=/tmp/api-gateway.tar
      - name: Scan API Gateway image
        uses: anchore/scan-action@v3
        with:
          image: migratio/api-gateway:scan
          fail-build: true
          severity-cutoff: high
      # Repeat for other services
  
  code-scan:
    name: Code Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v1
        with:
          languages: javascript
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v1
```

## Conclusion

The CI/CD pipeline for the Migratio platform automates the entire software delivery process, from code validation to production deployment. This ensures consistent, reliable, and secure releases while minimizing manual intervention and potential human errors.
