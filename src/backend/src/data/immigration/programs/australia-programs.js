/**
 * Australia Immigration Programs Data
 * 
 * Real-world immigration program data for Australia.
 * Data sourced from Department of Home Affairs.
 * Last updated: June 2024
 */

const australiaPrograms = [
  {
    programId: 'au_189',
    name: 'Skilled Independent Visa (Subclass 189)',
    country: 'Australia',
    category: 'Skilled Worker',
    description: 'The Skilled Independent visa is a permanent residence visa for skilled workers who are not sponsored by an employer, a state or territory, or a family member. You must be invited to apply for this visa.',
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189',
    streams: [
      {
        streamId: 'au_189_points',
        name: 'Points-tested Stream',
        description: 'For skilled workers who are not sponsored by an employer, a state or territory, or a family member.'
      },
      {
        streamId: 'au_189_nz',
        name: 'New Zealand Stream',
        description: 'For New Zealand citizens who have been living in Australia for at least 5 years.'
      }
    ],
    eligibilitySummary: 'You need to submit an Expression of Interest, be invited to apply, be under 45 years of age, have an occupation on the relevant skilled occupation list, have a suitable skills assessment, meet the points test, and meet health and character requirements.',
    eligibilityCriteria: [
      {
        criterionId: 'age',
        name: 'Age',
        description: 'You must be under 45 years of age when you are invited to apply.',
        type: 'range',
        required: true,
        points: 30,
        min: 18,
        max: 44,
        idealMin: 25,
        idealMax: 32,
        unit: 'years'
      },
      {
        criterionId: 'english',
        name: 'English Language Ability',
        description: 'You must have at least competent English (equivalent to IELTS 6 in each component).',
        type: 'language',
        required: true,
        points: 20,
        languages: ['english'],
        minLevel: 6,
        maxLevel: 9
      },
      {
        criterionId: 'skilled_occupation',
        name: 'Skilled Occupation',
        description: 'Your occupation must be on the relevant skilled occupation list.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'skills_assessment',
        name: 'Skills Assessment',
        description: 'You must have a suitable skills assessment for your occupation.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'work_experience',
        name: 'Skilled Employment',
        description: 'Points for skilled employment in the past 10 years.',
        type: 'range',
        required: false,
        points: 20,
        min: 0,
        max: 10,
        idealMin: 8,
        idealMax: 10,
        unit: 'years'
      },
      {
        criterionId: 'education',
        name: 'Educational Qualification',
        description: 'Points for educational qualifications.',
        type: 'level',
        required: false,
        points: 20,
        levels: [
          { value: 'doctoral', label: 'Doctorate from an Australian educational institution or a Doctorate from another educational institution that is of a recognized standard', points: 20 },
          { value: 'masters', label: 'At least a Bachelor degree from an Australian educational institution or a Bachelor qualification from another educational institution that is of a recognized standard', points: 15 },
          { value: 'diploma', label: 'Diploma or trade qualification completed in Australia', points: 10 },
          { value: 'certificate', label: 'An award or qualification recognized by the relevant assessing authority for your nominated skilled occupation', points: 10 }
        ]
      },
      {
        criterionId: 'australian_study',
        name: 'Australian Study Requirement',
        description: 'You have met the Australian study requirement in the past 4 years.',
        type: 'boolean',
        required: false,
        points: 5
      },
      {
        criterionId: 'specialist_education',
        name: 'Specialist Education Qualification',
        description: 'You have a Masters degree by research or a Doctorate degree from an Australian educational institution that included at least 2 academic years in a relevant field.',
        type: 'boolean',
        required: false,
        points: 10
      },
      {
        criterionId: 'community_language',
        name: 'Credentialled Community Language',
        description: 'You have been accredited at the paraprofessional level or above for interpreting or translating by the National Accreditation Authority for Translators and Interpreters.',
        type: 'boolean',
        required: false,
        points: 5
      },
      {
        criterionId: 'regional_study',
        name: 'Study in Regional Australia',
        description: 'You have at least 1 degree, diploma, or trade qualification from an Australian educational institution that satisfies the Australian study requirement obtained while living and studying in an eligible area of regional Australia.',
        type: 'boolean',
        required: false,
        points: 5
      },
      {
        criterionId: 'partner_skills',
        name: 'Partner Skills',
        description: 'Your partner satisfies the basic requirements for a skilled migration visa, or is an Australian citizen or permanent resident.',
        type: 'boolean',
        required: false,
        points: 10
      },
      {
        criterionId: 'professional_year',
        name: 'Professional Year',
        description: 'You have completed a Professional Year in Australia in the past 4 years.',
        type: 'boolean',
        required: false,
        points: 5
      }
    ],
    processingTime: {
      min: 9,
      max: 12,
      unit: 'months',
      formatted: '9-12 months',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 4640,
      total: 4640,
      currency: 'AUD',
      additionalFees: {
        principalApplicant: 4640,
        spouse: 2320,
        dependentChild: 1160
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.7
  },
  {
    programId: 'au_190',
    name: 'Skilled Nominated Visa (Subclass 190)',
    country: 'Australia',
    category: 'Skilled Worker',
    description: 'The Skilled Nominated visa is a permanent residence visa for skilled workers who are nominated by an Australian state or territory government agency. You must be invited to apply for this visa.',
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190',
    streams: [],
    eligibilitySummary: 'You need to submit an Expression of Interest, be invited to apply, be nominated by a state or territory government, be under 45 years of age, have an occupation on the relevant skilled occupation list, have a suitable skills assessment, meet the points test, and meet health and character requirements.',
    eligibilityCriteria: [
      {
        criterionId: 'state_nomination',
        name: 'State or Territory Nomination',
        description: 'You must be nominated by a state or territory government agency.',
        type: 'boolean',
        required: true,
        points: 5
      },
      {
        criterionId: 'age',
        name: 'Age',
        description: 'You must be under 45 years of age when you are invited to apply.',
        type: 'range',
        required: true,
        points: 30,
        min: 18,
        max: 44,
        idealMin: 25,
        idealMax: 32,
        unit: 'years'
      },
      {
        criterionId: 'english',
        name: 'English Language Ability',
        description: 'You must have at least competent English (equivalent to IELTS 6 in each component).',
        type: 'language',
        required: true,
        points: 20,
        languages: ['english'],
        minLevel: 6,
        maxLevel: 9
      },
      {
        criterionId: 'skilled_occupation',
        name: 'Skilled Occupation',
        description: 'Your occupation must be on the relevant skilled occupation list.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'skills_assessment',
        name: 'Skills Assessment',
        description: 'You must have a suitable skills assessment for your occupation.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'work_experience',
        name: 'Skilled Employment',
        description: 'Points for skilled employment in the past 10 years.',
        type: 'range',
        required: false,
        points: 20,
        min: 0,
        max: 10,
        idealMin: 8,
        idealMax: 10,
        unit: 'years'
      },
      {
        criterionId: 'education',
        name: 'Educational Qualification',
        description: 'Points for educational qualifications.',
        type: 'level',
        required: false,
        points: 20,
        levels: [
          { value: 'doctoral', label: 'Doctorate from an Australian educational institution or a Doctorate from another educational institution that is of a recognized standard', points: 20 },
          { value: 'masters', label: 'At least a Bachelor degree from an Australian educational institution or a Bachelor qualification from another educational institution that is of a recognized standard', points: 15 },
          { value: 'diploma', label: 'Diploma or trade qualification completed in Australia', points: 10 },
          { value: 'certificate', label: 'An award or qualification recognized by the relevant assessing authority for your nominated skilled occupation', points: 10 }
        ]
      }
    ],
    processingTime: {
      min: 6,
      max: 9,
      unit: 'months',
      formatted: '6-9 months',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 4640,
      total: 4640,
      currency: 'AUD',
      additionalFees: {
        principalApplicant: 4640,
        spouse: 2320,
        dependentChild: 1160
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.75
  },
  {
    programId: 'au_491',
    name: 'Skilled Work Regional (Provisional) Visa (Subclass 491)',
    country: 'Australia',
    category: 'Skilled Worker',
    description: 'The Skilled Work Regional (Provisional) visa is for skilled workers who want to live and work in regional Australia. This is a provisional visa that provides a pathway to permanent residence.',
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-provisional-491',
    streams: [
      {
        streamId: 'au_491_state',
        name: 'State or Territory Nominated',
        description: 'For skilled workers who are nominated by a state or territory government agency.'
      },
      {
        streamId: 'au_491_family',
        name: 'Family Sponsored',
        description: 'For skilled workers who are sponsored by an eligible family member living in a designated regional area.'
      }
    ],
    eligibilitySummary: 'You need to submit an Expression of Interest, be invited to apply, be nominated by a state or territory government or sponsored by an eligible family member, be under 45 years of age, have an occupation on the relevant skilled occupation list, have a suitable skills assessment, meet the points test, and meet health and character requirements.',
    eligibilityCriteria: [
      {
        criterionId: 'regional_nomination',
        name: 'Regional Nomination or Family Sponsorship',
        description: 'You must be nominated by a state or territory government agency or sponsored by an eligible family member living in a designated regional area.',
        type: 'boolean',
        required: true,
        points: 15
      },
      {
        criterionId: 'age',
        name: 'Age',
        description: 'You must be under 45 years of age when you are invited to apply.',
        type: 'range',
        required: true,
        points: 30,
        min: 18,
        max: 44,
        idealMin: 25,
        idealMax: 32,
        unit: 'years'
      },
      {
        criterionId: 'english',
        name: 'English Language Ability',
        description: 'You must have at least competent English (equivalent to IELTS 6 in each component).',
        type: 'language',
        required: true,
        points: 20,
        languages: ['english'],
        minLevel: 6,
        maxLevel: 9
      },
      {
        criterionId: 'skilled_occupation',
        name: 'Skilled Occupation',
        description: 'Your occupation must be on the relevant skilled occupation list.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'skills_assessment',
        name: 'Skills Assessment',
        description: 'You must have a suitable skills assessment for your occupation.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'work_experience',
        name: 'Skilled Employment',
        description: 'Points for skilled employment in the past 10 years.',
        type: 'range',
        required: false,
        points: 20,
        min: 0,
        max: 10,
        idealMin: 8,
        idealMax: 10,
        unit: 'years'
      },
      {
        criterionId: 'education',
        name: 'Educational Qualification',
        description: 'Points for educational qualifications.',
        type: 'level',
        required: false,
        points: 20,
        levels: [
          { value: 'doctoral', label: 'Doctorate from an Australian educational institution or a Doctorate from another educational institution that is of a recognized standard', points: 20 },
          { value: 'masters', label: 'At least a Bachelor degree from an Australian educational institution or a Bachelor qualification from another educational institution that is of a recognized standard', points: 15 },
          { value: 'diploma', label: 'Diploma or trade qualification completed in Australia', points: 10 },
          { value: 'certificate', label: 'An award or qualification recognized by the relevant assessing authority for your nominated skilled occupation', points: 10 }
        ]
      }
    ],
    processingTime: {
      min: 6,
      max: 9,
      unit: 'months',
      formatted: '6-9 months',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 4240,
      total: 4240,
      currency: 'AUD',
      additionalFees: {
        principalApplicant: 4240,
        spouse: 2120,
        dependentChild: 1060
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.8
  },
  {
    programId: 'au_188',
    name: 'Business Innovation and Investment (Provisional) Visa (Subclass 188)',
    country: 'Australia',
    category: 'Business',
    description: 'The Business Innovation and Investment (Provisional) visa is for people who want to own and manage a business in Australia, make an investment in Australia, or undertake entrepreneurial activity in Australia.',
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188',
    streams: [
      {
        streamId: 'au_188a',
        name: 'Business Innovation Stream',
        description: 'For people with business skills who want to establish, develop and manage a new or existing business in Australia.'
      },
      {
        streamId: 'au_188b',
        name: 'Investor Stream',
        description: 'For people who want to make a designated investment in an Australian state or territory and maintain business and investment activity in Australia.'
      },
      {
        streamId: 'au_188c',
        name: 'Significant Investor Stream',
        description: 'For people who are willing to invest at least AUD 5 million in complying investments in Australia.'
      },
      {
        streamId: 'au_188e',
        name: 'Entrepreneur Stream',
        description: 'For people who want to undertake entrepreneurial activity in Australia.'
      }
    ],
    eligibilitySummary: 'You need to submit an Expression of Interest, be invited to apply, be nominated by a state or territory government, be under 55 years of age (unless your business or investment activity is of exceptional economic benefit), and meet the requirements of the specific stream you are applying for.',
    eligibilityCriteria: [
      {
        criterionId: 'state_nomination',
        name: 'State or Territory Nomination',
        description: 'You must be nominated by a state or territory government agency.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'age',
        name: 'Age',
        description: 'You must be under 55 years of age when you are invited to apply, unless your business or investment activity is of exceptional economic benefit.',
        type: 'range',
        required: true,
        points: 0,
        min: 18,
        max: 54,
        idealMin: 18,
        idealMax: 54,
        unit: 'years'
      },
      {
        criterionId: 'business_innovation_points',
        name: 'Business Innovation Points Test',
        description: 'You must score at least 65 points in the Business Innovation points test (for Business Innovation stream).',
        type: 'range',
        required: false,
        points: 0,
        min: 65,
        max: 130,
        idealMin: 65,
        idealMax: 130,
        unit: 'points'
      },
      {
        criterionId: 'investor_points',
        name: 'Investor Points Test',
        description: 'You must score at least 65 points in the Investor points test (for Investor stream).',
        type: 'range',
        required: false,
        points: 0,
        min: 65,
        max: 130,
        idealMin: 65,
        idealMax: 130,
        unit: 'points'
      },
      {
        criterionId: 'business_experience',
        name: 'Business Experience',
        description: 'You must have a successful business career and a genuine and realistic commitment to establish a business in Australia (for Business Innovation stream).',
        type: 'boolean',
        required: false,
        points: 0
      },
      {
        criterionId: 'business_turnover',
        name: 'Business Turnover',
        description: 'Your business must have had an annual turnover of at least AUD 500,000 in at least 2 of the 4 fiscal years before you are invited to apply (for Business Innovation stream).',
        type: 'money',
        required: false,
        points: 0,
        amounts: [
          { family_size: 1, amount: 500000 }
        ],
        currency: 'AUD'
      },
      {
        criterionId: 'business_assets',
        name: 'Business and Personal Assets',
        description: 'You and your spouse must have net business and personal assets of at least AUD 800,000 that can be legally transferred to Australia within 2 years of the visa being granted (for Business Innovation stream).',
        type: 'money',
        required: false,
        points: 0,
        amounts: [
          { family_size: 1, amount: 800000 }
        ],
        currency: 'AUD'
      },
      {
        criterionId: 'investor_assets',
        name: 'Net Assets',
        description: 'You and your spouse must have net assets of at least AUD 2.25 million that can be legally transferred to Australia within 2 years of the visa being granted (for Investor stream).',
        type: 'money',
        required: false,
        points: 0,
        amounts: [
          { family_size: 1, amount: 2250000 }
        ],
        currency: 'AUD'
      },
      {
        criterionId: 'investment_experience',
        name: 'Investment Experience',
        description: 'You must have at least 3 years of experience managing investments of at least AUD 1.5 million (for Investor stream).',
        type: 'boolean',
        required: false,
        points: 0
      },
      {
        criterionId: 'designated_investment',
        name: 'Designated Investment',
        description: 'You must make a designated investment of at least AUD 1.5 million in an Australian state or territory and maintain it for at least 4 years (for Investor stream).',
        type: 'money',
        required: false,
        points: 0,
        amounts: [
          { family_size: 1, amount: 1500000 }
        ],
        currency: 'AUD'
      },
      {
        criterionId: 'significant_investment',
        name: 'Significant Investment',
        description: 'You must make a complying significant investment of at least AUD 5 million in Australia and maintain it for at least 4 years (for Significant Investor stream).',
        type: 'money',
        required: false,
        points: 0,
        amounts: [
          { family_size: 1, amount: 5000000 }
        ],
        currency: 'AUD'
      },
      {
        criterionId: 'entrepreneur_funding',
        name: 'Entrepreneur Funding',
        description: 'You must have a funding agreement of at least AUD 200,000 from a specified entity to undertake an entrepreneurial activity that is an innovative idea that will lead to the commercialization of a product or service in Australia, or the development of an enterprise or business in Australia (for Entrepreneur stream).',
        type: 'money',
        required: false,
        points: 0,
        amounts: [
          { family_size: 1, amount: 200000 }
        ],
        currency: 'AUD'
      },
      {
        criterionId: 'english',
        name: 'English Language Ability',
        description: 'You must have at least vocational English (equivalent to IELTS 5 in each component).',
        type: 'language',
        required: true,
        points: 0,
        languages: ['english'],
        minLevel: 5,
        maxLevel: 9
      }
    ],
    processingTime: {
      min: 15,
      max: 24,
      unit: 'months',
      formatted: '15-24 months',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 6240,
      total: 6240,
      currency: 'AUD',
      additionalFees: {
        principalApplicant: 6240,
        spouse: 3120,
        dependentChild: 1560
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.65
  },
  {
    programId: 'au_500',
    name: 'Student Visa (Subclass 500)',
    country: 'Australia',
    category: 'Study',
    description: 'The Student visa allows you to stay in Australia to study full-time in a recognized education institution.',
    officialUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
    streams: [],
    eligibilitySummary: 'You need to be enrolled in a course of study in Australia, have health insurance, meet the genuine temporary entrant requirement, and meet health and character requirements.',
    eligibilityCriteria: [
      {
        criterionId: 'enrollment',
        name: 'Course Enrollment',
        description: 'You must be enrolled in a course of study in Australia.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'health_insurance',
        name: 'Health Insurance',
        description: 'You must have adequate health insurance while in Australia.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'genuine_temporary_entrant',
        name: 'Genuine Temporary Entrant',
        description: 'You must be a genuine temporary entrant.',
        type: 'boolean',
        required: true,
        points: 0
      },
      {
        criterionId: 'english',
        name: 'English Language Ability',
        description: 'You must have sufficient English language ability for your course.',
        type: 'language',
        required: true,
        points: 0,
        languages: ['english'],
        minLevel: 5.5,
        maxLevel: 9
      },
      {
        criterionId: 'financial_capacity',
        name: 'Financial Capacity',
        description: 'You must have sufficient funds to cover your tuition fees, living costs, and travel expenses.',
        type: 'money',
        required: true,
        points: 0,
        amounts: [
          { family_size: 1, amount: 21041 }
        ],
        currency: 'AUD'
      }
    ],
    processingTime: {
      min: 1,
      max: 3,
      unit: 'months',
      formatted: '1-3 months',
      lastUpdated: new Date('2024-06-01')
    },
    fees: {
      application: 710,
      total: 710,
      currency: 'AUD',
      additionalFees: {
        principalApplicant: 710,
        spouse: 710,
        dependentChild: 355
      },
      lastUpdated: new Date('2024-06-01')
    },
    successRate: 0.85
  }
];

module.exports = australiaPrograms;
