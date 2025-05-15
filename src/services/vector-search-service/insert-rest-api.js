/**
 * Script to insert test documents using the Supabase REST API
 */

const axios = require('axios');

// Supabase configuration
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTU3NTk4OCwiZXhwIjoyMDMxMTUxOTg4fQ.Wd0jXKYQQgwIwP0SvCblOmjVBCKzKIxHMrGOq5xUYHE';

console.log('Using Supabase URL:', supabaseUrl);
console.log('API Key starts with:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined');

// Test document
const testDocument = {
  content: "The Express Entry system is Canada's flagship immigration management system for key economic immigration programs.",
  metadata: {
    title: "Express Entry Program Guide",
    source: "Immigration Canada",
    tags: ["canada", "express entry", "immigration"]
  },
  embedding: Array(384).fill(0) // 384 zeros
};

// Insert test document
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
      data: testDocument
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

// Run the insertion
insertTestDocument();
