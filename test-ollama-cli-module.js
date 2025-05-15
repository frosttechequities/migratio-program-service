/**
 * Test script for the ollama-cli.js module
 */

// Import the Ollama CLI wrapper
const { runOllamaCLI } = require('./src/services/vector-search-service/ollama-cli');

async function testOllamaCliModule() {
  try {
    console.log('Testing Ollama CLI module...');
    
    const model = 'deepseek-r1:1.5b';
    const prompt = 'Hello, how can you help me with immigration?';
    const systemPrompt = 'You are an immigration assistant for the Visafy platform.';
    
    console.log(`Model: ${model}`);
    console.log(`Prompt: ${prompt}`);
    console.log(`System prompt: ${systemPrompt}`);
    
    console.log('\nSending request to Ollama CLI...');
    const response = await runOllamaCLI(model, prompt, systemPrompt);
    
    console.log('\nResponse received!');
    console.log(`Response: ${response.substring(0, 100)}...`);
  } catch (error) {
    console.error('Error testing Ollama CLI module:', error.message);
  }
}

// Run the test
testOllamaCliModule();
