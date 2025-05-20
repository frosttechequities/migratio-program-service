/**
 * Script to remove the test document from Supabase
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEwOTE4OCwiZXhwIjoyMDYyNjg1MTg4fQ.s3qm3hcgR9ie2igjmaz4dMeEWsQdsJmQpLR718uO0nA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function removeTestDocument() {
  try {
    // Find the test document
    const { data, error } = await supabase
      .from('documents')
      .select('id, content, metadata')
      .eq('content', 'This is a test document for the vector search service.');
    
    if (error) {
      console.error('Error finding test document:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('No test document found');
      return;
    }
    
    console.log(`Found ${data.length} test documents:`, data);
    
    // Delete the test documents
    for (const doc of data) {
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);
      
      if (deleteError) {
        console.error(`Error deleting test document ${doc.id}:`, deleteError);
      } else {
        console.log(`Test document ${doc.id} deleted successfully`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
removeTestDocument();
