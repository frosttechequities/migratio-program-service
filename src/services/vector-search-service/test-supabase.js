/**
 * Test Supabase Connection
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NzU5ODgsImV4cCI6MjAzMTE1MTk4OH0.Wd0jXKYQQgwIwP0SvCblOmjVBCKzKIxHMrGOq5xUYHE';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Try to get the current user
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('User data:', data);
    }
    
    // Try to query the documents table
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select('count(*)')
      .limit(1);
    
    if (documentsError) {
      console.error('Error querying documents table:', documentsError);
    } else {
      console.log('Successfully queried documents table!');
      console.log('Documents data:', documents);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();
