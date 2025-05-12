# Migratio Database Schema

## Overview

Migratio's database architecture is built on MongoDB, chosen for its flexibility in handling diverse immigration program requirements and user profiles. This document outlines the core collections, relationships, and maintenance strategy for the application's data model.

## Core Collections

### Users Collection

```json
{
  "_id": "ObjectId",
  "email": "String (unique, indexed)",
  "passwordHash": "String",
  "firstName": "String",
  "lastName": "String",
  "createdAt": "Date",
  "lastLogin": "Date",
  "accountStatus": "String (enum: active, inactive, suspended)",
  "subscriptionTier": "String (enum: free, basic, premium, enterprise)",
  "subscriptionExpiry": "Date",
  "emailVerified": "Boolean",
  "twoFactorEnabled": "Boolean",
  "preferredLanguage": "String",
  "profileComplete": "Boolean",
  "referralSource": "String",
  "userRole": "String (enum: user, admin, contentManager)"
}
```

### Profiles Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "personalInfo": {
    "dateOfBirth": "Date",
    "nationality": "Array of ObjectId (ref: Countries)",
    "currentResidence": "ObjectId (ref: Countries)",
    "maritalStatus": "String",
    "dependents": "Number",
    "familyMembers": [{
      "relationship": "String",
      "age": "Number",
      "nationality": "ObjectId (ref: Countries)"
    }]
  },
  "education": [{
    "degree": "String",
    "fieldOfStudy": "String",
    "institution": "String",
    "country": "ObjectId (ref: Countries)",
    "yearCompleted": "Number",
    "durationMonths": "Number"
  }],
  "workExperience": [{
    "jobTitle": "String",
    "employer": "String",
    "country": "ObjectId (ref: Countries)",
    "occupationCode": "ObjectId (ref: OccupationCodes)",
    "startDate": "Date",
    "endDate": "Date",
    "isCurrentJob": "Boolean",
    "description": "String",
    "skillsUsed": "Array of String"
  }],
  "languageProficiency": [{
    "language": "String",
    "speaking": "Number (scale 1-10)",
    "listening": "Number (scale 1-10)",
    "reading": "Number (scale 1-10)",
    "writing": "Number (scale 1-10)",
    "overallScore": "String",
    "testType": "String (e.g., IELTS, TOEFL)",
    "testDate": "Date"
  }],
  "financialResources": {
    "liquidAssets": "Number",
    "currency": "String",
    "annualIncome": "Number",
    "netWorth": "Number"
  },
  "immigrationHistory": [{
    "country": "ObjectId (ref: Countries)",
    "visaType": "String",
    "purpose": "String",
    "entryDate": "Date",
    "exitDate": "Date",
    "wasRefused": "Boolean",
    "refusalReason": "String"
  }],
  "preferences": {
    "destinationCountries": "Array of ObjectId (ref: Countries)",
    "pathwayTypes": "Array of String (enum: work, study, family, investment, humanitarian)",
    "timeframe": "String (enum: immediate, 6months, 1year, 2years, 5years)",
    "budgetRange": "String (enum: low, medium, high)",
    "priorityFactors": "Array of String (enum: speed, cost, permanence, flexibility)"
  },
  "assessmentResults": {
    "lastCompleted": "Date",
    "completionPercentage": "Number",
    "quizResponses": "Array of ObjectId (ref: QuizResponses)"
  }
}
```

### Programs Collection

```json
{
  "_id": "ObjectId",
  "name": "String",
  "country": "ObjectId (ref: Countries)",
  "category": "String (enum: work, study, family, investment, humanitarian)",
  "subcategory": "String",
  "description": "String",
  "eligibilityCriteria": [{
    "criterionType": "String (enum: age, education, workExperience, language, financial, other)",
    "criterionName": "String",
    "description": "String",
    "minValue": "Mixed",
    "maxValue": "Mixed",
    "unit": "String",
    "weight": "Number (importance in algorithm)",
    "isRequired": "Boolean"
  }],
  "processingTime": {
    "minMonths": "Number",
    "maxMonths": "Number",
    "averageMonths": "Number"
  },
  "costs": [{
    "feeType": "String",
    "amount": "Number",
    "currency": "String",
    "isRefundable": "Boolean"
  }],
  "requiredDocuments": "Array of String",
  "applicationSteps": [{
    "stepNumber": "Number",
    "title": "String",
    "description": "String",
    "estimatedTimeframe": "String",
    "tips": "String"
  }],
  "benefits": "Array of String",
  "limitations": "Array of String",
  "pathwayToResidency": "Boolean",
  "pathwayToCitizenship": "Boolean",
  "officialWebsite": "String",
  "lastUpdated": "Date",
  "dataSource": "String",
  "popularity": "Number",
  "successRate": "Number"
}
```

### Recommendations Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "createdAt": "Date",
  "expiresAt": "Date",
  "isArchived": "Boolean",
  "recommendations": [{
    "programId": "ObjectId (ref: Programs)",
    "matchScore": "Number (0-100)",
    "matchReasons": [{
      "criterionName": "String",
      "userValue": "Mixed",
      "programRequirement": "Mixed",
      "contributionToScore": "Number"
    }],
    "gapAnalysis": [{
      "criterionName": "String",
      "currentValue": "Mixed",
      "requiredValue": "Mixed",
      "gap": "Mixed",
      "suggestedActions": "Array of String"
    }],
    "estimatedTimeframe": "Number (months)",
    "estimatedCost": {
      "amount": "Number",
      "currency": "String"
    }
  }],
  "customRoadmapId": "ObjectId (ref: Roadmaps)",
  "pdfGenerated": "Boolean",
  "pdfUrl": "String"
}
```

## Supporting Collections

### Countries Collection

```json
{
  "_id": "ObjectId",
  "name": "String",
  "code": "String (ISO)",
  "region": "String",
  "flagUrl": "String",
  "officialLanguages": "Array of String",
  "immigrationWebsite": "String",
  "visaRequirements": {
    "touristVisa": "Array of ObjectId (ref: Countries) - countries whose citizens need visas",
    "workVisa": "Array of ObjectId (ref: Countries)",
    "studyVisa": "Array of ObjectId (ref: Countries)"
  },
  "programCount": "Number",
  "popularityRank": "Number",
  "generalInfo": {
    "population": "Number",
    "gdp": "Number",
    "currency": "String",
    "costOfLiving": "String (enum: low, medium, high, very high)",
    "healthcareQuality": "String (enum: low, medium, high, very high)",
    "educationQuality": "String (enum: low, medium, high, very high)",
    "safetyIndex": "Number"
  }
}
```

### OccupationCodes Collection

```json
{
  "_id": "ObjectId",
  "code": "String",
  "title": "String",
  "description": "String",
  "skillLevel": "String",
  "alternativeTitles": "Array of String",
  "inDemandCountries": "Array of ObjectId (ref: Countries)",
  "relatedPrograms": "Array of ObjectId (ref: Programs)"
}
```

### Resources Collection

```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "resourceType": "String (enum: article, video, checklist, template, guide)",
  "contentUrl": "String",
  "thumbnailUrl": "String",
  "relatedCountries": "Array of ObjectId (ref: Countries)",
  "relatedPrograms": "Array of ObjectId (ref: Programs)",
  "tags": "Array of String",
  "createdAt": "Date",
  "updatedAt": "Date",
  "authorId": "ObjectId (ref: Users)",
  "viewCount": "Number",
  "averageRating": "Number",
  "isPremium": "Boolean"
}
```

### QuizResponses Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "sessionId": "String",
  "startedAt": "Date",
  "completedAt": "Date",
  "responses": [{
    "questionId": "String",
    "questionText": "String",
    "responseValue": "Mixed",
    "responseText": "String",
    "answeredAt": "Date"
  }],
  "quizVersion": "String",
  "completionPercentage": "Number",
  "deviceInfo": {
    "deviceType": "String",
    "browser": "String",
    "operatingSystem": "String"
  }
}
```

### Roadmaps Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "createdAt": "Date",
  "updatedAt": "Date",
  "title": "String",
  "description": "String",
  "programId": "ObjectId (ref: Programs)",
  "status": "String (enum: draft, active, completed, archived)",
  "timeline": [{
    "phase": "String",
    "startDate": "Date",
    "endDate": "Date",
    "tasks": [{
      "taskId": "String",
      "title": "String",
      "description": "String",
      "status": "String (enum: pending, inProgress, completed, blocked)",
      "dueDate": "Date",
      "completedDate": "Date",
      "reminderSet": "Boolean",
      "reminderDate": "Date",
      "notes": "String"
    }]
  }],
  "documents": [{
    "documentName": "String",
    "description": "String",
    "status": "String (enum: needed, inProgress, obtained, submitted, verified)",
    "dueDate": "Date",
    "obtainedDate": "Date",
    "expiryDate": "Date",
    "storageUrl": "String",
    "isUploaded": "Boolean"
  }],
  "milestones": [{
    "title": "String",
    "description": "String",
    "targetDate": "Date",
    "achievedDate": "Date",
    "isAchieved": "Boolean"
  }],
  "notes": "String",
  "sharedWith": "Array of ObjectId (ref: Users)"
}
```

## Data Relationships

The database schema implements the following key relationships:

1. **User-Profile Relationship**: One-to-one relationship between Users and Profiles collections.
2. **User-Recommendations Relationship**: One-to-many relationship allowing users to have multiple recommendation sets over time.
3. **Program-Country Relationship**: Many-to-one relationship connecting immigration programs to their respective countries.
4. **Profile-Countries Relationship**: Many-to-many relationship between user profiles and countries (nationality, residence, education, work experience).
5. **Recommendations-Programs Relationship**: Many-to-many relationship between recommendation sets and immigration programs.
6. **Occupation-Programs Relationship**: Many-to-many relationship between occupation codes and relevant immigration programs.

## Data Maintenance Strategy

### Data Integrity

1. **Validation Rules**: Implement MongoDB schema validation to enforce data types and required fields.
2. **Referential Integrity**: Use application-level checks to maintain referential integrity between collections.
3. **Indexing Strategy**: Create indexes on frequently queried fields (email, userId, programId, country) to optimize performance.

### Data Updates

1. **Immigration Program Updates**: 
   - Scheduled quarterly reviews of all immigration programs
   - Automated monitoring of official immigration websites for policy changes
   - Version control for program criteria to track changes over time

2. **Country Information Updates**:
   - Annual review of country statistics and information
   - Automated data enrichment from reliable third-party APIs

3. **Occupation Codes Updates**:
   - Annual synchronization with standard occupation classification systems
   - Quarterly updates to in-demand status based on labor market information

### Data Archiving

1. **User Data**: Implement GDPR-compliant data retention policies with automated archiving of inactive user data after 24 months.
2. **Recommendations**: Archive recommendations older than 12 months but maintain them for user reference.
3. **Quiz Responses**: Anonymize detailed response data after 6 months while preserving aggregated data for analytics.

### Backup Strategy

1. **Daily Incremental Backups**: Automated daily backups of all collections
2. **Weekly Full Backups**: Complete database snapshots stored in geographically distributed locations
3. **Point-in-Time Recovery**: Capability to restore the database to any point within the last 30 days
4. **Disaster Recovery Plan**: Documented procedures for database restoration with regular testing

## Performance Considerations

1. **Sharding Strategy**: Prepare for horizontal scaling by sharding the Users and Recommendations collections by user geography.
2. **Caching Layer**: Implement Redis caching for frequently accessed data such as country information and popular programs.
3. **Read Replicas**: Deploy read replicas to distribute query load for read-heavy operations.
4. **Aggregation Pipeline Optimization**: Design efficient aggregation pipelines for complex recommendation queries.
5. **Data Denormalization**: Strategic denormalization of frequently joined data to reduce query complexity.

## Security Measures

1. **Encryption**: Implement field-level encryption for sensitive user data (personal information, financial details).
2. **Access Control**: Role-based access control for database operations with principle of least privilege.
3. **Audit Logging**: Comprehensive logging of all database modifications for security and compliance.
4. **Data Masking**: Implementation of data masking for non-production environments.
5. **Regular Security Audits**: Scheduled security assessments of database configuration and access patterns.
