/**
 * Ollama CLI wrapper for the vector search service
 * 
 * This module uses the Ollama CLI directly instead of the API
 */

const { spawn } = require('child_process');

/**
 * Run Ollama CLI with a prompt and return the response
 * @param {string} model - The Ollama model to use
 * @param {string} prompt - The prompt to send to Ollama
 * @param {string} systemPrompt - Optional system prompt
 * @returns {Promise<string>} - The response from Ollama
 */
function runOllamaCLI(model, prompt, systemPrompt = '') {
  return new Promise((resolve, reject) => {
    // Prepare the command
    let command = ['run', model];
    
    // Add system prompt if provided
    if (systemPrompt) {
      command.push('--system');
      command.push(systemPrompt);
    }
    
    // Add the prompt
    command.push(prompt);
    
    console.log(`Running Ollama CLI with model ${model}`);
    console.log(`System prompt: ${systemPrompt ? 'Yes' : 'No'}`);
    
    // Use spawn to run the command and capture streaming output
    const ollamaProcess = spawn('ollama', command, {
      shell: true
    });
    
    let fullOutput = '';
    
    // Handle streaming output
    ollamaProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      fullOutput += chunk;
    });
    
    // Handle errors
    ollamaProcess.stderr.on('data', (data) => {
      console.error(`Ollama stderr: ${data}`);
    });
    
    // Handle process completion
    ollamaProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Ollama process exited with code ${code}`);
        reject(new Error(`Ollama process exited with code ${code}`));
      } else {
        // Clean up the output (remove thinking and spinner characters)
        const cleanedOutput = fullOutput
          .replace(/⠋|⠙|⠹|⠸|⠼|⠴|⠦|⠧|⠇|⠏/g, '') // Remove spinner characters
          .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove thinking sections
          .trim();
        
        console.log('Ollama response received');
        resolve(cleanedOutput);
      }
    });
    
    // Handle process errors
    ollamaProcess.on('error', (error) => {
      console.error(`Ollama process error: ${error.message}`);
      reject(error);
    });
  });
}

module.exports = {
  runOllamaCLI
};
