# Monitoring and Logging Configuration

This directory contains the configuration files for setting up monitoring and logging for the Migratio platform.

## Overview

The Migratio platform uses the following tools for monitoring and logging:

- **Prometheus**: For metrics collection and alerting
- **Grafana**: For metrics visualization and dashboards
- **ELK Stack**: For log aggregation and analysis
  - Elasticsearch: Log storage and search
  - Logstash: Log processing pipeline
  - Kibana: Log visualization and analysis
- **Jaeger**: For distributed tracing

## Directory Structure

```
monitoring/
├── prometheus/           # Prometheus configuration
├── grafana/              # Grafana dashboards and configuration
├── elasticsearch/        # Elasticsearch configuration
├── logstash/             # Logstash configuration
├── kibana/               # Kibana configuration
├── jaeger/               # Jaeger configuration
└── alerts/               # Alert rules and notification configurations
```

## Deployment

The monitoring stack is deployed using Kubernetes manifests:

```bash
# Deploy monitoring stack
kubectl apply -k monitoring/

# Deploy logging stack
kubectl apply -k logging/
```

## Metrics Collection

### Application Metrics

Each service in the Migratio platform exposes Prometheus metrics at the `/metrics` endpoint. The following metrics are collected:

- HTTP request count, duration, and error rates
- Database query count, duration, and error rates
- Cache hit/miss rates
- Memory usage
- CPU usage
- Custom business metrics

### System Metrics

System-level metrics are collected using the Node Exporter:

- CPU usage
- Memory usage
- Disk usage
- Network traffic
- System load

## Dashboards

The following Grafana dashboards are available:

- **Platform Overview**: High-level overview of the entire platform
- **Service Health**: Detailed health metrics for each service
- **API Gateway**: API Gateway specific metrics
- **Database Performance**: MongoDB performance metrics
- **Cache Performance**: Redis performance metrics
- **User Activity**: User engagement and activity metrics
- **Business Metrics**: Business-specific metrics

## Alerting

Alerts are configured for the following conditions:

- Service availability
- High error rates
- High latency
- Resource utilization (CPU, memory, disk)
- Database performance
- Cache performance
- Business metric anomalies

Alert notifications are sent via:

- Email
- Slack
- PagerDuty

## Log Management

Logs from all services are collected, processed, and stored in Elasticsearch. The following log levels are used:

- **ERROR**: Critical errors that require immediate attention
- **WARN**: Potential issues that should be investigated
- **INFO**: Normal operational information
- **DEBUG**: Detailed information for debugging (only in non-production environments)

## Distributed Tracing

Jaeger is used for distributed tracing across services. Each service is instrumented to generate trace spans for:

- HTTP requests
- Database queries
- Cache operations
- External API calls

## Access Control

Access to monitoring and logging tools is restricted based on roles:

- **Admin**: Full access to all monitoring and logging tools
- **Developer**: Read access to all monitoring and logging tools
- **Support**: Read access to specific dashboards and logs
- **Business**: Read access to business metrics dashboards

## Retention Policies

The following retention policies are configured:

- **Metrics**: 30 days
- **Logs**: 14 days
- **Traces**: 7 days

## Backup and Disaster Recovery

Backup configurations for monitoring and logging data:

- Daily backups of Prometheus data
- Daily backups of Elasticsearch indices
- Retention of 30 days for backups
