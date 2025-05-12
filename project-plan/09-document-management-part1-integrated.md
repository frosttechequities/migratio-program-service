# Migratio Document Management Specification (Integrated - v2.0) - Part 1

## Overview

The document management system is a critical component of the Migratio platform, enabling users to securely store, organize, manage, and **optimize** the various documents required throughout their immigration journey. This specification integrates strategic enhancements for **Intelligent Document Management** and outlines the purpose, architecture, key features, and data model for this enhanced system.

## Purpose and Objectives (Enhanced)

The document management system aims to:

1.  **Simplify Document Organization**: Provide a centralized, categorized repository for all immigration-related documents.
2.  **Ensure Document Security**: Implement robust security measures to protect sensitive documents.
3.  **Track Document Status**: Monitor validity, expiration dates, upload status, and **verification status**.
4.  **Guide Document Requirements**: Inform users about required documents for specific pathways, including format and content specifics.
5.  **Facilitate Document Sharing**: Enable secure, controlled sharing with authorized parties.
6.  **Support Document Verification**: Provide automated and manual verification workflows.
7.  **Streamline Application Process**: Reduce complexity and errors in managing document requirements.
8.  **Enable Intelligent Analysis** [*New*]: Automatically assess document quality, extract key data using OCR, and check for common issues.
9.  **Provide Optimization Guidance** [*New*]: Offer suggestions for improving document quality or completeness based on analysis.

## System Architecture (Enhanced)

The system uses a microservices architecture with enhanced capabilities for processing and analysis:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Interface │────▶│  Document API   │────▶│  Document       │
│                 │     │  Gateway        │     │  Service        │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Document       │◀────│  Storage        │◀────│  Document       │
│  Processing [*] │     │  Service (S3)   │     │  Database       │
│  (Scan, Thumb)  │     │                 │     │  (MongoDB)      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       │                        ▲                        │
       │                        │                        │
       ▼                        │                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  OCR & Data     │───┐ │  Notification   │     │  Verification   │
│  Extraction [*] │   │ │  Service        │     │  Service [*]    │
│  (AWS Textract) │   │ │                 │     │  (Workflow)     │
│                 │   │ │                 │     │                 │
└─────────────────┘   │ └─────────────────┘     └─────────────────┘
       │              │
       └─────▶┌─────────────────┐
              │                 │
              │ Document        │
              │ Analysis &      │
              │ Optimization [*]│
              │ Engine (ML/Rules)│
              │                 │
              └─────────────────┘
```
*[*] Indicates services with significantly enhanced scope.*

### Component Descriptions (Enhanced)

1.  **User Interface**: Frontend components for upload, library, preview, sharing, checklists, **displaying verification status and optimization suggestions**.
2.  **Document API Gateway**: Handles authenticated requests for document operations.
3.  **Document Service**: Core service managing metadata, categorization, status, requirements mapping, sharing permissions, **interfacing with analysis/verification**.
4.  **Storage Service (AWS S3)**: Secure, encrypted, versioned storage for documents and thumbnails.
5.  **Document Database (MongoDB)**: Stores enhanced document metadata, types, requirements, checklists, verification status, **quality scores, extracted data, optimization flags**.
6.  **Document Processing Service**: Handles initial processing: format validation, virus scanning, thumbnail generation, PDF manipulation.
7.  **OCR & Data Extraction Service [*Enhanced*]**: Uses OCR (e.g., AWS Textract) to extract text and structured data from documents based on `DocumentType` configuration. Populates `metadata.extractedFields`.
8.  **Verification Service [*Enhanced*]**: Manages automated and manual verification workflows. Updates `verificationStatus` and `verificationDetails`. May involve third-party integrations.
9.  **Notification Service**: Sends alerts for uploads, expiry, verification updates, required actions.
10. **Document Analysis & Optimization Engine [*New*]**: Assesses document quality (clarity, completeness), compares extracted data against requirements or user profile data, identifies potential issues, and generates optimization suggestions based on predefined rules and potentially ML models. Updates `qualityScore` and `optimizationSuggestions` fields.

## Data Model (Enhanced)

### Document Entity (Enhanced)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "documentTypeId": "ObjectId (ref: DocumentTypes)",
  "filename": "String", // Stored filename
  "originalFilename": "String", // User's original filename
  "fileSize": "Number (bytes)",
  "mimeType": "String",
  "fileExtension": "String",
  "storageLocation": "String (path/key in S3)",
  "thumbnailUrl": "String (path/key in S3)",
  "uploadDate": "Date",
  "status": "String (enum: needed, uploaded, replaced, archived, deleted)", // Simplified primary status
  "expiryDate": "Date",
  "issuedDate": "Date",
  "issuedBy": "String",
  "documentNumber": "String", // e.g., Passport number
  "verificationStatus": "String (enum: not_required, pending_submission, pending_verification, verification_in_progress, verified, rejected, unable_to_verify)", // More granular
  "verificationDetails": {
    "verifiedBy": "String (enum: system_automated, agent_manual, third_party_api)",
    "verifiedAt": "Date",
    "verifierId": "String", // Agent ID or System ID
    "rejectionReason": "String", // If rejected
    "verificationNotes": "String"
  },
  "analysis": { // [*New Section*]
    "qualityScore": "Number (0-100, based on clarity, completeness checks)",
    "analysisDate": "Date",
    "hasOptimizationSuggestions": "Boolean",
    "optimizationSuggestions": ["String"], // Text suggestions, e.g., "Image is blurry", "Signature missing"
    "extractedFields": { // Data extracted by OCR/Analysis Engine
      // Dynamic fields based on DocumentType config, e.g.:
      // "passportNumber": { "value": "...", "confidence": 0.95 },
      // "expiryDate": { "value": "YYYY-MM-DD", "confidence": 0.98 }
    },
    "extractionConfidence": "Number (overall confidence)"
  },
  "tags": ["String"], // User-defined tags
  "notes": "String", // User notes
  "visibility": "String (enum: private)", // Simplified, sharing managed separately
  "programAssociations": [{ // Link to specific requirements in checklists/roadmaps
    "programId": "ObjectId (ref: Programs)",
    "requirementId": "ObjectId (ref: DocumentRequirements)",
    "checklistId": "ObjectId (ref: DocumentChecklists)",
    "status": "String (enum: pending, submitted, accepted, rejected)" // Status within that specific program context
  }],
  "sharingDetails": [{ // Details of who this doc is shared with
    "sharedWith": "String (email or userId)",
    "sharedAt": "Date",
    "expiresAt": "Date",
    "accessLevel": "String (enum: view, download)",
    "accessCount": "Number",
    "lastAccessed": "Date",
    "accessToken": "String" // Secure token for sharing link
  }],
  "versions": [{ // History of uploaded versions
    "versionNumber": "Number",
    "uploadDate": "Date",
    "fileSize": "Number",
    "storageLocation": "String",
    "uploadedBy": "ObjectId (ref: Users)",
    "notes": "String"
  }],
  "auditTrail": [{ // Log of actions on this document
    "action": "String (enum: upload, view, download, share, verify, delete, update, analyze)",
    "performedBy": "ObjectId (ref: Users)", // Or system identifier
    "performedAt": "Date",
    "ipAddress": "String",
    "userAgent": "String",
    "details": "String" // e.g., shared with X, verification status changed to Y
  }]
}
```

### Document Type Entity (Enhanced)

```json
{
  "_id": "ObjectId",
  "code": "String (unique)",
  "name": "String",
  "description": "String",
  "category": "String (enum: identification, education, employment, financial, language, medical, legal, other)",
  "subcategory": "String",
  "acceptedFileTypes": ["String (mime types)"], // e.g., ["application/pdf", "image/jpeg"]
  "maxFileSizeBytes": "Number",
  "isExpiryRequired": "Boolean",
  "isExpiryTracked": "Boolean",
  "typicalValidityPeriod": "Number (days)", // For estimating expiry if not provided
  "reminderDays": ["Number (days before expiry)"], // e.g., [90, 30, 7]
  "isVerificationRequired": "Boolean", // Generally required for this type?
  "verificationProcess": "String (enum: automated, manual, third_party, none)", // Default process
  "dataExtractionFields": [{ // Configuration for OCR/Analysis Engine [*Enhanced*]
    "fieldName": "String", // e.g., "passportNumber"
    "fieldType": "String (enum: text, date, number, boolean)",
    "isRequiredForVerification": "Boolean",
    "validationRegex": "String", // Regex to validate extracted value
    "displayName": "String", // How to label it in UI if shown
    "description": "String",
    "ocrHint": "String" // Optional hint for OCR engine
  }],
  "qualityChecks": [ // Configuration for Analysis Engine [*New*]
     { "checkType": "String (enum: resolution, blurriness, completeness, signature_present, data_consistency)", "threshold": "Mixed" }
  ],
  "optimizationRules": [ // Configuration for Analysis Engine [*New*]
     { "condition": "String (e.g., qualityScore < 70)", "suggestion": "String (e.g., 'Re-upload a clearer image.')" }
  ],
  "formatRequirements": { // Requirements often vary by program, but can have defaults
    "acceptedFormats": ["String (enum: original, copy, certified_copy, notarized, apostille, digital)"],
    "translationRequired": "Boolean", // Default, can be overridden by program req
    "certificationRequired": "Boolean", // Default
    "certificationType": "String (enum: notarized, apostille, consular, sworn_translation, other)"
  },
  "countrySpecifics": [{ // Variations for specific countries
    "countryId": "ObjectId (ref: Countries)",
    "name": "String", // e.g., "Canadian Passport"
    "description": "String",
    "additionalRequirements": "String",
    "issuingAuthorities": ["String"],
    "sampleUrl": "String"
  }],
  // ProgramRequirements link moved primarily to DocumentRequirement entity for clarity
  "guidance": { // General guidance for this document type
    "instructions": "String",
    "commonIssues": ["String"],
    "tips": ["String"],
    "sampleImageUrl": "String"
  },
  "tags": ["String"], // Internal tags for organization
  "isActive": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date",
  "createdBy": "ObjectId (ref: Users)",
  "lastUpdatedBy": "ObjectId (ref: Users)",
  "translations": { // For multi-language support of type name, desc, guidance
    "languageCode": {
      "name": "String",
      "description": "String",
      "guidance": { /* ... */ }
    }
  }
}
```

### Document Requirement Entity
*(Remains largely the same as original Part 1 - links Program to DocumentType)*

```json
{
  "_id": "ObjectId",
  "programId": "ObjectId (ref: Programs)",
  "documentTypeId": "ObjectId (ref: DocumentTypes)", // The type of document needed
  "name": "String", // Specific name for this requirement, e.g., "Proof of Funds (Last 6 Months)"
  "description": "String", // More details about this specific requirement
  "isRequired": "Boolean",
  "stage": "String (enum: pre_application, application, post_application, interview, arrival)",
  "deadline": "String (description of when required)",
  "submissionMethod": "String (enum: online, mail, in_person, email)",
  "processingTime": "String", // Time govt takes to process *this* doc if applicable
  "fees": { /* ... */ },
  "alternativeDocuments": [{ /* ... */ }], // Alternative types that satisfy this req
  "conditionalRequirement": { /* ... */ }, // When is this req active?
  "specialInstructions": "String", // Specific instructions for this program's req
  "officialReference": "String",
  "officialUrl": "String",
  "order": "Number",
  "isActive": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Document Checklist Entity
*(Remains largely the same as original Part 1 - user-specific checklist instance)*

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "name": "String", // e.g., "My Express Entry Checklist"
  "description": "String",
  "programId": "ObjectId (ref: Programs)", // Optional: if linked to a specific program
  "roadmapId": "ObjectId (ref: Roadmaps)", // Optional: if linked to a specific roadmap
  "createdAt": "Date",
  "updatedAt": "Date",
  "status": "String (enum: in_progress, completed)",
  "completionPercentage": "Number",
  "items": [{ // Checklist items, often derived from DocumentRequirements
    "requirementId": "ObjectId (ref: DocumentRequirements)", // Link to the specific requirement
    "documentTypeId": "ObjectId (ref: DocumentTypes)", // Type needed
    "name": "String", // Display name for the item
    "description": "String",
    "status": "String (enum: needed, uploaded, submitted, verified, rejected, not_applicable)", // User's status for this item
    "dueDate": "Date",
    "documentId": "ObjectId (ref: Documents)", // Link to the actual uploaded document
    "notes": "String", // User notes for this checklist item
    "isRequired": "Boolean",
    "order": "Number"
  }],
  "categories": [{ // Optional categorization of checklist items
    "name": "String",
    "description": "String",
    "order": "Number",
    "items": ["ObjectId (ref to items array)"]
  }],
  "sharedWith": [{ /* ... */ }] // Sharing settings for this checklist
}
