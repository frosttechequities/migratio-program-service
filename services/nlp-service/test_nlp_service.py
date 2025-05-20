"""
Test script for the NLP service
"""

import requests
import json
import time
import sys

# Configuration
NLP_SERVICE_URL = "http://localhost:8000"
TEST_TEXTS = [
    {
        "text": "I want to immigrate to Canada to work in the tech industry as a software engineer. I have 5 years of experience in web development.",
        "questionId": "nlp-q1"
    },
    {
        "text": "I'm interested in moving to Australia or New Zealand because of the quality of life and beautiful nature. I'm a nurse with 10 years of experience.",
        "questionId": "nlp-q2"
    },
    {
        "text": "I'm concerned about the language requirements for immigration. My English is intermediate level, and I'm worried it might not be sufficient.",
        "questionId": "nlp-q3"
    }
]

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{NLP_SERVICE_URL}/health")
        if response.status_code == 200:
            print("✅ Health endpoint is working")
            return True
        else:
            print(f"❌ Health endpoint returned status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing health endpoint: {e}")
        return False

def test_analyze_endpoint(text_data):
    """Test the analyze endpoint with the given text data"""
    try:
        response = requests.post(
            f"{NLP_SERVICE_URL}/analyze",
            json=text_data
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Analyze endpoint processed text for question {text_data['questionId']}")
            print(f"   Extracted {len(result.get('extractedEntities', []))} entities")
            print(f"   Found {len(result.get('keywords', []))} keywords")
            print(f"   Sentiment: {result.get('sentiment', 'unknown')}")
            print(f"   Confidence: {result.get('confidence', 0)}")
            return True
        else:
            print(f"❌ Analyze endpoint returned status code {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing analyze endpoint: {e}")
        return False

def main():
    """Main function to run the tests"""
    print("🔍 Testing NLP Service")
    print(f"🌐 Service URL: {NLP_SERVICE_URL}")
    print("=" * 50)
    
    # Test health endpoint
    health_ok = test_health_endpoint()
    if not health_ok:
        print("❌ Health check failed, aborting further tests")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    
    # Test analyze endpoint with each test text
    success_count = 0
    for i, text_data in enumerate(TEST_TEXTS, 1):
        print(f"\n📝 Test {i}: Analyzing text for question {text_data['questionId']}")
        print(f"Text: {text_data['text'][:50]}...")
        
        start_time = time.time()
        success = test_analyze_endpoint(text_data)
        end_time = time.time()
        
        if success:
            success_count += 1
            print(f"⏱️ Processing time: {end_time - start_time:.2f} seconds")
        
        print("-" * 50)
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Summary: {success_count}/{len(TEST_TEXTS)} tests passed")
    
    if success_count == len(TEST_TEXTS):
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
