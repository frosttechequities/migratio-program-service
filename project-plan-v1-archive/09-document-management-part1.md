# Migratio Document Management Specification - Part 1

## Overview

The document management system is a critical component of the Migratio platform, enabling users to securely store, organize, and manage the various documents required throughout their immigration journey. This document outlines the comprehensive specifications for the document management system, including its purpose, architecture, key features, user experience considerations, and technical implementation approach.

## Purpose and Objectives

The document management system aims to:

1. **Simplify Document Organization**: Provide a centralized repository for all immigration-related documents
2. **Ensure Document Security**: Implement robust security measures to protect sensitive personal information
3. **Track Document Status**: Monitor document validity, expiration dates, and verification status
4. **Guide Document Requirements**: Inform users about required documents for specific immigration pathways
5. **Facilitate Document Sharing**: Enable secure sharing of documents with authorized parties
6. **Support Document Verification**: Provide mechanisms for document authenticity verification
7. **Streamline Application Process**: Reduce the complexity of managing multiple document requirements

## System Architecture

The document management system consists of several interconnected components that work together to provide a comprehensive document management solution:

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
│  Processing     │     │  Service        │     │  Database       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       │                        ▲                        │
       │                        │                        │
       ▼                        │                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  OCR & Data     │     │  Notification   │     │  Verification   │
│  Extraction     │     │  Service        │     │  Service        │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 1. User Interface

The frontend components that allow users to interact with their documents:

- Document upload interface
- Document library and organization views
- Document detail and preview screens
- Document sharing controls
- Document requirement checklists

### 2. Document API Gateway

The API layer that handles document-related requests:

- Authentication and authorization
- Request validation and routing
- Rate limiting and throttling
- API versioning
- Cross-service communication

### 3. Document Service

The core service that manages document operations:

- Document metadata management
- Document categorization
- Document status tracking
- Document requirement mapping
- Document sharing permissions

### 4. Storage Service

The service responsible for secure document storage:

- Encrypted file storage
- File versioning
- Access control
- Temporary URL generation
- Storage optimization

### 5. Document Database

The database that stores document metadata and relationships:

- Document records
- User-document associations
- Document categories and types
- Document requirements by program
- Document verification status

### 6. Document Processing

The service that handles document processing tasks:

- File format validation
- Virus and malware scanning
- Image optimization
- Thumbnail generation
- PDF processing

### 7. OCR & Data Extraction

The service that extracts information from documents:

- Optical Character Recognition (OCR)
- Data field extraction
- Document classification
- Information validation
- Metadata enrichment

### 8. Verification Service

The service that manages document verification:

- Verification workflow management
- Verification status tracking
- Verification result storage
- Verification agent assignment
- Fraud detection

### 9. Notification Service

The service that sends document-related notifications:

- Document upload confirmations
- Expiration reminders
- Verification status updates
- Document sharing notifications
- Document requirement alerts

## Data Model

### Document Entity

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "documentTypeId": "ObjectId (ref: DocumentTypes)",
  "filename": "String",
  "originalFilename": "String",
  "fileSize": "Number (bytes)",
  "mimeType": "String",
  "fileExtension": "String",
  "storageLocation": "String (path)",
  "thumbnailUrl": "String (path)",
  "uploadDate": "Date",
  "status": "String (enum: pending, active, expired, rejected, verified)",
  "expiryDate": "Date",
  "issuedDate": "Date",
  "issuedBy": "String",
  "documentNumber": "String",
  "verificationStatus": "String (enum: not_submitted, pending, verified, rejected)",
  "verificationDetails": {
    "verifiedBy": "String (enum: system, agent, third_party)",
    "verifiedAt": "Date",
    "verifierId": "String",
    "rejectionReason": "String",
    "verificationNotes": "String"
  },
  "metadata": {
    "extractedFields": "Object (document-specific fields)",
    "confidenceScore": "Number",
    "extractionDate": "Date"
  },
  "tags": ["String"],
  "notes": "String",
  "visibility": "String (enum: private, shared, public)",
  "programAssociations": [{
    "programId": "ObjectId (ref: Programs)",
    "requirementId": "ObjectId (ref: DocumentRequirements)",
    "status": "String (enum: pending, submitted, accepted, rejected)"
  }],
  "sharingDetails": [{
    "sharedWith": "String (email or userId)",
    "sharedAt": "Date",
    "expiresAt": "Date",
    "accessLevel": "String (enum: view, download)",
    "accessCount": "Number",
    "lastAccessed": "Date",
    "accessToken": "String"
  }],
  "versions": [{
    "versionNumber": "Number",
    "uploadDate": "Date",
    "fileSize": "Number",
    "storageLocation": "String",
    "uploadedBy": "ObjectId (ref: Users)",
    "notes": "String"
  }],
  "auditTrail": [{
    "action": "String (enum: upload, view, download, share, verify, delete, update)",
    "performedBy": "ObjectId (ref: Users)",
    "performedAt": "Date",
    "ipAddress": "String",
    "userAgent": "String",
    "details": "String"
  }]
}
```

### Document Type Entity

```json
{
  "_id": "ObjectId",
  "code": "String (unique)",
  "name": "String",
  "description": "String",
  "category": "String (enum: identification, education, employment, financial, language, medical, legal, other)",
  "subcategory": "String",
  "acceptedFileTypes": ["String (mime types)"],
  "maxFileSizeBytes": "Number",
  "isExpiryRequired": "Boolean",
  "isExpiryTracked": "Boolean",
  "typicalValidityPeriod": "Number (days)",
  "reminderDays": ["Number (days before expiry)"],
  "isVerificationRequired": "Boolean",
  "verificationProcess": "String (enum: automated, manual, third_party, none)",
  "dataExtractionFields": [{
    "fieldName": "String",
    "fieldType": "String (enum: text, date, number, boolean)",
    "isRequired": "Boolean",
    "validationRegex": "String",
    "displayName": "String",
    "description": "String"
  }],
  "formatRequirements": {
    "acceptedFormats": ["String (enum: original, copy, certified_copy, notarized, apostille, digital)"],
    "translationRequired": "Boolean",
    "certificationRequired": "Boolean",
    "certificationType": "String (enum: notarized, apostille, consular, sworn_translation, other)"
  },
  "countrySpecifics": [{
    "countryId": "ObjectId (ref: Countries)",
    "name": "String",
    "description": "String",
    "additionalRequirements": "String",
    "issuingAuthorities": ["String"],
    "sampleUrl": "String"
  }],
  "programRequirements": [{
    "programId": "ObjectId (ref: Programs)",
    "isRequired": "Boolean",
    "alternativeDocuments": ["ObjectId (ref: DocumentTypes)"],
    "notes": "String"
  }],
  "guidance": {
    "instructions": "String",
    "commonIssues": ["String"],
    "tips": ["String"],
    "sampleImageUrl": "String"
  },
  "tags": ["String"],
  "isActive": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date",
  "createdBy": "ObjectId (ref: Users)",
  "lastUpdatedBy": "ObjectId (ref: Users)",
  "translations": {
    "languageCode": {
      "name": "String",
      "description": "String",
      "guidance": {
        "instructions": "String",
        "commonIssues": ["String"],
        "tips": ["String"]
      }
    }
  }
}
```

### Document Requirement Entity

```json
{
  "_id": "ObjectId",
  "programId": "ObjectId (ref: Programs)",
  "documentTypeId": "ObjectId (ref: DocumentTypes)",
  "name": "String",
  "description": "String",
  "isRequired": "Boolean",
  "stage": "String (enum: pre_application, application, post_application, interview, arrival)",
  "deadline": "String (description of when required)",
  "submissionMethod": "String (enum: online, mail, in_person, email)",
  "processingTime": "String",
  "fees": {
    "amount": "Number",
    "currency": "String",
    "description": "String"
  },
  "alternativeDocuments": [{
    "documentTypeId": "ObjectId (ref: DocumentTypes)",
    "conditions": "String"
  }],
  "conditionalRequirement": {
    "condition": "String",
    "dependsOn": "String (other requirement or user attribute)"
  },
  "specialInstructions": "String",
  "officialReference": "String (official document reference)",
  "officialUrl": "String",
  "order": "Number (display order)",
  "isActive": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Document Checklist Entity

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "name": "String",
  "description": "String",
  "programId": "ObjectId (ref: Programs)",
  "roadmapId": "ObjectId (ref: Roadmaps)",
  "createdAt": "Date",
  "updatedAt": "Date",
  "status": "String (enum: in_progress, completed)",
  "completionPercentage": "Number",
  "items": [{
    "documentTypeId": "ObjectId (ref: DocumentTypes)",
    "requirementId": "ObjectId (ref: DocumentRequirements)",
    "name": "String",
    "description": "String",
    "status": "String (enum: not_started, in_progress, completed, not_applicable)",
    "dueDate": "Date",
    "documentId": "ObjectId (ref: Documents)",
    "notes": "String",
    "isRequired": "Boolean",
    "order": "Number"
  }],
  "categories": [{
    "name": "String",
    "description": "String",
    "order": "Number",
    "items": ["ObjectId (ref to items array)"]
  }],
  "sharedWith": [{
    "userId": "ObjectId (ref: Users)",
    "email": "String",
    "sharedAt": "Date",
    "accessLevel": "String (enum: view, edit)"
  }]
}
```
