/**
 * Script to verify Supabase connection
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_API_KEY environment variable is not set');
  console.error('Usage: SUPABASE_API_KEY=your_key node verify-supabase.js');
  process.exit(1);
}

console.log('Using Supabase URL:', supabaseUrl);
console.log('API Key starts with:', supabaseKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection by fetching the test document
async function verifyConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Try to fetch the test document
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log('Retrieved data:', data);
    
    return true;
  } catch (error) {
    console.error('Exception:', error);
    return false;
  }
}

// Test the match_documents function
async function testMatchDocuments() {
  try {
    console.log('\nTesting match_documents function...');
    
    // Create a test embedding (all zeros)
    const testEmbedding = Array(384).fill(0);
    
    // Call the match_documents function
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: testEmbedding,
      match_threshold: 0.5,
      match_count: 5
    });
    
    if (error) {
      console.error('Error calling match_documents:', error);
      return false;
    }
    
    console.log('Successfully called match_documents function!');
    console.log('Retrieved results:', data);
    
    return true;
  } catch (error) {
    console.error('Exception:', error);
    return false;
  }
}

// Run the tests
async function runTests() {
  const connectionResult = await verifyConnection();
  
  if (connectionResult) {
    const matchDocumentsResult = await testMatchDocuments();
    
    console.log('\n--- Test Summary ---');
    console.log(`Connection Test: ${connectionResult ? 'PASSED' : 'FAILED'}`);
    console.log(`match_documents Test: ${matchDocumentsResult ? 'PASSED' : 'FAILED'}`);
    
    if (connectionResult && matchDocumentsResult) {
      console.log('\nAll tests PASSED! 🎉');
      console.log('Your Supabase integration is working correctly.');
    } else {
      console.log('\nSome tests FAILED. 😢');
      console.log('Please check the error messages above.');
    }
  }
}

// Run the tests
runTests();
