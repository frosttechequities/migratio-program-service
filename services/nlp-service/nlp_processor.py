from textblob import TextBlob
from models import Entity, Keyword, NlpAnalysisResponse
import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simple regex patterns for fallback entity extraction
LOCATION_PATTERN = r'\b(?:Canada|USA|United States|Australia|UK|England|New Zealand|Germany|France|Spain|Italy|Japan|China|India|Brazil|Mexico)\b'
SKILL_PATTERN = r'\b(?:software|engineer|developer|programming|coding|web|mobile|app|development|design|marketing|sales|finance|accounting|management|leadership|communication|teamwork|problem-solving|analytical|creative|technical|professional|experience|years|skills|knowledge|degree|education|university|college|certification|license)\b'
NUMBER_PATTERN = r'\b\d+\b'

def analyze_text(text: str, question_id: str) -> NlpAnalysisResponse:
    """
    Analyze text using TextBlob for NLP processing
    """
    try:
        logger.info(f"Starting analysis for text: '{text[:50]}...'")

        # Process the text with TextBlob
        blob = TextBlob(text)
        logger.info(f"TextBlob created successfully")

        try:
            # Extract noun phrases as entities
            entities = []
            for np in blob.noun_phrases:
                entities.append(Entity(
                    text=np,
                    label="NOUN_PHRASE",
                    confidence=0.7  # TextBlob doesn't provide confidence scores, so we use a default
                ))

            # Extract additional entities based on POS tagging
            for word, tag in blob.tags:
                if tag.startswith('NNP'):  # Proper noun
                    if not any(e.text.lower() == word.lower() for e in entities):
                        entities.append(Entity(
                            text=word,
                            label="PROPER_NOUN",
                            confidence=0.8
                        ))
                elif tag.startswith('CD'):  # Cardinal number
                    entities.append(Entity(
                        text=word,
                        label="NUMBER",
                        confidence=0.9
                    ))

            # Simple sentiment analysis
            sentiment_polarity = blob.sentiment.polarity
            if sentiment_polarity > 0.1:
                sentiment = "positive"
            elif sentiment_polarity < -0.1:
                sentiment = "negative"
            else:
                sentiment = "neutral"

            # Extract keywords (using noun phrases and important words)
            keywords = []
            # Add noun phrases as keywords
            for np in blob.noun_phrases:
                keywords.append(Keyword(
                    text=np,
                    relevance=0.8
                ))

            # Add other potentially important words
            for word, tag in blob.tags:
                if tag.startswith(('NN', 'VB', 'JJ')) and len(word) > 3:
                    if not any(k.text.lower() == word.lower() for k in keywords):
                        keywords.append(Keyword(
                            text=word,
                            relevance=0.6
                        ))

            # Calculate overall confidence
            # This is a simplified approach
            confidence = 0.7 if entities or keywords else 0.5

        except Exception as e:
            logger.warning(f"TextBlob processing failed, using fallback methods: {e}")
            # Fallback to regex-based extraction
            entities = []
            keywords = []

            # Extract locations
            for match in re.finditer(LOCATION_PATTERN, text, re.IGNORECASE):
                entities.append(Entity(
                    text=match.group(),
                    label="LOCATION",
                    confidence=0.8
                ))

            # Extract skills
            for match in re.finditer(SKILL_PATTERN, text, re.IGNORECASE):
                if len(match.group()) > 3:  # Only include meaningful words
                    keywords.append(Keyword(
                        text=match.group(),
                        relevance=0.7
                    ))

            # Extract numbers
            for match in re.finditer(NUMBER_PATTERN, text):
                entities.append(Entity(
                    text=match.group(),
                    label="NUMBER",
                    confidence=0.9
                ))

            # Simple sentiment analysis based on keywords
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

            # Lower confidence for regex-based extraction
            confidence = 0.5

        # Use question_id to customize the analysis if needed
        if question_id == "nlp-q1":  # Immigration goals
            # Add a keyword for immigration goals if not already present
            if not any(k.text.lower() == "immigration" for k in keywords):
                keywords.append(Keyword(text="immigration", relevance=0.9))
        elif question_id == "nlp-q2":  # Skills and qualifications
            # Add a keyword for skills if not already present
            if not any(k.text.lower() == "skills" for k in keywords):
                keywords.append(Keyword(text="skills", relevance=0.9))

        return NlpAnalysisResponse(
            extractedEntities=entities,
            sentiment=sentiment,
            keywords=keywords,
            confidence=confidence
        )
    except Exception as e:
        logger.error(f"Error analyzing text: {e}")
        logger.error(f"Error details: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        # Return empty results in case of error
        return NlpAnalysisResponse(
            extractedEntities=[],
            sentiment="neutral",
            keywords=[],
            confidence=0.0
        )
