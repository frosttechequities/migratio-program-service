/**
 * Very simple test for Ollama
 */

const axios = require('axios');

// Ollama configuration
const OLLAMA_URL = 'http://127.0.0.1:11434';
const OLLAMA_MODEL = 'deepseek-r1:1.5b'; // Using the smallest model

async function testOllama() {
  try {
    console.log('Testing Ollama API with a simple request...');

    const messages = [
      { role: 'user', content: 'Hello, how are you?' }
    ];

    console.log(`Sending request to ${OLLAMA_URL}/api/chat with model ${OLLAMA_MODEL}`);

    const response = await axios.post(
      `${OLLAMA_URL}/api/chat`,
      {
        model: OLLAMA_MODEL,
        messages: messages,
        stream: false
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
testOllama();
