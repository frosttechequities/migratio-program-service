/**
 * Script to check documents in Supabase and process immigration research documents if needed
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { pipeline } = require('@xenova/transformers');

// Initialize Supabase client
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEwOTE4OCwiZXhwIjoyMDYyNjg1MTg4fQ.s3qm3hcgR9ie2igjmaz4dMeEWsQdsJmQpLR718uO0nA';

console.log('Using Supabase URL:', supabaseUrl);
console.log('API Key starts with:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined');

const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize the embedding pipeline
let embeddingPipeline;

// Initialize the embedding pipeline
const initEmbeddingPipeline = async () => {
  if (!embeddingPipeline) {
    console.log('Initializing embedding pipeline...');
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Embedding pipeline initialized');
  }
  return embeddingPipeline;
};

// Generate embeddings for a text
const generateEmbedding = async (text) => {
  try {
    const pipe = await initEmbeddingPipeline();
    const result = await pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

// Check documents in Supabase
const checkDocuments = async () => {
  try {
    console.log('Checking documents in Supabase...');
    
    // Get all documents
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*');
    
    if (error) {
      console.error('Error getting documents:', error);
      return false;
    }
    
    console.log(`Found ${documents ? documents.length : 0} documents in Supabase`);
    
    if (documents && documents.length > 0) {
      console.log('Sample document:');
      console.log('- ID:', documents[0].id);
      console.log('- Content (first 100 chars):', documents[0].content.substring(0, 100) + '...');
      console.log('- Metadata:', documents[0].metadata);
      console.log('- Embedding length:', documents[0].embedding ? documents[0].embedding.length : 'N/A');
    }
    
    return documents && documents.length > 1; // More than just the test document
  } catch (error) {
    console.error('Error checking documents:', error);
    return false;
  }
};

// Process a single document
const processDocument = async (filePath) => {
  try {
    console.log(`Processing document: ${filePath}`);
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`File read successfully. Content length: ${content.length} characters`);
    
    // Extract metadata from the file path
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath);
    const fileNameWithoutExt = path.basename(filePath, fileExt);
    
    // Generate metadata
    const metadata = {
      title: fileNameWithoutExt.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      source: 'Immigration Research',
      file_path: filePath,
      file_type: fileExt.slice(1),
      tags: ['immigration', 'research', ...fileNameWithoutExt.split('-')]
    };
    
    // Generate embedding
    console.log('Generating embedding...');
    const embedding = await generateEmbedding(content);
    console.log(`Generated embedding with length: ${embedding.length}`);
    
    // Store the document in Supabase
    console.log('Storing document in Supabase...');
    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          content,
          metadata,
          embedding
        }
      ]);
    
    if (error) {
      console.error(`Error storing document ${fileName}:`, error);
      return false;
    }
    
    console.log(`Document ${fileName} processed and stored successfully`);
    return true;
  } catch (error) {
    console.error(`Error processing document ${filePath}:`, error);
    return false;
  }
};

// Process all documents in a directory
const processDirectory = async (dirPath) => {
  try {
    console.log(`Processing directory: ${dirPath}`);
    
    // Check if the directory exists
    if (!fs.existsSync(dirPath)) {
      console.error(`Directory ${dirPath} does not exist`);
      console.error(`Absolute path: ${path.resolve(dirPath)}`);
      return { successCount: 0, failureCount: 0 };
    }
    
    // Get all files in the directory
    const files = fs.readdirSync(dirPath);
    console.log(`Found ${files.length} files in directory`);
    
    // Process each file
    let successCount = 0;
    let failureCount = 0;
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      
      // Check if it's a file
      if (fs.statSync(filePath).isFile()) {
        // Check if it's a supported file type
        const fileExt = path.extname(filePath).toLowerCase();
        if (['.txt', '.md', '.markdown'].includes(fileExt)) {
          const success = await processDocument(filePath);
          if (success) {
            successCount++;
          } else {
            failureCount++;
          }
        } else {
          console.log(`Skipping unsupported file type: ${filePath}`);
        }
      } else if (fs.statSync(filePath).isDirectory()) {
        // Recursively process subdirectories
        const subResults = await processDirectory(filePath);
        successCount += subResults.successCount;
        failureCount += subResults.failureCount;
      }
    }
    
    return { successCount, failureCount };
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
    return { successCount: 0, failureCount: 0 };
  }
};

// Clear all documents except the test document
const clearDocuments = async () => {
  try {
    console.log('Clearing all documents except the test document...');
    
    // Delete all documents except the test document (ID 1)
    const { data, error } = await supabase
      .from('documents')
      .delete()
      .neq('id', 1);
    
    if (error) {
      console.error('Error clearing documents:', error);
      return false;
    }
    
    console.log('Documents cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing documents:', error);
    return false;
  }
};

// Main function
const main = async () => {
  try {
    // Check if documents exist
    const documentsExist = await checkDocuments();
    
    if (documentsExist) {
      console.log('Documents already exist in Supabase');
      
      // Ask if we should clear and reprocess
      const args = process.argv.slice(2);
      const forceReprocess = args.includes('--force');
      
      if (forceReprocess) {
        console.log('Force reprocessing documents...');
        
        // Clear documents
        const cleared = await clearDocuments();
        if (!cleared) {
          console.error('Failed to clear documents');
          process.exit(1);
        }
      } else {
        console.log('Skipping document processing');
        console.log('Use --force to clear and reprocess documents');
        process.exit(0);
      }
    }
    
    // Process documents
    console.log('Processing immigration research documents...');
    
    // Get the directory path
    const dirPath = '../../../immigration-research-docs';
    console.log('Directory path:', dirPath);
    console.log('Absolute path:', path.resolve(dirPath));
    
    // Initialize the embedding pipeline
    await initEmbeddingPipeline();
    
    // Process the directory
    const results = await processDirectory(dirPath);
    
    console.log('Document processing complete');
    console.log(`Successfully processed: ${results.successCount} documents`);
    console.log(`Failed to process: ${results.failureCount} documents`);
    
    // Check documents again
    await checkDocuments();
    
    process.exit(0);
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
};

// Run the main function
main();
