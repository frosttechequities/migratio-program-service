# Migratio NLP Service

This service provides Natural Language Processing (NLP) capabilities for the Migratio platform, specifically for analyzing free-text responses in the assessment quiz.

## Features

- Text analysis using TextBlob
- Entity extraction
- Sentiment analysis
- Keyword extraction
- Confidence scoring

## Getting Started

### Prerequisites

- Python 3.9+
- pip

### Installation

1. Clone the repository
2. Navigate to the NLP service directory:
   ```
   cd services/nlp-service
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Running the Service

Start the service locally:

```
uvicorn main:app --reload
```

The service will be available at http://localhost:8000

### API Endpoints

#### Health Check

```
GET /health
```

Response:
```json
{
  "status": "healthy"
}
```

#### Analyze Text

```
POST /analyze
```

Request body:
```json
{
  "text": "I want to immigrate to Canada for better job opportunities in the tech industry.",
  "questionId": "nlp-q1"
}
```

Response:
```json
{
  "extractedEntities": [
    {
      "text": "Canada",
      "label": "PROPER_NOUN",
      "confidence": 0.8
    },
    {
      "text": "tech industry",
      "label": "NOUN_PHRASE",
      "confidence": 0.7
    }
  ],
  "sentiment": "positive",
  "keywords": [
    {
      "text": "Canada",
      "relevance": 0.8
    },
    {
      "text": "job opportunities",
      "relevance": 0.8
    },
    {
      "text": "tech industry",
      "relevance": 0.8
    }
  ],
  "confidence": 0.7
}
```

## Deployment

### Docker

Build the Docker image:

```
docker build -t migratio-nlp-service .
```

Run the container:

```
docker run -p 8000:8000 migratio-nlp-service
```

### Render

This service is designed to be deployed on Render. Create a new Web Service with the following settings:

- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Environment Variables

- `PORT`: The port to run the service on (default: 8000)

## Integration with Migratio Platform

The Migratio platform communicates with this service through the `/api/nlp` proxy endpoint in the main backend. The proxy handles authentication and error handling, ensuring a seamless experience for users.

## Development

### Adding New NLP Features

To add new NLP features:

1. Update the `models.py` file with new data models
2. Implement the feature in `nlp_processor.py`
3. Update the API endpoint in `main.py` if needed
4. Update the proxy in the main backend if needed

### Testing

Run tests with:

```
pytest
```
