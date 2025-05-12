# Analytics Domain Schemas (Part 1)

This document defines the MongoDB schemas for the Analytics Domain collections in the Migratio platform.

## Events Collection

The Events collection stores user activity and system events for analytics.

```javascript
// Event Schema
const EventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  label: {
    type: String,
    index: true
  },
  value: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  // User information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  anonymousId: {
    type: String,
    index: true
  },
  userType: {
    type: String,
    enum: ['registered', 'anonymous', 'system'],
    default: 'registered',
    index: true
  },
  subscriptionTier: {
    type: String,
    index: true
  },
  // Session information
  sessionId: {
    type: String,
    index: true
  },
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
  utmTerm: {
    type: String
  },
  utmContent: {
    type: String
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
  browserVersion: {
    type: String
  },
  operatingSystem: {
    type: String,
    index: true
  },
  operatingSystemVersion: {
    type: String
  },
  screenResolution: {
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  // Location information
  country: {
    type: String,
    index: true
  },
  region: {
    type: String,
    index: true
  },
  city: {
    type: String
  },
  // Page information
  page: {
    path: {
      type: String,
      index: true
    },
    title: {
      type: String
    },
    url: {
      type: String
    },
    referrer: {
      type: String
    }
  },
  // Feature information
  feature: {
    name: {
      type: String,
      index: true
    },
    version: {
      type: String
    },
    module: {
      type: String,
      index: true
    }
  },
  // Entity information
  entity: {
    type: {
      type: String,
      index: true
    },
    id: {
      type: String,
      index: true
    },
    name: {
      type: String
    },
    properties: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  // Performance metrics
  performance: {
    loadTime: {
      type: Number
    },
    responseTime: {
      type: Number
    },
    processingTime: {
      type: Number
    },
    renderTime: {
      type: Number
    },
    memoryUsage: {
      type: Number
    }
  },
  // Error information
  error: {
    code: {
      type: String
    },
    message: {
      type: String
    },
    stack: {
      type: String
    },
    context: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  // Custom properties
  properties: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
EventSchema.index({ eventType: 1, timestamp: -1 });
EventSchema.index({ category: 1, action: 1 });
EventSchema.index({ userId: 1, timestamp: -1 });
EventSchema.index({ anonymousId: 1, timestamp: -1 });
EventSchema.index({ sessionId: 1, timestamp: 1 });
EventSchema.index({ 'page.path': 1, timestamp: -1 });
EventSchema.index({ 'feature.name': 1, timestamp: -1 });
EventSchema.index({ 'entity.type': 1, 'entity.id': 1 });
EventSchema.index({ timestamp: -1 });

// Static method to track page view
EventSchema.statics.trackPageView = function(pageData, userData, sessionData) {
  return this.create({
    eventType: 'page_view',
    category: 'engagement',
    action: 'view',
    label: pageData.title,
    timestamp: new Date(),
    userId: userData.userId,
    anonymousId: userData.anonymousId,
    userType: userData.userType,
    subscriptionTier: userData.subscriptionTier,
    sessionId: sessionData.sessionId,
    isFirstSession: sessionData.isFirstSession,
    referrer: sessionData.referrer,
    utmSource: sessionData.utmSource,
    utmMedium: sessionData.utmMedium,
    utmCampaign: sessionData.utmCampaign,
    deviceType: sessionData.deviceType,
    browser: sessionData.browser,
    operatingSystem: sessionData.operatingSystem,
    country: sessionData.country,
    page: {
      path: pageData.path,
      title: pageData.title,
      url: pageData.url,
      referrer: pageData.referrer
    }
  });
};

// Static method to track feature usage
EventSchema.statics.trackFeatureUsage = function(featureData, userData, actionData) {
  return this.create({
    eventType: 'feature_usage',
    category: featureData.category || 'feature',
    action: actionData.action,
    label: actionData.label,
    value: actionData.value,
    timestamp: new Date(),
    userId: userData.userId,
    anonymousId: userData.anonymousId,
    userType: userData.userType,
    subscriptionTier: userData.subscriptionTier,
    sessionId: userData.sessionId,
    feature: {
      name: featureData.name,
      version: featureData.version,
      module: featureData.module
    },
    entity: actionData.entity,
    properties: actionData.properties
  });
};

// Static method to track error
EventSchema.statics.trackError = function(errorData, userData, contextData) {
  return this.create({
    eventType: 'error',
    category: errorData.category || 'error',
    action: 'encounter',
    label: errorData.message,
    timestamp: new Date(),
    userId: userData.userId,
    anonymousId: userData.anonymousId,
    userType: userData.userType,
    sessionId: userData.sessionId,
    page: contextData.page,
    feature: contextData.feature,
    error: {
      code: errorData.code,
      message: errorData.message,
      stack: errorData.stack,
      context: errorData.context
    },
    properties: contextData.properties
  });
};

// Static method to get user activity
EventSchema.statics.getUserActivity = function(userId, limit = 100) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .exec();
};

// Static method to get feature usage metrics
EventSchema.statics.getFeatureUsageMetrics = function(featureName, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'feature.name': featureName,
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          action: '$action',
          day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        },
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        _id: 0,
        action: '$_id.action',
        day: '$_id.day',
        count: 1,
        uniqueUsers: { $size: '$uniqueUsers' }
      }
    },
    {
      $sort: { day: 1, action: 1 }
    }
  ]);
};
```
