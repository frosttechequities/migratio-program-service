# Supabase Configuration

This document provides detailed information about the Supabase configuration for the Visafy platform.

## Project Details

- **Project Name**: visafy-chatbot
- **Project ID**: qyvvrvthalxeibsmckep
- **Region**: eu-central-1
- **URL**: https://qyvvrvthalxeibsmckep.supabase.co
- **Dashboard**: [Supabase Dashboard](https://app.supabase.com/project/qyvvrvthalxeibsmckep)

## API Keys

### Service Role Key (Admin Access)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEwOTE4OCwiZXhwIjoyMDYyNjg1MTg4fQ.s3qm3hcgR9ie2igjmaz4dMeEWsQdsJmQpLR718uO0nA
```
- This key has full access to your database with admin privileges
- Used in your vector search service for database operations
- **IMPORTANT**: Keep this key secure and never expose it in client-side code

## Database Schema

The database schema includes tables for vector search functionality:

### Documents Table

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(1536)
);
```

This table stores:
- Document content
- Metadata (tags, title, source, etc.)
- Vector embeddings for similarity search

## Vector Search Setup

The vector search functionality is set up using the pgvector extension. The setup script (`supabase-setup-simplified.sql`) includes:

### 1. Enable pgvector Extension

```sql
-- Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Create Documents Table

```sql
-- Create a table to store documents with embeddings
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(1536)
);
```

### 3. Create Match Function

```sql
-- Create a function to match documents by embedding similarity
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding VECTOR(1536),
    match_threshold FLOAT,
    match_count INT
)
RETURNS TABLE (
    id INT,
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
```

### 4. Row Level Security (RLS) Policies

```sql
-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
    ON documents
    FOR ALL
    TO authenticated
    USING (true);

-- Create a policy that allows read-only access for anonymous users
CREATE POLICY "Allow read-only access for anonymous users"
    ON documents
    FOR SELECT
    TO anon
    USING (true);
```

### 5. Test Document Insertion

```sql
-- Insert a test document
INSERT INTO documents (content, metadata, embedding)
VALUES (
    'This is a test document for the vector search service.',
    '{"title": "Test Document", "source": "Setup Script", "tags": ["test"]}',
    '[0.1, 0.2, 0.3, ...]'::vector
);
```

## Accessing Supabase

### Dashboard Access
1. Go to [app.supabase.com](https://app.supabase.com)
2. Sign in with your credentials
3. Select the "visafy-chatbot" project

### API Access
Use the following code to initialize the Supabase client:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Service role key

const supabase = createClient(supabaseUrl, supabaseKey);
```

## Backup and Restore

### Creating a Backup
1. Go to the Supabase Dashboard
2. Navigate to Project Settings > Database
3. Click on "Backups"
4. Click "Create Backup"

### Restoring from a Backup
1. Go to the Supabase Dashboard
2. Navigate to Project Settings > Database
3. Click on "Backups"
4. Find the backup you want to restore
5. Click "Restore"

## Troubleshooting

### Common Issues

1. **Connection Issues**
   - Check that you're using the correct URL and API key
   - Verify that your IP is not blocked by Supabase

2. **Query Issues**
   - Check that you're using the correct table name
   - Verify that your query syntax is correct
   - Check that you have the necessary permissions

3. **Vector Search Issues**
   - Ensure the pgvector extension is enabled
   - Verify that your embeddings are in the correct format
   - Check that your match threshold is appropriate
