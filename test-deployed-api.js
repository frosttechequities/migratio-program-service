/**
 * Test Script for Deployed Vector Search Service
 */

const axios = require('axios');

// Configuration
const API_URL = process.env.TEST_API_URL || 'https://visafy-vector-search-service.onrender.com';

// Test the search endpoint
async function testSearch() {
  console.log('\n--- Testing Search Endpoint ---');
  
  try {
    console.log(`Sending search request to ${API_URL}/search`);
    
    const response = await axios({
      method: 'post',
      url: `${API_URL}/search`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        query: 'express entry',
        limit: 3,
        threshold: 0.6
      }
    });
    
    console.log('Search response status:', response.status);
    console.log('Search results:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error testing search endpoint:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    
    return false;
  }
}

// Test the chat endpoint
async function testChat() {
  console.log('\n--- Testing Chat Endpoint ---');
  
  try {
    console.log(`Sending chat request to ${API_URL}/chat`);
    
    const response = await axios({
      method: 'post',
      url: `${API_URL}/chat`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        messages: [
          { role: 'user', content: 'Tell me about Express Entry' }
        ]
      }
    });
    
    console.log('Chat response status:', response.status);
    console.log('Chat response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error testing chat endpoint:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    
    return false;
  }
}

// Test the health endpoint
async function testHealth() {
  console.log('\n--- Testing Health Endpoint ---');
  
  try {
    console.log(`Sending health request to ${API_URL}/health`);
    
    const response = await axios({
      method: 'get',
      url: `${API_URL}/health`
    });
    
    console.log('Health response status:', response.status);
    console.log('Health data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error testing health endpoint:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log(`Testing API at: ${API_URL}`);
  
  let healthResult = await testHealth();
  let searchResult = await testSearch();
  let chatResult = await testChat();
  
  console.log('\n--- Test Summary ---');
  console.log(`Health Endpoint: ${healthResult ? 'PASSED' : 'FAILED'}`);
  console.log(`Search Endpoint: ${searchResult ? 'PASSED' : 'FAILED'}`);
  console.log(`Chat Endpoint: ${chatResult ? 'PASSED' : 'FAILED'}`);
  
  if (healthResult && searchResult && chatResult) {
    console.log('\nAll tests PASSED! 🎉');
  } else {
    console.log('\nSome tests FAILED. 😢');
  }
}

// Run the tests
runTests();
