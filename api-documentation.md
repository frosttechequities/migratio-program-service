# Visafy API Documentation

This document provides a comprehensive overview of the API endpoints available in the Visafy platform.

## Authentication API

### Register User

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  }
  ```

### Login User

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  }
  ```

### Logout User

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

### Get Current User

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "user": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  }
  ```

## User API

### Update User Profile

- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "user": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@example.com"
    }
  }
  ```

### Change Password

- **URL**: `/api/users/password`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "currentPassword": "securePassword123",
    "newPassword": "newSecurePassword456"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Password updated successfully"
  }
  ```

## Assessment API

### Get Assessment Questions

- **URL**: `/api/assessment/questions`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "questions": [
      {
        "id": "question-id-1",
        "text": "What is your current immigration status?",
        "type": "multiple-choice",
        "options": [
          "Citizen",
          "Permanent Resident",
          "Temporary Visa",
          "No Status"
        ]
      },
      // More questions...
    ]
  }
  ```

### Submit Assessment Answers

- **URL**: `/api/assessment/submit`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "answers": [
      {
        "questionId": "question-id-1",
        "answer": "Temporary Visa"
      },
      // More answers...
    ]
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "assessmentId": "assessment-id",
    "message": "Assessment submitted successfully"
  }
  ```

### Get Assessment Results

- **URL**: `/api/assessment/results/:assessmentId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "results": {
      "id": "assessment-id",
      "userId": "user-id",
      "completedAt": "2023-05-01T12:00:00Z",
      "answers": [
        // Assessment answers...
      ],
      "summary": {
        // Assessment summary...
      }
    }
  }
  ```

## Document API

### Upload Document

- **URL**: `/api/documents/upload`
- **Method**: `POST`
- **Auth Required**: Yes
- **Content Type**: `multipart/form-data`
- **Request Body**:
  - `file`: Document file
  - `type`: Document type (e.g., "passport", "visa", "certificate")
  - `description`: Document description
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "document": {
      "id": "document-id",
      "userId": "user-id",
      "fileName": "passport.pdf",
      "fileType": "application/pdf",
      "type": "passport",
      "description": "My passport",
      "uploadedAt": "2023-05-01T12:00:00Z",
      "status": "uploaded"
    }
  }
  ```

### Get User Documents

- **URL**: `/api/documents`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "documents": [
      {
        "id": "document-id-1",
        "userId": "user-id",
        "fileName": "passport.pdf",
        "fileType": "application/pdf",
        "type": "passport",
        "description": "My passport",
        "uploadedAt": "2023-05-01T12:00:00Z",
        "status": "uploaded"
      },
      // More documents...
    ]
  }
  ```

### Get Document by ID

- **URL**: `/api/documents/:documentId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "document": {
      "id": "document-id",
      "userId": "user-id",
      "fileName": "passport.pdf",
      "fileType": "application/pdf",
      "type": "passport",
      "description": "My passport",
      "uploadedAt": "2023-05-01T12:00:00Z",
      "status": "uploaded"
    }
  }
  ```

### Delete Document

- **URL**: `/api/documents/:documentId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Document deleted successfully"
  }
  ```

## Roadmap API

### Generate Roadmap

- **URL**: `/api/roadmap/generate`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "assessmentId": "assessment-id",
    "preferences": {
      "timeline": "standard",
      "priorityAreas": ["work", "family", "education"]
    }
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "roadmap": {
      "id": "roadmap-id",
      "userId": "user-id",
      "assessmentId": "assessment-id",
      "createdAt": "2023-05-01T12:00:00Z",
      "milestones": [
        // Roadmap milestones...
      ]
    }
  }
  ```

### Get User Roadmap

- **URL**: `/api/roadmap`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "roadmap": {
      "id": "roadmap-id",
      "userId": "user-id",
      "assessmentId": "assessment-id",
      "createdAt": "2023-05-01T12:00:00Z",
      "milestones": [
        {
          "id": "milestone-id-1",
          "title": "Submit Application",
          "description": "Submit your immigration application",
          "dueDate": "2023-06-01T00:00:00Z",
          "status": "pending",
          "requiredDocuments": [
            // Required documents...
          ]
        },
        // More milestones...
      ]
    }
  }
  ```

### Update Milestone Status

- **URL**: `/api/roadmap/milestones/:milestoneId`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "status": "completed"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "milestone": {
      "id": "milestone-id",
      "title": "Submit Application",
      "description": "Submit your immigration application",
      "dueDate": "2023-06-01T00:00:00Z",
      "status": "completed",
      "requiredDocuments": [
        // Required documents...
      ]
    }
  }
  ```

## Recommendation API

### Get Program Recommendations

- **URL**: `/api/recommendations`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "recommendations": [
      {
        "id": "recommendation-id-1",
        "programId": "program-id-1",
        "programName": "Express Entry",
        "score": 85,
        "eligibility": "eligible",
        "reasons": [
          "Strong language skills",
          "Relevant work experience",
          "Education level"
        ]
      },
      // More recommendations...
    ]
  }
  ```

### Get Program Details

- **URL**: `/api/recommendations/programs/:programId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "program": {
      "id": "program-id",
      "name": "Express Entry",
      "description": "Fast-track immigration program for skilled workers",
      "eligibilityCriteria": [
        // Eligibility criteria...
      ],
      "processingTime": "6-12 months",
      "requiredDocuments": [
        // Required documents...
      ]
    }
  }
  ```

## PDF API

### Generate PDF Roadmap

- **URL**: `/api/pdf/roadmap/:roadmapId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  - Content-Type: `application/pdf`
  - Body: PDF file

### Generate PDF Document Summary

- **URL**: `/api/pdf/documents`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  - Content-Type: `application/pdf`
  - Body: PDF file
