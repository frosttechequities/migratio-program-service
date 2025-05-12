const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  programId: {
    type: String,
    required: true,
    index: true
  },
  recommendationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recommendation',
    required: true,
    index: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  // Detailed scoring by category
  categoryScores: [{
    category: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    weight: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },
    description: {
      type: String
    }
  }],
  // Detailed scoring by criterion
  criterionScores: [{
    criterionId: {
      type: String,
      required: true
    },
    criterionName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    userValue: {
      type: mongoose.Schema.Types.Mixed
    },
    requiredValue: {
      type: mongoose.Schema.Types.Mixed
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    weight: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },
    impact: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      required: true
    },
    description: {
      type: String
    }
  }],
  // Explanation
  explanation: {
    summary: {
      type: String,
      required: true
    },
    keyFactors: [{
      factor: {
        type: String,
        required: true
      },
      impact: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }],
    improvementSuggestions: [{
      criterionId: {
        type: String,
        required: true
      },
      criterionName: {
        type: String,
        required: true
      },
      suggestion: {
        type: String,
        required: true
      },
      difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'difficult', 'very_difficult'],
        required: true
      },
      timeframe: {
        type: String,
        required: true
      },
      potentialImpact: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      }
    }],
    comparisonPoints: [{
      programId: {
        type: String
      },
      programName: {
        type: String
      },
      point: {
        type: String
      },
      advantage: {
        type: Boolean
      }
    }]
  },
  // Metadata
  algorithmVersion: {
    type: String,
    default: '1.0'
  },
  processingTime: {
    type: Number // in milliseconds
  }
}, {
  timestamps: true
});

// Indexes
matchSchema.index({ userId: 1, programId: 1 });
matchSchema.index({ recommendationId: 1 });
matchSchema.index({ overallScore: -1 });
matchSchema.index({ 'criterionScores.criterionId': 1 });

// Method to get top strengths
matchSchema.methods.getTopStrengths = function(limit = 3) {
  return this.criterionScores
    .filter(cs => cs.impact === 'positive')
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

// Method to get top weaknesses
matchSchema.methods.getTopWeaknesses = function(limit = 3) {
  return this.criterionScores
    .filter(cs => cs.impact === 'negative')
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
};

// Method to get improvement potential
matchSchema.methods.getImprovementPotential = function() {
  const improvementSuggestions = this.explanation.improvementSuggestions || [];
  const totalPotential = improvementSuggestions.reduce((sum, suggestion) => sum + (suggestion.potentialImpact || 0), 0);
  
  return {
    totalPotential,
    suggestions: improvementSuggestions.sort((a, b) => b.potentialImpact - a.potentialImpact)
  };
};

// Static method to get match details
matchSchema.statics.getMatchDetails = function(userId, programId, recommendationId) {
  return this.findOne({ userId, programId, recommendationId }).exec();
};

const Match = mongoose.model('Match', matchSchema);

module.exports = { Match };
