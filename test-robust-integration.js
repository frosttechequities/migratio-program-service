/**
 * Test script for the robust Ollama integration
 */

const {
  isOllamaAvailable,
  generateChatResponse,
  PRIMARY_MODEL,
  FALLBACK_MODEL
} = require('./robust-ollama-integration');

async function testRobustIntegration() {
  try {
    console.log('Testing robust Ollama integration...');
    console.log(`Primary model: ${PRIMARY_MODEL}`);
    console.log(`Fallback model: ${FALLBACK_MODEL}`);
    
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
      console.log('This may take a minute or two, please be patient...');
      
      const result = await generateChatResponse(messages, systemPrompt, 180000); // 3 minute timeout
      
      console.log('\nResponse received!');
      console.log(`Model used: ${result.model}`);
      console.log(`Has context: ${result.hasContext}`);
      console.log(`Method used: ${result.method || 'library/api'}`);
      console.log(`Response: ${result.response.substring(0, 200)}...`);
    } else {
      console.log('Ollama is not available. Please make sure it is running.');
    }
  } catch (error) {
    console.error('Error testing robust Ollama integration:', error.message);
  }
}

// Run the test
testRobustIntegration();
