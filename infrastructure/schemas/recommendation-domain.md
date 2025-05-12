# Recommendation Domain Schemas

This document defines the MongoDB schemas for the Recommendation Domain collections in the Migratio platform.

## Recommendations Collection

The Recommendations collection stores user immigration program recommendations.

```javascript
// Recommendation Schema
const RecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  generatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  processingTime: {
    type: Number // in milliseconds
  },
  algorithmVersion: {
    type: String
  },
  profileSnapshotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfileSnapshot'
  },
  // Recommendation results
  recommendationResults: [{
    programId: {
      type: String,
      required: true,
      index: true
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
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
  // Summary statistics
  summary: {
    totalPrograms: {
      type: Number
    },
    excellentMatches: {
      type: Number
    },
    goodMatches: {
      type: Number
    },
    moderateMatches: {
      type: Number
    },
    lowMatches: {
      type: Number
    },
    topMatchScore: {
      type: Number
    },
    averageMatchScore: {
      type: Number
    },
    countriesRepresented: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    }]
  },
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
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
    ref: 'GeneratedPDF'
  },
  sharedWith: [{
    email: {
      type: String
    },
    sharedAt: {
      type: Date
    },
    accessLevel: {
      type: String,
      enum: ['view', 'comment'],
      default: 'view'
    }
  }],
  notes: {
    type: String
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes
RecommendationSchema.index({ userId: 1, generatedAt: -1 });
RecommendationSchema.index({ status: 1 });
RecommendationSchema.index({ 'recommendationResults.programId': 1 });
RecommendationSchema.index({ 'recommendationResults.matchScore': -1 });
RecommendationSchema.index({ 'recommendationResults.isSaved': 1 });
RecommendationSchema.index({ isArchived: 1 });

// Virtual for age of recommendation
RecommendationSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const generated = new Date(this.generatedAt);
  const diffTime = Math.abs(now - generated);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to save a program recommendation
RecommendationSchema.methods.saveProgram = function(programId) {
  const programRec = this.recommendationResults.find(r => r.programId === programId);
  if (programRec) {
    programRec.isSaved = true;
    return this.save();
  }
  return Promise.reject(new Error('Program not found in recommendations'));
};

// Method to hide a program recommendation
RecommendationSchema.methods.hideProgram = function(programId) {
  const programRec = this.recommendationResults.find(r => r.programId === programId);
  if (programRec) {
    programRec.isHidden = true;
    return this.save();
  }
  return Promise.reject(new Error('Program not found in recommendations'));
};

// Method to add user feedback
RecommendationSchema.methods.addFeedback = function(programId, relevanceRating, comments) {
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
RecommendationSchema.statics.getLatestForUser = function(userId) {
  return this.findOne({ 
    userId, 
    status: 'completed',
    isArchived: false
  })
  .sort({ generatedAt: -1 })
  .exec();
};

// Static method to get saved programs for user
RecommendationSchema.statics.getSavedPrograms = function(userId) {
  return this.find({ 
    userId, 
    'recommendationResults.isSaved': true
  })
  .sort({ generatedAt: -1 })
  .exec();
};
```

## Matches Collection

The Matches collection stores detailed match information between user profiles and programs.

```javascript
// Match Schema
const MatchSchema = new mongoose.Schema({
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
    criterionType: {
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
    },
    details: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  // Points-based system details (if applicable)
  pointsBasedDetails: {
    isPointsBased: {
      type: Boolean,
      default: false
    },
    totalPoints: {
      type: Number
    },
    passingScore: {
      type: Number
    },
    maxPossiblePoints: {
      type: Number
    },
    pointsByCategory: [{
      category: {
        type: String
      },
      points: {
        type: Number
      },
      maxPoints: {
        type: Number
      },
      factors: [{
        name: {
          type: String
        },
        points: {
          type: Number
        },
        maxPoints: {
          type: Number
        },
        description: {
          type: String
        }
      }]
    }]
  },
  // Match explanation
  explanation: {
    summary: {
      type: String,
      required: true
    },
    keyStrengths: [{
      criterionId: {
        type: String
      },
      criterionName: {
        type: String
      },
      explanation: {
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
      explanation: {
        type: String
      }
    }],
    improvementSuggestions: [{
      criterionId: {
        type: String
      },
      criterionName: {
        type: String
      },
      suggestion: {
        type: String
      },
      potentialImpact: {
        type: Number // percentage points improvement
      }
    }]
  },
  // Metadata
  algorithmVersion: {
    type: String
  },
  processingTime: {
    type: Number // in milliseconds
  }
}, {
  timestamps: true
});

// Indexes
MatchSchema.index({ userId: 1, programId: 1 });
MatchSchema.index({ recommendationId: 1 });
MatchSchema.index({ overallScore: -1 });
MatchSchema.index({ 'criterionScores.criterionId': 1 });

// Method to get top strengths
MatchSchema.methods.getTopStrengths = function(limit = 3) {
  return this.criterionScores
    .filter(cs => cs.impact === 'positive')
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

// Method to get top weaknesses
MatchSchema.methods.getTopWeaknesses = function(limit = 3) {
  return this.criterionScores
    .filter(cs => cs.impact === 'negative')
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
};

// Method to get improvement potential
MatchSchema.methods.getImprovementPotential = function() {
  const improvementSuggestions = this.explanation.improvementSuggestions || [];
  const totalPotential = improvementSuggestions.reduce((sum, suggestion) => sum + (suggestion.potentialImpact || 0), 0);
  
  return {
    totalPotential,
    suggestions: improvementSuggestions.sort((a, b) => b.potentialImpact - a.potentialImpact)
  };
};

// Static method to get match details
MatchSchema.statics.getMatchDetails = function(userId, programId, recommendationId) {
  return this.findOne({ userId, programId, recommendationId }).exec();
};
```

## GapAnalyses Collection

The GapAnalyses collection stores detailed gap analysis information.

```javascript
// GapAnalysis Schema
const GapAnalysisSchema = new mongoose.Schema({
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
  // Overall gap summary
  summary: {
    hasGaps: {
      type: Boolean,
      required: true
    },
    gapCount: {
      type: Number,
      required: true
    },
    criticalGapCount: {
      type: Number,
      required: true
    },
    moderateGapCount: {
      type: Number,
      required: true
    },
    minorGapCount: {
      type: Number,
      required: true
    },
    overallDifficulty: {
      type: String,
      enum: ['easy', 'moderate', 'difficult', 'very_difficult', 'impossible'],
      required: true
    },
    estimatedTimeToAddress: {
      type: Number, // in months
      required: true
    },
    potentialScoreImprovement: {
      type: Number, // percentage points
      required: true
    },
    currentMatchScore: {
      type: Number,
      required: true
    },
    potentialMatchScore: {
      type: Number,
      required: true
    }
  },
  // Detailed gaps
  gaps: [{
    criterionId: {
      type: String,
      required: true
    },
    criterionName: {
      type: String,
      required: true
    },
    criterionType: {
      type: String,
      enum: ['age', 'education', 'work_experience', 'language', 'financial', 'other'],
      required: true
    },
    severity: {
      type: String,
      enum: ['critical', 'moderate', 'minor'],
      required: true
    },
    currentValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    requiredValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    gapDescription: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'difficult', 'very_difficult', 'impossible'],
      required: true
    },
    timeToAddress: {
      type: Number, // in months
      required: true
    },
    scoreImpact: {
      type: Number, // percentage points
      required: true
    },
    // Improvement suggestions
    suggestions: [{
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      estimatedTime: {
        type: Number, // in months
        required: true
      },
      estimatedCost: {
        amount: {
          type: Number
        },
        currency: {
          type: String,
          default: 'USD'
        }
      },
      difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'difficult', 'very_difficult'],
        required: true
      },
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
      }]
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
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
    type: String
  },
  processingTime: {
    type: Number // in milliseconds
  }
}, {
  timestamps: true
});

// Indexes
GapAnalysisSchema.index({ userId: 1, programId: 1 });
GapAnalysisSchema.index({ recommendationId: 1 });
GapAnalysisSchema.index({ 'summary.hasGaps': 1 });
GapAnalysisSchema.index({ 'summary.overallDifficulty': 1 });
GapAnalysisSchema.index({ 'gaps.criterionType': 1 });
GapAnalysisSchema.index({ 'gaps.severity': 1 });

// Method to get critical gaps
GapAnalysisSchema.methods.getCriticalGaps = function() {
  return this.gaps.filter(gap => gap.severity === 'critical');
};

// Method to get addressable gaps
GapAnalysisSchema.methods.getAddressableGaps = function() {
  return this.gaps.filter(gap => gap.difficulty !== 'impossible');
};

// Method to get quick wins
GapAnalysisSchema.methods.getQuickWins = function() {
  return this.gaps
    .filter(gap => gap.difficulty === 'easy' && gap.scoreImpact > 0)
    .sort((a, b) => b.scoreImpact - a.scoreImpact);
};

// Method to get improvement plan
GapAnalysisSchema.methods.getImprovementPlan = function() {
  // Sort gaps by a combination of impact and difficulty
  const sortedGaps = [...this.gaps].sort((a, b) => {
    // Create a score that prioritizes high impact, low difficulty gaps
    const scoreA = a.scoreImpact / getDifficultyValue(a.difficulty);
    const scoreB = b.scoreImpact / getDifficultyValue(b.difficulty);
    return scoreB - scoreA;
  });
  
  return {
    prioritizedGaps: sortedGaps,
    estimatedTimeToComplete: this.summary.estimatedTimeToAddress,
    potentialScoreImprovement: this.summary.potentialScoreImprovement
  };
};

// Helper function for difficulty values
function getDifficultyValue(difficulty) {
  const values = {
    'easy': 1,
    'moderate': 2,
    'difficult': 3,
    'very_difficult': 4,
    'impossible': Infinity
  };
  return values[difficulty] || 2;
}

// Static method to get gap analysis
GapAnalysisSchema.statics.getGapAnalysis = function(userId, programId, recommendationId) {
  return this.findOne({ userId, programId, recommendationId }).exec();
};
```
