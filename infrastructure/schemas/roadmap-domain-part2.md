# Roadmap Domain Schemas (Part 2)

This document continues the MongoDB schemas for the Roadmap Domain collections in the Migratio platform.

## Timelines Collection

The Timelines collection stores detailed timeline information for roadmaps.

```javascript
// Timeline Schema
const TimelineSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  // Timeline events
  events: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    eventType: {
      type: String,
      enum: ['milestone', 'task', 'deadline', 'appointment', 'reminder', 'custom'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    allDay: {
      type: Boolean,
      default: true
    },
    location: {
      type: String
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'delayed'],
      default: 'scheduled'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    relatedItemType: {
      type: String,
      enum: ['milestone', 'task', 'document', 'appointment', 'custom']
    },
    relatedItemId: {
      type: mongoose.Schema.Types.ObjectId
    },
    color: {
      type: String
    },
    icon: {
      type: String
    },
    isVisible: {
      type: Boolean,
      default: true
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    reminderDate: {
      type: Date
    },
    notes: {
      type: String
    },
    attachments: [{
      name: {
        type: String
      },
      url: {
        type: String
      },
      type: {
        type: String
      }
    }]
  }],
  // Timeline phases
  phases: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    color: {
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
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  // Critical path
  criticalPath: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId
    },
    title: {
      type: String
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    order: {
      type: Number
    }
  }],
  // Timeline adjustments
  adjustments: [{
    date: {
      type: Date,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    adjustmentType: {
      type: String,
      enum: ['delay', 'acceleration', 'extension', 'reduction'],
      required: true
    },
    affectedPhases: [{
      phaseId: {
        type: mongoose.Schema.Types.ObjectId
      },
      phaseName: {
        type: String
      },
      originalStartDate: {
        type: Date
      },
      originalEndDate: {
        type: Date
      },
      newStartDate: {
        type: Date
      },
      newEndDate: {
        type: Date
      }
    }],
    affectedEvents: [{
      eventId: {
        type: mongoose.Schema.Types.ObjectId
      },
      eventTitle: {
        type: String
      },
      originalDate: {
        type: Date
      },
      newDate: {
        type: Date
      }
    }],
    daysChanged: {
      type: Number
    },
    madeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // External calendar integration
  externalCalendars: [{
    calendarType: {
      type: String,
      enum: ['google', 'outlook', 'apple', 'other'],
      required: true
    },
    calendarId: {
      type: String,
      required: true
    },
    lastSynced: {
      type: Date
    },
    syncEnabled: {
      type: Boolean,
      default: true
    },
    eventTypes: [{
      type: String,
      enum: ['milestone', 'task', 'deadline', 'appointment', 'reminder', 'all']
    }]
  }],
  // Metadata
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  version: {
    type: Number,
    default: 1
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
TimelineSchema.index({ roadmapId: 1 });
TimelineSchema.index({ userId: 1 });
TimelineSchema.index({ 'events.startDate': 1 });
TimelineSchema.index({ 'events.status': 1 });
TimelineSchema.index({ 'events.eventType': 1 });
TimelineSchema.index({ 'phases.status': 1 });
TimelineSchema.index({ lastUpdatedAt: -1 });

// Virtual for duration in days
TimelineSchema.virtual('durationDays').get(function() {
  if (!this.startDate || !this.endDate) return null;
  
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

// Method to add event
TimelineSchema.methods.addEvent = function(eventData) {
  this.events.push(eventData);
  this.lastUpdatedAt = new Date();
  return this.save();
};

// Method to update event
TimelineSchema.methods.updateEvent = function(eventId, eventData) {
  const eventIndex = this.events.findIndex(e => e._id.toString() === eventId.toString());
  
  if (eventIndex === -1) {
    throw new Error('Event not found');
  }
  
  this.events[eventIndex] = { ...this.events[eventIndex].toObject(), ...eventData };
  this.lastUpdatedAt = new Date();
  return this.save();
};

// Method to get upcoming events
TimelineSchema.methods.getUpcomingEvents = function(days = 14) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return this.events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate >= today && eventDate <= futureDate;
  }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
};

// Method to adjust timeline
TimelineSchema.methods.adjustTimeline = function(adjustmentData) {
  this.adjustments.push(adjustmentData);
  
  // Update affected phases
  adjustmentData.affectedPhases.forEach(affectedPhase => {
    const phase = this.phases.find(p => p._id.toString() === affectedPhase.phaseId.toString());
    if (phase) {
      phase.startDate = affectedPhase.newStartDate;
      phase.endDate = affectedPhase.newEndDate;
    }
  });
  
  // Update affected events
  adjustmentData.affectedEvents.forEach(affectedEvent => {
    const event = this.events.find(e => e._id.toString() === affectedEvent.eventId.toString());
    if (event) {
      event.startDate = affectedEvent.newDate;
      if (event.endDate) {
        // Maintain the same duration
        const originalDuration = new Date(event.endDate) - new Date(affectedEvent.originalDate);
        const newEndDate = new Date(affectedEvent.newDate);
        newEndDate.setTime(newEndDate.getTime() + originalDuration);
        event.endDate = newEndDate;
      }
    }
  });
  
  // Update overall timeline dates if needed
  const earliestEvent = this.events.reduce((earliest, event) => {
    return new Date(event.startDate) < new Date(earliest.startDate) ? event : earliest;
  }, this.events[0]);
  
  const latestEvent = this.events.reduce((latest, event) => {
    const eventEndDate = event.endDate || event.startDate;
    const latestEndDate = latest.endDate || latest.startDate;
    return new Date(eventEndDate) > new Date(latestEndDate) ? event : latest;
  }, this.events[0]);
  
  if (earliestEvent && latestEvent) {
    this.startDate = earliestEvent.startDate;
    this.endDate = latestEvent.endDate || latestEvent.startDate;
  }
  
  this.lastUpdatedAt = new Date();
  this.version += 1;
  return this.save();
};

// Static method to get timeline by roadmap
TimelineSchema.statics.getByRoadmap = function(roadmapId) {
  return this.findOne({ roadmapId }).exec();
};

// Static method to get user timelines
TimelineSchema.statics.getUserTimelines = function(userId) {
  return this.find({ userId })
    .sort({ lastUpdatedAt: -1 })
    .exec();
};
```

## Tasks Collection

The Tasks collection stores tasks associated with roadmaps.

```javascript
// Task Schema
const TaskSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'blocked', 'deferred'],
    default: 'not_started',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true
  },
  dueDate: {
    type: Date,
    index: true
  },
  completedDate: {
    type: Date
  },
  estimatedTime: {
    value: {
      type: Number
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days', 'weeks'],
      default: 'hours'
    }
  },
  actualTime: {
    value: {
      type: Number
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days', 'weeks'],
      default: 'hours'
    }
  },
  // Task relationships
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    index: true
  },
  subtasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  dependencies: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    type: {
      type: String,
      enum: ['finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish'],
      default: 'finish_to_start'
    }
  }],
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone',
    index: true
  },
  phaseId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  // Task details
  category: {
    type: String,
    index: true
  },
  tags: [{
    type: String
  }],
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
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  // Related items
  relatedDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  checklist: [{
    item: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
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
  // Reminders
  reminders: [{
    date: {
      type: Date,
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['email', 'push', 'sms', 'in_app'],
      default: 'email'
    }
  }],
  // Activity tracking
  activityLog: [{
    action: {
      type: String,
      enum: ['created', 'updated', 'status_changed', 'assigned', 'comment_added', 'attachment_added', 'reminder_set'],
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
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: {
      type: Number
    },
    endDate: {
      type: Date
    },
    endAfterOccurrences: {
      type: Number
    }
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateId: {
    type: String,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
TaskSchema.index({ roadmapId: 1 });
TaskSchema.index({ userId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ category: 1 });
TaskSchema.index({ tags: 1 });
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ isTemplate: 1 });

// Virtual for days until due
TaskSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  
  const today = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for completion percentage
TaskSchema.virtual('completionPercentage').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'not_started') return 0;
  
  // Calculate based on checklist if available
  if (this.checklist && this.checklist.length > 0) {
    const completedItems = this.checklist.filter(item => item.completed).length;
    return Math.round((completedItems / this.checklist.length) * 100);
  }
  
  // Default for in_progress
  return 50;
});

// Method to complete task
TaskSchema.methods.complete = function(userId) {
  this.status = 'completed';
  this.completedDate = new Date();
  
  this.activityLog.push({
    action: 'status_changed',
    timestamp: new Date(),
    performedBy: userId,
    details: {
      oldStatus: this.status,
      newStatus: 'completed'
    }
  });
  
  return this.save();
};

// Method to add checklist item
TaskSchema.methods.addChecklistItem = function(item) {
  this.checklist.push({
    item,
    completed: false
  });
  
  return this.save();
};

// Method to toggle checklist item
TaskSchema.methods.toggleChecklistItem = function(itemId) {
  const item = this.checklist.id(itemId);
  
  if (!item) {
    throw new Error('Checklist item not found');
  }
  
  item.completed = !item.completed;
  item.completedAt = item.completed ? new Date() : null;
  
  return this.save();
};

// Method to add note
TaskSchema.methods.addNote = function(text, userId) {
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

// Method to assign task
TaskSchema.methods.assignTo = function(userId, assignedBy) {
  this.assignedTo = userId;
  
  this.activityLog.push({
    action: 'assigned',
    timestamp: new Date(),
    performedBy: assignedBy,
    details: {
      assignedTo: userId
    }
  });
  
  return this.save();
};

// Static method to find tasks by roadmap
TaskSchema.statics.findByRoadmap = function(roadmapId) {
  return this.find({ roadmapId })
    .sort({ dueDate: 1 })
    .exec();
};

// Static method to find overdue tasks
TaskSchema.statics.findOverdueTasks = function(userId) {
  return this.find({
    userId,
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' }
  })
  .sort({ dueDate: 1 })
  .exec();
};

// Static method to find upcoming tasks
TaskSchema.statics.findUpcomingTasks = function(userId, days = 7) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return this.find({
    userId,
    dueDate: { $gte: today, $lte: futureDate },
    status: { $ne: 'completed' }
  })
  .sort({ dueDate: 1 })
  .exec();
};
```
