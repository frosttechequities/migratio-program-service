/**
 * Script to test the chat endpoint with the new documents
 */

const axios = require('axios');

// Vector search service URL
const API_URL = 'https://visafy-vector-search-service.onrender.com';

// Function to send a chat message
async function sendChatMessage(message) {
  try {
    console.log(`Sending message: "${message}"`);
    
    const response = await axios.post(`${API_URL}/chat`, {
      messages: [{ role: 'user', content: message }],
      systemPrompt: 'You are an immigration assistant for the Visafy platform.',
      usePreComputed: false,
      useVectorSearch: true,
      useFastModel: false,
      useMockInProduction: false,
      forceHuggingFace: true,
      disableMockFallback: false
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error.message);
    return null;
  }
}

// Function to display chat response
function displayResponse(response) {
  if (!response) {
    console.log('No response received');
    return;
  }
  
  console.log(`Model: ${response.model}`);
  console.log(`Method: ${response.method}`);
  console.log(`Has Context: ${response.hasContext}`);
  
  if (response.responseTime) {
    console.log(`Response Time: ${response.responseTime} seconds`);
  }
  
  console.log('\nResponse Preview:');
  console.log(response.response.substring(0, 200) + '...');
  
  // Save the full response to a file
  const fs = require('fs');
  fs.writeFileSync(`chat-response-${Date.now()}.txt`, response.response);
  console.log('\nFull response saved to file');
}

// Main function
async function main() {
  try {
    // Test queries
    const queries = [
      'What documents do I need for immigration?',
      'How does the points-based immigration system work?',
      'What is involved in an immigration medical examination?',
      'What language tests are accepted for immigration?',
      'How does the Express Entry program work?'
    ];
    
    // Test only the first query to save time
    const response = await sendChatMessage(queries[0]);
    displayResponse(response);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
