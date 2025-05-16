/**
 * Vector Search Service
 *
 * This service provides vector search and AI chat capabilities for the Visafy platform.
 * It uses Supabase for vector storage and the Hugging Face API for AI features.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const { pipeline } = require('@xenova/transformers');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEwOTE4OCwiZXhwIjoyMDYyNjg1MTg4fQ.s3qm3hcgR9ie2igjmaz4dMeEWsQdsJmQpLR718uO0nA';

console.log('Using Supabase URL:', supabaseUrl);
console.log('API Key starts with:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined');

const supabase = createClient(supabaseUrl, supabaseKey);

// Ollama is not used in production on Render

// Import Official Hugging Face API wrapper
const { generateChatResponse: generateHuggingFaceChatResponse, isHuggingFaceAvailable, DEFAULT_MODEL, FALLBACK_MODEL } = require('./huggingface-official');
console.log('Using Hugging Face models:', DEFAULT_MODEL, 'and', FALLBACK_MODEL);

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

// No mock responses - using only real API responses

// Search endpoint
app.post('/search', async (req, res) => {
  try {
    const { query, limit = 5, threshold = 0.5 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`Searching for: "${query}"`);

    try {
      // Generate embedding for the query
      const embedding = await generateEmbedding(query);

      // Search for similar documents in Supabase with a lower threshold
      const { data: documents, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit
      });

      if (error) {
        console.error('Error searching documents:', error);
        // Return error instead of falling back to mock implementation
        return res.status(500).json({
          error: 'Error searching for documents',
          message: 'Database search failed',
          details: error.message
        });
      }

      console.log(`Found ${documents ? documents.length : 0} documents in Supabase`);

      // If no documents found, try with a lower threshold
      if (!documents || documents.length === 0) {
        console.log('No documents found, trying with lower threshold');
        const lowerThreshold = 0.5;
        const { data: moreDocuments, error: moreError } = await supabase.rpc('match_documents', {
          query_embedding: embedding,
          match_threshold: lowerThreshold,
          match_count: limit
        });

        if (moreError) {
          console.error('Error searching documents with lower threshold:', moreError);
          throw new Error('Supabase search failed');
        }

        console.log(`Found ${moreDocuments ? moreDocuments.length : 0} documents with lower threshold`);

        // Format the results
        const results = moreDocuments ? moreDocuments.map(doc => ({
          id: doc.id,
          content: doc.content,
          metadata: doc.metadata,
          similarity: doc.similarity
        })) : [];

        res.json({ results });
        return;
      }

      // Format the results
      const results = documents.map(doc => ({
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata,
        similarity: doc.similarity
      }));

      // Add cache control headers for better performance
      res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

      res.json({
        results,
        query,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in search endpoint:', error);
      return res.status(500).json({
        error: 'Error searching for documents',
        message: 'An unexpected error occurred during the search operation',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Error in search endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const {
      messages,
      context = '',
      useFastResponse = true // Default to fast response
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log(`Chat request with ${messages.length} messages`);

    // Get the last user message
    const lastUserMessage = messages.length > 0
      ? messages.slice().reverse().find(m => m.role === 'user')
      : null;

    // Try to use the real implementation first
    try {
      // If there's a query in the last user message, search for relevant documents
      let relevantContext = context;
      if (!relevantContext && lastUserMessage) {
        try {
          // Generate embedding for the query
          const embedding = await generateEmbedding(lastUserMessage.content);

          // Search for similar documents in Supabase
          const { data: documents, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.7,
            match_count: 3
          });

          if (error) {
            console.error('Error searching for context:', error);
            throw new Error('Supabase search failed');
          }

          if (documents && documents.length > 0) {
            // Format the documents as context
            relevantContext = documents.map(doc => doc.content).join('\n\n');
          }
        } catch (error) {
          console.error('Error finding relevant context:', error);
          // Continue without context if there's an error
          throw error;
        }
      }

      // Prepare the system message with context if available
      const systemMessage = relevantContext
        ? `You are an immigration assistant for the Visafy platform. Use the following information to answer the user's question:\n\n${relevantContext}`
        : 'You are an immigration assistant for the Visafy platform. Provide helpful and accurate information about immigration processes, requirements, and pathways.';

      // Only use Hugging Face API
      try {
        // Check if Hugging Face API is available
        const huggingFaceAvailable = await isHuggingFaceAvailable();

        if (huggingFaceAvailable) {
          console.log(`Using Hugging Face API for chat response (fast mode: ${useFastResponse})`);

          // Generate response using Hugging Face API wrapper with fast response option
          const result = await generateHuggingFaceChatResponse(messages, systemMessage, useFastResponse);

          // Add cache control headers for better performance
          res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

          // Return the response
          return res.json({
            ...result,
            timestamp: new Date().toISOString()
          });
        } else {
          console.log('Hugging Face API is not available');
          return res.status(503).json({
            error: 'Service unavailable',
            message: 'Hugging Face API is not available.',
            details: 'API availability check failed',
            timestamp: new Date().toISOString()
          });
        }
      } catch (huggingFaceError) {
        console.error('Hugging Face API failed:', huggingFaceError.message);

        console.error('Hugging Face API failed');
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Hugging Face API failed.',
          details: huggingFaceError.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('All AI providers failed');
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'All AI providers failed.',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', async (_, res) => {
  try {
    // Check if Hugging Face API is available
    const huggingFaceAvailable = await isHuggingFaceAvailable();

    res.status(200).json({
      status: 'ok',
      message: 'Vector search service is running',
      huggingFaceAvailable,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(200).json({
      status: 'ok',
      message: 'Vector search service is running, but AI services are unavailable',
      huggingFaceAvailable: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (_, res) => {
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
app.use((err, _, res) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Function to pre-warm the Hugging Face API
async function preWarmHuggingFaceAPI() {
  try {
    console.log('Pre-warming Hugging Face API...');

    // Check if the API is available
    const available = await isHuggingFaceAvailable();

    if (available) {
      // Generate a simple response to warm up the API
      await generateHuggingFaceChatResponse(
        [{ role: 'user', content: 'Hello' }],
        'You are a helpful assistant',
        true
      );

      console.log('Hugging Face API pre-warmed successfully');
    } else {
      console.log('Hugging Face API is not available for pre-warming');

      // Pre-warm the embedding pipeline instead
      try {
        await initEmbeddingPipeline();
        console.log('Embedding pipeline pre-warmed successfully');
      } catch (embeddingError) {
        console.error('Error pre-warming embedding pipeline:', embeddingError.message);
      }

      // Try again in 60 seconds
      setTimeout(preWarmHuggingFaceAPI, 60000);
    }
  } catch (error) {
    console.error('Error pre-warming Hugging Face API:', error.message);

    // Try again in 60 seconds
    setTimeout(preWarmHuggingFaceAPI, 60000);
  }
}

// Start server
app.listen(PORT, async () => {
  try {
    // Initialize the embedding pipeline on startup
    await initEmbeddingPipeline();
    console.log(`Vector search service running on port ${PORT}`);

    // Pre-warm the API after server starts
    preWarmHuggingFaceAPI();

    // Set up periodic pre-warming (every 10 minutes)
    setInterval(preWarmHuggingFaceAPI, 10 * 60 * 1000);
  } catch (error) {
    console.error('Error starting server:', error);
  }
});

module.exports = app;
