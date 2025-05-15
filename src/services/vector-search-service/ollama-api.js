/**
 * Ollama API wrapper for the vector search service
 * 
 * This module provides functions to interact with the Ollama API
 */

const axios = require('axios');

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b'; // Using a smaller model by default
const OLLAMA_FALLBACK_MODEL = process.env.OLLAMA_FALLBACK_MODEL || 'mistral';

/**
 * Generate a response from Ollama using the chat API
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} systemPrompt - Optional system prompt to override the default
 * @returns {Promise<Object>} - Object containing the response and model used
 */
async function generateChatResponse(messages, systemPrompt = null) {
  try {
    console.log('Generating chat response with Ollama API...');
    console.log(`Using model: ${OLLAMA_MODEL}`);
    console.log(`System prompt provided: ${systemPrompt ? 'Yes' : 'No'}`);
    
    // Prepare the messages array
    const ollamaMessages = [];
    
    // Add system message if provided
    if (systemPrompt) {
      ollamaMessages.push({ role: 'system', content: systemPrompt });
    }
    
    // Add the user messages
    ollamaMessages.push(...messages);
    
    try {
      // Make the API call to Ollama
      const result = await axios.post(
        `${OLLAMA_URL}/api/chat`,
        {
          model: OLLAMA_MODEL,
          messages: ollamaMessages,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 1024,
          }
        },
        {
          timeout: 60000 // 1 minute timeout
        }
      );
      
      // Extract the response
      const response = result.data.message.content;
      console.log('Received response from Ollama');
      
      return {
        response,
        model: OLLAMA_MODEL,
        hasContext: !!systemPrompt
      };
    } catch (ollamaError) {
      console.error('Error using primary model:', ollamaError.message);
      if (ollamaError.response) {
        console.error('Response status:', ollamaError.response.status);
        console.error('Response data:', ollamaError.response.data);
      }
      
      // Try the fallback model if the first one fails
      console.log(`Trying fallback model: ${OLLAMA_FALLBACK_MODEL}`);
      try {
        const fallbackResult = await axios.post(
          `${OLLAMA_URL}/api/chat`,
          {
            model: OLLAMA_FALLBACK_MODEL,
            messages: ollamaMessages,
            stream: false,
            options: {
              temperature: 0.7,
              num_predict: 1024,
            }
          },
          {
            timeout: 60000 // 1 minute timeout
          }
        );
        
        // Extract the response
        const response = fallbackResult.data.message.content;
        console.log('Received response from fallback model');
        
        return {
          response,
          model: OLLAMA_FALLBACK_MODEL,
          hasContext: !!systemPrompt
        };
      } catch (fallbackError) {
        console.error('Error using fallback model:', fallbackError.message);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error('All Ollama API attempts failed:', error.message);
    throw error;
  }
}

/**
 * Check if Ollama is available
 * @returns {Promise<boolean>} - True if Ollama is available, false otherwise
 */
async function isOllamaAvailable() {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('Ollama availability check failed:', error.message);
    return false;
  }
}

module.exports = {
  generateChatResponse,
  isOllamaAvailable,
  OLLAMA_MODEL,
  OLLAMA_FALLBACK_MODEL
};
