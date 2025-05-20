/**
 * Script to remove duplicate documents from Supabase
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEwOTE4OCwiZXhwIjoyMDYyNjg1MTg4fQ.s3qm3hcgR9ie2igjmaz4dMeEWsQdsJmQpLR718uO0nA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDuplicateDocuments() {
  try {
    // Get all documents
    const { data, error } = await supabase
      .from('documents')
      .select('id, content, metadata');
    
    if (error) {
      console.error('Error getting documents:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('No documents found');
      return;
    }
    
    console.log(`Found ${data.length} documents`);
    
    // Find duplicates based on content
    const contentMap = new Map();
    const duplicates = [];
    
    for (const doc of data) {
      const content = doc.content;
      
      if (contentMap.has(content)) {
        // This is a duplicate
        duplicates.push(doc);
      } else {
        // This is the first occurrence
        contentMap.set(content, doc);
      }
    }
    
    console.log(`Found ${duplicates.length} duplicate documents`);
    
    // Delete the duplicate documents
    for (const doc of duplicates) {
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);
      
      if (deleteError) {
        console.error(`Error deleting duplicate document ${doc.id}:`, deleteError);
      } else {
        console.log(`Duplicate document ${doc.id} deleted successfully`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
removeDuplicateDocuments();
