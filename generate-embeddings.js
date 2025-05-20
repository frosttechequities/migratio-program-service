/**
 * Script to generate embeddings for documents in Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const { pipeline } = require('@xenova/transformers');

// Initialize Supabase client
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEwOTE4OCwiZXhwIjoyMDYyNjg1MTg4fQ.s3qm3hcgR9ie2igjmaz4dMeEWsQdsJmQpLR718uO0nA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get documents without embeddings
async function getDocumentsWithoutEmbeddings() {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('id, content')
      .is('embedding', null);
    
    if (error) {
      console.error('Error getting documents without embeddings:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Function to generate embeddings for documents
async function generateEmbeddings(documents) {
  console.log('Initializing embedding pipeline...');
  
  // Initialize the embedding pipeline
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  
  console.log('Generating embeddings for', documents.length, 'documents...');
  
  for (const [index, doc] of documents.entries()) {
    console.log(`Processing document ${index + 1}/${documents.length} (ID: ${doc.id})`);
    
    try {
      // Generate embedding for the document content
      const output = await embedder(doc.content, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data);
      
      // Update document with embedding
      const { error } = await supabase
        .from('documents')
        .update({ embedding })
        .eq('id', doc.id);
      
      if (error) {
        console.error(`Error updating document ${doc.id} with embedding:`, error);
      } else {
        console.log(`Document ${doc.id} updated with embedding`);
      }
    } catch (error) {
      console.error(`Error generating embedding for document ${doc.id}:`, error);
    }
  }
}

// Main function
async function main() {
  try {
    const documents = await getDocumentsWithoutEmbeddings();
    
    if (documents.length === 0) {
      console.log('No documents without embeddings found');
      return;
    }
    
    console.log('Found', documents.length, 'documents without embeddings');
    
    await generateEmbeddings(documents);
    
    console.log('Embeddings generated successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
