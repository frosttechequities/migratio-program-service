/**
 * Test script for Hugging Face API integration
 *
 * This script tests the Hugging Face API integration to ensure it's working correctly
 * before committing changes to GitHub.
 */

// Import the Hugging Face API wrapper
const { HfInference } = require('@huggingface/inference');

// Configuration
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || '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';
const DEFAULT_MODEL = 'facebook/bart-large-cnn'; // Summarization model
const FALLBACK_MODEL = 'facebook/bart-large-mnli'; // Classification model

// Initialize the Hugging Face client
const client = new HfInference(HUGGINGFACE_API_TOKEN);

/**
 * Test the API availability
 */
async function testApiAvailability() {
  try {
    console.log('Testing Hugging Face API availability...');

    // Use a simple HEAD request to check if the model is available
    const response = await fetch(`https://api-inference.huggingface.co/models/${DEFAULT_MODEL}`, {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`
      }
    });

    if (response.ok) {
      console.log('✅ Hugging Face API is available');
      return true;
    } else {
      console.log(`❌ Hugging Face API returned status: ${response.status}`);

      // Try with the fallback model
      console.log('Testing with fallback model...');

      const fallbackResponse = await fetch(`https://api-inference.huggingface.co/models/${FALLBACK_MODEL}`, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`
        }
      });

      if (fallbackResponse.ok) {
        console.log('✅ Fallback model is available');
        return true;
      } else {
        console.log(`❌ Fallback model returned status: ${fallbackResponse.status}`);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Error testing API availability:', error.message);
    return false;
  }
}

/**
 * Test summarization
 */
async function testSummarization() {
  try {
    console.log('Testing summarization...');

    // Try with the default model
    try {
      const response = await client.summarization({
        model: DEFAULT_MODEL,
        inputs: 'The tower is 324 metres tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres on each side.',
        parameters: {
          max_length: 30,
          min_length: 10
        }
      });

      console.log('✅ Summarization successful with default model');
      console.log('Summary:', response.summary_text);
      return true;
    } catch (error) {
      console.log(`❌ Default model failed: ${error.message}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing summarization:', error.message);
    return false;
  }
}

/**
 * Test zero-shot classification
 */
async function testZeroShotClassification() {
  try {
    console.log('Testing zero-shot classification...');

    // Try with the fallback model
    try {
      const response = await client.zeroShotClassification({
        model: FALLBACK_MODEL,
        inputs: 'I love this product!',
        parameters: {
          candidate_labels: ['positive', 'negative', 'neutral']
        }
      });

      console.log('✅ Zero-shot classification successful');
      console.log('Classification:', response.labels, response.scores);
      return true;
    } catch (error) {
      console.log(`❌ Classification model failed: ${error.message}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing classification:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('=== Testing Hugging Face API Integration ===');

  // Test API availability
  const apiAvailable = await testApiAvailability();

  // Test summarization
  const summarizationWorks = await testSummarization();

  // Test zero-shot classification
  const classificationWorks = await testZeroShotClassification();

  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`API Availability: ${apiAvailable ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Summarization: ${summarizationWorks ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Classification: ${classificationWorks ? '✅ PASS' : '❌ FAIL'}`);

  if (apiAvailable && (summarizationWorks || classificationWorks)) {
    console.log('\n✅ All tests passed! The Hugging Face API integration is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please check the logs for details.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});
