/**
 * Script to insert test documents into Supabase
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
// Get the API key from environment variable or use the hardcoded one
const supabaseKey = process.env.SUPABASE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTU3NTk4OCwiZXhwIjoyMDMxMTUxOTg4fQ.Wd0jXKYQQgwIwP0SvCblOmjVBCKzKIxHMrGOq5xUYHE';

console.log('Using Supabase URL:', supabaseUrl);
console.log('API Key starts with:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined');

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test documents
const testDocuments = [
  {
    content: "The Express Entry system is Canada's flagship immigration management system for key economic immigration programs. Launched in January 2015, Express Entry is not an immigration program itself but rather a system used to manage applications for permanent residence under three federal economic immigration programs: Federal Skilled Worker Program (FSWP), Federal Skilled Trades Program (FSTP), and Canadian Experience Class (CEC).",
    metadata: {
      title: "Express Entry Program Guide",
      source: "Immigration Canada",
      tags: ["canada", "express entry", "immigration"]
    },
    embedding: Array(384).fill(0) // 384 zeros
  },
  {
    content: "When applying for immigration to any country, proper documentation is crucial for a successful application. Essential identity documents include a valid passport (must be valid for at least 6 months beyond your intended period of stay), previous passports, birth certificate, marriage certificate (if applicable), divorce certificate/decree (if previously married), and national identity documents.",
    metadata: {
      title: "Document Requirements for Immigration",
      source: "Immigration Resources",
      tags: ["documents", "requirements", "immigration"]
    },
    embedding: Array(384).fill(0) // 384 zeros
  },
  {
    content: "Language proficiency is a critical component of the immigration process for many countries. Demonstrating adequate language skills is not only a requirement for most immigration pathways but also a key factor in successful integration and employment prospects in a new country.",
    metadata: {
      title: "Language Testing for Immigration",
      source: "Immigration Resources",
      tags: ["language testing", "proficiency", "immigration"]
    },
    embedding: Array(384).fill(0) // 384 zeros
  },
  {
    content: "Medical examinations are a mandatory component of most immigration processes worldwide. These examinations serve to ensure that applicants do not pose a public health risk to the destination country and that they will not place excessive demands on health and social services.",
    metadata: {
      title: "Medical Examinations for Immigration",
      source: "Immigration Resources",
      tags: ["medical", "health", "immigration"]
    },
    embedding: Array(384).fill(0) // 384 zeros
  },
  {
    content: "Points-based immigration systems are structured frameworks used by many countries to select skilled immigrants based on their potential to contribute economically and integrate successfully into society. These systems assign points for various attributes such as age, education, work experience, language proficiency, and adaptability factors.",
    metadata: {
      title: "Points-Based Immigration Systems",
      source: "Immigration Resources",
      tags: ["points system", "skilled immigration", "immigration"]
    },
    embedding: Array(384).fill(0) // 384 zeros
  }
];

// Insert test documents
async function insertTestDocuments() {
  try {
    console.log('Inserting test documents...');
    
    for (let i = 0; i < testDocuments.length; i++) {
      const doc = testDocuments[i];
      console.log(`Inserting document ${i + 1}/${testDocuments.length}: ${doc.metadata.title}`);
      
      const { data, error } = await supabase
        .from('documents')
        .insert([doc]);
      
      if (error) {
        console.error(`Error inserting document ${i + 1}:`, error);
      } else {
        console.log(`Document ${i + 1} inserted successfully!`);
      }
    }
    
    console.log('All documents processed');
  } catch (error) {
    console.error('Exception:', error);
  }
}

// Run the insertion
insertTestDocuments();
