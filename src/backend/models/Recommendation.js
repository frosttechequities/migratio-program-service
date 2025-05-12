const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Requirement Schema
 * Represents a program requirement and whether it's met by the user
 */
const RequirementSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  met: {
    type: Boolean,
    required: true
  },
  userValue: {
    type: Schema.Types.Mixed
  }
});

/**
 * Recommended Program Schema
 * Represents a program recommended to the user with its match score
 */
const RecommendedProgramSchema = new Schema({
  programId: {
    type: Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  requirements: [RequirementSchema]
});

/**
 * Recommendation Schema
 * Represents a set of program recommendations for a user based on assessment results
 */
const RecommendationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  recommendedPrograms: [RecommendedProgramSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
RecommendationSchema.index({ userId: 1, createdAt: -1 });
RecommendationSchema.index({ assessmentId: 1 });

module.exports = mongoose.model('Recommendation', RecommendationSchema);
