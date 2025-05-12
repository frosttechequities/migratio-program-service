# Program Domain Schemas

This document defines the MongoDB schemas for the Program Domain collections in the Migratio platform.

## Programs Collection

The Programs collection stores immigration program information.

```javascript
// Program Schema
const ProgramSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
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
    criterionType: {
      type: String,
      enum: ['age', 'education', 'work_experience', 'language', 'family', 'financial', 'other'],
      required: true
    },
    importance: {
      type: String,
      enum: ['required', 'optional', 'bonus'],
      default: 'required'
    },
    weight: {
      type: Number,
      min: 0,
      max: 10,
      default: 5
    },
    // Different criterion types
    ageRange: {
      min: {
        type: Number
      },
      max: {
        type: Number
      },
      optimal: {
        type: Number
      }
    },
    educationLevel: {
      minimumLevel: {
        type: String
      },
      preferredFields: [{
        type: String
      }],
      recognizedCountries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
      }]
    },
    workExperience: {
      yearsRequired: {
        type: Number
      },
      occupations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OccupationCode'
      }],
      skills: [{
        type: String
      }]
    },
    languageRequirement: {
      language: {
        type: String
      },
      minimumScore: {
        type: Number
      },
      testTypes: [{
        type: String
      }]
    },
    financialRequirement: {
      minimumAmount: {
        type: Number
      },
      currency: {
        type: String
      },
      type: {
        type: String,
        enum: ['savings', 'income', 'investment', 'net_worth']
      }
    },
    otherRequirement: {
      description: {
        type: String
      },
      validationMethod: {
        type: String
      }
    }
  }],
  // Points-based system
  pointsSystem: {
    isPointsBased: {
      type: Boolean,
      default: false
    },
    passingScore: {
      type: Number
    },
    maximumScore: {
      type: Number
    },
    categories: [{
      name: {
        type: String
      },
      description: {
        type: String
      },
      maximumPoints: {
        type: Number
      },
      factors: [{
        name: {
          type: String
        },
        description: {
          type: String
        },
        pointsTable: {
          type: Map,
          of: Number
        }
      }]
    }]
  },
  // Process information
  processingTime: {
    min: {
      type: Number // in months
    },
    max: {
      type: Number // in months
    },
    average: {
      type: Number // in months
    },
    lastUpdated: {
      type: Date
    }
  },
  applicationProcess: [{
    step: {
      type: Number
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    estimatedTime: {
      type: Number // in days
    },
    requiredDocuments: [{
      type: String
    }]
  }],
  // Cost information
  costs: [{
    name: {
      type: String
    },
    amount: {
      type: Number
    },
    currency: {
      type: String,
      default: 'USD'
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: String,
      enum: ['one_time', 'annual', 'monthly']
    },
    description: {
      type: String
    }
  }],
  // Outcome information
  outcomes: {
    initialStatus: {
      type: String
    },
    validityPeriod: {
      type: Number // in months
    },
    renewalOptions: {
      type: String
    },
    pathToPermanentResidence: {
      available: {
        type: Boolean,
        default: false
      },
      timeRequired: {
        type: Number // in months
      },
      description: {
        type: String
      }
    },
    workRights: {
      type: String
    },
    studyRights: {
      type: String
    },
    familyInclusion: {
      type: String
    }
  },
  // Success metrics
  successMetrics: {
    approvalRate: {
      type: Number // percentage
    },
    averageProcessingDays: {
      type: Number
    },
    annualQuota: {
      type: Number
    },
    quotaFilled: {
      type: Number
    },
    lastUpdated: {
      type: Date
    }
  },
  // Metadata
  tags: [{
    type: String
  }],
  popularity: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  policyChanges: [{
    date: {
      type: Date
    },
    description: {
      type: String
    },
    impact: {
      type: String,
      enum: ['major', 'minor', 'neutral']
    }
  }],
  translations: {
    type: Map,
    of: {
      name: String,
      description: String,
      shortDescription: String,
      eligibilityCriteria: [{
        name: String,
        description: String
      }],
      applicationProcess: [{
        name: String,
        description: String
      }]
    }
  }
}, {
  timestamps: true
});

// Indexes
ProgramSchema.index({ programId: 1 });
ProgramSchema.index({ countryId: 1 });
ProgramSchema.index({ category: 1 });
ProgramSchema.index({ status: 1 });
ProgramSchema.index({ 'eligibilityCriteria.criterionType': 1 });
ProgramSchema.index({ popularity: -1 });
ProgramSchema.index({ tags: 1 });

// Virtual for total cost
ProgramSchema.virtual('totalCost').get(function() {
  if (!this.costs || this.costs.length === 0) return 0;
  
  return this.costs
    .filter(cost => cost.isRequired && cost.frequency === 'one_time')
    .reduce((total, cost) => total + cost.amount, 0);
});

// Method to get translated program
ProgramSchema.methods.getTranslation = function(language) {
  if (!this.translations || !this.translations.has(language)) {
    return {
      name: this.name,
      description: this.description,
      shortDescription: this.shortDescription,
      eligibilityCriteria: this.eligibilityCriteria,
      applicationProcess: this.applicationProcess
    };
  }
  
  const translation = this.translations.get(language);
  
  // Merge translated eligibility criteria with original
  const translatedEligibilityCriteria = this.eligibilityCriteria.map(criterion => {
    const translatedCriterion = translation.eligibilityCriteria?.find(tc => tc._id.toString() === criterion._id.toString());
    if (translatedCriterion) {
      return {
        ...criterion.toObject(),
        name: translatedCriterion.name || criterion.name,
        description: translatedCriterion.description || criterion.description
      };
    }
    return criterion;
  });
  
  // Merge translated application process with original
  const translatedApplicationProcess = this.applicationProcess.map(step => {
    const translatedStep = translation.applicationProcess?.find(ts => ts._id.toString() === step._id.toString());
    if (translatedStep) {
      return {
        ...step.toObject(),
        name: translatedStep.name || step.name,
        description: translatedStep.description || step.description
      };
    }
    return step;
  });
  
  return {
    name: translation.name || this.name,
    description: translation.description || this.description,
    shortDescription: translation.shortDescription || this.shortDescription,
    eligibilityCriteria: translatedEligibilityCriteria,
    applicationProcess: translatedApplicationProcess
  };
};

// Static method to find programs by country
ProgramSchema.statics.findByCountry = function(countryId, status = 'active') {
  return this.find({ countryId, status })
    .sort({ popularity: -1 })
    .exec();
};

// Static method to find programs by category
ProgramSchema.statics.findByCategory = function(category, status = 'active') {
  return this.find({ category, status })
    .sort({ popularity: -1 })
    .exec();
};

// Method to increment popularity
ProgramSchema.methods.incrementPopularity = function(amount = 1) {
  this.popularity += amount;
  return this.save();
};
```

## Countries Collection

The Countries collection stores country information.

```javascript
// Country Schema
const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  alpha2Code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  alpha3Code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  region: {
    type: String,
    index: true
  },
  subregion: {
    type: String
  },
  population: {
    type: Number
  },
  languages: [{
    code: {
      type: String
    },
    name: {
      type: String
    },
    isOfficial: {
      type: Boolean,
      default: true
    }
  }],
  currencies: [{
    code: {
      type: String
    },
    name: {
      type: String
    },
    symbol: {
      type: String
    }
  }],
  flagUrl: {
    type: String
  },
  flagEmoji: {
    type: String
  },
  capital: {
    type: String
  },
  // Immigration specific information
  immigrationInfo: {
    hasPointsSystem: {
      type: Boolean,
      default: false
    },
    majorImmigrationTypes: [{
      type: String
    }],
    annualImmigrationTarget: {
      type: Number
    },
    popularDestinationRank: {
      type: Number
    },
    visaFreeCountries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    }],
    recognizedEducationCountries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    }],
    officialLanguageTests: [{
      language: {
        type: String
      },
      tests: [{
        name: {
          type: String
        },
        website: {
          type: String
        }
      }]
    }]
  },
  // Economic information
  economicInfo: {
    gdpPerCapita: {
      type: Number
    },
    majorIndustries: [{
      type: String
    }],
    unemploymentRate: {
      type: Number
    },
    minimumWage: {
      amount: {
        type: Number
      },
      currency: {
        type: String
      },
      frequency: {
        type: String,
        enum: ['hourly', 'daily', 'weekly', 'monthly', 'annual']
      }
    }
  },
  // Living information
  livingInfo: {
    costOfLivingIndex: {
      type: Number
    },
    healthcareRank: {
      type: Number
    },
    educationRank: {
      type: Number
    },
    safetyRank: {
      type: Number
    },
    climateZones: [{
      type: String
    }],
    majorCities: [{
      name: {
        type: String
      },
      population: {
        type: Number
      }
    }]
  },
  // Metadata
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isDestinationCountry: {
    type: Boolean,
    default: false,
    index: true
  },
  popularity: {
    type: Number,
    default: 0
  },
  translations: {
    type: Map,
    of: {
      name: String,
      region: String,
      subregion: String
    }
  }
}, {
  timestamps: true
});

// Indexes
CountrySchema.index({ name: 1 });
CountrySchema.index({ code: 1 });
CountrySchema.index({ region: 1 });
CountrySchema.index({ isDestinationCountry: 1, isActive: 1 });
CountrySchema.index({ popularity: -1 });

// Method to get translated country
CountrySchema.methods.getTranslation = function(language) {
  if (!this.translations || !this.translations.has(language)) {
    return {
      name: this.name,
      region: this.region,
      subregion: this.subregion
    };
  }
  
  const translation = this.translations.get(language);
  
  return {
    name: translation.name || this.name,
    region: translation.region || this.region,
    subregion: translation.subregion || this.subregion
  };
};

// Static method to get destination countries
CountrySchema.statics.getDestinationCountries = function() {
  return this.find({ isDestinationCountry: true, isActive: true })
    .sort({ popularity: -1 })
    .exec();
};

// Static method to get countries by region
CountrySchema.statics.getByRegion = function(region) {
  return this.find({ region, isActive: true })
    .sort({ name: 1 })
    .exec();
};

// Method to increment popularity
CountrySchema.methods.incrementPopularity = function(amount = 1) {
  this.popularity += amount;
  return this.save();
};
```

## OccupationCodes Collection

The OccupationCodes collection stores standardized occupation classifications.

```javascript
// OccupationCode Schema
const OccupationCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String
  },
  system: {
    type: String,
    enum: ['ISCO', 'NOC', 'ANZSCO', 'SOC', 'other'],
    required: true,
    index: true
  },
  level: {
    type: Number,
    min: 1,
    max: 5
  },
  parentCode: {
    type: String,
    index: true
  },
  skillLevel: {
    type: String,
    enum: ['low', 'medium_low', 'medium', 'medium_high', 'high'],
    index: true
  },
  educationRequirements: [{
    type: String
  }],
  experienceRequirements: {
    type: String
  },
  relatedOccupations: [{
    code: {
      type: String
    },
    system: {
      type: String
    }
  }],
  // Immigration specific information
  immigrationInfo: {
    inDemandCountries: [{
      countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
      },
      demandLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      programEligibility: [{
        programId: {
          type: String
        },
        notes: {
          type: String
        }
      }]
    }],
    regulatedProfession: {
      type: Boolean,
      default: false
    },
    licensingRequirements: {
      type: String
    }
  },
  // Metadata
  alternativeTitles: [{
    type: String
  }],
  keywords: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  translations: {
    type: Map,
    of: {
      title: String,
      description: String,
      alternativeTitles: [String]
    }
  }
}, {
  timestamps: true
});

// Indexes
OccupationCodeSchema.index({ code: 1 });
OccupationCodeSchema.index({ title: 'text', alternativeTitles: 'text', keywords: 'text' });
OccupationCodeSchema.index({ system: 1, code: 1 });
OccupationCodeSchema.index({ skillLevel: 1 });
OccupationCodeSchema.index({ 'immigrationInfo.inDemandCountries.countryId': 1 });

// Method to get translated occupation
OccupationCodeSchema.methods.getTranslation = function(language) {
  if (!this.translations || !this.translations.has(language)) {
    return {
      title: this.title,
      description: this.description,
      alternativeTitles: this.alternativeTitles
    };
  }
  
  const translation = this.translations.get(language);
  
  return {
    title: translation.title || this.title,
    description: translation.description || this.description,
    alternativeTitles: translation.alternativeTitles || this.alternativeTitles
  };
};

// Static method to search occupations
OccupationCodeSchema.statics.search = function(query, system = null) {
  const searchQuery = { 
    $text: { $search: query },
    isActive: true
  };
  
  if (system) {
    searchQuery.system = system;
  }
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
    .exec();
};

// Static method to find in-demand occupations by country
OccupationCodeSchema.statics.findInDemandByCountry = function(countryId, demandLevel = null) {
  const query = { 
    'immigrationInfo.inDemandCountries.countryId': countryId,
    isActive: true
  };
  
  if (demandLevel) {
    query['immigrationInfo.inDemandCountries.demandLevel'] = demandLevel;
  }
  
  return this.find(query)
    .sort({ title: 1 })
    .exec();
};
```

## PolicyUpdates Collection

The PolicyUpdates collection tracks changes to immigration policies.

```javascript
// PolicyUpdate Schema
const PolicyUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
    index: true
  },
  affectedPrograms: [{
    programId: {
      type: String,
      index: true
    },
    impact: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral'
    },
    details: {
      type: String
    }
  }],
  updateType: {
    type: String,
    enum: ['new_program', 'program_change', 'program_removal', 'eligibility_change', 'process_change', 'fee_change', 'quota_change', 'other'],
    required: true,
    index: true
  },
  effectiveDate: {
    type: Date,
    required: true,
    index: true
  },
  announcementDate: {
    type: Date,
    required: true
  },
  sourceUrl: {
    type: String
  },
  officialSourceName: {
    type: String
  },
  impactLevel: {
    type: String,
    enum: ['minor', 'moderate', 'major'],
    default: 'moderate',
    index: true
  },
  status: {
    type: String,
    enum: ['announced', 'in_effect', 'superseded', 'cancelled'],
    default: 'announced',
    index: true
  },
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String
  }],
  translations: {
    type: Map,
    of: {
      title: String,
      description: String,
      affectedPrograms: [{
        details: String
      }]
    }
  }
}, {
  timestamps: true
});

// Indexes
PolicyUpdateSchema.index({ countryId: 1 });
PolicyUpdateSchema.index({ effectiveDate: 1 });
PolicyUpdateSchema.index({ 'affectedPrograms.programId': 1 });
PolicyUpdateSchema.index({ updateType: 1 });
PolicyUpdateSchema.index({ impactLevel: 1 });
PolicyUpdateSchema.index({ status: 1 });
PolicyUpdateSchema.index({ tags: 1 });

// Method to get translated policy update
PolicyUpdateSchema.methods.getTranslation = function(language) {
  if (!this.translations || !this.translations.has(language)) {
    return {
      title: this.title,
      description: this.description,
      affectedPrograms: this.affectedPrograms
    };
  }
  
  const translation = this.translations.get(language);
  
  // Merge translated affected programs with original
  const translatedAffectedPrograms = this.affectedPrograms.map(program => {
    const translatedProgram = translation.affectedPrograms?.find(tp => tp._id.toString() === program._id.toString());
    if (translatedProgram) {
      return {
        ...program.toObject(),
        details: translatedProgram.details || program.details
      };
    }
    return program;
  });
  
  return {
    title: translation.title || this.title,
    description: translation.description || this.description,
    affectedPrograms: translatedAffectedPrograms
  };
};

// Static method to find recent updates
PolicyUpdateSchema.statics.findRecent = function(limit = 10) {
  return this.find({ status: { $in: ['announced', 'in_effect'] } })
    .sort({ effectiveDate: -1 })
    .limit(limit)
    .populate('countryId', 'name code flagUrl')
    .exec();
};

// Static method to find updates by program
PolicyUpdateSchema.statics.findByProgram = function(programId) {
  return this.find({ 'affectedPrograms.programId': programId })
    .sort({ effectiveDate: -1 })
    .populate('countryId', 'name code flagUrl')
    .exec();
};

// Static method to find updates by country
PolicyUpdateSchema.statics.findByCountry = function(countryId) {
  return this.find({ countryId })
    .sort({ effectiveDate: -1 })
    .exec();
};
```
