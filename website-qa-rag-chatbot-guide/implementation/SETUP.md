# Website Q&A RAG Chatbot Setup Guide

This guide will help you set up the Website Q&A RAG Chatbot using Gemini API and Supabase.

## Prerequisites

1. Node.js (v16 or higher)
2. Google Gemini API key
3. Supabase account (free tier)

## Step 1: Set Up Supabase

1. Create a free Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Once your project is created, go to the SQL Editor
4. Run the following SQL to create the necessary tables and functions:

```sql
-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table for storing document embeddings
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  metadata JSONB,
  embedding VECTOR(768)
);

-- Create a function to search for similar documents
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Create an index for faster similarity search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

5. Go to Project Settings > API to get your Supabase URL and API key

## Step 2: Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Go to "API Keys" in the left sidebar
4. Create a new API key
5. Copy the API key for later use

## Step 3: Configure the Application

1. Clone this repository
2. Navigate to the project directory
3. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file and add your:
   - Gemini API key
   - Supabase URL
   - Supabase API key
   - Default website (optional)

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Run the Application

```bash
npm start
```

The application will be available at http://localhost:3000

## Usage

1. Open the application in your browser
2. Enter a website URL in the input field and click "Train"
3. Wait for the training to complete
4. Start asking questions about the website content

## Customization

### Limiting URL Processing

By default, the application processes up to 20 URLs from a website to stay within free tier limits. You can adjust this by changing the `MAX_URLS` environment variable.

### Changing the Embedding Model

The application uses Gemini's embedding model. If you want to use a different model, you can modify the `vectorStore.js` file.

### Modifying the Frontend

The frontend is built with plain HTML, CSS, and JavaScript. You can customize it by editing the files in the `public` directory.

## Troubleshooting

### Rate Limiting

If you encounter rate limiting issues with the Gemini API, try:
- Reducing the number of URLs processed (`MAX_URLS`)
- Adding more delay between requests in `train.js`

### Database Issues

If you encounter database issues:
- Check your Supabase credentials
- Verify that the pgvector extension is enabled
- Make sure the SQL setup script ran successfully
