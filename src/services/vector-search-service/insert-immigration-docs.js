/**
 * Script to insert immigration-related documents into the Supabase vector database
 *
 * This script reads immigration-related documents from the immigration-research-docs directory
 * and inserts them into the Supabase vector database with embeddings.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { pipeline } = require('@xenova/transformers');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEwOTE4OCwiZXhwIjoyMDYyNjg1MTg4fQ.s3qm3hcgR9ie2igjmaz4dMeEWsQdsJmQpLR718uO0nA';

console.log('Using Supabase URL:', supabaseUrl);
console.log('API Key starts with:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined');

const supabase = createClient(supabaseUrl, supabaseKey);

// Path to immigration research documents
const docsDir = path.join(process.cwd(), 'immigration-research-docs');

// Function to read markdown files from a directory
async function readMarkdownFiles(dir) {
  try {
    const files = await fs.promises.readdir(dir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const documents = [];

    for (const file of markdownFiles) {
      const filePath = path.join(dir, file);
      const content = await fs.promises.readFile(filePath, 'utf8');

      // Extract title from filename
      const title = file
        .replace('.md', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      documents.push({
        title,
        content,
        metadata: {
          title,
          source: 'immigration-research-docs',
          filename: file
        }
      });
    }

    return documents;
  } catch (error) {
    console.error('Error reading markdown files:', error);
    return [];
  }
}

// Function to generate embeddings for documents
async function generateEmbeddings(documents) {
  console.log('Initializing embedding pipeline...');

  // Initialize the embedding pipeline
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  console.log('Generating embeddings for', documents.length, 'documents...');

  const documentsWithEmbeddings = [];

  for (const [index, doc] of documents.entries()) {
    console.log(`Processing document ${index + 1}/${documents.length}: ${doc.title}`);

    try {
      // Generate embedding for the document content
      const output = await embedder(doc.content, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data);

      documentsWithEmbeddings.push({
        ...doc,
        embedding
      });
    } catch (error) {
      console.error(`Error generating embedding for document "${doc.title}":`, error);
    }
  }

  return documentsWithEmbeddings;
}

// Function to insert documents into Supabase
async function insertDocuments(documents) {
  console.log('Inserting documents into Supabase...');

  for (const [index, doc] of documents.entries()) {
    console.log(`Inserting document ${index + 1}/${documents.length}: ${doc.title}`);

    try {
      // Insert document into Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: doc.title,
          content: doc.content,
          metadata: doc.metadata,
          embedding: doc.embedding
        });

      if (error) {
        console.error(`Error inserting document "${doc.title}":`, error);
      } else {
        console.log(`Document "${doc.title}" inserted successfully`);
      }
    } catch (error) {
      console.error(`Error inserting document "${doc.title}":`, error);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('Reading markdown files from', docsDir);
    const documents = await readMarkdownFiles(docsDir);

    if (documents.length === 0) {
      console.log('No documents found');
      return;
    }

    console.log('Found', documents.length, 'documents');

    const documentsWithEmbeddings = await generateEmbeddings(documents);

    if (documentsWithEmbeddings.length === 0) {
      console.log('No embeddings generated');
      return;
    }

    await insertDocuments(documentsWithEmbeddings);

    console.log('Documents inserted successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
