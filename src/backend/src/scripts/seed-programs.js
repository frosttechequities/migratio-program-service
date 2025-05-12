/**
 * Seed Programs Script
 * Populates the database with sample immigration programs for testing
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { Program } = require('../models/program.model');
const { logger } = require('../utils/logger');

// Sample program data
const samplePrograms = [
  {
    programId: 'ca-express-entry',
    name: 'Express Entry',
    countryId: 'ca',
    category: 'work',
    subcategory: 'skilled',
    description: 'Express Entry is Canada\'s flagship immigration program for skilled workers. It manages applications for three federal economic immigration programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class.',
    shortDescription: 'Canada\'s main immigration program for skilled workers',
    officialName: 'Express Entry',
    officialWebsite: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html',
    status: 'active',
    eligibilityCriteria: [
      {
        criterionId: 'age',
        name: 'Age',
        description: 'Points are awarded based on age, with maximum points for ages 20-29',
        category: 'age',
        type: 'points_table',
        isMandatory: true,
        value: 'points_based',
        pointsTable: [
          { condition: { min: 18, max: 19 }, points: 8 },
          { condition: { min: 20, max: 29 }, points: 12 },
          { condition: { min: 30, max: 34 }, points: 10 },
          { condition: { min: 35, max: 39 }, points: 8 },
          { condition: { min: 40, max: 44 }, points: 6 },
          { condition: { min: 45, max: 49 }, points: 4 },
          { condition: { min: 50, max: 54 }, points: 2 },
          { condition: { min: 55, max: 100 }, points: 0 }
        ]
      },
      {
        criterionId: 'education',
        name: 'Education',
        description: 'Points are awarded based on level of education',
        category: 'education',
        type: 'points_table',
        isMandatory: true,
        value: 'points_based',
        pointsTable: [
          { condition: 'high-school', points: 5 },
          { condition: 'certificate', points: 15 },
          { condition: 'diploma', points: 19 },
          { condition: 'associate', points: 21 },
          { condition: 'bachelor', points: 25 },
          { condition: 'master', points: 30 },
          { condition: 'doctorate', points: 30 },
          { condition: 'professional', points: 30 }
        ]
      },
      {
        criterionId: 'work_experience',
        name: 'Work Experience',
        description: 'Points are awarded based on years of skilled work experience',
        category: 'work_experience',
        type: 'points_table',
        isMandatory: true,
        value: 'points_based',
        pointsTable: [
          { condition: { min: 0, max: 0.99 }, points: 0 },
          { condition: { min: 1, max: 2.99 }, points: 9 },
          { condition: { min: 3, max: 4.99 }, points: 11 },
          { condition: { min: 5, max: 100 }, points: 13 }
        ]
      },
      {
        criterionId: 'language_english_reading',
        name: 'English Reading',
        description: 'Points are awarded based on English reading proficiency (CLB)',
        category: 'language',
        type: 'points_table',
        isMandatory: true,
        value: 'points_based',
        pointsTable: [
          { condition: { min: 0, max: 3.99 }, points: 0 },
          { condition: { min: 4, max: 5.99 }, points: 3 },
          { condition: { min: 6, max: 7.99 }, points: 4 },
          { condition: { min: 8, max: 9.99 }, points: 5 },
          { condition: { min: 10, max: 10 }, points: 6 }
        ]
      },
      {
        criterionId: 'language_english_writing',
        name: 'English Writing',
        description: 'Points are awarded based on English writing proficiency (CLB)',
        category: 'language',
        type: 'points_table',
        isMandatory: true,
        value: 'points_based',
        pointsTable: [
          { condition: { min: 0, max: 3.99 }, points: 0 },
          { condition: { min: 4, max: 5.99 }, points: 3 },
          { condition: { min: 6, max: 7.99 }, points: 4 },
          { condition: { min: 8, max: 9.99 }, points: 5 },
          { condition: { min: 10, max: 10 }, points: 6 }
        ]
      },
      {
        criterionId: 'language_english_speaking',
        name: 'English Speaking',
        description: 'Points are awarded based on English speaking proficiency (CLB)',
        category: 'language',
        type: 'points_table',
        isMandatory: true,
        value: 'points_based',
        pointsTable: [
          { condition: { min: 0, max: 3.99 }, points: 0 },
          { condition: { min: 4, max: 5.99 }, points: 3 },
          { condition: { min: 6, max: 7.99 }, points: 4 },
          { condition: { min: 8, max: 9.99 }, points: 5 },
          { condition: { min: 10, max: 10 }, points: 6 }
        ]
      },
      {
        criterionId: 'language_english_listening',
        name: 'English Listening',
        description: 'Points are awarded based on English listening proficiency (CLB)',
        category: 'language',
        type: 'points_table',
        isMandatory: true,
        value: 'points_based',
        pointsTable: [
          { condition: { min: 0, max: 3.99 }, points: 0 },
          { condition: { min: 4, max: 5.99 }, points: 3 },
          { condition: { min: 6, max: 7.99 }, points: 4 },
          { condition: { min: 8, max: 9.99 }, points: 5 },
          { condition: { min: 10, max: 10 }, points: 6 }
        ]
      },
      {
        criterionId: 'financial_proof_of_funds',
        name: 'Proof of Funds',
        description: 'Minimum funds required to support yourself and your family in Canada',
        category: 'financial',
        type: 'minimum',
        isMandatory: true,
        value: 13213,
        unit: 'CAD'
      }
    ],
    pointsSystem: {
      isPointsBased: true,
      passingScore: 67,
      maxPossibleScore: 100,
      categories: [
        {
          name: 'Age',
          maxPoints: 12,
          criteria: [{ criterionId: 'age', maxPoints: 12 }]
        },
        {
          name: 'Education',
          maxPoints: 25,
          criteria: [{ criterionId: 'education', maxPoints: 25 }]
        },
        {
          name: 'Work Experience',
          maxPoints: 15,
          criteria: [{ criterionId: 'work_experience', maxPoints: 15 }]
        },
        {
          name: 'Language',
          maxPoints: 28,
          criteria: [
            { criterionId: 'language_english_reading', maxPoints: 6 },
            { criterionId: 'language_english_writing', maxPoints: 6 },
            { criterionId: 'language_english_speaking', maxPoints: 6 },
            { criterionId: 'language_english_listening', maxPoints: 6 }
          ]
        }
      ]
    },
    details: {
      processingTime: {
        min: 6,
        max: 12,
        average: 8
      },
      applicationFees: [
        {
          name: 'Processing Fee',
          amount: 825,
          currency: 'CAD',
          isRefundable: false
        },
        {
          name: 'Right of Permanent Residence Fee',
          amount: 500,
          currency: 'CAD',
          isRefundable: true
        }
      ],
      totalCost: {
        min: 1325,
        max: 2000,
        currency: 'CAD'
      },
      validityPeriod: {
        value: 5,
        unit: 'years'
      },
      renewalOptions: {
        isRenewable: true,
        maxRenewals: 1,
        renewalRequirements: 'Must maintain residency requirements'
      },
      pathToPermanentResidence: {
        hasPathway: true,
        timeToEligibility: 0,
        requirements: 'This is a direct permanent residence program'
      },
      pathToCitizenship: {
        hasPathway: true,
        timeToEligibility: 36,
        requirements: 'Must be physically present in Canada for at least 1,095 days in the 5 years before applying'
      },
      quotaSystem: {
        hasQuota: true,
        annualQuota: 110000,
        currentAvailability: 'high'
      },
      successRate: {
        value: 75,
        year: 2022,
        source: 'IRCC'
      }
    },
    requiredDocuments: [
      {
        name: 'Passport',
        description: 'Valid passport or travel document',
        isRequired: true
      },
      {
        name: 'Language Test Results',
        description: 'Results from an approved language test (IELTS, CELPIP, TEF, TCF)',
        isRequired: true
      },
      {
        name: 'Educational Credential Assessment',
        description: 'ECA report for education obtained outside Canada',
        isRequired: true
      },
      {
        name: 'Proof of Funds',
        description: 'Bank statements or letter showing sufficient settlement funds',
        isRequired: true
      }
    ],
    benefits: [
      {
        name: 'Permanent Residence',
        description: 'Immediate permanent residence status upon arrival',
        category: 'other'
      },
      {
        name: 'Work Rights',
        description: 'Full work rights in any occupation',
        category: 'work'
      },
      {
        name: 'Healthcare',
        description: 'Access to public healthcare system',
        category: 'healthcare'
      },
      {
        name: 'Education',
        description: 'Access to public education system',
        category: 'education'
      },
      {
        name: 'Social Benefits',
        description: 'Access to social security benefits',
        category: 'social_security'
      }
    ],
    restrictions: [
      {
        name: 'Residency Requirement',
        description: 'Must be physically present in Canada for at least 730 days in 5 years to maintain PR status',
        category: 'other'
      }
    ],
    tags: ['skilled', 'permanent', 'points-based', 'express-entry']
  },
  {
    programId: 'au-skilled-independent-189',
    name: 'Skilled Independent Visa (Subclass 189)',
    countryId: 'au',
    category: 'work',
    subcategory: 'skilled',
    description: 'The Skilled Independent visa is a permanent residence visa for skilled workers who are not sponsored by an employer, a state or territory, or a family member. You must be invited to apply for this visa.',
    shortDescription: 'Australia\'s points-based skilled migration program',
    officialName: 'Skilled Independent Visa (Subclass 189)',
    officialWebsite: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189',
    status: 'active',
    eligibilityCriteria: [
      {
        criterionId: 'age',
        name: 'Age',
        description: 'Must be under 45 years of age at time of invitation',
        category: 'age',
        type: 'maximum',
        isMandatory: true,
        value: 45
      },
      {
        criterionId: 'age_points',
        name: 'Age Points',
        description: 'Points awarded based on age at time of invitation',
        category: 'age',
        type: 'points_table',
        isMandatory: false,
        value: 'points_based',
        pointsTable: [
          { condition: { min: 18, max: 24 }, points: 25 },
          { condition: { min: 25, max: 32 }, points: 30 },
          { condition: { min: 33, max: 39 }, points: 25 },
          { condition: { min: 40, max: 44 }, points: 15 },
          { condition: { min: 45, max: 100 }, points: 0 }
        ]
      },
      {
        criterionId: 'english_proficiency',
        name: 'English Proficiency',
        description: 'Must have competent English (IELTS 6 or equivalent)',
        category: 'language',
        type: 'minimum',
        isMandatory: true,
        value: 6
      },
      {
        criterionId: 'english_points',
        name: 'English Points',
        description: 'Points awarded based on English proficiency level',
        category: 'language',
        type: 'points_table',
        isMandatory: false,
        value: 'points_based',
        pointsTable: [
          { condition: { min: 6, max: 6.99 }, points: 0 }, // Competent
          { condition: { min: 7, max: 7.99 }, points: 10 }, // Proficient
          { condition: { min: 8, max: 10 }, points: 20 } // Superior
        ]
      },
      {
        criterionId: 'skilled_occupation',
        name: 'Skilled Occupation',
        description: 'Occupation must be on the relevant skilled occupation list',
        category: 'work_experience',
        type: 'list',
        isMandatory: true,
        value: ['ANZSCO_list']
      },
      {
        criterionId: 'skills_assessment',
        name: 'Skills Assessment',
        description: 'Must have a positive skills assessment for nominated occupation',
        category: 'work_experience',
        type: 'boolean',
        isMandatory: true,
        value: true
      },
      {
        criterionId: 'work_experience_points',
        name: 'Work Experience Points',
        description: 'Points awarded based on years of skilled work experience',
        category: 'work_experience',
        type: 'points_table',
        isMandatory: false,
        value: 'points_based',
        pointsTable: [
          { condition: { min: 0, max: 2.99 }, points: 0 },
          { condition: { min: 3, max: 4.99 }, points: 5 },
          { condition: { min: 5, max: 7.99 }, points: 10 },
          { condition: { min: 8, max: 10.99 }, points: 15 },
          { condition: { min: 11, max: 100 }, points: 20 }
        ]
      },
      {
        criterionId: 'education_points',
        name: 'Education Points',
        description: 'Points awarded based on highest educational qualification',
        category: 'education',
        type: 'points_table',
        isMandatory: false,
        value: 'points_based',
        pointsTable: [
          { condition: 'doctorate', points: 20 },
          { condition: 'master', points: 15 },
          { condition: 'bachelor', points: 15 },
          { condition: 'diploma', points: 10 },
          { condition: 'trade_qualification', points: 10 }
        ]
      }
    ],
    pointsSystem: {
      isPointsBased: true,
      passingScore: 65,
      maxPossibleScore: 120,
      categories: [
        {
          name: 'Age',
          maxPoints: 30,
          criteria: [{ criterionId: 'age_points', maxPoints: 30 }]
        },
        {
          name: 'English Language',
          maxPoints: 20,
          criteria: [{ criterionId: 'english_points', maxPoints: 20 }]
        },
        {
          name: 'Work Experience',
          maxPoints: 20,
          criteria: [{ criterionId: 'work_experience_points', maxPoints: 20 }]
        },
        {
          name: 'Education',
          maxPoints: 20,
          criteria: [{ criterionId: 'education_points', maxPoints: 20 }]
        }
      ]
    },
    details: {
      processingTime: {
        min: 9,
        max: 18,
        average: 12
      },
      applicationFees: [
        {
          name: 'Base Application Fee',
          amount: 4115,
          currency: 'AUD',
          isRefundable: false
        }
      ],
      totalCost: {
        min: 4115,
        max: 7000,
        currency: 'AUD'
      },
      validityPeriod: {
        value: 5,
        unit: 'years'
      },
      renewalOptions: {
        isRenewable: false,
        maxRenewals: 0,
        renewalRequirements: 'This is a permanent visa'
      },
      pathToPermanentResidence: {
        hasPathway: true,
        timeToEligibility: 0,
        requirements: 'This is a direct permanent residence visa'
      },
      pathToCitizenship: {
        hasPathway: true,
        timeToEligibility: 48,
        requirements: 'Must have been living in Australia on a valid visa for 4 years immediately before applying, including 1 year as a permanent resident'
      },
      quotaSystem: {
        hasQuota: true,
        annualQuota: 16652,
        currentAvailability: 'medium'
      },
      successRate: {
        value: 70,
        year: 2022,
        source: 'Department of Home Affairs'
      }
    },
    requiredDocuments: [
      {
        name: 'Passport',
        description: 'Valid passport or travel document',
        isRequired: true
      },
      {
        name: 'Skills Assessment',
        description: 'Positive skills assessment for your nominated occupation',
        isRequired: true
      },
      {
        name: 'English Test Results',
        description: 'Results from an approved English language test',
        isRequired: true
      },
      {
        name: 'Expression of Interest',
        description: 'Must have submitted an EOI and received an invitation to apply',
        isRequired: true
      }
    ],
    benefits: [
      {
        name: 'Permanent Residence',
        description: 'Permanent residence status upon visa grant',
        category: 'other'
      },
      {
        name: 'Work Rights',
        description: 'Full work rights in any occupation',
        category: 'work'
      },
      {
        name: 'Healthcare',
        description: 'Access to Medicare (public healthcare system)',
        category: 'healthcare'
      },
      {
        name: 'Education',
        description: 'Access to public education system',
        category: 'education'
      },
      {
        name: 'Social Benefits',
        description: 'Access to social security benefits after serving waiting periods',
        category: 'social_security'
      }
    ],
    restrictions: [
      {
        name: 'Initial Entry',
        description: 'Must make initial entry to Australia by the date specified on visa grant',
        category: 'other'
      }
    ],
    tags: ['skilled', 'permanent', 'points-based', 'independent']
  },
  {
    programId: 'uk-skilled-worker',
    name: 'Skilled Worker Visa',
    countryId: 'uk',
    category: 'work',
    subcategory: 'skilled',
    description: 'The Skilled Worker visa allows you to come to or stay in the UK to do an eligible job with an approved employer. This visa has replaced the Tier 2 (General) work visa.',
    shortDescription: 'UK\'s main work visa for skilled workers with a job offer',
    officialName: 'Skilled Worker Visa',
    officialWebsite: 'https://www.gov.uk/skilled-worker-visa',
    status: 'active',
    eligibilityCriteria: [
      {
        criterionId: 'job_offer',
        name: 'Job Offer',
        description: 'Must have a job offer from a UK employer with a valid sponsor license',
        category: 'work_experience',
        type: 'boolean',
        isMandatory: true,
        value: true
      },
      {
        criterionId: 'skill_level',
        name: 'Skill Level',
        description: 'Job must be at RQF level 3 or above (A-level or equivalent)',
        category: 'work_experience',
        type: 'minimum',
        isMandatory: true,
        value: 3
      },
      {
        criterionId: 'salary',
        name: 'Salary',
        description: 'Must meet minimum salary threshold for the occupation',
        category: 'financial',
        type: 'minimum',
        isMandatory: true,
        value: 25600,
        unit: 'GBP'
      },
      {
        criterionId: 'english_language',
        name: 'English Language',
        description: 'Must meet English language requirement at CEFR level B1',
        category: 'language',
        type: 'minimum',
        isMandatory: true,
        value: 4
      },
      {
        criterionId: 'maintenance_funds',
        name: 'Maintenance Funds',
        description: 'Must have at least £1,270 in savings unless exempt',
        category: 'financial',
        type: 'minimum',
        isMandatory: true,
        value: 1270,
        unit: 'GBP'
      }
    ],
    pointsSystem: {
      isPointsBased: true,
      passingScore: 70,
      maxPossibleScore: 90,
      categories: [
        {
          name: 'Mandatory',
          maxPoints: 50,
          criteria: [
            { criterionId: 'job_offer', maxPoints: 20 },
            { criterionId: 'skill_level', maxPoints: 20 },
            { criterionId: 'english_language', maxPoints: 10 }
          ]
        },
        {
          name: 'Salary',
          maxPoints: 20,
          criteria: [{ criterionId: 'salary', maxPoints: 20 }]
        }
      ]
    },
    details: {
      processingTime: {
        min: 3,
        max: 8,
        average: 5
      },
      applicationFees: [
        {
          name: 'Application Fee (up to 3 years)',
          amount: 719,
          currency: 'GBP',
          isRefundable: false
        },
        {
          name: 'Healthcare Surcharge (per year)',
          amount: 624,
          currency: 'GBP',
          isRefundable: false
        }
      ],
      totalCost: {
        min: 2591,
        max: 4000,
        currency: 'GBP'
      },
      validityPeriod: {
        value: 5,
        unit: 'years'
      },
      renewalOptions: {
        isRenewable: true,
        maxRenewals: null,
        renewalRequirements: 'Must still meet all eligibility requirements'
      },
      pathToPermanentResidence: {
        hasPathway: true,
        timeToEligibility: 60,
        requirements: 'Must have lived in the UK for 5 years on this visa'
      },
      pathToCitizenship: {
        hasPathway: true,
        timeToEligibility: 72,
        requirements: 'Must have settled status for 12 months and meet residency requirements'
      },
      quotaSystem: {
        hasQuota: false,
        annualQuota: null,
        currentAvailability: 'high'
      },
      successRate: {
        value: 85,
        year: 2022,
        source: 'UK Home Office'
      }
    },
    requiredDocuments: [
      {
        name: 'Passport',
        description: 'Valid passport or travel document',
        isRequired: true
      },
      {
        name: 'Certificate of Sponsorship',
        description: 'Certificate of Sponsorship from your employer',
        isRequired: true
      },
      {
        name: 'English Test Results',
        description: 'Proof of English language ability at CEFR level B1',
        isRequired: true
      },
      {
        name: 'Bank Statements',
        description: 'Proof of maintenance funds unless exempt',
        isRequired: true
      }
    ],
    benefits: [
      {
        name: 'Work Rights',
        description: 'Can work for your sponsor in the job described in your certificate of sponsorship',
        category: 'work'
      },
      {
        name: 'Secondary Employment',
        description: 'Can take on additional work in certain circumstances',
        category: 'work'
      },
      {
        name: 'Healthcare',
        description: 'Access to National Health Service (NHS) after paying healthcare surcharge',
        category: 'healthcare'
      },
      {
        name: 'Education',
        description: 'Access to public education system',
        category: 'education'
      },
      {
        name: 'Dependants',
        description: 'Can bring dependant family members',
        category: 'family'
      }
    ],
    restrictions: [
      {
        name: 'Job Change',
        description: 'Must apply for a new visa if changing employer',
        category: 'work'
      },
      {
        name: 'Public Funds',
        description: 'No access to public funds',
        category: 'social_security'
      }
    ],
    tags: ['skilled', 'temporary', 'points-based', 'employer-sponsored']
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    logger.info('Connected to MongoDB');
    
    try {
      // Clear existing programs
      await Program.deleteMany({});
      logger.info('Cleared existing programs');
      
      // Insert sample programs
      await Program.insertMany(samplePrograms);
      logger.info(`Inserted ${samplePrograms.length} sample programs`);
      
      // Disconnect from MongoDB
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB');
      
      process.exit(0);
    } catch (error) {
      logger.error('Error seeding programs:', error);
      process.exit(1);
    }
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });
