# Visafy Platform - Technical Architecture

## Architecture Overview

The Visafy Platform follows a modern web application architecture with the following key components:

### Frontend Architecture
- **Framework**: React.js with functional components and hooks
- **State Management**: Redux with Redux Toolkit
- **Routing**: React Router v6
- **UI Framework**: Material UI v5
- **API Communication**: Axios and Supabase client
- **Internationalization**: i18next
- **Form Handling**: Formik with Yup validation
- **Build Tool**: Create React App with CRACO for customization

### Backend Architecture
- **API Services**: Multiple microservices built with Node.js/Express
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL via Supabase
- **Vector Database**: pgvector extension in Supabase for similarity search
- **File Storage**: Supabase Storage
- **Deployment**: Render for API services, Netlify for frontend

## Data Flow

### Authentication Flow
1. User enters credentials in LoginPage
2. authService.login() is called
3. Supabase.auth.signInWithPassword() authenticates the user
4. Token is stored in localStorage
5. User state is updated in Redux
6. User is redirected to Dashboard

### Data Fetching Flow
1. Component mounts and dispatches a Redux action
2. Redux thunk middleware calls the appropriate service
3. Service makes API request to backend or Supabase
4. Response is processed and normalized
5. Redux store is updated with the data
6. Component re-renders with the new data

## Database Schema

### Supabase Tables
- **profiles**: User profile information
- **user_progress**: User progress through the immigration process
- **user_tasks**: Tasks assigned to users
- **user_documents**: Documents uploaded by users
- **user_recommendations**: Immigration program recommendations
- **immigration_programs**: Available immigration programs
- **countries**: Country information
- **documents**: Document templates and requirements

## API Services

### Program Service
- **URL**: https://migratio-program-service.onrender.com
- **Endpoints**:
  - `/api/programs`: Immigration program information
  - `/api/countries`: Country information
  - `/api/requirements`: Document requirements

### Quiz Service
- **URL**: https://migratio-quiz-api.onrender.com
- **Endpoints**:
  - `/quiz/questions`: Assessment questions
  - `/quiz/submit`: Submit quiz answers
  - `/quiz/results`: Get quiz results

### User Auth Service
- **URL**: https://migratio-user-auth.onrender.com
- **Endpoints**:
  - `/auth/register`: User registration
  - `/auth/login`: User login
  - `/profiles`: User profile management
  - `/dashboard`: Dashboard data

## Debugging the Blank Pages Issue

### Systematic Debugging Approach

1. **Isolate the Problem**:
   - Create a simplified version of the application
   - Add features back one by one to identify the breaking point

2. **Check Redux Store**:
   - Verify store configuration in `store.js`
   - Check that reducers are properly combined
   - Ensure store is properly provided to the application

3. **Examine React Router**:
   - Check route definitions in `App.js`
   - Verify that components are properly rendered
   - Check for nested routes that might cause issues

4. **Debug Authentication Flow**:
   - Verify token storage and retrieval
   - Check session management in Supabase
   - Ensure protected routes work correctly

5. **Check Component Rendering**:
   - Add console logs to component lifecycle methods
   - Check for errors in the browser console
   - Verify that components receive the expected props

### Common Issues and Solutions

1. **Redux Store Issues**:
   - **Issue**: Store not properly configured or imported
   - **Solution**: Ensure store is exported correctly and imported in index.js

2. **React Router Issues**:
   - **Issue**: Nested routes causing component rendering problems
   - **Solution**: Flatten route structure or ensure proper nesting

3. **Authentication Issues**:
   - **Issue**: Token not properly stored or retrieved
   - **Solution**: Update authUtils.js to handle Supabase tokens correctly

4. **Component Rendering Issues**:
   - **Issue**: Components not rendering due to errors
   - **Solution**: Add error boundaries and improve error handling

5. **Duplicate UI Elements**:
   - **Issue**: Nested layouts causing duplicate headers and footers
   - **Solution**: Ensure layouts are not nested and routes are properly structured

## Performance Optimization

### Current Performance Metrics
- **Bundle Size**: ~430KB gzipped
- **Initial Load Time**: ~2-3 seconds on fast connections
- **Time to Interactive**: ~3-4 seconds

### Optimization Strategies
1. **Code Splitting**:
   - Implement React.lazy and Suspense for component loading
   - Split code by route to reduce initial bundle size

2. **Bundle Optimization**:
   - Remove unused dependencies
   - Use tree-shaking to eliminate dead code
   - Optimize images and assets

3. **Caching Strategies**:
   - Implement service worker for offline support
   - Cache API responses for faster subsequent loads
   - Use localStorage for persistent data

4. **Rendering Optimization**:
   - Memoize expensive computations with useMemo
   - Prevent unnecessary re-renders with React.memo
   - Optimize list rendering with virtualization

## Security Considerations

### Current Security Measures
1. **Authentication**: Supabase JWT-based authentication
2. **Authorization**: Row-level security in Supabase
3. **Data Validation**: Input validation on both client and server
4. **HTTPS**: All communications over secure connections

### Security Improvements Needed
1. **CSP**: Implement Content Security Policy
2. **CSRF Protection**: Add CSRF tokens for form submissions
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Security Headers**: Add security headers to prevent common attacks
5. **Audit Logging**: Implement comprehensive audit logging

## Testing Strategy

### Current Testing Setup
- **Unit Tests**: Jest for testing individual components and functions
- **Integration Tests**: Testing interactions between components
- **E2E Tests**: Cypress for end-to-end testing

### Test Coverage
- **Components**: ~60% coverage
- **Redux**: ~70% coverage
- **Utilities**: ~80% coverage
- **Services**: ~50% coverage

### Testing Improvements Needed
1. **Increase Coverage**: Aim for 80%+ coverage across the codebase
2. **Automated Testing**: Implement CI/CD pipeline with automated tests
3. **Performance Testing**: Add performance testing to prevent regressions
4. **Accessibility Testing**: Ensure the application is accessible to all users
