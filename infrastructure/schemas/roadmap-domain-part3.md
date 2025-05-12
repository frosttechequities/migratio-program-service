# Roadmap Domain Schemas (Part 3)

This document completes the MongoDB schemas for the Roadmap Domain collections in the Migratio platform.

## Milestones Collection

The Milestones collection stores milestone information for roadmaps.

```javascript
// Milestone Schema
const MilestoneSchema = new mongoose.Schema({
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  phaseId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  phaseName: {
    type: String
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'delayed', 'at_risk'],
    default: 'not_started',
    index: true
  },
  completedDate: {
    type: Date
  },
  importance: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  isCriticalPath: {
    type: Boolean,
    default: false,
    index: true
  },
  // Dependencies
  dependencies: [{
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone'
    },
    title: {
      type: String
    },
    type: {
      type: String,
      enum: ['required', 'optional'],
      default: 'required'
    }
  }],
  // Related items
  relatedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  requiredDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  // Milestone details
  category: {
    type: String,
    index: true
  },
  icon: {
    type: String
  },
  color: {
    type: String
  },
  location: {
    type: String
  },
  cost: {
    amount: {
      type: Number
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  // Completion criteria
  completionCriteria: [{
    description: {
      type: String,
      required: true
    },
    isMet: {
      type: Boolean,
      default: false
    },
    verificationMethod: {
      type: String
    }
  }],
  // Notifications
  notifications: [{
    type: {
      type: String,
      enum: ['before', 'on', 'after'],
      required: true
    },
    days: {
      type: Number,
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date
    },
    method: {
      type: String,
      enum: ['email', 'push', 'sms', 'in_app'],
      default: 'email'
    }
  }],
  // Notes and attachments
  notes: [{
    text: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    name: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String
    },
    fileSize: {
      type: Number
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Activity tracking
  activityLog: [{
    action: {
      type: String,
      enum: ['created', 'updated', 'status_changed', 'completed', 'delayed', 'comment_added', 'attachment_added'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    details: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateId: {
    type: String,
    index: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes
MilestoneSchema.index({ roadmapId: 1 });
MilestoneSchema.index({ userId: 1 });
MilestoneSchema.index({ date: 1 });
MilestoneSchema.index({ status: 1 });
MilestoneSchema.index({ isCriticalPath: 1 });
MilestoneSchema.index({ category: 1 });
MilestoneSchema.index({ isTemplate: 1 });
MilestoneSchema.index({ tags: 1 });

// Virtual for days until milestone
MilestoneSchema.virtual('daysUntil').get(function() {
  if (!this.date) return null;
  
  const today = new Date();
  const milestoneDate = new Date(this.date);
  const diffTime = milestoneDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for completion percentage
MilestoneSchema.virtual('completionPercentage').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'not_started') return 0;
  
  // Calculate based on completion criteria if available
  if (this.completionCriteria && this.completionCriteria.length > 0) {
    const metCriteria = this.completionCriteria.filter(criterion => criterion.isMet).length;
    return Math.round((metCriteria / this.completionCriteria.length) * 100);
  }
  
  // Calculate based on related tasks if available
  if (this.relatedTasks && this.relatedTasks.length > 0) {
    // This would typically be calculated after populating the related tasks
    // and checking their completion status
    return 50; // Placeholder
  }
  
  // Default for in_progress
  return 50;
});

// Method to complete milestone
MilestoneSchema.methods.complete = function(userId) {
  this.status = 'completed';
  this.completedDate = new Date();
  
  this.activityLog.push({
    action: 'completed',
    timestamp: new Date(),
    performedBy: userId
  });
  
  return this.save();
};

// Method to delay milestone
MilestoneSchema.methods.delay = function(newDate, reason, userId) {
  this.status = 'delayed';
  
  const oldDate = this.date;
  this.date = newDate;
  
  this.activityLog.push({
    action: 'delayed',
    timestamp: new Date(),
    performedBy: userId,
    details: {
      oldDate,
      newDate,
      reason
    }
  });
  
  return this.save();
};

// Method to add note
MilestoneSchema.methods.addNote = function(text, userId) {
  this.notes.push({
    text,
    createdBy: userId,
    createdAt: new Date()
  });
  
  this.activityLog.push({
    action: 'comment_added',
    timestamp: new Date(),
    performedBy: userId
  });
  
  return this.save();
};

// Method to add completion criterion
MilestoneSchema.methods.addCompletionCriterion = function(description, verificationMethod) {
  this.completionCriteria.push({
    description,
    isMet: false,
    verificationMethod
  });
  
  return this.save();
};

// Method to meet completion criterion
MilestoneSchema.methods.meetCriterion = function(criterionId) {
  const criterion = this.completionCriteria.id(criterionId);
  
  if (!criterion) {
    throw new Error('Completion criterion not found');
  }
  
  criterion.isMet = true;
  
  // Check if all criteria are met
  const allMet = this.completionCriteria.every(c => c.isMet);
  if (allMet) {
    this.status = 'completed';
    this.completedDate = new Date();
  }
  
  return this.save();
};

// Static method to find milestones by roadmap
MilestoneSchema.statics.findByRoadmap = function(roadmapId) {
  return this.find({ roadmapId })
    .sort({ date: 1 })
    .exec();
};

// Static method to find upcoming milestones
MilestoneSchema.statics.findUpcomingMilestones = function(userId, days = 30) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return this.find({
    userId,
    date: { $gte: today, $lte: futureDate },
    status: { $ne: 'completed' }
  })
  .sort({ date: 1 })
  .exec();
};

// Static method to find critical path milestones
MilestoneSchema.statics.findCriticalPathMilestones = function(roadmapId) {
  return this.find({
    roadmapId,
    isCriticalPath: true
  })
  .sort({ date: 1 })
  .exec();
};
```

## Documents Collection

The Documents collection stores document information for roadmaps.

```javascript
// Document Schema
const DocumentSchema = new mongoose.Schema({
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  documentType: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    index: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'obtained', 'submitted', 'verified', 'rejected', 'expired'],
    default: 'not_started',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  // Timeline information
  requiredBy: {
    type: Date,
    index: true
  },
  obtainedDate: {
    type: Date
  },
  submittedDate: {
    type: Date
  },
  verifiedDate: {
    type: Date
  },
  expiryDate: {
    type: Date,
    index: true
  },
  // Document details
  isOriginalRequired: {
    type: Boolean,
    default: false
  },
  isTranslationRequired: {
    type: Boolean,
    default: false
  },
  translationLanguages: [{
    type: String
  }],
  isCertificationRequired: {
    type: Boolean,
    default: false
  },
  certificationType: {
    type: String,
    enum: ['notarized', 'apostille', 'consular', 'sworn_translation', 'other']
  },
  issuingAuthority: {
    type: String
  },
  format: {
    type: String,
    enum: ['physical', 'digital', 'both'],
    default: 'both'
  },
  // Cost information
  cost: {
    amount: {
      type: Number
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paid: {
      type: Boolean,
      default: false
    },
    paidDate: {
      type: Date
    },
    receiptUrl: {
      type: String
    }
  },
  // File information
  files: [{
    fileType: {
      type: String,
      enum: ['original', 'translation', 'certified', 'receipt', 'other'],
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    mimeType: {
      type: String
    },
    fileSize: {
      type: Number
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    language: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: {
      type: Date
    }
  }],
  // Related items
  relatedMilestones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone'
  }],
  relatedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  // Document requirements
  requirements: [{
    description: {
      type: String,
      required: true
    },
    isMet: {
      type: Boolean,
      default: false
    }
  }],
  // Notes and instructions
  notes: [{
    text: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  instructions: {
    type: String
  },
  // Reminders
  reminders: [{
    type: {
      type: String,
      enum: ['obtain', 'submit', 'expiry'],
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date
    }
  }],
  // Activity tracking
  activityLog: [{
    action: {
      type: String,
      enum: ['created', 'updated', 'status_changed', 'file_uploaded', 'file_removed', 'submitted', 'verified', 'rejected', 'comment_added'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    details: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateId: {
    type: String,
    index: true
  },
  tags: [{
    type: String
  }],
  isRequired: {
    type: Boolean,
    default: true
  },
  visibleToAuthorities: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
DocumentSchema.index({ roadmapId: 1 });
DocumentSchema.index({ userId: 1 });
DocumentSchema.index({ documentType: 1 });
DocumentSchema.index({ category: 1 });
DocumentSchema.index({ status: 1 });
DocumentSchema.index({ requiredBy: 1 });
DocumentSchema.index({ expiryDate: 1 });
DocumentSchema.index({ isTemplate: 1 });
DocumentSchema.index({ tags: 1 });

// Virtual for days until required
DocumentSchema.virtual('daysUntilRequired').get(function() {
  if (!this.requiredBy) return null;
  
  const today = new Date();
  const requiredDate = new Date(this.requiredBy);
  const diffTime = requiredDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for days until expiry
DocumentSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiryDate) return null;
  
  const today = new Date();
  const expiryDate = new Date(this.expiryDate);
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for completion percentage
DocumentSchema.virtual('completionPercentage').get(function() {
  const statusValues = {
    'not_started': 0,
    'in_progress': 30,
    'obtained': 60,
    'submitted': 80,
    'verified': 100,
    'rejected': 20,
    'expired': 0
  };
  
  return statusValues[this.status] || 0;
});

// Method to upload file
DocumentSchema.methods.uploadFile = function(fileData, userId) {
  this.files.push({
    ...fileData,
    uploadedAt: new Date(),
    uploadedBy: userId
  });
  
  // Update status if this is the first file
  if (this.status === 'not_started') {
    this.status = 'in_progress';
  }
  
  // If this is an original document and status is in_progress, update to obtained
  if (fileData.fileType === 'original' && this.status === 'in_progress') {
    this.status = 'obtained';
    this.obtainedDate = new Date();
  }
  
  this.activityLog.push({
    action: 'file_uploaded',
    timestamp: new Date(),
    performedBy: userId,
    details: {
      fileType: fileData.fileType,
      fileName: fileData.fileName
    }
  });
  
  return this.save();
};

// Method to mark as submitted
DocumentSchema.methods.markAsSubmitted = function(userId, submissionDetails) {
  this.status = 'submitted';
  this.submittedDate = new Date();
  
  this.activityLog.push({
    action: 'submitted',
    timestamp: new Date(),
    performedBy: userId,
    details: submissionDetails
  });
  
  return this.save();
};

// Method to verify document
DocumentSchema.methods.verify = function(userId, verificationDetails) {
  this.status = 'verified';
  this.verifiedDate = new Date();
  
  this.activityLog.push({
    action: 'verified',
    timestamp: new Date(),
    performedBy: userId,
    details: verificationDetails
  });
  
  return this.save();
};

// Method to reject document
DocumentSchema.methods.reject = function(userId, rejectionReason) {
  this.status = 'rejected';
  
  this.activityLog.push({
    action: 'rejected',
    timestamp: new Date(),
    performedBy: userId,
    details: {
      reason: rejectionReason
    }
  });
  
  return this.save();
};

// Method to add note
DocumentSchema.methods.addNote = function(text, userId) {
  this.notes.push({
    text,
    createdBy: userId,
    createdAt: new Date()
  });
  
  this.activityLog.push({
    action: 'comment_added',
    timestamp: new Date(),
    performedBy: userId
  });
  
  return this.save();
};

// Method to add reminder
DocumentSchema.methods.addReminder = function(reminderType, date) {
  this.reminders.push({
    type: reminderType,
    date,
    sent: false
  });
  
  return this.save();
};

// Static method to find documents by roadmap
DocumentSchema.statics.findByRoadmap = function(roadmapId) {
  return this.find({ roadmapId })
    .sort({ requiredBy: 1 })
    .exec();
};

// Static method to find documents by status
DocumentSchema.statics.findByStatus = function(userId, status) {
  return this.find({ userId, status })
    .sort({ requiredBy: 1 })
    .exec();
};

// Static method to find expiring documents
DocumentSchema.statics.findExpiringDocuments = function(userId, days = 90) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return this.find({
    userId,
    expiryDate: { $gte: today, $lte: futureDate },
    status: { $in: ['obtained', 'submitted', 'verified'] }
  })
  .sort({ expiryDate: 1 })
  .exec();
};
```
