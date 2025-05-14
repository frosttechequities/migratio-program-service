/**
 * Document Processing Script
 *
 * This script processes documents, generates embeddings, and stores them in Supabase.
 * It can process text files, markdown files, and PDFs.
 *
 * Usage:
 * node process-documents.js <directory-path>
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { pipeline } = require('@xenova/transformers');
const { PDFLoader } = require('langchain/document_loaders').PDFLoader;
const { TextLoader } = require('langchain/document_loaders').TextLoader;
const { MarkdownTextSplitter } = require('langchain/text_splitter').MarkdownTextSplitter;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize the embedding pipeline
let embeddingPipeline;

// Function to initialize the embedding pipeline
async function initEmbeddingPipeline() {
  if (!embeddingPipeline) {
    console.log('Initializing embedding pipeline...');
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
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
async function splitTextIntoChunks(text, metadata = {}) {
  const splitter = new MarkdownTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const documents = await splitter.createDocuments([text], [metadata]);
  return documents;
}

// Function to load and process a file
async function processFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  const fileExt = path.extname(filePath).toLowerCase();
  let documents = [];

  try {
    if (fileExt === '.pdf') {
      const loader = new PDFLoader(filePath);
      documents = await loader.load();
    } else if (fileExt === '.md' || fileExt === '.txt') {
      const loader = new TextLoader(filePath);
      const loadedDocs = await loader.load();

      // Split the loaded documents into smaller chunks
      for (const doc of loadedDocs) {
        const chunks = await splitTextIntoChunks(doc.pageContent, {
          ...doc.metadata,
          source: filePath,
        });
        documents.push(...chunks);
      }
    } else {
      console.warn(`Unsupported file type: ${fileExt}`);
      return;
    }

    console.log(`Found ${documents.length} document chunks`);

    // Process each document chunk
    for (const doc of documents) {
      const embedding = await generateEmbedding(doc.pageContent);

      // Store in Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert({
          content: doc.pageContent,
          metadata: {
            ...doc.metadata,
            filename: path.basename(filePath),
            filetype: fileExt.substring(1),
            processed_at: new Date().toISOString(),
          },
          embedding,
        });

      if (error) {
        console.error('Error storing document in Supabase:', error);
      } else {
        console.log('Document stored successfully');
      }
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Function to process all files in a directory
async function processDirectory(directoryPath) {
  console.log(`Processing directory: ${directoryPath}`);

  try {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        await processDirectory(filePath);
      } else {
        await processFile(filePath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}:`, error);
  }
}

// Main function
async function main() {
  const directoryPath = process.argv[2];

  if (!directoryPath) {
    console.error('Please provide a directory path');
    process.exit(1);
  }

  if (!supabaseKey) {
    console.error('SUPABASE_ANON_KEY environment variable is not set');
    process.exit(1);
  }

  try {
    await processDirectory(directoryPath);
    console.log('Processing completed successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
