/**
 * Simple test for Ollama chat endpoint
 */

const axios = require('axios');

// Ollama configuration
const OLLAMA_URL = 'http://127.0.0.1:11434';
const OLLAMA_MODEL = 'deepseek-r1:1.5b'; // Using the smallest model

async function testOllamaChat() {
  try {
    console.log('Testing Ollama chat endpoint...');
    console.log(`Using model: ${OLLAMA_MODEL}`);
    
    const response = await axios.post(
      `${OLLAMA_URL}/api/chat`,
      {
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: 'You are an immigration assistant for the Visafy platform.' },
          { role: 'user', content: 'Hello, how can you help me with immigration?' }
        ],
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
    
    console.log('Response received!');
    console.log('Response:', response.data.message.content);
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
testOllamaChat();
