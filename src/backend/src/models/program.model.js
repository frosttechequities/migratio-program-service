const mongoose = require('mongoose');

/**
 * Program Schema
 * Represents an immigration program
 */
const programSchema = new mongoose.Schema({
  programId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  countryId: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['work', 'study', 'family', 'investment', 'humanitarian', 'other'],
    required: true,
    index: true
  },
  subcategory: {
    type: String,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String
  },
  officialName: {
    type: String
  },
  officialWebsite: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'coming_soon', 'archived'],
    default: 'active',
    index: true
  },
  // Eligibility criteria
  eligibilityCriteria: [{
    criterionId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    category: {
      type: String,
      enum: ['age', 'education', 'work_experience', 'language', 'financial', 'family', 'other'],
      required: true
    },
    type: {
      type: String,
      enum: ['minimum', 'maximum', 'range', 'exact', 'boolean', 'list', 'points_table'],
      required: true
    },
    isMandatory: {
      type: Boolean,
      default: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    unit: {
      type: String
    },
    pointsAwarded: {
      type: Number
    },
    pointsTable: [{
      condition: {
        type: mongoose.Schema.Types.Mixed
      },
      points: {
        type: Number
      }
    }],
    alternatives: [{
      value: {
        type: mongoose.Schema.Types.Mixed
      },
      description: {
        type: String
      }
    }]
  }],
  // Points system
  pointsSystem: {
    isPointsBased: {
      type: Boolean,
      default: false
    },
    passingScore: {
      type: Number
    },
    maxPossibleScore: {
      type: Number
    },
    categories: [{
      name: {
        type: String
      },
      maxPoints: {
        type: Number
      },
      criteria: [{
        criterionId: {
          type: String
        },
        maxPoints: {
          type: Number
        }
      }]
    }]
  },
  // Program details
  details: {
    processingTime: {
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
    applicationFees: [{
      name: {
        type: String
      },
      amount: {
        type: Number
      },
      currency: {
        type: String
      },
      isRefundable: {
        type: Boolean,
        default: false
      }
    }],
    totalCost: {
      min: {
        type: Number
      },
      max: {
        type: Number
      },
      currency: {
        type: String
      }
    },
    validityPeriod: {
      value: {
        type: Number
      },
      unit: {
        type: String,
        enum: ['days', 'months', 'years']
      }
    },
    renewalOptions: {
      isRenewable: {
        type: Boolean,
        default: false
      },
      maxRenewals: {
        type: Number
      },
      renewalRequirements: {
        type: String
      }
    },
    pathToPermanentResidence: {
      hasPathway: {
        type: Boolean,
        default: false
      },
      timeToEligibility: {
        type: Number // in months
      },
      requirements: {
        type: String
      }
    },
    pathToCitizenship: {
      hasPathway: {
        type: Boolean,
        default: false
      },
      timeToEligibility: {
        type: Number // in months
      },
      requirements: {
        type: String
      }
    },
    quotaSystem: {
      hasQuota: {
        type: Boolean,
        default: false
      },
      annualQuota: {
        type: Number
      },
      currentAvailability: {
        type: String,
        enum: ['high', 'medium', 'low', 'unavailable']
      }
    },
    successRate: {
      value: {
        type: Number // percentage
      },
      year: {
        type: Number
      },
      source: {
        type: String
      }
    }
  },
  // Required documents
  requiredDocuments: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    alternatives: [{
      type: String
    }],
    validationRequirements: {
      type: String
    }
  }],
  // Application process
  applicationProcess: [{
    step: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    estimatedTime: {
      value: {
        type: Number
      },
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months']
      }
    },
    fees: [{
      name: {
        type: String
      },
      amount: {
        type: Number
      },
      currency: {
        type: String
      }
    }],
    tips: {
      type: String
    }
  }],
  // Benefits
  benefits: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    category: {
      type: String,
      enum: ['work', 'education', 'healthcare', 'social_security', 'mobility', 'family', 'other']
    }
  }],
  // Restrictions
  restrictions: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    category: {
      type: String,
      enum: ['work', 'education', 'healthcare', 'social_security', 'mobility', 'family', 'other']
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
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },
  dataSource: {
    name: {
      type: String
    },
    url: {
      type: String
    },
    lastVerified: {
      type: Date
    }
  },
  tags: [{
    type: String
  }],
  translations: {
    type: Map,
    of: {
      name: String,
      description: String,
      shortDescription: String
    }
  }
}, {
  timestamps: true
});

// Indexes
programSchema.index({ name: 'text', description: 'text', 'tags': 'text' });
programSchema.index({ countryId: 1, category: 1 });
programSchema.index({ status: 1 });
programSchema.index({ 'eligibilityCriteria.criterionId': 1 });

// Static method to find active programs
programSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find programs by country
programSchema.statics.findByCountry = function(countryId) {
  return this.find({ countryId, status: 'active' });
};

// Static method to find programs by category
programSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'active' });
};

// Static method to find programs by country and category
programSchema.statics.findByCountryAndCategory = function(countryId, category) {
  return this.find({ countryId, category, status: 'active' });
};

// Static method to search programs
programSchema.statics.search = function(query) {
  return this.find({ 
    $text: { $search: query },
    status: 'active'
  }).sort({ score: { $meta: 'textScore' } });
};

// Static method to get program details
programSchema.statics.getDetails = function(programId) {
  return this.findOne({ programId, status: 'active' });
};

const Program = mongoose.model('Program', programSchema);

module.exports = { Program };
