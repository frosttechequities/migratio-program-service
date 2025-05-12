# Analytics Domain Schemas (Part 3)

This document completes the MongoDB schemas for the Analytics Domain collections in the Migratio platform.

## Metrics Collection

The Metrics collection stores aggregated analytics metrics.

```javascript
// Metric Schema
const MetricSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['count', 'sum', 'average', 'rate', 'duration', 'custom'],
    required: true,
    index: true
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String
  },
  // Time dimensions
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  timeGranularity: {
    type: String,
    enum: ['minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'],
    required: true,
    index: true
  },
  timePeriod: {
    type: String,
    required: true,
    index: true
  },
  // Dimensions
  dimensions: {
    type: Map,
    of: String,
    default: {}
  },
  // Metadata
  sampleSize: {
    type: Number
  },
  isEstimated: {
    type: Boolean,
    default: false
  },
  calculationMethod: {
    type: String
  },
  dataSource: {
    type: String
  },
  // Additional metrics
  relatedMetrics: {
    type: Map,
    of: Number,
    default: {}
  },
  // Comparison metrics
  previousValue: {
    type: Number
  },
  changeAbsolute: {
    type: Number
  },
  changePercent: {
    type: Number
  },
  // Targets
  target: {
    type: Number
  },
  targetDifference: {
    type: Number
  },
  targetAchieved: {
    type: Boolean
  }
}, {
  timestamps: true
});

// Compound indexes
MetricSchema.index({ name: 1, timeGranularity: 1, timePeriod: 1 }, { unique: true });
MetricSchema.index({ category: 1, timestamp: -1 });
MetricSchema.index({ type: 1, timestamp: -1 });
MetricSchema.index({ name: 1, timestamp: -1 });

// Static method to record metric
MetricSchema.statics.recordMetric = function(metricData) {
  // Check if metric already exists for this time period
  return this.findOne({
    name: metricData.name,
    timeGranularity: metricData.timeGranularity,
    timePeriod: metricData.timePeriod
  })
  .then(existingMetric => {
    if (existingMetric) {
      // Update existing metric
      existingMetric.value = metricData.value;
      existingMetric.sampleSize = metricData.sampleSize;
      existingMetric.isEstimated = metricData.isEstimated || false;
      existingMetric.calculationMethod = metricData.calculationMethod;
      existingMetric.dataSource = metricData.dataSource;
      
      // Update related metrics if provided
      if (metricData.relatedMetrics) {
        existingMetric.relatedMetrics = metricData.relatedMetrics;
      }
      
      // Update comparison metrics
      if (metricData.previousValue !== undefined) {
        existingMetric.previousValue = metricData.previousValue;
        existingMetric.changeAbsolute = metricData.value - metricData.previousValue;
        existingMetric.changePercent = metricData.previousValue !== 0 
          ? ((metricData.value - metricData.previousValue) / metricData.previousValue) * 100 
          : null;
      }
      
      // Update target metrics
      if (metricData.target !== undefined) {
        existingMetric.target = metricData.target;
        existingMetric.targetDifference = metricData.value - metricData.target;
        existingMetric.targetAchieved = metricData.value >= metricData.target;
      }
      
      return existingMetric.save();
    } else {
      // Create new metric
      return this.create(metricData);
    }
  });
};

// Static method to get metric time series
MetricSchema.statics.getTimeSeries = function(metricName, timeGranularity, startPeriod, endPeriod) {
  return this.find({
    name: metricName,
    timeGranularity,
    timePeriod: { $gte: startPeriod, $lte: endPeriod }
  })
  .sort({ timePeriod: 1 })
  .exec();
};

// Static method to get latest metrics by category
MetricSchema.statics.getLatestByCategory = function(category, timeGranularity) {
  return this.aggregate([
    {
      $match: {
        category,
        timeGranularity
      }
    },
    {
      $sort: { timePeriod: -1 }
    },
    {
      $group: {
        _id: '$name',
        latestMetric: { $first: '$$ROOT' }
      }
    },
    {
      $replaceRoot: { newRoot: '$latestMetric' }
    },
    {
      $project: {
        name: 1,
        category: 1,
        type: 1,
        value: 1,
        unit: 1,
        timestamp: 1,
        timeGranularity: 1,
        timePeriod: 1,
        dimensions: 1,
        previousValue: 1,
        changeAbsolute: 1,
        changePercent: 1,
        target: 1,
        targetDifference: 1,
        targetAchieved: 1
      }
    },
    {
      $sort: { name: 1 }
    }
  ]);
};

// Static method to calculate growth metrics
MetricSchema.statics.calculateGrowthMetrics = function(metricNames, currentPeriod, previousPeriod, timeGranularity) {
  return this.aggregate([
    {
      $match: {
        name: { $in: metricNames },
        timeGranularity,
        timePeriod: { $in: [currentPeriod, previousPeriod] }
      }
    },
    {
      $sort: { timePeriod: 1 }
    },
    {
      $group: {
        _id: '$name',
        metrics: { $push: '$$ROOT' }
      }
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        metrics: 1,
        hasBothPeriods: { $eq: [{ $size: '$metrics' }, 2] }
      }
    },
    {
      $match: {
        hasBothPeriods: true
      }
    },
    {
      $project: {
        name: 1,
        previousValue: { $arrayElemAt: ['$metrics.value', 0] },
        currentValue: { $arrayElemAt: ['$metrics.value', 1] },
        previousPeriod: { $arrayElemAt: ['$metrics.timePeriod', 0] },
        currentPeriod: { $arrayElemAt: ['$metrics.timePeriod', 1] },
        unit: { $arrayElemAt: ['$metrics.unit', 0] }
      }
    },
    {
      $project: {
        name: 1,
        previousValue: 1,
        currentValue: 1,
        previousPeriod: 1,
        currentPeriod: 1,
        unit: 1,
        absoluteChange: { $subtract: ['$currentValue', '$previousValue'] },
        percentChange: {
          $cond: [
            { $eq: ['$previousValue', 0] },
            null,
            {
              $multiply: [
                { $divide: [
                  { $subtract: ['$currentValue', '$previousValue'] },
                  '$previousValue'
                ]},
                100
              ]
            }
          ]
        }
      }
    }
  ]);
};
```

## Reports Collection

The Reports collection stores saved analytics reports.

```javascript
// Report Schema
const ReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['dashboard', 'metric', 'funnel', 'journey', 'segment', 'custom'],
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  // Owner information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: false,
    index: true
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    accessLevel: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  // Report configuration
  config: {
    timeRange: {
      type: {
        type: String,
        enum: ['fixed', 'relative', 'custom'],
        default: 'relative'
      },
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      },
      relativePeriod: {
        value: {
          type: Number
        },
        unit: {
          type: String,
          enum: ['day', 'week', 'month', 'quarter', 'year']
        }
      },
      comparisonEnabled: {
        type: Boolean,
        default: false
      },
      comparisonPeriod: {
        type: String,
        enum: ['previous_period', 'same_period_last_year', 'custom']
      },
      comparisonStartDate: {
        type: Date
      },
      comparisonEndDate: {
        type: Date
      }
    },
    granularity: {
      type: String,
      enum: ['hour', 'day', 'week', 'month', 'quarter', 'year'],
      default: 'day'
    },
    filters: [{
      dimension: {
        type: String,
        required: true
      },
      operator: {
        type: String,
        enum: ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'in', 'not_in'],
        required: true
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      }
    }],
    segments: [{
      name: {
        type: String,
        required: true
      },
      filters: [{
        dimension: {
          type: String,
          required: true
        },
        operator: {
          type: String,
          enum: ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'in', 'not_in'],
          required: true
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
          required: true
        }
      }]
    }]
  },
  // Report content
  content: {
    metrics: [{
      name: {
        type: String,
        required: true
      },
      displayName: {
        type: String
      },
      type: {
        type: String,
        enum: ['primary', 'secondary', 'comparison', 'trend'],
        default: 'primary'
      },
      visualization: {
        type: String,
        enum: ['number', 'line', 'bar', 'pie', 'table', 'heatmap', 'funnel', 'custom'],
        default: 'number'
      },
      format: {
        type: String
      },
      color: {
        type: String
      },
      order: {
        type: Number
      }
    }],
    dimensions: [{
      name: {
        type: String,
        required: true
      },
      displayName: {
        type: String
      },
      order: {
        type: Number
      }
    }],
    layout: {
      type: {
        type: String,
        enum: ['grid', 'fixed', 'custom'],
        default: 'grid'
      },
      rows: {
        type: Number
      },
      columns: {
        type: Number
      },
      items: [{
        id: {
          type: String,
          required: true
        },
        type: {
          type: String,
          required: true
        },
        x: {
          type: Number
        },
        y: {
          type: Number
        },
        width: {
          type: Number
        },
        height: {
          type: Number
        },
        config: {
          type: mongoose.Schema.Types.Mixed
        }
      }]
    }
  },
  // Report data
  data: {
    lastUpdated: {
      type: Date
    },
    refreshInterval: {
      type: Number // in minutes
    },
    autoRefresh: {
      type: Boolean,
      default: false
    },
    metrics: [{
      name: {
        type: String,
        required: true
      },
      values: [{
        timestamp: {
          type: Date,
          required: true
        },
        value: {
          type: Number,
          required: true
        },
        dimensions: {
          type: Map,
          of: String
        }
      }]
    }],
    summaries: [{
      name: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      previousValue: {
        type: Number
      },
      changeAbsolute: {
        type: Number
      },
      changePercent: {
        type: Number
      }
    }]
  },
  // Export information
  exports: [{
    format: {
      type: String,
      enum: ['pdf', 'csv', 'excel', 'image'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expiresAt: {
      type: Date
    }
  }],
  // Scheduling information
  schedule: {
    isScheduled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom']
    },
    dayOfWeek: {
      type: Number // 0-6, where 0 is Sunday
    },
    dayOfMonth: {
      type: Number // 1-31
    },
    time: {
      type: String // HH:MM format
    },
    timezone: {
      type: String
    },
    recipients: [{
      email: {
        type: String,
        required: true
      },
      name: {
        type: String
      }
    }],
    format: {
      type: String,
      enum: ['pdf', 'csv', 'excel', 'link'],
      default: 'pdf'
    },
    lastSent: {
      type: Date
    },
    nextScheduled: {
      type: Date
    }
  },
  // Metadata
  tags: [{
    type: String
  }],
  isFavorite: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastViewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
ReportSchema.index({ createdBy: 1, type: 1 });
ReportSchema.index({ category: 1 });
ReportSchema.index({ isPublic: 1 });
ReportSchema.index({ 'sharedWith.userId': 1 });
ReportSchema.index({ tags: 1 });
ReportSchema.index({ isFavorite: 1, createdBy: 1 });
ReportSchema.index({ viewCount: -1 });

// Method to refresh report data
ReportSchema.methods.refreshData = function() {
  // This would typically call a service to fetch and calculate the latest metrics
  // For now, we'll just update the lastUpdated timestamp
  this.data.lastUpdated = new Date();
  return this.save();
};

// Method to share report
ReportSchema.methods.shareWith = function(userId, accessLevel = 'view') {
  // Check if already shared
  const existingShare = this.sharedWith.find(share => share.userId.toString() === userId.toString());
  
  if (existingShare) {
    existingShare.accessLevel = accessLevel;
  } else {
    this.sharedWith.push({
      userId,
      accessLevel
    });
  }
  
  return this.save();
};

// Method to export report
ReportSchema.methods.exportReport = function(format, userId) {
  // This would typically call a service to generate the export
  // For now, we'll just add a placeholder export entry
  const exportEntry = {
    format,
    url: `https://example.com/exports/${this._id}_${format}_${Date.now()}`,
    createdAt: new Date(),
    createdBy: userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  };
  
  this.exports.push(exportEntry);
  return this.save().then(() => exportEntry);
};

// Method to record view
ReportSchema.methods.recordView = function() {
  this.viewCount += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

// Static method to find user reports
ReportSchema.statics.findUserReports = function(userId) {
  return this.find({
    $or: [
      { createdBy: userId },
      { 'sharedWith.userId': userId },
      { isPublic: true }
    ]
  })
  .sort({ updatedAt: -1 })
  .exec();
};

// Static method to find popular reports
ReportSchema.statics.findPopularReports = function(limit = 10) {
  return this.find({
    isPublic: true
  })
  .sort({ viewCount: -1 })
  .limit(limit)
  .exec();
};

// Static method to find reports by category
ReportSchema.statics.findByCategory = function(category, userId) {
  return this.find({
    category,
    $or: [
      { createdBy: userId },
      { 'sharedWith.userId': userId },
      { isPublic: true }
    ]
  })
  .sort({ updatedAt: -1 })
  .exec();
};
```
