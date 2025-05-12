import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from datetime import datetime
from dateutil.relativedelta import relativedelta
from dateutil.parser import parse as parse_date

# Load environment variables
load_dotenv()

app = Flask(__name__)

def analyze_document_metadata(metadata):
    """
    Analyzes document metadata based on simple rules.
    V1 implementation.
    """
    suggestions = []
    now = datetime.now()

    doc_type = metadata.get('documentType', '').lower()
    expiry_date_str = metadata.get('expiryDate')
    issue_date_str = metadata.get('issueDate')
    language = metadata.get('language', 'english').lower()
    filename = metadata.get('originalFilename', '').lower()

    # 1. Expiry Date Checks
    if expiry_date_str:
        try:
            expiry_date = parse_date(expiry_date_str)
            if expiry_date < now:
                suggestions.append({
                    'code': 'DOC_EXPIRED',
                    'severity': 'error',
                    'message': f"Document expired on {expiry_date.strftime('%Y-%m-%d')}."
                })
            elif expiry_date < now + relativedelta(months=6):
                 suggestions.append({
                    'code': 'DOC_EXPIRING_SOON',
                    'severity': 'warning',
                    'message': f"Document expires soon ({expiry_date.strftime('%Y-%m-%d')}). Consider renewing if needed for application."
                })
            # Check for passport validity duration (often needs > 6 months remaining)
            if 'passport' in doc_type and expiry_date < now + relativedelta(months=6):
                 suggestions.append({
                    'code': 'PASSPORT_VALIDITY_SHORT',
                    'severity': 'warning',
                    'message': "Passport validity is less than 6 months. Some countries/programs require longer validity."
                })
        except (ValueError, TypeError) as e:
            app.logger.warning(f"Could not parse expiry date '{expiry_date_str}': {e}")
            suggestions.append({
                'code': 'EXPIRY_DATE_INVALID',
                'severity': 'info',
                'message': "Could not automatically check expiry date. Please verify manually."
            })

    # 2. Language Check
    if language != 'english' and language != 'french': # Assuming English/French are common official languages
         suggestions.append({
            'code': 'NON_OFFICIAL_LANGUAGE',
            'severity': 'info',
            'message': f"Document language is '{language.capitalize()}'. Official translation might be required."
        })

    # 3. Filename Checks (Basic)
    if 'copy' in filename or 'duplicate' in filename:
         suggestions.append({
            'code': 'FILENAME_SUGGESTS_COPY',
            'severity': 'info',
            'message': "Filename suggests this might be a copy. Ensure you upload the original or a certified copy if required."
        })
    if 'old' in filename or 'expired' in filename:
         suggestions.append({
            'code': 'FILENAME_SUGGESTS_OLD',
            'severity': 'warning',
            'message': "Filename suggests this might be an old or expired version. Please verify."
        })

    # 4. Document Type Specific Checks (Example)
    if 'ielts' in doc_type or 'celpip' in doc_type or 'tef' in doc_type:
        if issue_date_str:
            try:
                issue_date = parse_date(issue_date_str)
                # Language tests often expire after 2 years
                if issue_date < now - relativedelta(years=2):
                     suggestions.append({
                        'code': 'LANG_TEST_EXPIRED',
                        'severity': 'error',
                        'message': f"Language test results issued on {issue_date.strftime('%Y-%m-%d')} are likely expired (typically valid for 2 years)."
                    })
            except (ValueError, TypeError) as e:
                 app.logger.warning(f"Could not parse issue date '{issue_date_str}': {e}")

    # TODO: Add more rules based on document types and common requirements

    app.logger.info(f"Analysis complete for document type '{doc_type}'. Found {len(suggestions)} suggestions.")
    return suggestions


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "Document Analysis Service"}), 200

@app.route('/analyze', methods=['POST'])
def analyze_document():
    """
    Analyzes document metadata and returns potential issues or suggestions.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    document_metadata = data.get('metadata')

    if not document_metadata:
        return jsonify({"error": "Missing 'metadata' field in request body"}), 400

    # Expecting metadata like: { documentType: 'passport', expiryDate: '...', issueDate: '...', language: '...', originalFilename: '...' }
    app.logger.info(f"Received analysis request for document type: {document_metadata.get('documentType', 'Unknown')}")

    try:
        suggestions = analyze_document_metadata(document_metadata)
        return jsonify({
            "status": "success",
            "suggestions": suggestions,
            "analysis_version": "v1.0-rules"
        }), 200
    except Exception as e:
        app.logger.error(f"Error during document analysis: {e}", exc_info=True)
        return jsonify({"error": "Internal server error during analysis"}), 500


if __name__ == '__main__':
    port = int(os.environ.get('DOCUMENT_ANALYSIS_SERVICE_PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True) # Use a different port, e.g., 5002
