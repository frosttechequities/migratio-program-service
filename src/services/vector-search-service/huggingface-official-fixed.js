/**
 * Official Hugging Face API Integration
 *
 * This module provides functions to interact with the Hugging Face Inference API
 * using the official @huggingface/inference library.
 */

// Import the Hugging Face Inference library
const { HfInference } = require('@huggingface/inference');
const crypto = require('crypto');

// Simple in-memory cache
const responseCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Configuration
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || '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';
const DEFAULT_MODEL = 'gpt2'; // Widely available model
const FALLBACK_MODEL = 'distilgpt2'; // Even more widely available fallback model
const DEFAULT_TIMEOUT = 30000; // 30 seconds timeout

// Initialize the Hugging Face client
const client = new HfInference(HUGGINGFACE_API_TOKEN);

/**
 * Check if the Hugging Face API is available
 * @returns {Promise<boolean>} - True if the API is available, false otherwise
 */
async function isHuggingFaceAvailable() {
  try {
    console.log('Checking Hugging Face API availability...');
    
    // Try a simple text generation request to check availability
    await client.textGeneration({
      model: DEFAULT_MODEL,
      inputs: 'Hello, I am',
      parameters: {
        max_new_tokens: 5,
        return_full_text: false
      }
    });
    
    console.log('Hugging Face API is available');
    return true;
  } catch (error) {
    // Try with the fallback model
    try {
      console.log('First check failed, trying with fallback model...');
      
      await client.textGeneration({
        model: FALLBACK_MODEL,
        inputs: 'Hello, I am',
        parameters: {
          max_new_tokens: 5,
          return_full_text: false
        }
      });
      
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
    
    // Generate a cache key based on the messages, system prompt, and model
    const cacheKey = crypto.createHash('md5').update(
      `${model}:${JSON.stringify(messages)}:${systemPrompt || ''}`
    ).digest('hex');
    
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
    
    console.log(`Generating text response with model: ${model}`);
    
    // Generate the response
    const response = await client.textGeneration({
      model: model,
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
        return_full_text: false
      }
    });
    
    const result = {
      response: response.generated_text.trim(),
      model: model,
      hasContext: !!systemPrompt,
      method: 'huggingface-official'
    };
    
    // Cache the response
    responseCache.set(cacheKey, {
      response: result,
      timestamp: Date.now()
    });
    
    // Log cache size
    console.log(`Cache size: ${responseCache.size} items`);
    
    return result;
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
