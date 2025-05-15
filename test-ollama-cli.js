/**
 * Simple CLI test script for Ollama
 */

const axios = require('axios');
const readline = require('readline');

// Ollama configuration
const OLLAMA_URL = 'http://127.0.0.1:11434';
const OLLAMA_MODEL = 'deepseek-r1:1.5b'; // Using a smaller model

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask a question
async function askOllama(question) {
  try {
    console.log('\nSending request to Ollama...');

    const messages = [
      { role: 'system', content: 'You are an immigration assistant for the Visafy platform. Provide helpful and accurate information about immigration processes, requirements, and pathways.' },
      { role: 'user', content: question }
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
      },
      {
        timeout: 300000 // 5 minute timeout
      }
    );

    console.log('\nResponse from Ollama:');
    console.log(response.data.message.content);
  } catch (error) {
    console.error('\nError using Ollama API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from Ollama');
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
}

// Main function
async function main() {
  try {
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
      process.exit(1);
    }

    // Start the conversation loop
    askQuestion();
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Function to ask a question and wait for user input
function askQuestion() {
  rl.question('\nEnter your question (or "exit" to quit): ', async (question) => {
    if (question.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    await askOllama(question);
    askQuestion();
  });
}

// Run the main function
main();
