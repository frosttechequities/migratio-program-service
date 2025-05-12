# Visafy Component Relationships

This document outlines the key relationships between components in the Visafy codebase, helping developers understand how different parts of the system interact.

## Frontend Component Relationships

### Authentication Flow

```
LoginPage.js
└── features/auth/LoginForm.js
    └── features/auth/authSlice.js (login action)
        └── features/auth/authService.js (API call)
            └── utils/api.js (axios instance)
                └── Backend Auth API
```

```
RegisterPage.js
└── features/auth/RegisterForm.js
    └── features/auth/authSlice.js (register action)
        └── features/auth/authService.js (API call)
            └── utils/api.js (axios instance)
                └── Backend Auth API
```

### Assessment Quiz Flow

```
AssessmentPage.js
└── features/assessment/QuizContainer.js
    ├── features/assessment/QuestionCard.js
    └── features/assessment/assessmentSlice.js (actions)
        └── features/assessment/assessmentService.js (API calls)
            └── utils/api.js (axios instance)
                └── Backend Assessment API
```

### Document Management Flow

```
DocumentsPage.js
├── features/documents/DocumentList.js
│   └── features/documents/documentsSlice.js (fetch actions)
│       └── features/documents/documentsService.js (API calls)
│           └── utils/api.js (axios instance)
│               └── Backend Document API
└── features/documents/DocumentUpload.js
    └── features/documents/documentsSlice.js (upload action)
        └── features/documents/documentsService.js (API calls)
            └── utils/api.js (axios instance)
                └── Backend Document API
```

### Roadmap Generation Flow

```
RoadmapPage.js
├── features/roadmap/RoadmapView.js
│   └── features/roadmap/MilestoneCard.js
└── features/roadmap/roadmapSlice.js (actions)
    └── features/roadmap/roadmapService.js (API calls)
        └── utils/api.js (axios instance)
            └── Backend Roadmap API
```

### PDF Generation Flow

```
RoadmapPage.js
└── features/pdf/PdfPreview.js
    └── features/pdf/pdfSlice.js (generate action)
        └── features/pdf/pdfService.js (API calls)
            └── utils/api.js (axios instance)
                └── Backend PDF API
```

### Recommendation Flow

```
DashboardPage.js
└── features/recommendations/ProgramCard.js
    └── features/recommendations/recommendationsSlice.js (actions)
        └── features/recommendations/recommendationsService.js (API calls)
            └── utils/api.js (axios instance)
                └── Backend Recommendation API
```

## Backend Component Relationships

### Authentication Flow

```
routes/authRoutes.js
└── controllers/authController.js
    ├── services/authService.js
    │   └── models/User.js
    └── utils/security.js (JWT handling)
```

### Assessment Flow

```
routes/assessmentRoutes.js
└── controllers/assessmentController.js
    ├── services/assessmentService.js
    │   ├── models/Assessment.js
    │   └── data/questions/ (quiz questions)
    └── middleware/auth.js (authentication check)
```

### Document Management Flow

```
routes/documentRoutes.js
└── controllers/documentController.js
    ├── services/documentService.js
    │   └── models/Document.js
    ├── utils/fileUpload.js (file handling)
    └── middleware/auth.js (authentication check)
```

### Roadmap Generation Flow

```
routes/roadmapRoutes.js
└── controllers/roadmapController.js
    ├── services/roadmapService.js
    │   ├── models/Roadmap.js
    │   └── models/Milestone.js
    ├── services/recommendationService.js (for program data)
    └── middleware/auth.js (authentication check)
```

### PDF Generation Flow

```
routes/pdfRoutes.js
└── controllers/pdfController.js
    ├── services/pdfService.js
    ├── services/roadmapService.js (for roadmap data)
    │   └── models/Roadmap.js
    └── middleware/auth.js (authentication check)
```

### Recommendation Flow

```
routes/recommendationRoutes.js
└── controllers/recommendationController.js
    ├── services/recommendationService.js
    │   ├── models/Recommendation.js
    │   └── models/Program.js
    ├── services/assessmentService.js (for user assessment data)
    │   └── models/Assessment.js
    └── middleware/auth.js (authentication check)
```

## Microservices Relationships

### API Gateway Relationships

```
api-gateway/
├── routes/
│   ├── authRoutes.js → services/user-service
│   ├── assessmentRoutes.js → services/assessment-service
│   ├── documentRoutes.js → services/document-service
│   ├── roadmapRoutes.js → services/roadmap-service
│   ├── recommendationRoutes.js → services/recommendation-service
│   └── pdfRoutes.js → services/pdf-generation-service
```

### Service Dependencies

```
services/roadmap-service
├── Depends on: services/recommendation-service (for program data)
└── Depends on: services/assessment-service (for user assessment data)
```

```
services/recommendation-service
├── Depends on: services/program-service (for program data)
└── Depends on: services/assessment-service (for user assessment data)
```

```
services/pdf-generation-service
├── Depends on: services/roadmap-service (for roadmap data)
└── Depends on: services/document-service (for document data)
```

```
services/document-analysis-service
└── Depends on: services/document-service (for document data)
```

## Data Flow Diagrams

### User Registration and Assessment Flow

```
User Registration → Assessment Quiz → Recommendation Engine → Roadmap Generation → PDF Generation
```

### Document Management Flow

```
Document Upload → Document Analysis → Document Status Update → Roadmap Update
```

### User Dashboard Flow

```
User Login → Fetch User Data → Fetch Roadmap → Fetch Documents → Fetch Recommendations
```

## State Management

### Redux Store Structure

```
store
├── auth: User authentication state
├── assessment: Assessment quiz state
├── documents: Document management state
├── roadmap: Roadmap generation state
├── recommendations: Recommendation engine state
└── pdf: PDF generation state
```

### Context API Usage

```
AuthContext: User authentication context
ToastContext: Toast notification context
ThemeContext: Theme customization context
```
