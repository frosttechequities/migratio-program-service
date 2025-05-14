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
const axios = require('axios');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEwOTE4OCwiZXhwIjoyMDYyNjg1MTg4fQ.s3qm3hcgR9ie2igjmaz4dMeEWsQdsJmQpLR718uO0nA';

console.log('Using Supabase URL:', supabaseUrl);
console.log('API Key starts with:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined');

const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenRouter API
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'sk-or-v1-free-test-key';
console.log('Using OpenRouter API Key starting with:', OPENROUTER_API_KEY.substring(0, 10) + '...');

// OpenRouter configuration
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'anthropic/claude-3-haiku'; // A good free option

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

// Mock data for search and chat
const mockDocuments = [
  {
    id: 1,
    content: "The Express Entry system is Canada's flagship immigration management system for key economic immigration programs. Launched in January 2015, Express Entry is not an immigration program itself but rather a system used to manage applications for permanent residence under three federal economic immigration programs: Federal Skilled Worker Program (FSWP), Federal Skilled Trades Program (FSTP), and Canadian Experience Class (CEC).",
    metadata: {
      title: "Express Entry Program Guide",
      source: "Immigration Canada",
      tags: ["canada", "express entry", "immigration"]
    },
    similarity: 0.92
  },
  {
    id: 2,
    content: "When applying for immigration to any country, proper documentation is crucial for a successful application. Essential identity documents include a valid passport (must be valid for at least 6 months beyond your intended period of stay), previous passports, birth certificate, marriage certificate (if applicable), divorce certificate/decree (if previously married), and national identity documents.",
    metadata: {
      title: "Document Requirements for Immigration",
      source: "Immigration Resources",
      tags: ["documents", "requirements", "immigration"]
    },
    similarity: 0.85
  },
  {
    id: 3,
    content: "Language proficiency is a critical component of the immigration process for many countries. Demonstrating adequate language skills is not only a requirement for most immigration pathways but also a key factor in successful integration and employment prospects in a new country.",
    metadata: {
      title: "Language Testing for Immigration",
      source: "Immigration Resources",
      tags: ["language testing", "proficiency", "immigration"]
    },
    similarity: 0.78
  },
  {
    id: 4,
    content: "Medical examinations are a mandatory component of most immigration processes worldwide. These examinations serve to ensure that applicants do not pose a public health risk to the destination country and that they will not place excessive demands on health and social services.",
    metadata: {
      title: "Medical Examinations for Immigration",
      source: "Immigration Resources",
      tags: ["medical", "health", "immigration"]
    },
    similarity: 0.75
  },
  {
    id: 5,
    content: "Points-based immigration systems are structured frameworks used by many countries to select skilled immigrants based on their potential to contribute economically and integrate successfully into society. These systems assign points for various attributes such as age, education, work experience, language proficiency, and adaptability factors.",
    metadata: {
      title: "Points-Based Immigration Systems",
      source: "Immigration Resources",
      tags: ["points system", "skilled immigration", "immigration"]
    },
    similarity: 0.72
  }
];

// Search endpoint
app.post('/search', async (req, res) => {
  try {
    const { query, limit = 5, threshold = 0.7 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`Searching for: "${query}"`);

    try {
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
        // Fall back to mock implementation
        throw new Error('Supabase search failed');
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
      console.log('Using mock implementation for search');

      // Filter mock results based on the query
      const filteredResults = mockDocuments.filter(result =>
        result.content.toLowerCase().includes(query.toLowerCase()) ||
        result.metadata.title.toLowerCase().includes(query.toLowerCase()) ||
        (result.metadata.tags && result.metadata.tags.some(tag =>
          tag.toLowerCase().includes(query.toLowerCase())
        ))
      );

      // Sort by relevance (simple keyword matching)
      const scoredResults = filteredResults.map(result => {
        let score = result.similarity;

        // Boost score based on keyword matches
        if (result.content.toLowerCase().includes(query.toLowerCase())) {
          score += 0.1;
        }
        if (result.metadata.title.toLowerCase().includes(query.toLowerCase())) {
          score += 0.2;
        }
        if (result.metadata.tags && result.metadata.tags.some(tag =>
          tag.toLowerCase() === query.toLowerCase()
        )) {
          score += 0.3;
        }

        return { ...result, similarity: Math.min(score, 0.99) };
      }).sort((a, b) => b.similarity - a.similarity);

      // Limit results
      const limitedResults = scoredResults.slice(0, limit);

      res.json({
        results: limitedResults.length > 0 ? limitedResults : mockDocuments.slice(0, limit),
        note: "Using mock data due to database connection issues"
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
    const { messages, context = '', model = 'gemini-pro' } = req.body;

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

      let response;
      try {
        // Prepare the system message with context if available
        const systemMessage = relevantContext
          ? `You are an immigration assistant for the Visafy platform. Use the following information to answer the user's question:\n\n${relevantContext}`
          : 'You are an immigration assistant for the Visafy platform. Provide helpful and accurate information about immigration processes, requirements, and pathways.';

        // Prepare the messages for OpenRouter
        const openRouterMessages = [
          { role: 'system', content: systemMessage },
          ...messages
        ];

        console.log('Sending request to OpenRouter...');
        console.log('Using context:', !!relevantContext);

        // Make the API call to OpenRouter
        const result = await axios.post(
          OPENROUTER_URL,
          {
            model: OPENROUTER_MODEL,
            messages: openRouterMessages,
            temperature: 0.7,
            max_tokens: 1024,
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://visafy-vector-search-service.onrender.com',
              'X-Title': 'Visafy Immigration Assistant'
            }
          }
        );

        // Extract the response
        response = result.data.choices[0].message.content;
        console.log('Received response from OpenRouter');

        res.json({
          response,
          model: OPENROUTER_MODEL,
          hasContext: !!relevantContext
        });
        return;
      } catch (error) {
        console.error('Error using OpenRouter API:', error);
        console.error('Error details:', error.response ? error.response.data : error.message);
        throw error;
      }
    } catch (error) {
      console.log('Using mock implementation for chat');

      // Find relevant mock documents for context
      let relevantDocs = [];

      if (lastUserMessage) {
        const query = lastUserMessage.content.toLowerCase();

        // Find relevant documents based on the query
        relevantDocs = mockDocuments.filter(doc =>
          doc.content.toLowerCase().includes(query.toLowerCase()) ||
          doc.metadata.title.toLowerCase().includes(query.toLowerCase()) ||
          (doc.metadata.tags && doc.metadata.tags.some(tag =>
            tag.toLowerCase().includes(query.toLowerCase())
          ))
        ).sort((a, b) => b.similarity - a.similarity).slice(0, 2);
      }

      // Generate a response based on the relevant documents
      let mockResponse = '';

      if (relevantDocs.length > 0) {
        // Use the content from the most relevant document
        const mostRelevantDoc = relevantDocs[0];

        if (mostRelevantDoc.metadata.title === "Express Entry Program Guide") {
          mockResponse = "Express Entry is Canada's immigration system that manages applications for permanent residence under three federal economic immigration programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class. It uses a Comprehensive Ranking System (CRS) to score candidates based on factors like age, education, work experience, and language skills. The highest-scoring candidates receive invitations to apply for permanent residence through regular draws.";
        } else if (mostRelevantDoc.metadata.title === "Document Requirements for Immigration") {
          mockResponse = "For most immigration applications, you'll need several key documents: a valid passport, birth certificate, marriage certificate (if applicable), police clearance certificates from countries where you've lived, proof of language proficiency (like IELTS or CELPIP test results), educational credential assessments, proof of funds to support yourself, and medical examination results. Make sure all documents are properly translated and certified if they're not in English or French.";
        } else if (mostRelevantDoc.metadata.title === "Language Testing for Immigration") {
          mockResponse = "Language proficiency is crucial for most immigration programs. For English, accepted tests include IELTS (International English Language Testing System) and CELPIP (Canadian English Language Proficiency Index Program). For French, you can take the TEF (Test d'Évaluation de Français) or TCF (Test de Connaissance du Français). Test results are typically valid for 2 years, and higher scores can significantly improve your chances in points-based immigration systems.";
        } else if (mostRelevantDoc.metadata.title === "Medical Examinations for Immigration") {
          mockResponse = "Immigration medical examinations must be performed by approved physicians (often called panel physicians). The exam typically includes a physical examination, chest X-ray, blood tests for conditions like HIV and syphilis, and urinalysis. Results are usually valid for 12 months. You should only undergo the medical exam after being instructed to do so by immigration authorities, as timing is important.";
        } else if (mostRelevantDoc.metadata.title === "Points-Based Immigration Systems") {
          mockResponse = "Points-based immigration systems assign scores to candidates based on factors like age, education, work experience, language proficiency, and adaptability. Canada's Express Entry uses the Comprehensive Ranking System (CRS), Australia has the SkillSelect points test, and New Zealand uses the Skilled Migrant Category (SMC) points system. Each system has different criteria and minimum score requirements for eligibility.";
        }
      } else if (lastUserMessage) {
        const query = lastUserMessage.content.toLowerCase();

        // Generate a generic response based on keywords in the query
        if (query.includes('express entry') || query.includes('canada')) {
          mockResponse = "Express Entry is Canada's immigration system that manages applications for permanent residence under three federal economic immigration programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class. It uses a Comprehensive Ranking System (CRS) to score candidates based on factors like age, education, work experience, and language skills. The highest-scoring candidates receive invitations to apply for permanent residence through regular draws.";
        } else if (query.includes('document') || query.includes('requirement')) {
          mockResponse = "For most immigration applications, you'll need several key documents: a valid passport, birth certificate, marriage certificate (if applicable), police clearance certificates from countries where you've lived, proof of language proficiency (like IELTS or CELPIP test results), educational credential assessments, proof of funds to support yourself, and medical examination results. Make sure all documents are properly translated and certified if they're not in English or French.";
        } else if (query.includes('language') || query.includes('test') || query.includes('ielts')) {
          mockResponse = "Language proficiency is crucial for most immigration programs. For English, accepted tests include IELTS (International English Language Testing System) and CELPIP (Canadian English Language Proficiency Index Program). For French, you can take the TEF (Test d'Évaluation de Français) or TCF (Test de Connaissance du Français). Test results are typically valid for 2 years, and higher scores can significantly improve your chances in points-based immigration systems.";
        } else if (query.includes('medical') || query.includes('exam') || query.includes('health')) {
          mockResponse = "Immigration medical examinations must be performed by approved physicians (often called panel physicians). The exam typically includes a physical examination, chest X-ray, blood tests for conditions like HIV and syphilis, and urinalysis. Results are usually valid for 12 months. You should only undergo the medical exam after being instructed to do so by immigration authorities, as timing is important.";
        } else if (query.includes('points') || query.includes('score') || query.includes('calculator')) {
          mockResponse = "Points-based immigration systems assign scores to candidates based on factors like age, education, work experience, language proficiency, and adaptability. Canada's Express Entry uses the Comprehensive Ranking System (CRS), Australia has the SkillSelect points test, and New Zealand uses the Skilled Migrant Category (SMC) points system. Each system has different criteria and minimum score requirements for eligibility.";
        } else {
          mockResponse = "I'm an immigration assistant that can help answer questions about immigration processes, requirements, and pathways. You can ask me about specific immigration programs, document requirements, language testing, medical examinations, visa applications, and more. How can I assist you today?";
        }
      } else {
        mockResponse = "Hello! I'm your immigration assistant. How can I help you today?";
      }

      res.json({
        response: mockResponse,
        model: 'mock',
        hasContext: relevantDocs.length > 0,
        note: "Using mock data due to API connection issues"
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
