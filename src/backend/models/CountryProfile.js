const mongoose = require('mongoose');

/**
 * Schema for immigration statistics in country profiles
 */
const ImmigrationStatisticsSchema = new mongoose.Schema({
  totalImmigrants: {
    count: Number,
    year: Number,
    percentOfPopulation: Number,
    source: String
  },
  annualImmigration: {
    count: Number,
    year: Number,
    changeFromPreviousYear: Number,
    source: String
  },
  topSourceCountries: [{
    country: String,
    percentage: Number
  }],
  skillLevelBreakdown: [{
    category: String,
    percentage: Number
  }],
  visaApprovalRates: [{
    visaType: String,
    approvalRate: Number,
    year: Number
  }]
}, { _id: false });

/**
 * Schema for immigration system overview in country profiles
 */
const ImmigrationSystemSchema = new mongoose.Schema({
  systemType: {
    type: String,
    enum: ['Points-based', 'Employer-sponsored', 'Hybrid', 'Quota-based', 'Other']
  },
  keyFeatures: [String],
  governingBody: {
    name: String,
    website: String
  },
  officialLanguages: [String],
  requiredLanguageProficiency: {
    description: String,
    testingOptions: [{
      testName: String,
      minimumScore: String,
      website: String
    }]
  }
}, { _id: false });

/**
 * Schema for citizenship information in country profiles
 */
const CitizenshipInfoSchema = new mongoose.Schema({
  residencyRequirement: {
    years: Number,
    description: String
  },
  dualCitizenshipAllowed: Boolean,
  languageRequirement: {
    required: Boolean,
    description: String
  },
  citizenshipTest: {
    required: Boolean,
    description: String
  },
  oathCeremony: {
    required: Boolean,
    description: String
  },
  fees: {
    amount: Number,
    currency: String
  },
  processingTime: String,
  additionalRequirements: [String]
}, { _id: false });

/**
 * Schema for settlement information in country profiles
 */
const SettlementInfoSchema = new mongoose.Schema({
  costOfLiving: {
    description: String,
    housingCosts: {
      rental: {
        oneBedroom: {
          cityCenter: {
            amount: Number,
            currency: String
          },
          outside: {
            amount: Number,
            currency: String
          }
        },
        threeBedroom: {
          cityCenter: {
            amount: Number,
            currency: String
          },
          outside: {
            amount: Number,
            currency: String
          }
        }
      },
      purchase: {
        pricePerSquareMeter: {
          cityCenter: {
            amount: Number,
            currency: String
          },
          outside: {
            amount: Number,
            currency: String
          }
        }
      }
    },
    utilities: {
      amount: Number,
      currency: String,
      description: String
    },
    transportation: {
      publicTransport: {
        amount: Number,
        currency: String,
        description: String
      },
      taxi: {
        amount: Number,
        currency: String,
        description: String
      }
    },
    food: {
      groceries: {
        amount: Number,
        currency: String,
        description: String
      },
      restaurant: {
        amount: Number,
        currency: String,
        description: String
      }
    }
  },
  healthcare: {
    system: String,
    coverage: String,
    costForImmigrants: String,
    waitingPeriod: String
  },
  education: {
    system: String,
    publicOptions: String,
    privateOptions: String,
    costForImmigrants: String,
    internationalSchools: String
  },
  employment: {
    jobMarket: String,
    averageSalary: {
      amount: Number,
      currency: String
    },
    unemploymentRate: Number,
    workCulture: String
  },
  banking: {
    accountRequirements: String,
    creditHistory: String,
    recommendedBanks: [String]
  },
  transportation: {
    publicTransport: String,
    drivingRequirements: String,
    licenseConversion: String
  }
}, { _id: false });

/**
 * Schema for country profiles
 */
const CountryProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  region: {
    type: String,
    required: true,
    index: true
  },
  subregion: String,
  capital: String,
  population: Number,
  languages: [String],
  currency: {
    code: String,
    name: String,
    symbol: String
  },
  flagUrl: String,
  globalRanking: Number,
  immigrationStatistics: ImmigrationStatisticsSchema,
  immigrationSystem: ImmigrationSystemSchema,
  citizenshipInfo: CitizenshipInfoSchema,
  settlementInfo: SettlementInfoSchema,
  keyImmigrationPrograms: [{
    name: String,
    description: String,
    type: String,
    link: String
  }],
  usefulResources: [{
    name: String,
    description: String,
    url: String,
    category: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataSource: {
    name: String,
    url: String,
    lastChecked: Date
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
CountryProfileSchema.index({ region: 1, name: 1 });
CountryProfileSchema.index({ 'immigrationSystem.systemType': 1 });
CountryProfileSchema.index({ globalRanking: 1 });
CountryProfileSchema.index({ 'citizenshipInfo.residencyRequirement.years': 1 });

module.exports = mongoose.model('CountryProfile', CountryProfileSchema);
