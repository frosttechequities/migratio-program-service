const mongoose = require('mongoose');

/**
 * Schema for age points in points-based immigration systems
 */
const AgePointsSchema = new mongoose.Schema({
  ageRange: {
    min: Number,
    max: Number
  },
  points: Number,
  description: String
}, { _id: false });

/**
 * Schema for education points in points-based immigration systems
 */
const EducationPointsSchema = new mongoose.Schema({
  level: String,
  points: Number,
  description: String
}, { _id: false });

/**
 * Schema for language points in points-based immigration systems
 */
const LanguagePointsSchema = new mongoose.Schema({
  level: String,
  points: Number,
  description: String,
  testEquivalence: {
    type: Map,
    of: String
  }
}, { _id: false });

/**
 * Schema for work experience points in points-based immigration systems
 */
const ExperiencePointsSchema = new mongoose.Schema({
  duration: {
    min: Number,
    max: Number,
    unit: {
      type: String,
      enum: ['months', 'years']
    }
  },
  points: Number,
  description: String
}, { _id: false });

/**
 * Schema for other factors in points-based immigration systems
 */
const OtherFactorSchema = new mongoose.Schema({
  name: String,
  points: Number,
  description: String
}, { _id: false });

/**
 * Schema for eligibility criteria in immigration programs
 */
const EligibilityCriteriaSchema = new mongoose.Schema({
  ageRequirements: {
    minAge: Number,
    maxAge: Number,
    description: String
  },
  educationRequirements: {
    minimumLevel: String,
    description: String,
    equivalencyAssessment: Boolean,
    acceptedCredentials: [String]
  },
  languageRequirements: {
    languages: [{
      language: String,
      minimumLevel: String,
      testOptions: [{
        testName: String,
        minimumScore: String
      }]
    }],
    description: String
  },
  workExperienceRequirements: {
    minimumExperience: {
      duration: Number,
      unit: {
        type: String,
        enum: ['months', 'years']
      }
    },
    relevantOccupations: [String],
    skillLevel: String,
    description: String
  },
  financialRequirements: {
    amount: Number,
    currency: String,
    description: String
  },
  otherRequirements: [{
    name: String,
    description: String,
    mandatory: Boolean
  }]
}, { _id: false });

/**
 * Schema for points system in immigration programs
 */
const PointsSystemSchema = new mongoose.Schema({
  minimumPoints: Number,
  competitivePoints: Number,
  maximumPoints: Number,
  agePoints: [AgePointsSchema],
  educationPoints: [EducationPointsSchema],
  languagePoints: [LanguagePointsSchema],
  experiencePoints: [ExperiencePointsSchema],
  otherFactors: [OtherFactorSchema],
  description: String
}, { _id: false });

/**
 * Schema for processing information in immigration programs
 */
const ProcessingInfoSchema = new mongoose.Schema({
  standardProcessing: {
    duration: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years']
      }
    },
    description: String
  },
  expeditedOption: {
    available: Boolean,
    duration: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months']
      }
    },
    additionalFee: {
      amount: Number,
      currency: String
    },
    description: String
  },
  successRate: {
    rate: String,
    description: String
  },
  annualQuota: {
    quota: String,
    description: String
  },
  keySuccessFactors: [String]
}, { _id: false });

/**
 * Schema for application cost in immigration programs
 */
const ApplicationCostSchema = new mongoose.Schema({
  primaryApplicant: {
    amount: Number,
    currency: String,
    description: String
  },
  dependents: [{
    type: String,
    amount: Number,
    currency: String,
    description: String
  }],
  additionalFees: [{
    name: String,
    amount: Number,
    currency: String,
    description: String
  }],
  totalEstimate: {
    minAmount: Number,
    maxAmount: Number,
    currency: String,
    description: String
  }
}, { _id: false });

/**
 * Schema for document requirements in immigration programs
 */
const DocumentRequirementsSchema = new mongoose.Schema({
  identityDocuments: [{
    name: String,
    required: Boolean,
    description: String
  }],
  educationalDocuments: [{
    name: String,
    required: Boolean,
    description: String
  }],
  professionalDocuments: [{
    name: String,
    required: Boolean,
    description: String
  }],
  financialDocuments: [{
    name: String,
    required: Boolean,
    description: String
  }],
  medicalDocuments: [{
    name: String,
    required: Boolean,
    description: String
  }],
  otherDocuments: [{
    name: String,
    required: Boolean,
    description: String
  }],
  translationRequirements: String,
  authenticationRequirements: String
}, { _id: false });

/**
 * Schema for immigration programs
 */
const ImmigrationProgramSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    index: true
  },
  region: {
    type: String,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  alternateNames: [String],
  type: {
    type: String,
    enum: [
      'Skilled Worker',
      'Family Sponsorship',
      'Business/Investor',
      'Humanitarian',
      'Student',
      'Temporary Worker',
      'Provincial/Regional',
      'Other'
    ]
  },
  subtype: String,
  permanentResidency: {
    type: Boolean,
    default: false
  },
  purpose: String,
  overview: String,
  eligibilityCriteria: EligibilityCriteriaSchema,
  pointsSystem: PointsSystemSchema,
  processingInfo: ProcessingInfoSchema,
  applicationCost: ApplicationCostSchema,
  documentRequirements: DocumentRequirementsSchema,
  pathToPR: {
    available: Boolean,
    timeline: String,
    requirements: String,
    description: String
  },
  pathToCitizenship: {
    timeline: String,
    requirements: String,
    description: String
  },
  officialWebsite: String,
  applicationProcess: [{
    step: Number,
    name: String,
    description: String,
    estimatedTime: String,
    tips: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataSource: {
    name: String,
    url: String,
    lastChecked: Date
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
ImmigrationProgramSchema.index({ country: 1, name: 1 }, { unique: true });
ImmigrationProgramSchema.index({ type: 1 });
ImmigrationProgramSchema.index({ 'eligibilityCriteria.ageRequirements.minAge': 1, 'eligibilityCriteria.ageRequirements.maxAge': 1 });
ImmigrationProgramSchema.index({ 'pointsSystem.minimumPoints': 1 });
ImmigrationProgramSchema.index({ permanentResidency: 1 });
ImmigrationProgramSchema.index({ active: 1 });

module.exports = mongoose.model('ImmigrationProgram', ImmigrationProgramSchema);
