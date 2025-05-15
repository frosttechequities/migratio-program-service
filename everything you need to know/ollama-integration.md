# Ollama Integration

This document provides detailed information about the Ollama integration for the Visafy platform.

## Overview

Ollama is a local Large Language Model (LLM) runner that allows you to run open-source models on your own machine. The Visafy platform uses Ollama to provide AI-powered chat responses without relying on external API services like OpenAI or Google.

## Installation

### Windows Installation
1. Download Ollama from [ollama.ai](https://ollama.ai/download)
2. Run the installer and follow the prompts
3. After installation, Ollama will run as a service in the background

### Verification
To verify that Ollama is installed and running correctly:
1. Open a terminal or command prompt
2. Run `ollama --version` to check the installed version
3. Run `ollama list` to see available models

## Available Models

The following models are currently installed and available for use:

| Model | Size | Description |
|-------|------|-------------|
| mistral:latest | 4.1 GB | General-purpose model with good performance |
| llama3:latest | 4.7 GB | Powerful model with strong reasoning capabilities |
| deepseek-r1:1.5b | 1.1 GB | Smaller model for faster responses |

## API Integration

### API Endpoints

Ollama provides a REST API that can be accessed at `http://127.0.0.1:11434`. The main endpoints are:

- **GET /api/tags** - List available models
- **POST /api/chat** - Generate chat completions
- **POST /api/generate** - Generate text completions

### Chat API Example

```javascript
const axios = require('axios');

async function generateChatResponse(messages, systemPrompt = null) {
  try {
    // Prepare the messages array
    const ollamaMessages = [];
    
    // Add system message if provided
    if (systemPrompt) {
      ollamaMessages.push({ role: 'system', content: systemPrompt });
    }
    
    // Add the user messages
    ollamaMessages.push(...messages);
    
    // Make the API call to Ollama
    const result = await axios.post(
      'http://127.0.0.1:11434/api/chat',
      {
        model: 'deepseek-r1:1.5b',
        messages: ollamaMessages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1024,
        }
      },
      {
        timeout: 60000 // 1 minute timeout
      }
    );
    
    // Extract the response
    return result.data.message.content;
  } catch (error) {
    console.error('Error using Ollama API:', error.message);
    throw error;
  }
}
```

### CLI Usage Example

```javascript
const { spawn } = require('child_process');

function runOllamaCLI(model, prompt, systemPrompt = '') {
  return new Promise((resolve, reject) => {
    // Prepare the command
    let command = ['run', model];
    
    // Add system prompt if provided
    if (systemPrompt) {
      command.push('--system');
      command.push(systemPrompt);
    }
    
    // Add the prompt
    command.push(prompt);
    
    // Use spawn to run the command and capture streaming output
    const ollamaProcess = spawn('ollama', command, {
      shell: true
    });
    
    let fullOutput = '';
    
    // Handle streaming output
    ollamaProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      fullOutput += chunk;
    });
    
    // Handle process completion
    ollamaProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Ollama process exited with code ${code}`));
      } else {
        // Clean up the output (remove thinking and spinner characters)
        const cleanedOutput = fullOutput
          .replace(/⠋|⠙|⠹|⠸|⠼|⠴|⠦|⠧|⠇|⠏/g, '') // Remove spinner characters
          .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove thinking sections
          .trim();
        
        resolve(cleanedOutput);
      }
    });
  });
}
```

## Configuration

### Model Selection

The Visafy platform is configured to use the following models:

- **Primary Model**: `deepseek-r1:1.5b` (smaller, faster)
- **Fallback Model**: `mistral` (more powerful, but slower)

These can be configured using environment variables:

```
OLLAMA_MODEL=deepseek-r1:1.5b
OLLAMA_FALLBACK_MODEL=mistral
```

### Performance Considerations

- **Memory Usage**: Larger models require more RAM
  - llama3: ~8GB RAM
  - mistral: ~6GB RAM
  - deepseek-r1:1.5b: ~2GB RAM

- **Response Time**: Smaller models are faster
  - deepseek-r1:1.5b: 1-3 seconds
  - mistral: 3-5 seconds
  - llama3: 5-10 seconds

## Troubleshooting

### Common Issues

1. **Ollama Not Responding**
   - Check if Ollama is running: `ollama list`
   - Restart Ollama: Close and reopen the application
   - Update Ollama to the latest version

2. **API Timeouts**
   - Increase the timeout value in your API calls
   - Try using a smaller model
   - Check system resources (CPU, RAM)

3. **Model Not Found**
   - Pull the model: `ollama pull mistral`
   - Check available models: `ollama list`

4. **High Memory Usage**
   - Use smaller models for faster responses
   - Close other memory-intensive applications
   - Increase system swap space

### Updating Ollama

To update Ollama:
1. Download the latest version from [ollama.ai](https://ollama.ai/download)
2. Run the installer
3. Restart your computer

## Local vs. Production

### Local Development
- Ollama runs locally on your machine
- The vector search service connects directly to Ollama
- Full LLM capabilities are available

### Production (Render)
- Ollama is not available on Render
- The vector search service falls back to the mock implementation
- Limited AI capabilities, but still functional

## Future Improvements

1. **Deploy Ollama on a Cloud Server**
   - Set up a VM to run Ollama
   - Configure the vector search service to connect to the cloud Ollama instance
   - Ensure proper security and access controls

2. **Use a Different LLM Service**
   - Explore cloud-based LLM services that are accessible from Render
   - Update the vector search service to use the new LLM service
   - Compare performance and cost

3. **Enhance the Mock Implementation**
   - Add more comprehensive responses to the mock implementation
   - Implement a more sophisticated fallback mechanism
   - Consider using pre-generated responses for common questions
