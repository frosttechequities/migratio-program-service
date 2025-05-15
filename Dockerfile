FROM ollama/ollama:latest

# Set environment variables
ENV OLLAMA_HOST=0.0.0.0
ENV OLLAMA_MODELS_PATH=/models

# Create a directory for models
RUN mkdir -p /models

# Expose the Ollama API port
EXPOSE 11434

# Pull the smaller model during build
RUN ollama pull deepseek-r1:1.5b

# Start Ollama server
CMD ["ollama", "serve"]
