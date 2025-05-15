/**
 * Simple test for Ollama using the CLI approach
 */

const { spawn } = require('child_process');

// Ollama configuration
const OLLAMA_MODEL = 'deepseek-r1:1.5b'; // Using the smallest model

function runOllamaCLI(model, prompt, systemPrompt = '') {
  return new Promise((resolve, reject) => {
    // For simplicity, we'll just use the model and prompt without system prompt
    const command = `run ${model} "${prompt}"`;

    console.log('Running command: ollama', command);

    // Use spawn to run the command and capture streaming output
    const ollamaProcess = spawn('ollama', [command], {
      shell: true
    });

    let fullOutput = '';

    // Handle streaming output
    ollamaProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      console.log('Received chunk:', chunk);
      fullOutput += chunk;
    });

    // Handle errors
    ollamaProcess.stderr.on('data', (data) => {
      console.error('Error:', data.toString());
    });

    // Handle process completion
    ollamaProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Ollama process exited with code ${code}`));
      } else {
        // Clean up the output (remove thinking and spinner characters)
        const cleanedOutput = fullOutput
          .replace(/⠋|⠙|⠹|⠸|⠼|⠴|⠦|⠧|⠇|⠏/g, '') // Remove spinner characters
          .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove thinking sections
          .trim();

        resolve(cleanedOutput);
      }
    });
  });
}

async function testOllamaCLI() {
  try {
    console.log('Testing Ollama CLI...');
    console.log(`Using model: ${OLLAMA_MODEL}`);

    const systemPrompt = 'You are an immigration assistant for the Visafy platform.';
    const prompt = 'Hello, how can you help me with immigration?';

    console.log('System prompt:', systemPrompt);
    console.log('User prompt:', prompt);

    const response = await runOllamaCLI(OLLAMA_MODEL, prompt, systemPrompt);

    console.log('Response received!');
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the test
testOllamaCLI();
