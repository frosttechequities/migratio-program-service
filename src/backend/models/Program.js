const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Option Schema
 * Represents a possible value for a criterion with associated points
 */
const OptionSchema = new Schema({
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  }
});

/**
 * Criterion Schema
 * Represents a specific requirement or factor for an immigration program
 */
const CriterionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: [
      'personal_info',
      'education',
      'work_experience',
      'language',
      'adaptability',
      'financial',
      'preferences',
      'other'
    ]
  },
  key: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  minValue: {
    type: Number
  },
  maxValue: {
    type: Number
  },
  options: [OptionSchema]
});

/**
 * Program Schema
 * Represents an immigration program with its criteria and details
 */
const ProgramSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String
  },
  country: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'economic',
      'family',
      'humanitarian',
      'study',
      'work',
      'business',
      'other'
    ]
  },
  processingTime: {
    type: String
  },
  criteria: [CriterionSchema],
  benefits: [String],
  requirements: [String],
  isActive: {
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
  }
});

// Update the updatedAt field on save
ProgramSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for faster queries
ProgramSchema.index({ country: 1, category: 1 });
ProgramSchema.index({ isActive: 1 });

module.exports = mongoose.model('Program', ProgramSchema);
