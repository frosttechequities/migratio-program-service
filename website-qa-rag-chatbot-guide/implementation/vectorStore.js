// Adapted version using Gemini API instead of OpenAI
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

// Initialize Google Generative AI embeddings with API key from environment variables
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: "embedding-001", // Gemini embedding model
});

// Function to load the vector store
export async function loadVectorStore() {
  // Create a Supabase client
  const client = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API_KEY
  );

  // Create a new Supabase vector store with the embeddings
  return SupabaseVectorStore.initialize(embeddings, {
    client,
    tableName: "documents", // Name of the table to store documents
    queryName: "match_documents", // Name of the query function
  });
}

export { embeddings };
