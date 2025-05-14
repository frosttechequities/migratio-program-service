# Visafy Vector Search Service Documentation

## Overview

The Visafy Vector Search Service provides semantic search and AI chat capabilities for the Visafy platform. It uses Supabase for vector storage and the Google Gemini API for AI features.

## Architecture

The service consists of the following components:

1. **Express Server**: Handles HTTP requests and routes them to the appropriate handlers
2. **Supabase Integration**: Stores and retrieves document embeddings
3. **Embedding Pipeline**: Generates embeddings for search queries and documents
4. **Gemini API Integration**: Generates AI responses for the chat feature

## Setup and Installation

### Prerequisites

- Node.js 18 or higher
- Supabase account with pgvector extension enabled
- Google Gemini API key

### Installation

1. Clone the repository
2. Navigate to the vector search service directory:
   ```
   cd src/services/vector-search-service
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with the following variables:
   ```
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_API_KEY=your_supabase_api_key

   # Google Gemini API Configuration
   GOOGLE_API_KEY=your_gemini_api_key

   # Server Configuration
   PORT=3006
   NODE_ENV=development
   ```

### Supabase Setup

1. Create a new Supabase project
2. Enable the pgvector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Create a documents table:
   ```sql
   CREATE TABLE documents (
     id SERIAL PRIMARY KEY,
     content TEXT NOT NULL,
     metadata JSONB,
     embedding VECTOR(384)
   );
   ```
4. Create a function to match documents:
   ```sql
   CREATE OR REPLACE FUNCTION match_documents(
     query_embedding VECTOR(384),
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

## Usage

### Starting the Server

```
npm start
```

For development with auto-restart:

```
npm run dev
```

### Processing Documents

```
npm run process-docs -- /path/to/your/documents
```

This will:
1. Read all supported files (PDF, Markdown, Text) in the specified directory
2. Generate embeddings for each document
3. Store the documents and embeddings in Supabase

### Testing

```
npm test
```

## API Reference

### Search Endpoint

```
POST /search
```

Request body:
```json
{
  "query": "What are the requirements for Express Entry?",
  "limit": 5,
  "threshold": 0.7
}
```

Response:
```json
{
  "results": [
    {
      "id": 1,
      "content": "The Express Entry system is used to manage applications for permanent residence...",
      "metadata": {
        "title": "Express Entry Program Guide",
        "source": "Immigration Canada",
        "tags": ["canada", "express entry", "immigration"]
      },
      "similarity": 0.92
    }
  ]
}
```

### Chat Endpoint

```
POST /chat
```

Request body:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What are the requirements for Express Entry?"
    }
  ],
  "context": "Optional context to provide to the AI"
}
```

Response:
```json
{
  "response": "Express Entry is Canada's immigration system that manages applications for permanent residence...",
  "model": "gemini-pro",
  "hasContext": true
}
```

### Health Check Endpoint

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "Vector search service is running"
}
```

## Frontend Integration

The frontend components for search and chat are located at:
- `src/frontend/src/components/search/SemanticSearch.js`
- `src/frontend/src/components/chatbot/ImmigrationChatbot.js`

To use these components, import them into your pages:

```jsx
import SemanticSearch from '../components/search/SemanticSearch';
import ImmigrationChatbot from '../components/chatbot/ImmigrationChatbot';

// Then use them in your component
<SemanticSearch />
<ImmigrationChatbot />
```

## Deployment

### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command: `cd src/services/vector-search-service && npm install`
4. Set the start command: `cd src/services/vector-search-service && npm start`
5. Add your environment variables from the `.env` file

### Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_API_KEY`: Your Supabase API key
- `GOOGLE_API_KEY`: Your Google Gemini API key
- `PORT`: The port to run the server on (default: 3006)
- `NODE_ENV`: The environment to run the server in (development, production)

## Troubleshooting

### Common Issues

1. **Embedding Pipeline Initialization Fails**
   - Check that you have a stable internet connection
   - Ensure you have enough memory available (at least 2GB)

2. **Supabase Connection Issues**
   - Verify your Supabase URL and API key
   - Check that the pgvector extension is enabled
   - Ensure the documents table exists

3. **Gemini API Issues**
   - Verify your API key
   - Check that you have sufficient quota

### Logs

Logs are output to the console. In production, you can view logs in the Render dashboard.

## Performance Considerations

- The embedding pipeline requires significant memory on first initialization
- Consider using a higher-tier Render instance for production
- For large document collections, consider implementing pagination

## Security Considerations

- Never expose your Supabase API key or Gemini API key in client-side code
- Use environment variables for all sensitive information
- Implement rate limiting for production deployments

## Future Enhancements

- Add support for more document types (PDF, DOCX, etc.)
- Implement better text chunking strategies
- Add metadata extraction from documents
- Implement filters for search results
- Add pagination for search results
- Implement search result highlighting
- Add conversation history persistence
- Implement typing indicators
- Add support for attachments or links in chat

## License

This project is licensed under the MIT License.
