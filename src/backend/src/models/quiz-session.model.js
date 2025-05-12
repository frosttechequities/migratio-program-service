const mongoose = require('mongoose');

const quizSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress',
    index: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  currentSection: {
    type: String,
    enum: ['personal', 'education', 'work', 'language', 'financial', 'immigration', 'preferences']
  },
  currentQuestionId: {
    type: String
  },
  completedSections: [{
    type: String,
    enum: ['personal', 'education', 'work', 'language', 'financial', 'immigration', 'preferences']
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  questionSequence: [{
    type: String // questionId
  }],
  remainingQuestions: [{
    type: String // questionId
  }],
  skippedQuestions: [{
    type: String // questionId
  }],
  responseCount: {
    type: Number,
    default: 0
  },
  deviceInfo: {
    deviceType: {
      type: String
    },
    browser: {
      type: String
    },
    operatingSystem: {
      type: String
    },
    ipAddress: {
      type: String
    }
  },
  referrer: {
    type: String
  },
  quizVersion: {
    type: String
  },
  language: {
    type: String,
    default: 'en'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
quizSessionSchema.index({ userId: 1, status: 1 });
quizSessionSchema.index({ sessionId: 1 });
quizSessionSchema.index({ createdAt: 1 });

// Method to update session progress
quizSessionSchema.methods.updateProgress = function(totalQuestions) {
  const answeredCount = this.responseCount;
  this.progress = Math.round((answeredCount / totalQuestions) * 100);
  return this.progress;
};

// Method to mark section as completed
quizSessionSchema.methods.completeSection = function(section) {
  if (!this.completedSections.includes(section)) {
    this.completedSections.push(section);
  }
};

// Method to update last activity
quizSessionSchema.methods.updateActivity = function() {
  this.lastActivityAt = new Date();
};

// Method to complete quiz
quizSessionSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  this.progress = 100;
};

// Static method to find active session for user
quizSessionSchema.statics.findActiveForUser = async function(userId) {
  return this.findOne({
    userId,
    status: 'in_progress'
  }).sort({ lastActivityAt: -1 });
};

// Static method to generate session ID
quizSessionSchema.statics.generateSessionId = function() {
  return `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

const QuizSession = mongoose.model('QuizSession', quizSessionSchema);

module.exports = { QuizSession };
