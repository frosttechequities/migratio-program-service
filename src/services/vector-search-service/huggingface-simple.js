/**
 * Simple Hugging Face API Integration
 *
 * This module provides functions to interact with the Hugging Face Inference API
 * using a simple axios-based implementation.
 */

const axios = require('axios');
const crypto = require('crypto');

// Simple in-memory cache
const responseCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Configuration
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || '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';
const DEFAULT_MODEL = 'gpt2'; // Widely available model
const FALLBACK_MODEL = 'distilgpt2'; // Even more widely available fallback model
const DEFAULT_TIMEOUT = 30000; // 30 seconds timeout

/**
 * Check if the Hugging Face API is available
 * @returns {Promise<boolean>} - True if the API is available, false otherwise
 */
async function isHuggingFaceAvailable() {
  try {
    console.log('Checking Hugging Face API availability...');
    
    // Try a simple text generation request to check availability
    const response = await axios.post(
      `${HUGGINGFACE_API_URL}/${DEFAULT_MODEL}`,
      {
        inputs: 'Hello, I am',
        parameters: {
          max_new_tokens: 5,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    
    console.log('Hugging Face API is available');
    return true;
  } catch (error) {
    // Try with the fallback model
    try {
      console.log('First check failed, trying with fallback model...');
      
      const fallbackResponse = await axios.post(
        `${HUGGINGFACE_API_URL}/${FALLBACK_MODEL}`,
        {
          inputs: 'Hello, I am',
          parameters: {
            max_new_tokens: 5,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );
      
      console.log('Hugging Face API is available (using fallback model)');
      return true;
    } catch (fallbackError) {
      console.error('Hugging Face API availability check failed:', error.message);
      console.error('Fallback check also failed:', fallbackError.message);
      return false;
    }
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
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
        return_full_text: false
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
 * @returns {Promise<Object>} - Object containing the response and model used
 */
async function generateChatResponse(messages, systemPrompt = null, useFastResponse = true) {
  try {
    // Get the last user message
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }
    
    // Format the prompt for the model
    let prompt = '';
    const model = useFastResponse ? FALLBACK_MODEL : DEFAULT_MODEL;
    
    if (useFastResponse) {
      // Simplified prompt for faster responses
      prompt = `${systemPrompt ? systemPrompt + ': ' : ''}${lastUserMessage.content}`;
    } else {
      // Format the conversation history
      if (systemPrompt) {
        prompt += `System: ${systemPrompt}\n\n`;
      }
      
      for (const message of messages) {
        const role = message.role === 'user' ? 'User' : 'Assistant';
        prompt += `${role}: ${message.content}\n`;
      }
      
      prompt += 'Assistant:';
    }
    
    // Generate the response
    const response = await generateTextResponse(prompt, model);
    
    return {
      response: response.trim(),
      model: model,
      hasContext: !!systemPrompt,
      method: 'huggingface-simple'
    };
  } catch (error) {
    console.error('Error generating chat response:', error.message);
    
    // Try with the fallback model if not already using fast response mode
    if (!useFastResponse) {
      try {
        console.log(`Trying with fast response mode and fallback model: ${FALLBACK_MODEL}`);
        return generateChatResponse(messages, systemPrompt, true);
      } catch (fallbackError) {
        console.error('Fast response mode also failed:', fallbackError.message);
        throw fallbackError;
      }
    }
    
    throw error;
  }
}

module.exports = {
  isHuggingFaceAvailable,
  generateChatResponse,
  DEFAULT_MODEL,
  FALLBACK_MODEL
};
