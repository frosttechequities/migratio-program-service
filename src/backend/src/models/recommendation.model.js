const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  // Recommendation results
  recommendationResults: [{
    programId: {
      type: String,
      required: true,
      index: true
    },
    countryId: {
      type: String,
      required: true
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    rank: {
      type: Number,
      required: true
    },
    matchCategory: {
      type: String,
      enum: ['excellent', 'good', 'moderate', 'low'],
      required: true
    },
    keyStrengths: [{
      criterionId: {
        type: String
      },
      criterionName: {
        type: String
      },
      score: {
        type: Number
      },
      description: {
        type: String
      }
    }],
    keyWeaknesses: [{
      criterionId: {
        type: String
      },
      criterionName: {
        type: String
      },
      score: {
        type: Number
      },
      description: {
        type: String
      }
    }],
    gapAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GapAnalysis'
    },
    matchDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match'
    },
    estimatedProcessingTime: {
      min: {
        type: Number // in months
      },
      max: {
        type: Number // in months
      },
      average: {
        type: Number // in months
      }
    },
    estimatedCost: {
      min: {
        type: Number
      },
      max: {
        type: Number
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    successProbability: {
      type: Number,
      min: 0,
      max: 100
    },
    notes: {
      type: String
    },
    isSaved: {
      type: Boolean,
      default: false
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    userFeedback: {
      relevanceRating: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: {
        type: String
      },
      submittedAt: {
        type: Date
      }
    }
  }],
  // Filtering and sorting preferences
  userPreferences: {
    sortBy: {
      type: String,
      enum: ['matchScore', 'processingTime', 'cost', 'successProbability'],
      default: 'matchScore'
    },
    sortDirection: {
      type: String,
      enum: ['asc', 'desc'],
      default: 'desc'
    },
    filters: {
      countries: [{
        type: String
      }],
      categories: [{
        type: String
      }],
      minMatchScore: {
        type: Number
      },
      maxProcessingTime: {
        type: Number
      },
      maxCost: {
        type: Number
      }
    }
  },
  // Metadata
  isArchived: {
    type: Boolean,
    default: false
  },
  pdfGenerated: {
    type: Boolean,
    default: false
  },
  pdfGeneratedAt: {
    type: Date
  },
  pdfDocumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  algorithmVersion: {
    type: String,
    default: '1.0'
  },
  processingTime: {
    type: Number // in milliseconds
  },
  error: {
    message: String,
    stack: String
  }
}, {
  timestamps: true
});

// Indexes
recommendationSchema.index({ userId: 1, createdAt: -1 });
recommendationSchema.index({ sessionId: 1 });
recommendationSchema.index({ status: 1 });
recommendationSchema.index({ 'recommendationResults.programId': 1 });

// Method to add user feedback
recommendationSchema.methods.addFeedback = function(programId, relevanceRating, comments) {
  const programRec = this.recommendationResults.find(r => r.programId === programId);
  if (programRec) {
    programRec.userFeedback = {
      relevanceRating,
      comments,
      submittedAt: new Date()
    };
    return this.save();
  }
  return Promise.reject(new Error('Program not found in recommendations'));
};

// Static method to get latest recommendation for user
recommendationSchema.statics.getLatestForUser = function(userId) {
  return this.findOne({ 
    userId, 
    status: 'completed',
    isArchived: false
  })
  .sort({ generatedAt: -1 })
  .exec();
};

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = { Recommendation };
