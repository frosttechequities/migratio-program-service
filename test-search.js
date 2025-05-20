/**
 * Script to test searching for documents in Supabase
 */

const axios = require('axios');

// Vector search service URL
const API_URL = 'https://visafy-vector-search-service.onrender.com';

// Function to search for documents
async function searchDocuments(query) {
  try {
    console.log(`Searching for: "${query}"`);
    
    const response = await axios.post(`${API_URL}/search`, {
      query,
      limit: 5,
      threshold: 0.6
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching for documents:', error.message);
    return null;
  }
}

// Function to display search results
function displayResults(results) {
  if (!results || !results.results || results.results.length === 0) {
    console.log('No results found');
    return;
  }
  
  console.log(`Found ${results.results.length} results:`);
  
  results.results.forEach((result, index) => {
    console.log(`\nResult ${index + 1}:`);
    console.log(`Title: ${result.metadata.title || 'Untitled'}`);
    console.log(`Similarity: ${result.similarity}`);
    console.log(`Content Preview: ${result.content.substring(0, 100)}...`);
  });
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
    
    for (const query of queries) {
      const results = await searchDocuments(query);
      displayResults(results);
      console.log('\n---\n');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
