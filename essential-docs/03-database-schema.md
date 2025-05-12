# Migratio: Core Database Schema

## 1. Overview

This document outlines the essential database schema for the Migratio platform MVP. The schema is designed for MongoDB, a NoSQL document database that provides flexibility for evolving data structures while maintaining relationships between entities.

## 2. Schema Conventions

- **IDs**: MongoDB ObjectId used as primary keys
- **Timestamps**: All collections include `createdAt` and `updatedAt` fields
- **Soft Deletion**: `isDeleted` flag used instead of physical deletion where appropriate
- **References**: Foreign keys implemented as ObjectId references
- **Indexing**: Strategic indexes on frequently queried fields
- **Validation**: Schema validation rules applied at the database level

## 3. Core Collections

### 3.1 Users Collection

Stores user account information and authentication details.

```javascript
{
  _id: ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'pending'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      }
    },
    timezone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `email`: Unique index
- `status`: For filtering active users
- `verificationToken`: For email verification
- `resetPasswordToken`: For password reset

### 3.2 Profiles Collection

Stores detailed user profile information used for immigration matching.

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'Users',
    required: true,
    unique: true
  },
  personalInfo: {
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say']
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'common-law', 'separated', 'divorced', 'widowed']
    },
    nationality: [{
      country: {
        type: String,
        required: true
      },
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    currentResidence: {
      country: String,
      region: String,
      city: String,
      since: Date
    },
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      region: String,
      postalCode: String,
      country: String
    }
  },
  education: [{
    level: {
      type: String,
      enum: ['high-school', 'certificate', 'diploma', 'associate', 'bachelor', 'master', 'doctorate', 'professional']
    },
    field: String,
    institution: String,
    country: String,
    startDate: Date,
    endDate: Date,
    completed: Boolean,
    documentIds: [{
      type: ObjectId,
      ref: 'Documents'
    }]
  }],
  workExperience: [{
    jobTitle: String,
    employer: String,
    country: String,
    industry: String,
    startDate: Date,
    endDate: Date,
    isCurrentJob: Boolean,
    description: String,
    skills: [String],
    documentIds: [{
      type: ObjectId,
      ref: 'Documents'
    }]
  }],
  languageProficiency: [{
    language: String,
    reading: {
      type: Number,
      min: 0,
      max: 10
    },
    writing: {
      type: Number,
      min: 0,
      max: 10
    },
    speaking: {
      type: Number,
      min: 0,
      max: 10
    },
    listening: {
      type: Number,
      min: 0,
      max: 10
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 10
    },
    testType: {
      type: String,
      enum: ['ielts', 'toefl', 'celpip', 'self-assessment', 'other']
    },
    testDate: Date,
    documentIds: [{
      type: ObjectId,
      ref: 'Documents'
    }]
  }],
  financialInfo: {
    currency: String,
    liquidAssets: Number,
    netWorth: Number,
    annualIncome: Number,
    documentIds: [{
      type: ObjectId,
      ref: 'Documents'
    }]
  },
  immigrationPreferences: {
    destinationCountries: [{
      country: String,
      priority: Number
    }],
    pathwayTypes: [{
      type: {
        type: String,
        enum: ['work', 'study', 'family', 'investment', 'humanitarian']
      },
      priority: Number
    }],
    timeframe: {
      type: String,
      enum: ['immediate', 'within-6-months', 'within-1-year', 'within-2-years', 'flexible']
    },
    budgetRange: {
      min: Number,
      max: Number,
      currency: String
    }
  },
  completionStatus: {
    personalInfo: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    education: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    workExperience: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    languageProficiency: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    financialInfo: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    immigrationPreferences: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `userId`: Unique index
- `personalInfo.nationality.country`: For filtering by nationality
- `personalInfo.currentResidence.country`: For filtering by current residence
- `completionStatus.overall`: For filtering by profile completion

### 3.3 Assessments Collection

Stores user assessment responses and results.

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'Users',
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'expired'],
    default: 'in-progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  lastActivityAt: Date,
  responses: [{
    questionId: {
      type: String,
      required: true
    },
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    answeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  results: {
    eligibilityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    recommendedPathways: [{
      programId: {
        type: ObjectId,
        ref: 'Programs'
      },
      matchScore: {
        type: Number,
        min: 0,
        max: 100
      },
      strengths: [String],
      weaknesses: [String]
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `userId`: For finding user assessments
- `status`: For filtering by completion status
- `completedAt`: For sorting by completion date

### 3.4 Questions Collection

Stores assessment questions and their configuration.

```javascript
{
  _id: ObjectId,
  questionId: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'number', 'date', 'single-choice', 'multiple-choice', 'scale'],
    required: true
  },
  section: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  isRequired: {
    type: Boolean,
    default: true
  },
  options: [{
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  }],
  validation: {
    min: Number,
    max: Number,
    pattern: String,
    errorMessage: String
  },
  conditionalLogic: {
    dependsOn: String,
    condition: {
      type: String,
      enum: ['equals', 'not-equals', 'greater-than', 'less-than', 'contains']
    },
    value: mongoose.Schema.Types.Mixed
  },
  metadata: {
    profileField: String,
    helpText: String,
    placeholder: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `questionId`: Unique index
- `section`: For grouping questions by section
- `order`: For sorting questions
- `isActive`: For filtering active questions

### 3.5 Programs Collection

Stores immigration program information.

```javascript
{
  _id: ObjectId,
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['work', 'study', 'family', 'investment', 'humanitarian'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eligibilityCriteria: [{
    criterion: {
      type: String,
      required: true
    },
    description: String,
    importance: {
      type: String,
      enum: ['required', 'recommended', 'optional']
    },
    scoringWeight: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  processingTime: {
    min: Number,
    max: Number,
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months', 'years']
    }
  },
  estimatedCost: {
    amount: Number,
    currency: String,
    breakdown: [{
      item: String,
      amount: Number
    }]
  },
  requiredDocuments: [{
    documentTypeId: {
      type: ObjectId,
      ref: 'DocumentTypes'
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    stage: {
      type: String,
      enum: ['pre-application', 'application', 'post-application']
    }
  }],
  officialLinks: [{
    title: String,
    url: String,
    description: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `code`: Unique index
- `country`: For filtering by country
- `category`: For filtering by category
- `isActive`: For filtering active programs

### 3.6 Documents Collection

Stores user document metadata and references.

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'Users',
    required: true
  },
  documentTypeId: {
    type: ObjectId,
    ref: 'DocumentTypes',
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  storedFilename: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  storageLocation: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  status: {
    type: String,
    enum: ['pending', 'active', 'expired', 'rejected'],
    default: 'active'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  issuedDate: Date,
  metadata: {
    documentNumber: String,
    issuingAuthority: String,
    country: String,
    notes: String
  },
  tags: [String],
  programAssociations: [{
    programId: {
      type: ObjectId,
      ref: 'Programs'
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'accepted', 'rejected']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `userId`: For finding user documents
- `documentTypeId`: For filtering by document type
- `status`: For filtering by status
- `expiryDate`: For finding expiring documents

### 3.7 DocumentTypes Collection

Stores document type definitions and requirements.

```javascript
{
  _id: ObjectId,
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['identification', 'education', 'employment', 'financial', 'language', 'medical', 'legal', 'other'],
    required: true
  },
  acceptedFileTypes: {
    type: [String],
    default: ['application/pdf', 'image/jpeg', 'image/png']
  },
  maxFileSizeBytes: {
    type: Number,
    default: 10485760 // 10MB
  },
  isExpiryRequired: {
    type: Boolean,
    default: false
  },
  isExpiryTracked: {
    type: Boolean,
    default: false
  },
  validityPeriod: {
    value: Number,
    unit: {
      type: String,
      enum: ['days', 'months', 'years']
    }
  },
  guidance: {
    instructions: String,
    commonIssues: [String],
    sampleImageUrl: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `code`: Unique index
- `category`: For filtering by category
- `isActive`: For filtering active document types

### 3.8 Roadmaps Collection

Stores user immigration roadmaps.

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'Users',
    required: true
  },
  programId: {
    type: ObjectId,
    ref: 'Programs',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  estimatedCompletionDate: Date,
  startDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  phases: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    order: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
    },
    startDate: Date,
    endDate: Date,
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    tasks: [{
      title: {
        type: String,
        required: true
      },
      description: String,
      status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed', 'blocked'],
        default: 'not-started'
      },
      dueDate: Date,
      completedDate: Date,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      documentRequirements: [{
        documentTypeId: {
          type: ObjectId,
          ref: 'DocumentTypes'
        },
        status: {
          type: String,
          enum: ['pending', 'completed'],
          default: 'pending'
        },
        documentId: {
          type: ObjectId,
          ref: 'Documents'
        }
      }]
    }]
  }],
  pdfGenerations: [{
    generatedAt: {
      type: Date,
      default: Date.now
    },
    fileUrl: String,
    fileSize: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `userId`: For finding user roadmaps
- `programId`: For filtering by program
- `status`: For filtering by status
- `progress`: For sorting by progress

## 4. Relationships Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Users   │─1:1─┤ Profiles │─1:N─┤Assessments─1:N─┤ Questions│
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     │                │                │                │
     │                │                │                │
     │                │                │                │
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│ Documents│─N:1─┤DocumentTypes─N:M┤ Programs │─1:N─┤ Roadmaps │
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

## 5. Indexing Strategy

### 5.1 Primary Indexes

- All `_id` fields are automatically indexed by MongoDB
- All foreign key fields (e.g., `userId`, `programId`) are indexed for efficient joins
- All fields used for filtering in list views are indexed

### 5.2 Compound Indexes

```javascript
// Users Collection
db.users.createIndex({ "email": 1, "status": 1 });

// Profiles Collection
db.profiles.createIndex({ "userId": 1, "completionStatus.overall": -1 });
db.profiles.createIndex({ "personalInfo.nationality.country": 1, "personalInfo.currentResidence.country": 1 });

// Assessments Collection
db.assessments.createIndex({ "userId": 1, "status": 1, "completedAt": -1 });

// Programs Collection
db.programs.createIndex({ "country": 1, "category": 1, "isActive": 1 });

// Documents Collection
db.documents.createIndex({ "userId": 1, "documentTypeId": 1, "status": 1 });
db.documents.createIndex({ "userId": 1, "expiryDate": 1, "status": 1 });

// Roadmaps Collection
db.roadmaps.createIndex({ "userId": 1, "status": 1, "progress": -1 });
```

### 5.3 Text Indexes

```javascript
// Programs Collection
db.programs.createIndex({ "name": "text", "description": "text" });

// DocumentTypes Collection
db.documentTypes.createIndex({ "name": "text", "description": "text" });
```

## 6. Data Validation

MongoDB schema validation rules will be applied to enforce data integrity:

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "firstName", "lastName"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        password: {
          bsonType: "string",
          minLength: 8
        },
        // Additional validation rules...
      }
    }
  }
});

// Similar validation for other collections...
```

## 7. Data Migration Strategy

For the initial MVP, we'll implement a simple migration strategy:

1. **Version Tracking**: Each schema will have a version number
2. **Migration Scripts**: JavaScript files that transform data between versions
3. **Migration Registry**: Track which migrations have been applied
4. **Rollback Support**: Each migration will have a corresponding rollback function

Example migration script:

```javascript
// migrations/001-add-preferences-to-users.js
module.exports = {
  version: 1,
  name: "Add preferences to users",
  up: async (db) => {
    await db.collection("users").updateMany(
      { preferences: { $exists: false } },
      { $set: { 
        preferences: {
          language: "en",
          notifications: {
            email: true,
            marketing: false
          }
        }
      }}
    );
  },
  down: async (db) => {
    await db.collection("users").updateMany(
      {},
      { $unset: { preferences: "" } }
    );
  }
};
```

## 8. Data Backup and Recovery

The database backup strategy will include:

1. **Daily Full Backups**: Complete database snapshots
2. **Hourly Incremental Backups**: Changes since the last backup
3. **Point-in-Time Recovery**: Using MongoDB oplog
4. **Geo-Redundant Storage**: Backups stored in multiple regions
5. **Retention Policy**: 30 days of daily backups, 7 days of hourly backups

## 9. Next Steps

1. Implement database connection and configuration
2. Set up indexes and validation rules
3. Create seed data for development
4. Implement basic CRUD operations for each collection
5. Develop data access layer with repository pattern
