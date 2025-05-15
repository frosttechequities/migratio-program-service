/**
 * Test script for Ollama using direct CLI commands
 */

const { exec } = require('child_process');

function runOllamaCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${command}`);
    
    exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      
      resolve(stdout);
    });
  });
}

async function testOllamaCli() {
  try {
    console.log('Testing Ollama CLI directly...');
    
    // Check Ollama version
    console.log('\nChecking Ollama version...');
    const versionOutput = await runOllamaCommand('ollama --version');
    console.log(`Version: ${versionOutput.trim()}`);
    
    // List available models
    console.log('\nListing available models...');
    const modelsOutput = await runOllamaCommand('ollama list');
    console.log(`Models:\n${modelsOutput.trim()}`);
    
    // Run a simple query
    console.log('\nRunning a simple query...');
    const queryOutput = await runOllamaCommand('ollama run deepseek-r1:1.5b "Hello, how are you?"');
    console.log(`Response:\n${queryOutput.trim()}`);
    
  } catch (error) {
    console.error('Error testing Ollama CLI:', error.message);
  }
}

// Run the test
testOllamaCli();
