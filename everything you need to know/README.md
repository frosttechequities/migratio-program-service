# Visafy Platform Documentation

## Overview

This folder contains comprehensive documentation for the Visafy Platform project. It provides detailed information about the current state of the project, technical architecture, debugging guides, integrations, and future plans.

## Table of Contents

1. [Project Documentation](project_documentation.md) - Overview of the project, current state, and critical issues
2. [Technical Architecture](technical_architecture.md) - Detailed information about the technical architecture
3. [Debugging Guide](debugging_guide.md) - Step-by-step guide for debugging current issues
4. [Integrations and APIs](integrations_and_apis.md) - Information about integrations and APIs
5. [Roadmap and Future Plans](roadmap_and_future_plans.md) - Roadmap and future plans for the project

## Recent Achievements

The project has made significant progress with several key issues resolved:

1. **Fixed Blank Pages**: The blank pages issue has been resolved by fixing the layout structure and authentication flow.
2. **Fixed Duplicate UI Elements**: The duplicate headers and footers issue has been fixed by restructuring the layout components.
3. **Improved Authentication**: The authentication flow with Supabase has been enhanced with better token management and error handling.

## Current Focus Areas

The project is now focusing on:

1. **User Experience Improvements**: Enhancing the user interface and experience.
2. **Feature Completion**: Completing the roadmap generation and document management features.
3. **Performance Optimization**: Improving application performance and reducing load times.
4. **API Integration**: Resolving connection issues with backend services and APIs.

## Known API Connection Issues

While the core application is now functioning correctly (pages are loading without blank screens or duplicate headers/footers), there are still some API connection issues:

1. **Recommendations API (401 Unauthorized)**: Calls to `/api/recommendations/destinations` return 401 Unauthorized errors. The authentication token is not being properly passed to the API.

2. **Resources API (404 Not Found)**: Calls to `/api/resources?tags=dashboard,post-arrival` fail with 404 Not Found errors. The resources endpoint does not exist on the deployed backend service or the API path is incorrect.

3. **Supabase Queries (406 Status Code)**: Queries to the user_progress table return 406 status codes. The Accept header is not being set correctly.

4. **Roadmap Events API (Connection Refused)**: Calls to `/api/roadmaps/events` fail with connection refused errors. The API is trying to connect to localhost:3006 instead of the deployed backend URL.

These issues impact specific features like resource recommendations and destination suggestions, but the main application functionality is working correctly. Detailed solutions for these issues are provided in the [Debugging Guide](debugging_guide.md).

## Quick Start

### Running the Project Locally

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

## Project Structure

```
migratio-program-service/
├── src/
│   ├── frontend/           # React frontend application
│   ├── backend/            # Backend services
│   └── shared/             # Shared utilities and types
├── docs/                   # Documentation
└── everything you need to know/ # Comprehensive project documentation
```

## Key Technologies

- **Frontend**: React, Redux, Material UI
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify (frontend), Render (backend)

## Debugging the Blank Pages Issue

To debug the blank pages issue, follow these steps:

1. Check the browser console for errors
2. Examine the Redux store configuration
3. Debug the React Router setup
4. Investigate the authentication flow
5. Check component rendering

For detailed debugging steps, see the [Debugging Guide](debugging_guide.md).

## Fixing the Duplicate Headers and Footers

To fix the duplicate headers and footers, follow these steps:

1. Check the layout components to ensure they're not nested
2. Update the route configuration to ensure proper structure

For detailed steps, see the [Debugging Guide](debugging_guide.md).

## Deployment

The application is deployed to:

- **Frontend**: https://visafy-platform.netlify.app
- **Backend Services**:
  - Program Service: https://migratio-program-service.onrender.com
  - Quiz Service: https://migratio-quiz-api.onrender.com
  - User Auth Service: https://migratio-user-auth.onrender.com

## Contributing

To contribute to the project:

1. Create a new branch for your feature or bugfix
2. Make your changes
3. Run tests to ensure everything works
4. Submit a pull request

## Contact

For questions or support, contact:
- GitHub: [frosttechequities](https://github.com/frosttechequities)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
