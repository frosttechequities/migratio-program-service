# Visafy Platform - Project Documentation

## Current State of the Project

### Overview
The Visafy Platform is a comprehensive immigration assistance application designed to help users navigate the complex immigration process. The project consists of multiple components including a frontend React application, backend services, and a Supabase database.

### Recent Achievements
1. **Fixed Blank Pages**: The blank pages issue has been resolved by fixing the layout structure and authentication flow.
2. **Fixed Duplicate UI Elements**: The duplicate headers and footers issue has been fixed by restructuring the layout components.
3. **Improved Authentication**: The authentication flow with Supabase has been enhanced with better token management and error handling.
4. **Implemented Ollama Integration**: Successfully integrated Ollama for local LLM capabilities, replacing the dependency on external API services like OpenRouter.
5. **Enhanced Vector Search Service**: Updated the vector search service with improved error handling and fallback mechanisms for AI responses.

### Current Focus
1. **User Experience Improvements**: Enhancing the user interface and experience.
2. **Feature Completion**: Completing the roadmap generation and document management features.
3. **Performance Optimization**: Improving application performance and reducing load times.
4. **API Integration**: Resolving connection issues with backend services and APIs.

### Known API Connection Issues
The application currently has some API connection issues that need to be addressed:

1. **Recommendations API (401 Unauthorized)**: Calls to `/api/recommendations/destinations` return 401 Unauthorized errors. The authentication token is not being properly passed to the API.

2. **Resources API (404 Not Found)**: Calls to `/api/resources?tags=dashboard,post-arrival` fail with 404 Not Found errors. The resources endpoint does not exist on the deployed backend service or the API path is incorrect.

3. **Supabase Queries (406 Status Code)**: Queries to the user_progress table return 406 status codes. The Accept header is not being set correctly.

4. **Roadmap Events API (Connection Refused)**: Calls to `/api/roadmaps/events` fail with connection refused errors. The API is trying to connect to localhost:3006 instead of the deployed backend URL.

These issues don't affect the core functionality of the application (pages are loading correctly without blank screens or duplicate headers/footers), but they do impact specific features like resource recommendations and destination suggestions.

### Project Structure
- **Frontend**: React application with Redux for state management
- **Backend Services**: Multiple microservices for different functionalities
- **Database**: Supabase for data storage and authentication

## Development Environment

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- Git

### Repository Structure
```
migratio-program-service/
├── src/
│   ├── frontend/           # React frontend application
│   ├── backend/            # Backend services
│   └── shared/             # Shared utilities and types
├── docs/                   # Documentation
└── everything you need to know/ # Comprehensive project documentation
```

### Frontend Structure
```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/                # App configuration
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── features/           # Feature modules (Redux slices)
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   ├── App.js              # Main App component
│   ├── index.js            # Entry point
│   ├── store.js            # Redux store configuration
│   └── simpleStore.js      # Simplified Redux store for testing
```

## Running the Project

### Local Development
1. Clone the repository:
   ```
   git clone https://github.com/frosttechequities/migratio-program-service.git
   cd migratio-program-service
   ```

2. Install dependencies:
   ```
   cd src/frontend
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   This will start the application on http://localhost:3000

### Building for Production
1. Create a production build:
   ```
   cd src/frontend
   npm run build
   ```
   This creates a `build` folder with optimized production files.

2. Deploy to Netlify:
   ```
   npx netlify-cli deploy --prod --dir=build
   ```

## Integrations

### 1. Supabase Integration
The application uses Supabase for:
- Authentication (sign up, login, password reset)
- Database storage
- Real-time updates

**Configuration**:
- Supabase URL: `https://qyvvrvthalxeibsmckep.supabase.co`
- Supabase Anon Key: Environment variable `REACT_APP_SUPABASE_ANON_KEY`

**Files**:
- `src/frontend/src/utils/supabaseClient.js`: Main Supabase client configuration
- `src/frontend/src/utils/simpleSupabaseClient.js`: Simplified client for testing
- `src/frontend/src/utils/authUtils.js`: Authentication utilities for Supabase

### 2. Redux Integration
The application uses Redux for state management:

**Files**:
- `src/frontend/src/store.js`: Main Redux store configuration
- `src/frontend/src/simpleStore.js`: Simplified store for testing
- `src/frontend/src/features/*/[feature]Slice.js`: Redux slices for different features

### 3. React Router Integration
The application uses React Router for navigation:

**Files**:
- `src/frontend/src/App.js`: Main routing configuration
- `src/frontend/src/components/auth/ProtectedRoute.js`: Route protection for authenticated users

### 4. Material UI Integration
The application uses Material UI for the user interface:

**Files**:
- `src/frontend/src/theme.js`: Theme configuration
- Various component files using Material UI components

## Resolved Issues and Solutions

### 1. Ollama Integration - RESOLVED
The application previously relied on OpenRouter for AI-powered responses, which had authentication and rate limit issues. This has been resolved by:

- **Local LLM Integration**: Implemented Ollama for local LLM capabilities, eliminating the dependency on external API services.
- **Multiple Model Support**: Configured the system to use multiple models (deepseek-r1:1.5b, mistral, llama3) with fallback mechanisms.
- **Improved Error Handling**: Enhanced error handling and availability checking to ensure graceful degradation.
- **CLI Fallback**: Added support for using the Ollama CLI directly when the API has issues.

**Implemented Solutions**:
- Created a dedicated Ollama API wrapper module (`ollama-api.js`)
- Implemented availability checking to detect when Ollama is not running
- Added fallback mechanisms to use alternative models or mock implementations
- Updated the vector search service to use the new Ollama integration
- Tested the integration with both API and CLI approaches

### 2. Blank Pages Issue - RESOLVED
The application previously displayed blank pages when navigating to most routes. This was due to:

- **Layout Structure Issues**: Nested layout components were causing rendering problems.
- **Authentication Flow Issues**: Token expiration was not properly handled, and JWT validation was failing.
- **Component Rendering Issues**: Components were not properly handling loading and error states.

**Implemented Solutions**:
- Restructured the layout hierarchy to eliminate nested layouts
- Implemented proper token refresh and validation
- Added better error handling and loading indicators
- Updated the MainLayout component to not use the Layout component
- Restructured the routes in App.js to have a single Layout wrapper

### 2. Duplicate Headers and Footers - RESOLVED
The application displayed duplicate headers and footers on some pages. This was due to:

- **Nested Layouts**: The application was using nested layout components.
- **Component Structure**: The way components were structured was causing duplication.

**Implemented Solutions**:
- Updated the MainLayout component to not use the Layout component
- Restructured the routes in App.js to have a single Layout wrapper
- Removed layout wrappers from individual page components
- Added document title management in the App.js file

### 3. Authentication Issues - RESOLVED
The authentication flow with Supabase was not working correctly. This was due to:

- **Token Handling**: Issues with how tokens were stored and retrieved.
- **Session Management**: Problems with session management in Supabase.
- **Token Expiration**: JWT tokens were expiring without being refreshed.

**Implemented Solutions**:
- Enhanced token expiration checking in authUtils.js
- Implemented token refresh functionality in supabaseClient.js
- Updated the getAuthenticatedClient function to refresh tokens when needed
- Added better error handling for authentication failures
- Implemented a singleton pattern for the Supabase client to prevent multiple instances

## Deployment

### Netlify Deployment
The application is deployed to Netlify:

- **Production URL**: https://visafy-platform.netlify.app
- **Configuration**: `netlify.toml` in the frontend directory

**Deployment Process**:
1. Build the application: `npm run build`
2. Deploy to Netlify: `npx netlify-cli deploy --prod --dir=build`

### Environment Variables
The application uses the following environment variables:

- `REACT_APP_SUPABASE_URL`: Supabase URL
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase anonymous key
- `REACT_APP_API_URL`: API URL for backend services

These are configured in:
- `.env`: Development environment variables
- `.env.production`: Production environment variables
- `netlify.toml`: Netlify environment variables

## Next Steps

### 1. Complete Feature Implementation
- Finish the roadmap generation system
- Complete the document management system
- Implement PDF generation for roadmaps and documents

### 2. Enhance User Experience
- Improve UI/UX across all pages
- Add animations and transitions
- Implement responsive design for mobile devices

### 3. Optimize Performance
- Optimize bundle size
- Implement code splitting
- Add caching strategies
- Reduce API calls and improve data fetching

### 4. Add Comprehensive Testing
- Implement unit tests for all components
- Add integration tests for key user flows
- Set up end-to-end testing

### 5. Implement Advanced Features
- Add AI-powered recommendations
- Implement real-time notifications
- Add collaborative features for immigration consultants
- Enhance data visualization for roadmaps

## Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Redux Documentation](https://redux.js.org/introduction/getting-started)
- [Supabase Documentation](https://supabase.io/docs)
- [Material UI Documentation](https://mui.com/getting-started/usage/)
- [Netlify Documentation](https://docs.netlify.com/)

### Project-Specific Resources
- GitHub Repository: https://github.com/frosttechequities/migratio-program-service
- Supabase Project: https://app.supabase.io/project/qyvvrvthalxeibsmckep
- Netlify Site: https://app.netlify.com/sites/visafy-platform
