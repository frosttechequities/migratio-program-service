/**
 * Simple Script to Process a Single Document
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { pipeline } = require('@xenova/transformers');

// Initialize Supabase client
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
// Use the service_role key instead of the anon key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTU3NTk4OCwiZXhwIjoyMDMxMTUxOTg4fQ.Wd0jXKYQQgwIwP0SvCblOmjVBCKzKIxHMrGOq5xUYHE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize the embedding pipeline
let embeddingPipeline;

// Function to initialize the embedding pipeline
async function initEmbeddingPipeline() {
  if (!embeddingPipeline) {
    console.log('Initializing embedding pipeline...');
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Embedding pipeline initialized');
  }
  return embeddingPipeline;
}

// Function to generate embeddings for a text
async function generateEmbedding(text) {
  const pipe = await initEmbeddingPipeline();
  const result = await pipe(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

// Function to split text into chunks
function splitTextIntoChunks(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk);
    i += chunkSize - overlap;
  }
  return chunks;
}

// Function to process a text file
async function processTextFile(filePath) {
  console.log(`Processing file: ${filePath}`);

  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`File read successfully. Content length: ${content.length} characters`);

    // Split the content into chunks
    const chunks = splitTextIntoChunks(content);
    console.log(`Split into ${chunks.length} chunks`);

    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1}/${chunks.length}`);

      // Generate embedding
      const embedding = await generateEmbedding(chunk);
      console.log(`Generated embedding with length: ${embedding.length}`);

      // Store in Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert({
          content: chunk,
          metadata: {
            filename: path.basename(filePath),
            filetype: path.extname(filePath).substring(1),
            processed_at: new Date().toISOString(),
            chunk_index: i,
            total_chunks: chunks.length
          },
          embedding
        });

      if (error) {
        console.error('Error storing document in Supabase:', error);
      } else {
        console.log(`Chunk ${i + 1} stored successfully`);
      }
    }

    console.log(`File processed successfully: ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main function
async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Please provide a file path');
    process.exit(1);
  }

  console.log('Starting processing with file path:', filePath);
  console.log('Current working directory:', process.cwd());
  console.log('Absolute path:', path.resolve(filePath));

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File ${filePath} does not exist`);
    console.error(`Absolute path: ${path.resolve(filePath)}`);
    process.exit(1);
  }

  try {
    await processTextFile(filePath);
    console.log('Processing completed successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
