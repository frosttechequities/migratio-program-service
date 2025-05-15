# Testing Guide

This document provides detailed information about testing the Visafy platform.

## Local Testing

### Prerequisites

- Node.js 16+
- npm or yarn
- PowerShell or Command Prompt
- Ollama (for LLM integration)

### Testing the Vector Search Service

#### Starting the Service

1. Navigate to the vector search service directory:
   ```bash
   cd src/services/vector-search-service
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Set environment variables:
   ```powershell
   # Windows PowerShell
   $env:SUPABASE_URL="https://qyvvrvthalxeibsmckep.supabase.co"
   $env:SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   $env:PORT=3006
   ```

4. Start the service:
   ```bash
   npm start
   ```

5. The service will be available at http://localhost:3006

#### Testing with PowerShell

You can use PowerShell to test the API endpoints:

##### Health Check

```powershell
Invoke-WebRequest -Uri "http://localhost:3006/health" -Method GET
```

Expected response:
```json
{
  "status": "ok",
  "message": "Vector search service is running",
  "version": "0.1.0"
}
```

##### Search Endpoint

```powershell
Invoke-WebRequest -Uri "http://localhost:3006/search" -Method POST -ContentType "application/json" -Body '{"query":"What are the requirements for a work visa?", "limit": 5, "threshold": 0.5}'
```

Expected response:
```json
{
  "results": [
    {
      "id": 1,
      "content": "...",
      "metadata": { ... },
      "similarity": 0.85
    },
    ...
  ]
}
```

##### Chat Endpoint

```powershell
Invoke-WebRequest -Uri "http://localhost:3006/chat" -Method POST -ContentType "application/json" -Body '{"messages":[{"role":"user","content":"What are the requirements for a work visa?"}]}'
```

Expected response:
```json
{
  "response": "Work visa requirements typically include...",
  "model": "deepseek-r1:1.5b",
  "hasContext": false
}
```

#### Testing with HTML Test Page

The repository includes an HTML test page that you can use to test the API endpoints:

1. Open the `test-api.html` file in a web browser
2. Use the form to test the search and chat endpoints
3. View the responses in the browser

### Testing Ollama Integration

#### Testing with CLI

You can test Ollama directly using the CLI:

```powershell
ollama run deepseek-r1:1.5b "What are the requirements for a work visa?"
```

#### Testing with API

You can test the Ollama API directly:

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:11434/api/chat" -Method POST -ContentType "application/json" -Body '{"model":"deepseek-r1:1.5b","messages":[{"role":"user","content":"What are the requirements for a work visa?"}],"stream":false}'
```

#### Testing with Node.js Script

The repository includes a Node.js script for testing Ollama:

```bash
node ollama-api-test.js
```

This script tests the Ollama API with a simple request and displays the response.

## Production Testing

### Testing the Deployed Service

#### Health Check

```powershell
Invoke-WebRequest -Uri "https://visafy-vector-search-service.onrender.com/health" -Method GET
```

#### Search Endpoint

```powershell
Invoke-WebRequest -Uri "https://visafy-vector-search-service.onrender.com/search" -Method POST -ContentType "application/json" -Body '{"query":"What are the requirements for a work visa?", "limit": 5, "threshold": 0.5}'
```

#### Chat Endpoint

```powershell
Invoke-WebRequest -Uri "https://visafy-vector-search-service.onrender.com/chat" -Method POST -ContentType "application/json" -Body '{"messages":[{"role":"user","content":"What are the requirements for a work visa?"}]}'
```

### Testing with cURL

You can also use cURL for testing:

#### Health Check

```bash
curl -X GET https://visafy-vector-search-service.onrender.com/health
```

#### Search Endpoint

```bash
curl -X POST https://visafy-vector-search-service.onrender.com/search \
  -H "Content-Type: application/json" \
  -d '{"query":"What are the requirements for a work visa?", "limit": 5, "threshold": 0.5}'
```

#### Chat Endpoint

```bash
curl -X POST https://visafy-vector-search-service.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What are the requirements for a work visa?"}]}'
```

## Automated Testing

### Unit Tests

The vector search service includes unit tests for key functionality:

```bash
cd src/services/vector-search-service
npm test
```

This will run the test suite and display the results.

### Integration Tests

Integration tests verify that the service works correctly with external dependencies:

```bash
cd src/services/vector-search-service
npm run test:integration
```

### End-to-End Tests

End-to-end tests verify that the entire system works correctly:

```bash
cd src/services/vector-search-service
npm run test:e2e
```

## Performance Testing

### Load Testing

You can use tools like Apache JMeter or k6 to perform load testing:

```bash
k6 run load-test.js
```

Example load test script:

```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  const payload = JSON.stringify({
    messages: [
      { role: 'user', content: 'What are the requirements for a work visa?' }
    ]
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post('https://visafy-vector-search-service.onrender.com/chat', payload, params);
  sleep(1);
}
```

### Stress Testing

Stress testing helps identify the breaking point of the service:

```bash
k6 run --vus 50 --duration 30s stress-test.js
```

## Security Testing

### API Security Testing

You can use tools like OWASP ZAP to test for security vulnerabilities:

```bash
zap-cli quick-scan --self-contained \
  --start-options "-config api.disablekey=true" \
  https://visafy-vector-search-service.onrender.com
```

### Authentication Testing

Test that the service properly handles authentication:

```powershell
# Test with invalid API key
$env:SUPABASE_KEY="invalid-key"
npm start
```

## Troubleshooting

### Common Testing Issues

1. **Connection Refused**
   - Check that the service is running
   - Verify that the port is correct
   - Check for firewall issues

2. **Authentication Errors**
   - Verify that the API key is correct
   - Check that the API key has the necessary permissions

3. **Timeout Errors**
   - Increase the timeout value in your requests
   - Check system resources (CPU, RAM)
   - Verify that the service is responsive

4. **CORS Errors**
   - Check that CORS is configured correctly
   - Verify that the request includes the necessary headers

### Debugging Tips

1. **Enable Verbose Logging**
   ```javascript
   // In server.js
   app.use(morgan('dev'));
   ```

2. **Check Server Logs**
   ```bash
   # For local service
   npm start

   # For deployed service
   # Check the Render dashboard
   ```

3. **Use Browser Developer Tools**
   - Open the browser developer tools (F12)
   - Go to the Network tab
   - Make a request and examine the response

4. **Test with Simplified Requests**
   - Start with simple requests and gradually add complexity
   - Isolate the issue by testing different parts of the system
