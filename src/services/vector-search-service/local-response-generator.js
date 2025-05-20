/**
 * Local Response Generator
 *
 * This module provides functions to generate responses locally without relying on external APIs.
 * It uses a combination of vector search results and pre-defined responses for common queries.
 */

const crypto = require('crypto');

// Simple in-memory cache
const responseCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Pre-defined responses for common immigration-related queries
const PREDEFINED_RESPONSES = {
  'express_entry': "Express Entry is Canada's immigration system that manages applications for permanent residence under three federal economic immigration programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class. It uses a Comprehensive Ranking System (CRS) to score candidates based on factors like age, education, work experience, and language skills. The highest-scoring candidates receive invitations to apply for permanent residence through regular draws.",
  
  'documents': "For most immigration applications, you'll need several key documents: a valid passport, birth certificate, marriage certificate (if applicable), police clearance certificates from countries where you've lived, proof of language proficiency (like IELTS or CELPIP test results), educational credential assessments, proof of funds to support yourself, and medical examination results. Make sure all documents are properly translated and certified if they're not in English or French.",
  
  'language_testing': "Language proficiency is crucial for most immigration programs. For English, accepted tests include IELTS (International English Language Testing System) and CELPIP (Canadian English Language Proficiency Index Program). For French, you can take the TEF (Test d'Évaluation de Français) or TCF (Test de Connaissance du Français). Test results are typically valid for 2 years, and higher scores can significantly improve your chances in points-based immigration systems.",
  
  'medical_exam': "Immigration medical examinations must be performed by approved physicians (often called panel physicians). The exam typically includes a physical examination, chest X-ray, blood tests for conditions like HIV and syphilis, and urinalysis. Results are usually valid for 12 months. You should only undergo the medical exam after being instructed to do so by immigration authorities, as timing is important.",
  
  'points_system': "Points-based immigration systems assign scores to candidates based on factors like age, education, work experience, language proficiency, and adaptability. Canada's Express Entry uses the Comprehensive Ranking System (CRS), Australia has the SkillSelect points test, and New Zealand uses the Skilled Migrant Category (SMC) points system. Each system has different criteria and minimum score requirements for eligibility.",
  
  'visa_types': "Common visa types include: Tourist/Visitor visas for short stays, Student visas for studying at recognized institutions, Work visas for employment opportunities, Family visas for joining relatives, and Permanent Residence visas for those looking to settle permanently. Each visa type has specific requirements and application processes.",
  
  'processing_time': "Immigration processing times vary widely depending on the country, visa type, and individual circumstances. Some applications may be processed in a few weeks, while others can take several months or even years. Many immigration authorities provide estimated processing times on their official websites, but these are just guidelines and actual times may vary.",
  
  'application_fees': "Immigration application fees vary by country and visa type. For example, Canadian permanent residence applications can cost between $1,000-$2,000 CAD per adult applicant, plus additional fees for medical exams, language tests, and credential assessments. Always check the official immigration website of your destination country for the most up-to-date fee information.",
  
  'rejection_reasons': "Common reasons for visa or immigration application rejections include: incomplete or incorrect documentation, failure to meet eligibility requirements, insufficient proof of financial support, security or criminal concerns, medical inadmissibility, misrepresentation or fraud, and previous immigration violations. If your application is rejected, carefully review the reason provided and consider consulting with an immigration professional before reapplying.",
  
  'appeal_process': "If your immigration application is rejected, you may have the right to appeal the decision. Appeal processes vary by country but typically involve submitting a formal appeal to a specialized tribunal or board within a specific timeframe. You'll need to provide evidence and arguments to show why the decision should be overturned. Legal representation is often recommended for appeals.",
  
  'default': "I'm an immigration assistant that can help with questions about immigration processes, requirements, and pathways. You can ask me about specific immigration programs, document requirements, language testing, visa applications, and more. How can I assist you today?"
};

/**
 * Generate a response based on the query and relevant documents
 * @param {string} query - The user's query
 * @param {Array} relevantDocs - Array of relevant documents from vector search
 * @returns {string} - The generated response
 */
function generateResponseFromDocs(query, relevantDocs) {
  if (!relevantDocs || relevantDocs.length === 0) {
    return null;
  }
  
  // Extract content from the most relevant document
  const mostRelevantDoc = relevantDocs[0];
  const content = mostRelevantDoc.content;
  
  // Return a concise summary based on the document content
  return content.length > 300 ? content.substring(0, 300) + '...' : content;
}

/**
 * Determine the most appropriate pre-defined response category for a query
 * @param {string} query - The user's query
 * @returns {string} - The category key
 */
function determineResponseCategory(query) {
  const normalizedQuery = query.toLowerCase();
  
  if (normalizedQuery.includes('express entry') || normalizedQuery.includes('crs') || normalizedQuery.includes('federal skilled')) {
    return 'express_entry';
  } else if (normalizedQuery.includes('document') || normalizedQuery.includes('paper') || normalizedQuery.includes('certificate')) {
    return 'documents';
  } else if (normalizedQuery.includes('language') || normalizedQuery.includes('ielts') || normalizedQuery.includes('celpip') || normalizedQuery.includes('test')) {
    return 'language_testing';
  } else if (normalizedQuery.includes('medical') || normalizedQuery.includes('health') || normalizedQuery.includes('exam')) {
    return 'medical_exam';
  } else if (normalizedQuery.includes('point') || normalizedQuery.includes('score') || normalizedQuery.includes('ranking')) {
    return 'points_system';
  } else if (normalizedQuery.includes('visa') || normalizedQuery.includes('permit') || normalizedQuery.includes('type')) {
    return 'visa_types';
  } else if (normalizedQuery.includes('time') || normalizedQuery.includes('long') || normalizedQuery.includes('wait') || normalizedQuery.includes('process')) {
    return 'processing_time';
  } else if (normalizedQuery.includes('fee') || normalizedQuery.includes('cost') || normalizedQuery.includes('pay') || normalizedQuery.includes('price')) {
    return 'application_fees';
  } else if (normalizedQuery.includes('reject') || normalizedQuery.includes('deny') || normalizedQuery.includes('refuse') || normalizedQuery.includes('decline')) {
    return 'rejection_reasons';
  } else if (normalizedQuery.includes('appeal') || normalizedQuery.includes('review') || normalizedQuery.includes('challenge') || normalizedQuery.includes('overturn')) {
    return 'appeal_process';
  }
  
  return 'default';
}

/**
 * Generate a chat response locally
 * @param {Array} messages - Array of message objects with role and content
 * @param {Array} relevantDocs - Array of relevant documents from vector search
 * @returns {Promise<Object>} - Object containing the response
 */
async function generateChatResponse(messages, relevantDocs = []) {
  try {
    // Get the last user message
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }
    
    const query = lastUserMessage.content;
    
    // Generate a cache key based on the query
    const cacheKey = crypto.createHash('md5').update(query).digest('hex');
    
    // Check if we have a cached response
    if (responseCache.has(cacheKey)) {
      const cachedItem = responseCache.get(cacheKey);
      
      // Check if the cached item is still valid
      if (Date.now() - cachedItem.timestamp < CACHE_TTL) {
        console.log(`Using cached response for query: ${query}`);
        return cachedItem.response;
      } else {
        // Remove expired cache item
        responseCache.delete(cacheKey);
      }
    }
    
    // Try to generate a response from relevant documents first
    let response = generateResponseFromDocs(query, relevantDocs);
    
    // If no response from documents, use pre-defined responses
    if (!response) {
      const category = determineResponseCategory(query);
      response = PREDEFINED_RESPONSES[category];
    }
    
    const result = {
      response: response,
      model: 'local',
      hasContext: relevantDocs.length > 0,
      method: 'local-response-generator'
    };
    
    // Cache the response
    responseCache.set(cacheKey, {
      response: result,
      timestamp: Date.now()
    });
    
    // Log cache size
    console.log(`Cache size: ${responseCache.size} items`);
    
    return result;
  } catch (error) {
    console.error('Error generating chat response:', error.message);
    
    // Return a default response in case of error
    return {
      response: PREDEFINED_RESPONSES.default,
      model: 'local',
      hasContext: false,
      method: 'local-response-generator-fallback'
    };
  }
}

/**
 * Check if the local response generator is available
 * @returns {Promise<boolean>} - Always returns true since this is a local implementation
 */
async function isAvailable() {
  return true;
}

module.exports = {
  generateChatResponse,
  isAvailable
};
