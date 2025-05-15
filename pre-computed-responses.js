/**
 * Pre-computed responses for common immigration questions
 * 
 * This module provides fast, accurate responses to common immigration questions
 * without requiring LLM inference, making it suitable for production deployment.
 */

// Pre-computed responses for common immigration topics
const preComputedResponses = {
  // Medical examination related queries
  "medical examination": {
    response: `# Immigration Medical Examination

Immigration medical examinations are required for most immigration applications to ensure that applicants don't have health conditions that would make them inadmissible.

## Key Components

1. **Physical Examination**: A general assessment of your health status
2. **Medical History Review**: Documentation of past and current medical conditions
3. **Vaccination Verification**: Ensuring you have all required vaccinations
4. **Chest X-ray and Blood Tests**: Screening for tuberculosis and other conditions
5. **Drug and Alcohol Screening**: May be required in some cases

## Important Facts

- Must be conducted by an authorized physician (Civil Surgeon or Panel Physician)
- Results are typically valid for 6-12 months, depending on the country
- Applicants with certain medical conditions may require additional documentation
- Cost varies by country and provider, typically $200-$500

For more information, visit the official immigration website of your destination country.`,
    source: "Medical Examinations for Immigration",
    responseTime: 0.2 // simulated response time in seconds
  },
  
  // Language testing related queries
  "language test": {
    response: `# Language Proficiency Tests for Immigration

Most immigration programs require proof of language proficiency in the official language(s) of the destination country.

## Common Language Tests

1. **English Tests**:
   - **IELTS** (International English Language Testing System)
   - **TOEFL** (Test of English as a Foreign Language)
   - **PTE** (Pearson Test of English)
   - **Cambridge English Qualifications**

2. **French Tests** (for Canada and other French-speaking countries):
   - **TEF** (Test d'Évaluation de Français)
   - **TCF** (Test de Connaissance du Français)

## Test Components

Most language tests assess four key skills:
- Reading
- Writing
- Listening
- Speaking

## Scoring and Requirements

- Scores are typically valid for 2 years
- Required scores vary by immigration program and country
- Higher scores may award more points in points-based immigration systems`,
    source: "Language Testing for Immigration",
    responseTime: 0.2
  },
  
  // Document requirements related queries
  "document": {
    response: `# Required Immigration Documents

Immigration applications require various supporting documents to verify your identity, background, and eligibility.

## Common Required Documents

1. **Identification Documents**:
   - Valid passport
   - Birth certificate
   - National ID card
   - Driver's license

2. **Civil Documents**:
   - Marriage certificate
   - Divorce decree
   - Death certificate (if applicable)
   - Adoption papers (if applicable)

3. **Financial Documents**:
   - Bank statements
   - Tax returns
   - Employment verification
   - Proof of assets

4. **Educational Documents**:
   - Diplomas and degrees
   - Transcripts
   - Educational evaluations
   - Professional certifications

## Document Requirements

- Most documents must be original or certified copies
- Non-English documents typically require certified translations
- Some documents may need authentication (apostille or consular legalization)
- Requirements vary by country and visa type`,
    source: "Document Requirements for Immigration",
    responseTime: 0.2
  },
  
  // Biometrics related queries
  "biometric": {
    response: `# Biometrics Collection for Immigration

Many countries require biometric data collection as part of the immigration process for security and identification purposes.

## What Are Biometrics?

Biometrics are unique physical characteristics used to verify identity, including:
- Fingerprints
- Photograph
- Signature
- Iris scan (in some countries)

## Biometrics Collection Process

1. **Appointment Scheduling**: Book an appointment at a designated collection center
2. **Fee Payment**: Pay the required biometrics fee
3. **Visit to Collection Center**: Attend in person with required documents
4. **Data Collection**: Digital fingerprinting and photograph
5. **Receipt**: Receive confirmation of biometrics collection

## Important Information

- Children under a certain age may be exempt (varies by country)
- Individuals with certain disabilities may qualify for accommodations
- Biometrics are typically valid for a specific period (often 10-15 years)
- Missing a biometrics appointment can delay or jeopardize your application`,
    source: "Biometrics Collection",
    responseTime: 0.2
  },
  
  // Interview related queries
  "interview": {
    response: `# Immigration Interview Process

The immigration interview is a critical step in many immigration applications, where an immigration officer assesses your eligibility and verifies your information.

## Types of Interviews

1. **Visa Interview**: Conducted at embassies or consulates abroad
2. **Adjustment of Status Interview**: For applicants already in the destination country
3. **Citizenship Interview**: For naturalization applicants
4. **Asylum Interview**: For those seeking asylum protection

## Common Interview Questions

- Questions about your application and supporting documents
- Personal background and family information
- Purpose of immigration
- Relationship questions (for family-based applications)
- Knowledge of the destination country (for citizenship)

## Preparation Tips

1. **Review Your Application**: Be familiar with all information you provided
2. **Bring Required Documents**: Original documents and copies of everything submitted
3. **Be Honest**: Provide truthful answers to all questions
4. **Dress Professionally**: Make a good impression
5. **Arrive Early**: Allow time for security screening`,
    source: "Immigration Interview Process",
    responseTime: 0.2
  },
  
  // Points system related queries
  "points system": {
    response: `# Points-Based Immigration Systems

Many countries use points-based systems to select skilled immigrants based on factors that predict successful economic integration.

## Common Points-Based Systems

1. **Canada's Express Entry**:
   - Comprehensive Ranking System (CRS)
   - Maximum 1,200 points
   - Points for age, education, language, work experience, adaptability
   - Regular draws with minimum score thresholds

2. **Australia's SkillSelect**:
   - Points test with minimum threshold of 65 points
   - Points for age, English ability, skilled employment, education
   - Invitation rounds for highest-scoring candidates

3. **UK Points-Based System**:
   - Mandatory criteria plus points-based elements
   - Required job offer at appropriate skill level
   - English language proficiency
   - Salary thresholds

## Key Factors Assessed

- Age (prime working age receives more points)
- Language proficiency (higher scores = more points)
- Education (higher qualifications = more points)
- Work experience (relevant experience = more points)
- Adaptability factors (ties to the country, spouse skills)`,
    source: "Points-Based Immigration Systems",
    responseTime: 0.2
  }
};

/**
 * Find the best matching pre-computed response for a query
 * @param {string} query - The user's query
 * @returns {Object|null} - The best matching response or null if no good match
 */
function findBestPreComputedResponse(query) {
  if (!query) return null;
  
  const normalizedQuery = query.toLowerCase();
  
  // Check for keyword matches
  for (const [keyword, responseData] of Object.entries(preComputedResponses)) {
    if (normalizedQuery.includes(keyword)) {
      return {
        response: responseData.response,
        source: responseData.source,
        responseTime: responseData.responseTime,
        isPreComputed: true
      };
    }
  }
  
  return null;
}

module.exports = {
  preComputedResponses,
  findBestPreComputedResponse
};
