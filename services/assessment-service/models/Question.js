const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    value: { type: String, required: true },
    label: { type: String, required: true }
}, { _id: false });

const ValidationSchema = new mongoose.Schema({
    min: Number,
    max: Number,
    step: Number,
    minDate: String, // YYYY-MM-DD
    maxDate: String, // YYYY-MM-DD
    pattern: String, // Regex pattern
    required: { type: Boolean, default: false }
}, { _id: false });

// Define structure for adaptive rules associated with a question
// The 'condition' would likely be evaluated in the QuizEngine against answer/profile/scores
const RuleSchema = new mongoose.Schema({
    condition: { type: String, required: true }, // Store condition logic identifier or potentially JS string (use with caution)
    action: { type: String, enum: ['add', 'remove', 'prioritize'], required: true },
    questions: { type: [String], required: true } // Array of question IDs to add/remove/prioritize
}, { _id: false });

const RelevanceFactorSchema = new mongoose.Schema({
    profileKey: { type: String, required: true }, // Key in user profile/answers to check
    condition: { type: String, required: true }, // e.g., 'equals', 'greaterThan', 'lessThan', 'contains'
    value: mongoose.Schema.Types.Mixed, // Value to compare against
    modifier: { type: Number, required: true } // Score adjustment
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  questionId: { // Unique identifier for the question (e.g., 'personal_age', 'work_experience_years')
    type: String,
    required: true,
    unique: true,
    index: true
  },
  text: { // The question text presented to the user
    type: String,
    required: true,
    trim: true
  },
  label: String, // Optional shorter label for inputs/legends
  helpText: String, // Explanatory text shown to the user
  type: { // Type of input expected
    type: String,
    enum: ['text', 'number', 'single_choice', 'multiple_choice', 'date', 'slider', 'file', 'matrix', 'free-text-nlp'],
    required: true
  },
  section: { // Logical section the question belongs to (e.g., 'personal', 'education', 'goals')
    type: String,
    required: true,
    index: true
  },
  order: Number, // Default display order within a section (can be overridden by adaptive logic)
  options: [OptionSchema], // Used for single_choice, multiple_choice
  validation: ValidationSchema, // Validation rules for the answer
  rules: [RuleSchema], // Adaptive logic rules triggered by answering this question
  baseRelevance: { type: Number, default: 5 }, // Default relevance score
  relevanceFactors: [RelevanceFactorSchema], // Factors modifying relevance based on profile
  requiresNlp: { type: Boolean, default: false }, // Does the answer need NLP processing?
  isActive: { type: Boolean, default: true }, // Is the question currently in use?
  version: { type: Number, default: 1 } // For tracking changes to the question
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
