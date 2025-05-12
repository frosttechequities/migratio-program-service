# Migratio User Profile Management Specification - Part 1

## Overview

The user profile management system is a foundational component of the Migratio platform, serving as the central repository for all user information that drives the recommendation algorithm and personalized experience. This document outlines the comprehensive specifications for the user profile management system, including its purpose, data structure, user interfaces, privacy considerations, and technical implementation approach.

## Purpose and Objectives

The user profile management system aims to:

1. **Collect Comprehensive User Data**: Gather and organize all information needed for accurate immigration pathway recommendations
2. **Ensure Data Accuracy**: Provide intuitive interfaces for users to input and update their information
3. **Maintain Data Privacy**: Implement robust security measures to protect sensitive personal information
4. **Support Personalization**: Enable tailored experiences across the platform based on user attributes
5. **Enable Data Portability**: Allow users to export their data in standard formats
6. **Track Profile Completeness**: Guide users to provide all necessary information for optimal recommendations
7. **Facilitate Updates**: Make it easy for users to keep their information current as circumstances change

## User Profile Data Model

The user profile data model is structured to capture all relevant information for immigration pathway matching:

### 1. Personal Information

```json
{
  "personalInfo": {
    "firstName": "String",
    "lastName": "String",
    "dateOfBirth": "Date",
    "gender": "String (enum: male, female, non-binary, prefer-not-to-say)",
    "maritalStatus": "String (enum: single, married, common-law, separated, divorced, widowed)",
    "nationality": [
      {
        "countryId": "ObjectId (ref: Countries)",
        "isPrimary": "Boolean",
        "since": "Date"
      }
    ],
    "currentResidence": {
      "countryId": "ObjectId (ref: Countries)",
      "region": "String",
      "city": "String",
      "since": "Date",
      "status": "String (enum: citizen, permanent-resident, temporary-resident, visitor, other)"
    },
    "familyMembers": [
      {
        "relationship": "String (enum: spouse, child, parent, sibling, other)",
        "dateOfBirth": "Date",
        "nationality": "ObjectId (ref: Countries)",
        "willAccompany": "Boolean",
        "dependentStatus": "Boolean"
      }
    ],
    "contactInformation": {
      "email": "String",
      "phone": "String",
      "alternateEmail": "String",
      "preferredContactMethod": "String (enum: email, phone)"
    }
  }
}
```

### 2. Education Background

```json
{
  "education": [
    {
      "degreeType": "String (enum: high-school, certificate, diploma, associate, bachelor, master, doctorate, professional)",
      "fieldOfStudy": "String",
      "institution": "String",
      "country": "ObjectId (ref: Countries)",
      "city": "String",
      "startDate": "Date",
      "endDate": "Date",
      "isCompleted": "Boolean",
      "isCurrentlyEnrolled": "Boolean",
      "credentialStatus": "String (enum: not-assessed, in-assessment, assessed)",
      "equivalencyAssessment": {
        "assessedBy": "String",
        "assessmentDate": "Date",
        "equivalentTo": "String",
        "referenceNumber": "String",
        "documentUrl": "String"
      },
      "transcriptUrl": "String",
      "diplomaUrl": "String"
    }
  ]
}
```

### 3. Work Experience

```json
{
  "workExperience": [
    {
      "jobTitle": "String",
      "employer": "String",
      "country": "ObjectId (ref: Countries)",
      "city": "String",
      "industry": "String",
      "occupationCode": "ObjectId (ref: OccupationCodes)",
      "duties": ["String"],
      "skills": ["String"],
      "startDate": "Date",
      "endDate": "Date",
      "isCurrentJob": "Boolean",
      "hoursPerWeek": "Number",
      "employmentType": "String (enum: full-time, part-time, self-employed, contract, internship)",
      "verificationDocuments": [
        {
          "documentType": "String (enum: reference-letter, pay-stub, tax-document, contract)",
          "documentUrl": "String",
          "uploadDate": "Date"
        }
      ]
    }
  ]
}
```

### 4. Language Proficiency

```json
{
  "languageProficiency": [
    {
      "language": "String",
      "isPrimary": "Boolean",
      "proficiencyLevel": "String (enum: beginner, intermediate, advanced, native)",
      "formalTest": {
        "testType": "String (enum: IELTS, CELPIP, TEF, TCF, TOEFL, other)",
        "testDate": "Date",
        "expiryDate": "Date",
        "referenceNumber": "String",
        "results": {
          "speaking": "Number",
          "listening": "Number",
          "reading": "Number",
          "writing": "Number",
          "overall": "Number"
        },
        "certificateUrl": "String"
      },
      "selfAssessment": {
        "speaking": "Number (scale 1-10)",
        "listening": "Number (scale 1-10)",
        "reading": "Number (scale 1-10)",
        "writing": "Number (scale 1-10)"
      }
    }
  ]
}
```

### 5. Financial Information

```json
{
  "financialInformation": {
    "currency": "String",
    "liquidAssets": "Number",
    "investments": "Number",
    "realEstate": "Number",
    "annualIncome": "Number",
    "netWorth": "Number",
    "hasFinancialSupport": "Boolean",
    "financialSupportDetails": {
      "supportSource": "String (enum: family, scholarship, loan, sponsor, other)",
      "supportAmount": "Number",
      "supportDuration": "String"
    },
    "proofOfFunds": [
      {
        "documentType": "String (enum: bank-statement, investment-statement, property-valuation, income-tax-return)",
        "documentUrl": "String",
        "uploadDate": "Date",
        "amount": "Number"
      }
    ]
  }
}
```

### 6. Immigration History

```json
{
  "immigrationHistory": {
    "previousApplications": [
      {
        "country": "ObjectId (ref: Countries)",
        "programType": "String",
        "applicationDate": "Date",
        "status": "String (enum: approved, rejected, withdrawn, in-progress)",
        "referenceNumber": "String",
        "rejectionReason": "String"
      }
    ],
    "travelHistory": [
      {
        "country": "ObjectId (ref: Countries)",
        "purpose": "String (enum: tourism, business, education, work, family, other)",
        "entryDate": "Date",
        "exitDate": "Date",
        "visaType": "String"
      }
    ],
    "immigrationViolations": {
      "hasViolations": "Boolean",
      "violationDetails": [
        {
          "country": "ObjectId (ref: Countries)",
          "violationType": "String",
          "date": "Date",
          "resolution": "String",
          "affectsEligibility": "Boolean"
        }
      ]
    },
    "deportationHistory": {
      "hasDeportations": "Boolean",
      "deportationDetails": [
        {
          "country": "ObjectId (ref: Countries)",
          "date": "Date",
          "reason": "String"
        }
      ]
    }
  }
}
```

### 7. Immigration Preferences

```json
{
  "immigrationPreferences": {
    "destinationCountries": [
      {
        "countryId": "ObjectId (ref: Countries)",
        "preferenceRank": "Number"
      }
    ],
    "pathwayTypes": [
      {
        "type": "String (enum: work, study, family, investment, humanitarian)",
        "preferenceRank": "Number"
      }
    ],
    "timeframe": "String (enum: immediate, within-6-months, within-1-year, within-2-years, flexible)",
    "budgetRange": {
      "currency": "String",
      "min": "Number",
      "max": "Number"
    },
    "priorityFactors": [
      {
        "factor": "String (enum: processing-speed, cost, pathway-to-permanent-residence, family-friendly, career-opportunities)",
        "importance": "Number (scale 1-5)"
      }
    ],
    "locationPreferences": {
      "climatePreference": "String (enum: warm, cold, moderate, any)",
      "settingPreference": "String (enum: urban, suburban, rural, any)",
      "proximityToFamily": "Boolean",
      "specificRegions": ["String"]
    }
  }
}
```

### 8. Additional Attributes

```json
{
  "additionalAttributes": {
    "healthStatus": {
      "hasMedicalConditions": "Boolean",
      "medicalConditionDetails": "String",
      "requiresAccessibility": "Boolean",
      "accessibilityRequirements": "String"
    },
    "criminalRecord": {
      "hasCriminalRecord": "Boolean",
      "criminalRecordDetails": "String",
      "rehabilitationStatus": "String"
    },
    "militaryService": {
      "hasServed": "Boolean",
      "country": "ObjectId (ref: Countries)",
      "branch": "String",
      "rank": "String",
      "startDate": "Date",
      "endDate": "Date",
      "dischargeType": "String"
    },
    "specialCircumstances": {
      "isRefugee": "Boolean",
      "hasHumanitarianNeeds": "Boolean",
      "details": "String"
    }
  }
}
```

### 9. Profile Metadata

```json
{
  "profileMetadata": {
    "createdAt": "Date",
    "lastUpdated": "Date",
    "completionPercentage": "Number",
    "completionBySection": {
      "personalInfo": "Number (percentage)",
      "education": "Number (percentage)",
      "workExperience": "Number (percentage)",
      "languageProficiency": "Number (percentage)",
      "financialInformation": "Number (percentage)",
      "immigrationHistory": "Number (percentage)",
      "immigrationPreferences": "Number (percentage)",
      "additionalAttributes": "Number (percentage)"
    },
    "assessmentHistory": [
      {
        "assessmentId": "ObjectId (ref: Assessments)",
        "completedAt": "Date",
        "score": "Number"
      }
    ],
    "dataConsent": {
      "profileDataUsage": "Boolean",
      "marketingCommunications": "Boolean",
      "thirdPartySharing": "Boolean",
      "consentDate": "Date",
      "consentVersion": "String"
    }
  }
}
```
