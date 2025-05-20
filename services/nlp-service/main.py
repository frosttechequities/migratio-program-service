from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import NlpAnalysisRequest, NlpAnalysisResponse
from nlp_processor import analyze_text
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Migratio NLP Service",
    description="NLP processing service for the Migratio platform",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to Migratio NLP Service"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/analyze", response_model=NlpAnalysisResponse)
async def analyze_text_endpoint(request: NlpAnalysisRequest):
    """
    Analyze text using NLP techniques
    """
    logger.info(f"Analyzing text for question {request.questionId}")
    logger.info(f"Text content: '{request.text[:50]}...'")

    # Don't try to access request.client or request.headers as they might not be available

    if not request.text:
        logger.error("Empty text provided")
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        logger.info("Calling analyze_text function")
        result = analyze_text(request.text, request.questionId)
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

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
