/**
 * Sample NLP-enabled questions for the assessment quiz
 * These questions allow users to express their situation in their own words,
 * with NLP analysis to extract key information.
 */

const sampleNlpQuestions = [
  {
    id: 'nlp-q1',
    section: 'Part 1: Your Immigration Profile',
    text: 'What are your primary goals for immigration and what do you hope to achieve by moving to a new country?',
    type: 'free-text-nlp',
    required: true,
    requiresNlp: true,
    placeholder: 'Describe your goals, aspirations, and what you hope to achieve by immigrating...',
    helpText: 'Your response will be analyzed to provide recommendations tailored to your personal goals.',
    rows: 5,
    validation: {
      maxLength: 1000
    }
  },
  {
    id: 'nlp-q2',
    section: 'Part 1: Your Immigration Profile',
    text: 'Describe your education, skills, work experience, and any certifications you have.',
    type: 'free-text-nlp',
    required: true,
    requiresNlp: true,
    placeholder: 'Include degrees, professional skills, years of experience, job titles, and certifications...',
    helpText: 'This information helps us match you with skilled immigration programs that value your qualifications.',
    rows: 5,
    validation: {
      maxLength: 1000
    }
  },
  {
    id: 'nlp-q3',
    section: 'Part 1: Your Immigration Profile',
    text: 'Which countries or regions are you considering for immigration and why?',
    type: 'free-text-nlp',
    required: true,
    requiresNlp: true,
    placeholder: 'Mention specific countries or regions and your reasons for interest (e.g., job opportunities, quality of life)...',
    helpText: 'Your destination preferences help us prioritize immigration pathways in your target countries.',
    rows: 4,
    validation: {
      maxLength: 800
    }
  }
];

export default sampleNlpQuestions;
