"""
Simple script to directly test the NLP service
"""

import requests
import json

# Configuration
NLP_SERVICE_URL = "http://localhost:8000"
TEST_TEXT = "I want to immigrate to Canada to work in the tech industry as a software engineer. I have 5 years of experience in web development."

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{NLP_SERVICE_URL}/health")
        print(f"Health endpoint status: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Exception: {e}")
        return False

def test_analyze():
    """Test the analyze endpoint"""
    try:
        data = {
            "text": TEST_TEXT,
            "questionId": "nlp-q1"
        }
        
        print(f"Sending request to {NLP_SERVICE_URL}/analyze")
        print(f"Request data: {json.dumps(data, indent=2)}")
        
        response = requests.post(
            f"{NLP_SERVICE_URL}/analyze",
            json=data
        )
        
        print(f"Analyze endpoint status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Response: {json.dumps(result, indent=2)}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Exception: {e}")
        return False

if __name__ == "__main__":
    print("Testing NLP Service...")
    print("-" * 50)
    
    print("Testing health endpoint...")
    health_ok = test_health()
    print("-" * 50)
    
    if health_ok:
        print("Testing analyze endpoint...")
        test_analyze()
    else:
        print("Health check failed, skipping analyze test")
