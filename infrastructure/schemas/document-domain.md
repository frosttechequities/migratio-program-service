# Document Domain Schemas

This document defines the MongoDB schemas for the Document Domain collections in the Migratio platform.

## DocumentTypes Collection

The DocumentTypes collection stores information about different types of documents required for immigration.

```javascript
// DocumentType Schema
const DocumentTypeSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: ['identity', 'education', 'employment', 'financial', 'language', 'medical', 'legal', 'travel', 'other'],
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  purpose: {
    type: String
  },
  // Document requirements
  formatRequirements: {
    acceptedFormats: [{
      type: String,
      enum: ['original', 'copy', 'certified_copy', 'notarized', 'apostille', 'digital']
    }],
    translationRequired: {
      type: Boolean,
      default: false
    },
    certificationRequired: {
      type: Boolean,
      default: false
    },
    certificationType: {
      type: String,
      enum: ['notarized', 'apostille', 'consular', 'sworn_translation', 'other']
    }
  },
  // Country-specific information
  countrySpecifics: [{
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    additionalRequirements: {
      type: String
    },
    issuingAuthorities: [{
      type: String
    }],
    sampleUrl: {
      type: String
    }
  }],
  // Program requirements
  programRequirements: [{
    programId: {
      type: String,
      index: true
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    alternativeDocuments: [{
      documentTypeCode: {
        type: String
      },
      notes: {
        type: String
      }
    }],
    additionalRequirements: {
      type: String
    }
  }],
  // Validity information
  validityInfo: {
    hasExpiryDate: {
      type: Boolean,
      default: false
    },
    typicalValidityPeriod: {
      value: {
        type: Number
      },
      unit: {
        type: String,
        enum: ['days', 'months', 'years']
      }
    },
    renewalProcess: {
      type: String
    }
  },
  // Obtaining information
  obtainingInfo: {
    typicalProcessingTime: {
      value: {
        type: Number
      },
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months']
      }
    },
    estimatedCost: {
      amount: {
        type: Number
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'moderate', 'difficult', 'very_difficult'],
      default: 'moderate'
    },
    onlineAvailability: {
      type: Boolean,
      default: false
    }
  },
  // Guidance information
  guidance: {
    instructions: {
      type: String
    },
    commonIssues: [{
      type: String
    }],
    tips: [{
      type: String
    }],
    resourceLinks: [{
      title: {
        type: String
      },
      url: {
        type: String
      },
      description: {
        type: String
      }
    }]
  },
  // Metadata
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  translations: {
    type: Map,
    of: {
      name: String,
      description: String,
      purpose: String,
      guidance: {
        instructions: String,
        commonIssues: [String],
        tips: [String]
      }
    }
  }
}, {
  timestamps: true
});

// Indexes
DocumentTypeSchema.index({ code: 1 });
DocumentTypeSchema.index({ category: 1 });
DocumentTypeSchema.index({ 'countrySpecifics.countryId': 1 });
DocumentTypeSchema.index({ 'programRequirements.programId': 1 });
DocumentTypeSchema.index({ isActive: 1 });
DocumentTypeSchema.index({ tags: 1 });

// Method to get translated document type
DocumentTypeSchema.methods.getTranslation = function(language) {
  if (!this.translations || !this.translations.has(language)) {
    return {
      name: this.name,
      description: this.description,
      purpose: this.purpose,
      guidance: this.guidance
    };
  }
  
  const translation = this.translations.get(language);
  
  return {
    name: translation.name || this.name,
    description: translation.description || this.description,
    purpose: translation.purpose || this.purpose,
    guidance: {
      instructions: translation.guidance?.instructions || this.guidance.instructions,
      commonIssues: translation.guidance?.commonIssues || this.guidance.commonIssues,
      tips: translation.guidance?.tips || this.guidance.tips
    }
  };
};

// Method to get country-specific information
DocumentTypeSchema.methods.getCountrySpecifics = function(countryId) {
  return this.countrySpecifics.find(cs => cs.countryId.toString() === countryId.toString()) || null;
};

// Method to get program requirements
DocumentTypeSchema.methods.getProgramRequirements = function(programId) {
  return this.programRequirements.find(pr => pr.programId === programId) || null;
};

// Static method to find by category
DocumentTypeSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true })
    .sort({ name: 1 })
    .exec();
};

// Static method to find by program
DocumentTypeSchema.statics.findByProgram = function(programId) {
  return this.find({ 
    'programRequirements.programId': programId,
    isActive: true
  })
  .sort({ name: 1 })
  .exec();
};
```

## GeneratedPDFs Collection

The GeneratedPDFs collection stores information about generated PDF documents.

```javascript
// GeneratedPDF Schema
const GeneratedPDFSchema = new mongoose.Schema({
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
    enum: ['roadmap', 'recommendation', 'profile', 'checklist', 'timeline', 'custom'],
    required: true,
    index: true
  },
  // Source information
  sourceData: {
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      index: true
    },
    recommendationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recommendation',
      index: true
    },
    programIds: [{
      type: String
    }],
    countryIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    }],
    customData: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  // File information
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  version: {
    type: Number,
    default: 1
  },
  // Generation information
  generatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  generationTime: {
    type: Number // in milliseconds
  },
  templateId: {
    type: String,
    index: true
  },
  templateVersion: {
    type: String
  },
  // Access control
  accessControl: {
    isPasswordProtected: {
      type: Boolean,
      default: false
    },
    passwordHash: {
      type: String
    },
    expiryDate: {
      type: Date
    },
    maxDownloads: {
      type: Number
    },
    currentDownloads: {
      type: Number,
      default: 0
    }
  },
  // Sharing information
  sharedWith: [{
    email: {
      type: String
    },
    sharedAt: {
      type: Date
    },
    accessedAt: {
      type: Date
    },
    downloadedAt: {
      type: Date
    }
  }],
  // Usage tracking
  usageStats: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    lastViewed: {
      type: Date
    },
    lastDownloaded: {
      type: Date
    },
    deviceTypes: [{
      type: String
    }]
  },
  // Metadata
  tags: [{
    type: String
  }],
  isArchived: {
    type: Boolean,
    default: false,
    index: true
  },
  notes: {
    type: String
  },
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
GeneratedPDFSchema.index({ userId: 1 });
GeneratedPDFSchema.index({ documentType: 1 });
GeneratedPDFSchema.index({ 'sourceData.roadmapId': 1 });
GeneratedPDFSchema.index({ 'sourceData.recommendationId': 1 });
GeneratedPDFSchema.index({ generatedAt: -1 });
GeneratedPDFSchema.index({ isArchived: 1 });
GeneratedPDFSchema.index({ tags: 1 });

// Virtual for age in days
GeneratedPDFSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const generated = new Date(this.generatedAt);
  const diffTime = Math.abs(now - generated);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is expired
GeneratedPDFSchema.virtual('isExpired').get(function() {
  if (!this.accessControl.expiryDate) return false;
  
  const now = new Date();
  const expiry = new Date(this.accessControl.expiryDate);
  return now > expiry;
});

// Method to record view
GeneratedPDFSchema.methods.recordView = function(deviceType) {
  this.usageStats.views += 1;
  this.usageStats.lastViewed = new Date();
  
  if (deviceType && !this.usageStats.deviceTypes.includes(deviceType)) {
    this.usageStats.deviceTypes.push(deviceType);
  }
  
  return this.save();
};

// Method to record download
GeneratedPDFSchema.methods.recordDownload = function(deviceType) {
  this.usageStats.downloads += 1;
  this.usageStats.lastDownloaded = new Date();
  
  if (this.accessControl.maxDownloads) {
    this.accessControl.currentDownloads += 1;
  }
  
  if (deviceType && !this.usageStats.deviceTypes.includes(deviceType)) {
    this.usageStats.deviceTypes.push(deviceType);
  }
  
  return this.save();
};

// Method to share document
GeneratedPDFSchema.methods.shareWith = function(email) {
  // Check if already shared
  const existingShare = this.sharedWith.find(share => share.email === email);
  
  if (existingShare) {
    existingShare.sharedAt = new Date();
  } else {
    this.sharedWith.push({
      email,
      sharedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to record access
GeneratedPDFSchema.methods.recordAccess = function(email) {
  const share = this.sharedWith.find(share => share.email === email);
  
  if (share) {
    share.accessedAt = new Date();
    return this.save();
  }
  
  return Promise.reject(new Error('Share not found'));
};

// Method to archive document
GeneratedPDFSchema.methods.archive = function() {
  this.isArchived = true;
  return this.save();
};

// Static method to find user documents
GeneratedPDFSchema.statics.findUserDocuments = function(userId, includeArchived = false) {
  const query = { userId };
  
  if (!includeArchived) {
    query.isArchived = false;
  }
  
  return this.find(query)
    .sort({ generatedAt: -1 })
    .exec();
};

// Static method to find by source
GeneratedPDFSchema.statics.findBySource = function(sourceType, sourceId, userId) {
  const query = { userId };
  
  if (sourceType === 'roadmap') {
    query['sourceData.roadmapId'] = sourceId;
  } else if (sourceType === 'recommendation') {
    query['sourceData.recommendationId'] = sourceId;
  }
  
  return this.find(query)
    .sort({ generatedAt: -1 })
    .exec();
};
```

## Templates Collection

The Templates collection stores templates for generating PDF documents.

```javascript
// Template Schema
const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['roadmap', 'recommendation', 'profile', 'checklist', 'timeline', 'custom'],
    required: true,
    index: true
  },
  // Template content
  content: {
    html: {
      type: String,
      required: true
    },
    css: {
      type: String
    },
    assets: [{
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }]
  },
  // Template configuration
  config: {
    pageSize: {
      type: String,
      enum: ['A4', 'Letter', 'Legal', 'Custom'],
      default: 'A4'
    },
    customPageSize: {
      width: {
        type: Number
      },
      height: {
        type: Number
      },
      unit: {
        type: String,
        enum: ['mm', 'in', 'pt']
      }
    },
    orientation: {
      type: String,
      enum: ['portrait', 'landscape'],
      default: 'portrait'
    },
    margins: {
      top: {
        type: Number,
        default: 20
      },
      right: {
        type: Number,
        default: 20
      },
      bottom: {
        type: Number,
        default: 20
      },
      left: {
        type: Number,
        default: 20
      },
      unit: {
        type: String,
        enum: ['mm', 'in', 'pt'],
        default: 'mm'
      }
    },
    headerTemplate: {
      type: String
    },
    footerTemplate: {
      type: String
    },
    displayHeaderFooter: {
      type: Boolean,
      default: true
    },
    printBackground: {
      type: Boolean,
      default: true
    },
    preferCssPageSize: {
      type: Boolean,
      default: false
    }
  },
  // Customization options
  customizationOptions: [{
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    type: {
      type: String,
      enum: ['boolean', 'text', 'number', 'select', 'color', 'image'],
      required: true
    },
    defaultValue: {
      type: mongoose.Schema.Types.Mixed
    },
    options: [{
      label: {
        type: String
      },
      value: {
        type: mongoose.Schema.Types.Mixed
      }
    }],
    required: {
      type: Boolean,
      default: false
    },
    group: {
      type: String
    },
    order: {
      type: Number
    }
  }],
  // Data requirements
  dataRequirements: [{
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    type: {
      type: String,
      required: true
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    defaultValue: {
      type: mongoose.Schema.Types.Mixed
    },
    validationRules: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  // Sections
  sections: [{
    name: {
      type: String,
      required: true
    },
    code: {
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
    isDefault: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      required: true
    }
  }],
  // Versioning
  version: {
    type: String,
    required: true
  },
  isLatestVersion: {
    type: Boolean,
    default: true,
    index: true
  },
  previousVersion: {
    type: String
  },
  releaseNotes: {
    type: String
  },
  // Access control
  isPublic: {
    type: Boolean,
    default: false,
    index: true
  },
  accessRoles: [{
    type: String,
    enum: ['user', 'admin', 'contentManager']
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
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: [{
    type: String
  }],
  category: {
    type: String,
    index: true
  },
  previewImageUrl: {
    type: String
  },
  translations: {
    type: Map,
    of: {
      name: String,
      description: String,
      content: {
        html: String,
        css: String
      },
      sections: [{
        name: String,
        description: String
      }],
      customizationOptions: [{
        name: String,
        description: String
      }]
    }
  }
}, {
  timestamps: true
});

// Indexes
TemplateSchema.index({ code: 1, version: 1 }, { unique: true });
TemplateSchema.index({ type: 1 });
TemplateSchema.index({ isLatestVersion: 1 });
TemplateSchema.index({ isPublic: 1 });
TemplateSchema.index({ isActive: 1 });
TemplateSchema.index({ category: 1 });
TemplateSchema.index({ tags: 1 });

// Method to get translated template
TemplateSchema.methods.getTranslation = function(language) {
  if (!this.translations || !this.translations.has(language)) {
    return {
      name: this.name,
      description: this.description,
      content: this.content,
      sections: this.sections,
      customizationOptions: this.customizationOptions
    };
  }
  
  const translation = this.translations.get(language);
  
  // Merge translated sections with original
  const translatedSections = this.sections.map(section => {
    const translatedSection = translation.sections?.find(ts => ts.code === section.code);
    if (translatedSection) {
      return {
        ...section.toObject(),
        name: translatedSection.name || section.name,
        description: translatedSection.description || section.description
      };
    }
    return section;
  });
  
  // Merge translated customization options with original
  const translatedOptions = this.customizationOptions.map(option => {
    const translatedOption = translation.customizationOptions?.find(to => to.code === option.code);
    if (translatedOption) {
      return {
        ...option.toObject(),
        name: translatedOption.name || option.name,
        description: translatedOption.description || option.description
      };
    }
    return option;
  });
  
  return {
    name: translation.name || this.name,
    description: translation.description || this.description,
    content: translation.content || this.content,
    sections: translatedSections,
    customizationOptions: translatedOptions
  };
};

// Method to create new version
TemplateSchema.methods.createNewVersion = function(newVersionData, userId) {
  // Set current version as not latest
  this.isLatestVersion = false;
  this.save();
  
  // Create new version
  const newVersion = new this.constructor({
    ...this.toObject(),
    ...newVersionData,
    _id: undefined, // Generate new ID
    version: newVersionData.version,
    previousVersion: this.version,
    isLatestVersion: true,
    createdBy: userId,
    lastUpdatedBy: userId,
    createdAt: undefined,
    updatedAt: undefined
  });
  
  return newVersion.save();
};

// Static method to find latest version
TemplateSchema.statics.findLatestVersion = function(code) {
  return this.findOne({ 
    code, 
    isLatestVersion: true,
    isActive: true
  }).exec();
};

// Static method to find by type
TemplateSchema.statics.findByType = function(type, isPublic = true) {
  return this.find({ 
    type, 
    isLatestVersion: true,
    isActive: true,
    isPublic
  })
  .sort({ name: 1 })
  .exec();
};

// Static method to find all versions
TemplateSchema.statics.findAllVersions = function(code) {
  return this.find({ code })
    .sort({ version: -1 })
    .exec();
};
```
