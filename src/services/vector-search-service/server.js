/**
 * Vector Search Service
 *
 * This service provides vector search and AI chat capabilities for the Visafy platform.
 * It uses Supabase for vector storage and the Google Gemini API for AI features.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const { pipeline } = require('@xenova/transformers');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Initialize the embedding pipeline
let embeddingPipeline;

// Create Express app
const app = express();
const PORT = process.env.PORT || 3006;

// Set up middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Initialize the embedding pipeline
const initEmbeddingPipeline = async () => {
  if (!embeddingPipeline) {
    console.log('Initializing embedding pipeline...');
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Embedding pipeline initialized');
  }
  return embeddingPipeline;
};

// Generate embeddings for a text
const generateEmbedding = async (text) => {
  try {
    const pipeline = await initEmbeddingPipeline();
    const output = await pipeline(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

// Search endpoint
app.post('/search', async (req, res) => {
  try {
    const { query, limit = 5, threshold = 0.7 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`Searching for: "${query}"`);

    // Generate embedding for the query
    const embedding = await generateEmbedding(query);

    // Search for similar documents in Supabase
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit
    });

    if (error) {
      console.error('Error searching documents:', error);
      return res.status(500).json({ error: 'Error searching documents' });
    }

    // Format the results
    const results = documents ? documents.map(doc => ({
      id: doc.id,
      content: doc.content,
      metadata: doc.metadata,
      similarity: doc.similarity
    })) : [];

    res.json({ results });
  } catch (error) {
    console.error('Error in search endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { messages, context = '', model = 'gemini-pro' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log(`Chat request with ${messages.length} messages`);

    // If there's a query in the last user message, search for relevant documents
    let relevantContext = context;
    if (!relevantContext && messages.length > 0) {
      const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        try {
          // Generate embedding for the query
          const embedding = await generateEmbedding(lastUserMessage.content);

          // Search for similar documents in Supabase
          const { data: documents, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.7,
            match_count: 3
          });

          if (!error && documents && documents.length > 0) {
            // Format the documents as context
            relevantContext = documents.map(doc => doc.content).join('\n\n');
          }
        } catch (error) {
          console.error('Error finding relevant context:', error);
          // Continue without context if there's an error
        }
      }
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Prepare the chat history
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Create a chat session
      const chat = model.startChat({
        history,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
      });

      // Generate a response
      const systemPrompt = relevantContext
        ? `You are an immigration assistant for the Visafy platform. Use the following information to answer the user's question:\n\n${relevantContext}`
        : 'You are an immigration assistant for the Visafy platform. Provide helpful and accurate information about immigration processes, requirements, and pathways.';

      const result = await chat.sendMessage(systemPrompt);
      const response = result.response.text();

      res.json({
        response,
        model: 'gemini-pro',
        hasContext: !!relevantContext
      });
    } catch (error) {
      console.error('Error generating chat response:', error);

      // Provide a fallback response
      res.json({
        response: "I'm sorry, I'm having trouble generating a response right now. Please try again later.",
        model: 'fallback',
        hasContext: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal error' : error.message
      });
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Vector search service is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Visafy Vector Search Service',
    version: '0.1.0',
    description: 'API for semantic search and chat functionality',
    endpoints: [
      '/search',
      '/chat',
      '/health'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
app.listen(PORT, async () => {
  try {
    // Initialize the embedding pipeline on startup
    await initEmbeddingPipeline();
    console.log(`Vector search service running on port ${PORT}`);
  } catch (error) {
    console.error('Error starting server:', error);
  }
});

module.exports = app;
