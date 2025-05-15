# Ollama Deployment on Render

This document explains how to deploy Ollama and the Vector Search Service on Render using Docker containers.

## Local Testing

To test the Docker setup locally:

1. Make sure Docker and Docker Compose are installed on your machine.

2. Build and run the containers:
   ```bash
   docker-compose -f docker-compose.ollama.yml up --build
   ```

3. Test the health endpoint:
   ```bash
   curl http://localhost:3009/health
   ```

4. Test the chat endpoint:
   ```bash
   curl -X POST http://localhost:3009/chat \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"What is involved in an immigration medical examination?"}],"systemPrompt":"You are an immigration assistant","usePreComputed":true,"useVectorSearch":true,"useFastModel":false,"useMockInProduction":true}'
   ```

## Deployment to Render

To deploy to Render:

1. Create a new Blueprint on Render and connect your GitHub repository.

2. Use the `render.ollama.yaml` file for the Blueprint configuration.

3. Important notes:
   - The Ollama service requires a paid plan (Standard) due to resource requirements.
   - The Vector Search Service can use the free plan.
   - The Ollama service will pull the `deepseek-r1:1.5b` model during the build process.

4. After deployment, test the endpoints:
   ```bash
   curl https://visafy-vector-search-service.onrender.com/health
   ```

## Configuration

The Docker setup includes:

1. **Ollama Service**:
   - Uses the official Ollama Docker image
   - Pre-loads the `deepseek-r1:1.5b` model (1.1GB)
   - Exposes port 11434 for the Ollama API

2. **Vector Search Service**:
   - Node.js service with Express
   - Connects to Ollama for AI responses
   - Connects to Supabase for vector search
   - Includes pre-computed responses for common queries
   - Implements fallback mechanisms for when Ollama is unavailable

## Resource Considerations

- The `deepseek-r1:1.5b` model requires approximately 1.5GB of RAM.
- The Standard plan on Render provides 2GB of RAM, which should be sufficient.
- If you need to use larger models, consider upgrading to a higher plan.

## Troubleshooting

If you encounter issues:

1. Check the Render logs for both services.
2. Verify that the Ollama service is running and accessible from the Vector Search Service.
3. Test the health endpoint to confirm that Ollama is available.
4. If Ollama is not available, the service will fall back to mock responses.
