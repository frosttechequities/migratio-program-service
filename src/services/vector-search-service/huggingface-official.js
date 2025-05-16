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
const DEFAULT_MODEL = 'facebook/bart-large-cnn'; // Widely available summarization model
const FALLBACK_MODEL = 'facebook/bart-large-mnli'; // Widely available classification model
const DEFAULT_TIMEOUT = 20000; // 20 seconds timeout

// Initialize the Hugging Face client
const client = new HfInference(HUGGINGFACE_API_TOKEN);

/**
 * Check if the Hugging Face API is available
 * @returns {Promise<boolean>} - True if the API is available, false otherwise
 */
async function isHuggingFaceAvailable() {
  try {
    console.log('Checking Hugging Face API availability...');

    // Try a simple summarization request to check availability
    try {
      const response = await client.summarization({
        model: DEFAULT_MODEL,
        inputs: 'The tower is 324 metres tall, about the same height as an 81-storey building.',
        parameters: {
          max_length: 20
        }
      });

      console.log('Hugging Face API is available');
      return true;
    } catch (error) {
      console.log('First check failed, trying with fallback model...');

      // Try with the fallback model for zero-shot classification
      try {
        const fallbackResponse = await client.zeroShotClassification({
          model: FALLBACK_MODEL,
          inputs: 'I love this product!',
          parameters: {
            candidate_labels: ['positive', 'negative']
          }
        });

        console.log('Hugging Face API is available (using fallback model)');
        return true;
      } catch (fallbackError) {
        console.error('Fallback model check failed:', fallbackError.message);

        // Try a direct API call as a last resort
        try {
          const directResponse = await fetch('https://api-inference.huggingface.co/status', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`
            }
          });

          if (directResponse.ok) {
            console.log('Hugging Face API is available (status check)');
            return true;
          }

          console.error('Hugging Face API status check failed');
          return false;
        } catch (directError) {
          console.error('Direct API check failed:', directError.message);
          return false;
        }
      }
    }
  } catch (error) {
    console.error('Hugging Face API availability check failed:', error.message);
    return false;
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

    console.log(`Generating response with model: ${model}`);

    // Use summarization instead of text generation
    const response = await client.summarization({
      model: DEFAULT_MODEL,
      inputs: prompt,
      parameters: {
        max_length: 150,
        min_length: 30,
        do_sample: false
      }
    });

    const result = {
      response: response.summary_text || response.generated_text || "I'm sorry, I couldn't generate a response at this time.",
      model: DEFAULT_MODEL,
      hasContext: !!systemPrompt,
      method: 'huggingface-official-summarization'
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

    // Try with zero-shot classification as a fallback
    try {
      console.log(`Trying with zero-shot classification fallback`);

      // Get the last user message
      const userMessage = messages.filter(msg => msg.role === 'user').pop().content;

      // Use zero-shot classification to determine sentiment and topic
      const classificationResponse = await client.zeroShotClassification({
        model: FALLBACK_MODEL,
        inputs: userMessage,
        parameters: {
          candidate_labels: ['question', 'statement', 'request', 'greeting', 'farewell']
        }
      });

      // Generate a simple response based on classification
      let fallbackResponse = "I understand your message. How can I help you further?";

      if (classificationResponse && classificationResponse.labels && classificationResponse.labels.length > 0) {
        const topLabel = classificationResponse.labels[0];

        if (topLabel === 'question') {
          fallbackResponse = "That's an interesting question. I'll do my best to help you with that.";
        } else if (topLabel === 'greeting') {
          fallbackResponse = "Hello! It's nice to meet you. How can I assist you today?";
        } else if (topLabel === 'farewell') {
          fallbackResponse = "Goodbye! Feel free to reach out if you need anything else.";
        } else if (topLabel === 'request') {
          fallbackResponse = "I'll try my best to help with your request.";
        }
      }

      return {
        response: fallbackResponse,
        model: FALLBACK_MODEL,
        hasContext: false,
        method: 'huggingface-official-fallback'
      };
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError.message);

      // Return a generic response as a last resort
      return {
        response: "I'm sorry, I'm having trouble generating a response right now. Please try again later.",
        model: 'generic-fallback',
        hasContext: false,
        method: 'generic-fallback'
      };
    }
  }
}

module.exports = {
  isHuggingFaceAvailable,
  generateChatResponse,
  DEFAULT_MODEL,
  FALLBACK_MODEL
};
