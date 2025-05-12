const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
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
  // For number/slider questions
  validation: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    step: {
      type: Number
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
questionSchema.index({ section: 1, order: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ isActive: 1 });

// Static method to get initial questions
questionSchema.statics.getInitialQuestions = async function(section) {
  return this.find({
    section,
    isActive: true,
    conditionalDisplay: { $exists: false }
  })
  .sort({ order: 1 })
  .limit(5);
};

// Static method to get next question based on previous answers
questionSchema.statics.getNextQuestion = async function(section, previousAnswers) {
  // First, get all questions for the section
  const allQuestions = await this.find({
    section,
    isActive: true
  }).sort({ order: 1 });

  // Filter out questions that have already been answered
  const answeredQuestionIds = Object.keys(previousAnswers);
  const unansweredQuestions = allQuestions.filter(q => !answeredQuestionIds.includes(q.questionId));

  // If no more questions in this section, return null
  if (unansweredQuestions.length === 0) {
    return null;
  }

  // Filter questions based on conditional logic
  const eligibleQuestions = unansweredQuestions.filter(question => {
    // If no conditional display, always show
    if (!question.conditionalDisplay) {
      return true;
    }

    // Check if the dependent question has been answered
    const { dependsOn, condition, value } = question.conditionalDisplay;
    const dependentAnswer = previousAnswers[dependsOn];

    // If dependent question hasn't been answered, don't show
    if (dependentAnswer === undefined) {
      return false;
    }

    // Evaluate condition
    switch (condition) {
      case 'equals':
        return dependentAnswer === value;
      case 'not_equals':
        return dependentAnswer !== value;
      case 'contains':
        return Array.isArray(dependentAnswer) && dependentAnswer.includes(value);
      case 'not_contains':
        return Array.isArray(dependentAnswer) && !dependentAnswer.includes(value);
      case 'greater_than':
        return dependentAnswer > value;
      case 'less_than':
        return dependentAnswer < value;
      default:
        return true;
    }
  });

  // Return the first eligible question
  return eligibleQuestions.length > 0 ? eligibleQuestions[0] : null;
};

const Question = mongoose.model('Question', questionSchema);

module.exports = { Question };
