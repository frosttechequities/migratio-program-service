/**
 * Ollama CLI wrapper
 *
 * This script uses the Ollama CLI directly instead of the API
 */

const { spawn } = require('child_process');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to run Ollama CLI with streaming output
function runOllama(model, prompt) {
  return new Promise((resolve, reject) => {
    console.log(`Running ollama with model ${model} and prompt: "${prompt}"`);

    // Escape quotes in the prompt
    const escapedPrompt = prompt.replace(/"/g, '\\"');

    // Use spawn to run the command and capture streaming output
    const ollamaProcess = spawn('ollama', ['run', model, escapedPrompt], {
      shell: true
    });

    let fullOutput = '';

    // Handle streaming output
    ollamaProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      process.stdout.write(chunk); // Print the chunk as it comes
      fullOutput += chunk;
    });

    // Handle errors
    ollamaProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    // Handle process completion
    ollamaProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Ollama process exited with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
      } else {
        resolve(fullOutput);
      }
    });

    // Handle process errors
    ollamaProcess.on('error', (error) => {
      console.error(`Error: ${error.message}`);
      reject(error);
    });
  });
}

// Function to ask a question
async function askQuestion() {
  rl.question('\nEnter your question (or "exit" to quit): ', async (question) => {
    if (question.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      const response = await runOllama('mistral', question);
      console.log('\nResponse from Ollama:');
      console.log(response);
    } catch (error) {
      console.error('Error running Ollama:', error);
    }

    askQuestion();
  });
}

// Start the conversation
console.log('Ollama CLI Wrapper');
console.log('------------------');
console.log('This script uses the Ollama CLI directly instead of the API');
askQuestion();
