/**
 * Simple Test Script to Insert a Document into Supabase
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY;

console.log('Using Supabase URL:', supabaseUrl);
console.log('API Key starts with:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined');

const supabase = createClient(supabaseUrl, supabaseKey);

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

// Insert the test document
async function insertTestDocument() {
  try {
    console.log('Inserting test document...');
    
    const { data, error } = await supabase
      .from('documents')
      .insert([testDocument]);
    
    if (error) {
      console.error('Error inserting document:', error);
    } else {
      console.log('Document inserted successfully!');
    }
  } catch (error) {
    console.error('Exception:', error);
  }
}

// Run the test
insertTestDocument();
