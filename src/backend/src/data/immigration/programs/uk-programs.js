/**
 * UK Immigration Programs Data
 *
 * Real-world immigration program data for the United Kingdom.
 * Data sourced from UK Visas and Immigration.
 * Last updated: June 2024
 */

const ukPrograms = [
  {
    programId: 'uk_skilled_worker',
    name: 'Skilled Worker Visa',
    country: 'United Kingdom',
    category: 'Skilled Worker',
    description: 'The Skilled Worker visa allows you to come to or stay in the UK to do an eligible job with an approved employer. This visa has replaced the Tier 2 (General) work visa.',
    officialUrl: 'https://www.gov.uk/skilled-worker-visa',
    streams: [],
    eligibilitySummary: 'You need a job offer from an approved UK employer, the job must be at an appropriate skill level, you must speak English, and the salary must meet the minimum threshold.',
    eligibilityCriteria: [
      {
        criterionId: 'job_offer',
        name: 'Job Offer',
        description: 'You must have a job offer from a UK employer who is a licensed sponsor.',
        type: 'boolean',
        required: true,
        points: 20
      },
      {
        criterionId: 'job_skill_level',
        name: 'Job Skill Level',
        description: 'The job must be at an appropriate skill level (RQF 3 or above).',
        type: 'boolean',
        required: true,
        points: 20
      },
      {
        criterionId: 'english',
        name: 'English Language',
        description: 'You must be able to speak, read, write and understand English to at least CEFR level B1 (equivalent to IELTS 4.0).',
        type: 'language',
        required: true,
        points: 10,
        languages: ['english'],
        minLevel: 4,
        maxLevel: 9
      },
      {
        criterionId: 'salary',
        name: 'Salary',
        description: 'Your salary must meet the minimum threshold (generally £26,200 per year or the going rate for the job, whichever is higher).',
        type: 'money',
        required: true,
        points: 20,
        amounts: [
          { family_size: 1, amount: 26200 }
        ],
        currency: 'GBP'
      },
      {
        criterionId: 'healthcare_surcharge',
        name: 'Healthcare Surcharge',
        description: 'You must pay the healthcare surcharge as part of your application.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'maintenance_funds',
        name: 'Maintenance Funds',
        description: 'You must have at least £1,270 in your bank account to show you can support yourself in the UK (unless you\'re exempt).',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 1270 }
        ],
        currency: 'GBP'
      }
    ],
    processingTime: {
      min: 3,
      max: 8,
      unit: 'weeks',
      formatted: '3-8 weeks',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 719,
      healthcareSurcharge: 1035,
      total: 1754,
      currency: 'GBP',
      additionalFees: {
        principalApplicant: 719,
        spouse: 719,
        dependentChild: 719,
        healthcareSurcharge: 1035
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.9
  },
  {
    programId: 'uk_global_talent',
    name: 'Global Talent Visa',
    country: 'United Kingdom',
    category: 'Skilled Worker',
    description: 'The Global Talent visa is for people who can show they have exceptional talent or exceptional promise in the fields of science, engineering, humanities, medicine, digital technology, arts and culture, or academic research.',
    officialUrl: 'https://www.gov.uk/global-talent',
    streams: [
      {
        streamId: 'uk_global_talent_science',
        name: 'Science, Engineering, Humanities and Medicine',
        description: 'For talented individuals in science, engineering, humanities and medicine.'
      },
      {
        streamId: 'uk_global_talent_digital',
        name: 'Digital Technology',
        description: 'For talented individuals in digital technology.'
      },
      {
        streamId: 'uk_global_talent_arts',
        name: 'Arts and Culture',
        description: 'For talented individuals in arts and culture.'
      }
    ],
    eligibilitySummary: 'You need to be endorsed by a recognized UK body as a leader or potential leader in your field.',
    eligibilityCriteria: [
      {
        criterionId: 'endorsement',
        name: 'Endorsement',
        description: 'You must be endorsed by a recognized UK body as a leader (exceptional talent) or potential leader (exceptional promise) in your field.',
        type: 'boolean',
        required: true,
        points: 70
      },
      {
        criterionId: 'healthcare_surcharge',
        name: 'Healthcare Surcharge',
        description: 'You must pay the healthcare surcharge as part of your application.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'maintenance_funds',
        name: 'Maintenance Funds',
        description: 'You must have at least £1,270 in your bank account to show you can support yourself in the UK (unless you\'re exempt).',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 1270 }
        ],
        currency: 'GBP'
      }
    ],
    processingTime: {
      min: 3,
      max: 8,
      unit: 'weeks',
      formatted: '3-8 weeks',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 716,
      endorsement: 532,
      healthcareSurcharge: 1035,
      total: 2283,
      currency: 'GBP',
      additionalFees: {
        principalApplicant: 716,
        endorsement: 532,
        spouse: 716,
        dependentChild: 716,
        healthcareSurcharge: 1035
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.7
  },
  {
    programId: 'uk_startup',
    name: 'Start-up Visa',
    country: 'United Kingdom',
    category: 'Business',
    description: 'The Start-up visa is for people who want to establish a business in the UK for the first time. You must be endorsed by an approved body that is either a UK higher education institution or a business organization that supports UK entrepreneurs.',
    officialUrl: 'https://www.gov.uk/start-up-visa',
    streams: [],
    eligibilitySummary: 'You need to be endorsed by an approved body, have a genuine and viable business idea, and meet the English language requirement.',
    eligibilityCriteria: [
      {
        criterionId: 'endorsement',
        name: 'Endorsement',
        description: 'You must be endorsed by an approved body that is either a UK higher education institution or a business organization that supports UK entrepreneurs.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'business_idea',
        name: 'Business Idea',
        description: 'Your business idea must be innovative, viable and scalable.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'english',
        name: 'English Language',
        description: 'You must be able to speak, read, write and understand English to at least CEFR level B2 (equivalent to IELTS 5.5).',
        type: 'language',
        required: true,
        points: 0,
        languages: ['english'],
        minLevel: 5.5,
        maxLevel: 9
      },
      {
        criterionId: 'healthcare_surcharge',
        name: 'Healthcare Surcharge',
        description: 'You must pay the healthcare surcharge as part of your application.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'maintenance_funds',
        name: 'Maintenance Funds',
        description: 'You must have at least £1,270 in your bank account to show you can support yourself in the UK.',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 1270 }
        ],
        currency: 'GBP'
      }
    ],
    processingTime: {
      min: 3,
      max: 8,
      unit: 'weeks',
      formatted: '3-8 weeks',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 378,
      healthcareSurcharge: 1035,
      total: 1413,
      currency: 'GBP',
      additionalFees: {
        principalApplicant: 378,
        spouse: 378,
        dependentChild: 378,
        healthcareSurcharge: 1035
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.75
  },
  {
    programId: 'uk_innovator_founder',
    name: 'Innovator Founder Visa',
    country: 'United Kingdom',
    category: 'Business',
    description: 'The Innovator Founder visa is for experienced businesspeople who want to establish a business in the UK. You must be endorsed by an approved body.',
    officialUrl: 'https://www.gov.uk/innovator-founder-visa',
    streams: [],
    eligibilitySummary: 'You need to be endorsed by an approved body, have a genuine and viable business idea, have at least £50,000 in investment funds, and meet the English language requirement.',
    eligibilityCriteria: [
      {
        criterionId: 'endorsement',
        name: 'Endorsement',
        description: 'You must be endorsed by an approved body.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'business_idea',
        name: 'Business Idea',
        description: 'Your business idea must be innovative, viable and scalable.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'investment_funds',
        name: 'Investment Funds',
        description: 'You must have at least £50,000 in investment funds.',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 50000 }
        ],
        currency: 'GBP'
      },
      {
        criterionId: 'english',
        name: 'English Language',
        description: 'You must be able to speak, read, write and understand English to at least CEFR level B2 (equivalent to IELTS 5.5).',
        type: 'language',
        required: true,
        points: 0,
        languages: ['english'],
        minLevel: 5.5,
        maxLevel: 9
      },
      {
        criterionId: 'healthcare_surcharge',
        name: 'Healthcare Surcharge',
        description: 'You must pay the healthcare surcharge as part of your application.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'maintenance_funds',
        name: 'Maintenance Funds',
        description: 'You must have at least £1,270 in your bank account to show you can support yourself in the UK.',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 1270 }
        ],
        currency: 'GBP'
      }
    ],
    processingTime: {
      min: 3,
      max: 8,
      unit: 'weeks',
      formatted: '3-8 weeks',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 1036,
      healthcareSurcharge: 1035,
      total: 2071,
      currency: 'GBP',
      additionalFees: {
        principalApplicant: 1036,
        spouse: 1036,
        dependentChild: 1036,
        healthcareSurcharge: 1035
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.65
  },
  {
    programId: 'uk_student',
    name: 'Student Visa',
    country: 'United Kingdom',
    category: 'Study',
    description: 'The Student visa is for people who want to study in the UK at a registered education provider. This visa has replaced the Tier 4 (General) student visa.',
    officialUrl: 'https://www.gov.uk/student-visa',
    streams: [],
    eligibilitySummary: 'You need an unconditional offer from a registered education provider, meet the English language requirement, have enough money to support yourself, and have consent from your parents if you\'re under 18.',
    eligibilityCriteria: [
      {
        criterionId: 'course_offer',
        name: 'Course Offer',
        description: 'You must have an unconditional offer of a place on a course from a licensed student sponsor.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'english',
        name: 'English Language',
        description: 'You must be able to speak, read, write and understand English to the required level for your course.',
        type: 'language',
        required: true,
        points: 0,
        languages: ['english'],
        minLevel: 5.5,
        maxLevel: 9
      },
      {
        criterionId: 'financial_requirement',
        name: 'Financial Requirement',
        description: 'You must have enough money to pay for your course and support yourself in the UK.',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 1334 }
        ],
        currency: 'GBP'
      },
      {
        criterionId: 'healthcare_surcharge',
        name: 'Healthcare Surcharge',
        description: 'You must pay the healthcare surcharge as part of your application.',
        type: 'boolean',
        required: true,
        points: 0
      }
    ],
    processingTime: {
      min: 3,
      max: 8,
      unit: 'weeks',
      formatted: '3-8 weeks',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 363,
      healthcareSurcharge: 470,
      total: 833,
      currency: 'GBP',
      additionalFees: {
        principalApplicant: 363,
        spouse: 363,
        dependentChild: 363,
        healthcareSurcharge: 470
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.9
  }
];

module.exports = ukPrograms;
