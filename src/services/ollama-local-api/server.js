/**
 * Local API server for Ollama
 *
 * This server runs locally and connects to your local Ollama instance.
 * It exposes an API that can be called from your deployed service.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json());

// Ollama configuration
const OLLAMA_URL = 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';
const OLLAMA_FALLBACK_MODEL = process.env.OLLAMA_FALLBACK_MODEL || 'mistral';

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, context = '' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log(`Chat request with ${messages.length} messages`);

    // Prepare the system message with context if available
    const systemMessage = context
      ? `You are an immigration assistant for the Visafy platform. Use the following information to answer the user's question:\n\n${context}`
      : 'You are an immigration assistant for the Visafy platform. Provide helpful and accurate information about immigration processes, requirements, and pathways.';

    // Prepare the messages for Ollama
    const ollamaMessages = [
      { role: 'system', content: systemMessage },
      ...messages
    ];

    console.log('Using model:', OLLAMA_MODEL);

    try {
      // Make the API call to Ollama
      const result = await axios.post(
        `${OLLAMA_URL}/api/chat`,
        {
          model: OLLAMA_MODEL,
          messages: ollamaMessages,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 1024,
          }
        }
      );

      // Extract the response
      const response = result.data.message.content;
      console.log('Received response from Ollama');

      res.json({
        response,
        model: OLLAMA_MODEL,
        hasContext: !!context
      });
    } catch (ollamaError) {
      console.error('Error using Ollama API:', ollamaError.message);
      if (ollamaError.response) {
        console.error('Ollama API response status:', ollamaError.response.status);
        console.error('Ollama API response data:', ollamaError.response.data);
      }

      // Try the fallback model if the first one fails
      console.log(`Trying fallback model: ${OLLAMA_FALLBACK_MODEL}`);
      try {
        const fallbackResult = await axios.post(
          `${OLLAMA_URL}/api/chat`,
          {
            model: OLLAMA_FALLBACK_MODEL,
            messages: ollamaMessages,
            stream: false,
            options: {
              temperature: 0.7,
              num_predict: 1024,
            }
          }
        );

        // Extract the response
        const response = fallbackResult.data.message.content;
        console.log('Received response from fallback model');

        res.json({
          response,
          model: OLLAMA_FALLBACK_MODEL,
          hasContext: !!context
        });
      } catch (fallbackError) {
        console.error('Error using fallback model:', fallbackError.message);
        return res.status(500).json({
          error: 'Failed to generate response from Ollama',
          details: fallbackError.message
        });
      }
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Ollama Local API is running'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Ollama Local API',
    version: '1.0.0',
    description: 'Local API for Ollama integration'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Ollama Local API running on port ${PORT}`);
  console.log(`Using Ollama URL: ${OLLAMA_URL}`);
  console.log(`Using models: ${OLLAMA_MODEL} and ${OLLAMA_FALLBACK_MODEL}`);
});
