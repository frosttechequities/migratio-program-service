# Vector Search Service

This document provides detailed information about the Vector Search Service for the Visafy platform.

## Overview

The Vector Search Service is a Node.js application that provides:
1. Vector search for immigration documents
2. AI-powered chat responses using Ollama
3. Fallback to mock implementation when Ollama is unavailable

## Service Architecture

```
vector-search-service/
├── server.js              # Main server file
├── ollama-api.js          # Ollama API wrapper
├── embedding-pipeline.js  # Embedding generation pipeline
├── mock-data.js           # Mock data for fallback responses
└── package.json           # Dependencies and scripts
```

## API Endpoints

### 1. Search Endpoint

**URL**: `/search`  
**Method**: `POST`  
**Description**: Search for documents similar to the query  

**Request Body**:
```json
{
  "query": "What are the requirements for a work visa?",
  "limit": 5,
  "threshold": 0.5
}
```

**Parameters**:
- `query` (required): The search query
- `limit` (optional, default: 5): Maximum number of results to return
- `threshold` (optional, default: 0.5): Minimum similarity threshold

**Response**:
```json
{
  "results": [
    {
      "id": 1,
      "content": "Work visa requirements include...",
      "metadata": {
        "title": "Work Visa Guide",
        "source": "Immigration Department",
        "tags": ["work", "visa", "requirements"]
      },
      "similarity": 0.85
    },
    ...
  ]
}
```

### 2. Chat Endpoint

**URL**: `/chat`  
**Method**: `POST`  
**Description**: Generate AI responses to user messages  

**Request Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What are the requirements for a work visa?"
    }
  ],
  "context": "Optional context from vector search"
}
```

**Parameters**:
- `messages` (required): Array of message objects with role and content
- `context` (optional): Additional context from vector search

**Response**:
```json
{
  "response": "Work visa requirements typically include...",
  "model": "deepseek-r1:1.5b",
  "hasContext": true
}
```

### 3. Health Check Endpoint

**URL**: `/health`  
**Method**: `GET`  
**Description**: Check if the service is running  

**Response**:
```json
{
  "status": "ok",
  "message": "Vector search service is running",
  "version": "0.1.0"
}
```

### 4. Root Endpoint

**URL**: `/`  
**Method**: `GET`  
**Description**: Get service information  

**Response**:
```json
{
  "name": "Visafy Vector Search Service",
  "version": "0.1.0",
  "description": "Vector search service for the Visafy platform"
}
```

## Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| PORT | Port to run the server on | 3006 |
| SUPABASE_URL | Supabase URL | https://qyvvrvthalxeibsmckep.supabase.co |
| SUPABASE_KEY | Supabase service role key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |
| OLLAMA_MODEL | Primary Ollama model | deepseek-r1:1.5b |
| OLLAMA_FALLBACK_MODEL | Fallback Ollama model | mistral |

## Code Structure

### 1. Main Server (server.js)

The main server file sets up:
- Express server with middleware
- Supabase client
- Embedding pipeline
- API endpoints

### 2. Ollama API Wrapper (ollama-api.js)

The Ollama API wrapper provides:
- Chat response generation
- Availability checking
- Error handling and fallback

```javascript
// Example usage
const { generateChatResponse, isOllamaAvailable } = require('./ollama-api');

// Check if Ollama is available
const ollamaAvailable = await isOllamaAvailable();

if (ollamaAvailable) {
  // Generate response using Ollama
  const result = await generateChatResponse(messages, systemPrompt);
  return res.json(result);
} else {
  // Fall back to mock implementation
  console.log('Ollama is not available, using mock implementation');
  throw new Error('Ollama is not available');
}
```

### 3. Embedding Pipeline

The embedding pipeline uses the Transformers.js library to generate embeddings for search queries:

```javascript
const { pipeline } = require('@xenova/transformers');

// Initialize the embedding pipeline
const embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

// Generate embedding for a query
const embedding = await generateEmbedding(query);

// Search for similar documents in Supabase
const { data: documents } = await supabase.rpc('match_documents', {
  query_embedding: embedding,
  match_threshold: threshold,
  match_count: limit
});
```

### 4. Mock Implementation

The mock implementation provides fallback responses when Ollama is unavailable:

```javascript
// Mock data for chat responses
const MOCK_RESPONSES = {
  'visa': 'Visa requirements vary by country...',
  'work': 'Work permits typically require...',
  'study': 'Student visas usually require...',
  'family': 'Family sponsorship typically requires...',
  'default': 'I can provide information about immigration processes...'
};

// Find the best mock response based on keywords
function findMockResponse(query) {
  const lowerQuery = query.toLowerCase();
  
  for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
    if (lowerQuery.includes(keyword)) {
      return response;
    }
  }
  
  return MOCK_RESPONSES.default;
}
```

## Deployment

### Local Deployment

To run the service locally:

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The service will be available at http://localhost:3006

### Render Deployment

The service is deployed on Render at:
https://visafy-vector-search-service.onrender.com

Deployment configuration:
- **Build Command**: `cd src/services/vector-search-service && npm install`
- **Start Command**: `cd src/services/vector-search-service && npm start`
- **Environment Variables**: Set as described above

## Testing

### Local Testing

To test the service locally:

1. Start the service: `npm start`
2. Use the test-api.html file to test the endpoints
3. Or use PowerShell commands:

```powershell
# Test search endpoint
Invoke-WebRequest -Uri "http://localhost:3006/search" -Method POST -ContentType "application/json" -Body '{"query":"What are the requirements for a work visa?", "limit": 5, "threshold": 0.5}'

# Test chat endpoint
Invoke-WebRequest -Uri "http://localhost:3006/chat" -Method POST -ContentType "application/json" -Body '{"messages":[{"role":"user","content":"What are the requirements for a work visa?"}]}'
```

### Production Testing

To test the deployed service:

```powershell
# Test search endpoint
Invoke-WebRequest -Uri "https://visafy-vector-search-service.onrender.com/search" -Method POST -ContentType "application/json" -Body '{"query":"What are the requirements for a work visa?", "limit": 5, "threshold": 0.5}'

# Test chat endpoint
Invoke-WebRequest -Uri "https://visafy-vector-search-service.onrender.com/chat" -Method POST -ContentType "application/json" -Body '{"messages":[{"role":"user","content":"What are the requirements for a work visa?"}]}'
```

## Troubleshooting

### Common Issues

1. **Ollama Not Available**
   - Check if Ollama is running: `ollama list`
   - Restart Ollama: Close and reopen the application
   - Update Ollama to the latest version

2. **Supabase Connection Issues**
   - Check that you're using the correct URL and API key
   - Verify that your IP is not blocked by Supabase

3. **Embedding Generation Issues**
   - Check that the Transformers.js library is installed
   - Verify that the model is available
   - Check system resources (CPU, RAM)

4. **API Timeouts**
   - Increase the timeout value in your API calls
   - Try using a smaller model
   - Check system resources (CPU, RAM)
