# Migratio: Technical Architecture Overview

## 1. Technology Stack

### 1.1 Frontend

- **Framework**: React.js
- **State Management**: Redux
- **UI Library**: Material-UI
- **Form Handling**: Formik with Yup validation
- **API Communication**: Axios
- **PDF Generation**: React-PDF
- **Build Tool**: Webpack
- **Testing**: Jest and React Testing Library

### 1.2 Backend

- **Framework**: Node.js with Express
- **API Design**: RESTful with OpenAPI specification
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi
- **File Processing**: Multer, Sharp
- **PDF Processing**: PDFKit
- **Testing**: Mocha and Chai

### 1.3 Database

- **Primary Database**: MongoDB
- **File Storage**: AWS S3
- **Caching**: Redis
- **Search**: MongoDB Atlas Search

### 1.4 DevOps

- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: AWS (EC2, ELB, S3)
- **Monitoring**: AWS CloudWatch
- **Logging**: Winston, Morgan

## 2. System Architecture

The Migratio platform follows a microservices-inspired architecture with a monolithic core:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                       │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │ Web App       │  │ Mobile Web    │  │ Admin Portal      │   │
│  │ (React)       │  │ (Responsive)  │  │ (React)           │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                              │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │ Authentication│  │ Rate Limiting │  │ Request Routing   │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Core Application                           │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │ User Service  │  │ Assessment    │  │ Recommendation    │   │
│  │               │  │ Service       │  │ Service           │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │ Document      │  │ Roadmap       │  │ PDF Generation    │   │
│  │ Service       │  │ Service       │  │ Service           │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                 │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │ MongoDB       │  │ Redis Cache   │  │ S3 Document       │   │
│  │ Database      │  │               │  │ Storage           │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Core Services

### 3.1 User Service

Manages user accounts, authentication, and profile data:
- User registration and authentication
- Profile management
- Session handling
- Password reset
- User preferences

### 3.2 Assessment Service

Handles the immigration assessment process:
- Quiz question management
- Response collection and validation
- Progress tracking
- Conditional question logic
- Assessment result calculation

### 3.3 Recommendation Service

Processes user data to generate immigration recommendations:
- Program matching algorithms
- Eligibility calculations
- Match percentage scoring
- Program comparison
- Recommendation storage

### 3.4 Document Service

Manages user document uploads and organization:
- Document upload and storage
- Document categorization
- Document metadata management
- Document retrieval
- Basic document validation

### 3.5 Roadmap Service

Generates personalized immigration roadmaps:
- Roadmap template management
- Personalized step generation
- Timeline calculation
- Milestone tracking
- Roadmap updates based on profile changes

### 3.6 PDF Generation Service

Creates downloadable PDF documents:
- PDF template management
- Dynamic content insertion
- Document styling
- File generation and storage
- Download link creation

## 4. Data Flow

### 4.1 User Registration & Assessment Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Sign Up ├────►│  Profile ├────►│Assessment├────►│ Results  │
│          │     │  Setup   │     │  Quiz    │     │  Page    │
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                        │
                                                        ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│ Dashboard│◄────┤  Roadmap │◄────┤ Program  │◄────┤Recommend-│
│          │     │Generation│     │Selection │     │ations    │
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### 4.2 Document Management Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│ Document ├────►│  Upload  ├────►│Processing├────►│ Storage  │
│ Request  │     │  Form    │     │          │     │          │
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                        │
                                                        ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│ Document │◄────┤ Metadata │◄────┤ Status   │◄────┤ Document │
│ Library  │     │ Update   │     │ Update   │     │ Database │
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

## 5. API Structure

The API follows RESTful principles with the following main endpoints:

### 5.1 Authentication API

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### 5.2 User API

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/me/preferences` - Get user preferences
- `PUT /api/users/me/preferences` - Update user preferences

### 5.3 Assessment API

- `GET /api/assessment/questions` - Get assessment questions
- `POST /api/assessment/responses` - Submit assessment responses
- `GET /api/assessment/progress` - Get assessment progress
- `GET /api/assessment/results` - Get assessment results

### 5.4 Recommendation API

- `GET /api/recommendations` - Get user recommendations
- `GET /api/recommendations/:id` - Get specific recommendation
- `GET /api/programs` - Get all immigration programs
- `GET /api/programs/:id` - Get specific program details

### 5.5 Document API

- `POST /api/documents` - Upload new document
- `GET /api/documents` - Get user documents
- `GET /api/documents/:id` - Get specific document
- `PUT /api/documents/:id` - Update document metadata
- `DELETE /api/documents/:id` - Delete document
- `GET /api/document-types` - Get document types

### 5.6 Roadmap API

- `GET /api/roadmaps` - Get user roadmaps
- `GET /api/roadmaps/:id` - Get specific roadmap
- `POST /api/roadmaps` - Generate new roadmap
- `GET /api/roadmaps/:id/pdf` - Generate roadmap PDF

## 6. Security Considerations

### 6.1 Authentication & Authorization

- JWT-based authentication with short-lived access tokens
- Refresh token rotation for enhanced security
- Role-based access control
- CSRF protection
- Rate limiting on authentication endpoints

### 6.2 Data Protection

- Encryption of sensitive data at rest
- TLS for all data in transit
- Secure password hashing (bcrypt)
- PII data handling according to GDPR
- Document access controls

### 6.3 Infrastructure Security

- VPC configuration with private subnets
- Security groups and network ACLs
- Regular security patches
- WAF for API protection
- DDoS protection

## 7. Scalability Considerations

### 7.1 Horizontal Scaling

- Stateless application design
- Container orchestration readiness
- Database sharding preparation
- Load balancing

### 7.2 Performance Optimization

- Redis caching for frequent queries
- CDN for static assets
- Optimized database indexes
- Efficient file processing pipeline

## 8. Monitoring & Logging

### 8.1 Application Monitoring

- Request/response timing
- Error rates
- API usage metrics
- User journey tracking

### 8.2 Infrastructure Monitoring

- Server resource utilization
- Database performance
- Storage capacity
- Network throughput

### 8.3 Logging Strategy

- Centralized logging
- Structured log format
- Log levels (debug, info, warn, error)
- Request ID tracking across services

## 9. Development Environment

### 9.1 Local Development

- Docker Compose for local services
- Environment-based configuration
- Hot reloading
- Local MongoDB and S3-compatible storage

### 9.2 Testing Environments

- Development environment
- Staging environment
- Production environment
- Isolated test databases

## 10. Deployment Strategy

### 10.1 CI/CD Pipeline

- Automated testing on pull requests
- Build and deployment automation
- Environment promotion workflow
- Rollback capabilities

### 10.2 Release Process

- Feature branch workflow
- Semantic versioning
- Release notes generation
- Database migration handling
