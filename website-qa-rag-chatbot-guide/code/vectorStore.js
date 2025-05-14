// Initial version of vectorStore.js
import { OpenAIEmbeddings } from "@langchain/openai";

// Initialize OpenAI embeddings with API key from environment variables
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export { embeddings };

// Updated version of vectorStore.js with PostgreSQL integration
import { OpenAIEmbeddings } from "@langchain/openai";
import { NeonPostgres } from "@langchain/community/vectorstores/neon_postgres";

// Initialize OpenAI embeddings with API key from environment variables
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Function to load the vector store
export async function loadVectorStore() {
  // Create a new NeonPostgres vector store with the embeddings
  return NeonPostgres.initialize(embeddings, {
    // Connection details from environment variables
    connectionString: process.env.PGCONN,
    tableName: "documents", // Name of the table to store documents
  });
}

export { embeddings };
