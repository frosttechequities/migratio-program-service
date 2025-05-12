# Assessment Domain Schemas

This document defines the MongoDB schemas for the Assessment Domain collections in the Migratio platform.

## Questions Collection

The Questions collection stores the assessment quiz questions.

```javascript
// Question Schema
const QuestionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  text: {
    type: String,
    required: true
  },
  helpText: {
    type: String
  },
  section: {
    type: String,
    enum: ['personal', 'education', 'work', 'language', 'financial', 'immigration', 'preferences'],
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['single_choice', 'multiple_choice', 'slider', 'date', 'text', 'number', 'file_upload'],
    required: true
  },
  required: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true
  },
  // For choice questions
  options: [{
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    helpText: {
      type: String
    }
  }],
  // For slider questions
  range: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    step: {
      type: Number,
      default: 1
    },
    defaultValue: {
      type: Number
    },
    labels: {
      type: Map,
      of: String
    }
  },
  // For date questions
  dateConfig: {
    minDate: {
      type: Date
    },
    maxDate: {
      type: Date
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    }
  },
  // For text/number questions
  validation: {
    minLength: {
      type: Number
    },
    maxLength: {
      type: Number
    },
    pattern: {
      type: String
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    }
  },
  // For file upload questions
  fileConfig: {
    maxSize: {
      type: Number // in bytes
    },
    allowedTypes: [{
      type: String
    }],
    maxFiles: {
      type: Number,
      default: 1
    }
  },
  // Conditional logic
  conditionalDisplay: {
    dependsOn: {
      type: String // questionId
    },
    condition: {
      type: String,
      enum: ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than']
    },
    value: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  // Metadata
  tags: [{
    type: String
  }],
  relevanceScore: {
    type: Number,
    default: 5,
    min: 1,
    max: 10
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  translations: {
    type: Map,
    of: {
      text: String,
      helpText: String,
      options: [{
        value: String,
        label: String,
        helpText: String
      }]
    }
  }
}, {
  timestamps: true
});

// Indexes
QuestionSchema.index({ questionId: 1 });
QuestionSchema.index({ section: 1, order: 1 });
QuestionSchema.index({ 'conditionalDisplay.dependsOn': 1 });
QuestionSchema.index({ isActive: 1 });
QuestionSchema.index({ tags: 1 });

// Method to get translated question
QuestionSchema.methods.getTranslation = function(language) {
  if (!this.translations || !this.translations.has(language)) {
    return {
      text: this.text,
      helpText: this.helpText,
      options: this.options
    };
  }
  
  const translation = this.translations.get(language);
  
  return {
    text: translation.text || this.text,
    helpText: translation.helpText || this.helpText,
    options: translation.options || this.options
  };
};

// Static method to get questions by section
QuestionSchema.statics.getBySection = function(section, isActive = true) {
  return this.find({ section, isActive })
    .sort({ order: 1 })
    .exec();
};
```

## QuizSessions Collection

The QuizSessions collection tracks user progress through the assessment quiz.

```javascript
// QuizSession Schema
const QuizSessionSchema = new mongoose.Schema({
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
QuizSessionSchema.index({ userId: 1 });
QuizSessionSchema.index({ sessionId: 1 });
QuizSessionSchema.index({ status: 1 });
QuizSessionSchema.index({ startedAt: 1 });
QuizSessionSchema.index({ lastActivityAt: 1 });

// Virtual for duration
QuizSessionSchema.virtual('duration').get(function() {
  const end = this.completedAt || new Date();
  const start = this.startedAt;
  return (end - start) / 1000; // duration in seconds
});

// Virtual for completion rate
QuizSessionSchema.virtual('completionRate').get(function() {
  return this.responseCount / (this.responseCount + this.remainingQuestions.length);
});

// Method to update session progress
QuizSessionSchema.methods.updateProgress = function() {
  const totalQuestions = this.responseCount + this.remainingQuestions.length + this.skippedQuestions.length;
  this.progress = totalQuestions > 0 ? Math.round((this.responseCount / totalQuestions) * 100) : 0;
  this.lastActivityAt = new Date();
  return this.save();
};

// Method to mark section as completed
QuizSessionSchema.methods.completeSection = function(section) {
  if (!this.completedSections.includes(section)) {
    this.completedSections.push(section);
  }
  return this.save();
};

// Method to mark session as completed
QuizSessionSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  this.progress = 100;
  return this.save();
};

// Method to mark session as abandoned
QuizSessionSchema.methods.abandon = function() {
  this.status = 'abandoned';
  return this.save();
};

// Pre-save hook to update lastActivityAt
QuizSessionSchema.pre('save', function(next) {
  this.lastActivityAt = new Date();
  next();
});
```

## Responses Collection

The Responses collection stores user answers to assessment questions.

```javascript
// Response Schema
const ResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  questionId: {
    type: String,
    required: true,
    index: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['single_choice', 'multiple_choice', 'slider', 'date', 'text', 'number', 'file_upload'],
    required: true
  },
  section: {
    type: String,
    enum: ['personal', 'education', 'work', 'language', 'financial', 'immigration', 'preferences'],
    required: true,
    index: true
  },
  // Different response types
  responseValue: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // For choice questions
  selectedOptions: [{
    value: {
      type: String
    },
    label: {
      type: String
    }
  }],
  // For text responses
  textResponse: {
    type: String
  },
  // For numeric responses
  numericResponse: {
    type: Number
  },
  // For date responses
  dateResponse: {
    type: Date
  },
  // For file upload responses
  fileResponses: [{
    fileId: {
      type: String
    },
    fileName: {
      type: String
    },
    fileType: {
      type: String
    },
    fileSize: {
      type: Number
    },
    fileUrl: {
      type: String
    }
  }],
  // Metadata
  answeredAt: {
    type: Date,
    default: Date.now
  },
  timeToAnswer: {
    type: Number // in seconds
  },
  isSkipped: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    previousValue: {
      type: mongoose.Schema.Types.Mixed
    },
    editedAt: {
      type: Date
    }
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
ResponseSchema.index({ userId: 1, questionId: 1 });
ResponseSchema.index({ sessionId: 1, questionId: 1 }, { unique: true });
ResponseSchema.index({ section: 1 });
ResponseSchema.index({ answeredAt: 1 });

// Method to update response
ResponseSchema.methods.updateResponse = function(newValue) {
  // Save previous value to history
  this.editHistory.push({
    previousValue: this.responseValue,
    editedAt: new Date()
  });
  
  // Update with new value
  this.responseValue = newValue;
  this.isEdited = true;
  
  // Update specific response type fields
  if (this.questionType === 'single_choice' || this.questionType === 'multiple_choice') {
    this.selectedOptions = Array.isArray(newValue) ? newValue : [newValue];
  } else if (this.questionType === 'text') {
    this.textResponse = newValue;
  } else if (this.questionType === 'number' || this.questionType === 'slider') {
    this.numericResponse = newValue;
  } else if (this.questionType === 'date') {
    this.dateResponse = newValue;
  } else if (this.questionType === 'file_upload') {
    this.fileResponses = newValue;
  }
  
  return this.save();
};

// Static method to get all responses for a session
ResponseSchema.statics.getSessionResponses = function(sessionId) {
  return this.find({ sessionId })
    .sort({ answeredAt: 1 })
    .exec();
};

// Static method to get all responses for a user by section
ResponseSchema.statics.getUserSectionResponses = function(userId, section) {
  return this.find({ userId, section })
    .sort({ answeredAt: 1 })
    .exec();
};
```
