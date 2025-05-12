# API Gateway Configuration

This document outlines the configuration for the API Gateway service, which serves as the entry point for all client requests to the Migratio platform.

## Overview

The API Gateway provides a unified interface for clients to interact with the various microservices that make up the Migratio platform. It handles cross-cutting concerns such as authentication, request routing, rate limiting, and response caching.

## Technology Stack

The API Gateway is built using:

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Express Gateway**: API Gateway framework
- **Passport.js**: Authentication middleware
- **Redis**: For rate limiting and caching
- **JWT**: For token-based authentication

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client         │────▶│  API Gateway    │────▶│  Microservices  │
│  Applications   │     │                 │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               │
                               ▼
                        ┌─────────────────┐
                        │                 │
                        │  Redis          │
                        │  (Cache/Rate    │
                        │   Limiting)     │
                        │                 │
                        └─────────────────┘
```

## Core Features

### 1. Request Routing

The API Gateway routes requests to the appropriate microservice based on the URL path:

```javascript
// Example routing configuration
module.exports = {
  routes: [
    {
      name: 'user-service',
      paths: ['/api/users/*', '/api/auth/*', '/api/profiles/*'],
      serviceEndpoint: 'user-service'
    },
    {
      name: 'assessment-service',
      paths: ['/api/assessments/*', '/api/questions/*', '/api/responses/*'],
      serviceEndpoint: 'assessment-service'
    },
    {
      name: 'recommendation-service',
      paths: ['/api/recommendations/*', '/api/matches/*', '/api/gaps/*'],
      serviceEndpoint: 'recommendation-service'
    },
    {
      name: 'program-service',
      paths: ['/api/programs/*', '/api/countries/*', '/api/occupations/*'],
      serviceEndpoint: 'program-service'
    },
    {
      name: 'roadmap-service',
      paths: ['/api/roadmaps/*', '/api/timelines/*', '/api/tasks/*', '/api/milestones/*', '/api/documents/*'],
      serviceEndpoint: 'roadmap-service'
    },
    {
      name: 'pdf-service',
      paths: ['/api/pdf/*', '/api/templates/*'],
      serviceEndpoint: 'pdf-service'
    }
  ],
  serviceEndpoints: {
    'user-service': {
      url: 'http://user-service:3001'
    },
    'assessment-service': {
      url: 'http://assessment-service:3002'
    },
    'recommendation-service': {
      url: 'http://recommendation-service:3003'
    },
    'program-service': {
      url: 'http://program-service:3004'
    },
    'roadmap-service': {
      url: 'http://roadmap-service:3005'
    },
    'pdf-service': {
      url: 'http://pdf-service:3006'
    }
  }
};
```

### 2. Authentication and Authorization

The API Gateway handles authentication for all requests:

```javascript
// Authentication middleware configuration
module.exports = {
  policies: {
    auth: {
      jwt: {
        secretOrPublicKey: process.env.JWT_SECRET,
        jwtFromRequest: 'header:authorization',
        audience: 'migratio-api',
        issuer: 'migratio-auth'
      }
    },
    anonymous: {
      allow: true
    }
  },
  pipelines: [
    {
      name: 'public',
      paths: [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
        '/api/programs/public',
        '/api/countries/public'
      ],
      policies: [
        'anonymous'
      ]
    },
    {
      name: 'authenticated',
      paths: [
        '/api/*'
      ],
      policies: [
        'auth'
      ]
    }
  ]
};
```

### 3. Rate Limiting

Rate limiting prevents abuse of the API:

```javascript
// Rate limiting configuration
module.exports = {
  policies: {
    rateLimit: {
      rateLimitBy: 'ip',
      windowMs: 60 * 1000, // 1 minute
      max: 60, // 60 requests per minute
      message: 'Too many requests, please try again later.',
      statusCode: 429,
      headers: true,
      store: 'redis',
      redisOptions: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    }
  },
  pipelines: [
    {
      name: 'rate-limited',
      paths: [
        '/api/*'
      ],
      policies: [
        'rateLimit'
      ]
    }
  ]
};
```

### 4. Response Caching

Caching improves performance for frequently requested data:

```javascript
// Caching configuration
module.exports = {
  policies: {
    cache: {
      ttl: 60, // 60 seconds
      store: 'redis',
      redisOptions: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      },
      cacheBy: 'path',
      cacheIgnoreHeaders: ['authorization']
    }
  },
  pipelines: [
    {
      name: 'cacheable',
      paths: [
        '/api/programs/*',
        '/api/countries/*',
        '/api/occupations/*'
      ],
      methods: ['GET'],
      policies: [
        'cache'
      ]
    }
  ]
};
```

### 5. Request/Response Transformation

Transforming requests and responses for consistency:

```javascript
// Transformation configuration
module.exports = {
  policies: {
    requestTransform: {
      rules: [
        {
          action: 'add',
          path: 'headers.x-request-id',
          value: '${uuid}'
        },
        {
          action: 'add',
          path: 'headers.x-forwarded-for',
          value: '${req.ip}'
        }
      ]
    },
    responseTransform: {
      rules: [
        {
          action: 'add',
          path: 'headers.x-powered-by',
          value: 'Migratio API'
        },
        {
          action: 'remove',
          path: 'headers.server'
        }
      ]
    }
  },
  pipelines: [
    {
      name: 'transform',
      paths: [
        '/api/*'
      ],
      policies: [
        'requestTransform',
        'responseTransform'
      ]
    }
  ]
};
```

### 6. Logging and Monitoring

Comprehensive logging for troubleshooting and monitoring:

```javascript
// Logging configuration
module.exports = {
  policies: {
    log: {
      format: 'combined',
      logLevel: 'info',
      logBody: false,
      logHeaders: false,
      logResponseBody: false,
      logResponseHeaders: false,
      skipSuccessfulRequests: false,
      skipErrorRequests: false
    }
  },
  pipelines: [
    {
      name: 'logging',
      paths: [
        '/api/*'
      ],
      policies: [
        'log'
      ]
    }
  ]
};
```

### 7. CORS Configuration

Cross-Origin Resource Sharing configuration:

```javascript
// CORS configuration
module.exports = {
  policies: {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://migratio.com', 'https://app.migratio.com'] 
        : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['X-Rate-Limit-Limit', 'X-Rate-Limit-Remaining', 'X-Rate-Limit-Reset'],
      credentials: true,
      maxAge: 86400 // 24 hours
    }
  },
  pipelines: [
    {
      name: 'cors',
      paths: [
        '/api/*'
      ],
      policies: [
        'cors'
      ]
    }
  ]
};
```

## API Documentation

The API Gateway provides Swagger/OpenAPI documentation:

```javascript
// API documentation configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Migratio API',
      version: '1.0.0',
      description: 'API documentation for the Migratio platform',
      contact: {
        name: 'Migratio Support',
        email: 'support@migratio.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.migratio.com' 
          : 'http://localhost:8000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './models/*.js']
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerOptions)));
```

## Error Handling

Centralized error handling for consistent error responses:

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
      details: err.details || null
    },
    requestId: req.headers['x-request-id']
  };
  
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    requestId: req.headers['x-request-id'],
    path: req.path,
    method: req.method,
    statusCode
  });
  
  res.status(statusCode).json(errorResponse);
});
```

## Health Checks

Health check endpoints for monitoring service health:

```javascript
// Health check routes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      redis: redisClient.connected ? 'UP' : 'DOWN'
    }
  });
});

app.get('/health/services', async (req, res) => {
  try {
    const serviceStatuses = await Promise.all([
      checkServiceHealth('user-service', 'http://user-service:3001/health'),
      checkServiceHealth('assessment-service', 'http://assessment-service:3002/health'),
      checkServiceHealth('recommendation-service', 'http://recommendation-service:3003/health'),
      checkServiceHealth('program-service', 'http://program-service:3004/health'),
      checkServiceHealth('roadmap-service', 'http://roadmap-service:3005/health'),
      checkServiceHealth('pdf-service', 'http://pdf-service:3006/health')
    ]);
    
    const allServicesUp = serviceStatuses.every(status => status.status === 'UP');
    
    res.status(allServicesUp ? 200 : 503).json({
      status: allServicesUp ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      services: Object.fromEntries(serviceStatuses.map(s => [s.name, s.status]))
    });
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

async function checkServiceHealth(name, url) {
  try {
    const response = await axios.get(url, { timeout: 2000 });
    return { name, status: response.status === 200 ? 'UP' : 'DOWN' };
  } catch (error) {
    return { name, status: 'DOWN' };
  }
}
```

## Deployment Configuration

The API Gateway is deployed as a Docker container:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8000/health || exit 1

CMD ["node", "server.js"]
```

## Environment Variables

The API Gateway uses the following environment variables:

```
# Server configuration
PORT=8000
NODE_ENV=development

# JWT configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=24h

# Redis configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Service endpoints
USER_SERVICE_URL=http://user-service:3001
ASSESSMENT_SERVICE_URL=http://assessment-service:3002
RECOMMENDATION_SERVICE_URL=http://recommendation-service:3003
PROGRAM_SERVICE_URL=http://program-service:3004
ROADMAP_SERVICE_URL=http://roadmap-service:3005
PDF_SERVICE_URL=http://pdf-service:3006

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60

# CORS configuration
CORS_ORIGINS=http://localhost:3000,https://migratio.com

# Logging
LOG_LEVEL=info
```

## Monitoring and Metrics

The API Gateway exposes Prometheus metrics for monitoring:

```javascript
// Prometheus metrics configuration
const prometheus = require('prom-client');
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Custom metrics
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2000, 5000, 10000]
});

const httpRequestCounter = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Metrics middleware
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    end({ method: req.method, route, status_code: res.statusCode });
    httpRequestCounter.inc({ method: req.method, route, status_code: res.statusCode });
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

## Circuit Breaker

Circuit breaker pattern for handling service failures:

```javascript
// Circuit breaker configuration
const circuitBreaker = require('opossum');

const circuitBreakerOptions = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again
};

// Create circuit breakers for each service
const serviceCircuitBreakers = {
  'user-service': circuitBreaker(callUserService, circuitBreakerOptions),
  'assessment-service': circuitBreaker(callAssessmentService, circuitBreakerOptions),
  'recommendation-service': circuitBreaker(callRecommendationService, circuitBreakerOptions),
  'program-service': circuitBreaker(callProgramService, circuitBreakerOptions),
  'roadmap-service': circuitBreaker(callRoadmapService, circuitBreakerOptions),
  'pdf-service': circuitBreaker(callPdfService, circuitBreakerOptions)
};

// Example circuit breaker usage
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const result = await serviceCircuitBreakers['user-service'].fire({
      method: 'GET',
      path: `/users/${req.params.id}`
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Circuit breaker event listeners
Object.values(serviceCircuitBreakers).forEach(breaker => {
  breaker.on('open', () => {
    logger.warn(`Circuit breaker for ${breaker.name} is open`);
  });
  
  breaker.on('close', () => {
    logger.info(`Circuit breaker for ${breaker.name} is closed`);
  });
  
  breaker.on('halfOpen', () => {
    logger.info(`Circuit breaker for ${breaker.name} is half open`);
  });
  
  breaker.on('fallback', () => {
    logger.warn(`Circuit breaker for ${breaker.name} fallback called`);
  });
});
```

## Conclusion

The API Gateway serves as a critical component in the Migratio platform architecture, providing a unified entry point for all client requests while handling cross-cutting concerns. This configuration ensures a secure, performant, and maintainable API layer for the application.
