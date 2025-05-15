/**
 * Test script for the ollama-api.js module
 */

// Import the Ollama API wrapper
const { generateChatResponse, isOllamaAvailable, OLLAMA_MODEL, OLLAMA_FALLBACK_MODEL } = require('./src/services/vector-search-service/ollama-api');

async function testOllamaModule() {
  try {
    console.log('Testing Ollama module...');
    console.log(`Primary model: ${OLLAMA_MODEL}`);
    console.log(`Fallback model: ${OLLAMA_FALLBACK_MODEL}`);
    
    // Check if Ollama is available
    console.log('\nChecking if Ollama is available...');
    const ollamaAvailable = await isOllamaAvailable();
    console.log(`Ollama available: ${ollamaAvailable}`);
    
    if (ollamaAvailable) {
      // Test the generateChatResponse function
      console.log('\nTesting generateChatResponse function...');
      
      const messages = [
        { role: 'user', content: 'Hello, how can you help me with immigration?' }
      ];
      
      const systemPrompt = 'You are an immigration assistant for the Visafy platform. Provide helpful and accurate information about immigration processes, requirements, and pathways.';
      
      console.log('Sending request to Ollama...');
      const result = await generateChatResponse(messages, systemPrompt);
      
      console.log('\nResponse received!');
      console.log(`Model used: ${result.model}`);
      console.log(`Has context: ${result.hasContext}`);
      console.log(`Response: ${result.response.substring(0, 100)}...`);
    } else {
      console.log('Ollama is not available. Please make sure it is running.');
    }
  } catch (error) {
    console.error('Error testing Ollama module:', error.message);
  }
}

// Run the test
testOllamaModule();
