/**
 * Test Script to Insert a Document using the Supabase REST API
 */

const axios = require('axios');

// Supabase configuration
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTU3NTk4OCwiZXhwIjoyMDMxMTUxOTg4fQ.Wd0jXKYQQgwIwP0SvCblOmjVBCKzKIxHMrGOq5xUYHE';

console.log('Using Supabase URL:', supabaseUrl);
console.log('API Key starts with:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined');

// Test document
const testDocument = {
  content: "This is a test document for the vector search service.",
  metadata: {
    title: "Test Document",
    source: "Test",
    tags: ["test"]
  },
  // Simple mock embedding (384 dimensions with all zeros)
  embedding: Array(384).fill(0)
};

// Insert the test document using the REST API
async function insertTestDocument() {
  try {
    console.log('Inserting test document via REST API...');
    
    const response = await axios({
      method: 'POST',
      url: `${supabaseUrl}/rest/v1/documents`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      data: [testDocument]
    });
    
    console.log('Response status:', response.status);
    console.log('Document inserted successfully!');
  } catch (error) {
    console.error('Error inserting document:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
insertTestDocument();
