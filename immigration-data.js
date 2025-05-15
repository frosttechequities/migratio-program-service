/**
 * Mock database of immigration information for the Visafy platform
 * 
 * This file contains factual information about immigration processes,
 * examinations, requirements, and documentation.
 */

const immigrationData = [
  {
    id: 1,
    title: "Immigration Medical Examination",
    content: `
# Immigration Medical Examination

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

## Official Sources

For more information, visit the official immigration website of your destination country:
- USA: [USCIS Medical Examination](https://www.uscis.gov/i-693)
- Canada: [Immigration Medical Examination](https://www.canada.ca/en/immigration-refugees-citizenship/services/application/medical-police/medical-exams.html)
- Australia: [Health Examinations](https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/health)
`,
    tags: ["medical", "examination", "health", "requirements"]
  },
  {
    id: 2,
    title: "Language Proficiency Tests",
    content: `
# Language Proficiency Tests for Immigration

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
- Higher scores may award more points in points-based immigration systems

## Preparation Resources

- Official test preparation materials
- Language courses
- Practice tests
- Online resources and apps

## Official Sources

- [IELTS Official Website](https://www.ielts.org)
- [TOEFL Official Website](https://www.ets.org/toefl)
- [PTE Academic](https://pearsonpte.com)
`,
    tags: ["language", "test", "IELTS", "TOEFL", "proficiency"]
  },
  {
    id: 3,
    title: "Immigration Interview Process",
    content: `
# Immigration Interview Process

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
5. **Arrive Early**: Allow time for security screening

## What to Expect

- Security screening upon arrival
- Oath to tell the truth
- Questions from an immigration officer
- Possible decisions: approval, request for evidence, or denial

## Official Sources

- [USCIS Interview Information](https://www.uscis.gov/forms/filing-guidance/preparing-for-your-uscis-interview)
- [UK Visa Interview Guidance](https://www.gov.uk/government/publications/visa-interviews-and-your-application)
`,
    tags: ["interview", "process", "questions", "preparation"]
  },
  {
    id: 4,
    title: "Required Immigration Documents",
    content: `
# Required Immigration Documents

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

5. **Additional Supporting Documents**:
   - Medical examination results
   - Police clearance certificates
   - Military service records
   - Photographs (passport-style)

## Document Requirements

- Most documents must be original or certified copies
- Non-English documents typically require certified translations
- Some documents may need authentication (apostille or consular legalization)
- Requirements vary by country and visa type

## Official Sources

- [USCIS Document Checklist](https://www.uscis.gov/forms/filing-guidance/checklist-of-required-initial-evidence)
- [Canada Immigration Document Checklist](https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides.html)
`,
    tags: ["documents", "requirements", "checklist", "application"]
  },
  {
    id: 5,
    title: "Biometrics Collection",
    content: `
# Biometrics Collection for Immigration

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
- Missing a biometrics appointment can delay or jeopardize your application

## Official Sources

- [USCIS Biometrics Information](https://www.uscis.gov/forms/filing-guidance/preparing-for-your-biometric-services-appointment)
- [UK Biometrics Collection](https://www.gov.uk/biometric-residence-permits)
- [Canada Biometrics](https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/guide-5746-giving-biometrics.html)
`,
    tags: ["biometrics", "fingerprints", "collection", "identification"]
  }
];

// Fast responses for common immigration questions
const fastResponses = {
  "medical examination": {
    response: `Immigration medical examinations are required health screenings conducted by authorized physicians to ensure applicants don't have inadmissible health conditions. They typically include a physical exam, medical history review, vaccination verification, and tests for conditions like tuberculosis. Results are usually valid for 6-12 months, and costs range from $200-500 depending on location. For specific requirements, check your destination country's official immigration website.`,
    source: "Immigration Medical Examination"
  },
  "language test": {
    response: `Language proficiency tests for immigration include IELTS, TOEFL, PTE, and Cambridge English for English, and TEF/TCF for French. These tests assess reading, writing, listening, and speaking skills. Scores are typically valid for 2 years, and required levels vary by immigration program. Higher scores may award more points in points-based systems. Prepare using official test materials, language courses, and practice tests.`,
    source: "Language Proficiency Tests"
  },
  "interview": {
    response: `Immigration interviews vary by type (visa, adjustment of status, citizenship, asylum) but generally involve an officer verifying your information and assessing eligibility. Prepare by reviewing your application, bringing all required documents, answering honestly, dressing professionally, and arriving early. Common questions cover your application details, background, purpose of immigration, and relationships. Decisions may include approval, requests for more evidence, or denial.`,
    source: "Immigration Interview Process"
  },
  "documents": {
    response: `Immigration applications require various supporting documents including identification (passport, birth certificate), civil documents (marriage/divorce certificates), financial records (bank statements, tax returns), educational credentials (diplomas, transcripts), and additional documents like medical exam results and police clearances. Most documents must be original or certified copies, and non-English documents typically require certified translations. Requirements vary by country and visa type.`,
    source: "Required Immigration Documents"
  },
  "biometrics": {
    response: `Biometrics collection for immigration involves capturing unique physical characteristics like fingerprints and photographs for security and identification. The process includes scheduling an appointment, paying a fee, visiting a collection center, and providing the required biometric data. Children under certain ages may be exempt, and accommodations may be available for individuals with disabilities. Biometrics are typically valid for 10-15 years.`,
    source: "Biometrics Collection"
  }
};

module.exports = {
  immigrationData,
  fastResponses
};
