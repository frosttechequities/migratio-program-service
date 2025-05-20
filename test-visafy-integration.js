/**
 * Test Script for Visafy Integration with Vector Search Service
 *
 * This script tests the integration between the Visafy frontend and the vector search service.
 * It simulates the API calls that the frontend would make to the vector search service.
 */

const axios = require('axios');

// Configuration
const VECTOR_SEARCH_URL = process.env.TEST_VECTOR_SEARCH_URL || 'https://visafy-vector-search-service.onrender.com';
const VISAFY_FRONTEND_URL = process.env.TEST_VISAFY_FRONTEND_URL || 'https://visafy-platform.netlify.app';

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Health Check',
    endpoint: '/health',
    method: 'GET',
    data: null
  },
  {
    name: 'Vector Search - Immigration Documents',
    endpoint: '/search',
    method: 'POST',
    data: {
      query: 'What documents do I need for immigration?',
      limit: 5,
      threshold: 0.6
    }
  },
  {
    name: 'Chat - Pre-computed Response',
    endpoint: '/chat',
    method: 'POST',
    data: {
      messages: [{ role: 'user', content: 'What is involved in an immigration medical examination?' }],
      systemPrompt: 'You are an immigration assistant',
      usePreComputed: true,
      useVectorSearch: true,
      useFastModel: false,
      useMockInProduction: true
    }
  },
  {
    name: 'Chat - Vector Search with Hugging Face',
    endpoint: '/chat',
    method: 'POST',
    data: {
      messages: [{ role: 'user', content: 'How does the points-based immigration system work?' }],
      systemPrompt: 'You are an immigration assistant',
      usePreComputed: false,
      useVectorSearch: true,
      useFastModel: false,
      useMockInProduction: false,
      forceHuggingFace: true,
      disableMockFallback: false
    }
  }
];

// Run tests
async function runTests() {
  console.log('=== Testing Visafy Integration with Vector Search Service ===');
  console.log(`Vector Search URL: ${VECTOR_SEARCH_URL}`);
  console.log(`Visafy Frontend URL: ${VISAFY_FRONTEND_URL}`);
  console.log('');

  for (const scenario of TEST_SCENARIOS) {
    console.log(`--- Testing: ${scenario.name} ---`);

    try {
      const startTime = Date.now();

      let response;
      if (scenario.method === 'GET') {
        response = await axios.get(`${VECTOR_SEARCH_URL}${scenario.endpoint}`);
      } else if (scenario.method === 'POST') {
        response = await axios.post(`${VECTOR_SEARCH_URL}${scenario.endpoint}`, scenario.data);
      }

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      console.log(`Status: ${response.status}`);
      console.log(`Duration: ${duration.toFixed(2)} seconds`);

      if (scenario.endpoint === '/health') {
        console.log(`Health Status: ${response.data.status}`);
        console.log(`Hugging Face Available: ${response.data.huggingFaceAvailable}`);
        console.log(`Ollama Available: ${response.data.ollamaAvailable}`);
      } else if (scenario.endpoint === '/search') {
        console.log(`Results Count: ${response.data.results.length}`);
        if (response.data.results.length > 0) {
          console.log(`Top Result: ${response.data.results[0].metadata.title}`);
          if (typeof response.data.results[0].similarity === 'number') {
            console.log(`Similarity: ${response.data.results[0].similarity.toFixed(4)}`);
          } else {
            console.log(`Similarity: ${response.data.results[0].similarity}`);
          }
        }
      } else if (scenario.endpoint === '/chat') {
        console.log(`Model: ${response.data.model}`);
        console.log(`Method: ${response.data.method}`);
        console.log(`Response Time: ${response.data.responseTime} seconds`);
        console.log(`Response Preview: ${response.data.response.substring(0, 100)}...`);
      }

      console.log('Test Passed!');
    } catch (error) {
      console.error(`Test Failed: ${error.message}`);
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Data: ${JSON.stringify(error.response.data)}`);
      }
    }

    console.log('');
  }

  console.log('=== Testing Complete ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});
