const mongoose = require('mongoose');

const EligibilityCriterionSchema = new mongoose.Schema({
  criterionType: {
    type: String,
    enum: ['age', 'education', 'workExperience', 'language', 'financial', 'investment', 'family', 'other'],
    required: true
  },
  criterionName: { type: String, required: true },
  description: String,
  minValue: mongoose.Schema.Types.Mixed,
  maxValue: mongoose.Schema.Types.Mixed,
  unit: String, // e.g., 'years', 'points', 'CAD'
  weight: Number, // Importance for internal scoring/matching
  isRequired: { type: Boolean, default: true }
}, { _id: false });

const CostSchema = new mongoose.Schema({
  feeType: { type: String, required: true }, // e.g., 'Application Fee', 'Biometrics Fee', 'Right of Permanent Residence Fee'
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'CAD' }, // Default or specific currency
  isRefundable: Boolean,
  notes: String
}, { _id: false });

const ApplicationStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  estimatedTimeframe: String, // e.g., '2-4 weeks'
  tips: String
}, { _id: false });

const ProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Program name is required'],
    trim: true,
    index: true
  },
  country: {
    type: mongoose.Schema.ObjectId,
    ref: 'Country', // Assuming a separate Country model/collection exists (managed elsewhere or here)
    required: true,
    index: true
  },
  countryCode: {
    type: String,
    required: [true, 'Country code is required'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    enum: ['work', 'study', 'family', 'investment', 'humanitarian', 'other'],
    required: true,
    index: true
  },
  subcategory: {
    type: String,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  eligibilityCriteria: [EligibilityCriterionSchema],
  processingTime: { // Official/average times
    minMonths: Number,
    maxMonths: Number,
    averageMonths: Number,
    source: String,
    lastVerified: Date
  },
  predictedProcessingTime: { // ML Prediction
      estimateMonths: Number,
      confidence: Number, // 0-1
      lastCalculated: Date,
      modelUsed: String
  },
  costs: [CostSchema],
  requiredDocuments: [{ // References specific document requirements
    type: mongoose.Schema.ObjectId,
    ref: 'DocumentRequirement' // Assuming a DocumentRequirement model exists (managed by Document Service?)
  }],
  applicationSteps: [ApplicationStepSchema],
  benefits: [String],
  limitations: [String],
  pathwayToResidency: Boolean,
  pathwayToCitizenship: Boolean,
  officialWebsite: {
    type: String,
    trim: true
  },
  lastUpdated: { // Last manual/verified update of this program data
    type: Date,
    default: Date.now
  },
  dataSource: String, // Source of the information
  popularity: { // Calculated based on user interactions
      type: Number,
      default: 0
  },
  successRate: { // Historical/Reported Success Rate
      rate: Number, // 0-1
      source: String,
      year: Number,
      notes: String
  },
  predictedSuccessRate: { // Base predicted rate (before user profile adjustment)
      baseRate: Number, // 0-1
      confidence: Number, // 0-1
      lastCalculated: Date,
      modelUsed: String
  },
  postArrivalSupportLevel: { // Indicator of available settlement support info/features
      type: Number,
      min: 1,
      max: 3 // e.g., 1=Basic, 2=Moderate, 3=Comprehensive
  },
  tags: {
      type: [String],
      index: true
  }, // For filtering/categorization
  isActive: { // Is the program currently accepting applications?
      type: Boolean,
      default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Add indexes for frequently queried fields
ProgramSchema.index({ country: 1, category: 1 });
ProgramSchema.index({ name: 'text', description: 'text' }); // For text search

const Program = mongoose.model('Program', ProgramSchema);

module.exports = Program;
