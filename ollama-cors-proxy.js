/**
 * Simple CORS proxy for Ollama API
 *
 * This server proxies requests to the Ollama API and adds CORS headers
 * to allow browser-based applications to access the API.
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(express.json());

// Ollama configuration
const OLLAMA_URL = 'http://127.0.0.1:11434';

// Proxy all requests to Ollama
app.all('/api/*', async (req, res) => {
  try {
    const ollamaPath = req.path;
    const ollamaUrl = `${OLLAMA_URL}${ollamaPath}`;

    console.log(`Proxying ${req.method} request to: ${ollamaUrl}`);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Forward the request to Ollama
    console.log('Sending request to Ollama...');
    const response = await axios({
      method: req.method,
      url: ollamaUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 300000 // 5 minute timeout
    });

    console.log('Received response from Ollama');
    console.log('Response status:', response.status);

    // Return the response from Ollama
    res.status(response.status).json(response.data);
    console.log('Response sent to client');
  } catch (error) {
    console.error('Error proxying request to Ollama:', error.message);
    console.error('Error details:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error('No response received from Ollama');
      res.status(504).json({ error: 'No response received from Ollama' });
    } else {
      console.error('Error setting up request:', error.message);
      res.status(500).json({ error: 'Failed to proxy request to Ollama', details: error.message });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Ollama CORS Proxy is running'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Ollama CORS Proxy',
    version: '1.0.0',
    description: 'CORS proxy for Ollama API'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Ollama CORS Proxy running on port ${PORT}`);
  console.log(`Proxying requests to Ollama at: ${OLLAMA_URL}`);
});
