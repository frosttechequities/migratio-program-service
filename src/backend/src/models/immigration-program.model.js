/**
 * Immigration Program Model
 * 
 * Defines the schema for immigration programs.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Eligibility Criterion Schema
const EligibilityCriterionSchema = new Schema({
  criterionId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['range', 'level', 'language', 'boolean', 'composite', 'money'],
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    default: 0
  },
  // Range type properties
  min: Number,
  max: Number,
  idealMin: Number,
  idealMax: Number,
  unit: String,
  // Level type properties
  levels: [{
    value: String,
    label: String,
    points: Number
  }],
  // Language type properties
  languages: [String],
  skills: [String],
  minLevel: Number,
  maxLevel: Number,
  // Composite type properties
  factors: [{
    id: String,
    name: String,
    points: Number
  }],
  // Money type properties
  amounts: [{
    family_size: Number,
    amount: Number
  }],
  currency: String
});

// Program Stream Schema
const ProgramStreamSchema = new Schema({
  streamId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String
});

// Processing Time Schema
const ProcessingTimeSchema = new Schema({
  min: Number,
  max: Number,
  unit: {
    type: String,
    enum: ['days', 'weeks', 'months', 'years'],
    default: 'months'
  },
  formatted: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Fee Schema
const FeeSchema = new Schema({
  application: Number,
  rightOfPermanentResidence: Number,
  total: Number,
  currency: {
    type: String,
    default: 'CAD'
  },
  additionalFees: {
    principalApplicant: Number,
    spouse: Number,
    dependentChild: Number
  },
  provincialFees: Schema.Types.Mixed,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Immigration Program Schema
const ImmigrationProgramSchema = new Schema({
  programId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  officialUrl: {
    type: String,
    required: true
  },
  streams: [ProgramStreamSchema],
  eligibilitySummary: String,
  eligibilityCriteria: [EligibilityCriterionSchema],
  processingTime: ProcessingTimeSchema,
  fees: FeeSchema,
  successRate: {
    type: Number,
    min: 0,
    max: 1
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastDataUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create text indexes for search
ImmigrationProgramSchema.index({
  name: 'text',
  description: 'text',
  'streams.name': 'text',
  'streams.description': 'text',
  eligibilitySummary: 'text'
});

// Create compound indexes for filtering
ImmigrationProgramSchema.index({ country: 1, category: 1, active: 1 });
ImmigrationProgramSchema.index({ country: 1, 'processingTime.max': 1 });
ImmigrationProgramSchema.index({ country: 1, 'fees.total': 1 });
ImmigrationProgramSchema.index({ country: 1, successRate: -1 });

/**
 * Find programs by country
 * @param {string} country - Country code
 * @returns {Promise<Array>} - Array of programs
 */
ImmigrationProgramSchema.statics.findByCountry = function(country) {
  return this.find({ country, active: true });
};

/**
 * Find programs by category
 * @param {string} category - Program category
 * @returns {Promise<Array>} - Array of programs
 */
ImmigrationProgramSchema.statics.findByCategory = function(category) {
  return this.find({ category, active: true });
};

/**
 * Find programs by processing time
 * @param {number} maxMonths - Maximum processing time in months
 * @returns {Promise<Array>} - Array of programs
 */
ImmigrationProgramSchema.statics.findByProcessingTime = function(maxMonths) {
  return this.find({
    'processingTime.unit': 'months',
    'processingTime.max': { $lte: maxMonths },
    active: true
  });
};

/**
 * Find programs by maximum cost
 * @param {number} maxCost - Maximum cost
 * @param {string} currency - Currency code
 * @returns {Promise<Array>} - Array of programs
 */
ImmigrationProgramSchema.statics.findByMaxCost = function(maxCost, currency = 'CAD') {
  return this.find({
    'fees.currency': currency,
    'fees.total': { $lte: maxCost },
    active: true
  });
};

/**
 * Find programs by minimum success rate
 * @param {number} minRate - Minimum success rate (0-1)
 * @returns {Promise<Array>} - Array of programs
 */
ImmigrationProgramSchema.statics.findByMinSuccessRate = function(minRate) {
  return this.find({
    successRate: { $gte: minRate },
    active: true
  });
};

/**
 * Search programs by keyword
 * @param {string} keyword - Search keyword
 * @returns {Promise<Array>} - Array of programs
 */
ImmigrationProgramSchema.statics.searchByKeyword = function(keyword) {
  return this.find(
    { $text: { $search: keyword }, active: true },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

/**
 * Find programs with advanced filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} - Array of programs
 */
ImmigrationProgramSchema.statics.findWithFilters = function(filters) {
  const query = { active: true };
  
  if (filters.countries && filters.countries.length > 0) {
    query.country = { $in: filters.countries };
  }
  
  if (filters.categories && filters.categories.length > 0) {
    query.category = { $in: filters.categories };
  }
  
  if (filters.maxProcessingTime) {
    query['processingTime.unit'] = 'months';
    query['processingTime.max'] = { $lte: filters.maxProcessingTime };
  }
  
  if (filters.maxCost) {
    query['fees.total'] = { $lte: filters.maxCost };
  }
  
  if (filters.minSuccessRate) {
    query.successRate = { $gte: filters.minSuccessRate };
  }
  
  let sortOption = {};
  
  switch (filters.sortBy) {
    case 'processingTime':
      sortOption = { 'processingTime.min': 1 };
      break;
    case 'cost':
      sortOption = { 'fees.total': 1 };
      break;
    case 'successRate':
      sortOption = { successRate: -1 };
      break;
    default:
      sortOption = { successRate: -1 };
  }
  
  return this.find(query).sort(sortOption);
};

const ImmigrationProgram = mongoose.model('ImmigrationProgram', ImmigrationProgramSchema);

module.exports = ImmigrationProgram;
