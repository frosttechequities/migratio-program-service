const mongoose = require('mongoose');

/**
 * Schema for immigration costs
 */
const ImmigrationCostSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    index: true
  },
  programName: {
    type: String,
    required: true
  },
  applicationFees: {
    primaryApplicant: {
      amount: Number,
      currency: String,
      description: String
    },
    spouse: {
      amount: Number,
      currency: String,
      description: String
    },
    dependentChild: {
      amount: Number,
      currency: String,
      description: String,
      ageConsiderations: String
    },
    otherDependents: [{
      type: String,
      amount: Number,
      currency: String,
      description: String
    }]
  },
  additionalFees: [{
    name: String,
    amount: Number,
    currency: String,
    mandatory: Boolean,
    applicability: String,
    description: String
  }],
  thirdPartyFees: [{
    service: String,
    provider: String,
    amount: {
      minimum: Number,
      maximum: Number,
      average: Number,
      currency: String
    },
    mandatory: Boolean,
    description: String
  }],
  settlementFunds: {
    required: Boolean,
    singleApplicant: {
      amount: Number,
      currency: String
    },
    additionalPerDependent: {
      amount: Number,
      currency: String
    },
    description: String,
    proofRequirements: String
  },
  totalEstimatedCost: {
    singleApplicant: {
      minimum: Number,
      maximum: Number,
      currency: String
    },
    familyOfFour: {
      minimum: Number,
      maximum: Number,
      currency: String
    },
    description: String,
    includedCosts: [String],
    excludedCosts: [String]
  },
  costBreakdownByStage: [{
    stage: String,
    description: String,
    timing: String,
    costs: [{
      item: String,
      amount: {
        minimum: Number,
        maximum: Number,
        currency: String
      },
      mandatory: Boolean,
      notes: String
    }]
  }],
  feeWaivers: {
    available: Boolean,
    eligibilityCriteria: String,
    applicationProcess: String,
    description: String
  },
  refundPolicy: {
    available: Boolean,
    conditions: String,
    process: String,
    timeframe: String
  },
  paymentMethods: [{
    method: String,
    acceptedCurrencies: [String],
    restrictions: String,
    processingFees: String
  }],
  historicalTrends: [{
    year: Number,
    primaryApplicantFee: {
      amount: Number,
      currency: String
    },
    percentageChange: Number,
    notes: String
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
ImmigrationCostSchema.index({ country: 1, programName: 1 }, { unique: true });
ImmigrationCostSchema.index({ 'totalEstimatedCost.singleApplicant.minimum': 1 });
ImmigrationCostSchema.index({ 'feeWaivers.available': 1 });

module.exports = mongoose.model('ImmigrationCost', ImmigrationCostSchema);
