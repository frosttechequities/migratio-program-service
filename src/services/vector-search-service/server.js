/**
 * Vector Search Service
 *
 * This service provides semantic search and chat functionality using Supabase's vector database.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const searchRoutes = require('../../api/search');
const chatRoutes = require('../../api/chat');

// Create Express app
const app = express();
const PORT = process.env.VECTOR_SEARCH_SERVICE_PORT || 3006;

// Set up middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// API routes
app.use('/api/search', searchRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'vector-search-service',
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
      '/api/search',
      '/api/chat',
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
app.listen(PORT, () => {
  console.log(`Vector Search Service listening on port ${PORT}`);
});

module.exports = app;
