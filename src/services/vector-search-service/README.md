# Visafy Vector Search Service

This service provides semantic search and chat functionality for the Visafy platform using Supabase's vector database.

## Features

- **Semantic Search**: Search for documents using natural language queries
- **AI-Powered Chat**: Chat with an AI assistant that uses relevant documents as context
- **Document Processing**: Process and index documents for semantic search

## Prerequisites

- Node.js 18+
- Supabase account with pgvector extension enabled
- Gemini API key

## Setup

1. Clone the repository
2. Navigate to the vector search service directory:
   ```
   cd src/services/vector-search-service
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Copy the example environment file and update it with your credentials:
   ```
   cp .env.example .env
   ```
5. Update the `.env` file with your Supabase and Gemini API credentials

## Usage

### Starting the Service

```
npm start
```

For development with auto-restart:
```
npm run dev
```

### Processing Documents

To process and index documents for semantic search:

```
npm run process-docs -- /path/to/your/documents
```

This will:
1. Read all supported files (PDF, Markdown, Text) in the specified directory
2. Generate embeddings for each document
3. Store the documents and embeddings in Supabase

### API Endpoints

#### Search API

- `POST /api/search`: Search for documents using semantic search
  ```json
  {
    "query": "What documents do I need for Express Entry?",
    "limit": 5,
    "threshold": 0.7
  }
  ```

#### Chat API

- `POST /api/chat`: Chat with an AI assistant
  ```json
  {
    "message": "What are the language requirements for Express Entry?",
    "history": [
      {"role": "user", "content": "Tell me about Express Entry"},
      {"role": "assistant", "content": "Express Entry is..."}
    ]
  }
  ```

## Integration with Frontend

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

This service can be deployed to Render or any other Node.js hosting service.

### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command: `cd src/services/vector-search-service && npm install`
4. Set the start command: `cd src/services/vector-search-service && npm start`
5. Add your environment variables from the `.env` file

## License

This project is licensed under the MIT License.
