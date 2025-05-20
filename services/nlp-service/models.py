from pydantic import BaseModel
from typing import List, Optional, Dict

class NlpAnalysisRequest(BaseModel):
    text: str
    questionId: str

class Entity(BaseModel):
    text: str
    label: str
    confidence: float

class Keyword(BaseModel):
    text: str
    relevance: float

class NlpAnalysisResponse(BaseModel):
    extractedEntities: List[Entity]
    sentiment: str
    keywords: List[Keyword]
    confidence: float
