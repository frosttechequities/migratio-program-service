"""
Simple NLP service for the Migratio platform
"""

import re
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

# Create FastAPI app
app = FastAPI(title="Migratio NLP Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Entity(BaseModel):
    text: str
    label: str
    confidence: float

class Keyword(BaseModel):
    text: str
    relevance: float

class NlpAnalysisRequest(BaseModel):
    text: str
    questionId: str

class NlpAnalysisResponse(BaseModel):
    extractedEntities: List[Entity]
    sentiment: str
    keywords: List[Keyword]
    confidence: float

# Simple regex patterns for entity extraction
LOCATION_PATTERN = r'\b(?:Canada|USA|United States|Australia|UK|England|New Zealand|Germany|France|Spain|Italy|Japan|China|India|Brazil|Mexico|Toronto|Vancouver|Montreal|Ottawa|Calgary|Edmonton|Quebec|Victoria|Halifax|Winnipeg)\b'
SKILL_PATTERN = r'\b(?:software|engineer|developer|programming|coding|web|mobile|app|development|design|marketing|sales|finance|accounting|management|leadership|communication|teamwork|problem-solving|analytical|creative|technical|professional|experience|years|skills|knowledge|degree|education|university|college|certification|license)\b'
NUMBER_PATTERN = r'\b\d+\b'

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}

# Analyze text endpoint
@app.post("/analyze", response_model=NlpAnalysisResponse)
async def analyze_text_endpoint(request: NlpAnalysisRequest):
    """
    Analyze text using NLP techniques
    """
    logger.info(f"Analyzing text for question {request.questionId}")
    logger.info(f"Text content: '{request.text[:50]}...'")
    
    if not request.text:
        logger.error("Empty text provided")
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Extract entities
        entities = []
        
        # Extract locations
        for match in re.finditer(LOCATION_PATTERN, request.text, re.IGNORECASE):
            entities.append(Entity(
                text=match.group(),
                label="LOCATION",
                confidence=0.8
            ))
        
        # Extract numbers
        for match in re.finditer(NUMBER_PATTERN, request.text):
            entities.append(Entity(
                text=match.group(),
                label="NUMBER",
                confidence=0.9
            ))
        
        # Extract keywords
        keywords = []
        for match in re.finditer(SKILL_PATTERN, request.text, re.IGNORECASE):
            if len(match.group()) > 3:  # Only include meaningful words
                keywords.append(Keyword(
                    text=match.group(),
                    relevance=0.7
                ))
        
        # Simple sentiment analysis based on keywords
        positive_words = ['good', 'great', 'excellent', 'best', 'better', 'positive', 'hope', 'excited', 'opportunity']
        negative_words = ['bad', 'worst', 'difficult', 'hard', 'problem', 'issue', 'concern', 'worry', 'negative']
        
        positive_count = sum(1 for word in positive_words if re.search(r'\b' + word + r'\b', request.text, re.IGNORECASE))
        negative_count = sum(1 for word in negative_words if re.search(r'\b' + word + r'\b', request.text, re.IGNORECASE))
        
        if positive_count > negative_count:
            sentiment = "positive"
        elif negative_count > positive_count:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        # Use question_id to customize the analysis if needed
        if request.questionId == "nlp-q1":  # Immigration goals
            # Add a keyword for immigration goals if not already present
            if not any(k.text.lower() == "immigration" for k in keywords):
                keywords.append(Keyword(text="immigration", relevance=0.9))
        elif request.questionId == "nlp-q2":  # Skills and qualifications
            # Add a keyword for skills if not already present
            if not any(k.text.lower() == "skills" for k in keywords):
                keywords.append(Keyword(text="skills", relevance=0.9))
        
        # Calculate confidence
        confidence = 0.5
        
        result = NlpAnalysisResponse(
            extractedEntities=entities,
            sentiment=sentiment,
            keywords=keywords,
            confidence=confidence
        )
        
        logger.info(f"Analysis complete: {len(result.extractedEntities)} entities, {len(result.keywords)} keywords")
        return result
    except Exception as e:
        logger.error(f"Error analyzing text: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        # Return a fallback response instead of raising an exception
        logger.info("Returning fallback response")
        return NlpAnalysisResponse(
            extractedEntities=[],
            sentiment="neutral",
            keywords=[],
            confidence=0.0
        )
