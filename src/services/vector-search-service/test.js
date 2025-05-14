/**
 * Simple Test Script for Vector Search Service
 * 
 * This script tests the vector search service by making requests to the search and chat endpoints.
 */

require('dotenv').config();
const axios = require('axios');

// Configuration
const API_URL = process.env.TEST_API_URL || 'http://localhost:3006';
const SEARCH_ENDPOINT = `${API_URL}/search`;
const CHAT_ENDPOINT = `${API_URL}/chat`;

// Test search endpoint
async function testSearch() {
  console.log('Testing search endpoint...');
  
  try {
    const response = await axios.post(SEARCH_ENDPOINT, {
      query: 'What documents do I need for Express Entry?',
      limit: 3,
      threshold: 0.6
    });
    
    console.log('Search response status:', response.status);
    console.log('Search results count:', response.data.results.length);
    console.log('First result:', response.data.results[0]?.content.substring(0, 100) + '...');
    
    return true;
  } catch (error) {
    console.error('Search test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return false;
  }
}

// Test chat endpoint
async function testChat() {
  console.log('\nTesting chat endpoint...');
  
  try {
    const response = await axios.post(CHAT_ENDPOINT, {
      messages: [
        { role: 'user', content: 'What are the language requirements for Express Entry?' }
      ]
    });
    
    console.log('Chat response status:', response.status);
    console.log('Chat response:', response.data.response.substring(0, 100) + '...');
    
    return true;
  } catch (error) {
    console.error('Chat test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return false;
  }
}

// Test health endpoint
async function testHealth() {
  console.log('\nTesting health endpoint...');
  
  try {
    const response = await axios.get(`${API_URL}/health`);
    
    console.log('Health response status:', response.status);
    console.log('Health response:', response.data);
    
    return true;
  } catch (error) {
    console.error('Health test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log(`Testing vector search service at ${API_URL}`);
  console.log('-------------------------------------------');
  
  const healthResult = await testHealth();
  const searchResult = await testSearch();
  const chatResult = await testChat();
  
  console.log('\nTest Results:');
  console.log('-------------------------------------------');
  console.log('Health endpoint:', healthResult ? 'PASSED' : 'FAILED');
  console.log('Search endpoint:', searchResult ? 'PASSED' : 'FAILED');
  console.log('Chat endpoint:', chatResult ? 'PASSED' : 'FAILED');
  
  const allPassed = healthResult && searchResult && chatResult;
  console.log('\nOverall result:', allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED');
  
  return allPassed;
}

// Run the tests
runTests()
  .then(result => {
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
  });
