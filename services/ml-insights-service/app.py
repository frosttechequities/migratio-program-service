import os
import requests # For calling other services
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from datetime import datetime # Import datetime if not already present
from dateutil.relativedelta import relativedelta # Import if not already present
from dateutil.parser import parse as parse_date # Import if not already present
# import joblib # For loading trained models later

# Load environment variables
load_dotenv()

app = Flask(__name__)
PROGRAM_SERVICE_URL = os.environ.get('PROGRAM_SERVICE_URL') # Load Program Service URL

# Placeholder for loading models - to be implemented
# try:
#     success_model = joblib.load('models/success_probability_model.pkl')
#     match_model = joblib.load('models/match_model.pkl')
#     feature_processor = joblib.load('models/feature_processor.pkl')
# except FileNotFoundError:
#     app.logger.warning("One or more ML models not found. Service will run with placeholder logic.")
#     success_model = None
#     match_model = None
#     feature_processor = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "ML Insights Service"}), 200


# --- Helper to fetch program data ---
def get_program_data(program_id):
    if not PROGRAM_SERVICE_URL:
        app.logger.error("PROGRAM_SERVICE_URL is not configured.")
        return None
    try:
        url = f"{PROGRAM_SERVICE_URL}/programs/{program_id}"
        response = requests.get(url, timeout=5) # Add timeout
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
        if response.json().get('status') == 'success':
            return response.json().get('data', {}).get('program')
        else:
            app.logger.warning(f"Program service returned non-success status for {program_id}: {response.json().get('message')}")
            return None
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error fetching program data for {program_id} from {PROGRAM_SERVICE_URL}: {e}")
        return None
    except Exception as e:
        app.logger.error(f"Unexpected error fetching program data for {program_id}: {e}")
        return None


@app.route('/predict/success_probability', methods=['POST'])
def predict_success_probability():
    """
    Predicts the success probability for a given user profile and program.
    Placeholder implementation.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    user_profile = data.get('user_profile')
    program_details = data.get('program_details')

    if not user_profile or not program_details:
        return jsonify({"error": "Missing user_profile or program_details"}), 400

    # Placeholder logic - replace with actual model prediction
    # if success_model and feature_processor:
    #     try:
    #         # Process features (conceptual)
    #         # processed_features = feature_processor.transform_for_success(user_profile, program_details)
    #         # probability = success_model.predict_proba(processed_features)[:, 1][0]
    #         probability = 0.75 # Placeholder
    #         return jsonify({"success_probability": probability}), 200
    #     except Exception as e:
    #         app.logger.error(f"Error during prediction: {e}")
    #         return jsonify({"error": "Prediction model error"}), 500
    # else:
    #     app.logger.warning("Success probability model not loaded. Returning placeholder.")
    
    # Simplified placeholder for now
    app.logger.info(f"Received success_probability request for user: {user_profile.get('userId', 'Unknown')}, program: {program_details.get('programId', 'Unknown')}")
    probability = 0.65 # Default placeholder if model not loaded or in early dev
    
    # Simulate some variation based on input for more "realistic" placeholder
    if user_profile.get('age', 30) < 25 and program_details.get('min_experience_years', 0) > 3:
        probability = 0.45
    elif user_profile.get('has_degree', False) and program_details.get('requires_degree', False):
        probability = 0.85

    # Placeholder Explanation Logic for Success Probability
    explanation_prob = {
        "positive_factors": [],
        "negative_factors": [],
        "notes": "Placeholder explanation based on simple rules."
    }
    if user_profile.get('has_degree', False) and program_details.get('requires_degree', False):
         explanation_prob["positive_factors"].append("Meeting degree requirement is a positive factor.")
    if user_profile.get('age', 30) < 25 and program_details.get('min_experience_years', 0) > 3:
         explanation_prob["negative_factors"].append("Age/experience combination might be less competitive for this program.")
    # Add more factors based on rules

    return jsonify({
        "user_id": user_profile.get('userId'),
        "program_id": program_details.get('programId'),
        "success_probability": probability,
        "explanation": explanation_prob, # Add explanation
        "model_version": "placeholder_v0.1"
    }), 200

@app.route('/predict/match_score', methods=['POST'])
def predict_match_score():
    """
    Predicts the match score for a given user profile and program.
    Placeholder implementation.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    user_profile = data.get('user_profile')
    program_details = data.get('program_details')

    if not user_profile or not program_details:
        return jsonify({"error": "Missing user_profile or program_details"}), 400

    # Placeholder logic - replace with actual model prediction
    # if match_model and feature_processor:
    #     # ... actual prediction logic ...
    #     match_score = 0.80 # Placeholder
    #     return jsonify({"match_score": match_score}), 200
    # else:
    #    app.logger.warning("Match score model not loaded. Returning placeholder.")
    
    app.logger.info(f"Received match_score request for user: {user_profile.get('userId', 'Unknown')}, program: {program_details.get('programId', 'Unknown')}")
    match_score = 0.70 # Default placeholder

    if user_profile.get('language_proficiency', {}).get('english', 'B1') == 'C2':
        match_score += 0.15
    if program_details.get('category') in user_profile.get('preferred_categories', []):
        match_score += 0.10
    
    match_score = min(match_score, 1.0) # Cap at 1.0

    # Placeholder Explanation Logic for Match Score
    explanation_match = {
        "positive_factors": [],
        "negative_factors": [],
        "notes": "Placeholder explanation based on simple rules."
    }
    if user_profile.get('language_proficiency', {}).get('english', 'B1') == 'C2':
        explanation_match["positive_factors"].append("High English proficiency.")
    if program_details.get('category') in user_profile.get('preferred_categories', []):
        explanation_match["positive_factors"].append("Matches preferred program category.")
    # Add negative factors if applicable based on rules not met (if any were added)

    return jsonify({
        "user_id": user_profile.get('userId'),
        "program_id": program_details.get('programId'),
        "match_score": match_score,
        "explanation": explanation_match, # Add explanation
        "model_version": "placeholder_v0.1"
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('ML_INSIGHTS_SERVICE_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)


@app.route('/predict/processing_time', methods=['POST'])
def predict_processing_time():
    """
    Predicts the processing time for a given program, potentially based on user factors.
    V1 Placeholder: Returns standard processing time from program data.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    program_id = data.get('program_id')
    user_profile = data.get('user_profile') # User profile might influence prediction later

    if not program_id:
        return jsonify({"error": "Missing 'program_id' field in request body"}), 400

    app.logger.info(f"Received processing_time request for program: {program_id}")

    # V1: Fetch standard processing time from Program Service
    program_data = get_program_data(program_id)

    if not program_data:
        return jsonify({"error": f"Could not retrieve data for program {program_id}"}), 404

    processing_time_data = program_data.get('processingTime', {})
    predicted_months = processing_time_data.get('averageMonths') or \
                       (processing_time_data.get('minMonths') + processing_time_data.get('maxMonths')) / 2 if processing_time_data.get('minMonths') and processing_time_data.get('maxMonths') else \
                       None

    if predicted_months is None:
         app.logger.warning(f"No standard processing time found for program {program_id}. Returning default.")
         # Return a default or indicate unavailability
         return jsonify({
             "program_id": program_id,
             "predicted_months": None,
             "confidence": 0,
             "notes": "Standard processing time not available for this program.",
             "model_version": "v1.0-standard-lookup"
         }), 200


    # TODO: V2+ would involve an ML model using program_data and user_profile features
    # For V1, just return the standard time.
    return jsonify({
        "program_id": program_id,
        "predicted_months": predicted_months,
        "confidence": 0.5, # Placeholder confidence for standard time
        "notes": "Prediction based on standard reported processing times.",
        "model_version": "v1.0-standard-lookup"
    }), 200


if __name__ == '__main__':
    port = int(os.environ.get('ML_INSIGHTS_SERVICE_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
