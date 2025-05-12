# Roadmap Domain Schemas (Part 1)

This document defines the MongoDB schemas for the Roadmap Domain collections in the Migratio platform.

## Roadmaps Collection

The Roadmaps collection stores personalized immigration roadmaps for users.

```javascript
// Roadmap Schema
const RoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  programId: {
    type: String,
    required: true,
    index: true
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
    index: true
  },
  recommendationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recommendation',
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'abandoned'],
    default: 'draft',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },
  // Timeline information
  timeline: {
    startDate: {
      type: Date,
      required: true
    },
    estimatedCompletionDate: {
      type: Date,
      required: true
    },
    actualCompletionDate: {
      type: Date
    },
    totalDuration: {
      type: Number // in days
    },
    currentPhase: {
      type: String,
      enum: ['preparation', 'application', 'processing', 'decision', 'post_approval'],
      default: 'preparation'
    },
    phases: [{
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      },
      status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed', 'delayed'],
        default: 'not_started'
      },
      order: {
        type: Number,
        required: true
      },
      milestones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milestone'
      }]
    }]
  },
  // Progress tracking
  progress: {
    overallPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    milestonesCompleted: {
      type: Number,
      default: 0
    },
    totalMilestones: {
      type: Number,
      default: 0
    },
    tasksCompleted: {
      type: Number,
      default: 0
    },
    totalTasks: {
      type: Number,
      default: 0
    },
    documentsCompleted: {
      type: Number,
      default: 0
    },
    totalDocuments: {
      type: Number,
      default: 0
    },
    phaseProgress: [{
      phaseName: {
        type: String
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100
      }
    }]
  },
  // Cost tracking
  costs: {
    estimatedTotal: {
      amount: {
        type: Number
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    actualTotal: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    categories: [{
      name: {
        type: String
      },
      estimatedAmount: {
        type: Number
      },
      actualAmount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    }],
    expenses: [{
      description: {
        type: String
      },
      amount: {
        type: Number
      },
      currency: {
        type: String,
        default: 'USD'
      },
      date: {
        type: Date
      },
      category: {
        type: String
      },
      receiptUrl: {
        type: String
      }
    }]
  },
  // Family members included
  familyMembers: [{
    relationship: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date
    },
    nationality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    },
    includedInApplication: {
      type: Boolean,
      default: true
    },
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    }]
  }],
  // Sharing and collaboration
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    email: {
      type: String
    },
    accessLevel: {
      type: String,
      enum: ['view', 'edit', 'admin'],
      default: 'view'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    },
    lastAccessed: {
      type: Date
    }
  }],
  // Notifications and reminders
  notifications: {
    emailReminders: {
      enabled: {
        type: Boolean,
        default: true
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'custom'],
        default: 'weekly'
      },
      customDays: [{
        type: Number
      }],
      lastSent: {
        type: Date
      }
    },
    upcomingDeadlineThreshold: {
      type: Number, // in days
      default: 14
    },
    pushNotifications: {
      enabled: {
        type: Boolean,
        default: true
      }
    }
  },
  // Metadata
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateName: {
    type: String
  },
  templateCategory: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  notes: {
    type: String
  },
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
RoadmapSchema.index({ userId: 1 });
RoadmapSchema.index({ programId: 1 });
RoadmapSchema.index({ countryId: 1 });
RoadmapSchema.index({ status: 1 });
RoadmapSchema.index({ 'timeline.currentPhase': 1 });
RoadmapSchema.index({ 'progress.overallPercentage': 1 });
RoadmapSchema.index({ isTemplate: 1 });
RoadmapSchema.index({ isPublic: 1 });
RoadmapSchema.index({ tags: 1 });

// Virtual for days remaining
RoadmapSchema.virtual('daysRemaining').get(function() {
  if (!this.timeline.estimatedCompletionDate) return null;
  
  const today = new Date();
  const completionDate = new Date(this.timeline.estimatedCompletionDate);
  const diffTime = completionDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

// Virtual for days since start
RoadmapSchema.virtual('daysSinceStart').get(function() {
  if (!this.timeline.startDate) return null;
  
  const today = new Date();
  const startDate = new Date(this.timeline.startDate);
  const diffTime = today - startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

// Method to update progress
RoadmapSchema.methods.updateProgress = function() {
  // Calculate milestone completion
  const milestoneIds = this.timeline.phases.reduce((ids, phase) => {
    return ids.concat(phase.milestones);
  }, []);
  
  this.progress.totalMilestones = milestoneIds.length;
  
  // This would typically be done after querying the Milestone collection
  // to get the actual completion status of each milestone
  
  // Calculate overall percentage based on weighted phase progress
  const totalWeight = this.timeline.phases.length;
  const weightedSum = this.progress.phaseProgress.reduce((sum, phase) => {
    return sum + phase.percentage;
  }, 0);
  
  this.progress.overallPercentage = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  
  this.lastUpdatedAt = new Date();
  return this.save();
};

// Method to add expense
RoadmapSchema.methods.addExpense = function(expenseData) {
  this.costs.expenses.push(expenseData);
  
  // Update actual total
  const totalExpenses = this.costs.expenses.reduce((sum, expense) => {
    // Simple conversion - in a real app, would use proper currency conversion
    return sum + expense.amount;
  }, 0);
  
  this.costs.actualTotal.amount = totalExpenses;
  
  // Update category totals
  this.costs.categories.forEach(category => {
    const categoryExpenses = this.costs.expenses
      .filter(expense => expense.category === category.name)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    category.actualAmount = categoryExpenses;
  });
  
  this.lastUpdatedAt = new Date();
  return this.save();
};

// Method to share roadmap
RoadmapSchema.methods.shareWith = function(userIdOrEmail, accessLevel = 'view') {
  const shareData = {
    accessLevel,
    sharedAt: new Date()
  };
  
  if (typeof userIdOrEmail === 'string' && userIdOrEmail.includes('@')) {
    shareData.email = userIdOrEmail;
  } else {
    shareData.userId = userIdOrEmail;
  }
  
  // Check if already shared
  const existingShare = this.sharedWith.find(share => {
    return (share.userId && share.userId.toString() === userIdOrEmail.toString()) || 
           (share.email && share.email === userIdOrEmail);
  });
  
  if (existingShare) {
    existingShare.accessLevel = accessLevel;
    existingShare.sharedAt = new Date();
  } else {
    this.sharedWith.push(shareData);
  }
  
  this.lastUpdatedAt = new Date();
  return this.save();
};

// Static method to find user roadmaps
RoadmapSchema.statics.findUserRoadmaps = function(userId) {
  return this.find({ userId })
    .sort({ lastUpdatedAt: -1 })
    .exec();
};

// Static method to find shared roadmaps
RoadmapSchema.statics.findSharedRoadmaps = function(userIdOrEmail) {
  const query = {
    $or: [
      { 'sharedWith.userId': userIdOrEmail },
      { 'sharedWith.email': userIdOrEmail }
    ]
  };
  
  return this.find(query)
    .sort({ lastUpdatedAt: -1 })
    .exec();
};

// Static method to find templates
RoadmapSchema.statics.findTemplates = function(category = null) {
  const query = { 
    isTemplate: true,
    isPublic: true
  };
  
  if (category) {
    query.templateCategory = category;
  }
  
  return this.find(query)
    .sort({ templateName: 1 })
    .exec();
};
```
