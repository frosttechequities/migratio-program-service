/**
 * NLP Proxy API
 * This file contains the API endpoints for the NLP service proxy
 */

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Environment variables
const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://localhost:8000';

/**
 * @route POST /api/nlp/analyze
 * @desc Analyze text using NLP
 * @access Private
 */
router.post('/analyze', async (req, res) => {
  try {
    const { text, questionId } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Forward the request to the NLP service
    const response = await fetch(`${NLP_SERVICE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, questionId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error(`NLP service error: ${response.status} ${response.statusText}`, errorData);
      
      // Return a fallback response with empty results
      return res.json({
        extractedEntities: [],
        sentiment: 'neutral',
        keywords: [],
        confidence: 0
      });
    }
    
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('NLP proxy error:', error);
    
    // Return a fallback response with empty results
    return res.json({
      extractedEntities: [],
      sentiment: 'neutral',
      keywords: [],
      confidence: 0
    });
  }
});

/**
 * @route GET /api/nlp/health
 * @desc Check NLP service health
 * @access Public
 */
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${NLP_SERVICE_URL}/health`);
    
    if (!response.ok) {
      return res.status(503).json({ status: 'unavailable' });
    }
    
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('NLP health check error:', error);
    return res.status(503).json({ status: 'unavailable' });
  }
});

module.exports = router;
