/**
 * Simple test script to test Ollama directly
 */

const axios = require('axios');

// Ollama configuration
const OLLAMA_URL = 'http://127.0.0.1:11434';
const OLLAMA_MODEL = 'llama3';

async function testOllama() {
  try {
    console.log('Testing Ollama API...');
    
    // First, check if Ollama is running
    try {
      const tagsResponse = await axios.get(`${OLLAMA_URL}/api/tags`);
      console.log('Ollama is running. Available models:');
      console.log(tagsResponse.data.models.map(model => model.name).join(', '));
    } catch (error) {
      console.error('Error checking Ollama status:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      return;
    }
    
    // Now, test the chat endpoint
    try {
      console.log('\nTesting chat endpoint...');
      
      const messages = [
        { role: 'system', content: 'You are an immigration assistant for the Visafy platform. Provide helpful and accurate information about immigration processes, requirements, and pathways.' },
        { role: 'user', content: 'What are the requirements for a work visa?' }
      ];
      
      const response = await axios.post(
        `${OLLAMA_URL}/api/chat`,
        {
          model: OLLAMA_MODEL,
          messages: messages,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 1024,
          }
        }
      );
      
      console.log('\nResponse from Ollama:');
      console.log(response.data.message.content);
    } catch (error) {
      console.error('Error using Ollama chat API:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testOllama();
