/**
 * Semantic Search API
 *
 * This API endpoint allows users to search for documents using semantic search.
 * It converts the search query into an embedding and finds similar documents in Supabase.
 */

require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { pipeline } = require('@xenova/transformers');

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NzU5ODgsImV4cCI6MjAzMTE1MTk4OH0.Wd0jXKYQQgwIwP0SvCblOmjVBCKzKIxHMrGOq5xUYHE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize the embedding pipeline
let embeddingPipeline;

// Function to initialize the embedding pipeline
async function initEmbeddingPipeline() {
  if (!embeddingPipeline) {
    console.log('Initializing embedding pipeline...');
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embeddingPipeline;
}

// Function to generate embeddings for a text
async function generateEmbedding(text) {
  const pipe = await initEmbeddingPipeline();
  const result = await pipe(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

/**
 * @route POST /api/search
 * @desc Search for documents using semantic search
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { query, limit = 5, threshold = 0.7 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Generate embedding for the query
    const embedding = await generateEmbedding(query);

    // Search for similar documents in Supabase
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit
    });

    if (error) {
      console.error('Error searching documents:', error);
      return res.status(500).json({ error: 'Error searching documents' });
    }

    // Format the results
    const results = data.map(doc => ({
      id: doc.id,
      content: doc.content,
      metadata: doc.metadata,
      similarity: doc.similarity
    }));

    return res.json({
      query,
      results,
      count: results.length
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/search/health
 * @desc Check if the search API is working
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Search API is working' });
});

module.exports = router;
