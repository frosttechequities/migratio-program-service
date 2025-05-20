# Visafy Platform Integration with Vector Search Service

This guide explains how to test the integration between the Visafy platform and the Vector Search Service with Hugging Face API integration.

## Overview

The Vector Search Service provides two main functionalities to the Visafy platform:

1. **Semantic Search**: Allows users to search for immigration-related documents using natural language queries.
2. **AI-powered Chat**: Provides intelligent responses to immigration-related questions using the Hugging Face API.

## Prerequisites

- The Vector Search Service is deployed at: `https://visafy-vector-search-service.onrender.com`
- The Visafy platform is deployed at: `https://visafy-platform.netlify.app` (or your local development environment)

## Testing the Integration

### 1. Automated Testing

We've created a test script that simulates the API calls that the Visafy frontend would make to the Vector Search Service. You can run this script to verify that the integration is working correctly:

```bash
node test-visafy-integration.js
```

The script tests the following scenarios:
- Health check endpoint
- Vector search for immigration documents
- Chat with pre-computed responses
- Chat with vector search using Hugging Face

### 2. Manual Testing on the Visafy Platform

#### Testing the Chatbot

1. Navigate to the Visafy platform: `https://visafy-platform.netlify.app`
2. Find the chatbot interface (usually in the bottom right corner or in the "Chat" section)
3. Ask immigration-related questions such as:
   - "What documents do I need for immigration?"
   - "How does the points-based immigration system work?"
   - "What is involved in an immigration medical examination?"
4. Verify that the chatbot provides relevant and accurate responses
5. Check the browser's developer console (F12) to see the API calls to the Vector Search Service

#### Testing the Semantic Search

1. Navigate to the Visafy platform: `https://visafy-platform.netlify.app`
2. Find the search interface (usually in the "Resources" or "Documents" section)
3. Enter immigration-related search queries such as:
   - "visa requirements"
   - "language testing"
   - "medical examination"
4. Verify that the search returns relevant results
5. Check the browser's developer console (F12) to see the API calls to the Vector Search Service

### 3. Testing in Different Environments

#### Production Environment

- Vector Search Service: `https://visafy-vector-search-service.onrender.com`
- Visafy Platform: `https://visafy-platform.netlify.app`

#### Local Development Environment

1. Start the Vector Search Service locally:
   ```bash
   cd src/services/vector-search-service
   npm install
   npm start
   ```

2. Start the Visafy frontend locally:
   ```bash
   cd src/frontend
   npm install
   npm start
   ```

3. Set the environment variable in the frontend:
   ```
   REACT_APP_VECTOR_SEARCH_SERVICE_URL=http://localhost:3006
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**: If you see CORS errors in the browser console, make sure the Vector Search Service is configured to allow requests from the Visafy platform's domain.

2. **Slow Responses**: The first request to the Vector Search Service might be slow due to cold starts on Render's free tier. Subsequent requests should be faster.

3. **Authentication Errors**: If you see authentication errors, make sure the Hugging Face API token is correctly set in the Vector Search Service's environment variables.

### Checking Logs

1. **Vector Search Service Logs**:
   - Go to the Render dashboard: `https://dashboard.render.com`
   - Navigate to the Vector Search Service
   - Click on "Logs" to see the service logs

2. **Frontend Logs**:
   - Open the browser's developer console (F12)
   - Look for any errors or warnings related to API calls

## Configuration

### Environment Variables

The Visafy frontend uses the following environment variables to connect to the Vector Search Service:

```
REACT_APP_VECTOR_SEARCH_SERVICE_URL=https://visafy-vector-search-service.onrender.com
```

This variable is set in the following files:
- `.env.production` for production builds
- `.env.local` for local development

### API Endpoints

The Vector Search Service provides the following endpoints:

1. **Health Check**: `GET /health`
   - Returns the status of the service and its dependencies

2. **Vector Search**: `POST /search`
   - Request body:
     ```json
     {
       "query": "What documents do I need for immigration?",
       "limit": 5,
       "threshold": 0.6
     }
     ```

3. **Chat**: `POST /chat`
   - Request body:
     ```json
     {
       "messages": [{ "role": "user", "content": "What is involved in an immigration medical examination?" }],
       "systemPrompt": "You are an immigration assistant",
       "usePreComputed": true,
       "useVectorSearch": true,
       "useFastModel": false,
       "useMockInProduction": false,
       "forceHuggingFace": true,
       "disableMockFallback": false
     }
     ```

## Next Steps

After confirming that the integration is working correctly, you can:

1. **Add More Content**: Add more immigration-related documents to the Supabase vector database to improve search results.

2. **Optimize Response Times**: Fine-tune the Hugging Face API parameters to improve response times.

3. **Enhance the User Interface**: Improve the chatbot and search interfaces on the Visafy platform to provide a better user experience.

## Support

If you encounter any issues with the integration, please contact the development team or create an issue in the GitHub repository.
