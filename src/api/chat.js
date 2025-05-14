/**
 * Chat API
 *
 * This API endpoint provides chat functionality using the Gemini API.
 * It uses relevant documents from the vector database as context for generating responses.
 */

require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyDJC5a882ruaJN2HQR9nz_P-8R4dCUP-Ss');

/**
 * @route POST /api/chat
 * @desc Generate a chat response
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { message, context, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format the conversation history
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Create a system prompt with context
    const systemPrompt = `You are an immigration assistant for Visafy, a platform that helps people navigate immigration processes.

Your goal is to provide accurate, helpful information about immigration processes, requirements, and pathways.

${context ? `Here is some relevant information that might help with the user's query:
---
${context}
---` : ''}

When responding:
1. Be concise and clear
2. If you're not sure about something, say so rather than providing incorrect information
3. Focus on factual information about immigration processes
4. Avoid making specific recommendations about which immigration pathway someone should choose
5. Don't provide legal advice
6. If the user asks about something unrelated to immigration, politely redirect them

Now please respond to the user's message.`;

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Start a chat session
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
      systemInstruction: systemPrompt,
    });

    // Generate a response
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return res.json({
      response,
      model: 'gemini-pro'
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Error generating chat response' });
  }
});

/**
 * @route GET /api/chat/health
 * @desc Check if the chat API is working
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chat API is working' });
});

module.exports = router;
