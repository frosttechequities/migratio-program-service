const mongoose = require('mongoose');

/**
 * Milestone Schema
 * Represents a milestone in the immigration roadmap
 */
const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['document', 'application', 'preparation', 'travel', 'settlement', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'delayed', 'blocked'],
    default: 'not_started'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  startDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  estimatedDuration: {
    value: {
      type: Number
    },
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months']
    }
  },
  dependsOn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone'
  }],
  tasks: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'blocked'],
      default: 'not_started'
    },
    dueDate: {
      type: Date
    },
    completedDate: {
      type: Date
    },
    assignedTo: {
      type: String
    },
    notes: {
      type: String
    }
  }],
  documents: [{
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    required: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['missing', 'pending', 'uploaded', 'verified', 'rejected'],
      default: 'missing'
    }
  }],
  cost: {
    amount: {
      type: Number
    },
    currency: {
      type: String
    },
    description: {
      type: String
    }
  },
  notes: {
    type: String
  },
  resources: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String
    },
    type: {
      type: String,
      enum: ['article', 'video', 'form', 'checklist', 'contact', 'other']
    },
    description: {
      type: String
    }
  }]
}, { _id: true });

/**
 * Phase Schema
 * Represents a phase in the immigration roadmap
 */
const phaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  order: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'delayed'],
    default: 'not_started'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  milestones: [milestoneSchema],
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

/**
 * Roadmap Schema
 * Represents an immigration roadmap
 */
const roadmapSchema = new mongoose.Schema({
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
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date
  },
  targetCompletionDate: {
    type: Date
  },
  actualCompletionDate: {
    type: Date
  },
  phases: [phaseSchema],
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  estimatedCost: {
    total: {
      type: Number
    },
    currency: {
      type: String
    },
    breakdown: [{
      category: {
        type: String
      },
      amount: {
        type: Number
      },
      description: {
        type: String
      }
    }]
  },
  notes: {
    type: String
  },
  tags: [{
    type: String
  }],
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap'
  },
  visibility: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private'
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor'],
      default: 'viewer'
    }
  }]
}, {
  timestamps: true
});

// Indexes
roadmapSchema.index({ userId: 1, status: 1 });
roadmapSchema.index({ programId: 1 });
roadmapSchema.index({ isTemplate: 1 });
roadmapSchema.index({ visibility: 1 });

// Pre-save hook to update timestamps
roadmapSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to calculate completion percentage
roadmapSchema.methods.calculateCompletionPercentage = function() {
  if (!this.phases || this.phases.length === 0) {
    return 0;
  }
  
  // Calculate completion percentage for each phase
  this.phases.forEach(phase => {
    if (!phase.milestones || phase.milestones.length === 0) {
      phase.completionPercentage = 0;
      return;
    }
    
    const totalMilestones = phase.milestones.length;
    const completedMilestones = phase.milestones.filter(
      milestone => milestone.status === 'completed'
    ).length;
    
    phase.completionPercentage = Math.round((completedMilestones / totalMilestones) * 100);
  });
  
  // Calculate overall completion percentage
  const totalPhases = this.phases.length;
  const phaseCompletionSum = this.phases.reduce(
    (sum, phase) => sum + phase.completionPercentage,
    0
  );
  
  this.completionPercentage = Math.round(phaseCompletionSum / totalPhases);
  
  return this.completionPercentage;
};

// Method to update milestone status
roadmapSchema.methods.updateMilestoneStatus = function(phaseIndex, milestoneIndex, status) {
  if (!this.phases[phaseIndex] || !this.phases[phaseIndex].milestones[milestoneIndex]) {
    throw new Error('Phase or milestone not found');
  }
  
  this.phases[phaseIndex].milestones[milestoneIndex].status = status;
  
  if (status === 'completed') {
    this.phases[phaseIndex].milestones[milestoneIndex].completedDate = new Date();
  } else {
    this.phases[phaseIndex].milestones[milestoneIndex].completedDate = undefined;
  }
  
  // Update phase status
  this._updatePhaseStatus(phaseIndex);
  
  // Recalculate completion percentage
  this.calculateCompletionPercentage();
  
  return this;
};

// Method to update task status
roadmapSchema.methods.updateTaskStatus = function(phaseIndex, milestoneIndex, taskIndex, status) {
  if (!this.phases[phaseIndex] || 
      !this.phases[phaseIndex].milestones[milestoneIndex] || 
      !this.phases[phaseIndex].milestones[milestoneIndex].tasks[taskIndex]) {
    throw new Error('Phase, milestone, or task not found');
  }
  
  this.phases[phaseIndex].milestones[milestoneIndex].tasks[taskIndex].status = status;
  
  if (status === 'completed') {
    this.phases[phaseIndex].milestones[milestoneIndex].tasks[taskIndex].completedDate = new Date();
  } else {
    this.phases[phaseIndex].milestones[milestoneIndex].tasks[taskIndex].completedDate = undefined;
  }
  
  // Update milestone status based on tasks
  this._updateMilestoneStatus(phaseIndex, milestoneIndex);
  
  // Update phase status
  this._updatePhaseStatus(phaseIndex);
  
  // Recalculate completion percentage
  this.calculateCompletionPercentage();
  
  return this;
};

// Method to update document status
roadmapSchema.methods.updateDocumentStatus = function(phaseIndex, milestoneIndex, documentIndex, status) {
  if (!this.phases[phaseIndex] || 
      !this.phases[phaseIndex].milestones[milestoneIndex] || 
      !this.phases[phaseIndex].milestones[milestoneIndex].documents[documentIndex]) {
    throw new Error('Phase, milestone, or document not found');
  }
  
  this.phases[phaseIndex].milestones[milestoneIndex].documents[documentIndex].status = status;
  
  // Update milestone status based on required documents
  this._updateMilestoneStatus(phaseIndex, milestoneIndex);
  
  // Update phase status
  this._updatePhaseStatus(phaseIndex);
  
  // Recalculate completion percentage
  this.calculateCompletionPercentage();
  
  return this;
};

// Helper method to update milestone status based on tasks and documents
roadmapSchema.methods._updateMilestoneStatus = function(phaseIndex, milestoneIndex) {
  const milestone = this.phases[phaseIndex].milestones[milestoneIndex];
  
  // Check if all tasks are completed
  const allTasksCompleted = milestone.tasks.length > 0 && 
    milestone.tasks.every(task => task.status === 'completed');
  
  // Check if all required documents are uploaded or verified
  const allRequiredDocumentsReady = milestone.documents.length > 0 && 
    milestone.documents
      .filter(doc => doc.required)
      .every(doc => ['uploaded', 'verified'].includes(doc.status));
  
  // Update milestone status
  if (allTasksCompleted && allRequiredDocumentsReady) {
    milestone.status = 'completed';
    milestone.completedDate = new Date();
  } else if (milestone.tasks.some(task => task.status === 'in_progress') || 
             milestone.documents.some(doc => doc.status === 'pending')) {
    milestone.status = 'in_progress';
  } else if (milestone.tasks.some(task => task.status === 'blocked') || 
             milestone.documents.some(doc => doc.status === 'rejected')) {
    milestone.status = 'blocked';
  } else {
    milestone.status = 'not_started';
  }
};

// Helper method to update phase status based on milestones
roadmapSchema.methods._updatePhaseStatus = function(phaseIndex) {
  const phase = this.phases[phaseIndex];
  
  // Check if all milestones are completed
  const allMilestonesCompleted = phase.milestones.length > 0 && 
    phase.milestones.every(milestone => milestone.status === 'completed');
  
  // Check if any milestones are in progress
  const anyMilestonesInProgress = phase.milestones.some(
    milestone => milestone.status === 'in_progress'
  );
  
  // Check if any milestones are delayed
  const anyMilestonesDelayed = phase.milestones.some(
    milestone => milestone.status === 'delayed'
  );
  
  // Update phase status
  if (allMilestonesCompleted) {
    phase.status = 'completed';
    phase.endDate = new Date();
  } else if (anyMilestonesDelayed) {
    phase.status = 'delayed';
  } else if (anyMilestonesInProgress) {
    phase.status = 'in_progress';
    if (!phase.startDate) {
      phase.startDate = new Date();
    }
  } else {
    phase.status = 'not_started';
  }
};

// Static method to find roadmaps by user
roadmapSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ updatedAt: -1 });
};

// Static method to find active roadmaps by user
roadmapSchema.statics.findActiveByUser = function(userId) {
  return this.find({ userId, status: 'active' }).sort({ updatedAt: -1 });
};

// Static method to find roadmaps by program
roadmapSchema.statics.findByProgram = function(programId) {
  return this.find({ programId }).sort({ updatedAt: -1 });
};

// Static method to find roadmap templates
roadmapSchema.statics.findTemplates = function() {
  return this.find({ isTemplate: true }).sort({ updatedAt: -1 });
};

// Static method to find public roadmaps
roadmapSchema.statics.findPublic = function() {
  return this.find({ visibility: 'public' }).sort({ updatedAt: -1 });
};

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

module.exports = { Roadmap };
