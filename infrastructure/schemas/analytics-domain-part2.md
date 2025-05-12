# Analytics Domain Schemas (Part 2)

This document continues the MongoDB schemas for the Analytics Domain collections in the Migratio platform.

## UserJourneys Collection

The UserJourneys collection tracks user paths through the application.

```javascript
// UserJourney Schema
const UserJourneySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  anonymousId: {
    type: String,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    index: true
  },
  duration: {
    type: Number // in seconds
  },
  isCompleted: {
    type: Boolean,
    default: false,
    index: true
  },
  // User information
  userType: {
    type: String,
    enum: ['registered', 'anonymous'],
    required: true,
    index: true
  },
  subscriptionTier: {
    type: String,
    index: true
  },
  userSegment: {
    type: String,
    index: true
  },
  // Session information
  isFirstSession: {
    type: Boolean,
    index: true
  },
  referrer: {
    type: String
  },
  utmSource: {
    type: String,
    index: true
  },
  utmMedium: {
    type: String,
    index: true
  },
  utmCampaign: {
    type: String,
    index: true
  },
  // Device information
  deviceType: {
    type: String,
    enum: ['desktop', 'tablet', 'mobile', 'other'],
    index: true
  },
  browser: {
    type: String,
    index: true
  },
  operatingSystem: {
    type: String,
    index: true
  },
  // Location information
  country: {
    type: String,
    index: true
  },
  region: {
    type: String
  },
  // Journey information
  journeyType: {
    type: String,
    enum: ['onboarding', 'assessment', 'recommendation', 'roadmap', 'document', 'subscription', 'custom'],
    required: true,
    index: true
  },
  journeyName: {
    type: String,
    required: true,
    index: true
  },
  startingPoint: {
    type: String,
    required: true
  },
  endPoint: {
    type: String
  },
  // Journey steps
  steps: [{
    stepNumber: {
      type: Number,
      required: true
    },
    stepName: {
      type: String,
      required: true
    },
    pagePath: {
      type: String
    },
    action: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    duration: {
      type: Number // in seconds
    },
    isCompleted: {
      type: Boolean,
      default: true
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  }],
  // Conversion information
  conversionGoal: {
    type: String,
    index: true
  },
  isConverted: {
    type: Boolean,
    default: false,
    index: true
  },
  conversionStep: {
    type: Number
  },
  conversionTimestamp: {
    type: Date
  },
  conversionValue: {
    type: Number
  },
  // Abandonment information
  isAbandoned: {
    type: Boolean,
    default: false,
    index: true
  },
  abandonmentStep: {
    type: Number
  },
  abandonmentReason: {
    type: String
  },
  // Performance metrics
  averageStepDuration: {
    type: Number // in seconds
  },
  totalInteractions: {
    type: Number,
    default: 0
  },
  errorCount: {
    type: Number,
    default: 0
  },
  // Journey outcomes
  outcomes: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    }
  }],
  // Custom properties
  properties: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
UserJourneySchema.index({ userId: 1, startTime: -1 });
UserJourneySchema.index({ anonymousId: 1, startTime: -1 });
UserJourneySchema.index({ sessionId: 1 });
UserJourneySchema.index({ journeyType: 1, isCompleted: 1 });
UserJourneySchema.index({ journeyName: 1, isConverted: 1 });
UserJourneySchema.index({ startTime: -1 });
UserJourneySchema.index({ userType: 1, journeyType: 1 });
UserJourneySchema.index({ isConverted: 1, conversionGoal: 1 });
UserJourneySchema.index({ isAbandoned: 1 });

// Virtual for completion rate
UserJourneySchema.virtual('completionRate').get(function() {
  if (!this.steps || this.steps.length === 0) return 0;
  
  const completedSteps = this.steps.filter(step => step.isCompleted).length;
  return (completedSteps / this.steps.length) * 100;
});

// Method to add step
UserJourneySchema.methods.addStep = function(stepData) {
  const stepNumber = this.steps.length + 1;
  
  // Calculate duration for previous step if exists
  if (stepNumber > 1) {
    const previousStep = this.steps[stepNumber - 2];
    previousStep.duration = (new Date(stepData.timestamp) - new Date(previousStep.timestamp)) / 1000;
  }
  
  this.steps.push({
    stepNumber,
    ...stepData,
    timestamp: stepData.timestamp || new Date()
  });
  
  this.totalInteractions += 1;
  
  return this.save();
};

// Method to complete journey
UserJourneySchema.methods.complete = function(endPoint) {
  this.isCompleted = true;
  this.endPoint = endPoint;
  this.endTime = new Date();
  this.duration = (new Date(this.endTime) - new Date(this.startTime)) / 1000;
  
  // Calculate average step duration
  if (this.steps.length > 0) {
    const totalDuration = this.steps.reduce((sum, step) => sum + (step.duration || 0), 0);
    this.averageStepDuration = totalDuration / this.steps.length;
  }
  
  return this.save();
};

// Method to mark conversion
UserJourneySchema.methods.markConversion = function(goal, value) {
  this.isConverted = true;
  this.conversionGoal = goal;
  this.conversionStep = this.steps.length;
  this.conversionTimestamp = new Date();
  this.conversionValue = value;
  
  return this.save();
};

// Method to mark abandonment
UserJourneySchema.methods.markAbandonment = function(reason) {
  this.isAbandoned = true;
  this.abandonmentStep = this.steps.length;
  this.abandonmentReason = reason;
  this.endTime = new Date();
  this.duration = (new Date(this.endTime) - new Date(this.startTime)) / 1000;
  
  return this.save();
};

// Method to add outcome
UserJourneySchema.methods.addOutcome = function(name, value) {
  this.outcomes.push({
    name,
    value,
    timestamp: new Date()
  });
  
  return this.save();
};

// Static method to create journey
UserJourneySchema.statics.createJourney = function(userData, journeyData) {
  return this.create({
    userId: userData.userId,
    anonymousId: userData.anonymousId,
    sessionId: userData.sessionId,
    startTime: new Date(),
    userType: userData.userId ? 'registered' : 'anonymous',
    subscriptionTier: userData.subscriptionTier,
    userSegment: userData.userSegment,
    isFirstSession: userData.isFirstSession,
    referrer: userData.referrer,
    utmSource: userData.utmSource,
    utmMedium: userData.utmMedium,
    utmCampaign: userData.utmCampaign,
    deviceType: userData.deviceType,
    browser: userData.browser,
    operatingSystem: userData.operatingSystem,
    country: userData.country,
    region: userData.region,
    journeyType: journeyData.journeyType,
    journeyName: journeyData.journeyName,
    startingPoint: journeyData.startingPoint,
    conversionGoal: journeyData.conversionGoal,
    properties: journeyData.properties
  });
};

// Static method to find active journeys
UserJourneySchema.statics.findActiveJourneys = function(userId) {
  return this.find({
    userId,
    isCompleted: false,
    isAbandoned: false
  })
  .sort({ startTime: -1 })
  .exec();
};

// Static method to get journey metrics
UserJourneySchema.statics.getJourneyMetrics = function(journeyType, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        journeyType,
        startTime: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          journeyName: '$journeyName',
          day: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }
        },
        totalJourneys: { $sum: 1 },
        completedJourneys: { $sum: { $cond: ['$isCompleted', 1, 0] } },
        abandonedJourneys: { $sum: { $cond: ['$isAbandoned', 1, 0] } },
        convertedJourneys: { $sum: { $cond: ['$isConverted', 1, 0] } },
        averageDuration: { $avg: '$duration' },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        _id: 0,
        journeyName: '$_id.journeyName',
        day: '$_id.day',
        totalJourneys: 1,
        completedJourneys: 1,
        abandonedJourneys: 1,
        convertedJourneys: 1,
        completionRate: {
          $multiply: [
            { $divide: ['$completedJourneys', '$totalJourneys'] },
            100
          ]
        },
        conversionRate: {
          $multiply: [
            { $divide: ['$convertedJourneys', '$totalJourneys'] },
            100
          ]
        },
        abandonmentRate: {
          $multiply: [
            { $divide: ['$abandonedJourneys', '$totalJourneys'] },
            100
          ]
        },
        averageDuration: 1,
        uniqueUsers: { $size: '$uniqueUsers' }
      }
    },
    {
      $sort: { day: 1, journeyName: 1 }
    }
  ]);
};
```
