/**
 * Canada Immigration Programs Data
 *
 * Real-world immigration program data for Canada.
 * Data sourced from Immigration, Refugees and Citizenship Canada (IRCC).
 * Last updated: June 2024
 */

const canadaPrograms = [
  {
    programId: 'ca_express_entry_fsw',
    name: 'Federal Skilled Worker Program',
    country: 'Canada',
    category: 'Skilled Worker',
    description: 'The Federal Skilled Worker Program selects immigrants based on their ability to succeed economically in Canada. Points are awarded for education, work experience, language abilities, age, arranged employment, and adaptability.',
    officialUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/federal-skilled-workers.html',
    streams: [],
    eligibilitySummary: 'You need skilled work experience, meet the minimum language requirements, have sufficient funds, and score at least 67 points on the selection factors.',
    eligibilityCriteria: [
      {
        criterionId: 'work_experience',
        name: 'Skilled Work Experience',
        description: 'At least 1 year of continuous full-time (or equivalent part-time) skilled work experience in the past 10 years in NOC TEER 0, 1, 2, or 3 occupations.',
        type: 'range',
        required: true,
        points: 15,
        min: 1,
        max: 6,
        idealMin: 1,
        idealMax: 6,
        unit: 'years'
      },
      {
        criterionId: 'language',
        name: 'Language Proficiency',
        description: 'Minimum CLB 7 in English or French in all abilities (reading, writing, listening, speaking).',
        type: 'language',
        required: true,
        points: 28,
        languages: ['english', 'french'],
        minLevel: 7,
        maxLevel: 10
      },
      {
        criterionId: 'education',
        name: 'Education',
        description: 'Secondary education or higher, with an Educational Credential Assessment (ECA) if educated outside Canada.',
        type: 'level',
        required: true,
        points: 25,
        levels: [
          { value: 'high_school', label: 'Secondary (high school) diploma', points: 5 },
          { value: 'certificate', label: 'One-year post-secondary credential', points: 15 },
          { value: 'diploma', label: 'Two-year post-secondary credential', points: 19 },
          { value: 'bachelors', label: 'Bachelor\'s degree', points: 21 },
          { value: 'masters', label: 'Master\'s degree', points: 23 },
          { value: 'doctoral', label: 'Doctoral degree', points: 25 }
        ]
      },
      {
        criterionId: 'age',
        name: 'Age',
        description: 'Between 18 and 45 years old, with maximum points for ages 20-29.',
        type: 'range',
        required: true,
        points: 12,
        min: 18,
        max: 45,
        idealMin: 20,
        idealMax: 29,
        unit: 'years'
      },
      {
        criterionId: 'arranged_employment',
        name: 'Arranged Employment',
        description: 'Valid job offer from a Canadian employer.',
        type: 'boolean',
        required: false,
        points: 10
      },
      {
        criterionId: 'adaptability',
        name: 'Adaptability',
        description: 'Factors such as spouse\'s education, previous work in Canada, previous study in Canada, arranged employment, or relatives in Canada.',
        type: 'composite',
        required: false,
        points: 10,
        factors: [
          { id: 'spouse_education', name: 'Spouse\'s education', points: 5 },
          { id: 'previous_work_canada', name: 'Previous work in Canada', points: 5 },
          { id: 'previous_study_canada', name: 'Previous study in Canada', points: 5 },
          { id: 'arranged_employment', name: 'Arranged employment', points: 5 },
          { id: 'relatives_canada', name: 'Relatives in Canada', points: 5 }
        ]
      },
      {
        criterionId: 'settlement_funds',
        name: 'Settlement Funds',
        description: 'Sufficient funds to support yourself and your family after you arrive in Canada (unless you have a valid job offer).',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 14315 },
          { family_size: 2, amount: 17824 },
          { family_size: 3, amount: 21909 },
          { family_size: 4, amount: 26577 },
          { family_size: 5, amount: 30163 },
          { family_size: 6, amount: 34018 },
          { family_size: 7, amount: 37873 }
        ],
        currency: 'CAD'
      }
    ],
    processingTime: {
      min: 6,
      max: 8,
      unit: 'months',
      formatted: '6-8 months',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 825,
      rightOfPermanentResidence: 500,
      total: 1325,
      currency: 'CAD',
      additionalFees: {
        principalApplicant: 825,
        spouse: 825,
        dependentChild: 225
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.75
  },
  {
    programId: 'ca_express_entry_cec',
    name: 'Canadian Experience Class',
    country: 'Canada',
    category: 'Skilled Worker',
    description: 'The Canadian Experience Class is for skilled workers who have Canadian work experience and want to become permanent residents.',
    officialUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/canadian-experience-class.html',
    streams: [],
    eligibilitySummary: 'You need at least 1 year of skilled work experience in Canada, meet the language requirements, and plan to live outside Quebec.',
    eligibilityCriteria: [
      {
        criterionId: 'canadian_work_experience',
        name: 'Canadian Work Experience',
        description: 'At least 1 year of full-time (or equivalent part-time) skilled work experience in Canada in the past 3 years in NOC TEER 0, 1, 2, or 3 occupations.',
        type: 'range',
        required: true,
        points: 40,
        min: 1,
        max: 3,
        idealMin: 1,
        idealMax: 3,
        unit: 'years'
      },
      {
        criterionId: 'language',
        name: 'Language Proficiency',
        description: 'Minimum CLB 7 for NOC TEER 0 or 1 jobs, or CLB 5 for NOC TEER 2 or 3 jobs.',
        type: 'language',
        required: true,
        points: 28,
        languages: ['english', 'french'],
        minLevel: 5,
        maxLevel: 10
      },
      {
        criterionId: 'education',
        name: 'Education',
        description: 'No minimum education requirement, but points are awarded in the Express Entry system.',
        type: 'level',
        required: false,
        points: 25,
        levels: [
          { value: 'high_school', label: 'Secondary (high school) diploma', points: 5 },
          { value: 'certificate', label: 'One-year post-secondary credential', points: 15 },
          { value: 'diploma', label: 'Two-year post-secondary credential', points: 19 },
          { value: 'bachelors', label: 'Bachelor\'s degree', points: 21 },
          { value: 'masters', label: 'Master\'s degree', points: 23 },
          { value: 'doctoral', label: 'Doctoral degree', points: 25 }
        ]
      },
      {
        criterionId: 'intention_to_reside',
        name: 'Intention to Reside',
        description: 'Plan to live outside the province of Quebec.',
        type: 'boolean',
        required: true,
        points: 0,
        country: 'Canada'
      }
    ],
    processingTime: {
      min: 4,
      max: 6,
      unit: 'months',
      formatted: '4-6 months',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 825,
      rightOfPermanentResidence: 500,
      total: 1325,
      currency: 'CAD',
      additionalFees: {
        principalApplicant: 825,
        spouse: 825,
        dependentChild: 225
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.85
  },
  {
    programId: 'ca_express_entry_fstp',
    name: 'Federal Skilled Trades Program',
    country: 'Canada',
    category: 'Skilled Worker',
    description: 'The Federal Skilled Trades Program is for skilled workers who want to become permanent residents based on being qualified in a skilled trade.',
    officialUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/skilled-trades.html',
    streams: [],
    eligibilitySummary: 'You need at least 2 years of full-time work experience in a skilled trade, meet the language requirements, have a job offer or certificate of qualification, and have sufficient funds.',
    eligibilityCriteria: [
      {
        criterionId: 'skilled_trades_experience',
        name: 'Skilled Trades Experience',
        description: 'At least 2 years of full-time (or equivalent part-time) work experience in a skilled trade within the 5 years before applying.',
        type: 'range',
        required: true,
        points: 30,
        min: 2,
        max: 5,
        idealMin: 2,
        idealMax: 5,
        unit: 'years'
      },
      {
        criterionId: 'language',
        name: 'Language Proficiency',
        description: 'Minimum CLB 5 for speaking and listening, and CLB 4 for reading and writing.',
        type: 'language',
        required: true,
        points: 28,
        languages: ['english', 'french'],
        minLevel: 4,
        maxLevel: 10
      },
      {
        criterionId: 'job_offer_or_certificate',
        name: 'Job Offer or Certificate',
        description: 'Either a valid job offer of full-time employment for at least 1 year OR a certificate of qualification in your skilled trade issued by a Canadian provincial, territorial or federal authority.',
        type: 'boolean',
        required: true,
        points: 40
      },
      {
        criterionId: 'settlement_funds',
        name: 'Settlement Funds',
        description: 'Sufficient funds to support yourself and your family after you arrive in Canada (unless you have a valid job offer).',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 14315 },
          { family_size: 2, amount: 17824 },
          { family_size: 3, amount: 21909 },
          { family_size: 4, amount: 26577 },
          { family_size: 5, amount: 30163 },
          { family_size: 6, amount: 34018 },
          { family_size: 7, amount: 37873 }
        ],
        currency: 'CAD'
      }
    ],
    processingTime: {
      min: 4,
      max: 6,
      unit: 'months',
      formatted: '4-6 months',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 825,
      rightOfPermanentResidence: 500,
      total: 1325,
      currency: 'CAD',
      additionalFees: {
        principalApplicant: 825,
        spouse: 825,
        dependentChild: 225
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.7
  },
  {
    programId: 'ca_pnp',
    name: 'Provincial Nominee Program',
    country: 'Canada',
    category: 'Provincial Nomination',
    description: 'The Provincial Nominee Program allows Canadian provinces and territories to nominate individuals who wish to immigrate to Canada and who are interested in settling in a particular province.',
    officialUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html',
    streams: [
      {
        streamId: 'ca_pnp_ontario',
        name: 'Ontario Immigrant Nominee Program (OINP)',
        description: 'Ontario\'s Provincial Nominee Program'
      },
      {
        streamId: 'ca_pnp_bc',
        name: 'British Columbia Provincial Nominee Program (BC PNP)',
        description: 'British Columbia\'s Provincial Nominee Program'
      },
      {
        streamId: 'ca_pnp_alberta',
        name: 'Alberta Advantage Immigration Program (AAIP)',
        description: 'Alberta\'s Provincial Nominee Program'
      }
    ],
    eligibilitySummary: 'Requirements vary by province, but generally include skills, education, work experience, and the ability to contribute to the economy.',
    eligibilityCriteria: [
      {
        criterionId: 'provincial_nomination',
        name: 'Provincial Nomination',
        description: 'Nomination certificate from a Canadian province or territory.',
        type: 'boolean',
        required: true,
        points: 600
      },
      {
        criterionId: 'language',
        name: 'Language Proficiency',
        description: 'Language requirements vary by province and stream, but generally require CLB 5-7.',
        type: 'language',
        required: true,
        points: 28,
        languages: ['english', 'french'],
        minLevel: 5,
        maxLevel: 9
      },
      {
        criterionId: 'education',
        name: 'Education',
        description: 'Education requirements vary by province and stream.',
        type: 'level',
        required: true,
        points: 25,
        levels: [
          { value: 'high_school', label: 'Secondary (high school) diploma', points: 5 },
          { value: 'certificate', label: 'One-year post-secondary credential', points: 15 },
          { value: 'diploma', label: 'Two-year post-secondary credential', points: 19 },
          { value: 'bachelors', label: 'Bachelor\'s degree', points: 21 },
          { value: 'masters', label: 'Master\'s degree', points: 23 },
          { value: 'doctoral', label: 'Doctoral degree', points: 25 }
        ]
      },
      {
        criterionId: 'work_experience',
        name: 'Work Experience',
        description: 'Work experience requirements vary by province and stream.',
        type: 'range',
        required: true,
        points: 15,
        min: 1,
        max: 5,
        idealMin: 1,
        idealMax: 5,
        unit: 'years'
      },
      {
        criterionId: 'settlement_funds',
        name: 'Settlement Funds',
        description: 'Sufficient funds to support yourself and your family after you arrive in Canada (unless you have a valid job offer).',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 14315 },
          { family_size: 2, amount: 17824 },
          { family_size: 3, amount: 21909 },
          { family_size: 4, amount: 26577 },
          { family_size: 5, amount: 30163 },
          { family_size: 6, amount: 34018 },
          { family_size: 7, amount: 37873 }
        ],
        currency: 'CAD'
      }
    ],
    processingTime: {
      min: 15,
      max: 19,
      unit: 'months',
      formatted: '15-19 months',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 825,
      rightOfPermanentResidence: 500,
      total: 1325,
      currency: 'CAD',
      additionalFees: {
        principalApplicant: 825,
        spouse: 825,
        dependentChild: 225,
        provincialFees: {
          ontario: 1500,
          britishColumbia: 1150,
          alberta: 500
        }
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.8
  },
  {
    programId: 'ca_startup_visa',
    name: 'Start-up Visa Program',
    country: 'Canada',
    category: 'Business',
    description: 'The Start-up Visa Program targets immigrant entrepreneurs with the skills and potential to build businesses in Canada that are innovative, can create jobs for Canadians, and can compete on a global scale.',
    officialUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html',
    streams: [],
    eligibilitySummary: 'You need a qualifying business, a letter of support from a designated organization, meet the language requirements, and have sufficient funds.',
    eligibilityCriteria: [
      {
        criterionId: 'qualifying_business',
        name: 'Qualifying Business',
        description: 'A qualifying business that meets the ownership requirements and has been accepted by a designated organization.',
        type: 'boolean',
        required: true,
        points: 40
      },
      {
        criterionId: 'support_letter',
        name: 'Letter of Support',
        description: 'A letter of support from a designated organization (angel investor group, venture capital fund, or business incubator).',
        type: 'boolean',
        required: true,
        points: 40
      },
      {
        criterionId: 'language',
        name: 'Language Proficiency',
        description: 'Minimum CLB 5 in English or French in all abilities (reading, writing, listening, speaking).',
        type: 'language',
        required: true,
        points: 20,
        languages: ['english', 'french'],
        minLevel: 5,
        maxLevel: 10
      },
      {
        criterionId: 'settlement_funds',
        name: 'Settlement Funds',
        description: 'Sufficient funds to support yourself and your family after you arrive in Canada.',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 14315 },
          { family_size: 2, amount: 17824 },
          { family_size: 3, amount: 21909 },
          { family_size: 4, amount: 26577 },
          { family_size: 5, amount: 30163 },
          { family_size: 6, amount: 34018 },
          { family_size: 7, amount: 37873 }
        ],
        currency: 'CAD'
      }
    ],
    processingTime: {
      min: 12,
      max: 16,
      unit: 'months',
      formatted: '12-16 months',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 1575,
      rightOfPermanentResidence: 500,
      total: 2075,
      currency: 'CAD',
      additionalFees: {
        principalApplicant: 1575,
        spouse: 825,
        dependentChild: 225
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.6
  }
];

module.exports = canadaPrograms;
