/**
 * This script generates responses from a local Ollama instance and saves them to a JSON file.
 * These responses can then be used as mock data for the vector search service.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Ollama configuration
const OLLAMA_URL = 'http://localhost:11434';
const OLLAMA_MODEL = 'llama3'; // Primary model

// Immigration-related questions for generating responses
const IMMIGRATION_QUESTIONS = [
  "What are the requirements for a work visa?",
  "How do I apply for permanent residency?",
  "What is the difference between a green card and citizenship?",
  "What language tests are accepted for immigration?",
  "How long does the immigration process typically take?",
  "What are the common reasons for visa rejection?",
  "What documents are needed for family sponsorship?",
  "How can I check my immigration application status?",
  "What are the benefits of citizenship over permanent residency?",
  "What is the points system for skilled immigration?",
  "How do I prepare for an immigration interview?",
  "What are the fees associated with immigration applications?",
  "Can I appeal a visa rejection?",
  "What is the process for asylum seekers?",
  "How do student visas work?",
  "What are the requirements for a business investor visa?",
  "How does the medical examination process work for immigration?",
  "What background checks are performed during immigration?",
  "How can I bring my family members after I immigrate?",
  "What are the rights of permanent residents vs. citizens?"
];

// System message for context
const SYSTEM_MESSAGE = 'You are an immigration assistant for the Visafy platform. Provide helpful and accurate information about immigration processes, requirements, and pathways.';

/**
 * Generate a response from Ollama for a given question
 * @param {string} question - The question to ask Ollama
 * @returns {Promise<string>} - The response from Ollama
 */
async function generateOllamaResponse(question) {
  try {
    console.log(`Generating response for: "${question}"`);
    
    const messages = [
      { role: 'system', content: SYSTEM_MESSAGE },
      { role: 'user', content: question }
    ];
    
    const response = await axios.post(
      `${OLLAMA_URL}/api/chat`,
      {
        model: OLLAMA_MODEL,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1024,
        }
      }
    );
    
    return response.data.message.content;
  } catch (error) {
    console.error(`Error generating response for "${question}":`, error.message);
    return `Error: ${error.message}`;
  }
}

/**
 * Generate responses for all questions and save them to a JSON file
 */
async function generateAndSaveResponses() {
  const responses = {};
  
  for (const question of IMMIGRATION_QUESTIONS) {
    try {
      const response = await generateOllamaResponse(question);
      responses[question] = response;
      
      // Add a delay to avoid overwhelming Ollama
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to generate response for "${question}":`, error);
      responses[question] = `Error: ${error.message}`;
    }
  }
  
  // Save responses to a JSON file
  const outputPath = path.join(__dirname, 'ollama-responses.json');
  fs.writeFileSync(outputPath, JSON.stringify(responses, null, 2));
  
  console.log(`Responses saved to ${outputPath}`);
}

// Run the script
generateAndSaveResponses().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
