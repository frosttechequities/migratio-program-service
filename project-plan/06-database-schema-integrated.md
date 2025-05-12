# Migratio Database Schema (Integrated - v2.0)

## Overview

Migratio's database architecture is built on MongoDB Atlas (leveraging Global Clusters for multi-region support), chosen for its flexibility in handling diverse immigration program requirements, user profiles, and the data needed for **AI-driven personalization and holistic journey support**. This document outlines the core collections, relationships, and maintenance strategy for the application's enhanced data model.

## Core Collections

### Users Collection (Enhanced)

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
  "subscriptionTier": "String (enum: free, pathfinder, navigator, concierge, enterprise)", // [*Updated Enum*]
  "subscriptionExpiry": "Date",
  "paymentGatewayCustomerId": "String", // e.g., Stripe Customer ID
  "emailVerified": "Boolean",
  "twoFactorEnabled": "Boolean",
  "preferredLanguage": "String", // e.g., 'en', 'es'
  "profileId": "ObjectId (ref: Profiles)", // Link to profile
  "userRole": "String (enum: user, admin, contentManager, supportAgent, consultant)", // Expanded roles
  "preferences": { // User-level preferences (distinct from profile immigration preferences)
      "theme": "String (enum: light, dark, system)",
      "notificationChannels": ["String (enum: email, in_app, push, sms)"],
      "dashboardFocus": "String (enum: planning, application, settlement, overview)"
      // Other UI/Notification preferences
  }
}
```

### Profiles Collection (Enhanced)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, unique, indexed)",
  // --- Sections largely same as original ---
  "personalInfo": { /* ... */ },
  "education": [{ /* ... */ }],
  "workExperience": [{
      // ... (original fields) ...
      "extractedDutiesSummary": "String", // [*New*] NLP-extracted summary
      "extractedSkills": ["String"] // [*New*] NLP-extracted skills
  }],
  "languageProficiency": [{ /* ... */ }],
  "financialResources": { /* ... */ },
  "immigrationHistory": { /* ... */ },
  "preferences": { // Renamed from immigrationPreferences for clarity
      "destinationCountries": [{ "countryId": "ObjectId", "preferenceRank": "Number" }],
      "pathwayTypes": [{ "type": "String", "preferenceRank": "Number" }],
      "timeframe": "String",
      "budgetRange": { "currency": "String", "min": "Number", "max": "Number" },
      "priorityFactors": [{ "factor": "String", "importance": "Number" }],
      "locationPreferences": { /* ... */ }
  },
  "additionalAttributes": { /* ... */ },
  // --- New/Enhanced Fields ---
  "derivedSkills": ["String"], // [*New*] Consolidated skills from work experience, education (NLP + structured)
  "inferredExpertiseLevel": "String (enum: beginner, intermediate, advanced)", // [*New*] Inferred from profile data
  "preliminaryScores": { // [*New*] Potentially updated during assessment
      "timestamp": "Date",
      "topPathwayTypes": ["String"],
      "topCountries": ["ObjectId"]
  },
  "profileMetadata": { // Renamed from assessmentResults for clarity
    "createdAt": "Date",
    "lastUpdated": "Date",
    "completionPercentage": "Number",
    "completionBySection": { /* section: percentage */ },
    "assessmentHistory": [{ // History of completed assessments
        "assessmentId": "ObjectId (ref: QuizResponses)", // Link to the specific quiz session
        "completedAt": "Date",
        "profileSnapshot": "Object" // Optional: Snapshot of key profile fields at time of assessment
    }],
    "dataConsent": { /* ... */ }
  }
}
```

### Programs Collection (Enhanced)

```json
{
  "_id": "ObjectId",
  "name": "String",
  "country": "ObjectId (ref: Countries)",
  "category": "String",
  "subcategory": "String",
  "description": "String",
  "eligibilityCriteria": [{ /* ... (structure same, content drives matching) ... */ }],
  "processingTime": { // Official/average times
    "minMonths": "Number",
    "maxMonths": "Number",
    "averageMonths": "Number",
    "source": "String",
    "lastVerified": "Date"
  },
  "predictedProcessingTime": { // [*New*] ML Prediction
      "estimateMonths": "Number",
      "confidence": "Number (0-1)",
      "lastCalculated": "Date",
      "modelUsed": "String"
  },
  "costs": [{ /* ... */ }],
  "requiredDocuments": ["ObjectId (ref: DocumentRequirements)"], // Link to specific requirements
  "applicationSteps": [{ /* ... */ }],
  "benefits": ["String"],
  "limitations": ["String"],
  "pathwayToResidency": "Boolean",
  "pathwayToCitizenship": "Boolean",
  "officialWebsite": "String",
  "lastUpdated": "Date", // Last manual/verified update
  "dataSource": "String",
  "popularity": "Number", // Calculated based on user interest/selection
  "successRate": { // Historical/Reported Success Rate
      "rate": "Number (0-1)",
      "source": "String",
      "year": "Number",
      "notes": "String"
  },
  "predictedSuccessRate": { // [*New*] Base predicted rate (before user profile adjustment)
      "baseRate": "Number (0-1)",
      "confidence": "Number (0-1)",
      "lastCalculated": "Date",
      "modelUsed": "String"
  },
  "postArrivalSupportLevel": "Number (1-3)", // [*New*] Indicator of available settlement support info/features
  "tags": ["String"] // For filtering/categorization
}
```

### Recommendations Collection (Enhanced)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "profileSnapshotId": "ObjectId", // Optional: Link to a snapshot of the profile used for this recommendation set
  "createdAt": "Date",
  "recommendationSet": [{ // Array of individual program recommendations
    "programId": "ObjectId (ref: Programs)",
    "rank": "Number", // Overall rank in this set
    "scores": { // [*Enhanced Structure*]
        "matchScore": "Number (0-1)", // ML-driven match potential
        "successProbability": "Number (0-1)", // ML-driven success likelihood
        "preferenceScore": "Number (0-1)", // How well it matches user preferences
        "overallScore": "Number (0-1)" // Combined score used for ranking
    },
    "explanation": { // [*New*] Structured explanation from generator
        "summary": "String",
        "strengths": [{ "factor": "String", "description": "String" }],
        "challenges": [{ "factor": "String", "description": "String", "suggestion": "String" }],
        "keyFactors": ["String"] // Top factors influencing the scores
    },
    "gapAnalysis": { // [*Enhanced Structure*]
        "hasGaps": "Boolean",
        "gaps": [{
            "criterionName": "String",
            "currentValue": "Mixed",
            "requiredValue": "Mixed",
            "gapDescription": "String",
            "difficulty": "String (enum: low, medium, high)",
            "timeToAddress": "String", // e.g., "3-6 months"
            "suggestions": ["String"]
        }],
        "overallDifficulty": "String",
        "estimatedTimeToEligibility": "String"
    },
    "estimatedTimeframeMonths": "Number", // Predicted processing time for this user
    "estimatedCost": { /* ... */ }
  }],
  "archived": { // Replaces isArchived boolean for more detail
      "isArchived": "Boolean",
      "archivedAt": "Date",
      "reason": "String (e.g., user_action, superseded)"
  }
  // Removed customRoadmapId, pdfGenerated, pdfUrl - these should live on the Roadmap entity
}
```

## Supporting Collections (Enhanced where needed)

### Countries Collection
*(Largely the same, ensure `generalInfo` is kept up-to-date)*

### OccupationCodes Collection
*(Largely the same)*

### Resources Collection (Enhanced)

```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "resourceType": "String (enum: article, video, checklist, template, guide, webinar, course)", // Expanded types
  "contentUrl": "String", // Or potentially store content directly for articles
  "contentBody": "String", // Optional: For directly stored content
  "thumbnailUrl": "String",
  "journeyStage": ["String (enum: planning, assessment, application, settlement, general)"], // [*New*] Relevance to journey stage
  "targetExpertiseLevel": "String (enum: beginner, intermediate, advanced, any)", // [*New*]
  "relatedCountries": ["ObjectId (ref: Countries)"],
  "relatedPrograms": ["ObjectId (ref: Programs)"],
  "tags": ["String"],
  "createdAt": "Date",
  "updatedAt": "Date",
  "authorId": "ObjectId (ref: Users)", // Migratio staff or community contributor
  "viewCount": "Number",
  "averageRating": "Number",
  "isPremium": "Boolean", // Requires specific subscription tier?
  "language": "String" // Language of the resource
}
```

### QuizResponses Collection
*(Largely the same)*

### Roadmaps Collection (Enhanced)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "recommendationId": "ObjectId (ref: Recommendations.recommendationSet._id)", // Link back to the specific recommendation this roadmap is based on
  "createdAt": "Date",
  "updatedAt": "Date",
  "title": "String", // e.g., "My Express Entry Roadmap"
  "description": "String",
  "programId": "ObjectId (ref: Programs)",
  "status": "String (enum: draft, active, on_hold, completed, abandoned)", // More statuses
  "phases": [{ // [*New Structure*] Explicitly define phases
      "phaseName": "String (enum: Planning, ApplicationPrep, SubmissionWaiting, PostArrival, Integration)",
      "status": "String (enum: pending, active, completed)",
      "startDate": "Date", // Actual or estimated
      "endDate": "Date", // Actual or estimated
      "tasks": [{ /* Task structure similar to original */ }],
      "documents": [{ /* Document requirement structure similar to original */ }],
      "milestones": [{ /* Milestone structure similar to original */ }]
  }],
  "planningAssessmentResults": { // [*New*] Store results of pre-decision tools
      "readinessScore": "Number",
      "financialPlanSummary": "Object",
      "notes": "String"
  },
  "settlementProgress": { // [*New*] Track post-arrival progress
      "housingStatus": "String",
      "bankingSetup": "Boolean",
      "communityConnectionsMade": "Number",
      "notes": "String"
  },
  "notes": "String", // General roadmap notes
  "pdfExport": { // [*New*] Store details of generated PDF
      "lastGeneratedAt": "Date",
      "storageUrl": "String",
      "version": "Number"
  },
  "sharedWith": [{ /* Structure same as original */ }]
}
```

*(Document-related collections like `DocumentTypes`, `DocumentRequirements`, `DocumentChecklists` are defined in `09-document-management-part1-integrated.md`)*

## Data Relationships
*(Remain conceptually similar, but ensure relationships align with updated schemas, e.g., Roadmap links back to a specific Recommendation item)*

## Data Maintenance Strategy
*(Remains conceptually similar, but update processes need to account for ML model data needs and multi-region compliance)*
- **Data Updates**: Include processes for updating data used by ML models (e.g., success rates, processing times). Ensure data updates consider multi-region requirements.
- **Data Archiving**: Align with enhanced global privacy regulations (GDPR, etc.).

## Performance Considerations
*(Remains conceptually similar, but add considerations for)*
- **Global Clusters**: Optimize queries for MongoDB Atlas Global Clusters (read/write concerns, regional sharding).
- **ML Data Access**: Efficiently provide necessary data to ML services.

## Security Measures
*(Remains conceptually similar, but add considerations for)*
- **ML Data Security**: Secure handling of potentially sensitive data used for training ML models.
- **Cross-Region Security**: Consistent security policies across multiple regions.
