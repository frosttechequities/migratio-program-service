# Visafy Codebase Structure

## Directory Structure

```
visafy/
├── api-gateway/                  # API Gateway for microservices
├── database/                     # Database configuration and scripts
├── essential-docs/               # Essential documentation
├── infrastructure/               # Infrastructure setup (Docker, deployment)
├── project-plan/                 # Project planning documents
├── project-plan-v1-archive/      # Archived project plans
├── project_plan_review_findings/ # Project plan review documents
├── public/                       # Public assets
├── research/                     # Research data and documentation
├── Scout Research/               # Additional research documents
├── services/                     # Microservices
│   ├── assessment-service/       # Assessment quiz service
│   ├── document-analysis-service/# Document analysis service
│   ├── document-service/         # Document management service
│   ├── ml-insights-service/      # Machine learning insights service
│   ├── pdf-generation-service/   # PDF generation service
│   ├── program-service/          # Program information service
│   ├── recommendation-service/   # Recommendation engine service
│   ├── roadmap-service/          # Roadmap generation service
│   └── user-service/             # User management service
└── src/                          # Main source code
    ├── backend/                  # Backend API server
    │   ├── controllers/          # Request handlers
    │   ├── data/                 # Static data and seed files
    │   ├── logs/                 # Application logs
    │   ├── models/               # Database models
    │   ├── routes/               # API route definitions
    │   ├── services/             # Business logic
    │   ├── uploads/              # Uploaded files storage
    │   └── utils/                # Utility functions
    └── frontend/                 # React frontend application
        ├── public/               # Public assets
        └── src/                  # Source code
            ├── app/              # Application configuration
            ├── assets/           # Static assets
            ├── components/       # Reusable UI components
            ├── contexts/         # React context providers
            ├── features/         # Feature-specific code
            ├── hooks/            # Custom React hooks
            ├── pages/            # Page components
            ├── styles/           # Global styles and themes
            └── utils/            # Utility functions
```

## Frontend Structure

```
src/frontend/src/
├── app/                          # Application configuration
├── assets/                       # Static assets
│   ├── icons/                    # UI icons
│   ├── hero-image.png            # Hero image for landing page
│   └── logo.png                  # Visafy logo
├── components/                   # Reusable UI components
│   ├── common/                   # Generic components
│   │   ├── AccessibilityAnnouncer.js # Screen reader announcements
│   │   ├── Button.js             # Custom button component
│   │   ├── Card.js               # Card component
│   │   ├── Modal.js              # Modal dialog component
│   │   ├── ResponsiveImage.js    # Responsive image component
│   │   ├── Spinner.js            # Loading spinner
│   │   └── Toast.js              # Toast notification component
│   ├── dashboard/                # Dashboard components
│   │   ├── ActivityFeed.js       # User activity feed
│   │   ├── DashboardCard.js      # Dashboard card component
│   │   └── StatisticWidget.js    # Statistics display
│   ├── forms/                    # Form components
│   │   ├── FileUpload.js         # File upload component
│   │   ├── FormField.js          # Form field wrapper
│   │   ├── SelectInput.js        # Dropdown select component
│   │   └── TextInput.js          # Text input component
│   └── layout/                   # Layout components
│       ├── Footer.js             # Page footer
│       ├── Header.js             # Main navigation header
│       ├── Layout.js             # Main layout wrapper
│       └── Sidebar.js            # Dashboard sidebar
├── contexts/                     # React context providers
│   ├── AuthContext.js            # Authentication context
│   ├── ThemeContext.js           # Theme customization context
│   └── ToastContext.js           # Toast notification context
├── features/                     # Feature-specific code
│   ├── assessment/               # Assessment quiz
│   │   ├── assessmentService.js  # Assessment API service
│   │   ├── assessmentSlice.js    # Redux slice for assessment
│   │   ├── QuestionCard.js       # Question display component
│   │   └── QuizContainer.js      # Quiz container component
│   ├── auth/                     # Authentication
│   │   ├── authService.js        # Auth API service
│   │   ├── authSlice.js          # Redux slice for auth
│   │   ├── LoginForm.js          # Login form component
│   │   └── RegisterForm.js       # Registration form component
│   ├── documents/                # Document management
│   │   ├── DocumentList.js       # Document listing component
│   │   ├── DocumentUpload.js     # Document upload component
│   │   ├── documentsService.js   # Documents API service
│   │   └── documentsSlice.js     # Redux slice for documents
│   ├── pdf/                      # PDF generation
│   │   ├── pdfService.js         # PDF generation API service
│   │   ├── pdfSlice.js           # Redux slice for PDF
│   │   └── PdfPreview.js         # PDF preview component
│   ├── recommendations/          # Recommendation engine
│   │   ├── ProgramCard.js        # Program recommendation card
│   │   ├── recommendationsService.js # Recommendations API service
│   │   └── recommendationsSlice.js # Redux slice for recommendations
│   └── roadmap/                  # Roadmap generation
│       ├── MilestoneCard.js      # Milestone display component
│       ├── roadmapService.js     # Roadmap API service
│       ├── roadmapSlice.js       # Redux slice for roadmap
│       └── RoadmapView.js        # Roadmap visualization component
├── hooks/                        # Custom React hooks
│   ├── useApi.js                 # API request hook
│   ├── useAuth.js                # Authentication hook
│   ├── useForm.js                # Form handling hook
│   └── useToast.js               # Toast notification hook
├── pages/                        # Page components
│   ├── AssessmentPage.js         # Assessment quiz page
│   ├── DashboardPage.js          # User dashboard
│   ├── DocumentsPage.js          # Document management page
│   ├── HomePage.js               # Landing page
│   ├── LoginPage.js              # Login page
│   ├── ProfilePage.js            # User profile page
│   ├── RegisterPage.js           # Registration page
│   └── RoadmapPage.js            # Roadmap visualization page
├── styles/                       # Global styles and themes
│   ├── animations.css            # CSS animations
│   ├── global.css                # Global CSS styles
│   └── variables.css             # CSS variables
├── utils/                        # Utility functions
│   ├── api.js                    # API request utilities
│   ├── authUtils.js              # Authentication utilities
│   ├── formatting.js             # Data formatting utilities
│   ├── storage.js                # Local storage utilities
│   └── validation.js             # Form validation utilities
├── App.js                        # Main application component
├── index.js                      # Application entry point
├── store.js                      # Redux store configuration
└── theme.js                      # MUI theme configuration
```

## Backend Structure

```
src/backend/
├── controllers/                  # Request handlers
│   ├── assessmentController.js   # Assessment quiz controller
│   ├── authController.js         # Authentication controller
│   ├── documentController.js     # Document management controller
│   ├── pdfController.js          # PDF generation controller
│   ├── recommendationController.js # Recommendation engine controller
│   ├── roadmapController.js      # Roadmap generation controller
│   └── userController.js         # User management controller
├── data/                         # Static data and seed files
│   ├── programs/                 # Immigration program data
│   └── questions/                # Assessment quiz questions
├── logs/                         # Application logs
├── middleware/                   # Express middleware
│   ├── auth.js                   # Authentication middleware
│   ├── errorMiddleware.js        # Error handling middleware
│   ├── loggingMiddleware.js      # Request logging middleware
│   └── validationMiddleware.js   # Input validation middleware
├── models/                       # Database models
│   ├── Assessment.js             # Assessment quiz model
│   ├── Document.js               # Document model
│   ├── Milestone.js              # Roadmap milestone model
│   ├── Program.js                # Immigration program model
│   ├── Recommendation.js         # Recommendation model
│   ├── Roadmap.js                # Roadmap model
│   └── User.js                   # User model
├── routes/                       # API route definitions
│   ├── assessmentRoutes.js       # Assessment quiz routes
│   ├── authRoutes.js             # Authentication routes
│   ├── documentRoutes.js         # Document management routes
│   ├── pdfRoutes.js              # PDF generation routes
│   ├── recommendationRoutes.js   # Recommendation engine routes
│   ├── roadmapRoutes.js          # Roadmap generation routes
│   └── userRoutes.js             # User management routes
├── services/                     # Business logic
│   ├── assessmentService.js      # Assessment quiz service
│   ├── authService.js            # Authentication service
│   ├── documentService.js        # Document management service
│   ├── emailService.js           # Email notification service
│   ├── pdfService.js             # PDF generation service
│   ├── recommendationService.js  # Recommendation engine service
│   ├── roadmapService.js         # Roadmap generation service
│   └── userService.js            # User management service
├── uploads/                      # Uploaded files storage
├── utils/                        # Utility functions
│   ├── errorHandler.js           # Error handling utilities
│   ├── fileUpload.js             # File upload utilities
│   ├── logger.js                 # Logging utilities
│   ├── security.js               # Security utilities
│   └── validation.js             # Input validation utilities
├── app.js                        # Express application setup
├── config.js                     # Server configuration
├── database.js                   # Database connection setup
├── logger.js                     # Logging configuration
└── server.js                     # Main server entry point
```
