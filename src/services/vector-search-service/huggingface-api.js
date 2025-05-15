/**
 * Hugging Face API Integration
 *
 * This module provides functions to interact with the Hugging Face Inference API.
 * It serves as an alternative to Ollama for generating AI responses.
 */

const axios = require('axios');

// Configuration
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || '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';
const DEFAULT_MODEL = 'HuggingFaceH4/zephyr-7b-beta'; // Known working model
const FALLBACK_MODEL = 'google/flan-t5-base'; // Smaller fallback model
const DEFAULT_TIMEOUT = 60000; // 60 seconds

/**
 * Check if the Hugging Face API is available
 * @returns {Promise<boolean>} - True if the API is available, false otherwise
 */
async function isHuggingFaceAvailable() {
  try {
    console.log('Checking Hugging Face API availability...');

    const response = await axios.get(
      `${HUGGINGFACE_API_URL}/${DEFAULT_MODEL}`,
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`
        },
        timeout: 5000
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('Hugging Face API availability check failed:', error.message);
    return false;
  }
}

/**
 * Generate a text response using the Hugging Face Inference API
 * @param {string} prompt - The prompt to send to the model
 * @param {string} model - The model to use (optional)
 * @param {number} timeout - Timeout in milliseconds (optional)
 * @returns {Promise<string>} - The generated text
 */
async function generateTextResponse(prompt, model = DEFAULT_MODEL, timeout = DEFAULT_TIMEOUT) {
  try {
    console.log(`Generating text response with model: ${model}`);

    const requestData = {
      inputs: prompt,
      parameters: {
        max_length: 512,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true
      }
    };

    const response = await axios.post(
      `${HUGGINGFACE_API_URL}/${model}`,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: timeout
      }
    );

    // Extract the generated text from the response
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0].generated_text;
    } else if (typeof response.data === 'object' && response.data.generated_text) {
      return response.data.generated_text;
    } else if (typeof response.data === 'string') {
      return response.data;
    }

    throw new Error('Unexpected response format from Hugging Face API');
  } catch (error) {
    console.error(`Error generating text with model ${model}:`, error.message);

    // Try the fallback model if the primary model fails
    if (model !== FALLBACK_MODEL) {
      console.log(`Trying fallback model: ${FALLBACK_MODEL}`);
      return generateTextResponse(prompt, FALLBACK_MODEL, timeout);
    }

    throw error;
  }
}

/**
 * Generate a chat response using the Hugging Face Inference API
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} systemPrompt - Optional system prompt
 * @param {number} timeout - Timeout in milliseconds (optional)
 * @returns {Promise<Object>} - Object containing the response and model used
 */
async function generateChatResponse(messages, systemPrompt = null, timeout = DEFAULT_TIMEOUT) {
  try {
    // Format the messages into a prompt
    let prompt = '';

    // Add system prompt if provided
    if (systemPrompt) {
      prompt += `System: ${systemPrompt}\n\n`;
    }

    // Add the messages
    for (const message of messages) {
      const role = message.role === 'user' ? 'User' : 'Assistant';
      prompt += `${role}: ${message.content}\n`;
    }

    // Add the final prompt for the assistant
    prompt += 'Assistant:';

    // Generate the response
    const response = await generateTextResponse(prompt, DEFAULT_MODEL, timeout);

    return {
      response: response.trim(),
      model: DEFAULT_MODEL,
      hasContext: !!systemPrompt,
      method: 'huggingface'
    };
  } catch (error) {
    console.error('Error generating chat response:', error.message);
    throw error;
  }
}

module.exports = {
  isHuggingFaceAvailable,
  generateTextResponse,
  generateChatResponse,
  DEFAULT_MODEL,
  FALLBACK_MODEL
};
