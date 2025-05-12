const mongoose = require('mongoose');

/**
 * Schema for processing times and success rates
 */
const ProcessingDataSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    index: true
  },
  programName: {
    type: String,
    required: true
  },
  processingTimes: {
    standard: {
      minimum: Number,
      maximum: Number,
      median: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years'],
        default: 'months'
      },
      lastUpdated: Date
    },
    expedited: {
      available: {
        type: Boolean,
        default: false
      },
      minimum: Number,
      maximum: Number,
      median: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months'],
        default: 'weeks'
      },
      additionalFee: {
        amount: Number,
        currency: String
      },
      eligibilityCriteria: String,
      lastUpdated: Date
    },
    byStage: [{
      stageName: String,
      description: String,
      minimum: Number,
      maximum: Number,
      median: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years'],
        default: 'weeks'
      }
    }],
    byApplicantType: [{
      applicantType: String,
      minimum: Number,
      maximum: Number,
      median: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years'],
        default: 'months'
      }
    }],
    byCountryOfOrigin: [{
      countryOfOrigin: String,
      minimum: Number,
      maximum: Number,
      median: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years'],
        default: 'months'
      }
    }],
    historicalTrend: [{
      year: Number,
      minimum: Number,
      maximum: Number,
      median: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years'],
        default: 'months'
      }
    }]
  },
  successRates: {
    overall: {
      rate: Number, // Percentage
      sampleSize: Number,
      year: Number,
      description: String
    },
    byApplicantType: [{
      applicantType: String,
      rate: Number, // Percentage
      sampleSize: Number,
      year: Number
    }],
    byCountryOfOrigin: [{
      countryOfOrigin: String,
      rate: Number, // Percentage
      sampleSize: Number,
      year: Number
    }],
    byAgeGroup: [{
      ageRange: {
        min: Number,
        max: Number
      },
      rate: Number, // Percentage
      sampleSize: Number,
      year: Number
    }],
    byEducationLevel: [{
      educationLevel: String,
      rate: Number, // Percentage
      sampleSize: Number,
      year: Number
    }],
    byLanguageProficiency: [{
      languageLevel: String,
      rate: Number, // Percentage
      sampleSize: Number,
      year: Number
    }],
    historicalTrend: [{
      year: Number,
      rate: Number, // Percentage
      sampleSize: Number
    }]
  },
  commonRejectionReasons: [{
    reason: String,
    percentage: Number,
    description: String,
    preventionTips: String
  }],
  appealSuccess: {
    rate: Number, // Percentage
    processingTime: {
      minimum: Number,
      maximum: Number,
      median: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years'],
        default: 'months'
      }
    },
    description: String
  },
  quotaInformation: {
    hasQuota: {
      type: Boolean,
      default: false
    },
    annualQuota: Number,
    currentUtilization: Number,
    quotaResetDate: Date,
    description: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataSource: {
    name: String,
    url: String,
    lastChecked: Date,
    updateFrequency: String
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
ProcessingDataSchema.index({ country: 1, programName: 1 }, { unique: true });
ProcessingDataSchema.index({ 'processingTimes.standard.median': 1 });
ProcessingDataSchema.index({ 'successRates.overall.rate': 1 });
ProcessingDataSchema.index({ 'quotaInformation.hasQuota': 1 });

module.exports = mongoose.model('ProcessingData', ProcessingDataSchema);
