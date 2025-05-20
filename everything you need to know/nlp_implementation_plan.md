# NLP for Free-Text Interpretation - Implementation Plan

## Overview

This document outlines the implementation plan for adding Natural Language Processing (NLP) capabilities to the assessment quiz system. This feature will enhance the platform by extracting structured data from users' free-text responses, which can then be used to update their profiles and improve recommendation accuracy.

## Current State Analysis

Based on the codebase review:
1. The assessment quiz system is already implemented with basic functionality
2. The `TextQuestion` component exists but doesn't have NLP processing capabilities
3. The question schema includes a `requiresNlp` field, but it's not being utilized
4. There's a `free-text-nlp` question type in the QuestionRenderer, but it's currently treated the same as regular text questions
5. The system uses Supabase for data storage and authentication

## Technology Selection

### NLP Library Selection
After research, we'll use **TextBlob** for the following reasons:
1. **Lightweight**: TextBlob is much smaller than spaCy and doesn't require large model downloads
2. **Simplicity**: TextBlob is easier to use for basic NLP tasks like entity extraction and sentiment analysis
3. **Performance**: TextBlob is sufficient for our needs and has lower resource requirements
4. **Beginner-friendly**: TextBlob has a simpler API that's easier to implement

### Deployment Options
For deploying the NLP microservice, we'll use **Render** which offers:
1. **Free tier**: Render provides a free tier for web services
2. **Easy deployment**: Simple deployment process with GitHub integration
3. **Reliability**: Good uptime for free tier services
4. **No credit card required**: Unlike some alternatives, Render doesn't require payment information for free tier

## Implementation Steps

### 1. Create Python Microservice for NLP Processing

#### Files to Create:
- `services/nlp-service/main.py` - FastAPI application
- `services/nlp-service/models.py` - Data models
- `services/nlp-service/nlp_processor.py` - NLP processing logic using TextBlob
- `services/nlp-service/requirements.txt` - Dependencies
- `services/nlp-service/Dockerfile` - For containerization

#### Key Dependencies:
- FastAPI for API framework
- TextBlob for NLP processing
- Uvicorn for ASGI server

### 2. Implement API Endpoints for Text Analysis

#### Endpoints to Create:
- `GET /health` - Health check endpoint
- `POST /analyze` - Text analysis endpoint

#### NLP Features to Implement:
- Entity extraction (noun phrases, proper nouns, numbers)
- Sentiment analysis (positive, negative, neutral)
- Keyword extraction
- Confidence scoring

### 3. Modify TextQuestion.js Component to Support NLP

#### Features to Add:
- Loading state for NLP processing
- Visual feedback for extracted entities
- Toggle to show/hide NLP results
- Debounced text input to avoid excessive API calls

### 4. Update assessmentService.js to Call the NLP Service

#### Functions to Implement:
- `analyzeTextResponse(text, questionId)` - Call NLP service
- Update `submitAnswer` to handle NLP processing for text questions
- Add error handling and fallback responses

### 5. Update assessmentSlice.js to Store NLP Results

#### State to Add:
- `nlpResults` - Store NLP analysis results
- `isProcessingNlp` - Track NLP processing status

#### Actions to Add:
- `startNlpAnalysis` - Begin NLP processing
- `completeNlpAnalysis` - Store NLP results
- `failNlpAnalysis` - Handle NLP processing errors

### 6. Store Structured Data in User Profile

#### Functions to Implement:
- `updateUserProfileWithNlpData(userId, nlpResults)` - Update profile with extracted data
- Map extracted entities to appropriate profile fields

## Implementation Timeline

1. **Day 1**: Set up NLP microservice with TextBlob
2. **Day 2**: Implement and test API endpoints
3. **Day 3**: Update TextQuestion component and assessmentService.js
4. **Day 4**: Update assessmentSlice.js and implement profile updates
5. **Day 5**: Testing and refinement

## Testing Strategy

### Unit Tests:
- Test NLP processor functions
- Test TextQuestion component with mock NLP results
- Test Redux actions and reducers

### Integration Tests:
- Test end-to-end flow from text input to profile update
- Test error handling and fallback mechanisms

### Manual Tests:
- Test with various text inputs
- Verify entity extraction accuracy
- Check sentiment analysis results

## Deployment Strategy

1. Deploy NLP microservice to Render
2. Update frontend to call the deployed service
3. Monitor performance and adjust as needed

## Success Criteria

1. NLP service successfully extracts entities from free-text responses
2. TextQuestion component shows NLP results with proper UI feedback
3. User profiles are updated with structured data from NLP analysis
4. System gracefully handles errors and provides fallbacks

## Fallback Mechanisms

1. If NLP service is unavailable, continue with regular text input
2. If entity extraction fails, store raw text only
3. Implement client-side timeout to prevent long waits

## Future Enhancements

1. Improve entity extraction with custom models
2. Add support for multiple languages
3. Implement more advanced NLP features (intent recognition, relation extraction)
4. Add user feedback mechanism to improve NLP accuracy

## References

1. [TextBlob Documentation](https://textblob.readthedocs.io/)
2. [FastAPI Documentation](https://fastapi.tiangolo.com/)
3. [Render Deployment Guide](https://render.com/docs)
