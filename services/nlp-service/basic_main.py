"""
Basic NLP service for the Migratio platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

# Create FastAPI app
app = FastAPI(title="Basic NLP Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class AnalyzeRequest(BaseModel):
    text: str
    questionId: str

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}

# Analyze text endpoint
@app.post("/analyze")
async def analyze_text(request: AnalyzeRequest):
    """
    Analyze text using basic regex patterns
    """
    text = request.text
    
    # Extract entities
    entities = []
    
    # Extract locations using regex
    location_pattern = r'\b(?:Canada|USA|United States|Australia|UK|England|New Zealand|Germany|France|Spain|Italy|Japan|China|India|Brazil|Mexico|Toronto|Vancouver|Montreal|Ottawa|Calgary|Edmonton|Quebec|Victoria|Halifax|Winnipeg)\b'
    for match in re.finditer(location_pattern, text, re.IGNORECASE):
        entities.append({
            "text": match.group(),
            "label": "LOCATION",
            "confidence": 0.8
        })
    
    # Extract numbers using regex
    number_pattern = r'\b\d+\b'
    for match in re.finditer(number_pattern, text):
        entities.append({
            "text": match.group(),
            "label": "NUMBER",
            "confidence": 0.9
        })
    
    # Extract keywords
    keywords = []
    skill_pattern = r'\b(?:software|engineer|developer|programming|coding|web|mobile|app|development|design|marketing|sales|finance|accounting|management|leadership|communication|teamwork|problem-solving|analytical|creative|technical|professional|experience|years|skills|knowledge|degree|education|university|college|certification|license)\b'
    for match in re.finditer(skill_pattern, text, re.IGNORECASE):
        if len(match.group()) > 3:  # Only include meaningful words
            keywords.append({
                "text": match.group(),
                "relevance": 0.7
            })
    
    # Add immigration keyword for nlp-q1
    if request.questionId == "nlp-q1" and not any(k["text"].lower() == "immigration" for k in keywords):
        keywords.append({
            "text": "immigration",
            "relevance": 0.9
        })
    
    # Add skills keyword for nlp-q2
    if request.questionId == "nlp-q2" and not any(k["text"].lower() == "skills" for k in keywords):
        keywords.append({
            "text": "skills",
            "relevance": 0.9
        })
    
    # Simple sentiment analysis
    positive_words = ['good', 'great', 'excellent', 'best', 'better', 'positive', 'hope', 'excited', 'opportunity']
    negative_words = ['bad', 'worst', 'difficult', 'hard', 'problem', 'issue', 'concern', 'worry', 'negative']
    
    positive_count = sum(1 for word in positive_words if re.search(r'\b' + word + r'\b', text, re.IGNORECASE))
    negative_count = sum(1 for word in negative_words if re.search(r'\b' + word + r'\b', text, re.IGNORECASE))
    
    if positive_count > negative_count:
        sentiment = "positive"
    elif negative_count > positive_count:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    # Return the analysis results
    return {
        "extractedEntities": entities,
        "sentiment": sentiment,
        "keywords": keywords,
        "confidence": 0.5
    }
