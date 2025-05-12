# Visafy Codebase Index

## Overview

Visafy (previously Migratio) is a comprehensive platform designed to assist users with immigration processes. The platform includes features such as user management, assessment quizzes, recommendation engines, document management, roadmap generation, and PDF generation.

## Project Structure

The project follows a microservices architecture with the following main components:

### Core Directories

- `src/` - Main source code directory
  - `frontend/` - React-based frontend application
  - `backend/` - Express-based backend API server

- `services/` - Microservices for specific functionalities
  - `assessment-service/` - Handles user assessment quizzes
  - `document-service/` - Manages user documents
  - `pdf-generation-service/` - Generates PDF reports and roadmaps
  - `program-service/` - Manages immigration program data
  - `recommendation-service/` - Provides personalized recommendations
  - `roadmap-service/` - Creates personalized immigration roadmaps
  - `user-service/` - Handles user authentication and profiles
  - `document-analysis-service/` - Analyzes uploaded documents
  - `ml-insights-service/` - Machine learning for insights

- `database/` - Database configuration and scripts
- `infrastructure/` - Infrastructure setup (Docker, deployment)
- `project-plan/` - Project planning documents
- `research/` - Research data and documentation

## Frontend Structure (`src/frontend/src/`)

### Core Components

- `app/` - Application configuration
- `assets/` - Static assets (images, fonts)
  - `logo.png` - Visafy logo
  - `hero-image.png` - Hero image for landing page
  - `icons/` - UI icons
- `components/` - Reusable UI components
  - `common/` - Generic components
    - `Button.js` - Custom button component
    - `Card.js` - Card component for displaying content
    - `Modal.js` - Modal dialog component
    - `Spinner.js` - Loading spinner
    - `Toast.js` - Toast notification component
    - `ResponsiveImage.js` - Image component with responsive behavior
    - `AccessibilityAnnouncer.js` - Screen reader announcements
  - `layout/` - Layout components
    - `Header.js` - Main navigation header
    - `Footer.js` - Page footer
    - `Sidebar.js` - Dashboard sidebar
    - `Layout.js` - Main layout wrapper
  - `forms/` - Form-related components
    - `FormField.js` - Form field wrapper
    - `TextInput.js` - Text input component
    - `SelectInput.js` - Dropdown select component
    - `FileUpload.js` - File upload component
  - `dashboard/` - Dashboard-specific components
    - `DashboardCard.js` - Card for dashboard items
    - `StatisticWidget.js` - Statistics display
    - `ActivityFeed.js` - User activity feed
- `contexts/` - React context providers
  - `ToastContext.js` - Toast notification context
  - `AuthContext.js` - Authentication context
  - `ThemeContext.js` - Theme customization context
- `features/` - Feature-specific code
  - `auth/` - Authentication
    - `authSlice.js` - Redux slice for auth state
    - `authService.js` - Auth API service
    - `LoginForm.js` - Login form component
    - `RegisterForm.js` - Registration form component
  - `assessment/` - Assessment quiz
    - `assessmentSlice.js` - Redux slice for assessment state
    - `assessmentService.js` - Assessment API service
    - `QuizContainer.js` - Quiz container component
    - `QuestionCard.js` - Question display component
  - `documents/` - Document management
    - `documentsSlice.js` - Redux slice for documents state
    - `documentsService.js` - Documents API service
    - `DocumentList.js` - Document listing component
    - `DocumentUpload.js` - Document upload component
  - `roadmap/` - Roadmap generation
    - `roadmapSlice.js` - Redux slice for roadmap state
    - `roadmapService.js` - Roadmap API service
    - `RoadmapView.js` - Roadmap visualization component
    - `MilestoneCard.js` - Milestone display component
  - `recommendations/` - Recommendation engine
    - `recommendationsSlice.js` - Redux slice for recommendations state
    - `recommendationsService.js` - Recommendations API service
    - `ProgramCard.js` - Program recommendation card
  - `pdf/` - PDF generation
    - `pdfSlice.js` - Redux slice for PDF state
    - `pdfService.js` - PDF generation API service
    - `PdfPreview.js` - PDF preview component
- `hooks/` - Custom React hooks
  - `useAuth.js` - Authentication hook
  - `useToast.js` - Toast notification hook
  - `useForm.js` - Form handling hook
  - `useApi.js` - API request hook
- `pages/` - Page components
  - `HomePage.js` - Landing page
  - `DashboardPage.js` - User dashboard
  - `AssessmentPage.js` - Assessment quiz page
  - `DocumentsPage.js` - Document management page
  - `RoadmapPage.js` - Roadmap visualization page
  - `ProfilePage.js` - User profile page
  - `LoginPage.js` - Login page
  - `RegisterPage.js` - Registration page
- `styles/` - Global styles and themes
  - `global.css` - Global CSS styles
  - `variables.css` - CSS variables
  - `animations.css` - CSS animations
- `utils/` - Utility functions
  - `api.js` - API request utilities
  - `validation.js` - Form validation utilities
  - `formatting.js` - Data formatting utilities
  - `storage.js` - Local storage utilities
  - `authUtils.js` - Authentication utilities
- `__tests__/` - Test files

### Key Files

- `src/frontend/src/App.js` - Main application component
- `src/frontend/src/index.js` - Application entry point
- `src/frontend/src/store.js` - Redux store configuration
- `src/frontend/src/theme.js` - MUI theme configuration

## Backend Structure (`src/backend/`)

### Core Components

- `controllers/` - Request handlers
  - `authController.js` - Authentication controller
  - `userController.js` - User management controller
  - `assessmentController.js` - Assessment quiz controller
  - `documentController.js` - Document management controller
  - `roadmapController.js` - Roadmap generation controller
  - `recommendationController.js` - Recommendation engine controller
  - `pdfController.js` - PDF generation controller
- `models/` - Database models
  - `User.js` - User model
  - `Assessment.js` - Assessment quiz model
  - `Document.js` - Document model
  - `Roadmap.js` - Roadmap model
  - `Program.js` - Immigration program model
  - `Milestone.js` - Roadmap milestone model
  - `Recommendation.js` - Recommendation model
- `routes/` - API route definitions
  - `authRoutes.js` - Authentication routes
  - `userRoutes.js` - User management routes
  - `assessmentRoutes.js` - Assessment quiz routes
  - `documentRoutes.js` - Document management routes
  - `roadmapRoutes.js` - Roadmap generation routes
  - `recommendationRoutes.js` - Recommendation engine routes
  - `pdfRoutes.js` - PDF generation routes
- `services/` - Business logic
  - `authService.js` - Authentication service
  - `userService.js` - User management service
  - `assessmentService.js` - Assessment quiz service
  - `documentService.js` - Document management service
  - `roadmapService.js` - Roadmap generation service
  - `recommendationService.js` - Recommendation engine service
  - `pdfService.js` - PDF generation service
  - `emailService.js` - Email notification service
- `utils/` - Utility functions
  - `errorHandler.js` - Error handling utilities
  - `validation.js` - Input validation utilities
  - `logger.js` - Logging utilities
  - `security.js` - Security utilities
  - `fileUpload.js` - File upload utilities
- `middleware/` - Express middleware
  - `auth.js` - Authentication middleware
  - `errorMiddleware.js` - Error handling middleware
  - `validationMiddleware.js` - Input validation middleware
  - `loggingMiddleware.js` - Request logging middleware
- `data/` - Static data and seed files
  - `programs/` - Immigration program data
  - `questions/` - Assessment quiz questions
- `logs/` - Application logs
- `uploads/` - Uploaded files storage
- `temp/` - Temporary file storage

### Key Files

- `src/backend/server.js` - Main server entry point
- `src/backend/app.js` - Express application setup
- `src/backend/config.js` - Server configuration
- `src/backend/database.js` - Database connection setup
- `src/backend/logger.js` - Logging configuration

## Microservices Structure

Each service in the `services/` directory follows a similar structure:

- `controllers/` - Service-specific controllers
- `models/` - Service-specific data models
- `routes/` - Service-specific API routes
- `services/` - Service-specific business logic
- `utils/` - Service-specific utilities
- `server.js` - Service entry point
- `config.js` - Service configuration
- `Dockerfile` - Docker configuration for the service

### Assessment Service (`services/assessment-service/`)

Handles the assessment quiz functionality:
- Question management
- User response processing
- Quiz flow control
- Results calculation

### Document Service (`services/document-service/`)

Manages user documents:
- Document upload and storage
- Document categorization
- Document status tracking
- Document sharing and permissions

### PDF Generation Service (`services/pdf-generation-service/`)

Generates PDF documents:
- Roadmap PDF generation
- Document compilation
- Template management
- PDF styling and formatting

### Program Service (`services/program-service/`)

Manages immigration program data:
- Program information storage
- Program requirements
- Eligibility criteria
- Program updates and changes

### Recommendation Service (`services/recommendation-service/`)

Provides personalized recommendations:
- Matching algorithms
- Scoring and ranking
- Personalized suggestions
- Recommendation explanations

### Roadmap Service (`services/roadmap-service/`)

Creates personalized immigration roadmaps:
- Milestone generation
- Timeline creation
- Progress tracking
- Roadmap customization

### User Service (`services/user-service/`)

Handles user management:
- User registration and authentication
- Profile management
- User preferences
- Account settings

### Document Analysis Service (`services/document-analysis-service/`)

Analyzes uploaded documents:
- Document parsing
- Information extraction
- Validation against requirements
- Completeness checking

### ML Insights Service (`services/ml-insights-service/`)

Provides machine learning insights:
- Predictive analytics
- Pattern recognition
- Success probability calculation
- Trend analysis

## Database

The application uses MongoDB as its primary database, with Mongoose for object modeling.

## Authentication

Authentication is implemented using JWT (JSON Web Tokens) with the following components:

- `src/frontend/src/features/auth/` - Frontend authentication
- `src/backend/controllers/authController.js` - Backend authentication controller
- `services/user-service/` - User management microservice

## Key Features

### 1. User Management

- Registration and login
- Profile management
- Authentication and authorization

### 2. Assessment Quiz

- Multi-step questionnaire
- Response storage and analysis
- Progress tracking

### 3. Recommendation Engine

- Algorithm for matching user profiles to programs
- Personalized recommendations
- Scoring and ranking system

### 4. Document Management

- Document upload and storage
- Document categorization
- Document status tracking

### 5. Roadmap Generation

- Personalized immigration roadmaps
- Milestone creation and tracking
- Timeline visualization

### 6. PDF Generation

- Dynamic PDF creation
- Document formatting
- Integration with roadmap data

## Testing

- Jest for unit and integration testing
- React Testing Library for component testing
- Supertest for API testing

## Development Workflow and Tools

### Version Control

- Git for version control
- GitHub for repository hosting
- Branch-based workflow:
  - `main` - Production-ready code
  - `develop` - Integration branch
  - Feature branches for new features
  - Hotfix branches for urgent fixes

### Development Tools

- VS Code as the primary IDE
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- Jest for testing
- Postman for API testing
- MongoDB Compass for database management

### Build and Bundling

- Webpack for frontend bundling
- Babel for JavaScript transpilation
- npm for package management
- Docker for containerization

### Continuous Integration/Deployment

- GitHub Actions for CI/CD
- Automated testing on pull requests
- Automated deployment to staging environments

## Deployment

- Netlify for frontend deployment
- Docker for containerization
- Environment-specific configuration
- Automated deployment pipelines
- Monitoring and logging integration

## Research Data

Immigration research data is stored in:
- `Scout Research/` - Research documents and data
- `research/` - Additional research materials

## Project Planning

Project planning documents are stored in:
- `project-plan/` - Current project plan
- `project-plan-v1-archive/` - Archived project plans
- `project_plan_review_findings/` - Project plan review documents

## Current Development Status

### Completed Features

1. **User Management**
   - Registration and login functionality
   - JWT-based authentication
   - User profile management

2. **Assessment Quiz**
   - Question engine
   - Results processing
   - User response storage

3. **Basic UI Framework**
   - Header and navigation
   - Responsive layout
   - Theme implementation

### Partially Implemented Features

1. **Recommendation Engine**
   - Basic structure is in place
   - Some matching algorithms implemented
   - Integration with assessment results

2. **Document Management**
   - File upload functionality
   - Document categorization
   - Basic document listing

3. **Roadmap Generation**
   - Core roadmap structure
   - Basic milestone creation
   - Timeline visualization

4. **PDF Generation**
   - Basic PDF creation functionality
   - Integration with roadmap data
   - Document formatting

### Next Development Steps

1. **Complete Roadmap Generation System**
   - Finish milestone creation logic
   - Implement timeline visualization
   - Add progress tracking

2. **Enhance Document Management**
   - Improve document categorization
   - Add document status tracking
   - Implement document sharing

3. **Finalize PDF Generation**
   - Complete template system
   - Add dynamic content generation
   - Implement styling options

4. **UI/UX Improvements**
   - Address bland page issues
   - Improve mobile responsiveness
   - Add loading states and animations

5. **Testing and Documentation**
   - Increase test coverage
   - Improve documentation
   - Create user guides
