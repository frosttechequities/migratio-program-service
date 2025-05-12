const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
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
  }]
}, {
  timestamps: true
});

// Indexes
responseSchema.index({ sessionId: 1, questionId: 1 }, { unique: true });
responseSchema.index({ userId: 1, section: 1 });

// Method to format response for profile update
responseSchema.methods.formatForProfile = function() {
  const { questionId, responseValue, questionType } = this;
  
  return {
    questionId,
    value: responseValue,
    type: questionType
  };
};

// Static method to get all responses for a session
responseSchema.statics.getSessionResponses = async function(sessionId) {
  return this.find({ sessionId }).sort({ answeredAt: 1 });
};

// Static method to get responses by section
responseSchema.statics.getResponsesBySection = async function(userId, section) {
  return this.find({ userId, section }).sort({ answeredAt: 1 });
};

const Response = mongoose.model('Response', responseSchema);

module.exports = { Response };
