const mongoose = require('mongoose');

/**
 * Schema for points system comparison across countries
 */
const PointsSystemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    index: true
  },
  programName: {
    type: String,
    required: true
  },
  description: String,
  minimumPoints: {
    type: Number,
    required: true
  },
  competitivePoints: Number,
  maximumPossiblePoints: Number,
  categories: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    maximumPoints: Number,
    factors: [{
      name: String,
      description: String,
      pointsBreakdown: [{
        criteria: String,
        points: Number,
        description: String
      }]
    }]
  }],
  calculationMethod: String,
  specialConsiderations: [String],
  recentChanges: [{
    date: Date,
    description: String
  }],
  officialReference: {
    name: String,
    url: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataSource: {
    name: String,
    url: String,
    lastChecked: Date
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
PointsSystemSchema.index({ country: 1, programName: 1 }, { unique: true });
PointsSystemSchema.index({ minimumPoints: 1 });
PointsSystemSchema.index({ competitivePoints: 1 });

module.exports = mongoose.model('PointsSystem', PointsSystemSchema);
