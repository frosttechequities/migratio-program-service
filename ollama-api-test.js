/**
 * Simple test for Ollama generate endpoint
 */

const axios = require('axios');

// Ollama configuration
const OLLAMA_URL = 'http://127.0.0.1:11434';
const OLLAMA_MODEL = 'deepseek-r1:1.5b'; // Using the smallest model

async function testOllamaGenerate() {
  try {
    console.log('Testing Ollama generate endpoint...');
    console.log(`Using model: ${OLLAMA_MODEL}`);
    
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: 'Hello, how are you?',
        system: 'You are a helpful assistant.',
        stream: false
      },
      {
        timeout: 60000 // 1 minute timeout
      }
    );
    
    console.log('Response received!');
    console.log('Response:', response.data.response);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    }
  }
}

// Run the test
testOllamaGenerate();
