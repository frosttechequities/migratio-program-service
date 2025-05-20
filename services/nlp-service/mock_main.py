"""
Mock NLP service for the Migratio platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Create FastAPI app
app = FastAPI(title="Migratio NLP Service (Mock)")

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

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}

# Analyze text endpoint
@app.post("/analyze")
async def analyze_text_endpoint(request: NlpAnalysisRequest):
    """
    Analyze text using NLP techniques (mock implementation)
    """
    # Return a fixed response for testing
    return {
        "extractedEntities": [
            {
                "text": "Canada",
                "label": "LOCATION",
                "confidence": 0.8
            },
            {
                "text": "5",
                "label": "NUMBER",
                "confidence": 0.9
            }
        ],
        "sentiment": "neutral",
        "keywords": [
            {
                "text": "software",
                "relevance": 0.7
            },
            {
                "text": "engineer",
                "relevance": 0.7
            },
            {
                "text": "years",
                "relevance": 0.7
            },
            {
                "text": "experience",
                "relevance": 0.7
            },
            {
                "text": "development",
                "relevance": 0.7
            },
            {
                "text": "immigration",
                "relevance": 0.9
            }
        ],
        "confidence": 0.5
    }
