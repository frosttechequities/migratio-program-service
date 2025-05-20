/**
 * Simple script to insert immigration documents into Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEwOTE4OCwiZXhwIjoyMDYyNjg1MTg4fQ.s3qm3hcgR9ie2igjmaz4dMeEWsQdsJmQpLR718uO0nA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Path to immigration research documents
const docsDir = path.join(process.cwd(), 'immigration-research-docs');

// Function to read markdown files
async function readMarkdownFiles() {
  try {
    console.log('Reading files from:', docsDir);
    const files = fs.readdirSync(docsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    console.log('Found markdown files:', markdownFiles);

    const documents = [];

    for (const file of markdownFiles) {
      const filePath = path.join(docsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

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

// Function to insert documents into Supabase
async function insertDocuments(documents) {
  console.log('Inserting documents into Supabase...');

  for (const doc of documents) {
    console.log(`Inserting document: ${doc.title}`);

    try {
      // Insert document into Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert({
          content: doc.content,
          metadata: doc.metadata
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
    const documents = await readMarkdownFiles();

    if (documents.length === 0) {
      console.log('No documents found');
      return;
    }

    console.log('Found', documents.length, 'documents');

    await insertDocuments(documents);

    console.log('Documents inserted successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
