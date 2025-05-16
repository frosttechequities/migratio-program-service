/**
 * Hugging Face API Integration
 *
 * This module provides functions to interact with the Hugging Face Inference API.
 * It serves as an alternative to Ollama for generating AI responses.
 */

const axios = require('axios');
const crypto = require('crypto');

// Simple in-memory cache
const responseCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Configuration for Hugging Face API
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const DEFAULT_MODEL = 'google/flan-t5-small'; // Small, fast model for production
const FALLBACK_MODEL = 'distilgpt2'; // Even smaller fallback model
const DEFAULT_TIMEOUT = 30000; // 30 seconds timeout

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
    // Generate a cache key based on the prompt and model
    const cacheKey = crypto.createHash('md5').update(`${model}:${prompt}`).digest('hex');

    // Check if we have a cached response
    if (responseCache.has(cacheKey)) {
      const cachedItem = responseCache.get(cacheKey);

      // Check if the cached item is still valid
      if (Date.now() - cachedItem.timestamp < CACHE_TTL) {
        console.log(`Using cached response for model: ${model}`);
        return cachedItem.response;
      } else {
        // Remove expired cache item
        responseCache.delete(cacheKey);
      }
    }

    console.log(`Generating text response with model: ${model}`);

    const requestData = {
      inputs: prompt,
      parameters: {
        max_length: 256, // Shorter max length for faster responses
        temperature: 0.5, // Lower temperature for more deterministic responses
        top_p: 0.85, // Slightly lower top_p
        do_sample: true,
        max_time: 20, // Maximum time in seconds to spend generating
        return_full_text: false // Don't return the full prompt + response
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

    let generatedText;

    // Extract the generated text from the response
    if (Array.isArray(response.data) && response.data.length > 0) {
      generatedText = response.data[0].generated_text;
    } else if (typeof response.data === 'object' && response.data.generated_text) {
      generatedText = response.data.generated_text;
    } else if (typeof response.data === 'string') {
      generatedText = response.data;
    } else {
      throw new Error('Unexpected response format from Hugging Face API');
    }

    // Cache the response
    responseCache.set(cacheKey, {
      response: generatedText,
      timestamp: Date.now()
    });

    // Log cache size
    console.log(`Cache size: ${responseCache.size} items`);

    return generatedText;
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
 * @param {boolean} useFastResponse - Whether to use a faster response approach
 * @param {number} timeout - Timeout in milliseconds (optional)
 * @returns {Promise<Object>} - Object containing the response and model used
 */
async function generateChatResponse(messages, systemPrompt = null, useFastResponse = true, timeout = DEFAULT_TIMEOUT) {
  try {
    // Get the last user message
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();

    if (!lastUserMessage) {
      throw new Error('No user message found');
    }

    // Format the messages into a prompt
    let prompt = '';
    let model = DEFAULT_MODEL;

    if (useFastResponse) {
      // Simplified prompt for faster responses
      prompt = `${systemPrompt ? systemPrompt + ': ' : ''}${lastUserMessage.content}`;
      model = 'google/flan-t5-small'; // Use the smallest model for fast responses
    } else {
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
    }

    // Generate the response
    const response = await generateTextResponse(prompt, model, timeout);

    return {
      response: response.trim(),
      model: model,
      hasContext: !!systemPrompt,
      method: 'huggingface',
      fastResponse: useFastResponse
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
