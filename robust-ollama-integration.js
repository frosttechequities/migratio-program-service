/**
 * Robust Ollama Integration Module
 *
 * This module provides a reliable way to interact with Ollama using both the official library
 * and fallback mechanisms to ensure high availability.
 */

const { Ollama } = require('ollama');
const { exec } = require('child_process');
const axios = require('axios');

// Configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const PRIMARY_MODEL = process.env.OLLAMA_MODEL || 'mistral'; // Using a larger model for better quality
const FALLBACK_MODEL = process.env.OLLAMA_FALLBACK_MODEL || 'deepseek-r1:1.5b'; // Smaller model as fallback for speed
const FAST_MODEL = 'deepseek-r1:1.5b'; // Smallest model for when speed is critical
const DEFAULT_TIMEOUT = 180000; // 3 minutes for larger models

// Initialize the official Ollama client
const ollama = new Ollama({
  host: OLLAMA_HOST
});

/**
 * Check if Ollama is available
 * @returns {Promise<boolean>} - True if Ollama is available, false otherwise
 */
async function isOllamaAvailable() {
  try {
    console.log('Checking Ollama availability...');
    const response = await axios.get(`${OLLAMA_HOST}/api/tags`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('Ollama availability check failed:', error.message);
    return false;
  }
}

/**
 * Generate a chat response using the official Ollama library
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} systemPrompt - Optional system prompt
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} - Object containing the response and model used
 */
async function generateChatWithLibrary(messages, systemPrompt = null, timeout = DEFAULT_TIMEOUT) {
  try {
    console.log('Generating chat response with Ollama library...');
    console.log(`Using model: ${PRIMARY_MODEL}`);

    // Prepare the messages array
    const ollamaMessages = [];

    // Add system message if provided
    if (systemPrompt) {
      ollamaMessages.push({ role: 'system', content: systemPrompt });
    }

    // Add the user messages
    ollamaMessages.push(...messages);

    // Set AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Make the API call to Ollama using the official library
      const response = await ollama.chat({
        model: PRIMARY_MODEL,
        messages: ollamaMessages,
        options: {
          temperature: 0.7,
          num_predict: 1024,
        }
      }, { signal: controller.signal });

      clearTimeout(timeoutId);

      return {
        response: response.message.content,
        model: PRIMARY_MODEL,
        hasContext: !!systemPrompt
      };
    } catch (error) {
      console.error('Error using primary model with library:', error.message);

      // Try the fallback model
      console.log(`Trying fallback model: ${FALLBACK_MODEL}`);

      // Reset the AbortController
      clearTimeout(timeoutId);
      const fallbackController = new AbortController();
      const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), timeout);

      try {
        const fallbackResponse = await ollama.chat({
          model: FALLBACK_MODEL,
          messages: ollamaMessages,
          options: {
            temperature: 0.7,
            num_predict: 1024,
          }
        }, { signal: fallbackController.signal });

        clearTimeout(fallbackTimeoutId);

        return {
          response: fallbackResponse.message.content,
          model: FALLBACK_MODEL,
          hasContext: !!systemPrompt
        };
      } catch (fallbackError) {
        clearTimeout(fallbackTimeoutId);
        console.error('Error using fallback model with library:', fallbackError.message);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error('All Ollama library attempts failed:', error.message);
    throw error;
  }
}

/**
 * Generate a chat response using the direct Ollama API
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} systemPrompt - Optional system prompt
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} - Object containing the response and model used
 */
async function generateChatWithDirectAPI(messages, systemPrompt = null, timeout = DEFAULT_TIMEOUT) {
  try {
    console.log('Generating chat response with direct Ollama API...');
    console.log(`Using model: ${PRIMARY_MODEL}`);

    // Prepare the messages array
    const ollamaMessages = [];

    // Add system message if provided
    if (systemPrompt) {
      ollamaMessages.push({ role: 'system', content: systemPrompt });
    }

    // Add the user messages
    ollamaMessages.push(...messages);

    try {
      // Make the API call to Ollama directly
      const result = await axios.post(
        `${OLLAMA_HOST}/api/chat`,
        {
          model: PRIMARY_MODEL,
          messages: ollamaMessages,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 1024,
          }
        },
        {
          timeout: timeout
        }
      );

      // Extract the response
      const response = result.data.message.content;
      console.log('Received response from Ollama API');

      return {
        response,
        model: PRIMARY_MODEL,
        hasContext: !!systemPrompt
      };
    } catch (error) {
      console.error('Error using primary model with direct API:', error.message);

      // Try the fallback model
      console.log(`Trying fallback model: ${FALLBACK_MODEL}`);

      try {
        const fallbackResult = await axios.post(
          `${OLLAMA_HOST}/api/chat`,
          {
            model: FALLBACK_MODEL,
            messages: ollamaMessages,
            stream: false,
            options: {
              temperature: 0.7,
              num_predict: 1024,
            }
          },
          {
            timeout: timeout
          }
        );

        // Extract the response
        const response = fallbackResult.data.message.content;
        console.log('Received response from fallback model API');

        return {
          response,
          model: FALLBACK_MODEL,
          hasContext: !!systemPrompt
        };
      } catch (fallbackError) {
        console.error('Error using fallback model with direct API:', fallbackError.message);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error('All Ollama API attempts failed:', error.message);
    throw error;
  }
}

/**
 * Generate a chat response using the Ollama CLI
 * @param {string} prompt - The prompt to send to Ollama
 * @param {string} model - The model to use
 * @param {string} systemPrompt - Optional system prompt
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<string>} - The response from Ollama
 */
function generateChatWithCLI(prompt, model = PRIMARY_MODEL, systemPrompt = '', timeout = DEFAULT_TIMEOUT) {
  return new Promise((resolve, reject) => {
    console.log(`Running Ollama CLI with model ${model}`);

    // Prepare the command
    let command = `ollama run ${model}`;

    // Add system prompt if provided
    if (systemPrompt) {
      command += ` --system "${systemPrompt}"`;
    }

    // Add the prompt
    command += ` "${prompt}"`;

    console.log('Running command:', command);

    // Execute the command with a timeout
    exec(command, { timeout }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Ollama CLI error: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.error(`Ollama CLI stderr: ${stderr}`);
      }

      // Clean up the output (remove thinking and spinner characters)
      const cleanedOutput = stdout
        .replace(/⠋|⠙|⠹|⠸|⠼|⠴|⠦|⠧|⠇|⠏/g, '') // Remove spinner characters
        .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove thinking sections
        .trim();

      console.log('Ollama CLI response received');
      resolve(cleanedOutput);
    });
  });
}

/**
 * Generate a chat response using the most reliable method available
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} systemPrompt - Optional system prompt
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} - Object containing the response and model used
 */
async function generateChatResponse(messages, systemPrompt = null, timeout = DEFAULT_TIMEOUT) {
  try {
    // Check if Ollama is available
    const ollamaAvailable = await isOllamaAvailable();

    if (!ollamaAvailable) {
      throw new Error('Ollama is not available');
    }

    // Try the official library first
    try {
      return await generateChatWithLibrary(messages, systemPrompt, timeout);
    } catch (libraryError) {
      console.log('Library approach failed, trying direct API...');

      // Try the direct API next
      try {
        return await generateChatWithDirectAPI(messages, systemPrompt, timeout);
      } catch (apiError) {
        console.log('Direct API approach failed, trying CLI...');

        // Try the CLI as a last resort
        try {
          // Extract the last user message for the CLI
          const lastUserMessage = messages.filter(m => m.role === 'user').pop();

          if (!lastUserMessage) {
            throw new Error('No user message found');
          }

          const cliResponse = await generateChatWithCLI(
            lastUserMessage.content,
            PRIMARY_MODEL,
            systemPrompt,
            timeout
          );

          return {
            response: cliResponse,
            model: PRIMARY_MODEL,
            hasContext: !!systemPrompt,
            method: 'cli'
          };
        } catch (cliError) {
          console.error('CLI approach failed:', cliError.message);
          throw cliError;
        }
      }
    }
  } catch (error) {
    console.error('All Ollama approaches failed:', error.message);
    throw error;
  }
}

/**
 * Generate a fast chat response using the smallest model
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} systemPrompt - Optional system prompt
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} - Object containing the response and model used
 */
async function generateFastChatResponse(messages, systemPrompt = null, timeout = 60000) {
  try {
    console.log('Generating fast chat response with smallest model...');
    console.log(`Using model: ${FAST_MODEL}`);

    // Prepare the messages array
    const ollamaMessages = [];

    // Add system message if provided
    if (systemPrompt) {
      ollamaMessages.push({ role: 'system', content: systemPrompt });
    }

    // Add the user messages
    ollamaMessages.push(...messages);

    // Set AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Make the API call to Ollama using the official library with the smallest model
      const response = await ollama.chat({
        model: FAST_MODEL,
        messages: ollamaMessages,
        options: {
          temperature: 0.7,
          num_predict: 1024,
        }
      }, { signal: controller.signal });

      clearTimeout(timeoutId);

      return {
        response: response.message.content,
        model: FAST_MODEL,
        hasContext: !!systemPrompt,
        method: 'fast'
      };
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error using fast model:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Fast chat response failed:', error.message);
    throw error;
  }
}

module.exports = {
  isOllamaAvailable,
  generateChatResponse,
  generateChatWithLibrary,
  generateChatWithDirectAPI,
  generateChatWithCLI,
  generateFastChatResponse,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
  FAST_MODEL
};
