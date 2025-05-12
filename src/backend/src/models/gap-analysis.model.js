const mongoose = require('mongoose');

/**
 * Gap Analysis Schema
 * Represents a gap analysis between user profile and program requirements
 */
const gapAnalysisSchema = new mongoose.Schema({
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
  // Identified gaps
  gaps: [{
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
      enum: ['age', 'education', 'work_experience', 'language', 'financial', 'family', 'other'],
      required: true
    },
    severity: {
      type: String,
      enum: ['minor', 'moderate', 'major', 'critical'],
      required: true
    },
    userValue: {
      type: mongoose.Schema.Types.Mixed
    },
    requiredValue: {
      type: mongoose.Schema.Types.Mixed
    },
    description: {
      type: String,
      required: true
    },
    // Improvement suggestions
    improvementSuggestions: [{
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'difficult', 'very_difficult'],
        required: true
      },
      estimatedTimeToResolve: {
        value: {
          type: Number
        },
        unit: {
          type: String,
          enum: ['days', 'weeks', 'months', 'years']
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
          type: String
        }
      },
      potentialImpact: {
        type: Number, // 0-100
        required: true
      },
      steps: [{
        step: {
          type: Number
        },
        description: {
          type: String
        }
      }],
      resources: [{
        title: {
          type: String
        },
        url: {
          type: String
        },
        type: {
          type: String,
          enum: ['article', 'video', 'course', 'service', 'tool', 'other']
        }
      }],
      // Alternative approaches
      alternatives: [{
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        pros: [{
          type: String
        }],
        cons: [{
          type: String
        }]
      }]
    }]
  }],
  // Alternative programs with fewer gaps
  alternativePrograms: [{
    programId: {
      type: String,
      required: true
    },
    programName: {
      type: String,
      required: true
    },
    countryId: {
      type: String,
      required: true
    },
    matchScore: {
      type: Number,
      required: true
    },
    gapCount: {
      type: Number,
      required: true
    },
    keyAdvantages: [{
      type: String
    }],
    keyDisadvantages: [{
      type: String
    }]
  }],
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
gapAnalysisSchema.index({ userId: 1, programId: 1 });
gapAnalysisSchema.index({ recommendationId: 1 });
gapAnalysisSchema.index({ 'gaps.severity': 1 });

// Method to get critical gaps
gapAnalysisSchema.methods.getCriticalGaps = function() {
  return this.gaps.filter(gap => gap.severity === 'critical');
};

// Method to get improvement plan
gapAnalysisSchema.methods.getImprovementPlan = function() {
  // Sort gaps by severity and potential impact of improvements
  const sortedGaps = [...this.gaps].sort((a, b) => {
    const severityOrder = { critical: 4, major: 3, moderate: 2, minor: 1 };
    
    // First sort by severity
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    
    // Then sort by highest potential impact
    const aMaxImpact = Math.max(...a.improvementSuggestions.map(s => s.potentialImpact || 0));
    const bMaxImpact = Math.max(...b.improvementSuggestions.map(s => s.potentialImpact || 0));
    
    return bMaxImpact - aMaxImpact;
  });
  
  // Create improvement plan
  return sortedGaps.map(gap => {
    // Get best suggestion (highest impact)
    const bestSuggestion = [...gap.improvementSuggestions]
      .sort((a, b) => b.potentialImpact - a.potentialImpact)[0];
    
    return {
      criterionName: gap.criterionName,
      severity: gap.severity,
      description: gap.description,
      suggestion: bestSuggestion
    };
  });
};

// Static method to get gap analysis
gapAnalysisSchema.statics.getGapAnalysis = function(userId, programId, recommendationId) {
  return this.findOne({ userId, programId, recommendationId }).exec();
};

const GapAnalysis = mongoose.model('GapAnalysis', gapAnalysisSchema);

module.exports = { GapAnalysis };
