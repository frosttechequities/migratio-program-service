# Visafy Roadmap Generation System

This document provides an overview of the Roadmap Generation System implemented for the Visafy platform.

## Overview

The Roadmap Generation System creates personalized immigration roadmaps for users based on their assessment results and recommendations. The system uses real-world immigration program data to generate detailed, step-by-step roadmaps that guide users through their immigration journey.

## Components

### 1. Immigration Program Data

- **Location**: `src/data/immigration/programs/`
- **Files**:
  - `canada-programs.js`: Canadian immigration programs
  - `australia-programs.js`: Australian immigration programs
  - `uk-programs.js`: UK immigration programs
  - `index.js`: Exports all programs

The program data includes detailed information about each immigration program, including eligibility criteria, processing times, fees, and success rates.

### 2. Roadmap Generator

- **Location**: `src/services/roadmap-generator/`
- **Files**:
  - `index.js`: Main roadmap generator service
  - `phase-generator.js`: Generates preparation phase
  - `document-phase.js`: Generates document collection phase
  - `application-phase.js`: Generates application submission phase
  - `processing-phase.js`: Generates application processing phase
  - `pre-arrival-phase.js`: Generates pre-arrival preparation phase
  - `settlement-phase.js`: Generates arrival and settlement phase

The roadmap generator creates a personalized roadmap with phases, milestones, and tasks based on the user's profile and the selected immigration program.

### 3. Document Management

- **Location**: `src/models/document.model.js`

The document model represents documents in the document management system, with features for tracking document status, metadata, and history.

### 4. PDF Generation

- **Location**: `src/services/pdf-generator/`
- **Files**:
  - `roadmap-pdf.js`: Generates PDF documents for roadmaps

The PDF generator creates downloadable PDF documents of roadmaps for users to save or print.

### 5. API Routes and Controllers

- **Routes**: `src/routes/roadmapRoutes.js`
- **Controllers**: `src/controllers/roadmap.controller.js`

The API routes and controllers handle roadmap-related requests, including roadmap generation, retrieval, and updates.

## Usage

### Seeding Immigration Data

To seed the database with immigration program data:

```bash
npm run seed:immigration-data
```

To force a full refresh of the data:

```bash
npm run seed:immigration-data -- --force
```

### Testing Roadmap Generation

To test the roadmap generator:

```bash
npm run test:roadmap-generator
```

### Testing PDF Generation

To test the PDF generator:

```bash
npm run test:pdf
```

### Testing Document Management

To test the document management system:

```bash
npm run test:document-management
```

## API Endpoints

### Roadmap Endpoints

- `POST /api/roadmaps/generate`: Generate a new roadmap based on a recommendation
- `GET /api/roadmaps`: Get all roadmaps for the current user
- `GET /api/roadmaps/:roadmapId`: Get a roadmap by ID
- `PUT /api/roadmaps/:roadmapId/status`: Update roadmap status
- `DELETE /api/roadmaps/:roadmapId`: Delete a roadmap
- `PUT /api/roadmaps/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/status`: Update milestone status
- `PUT /api/roadmaps/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/tasks/:taskIndex/status`: Update task status
- `GET /api/roadmaps/:roadmapId/documents`: Get documents for a roadmap

### PDF Endpoints

- `GET /api/pdf/roadmaps/:roadmapId`: Generate a PDF for a roadmap
- `GET /api/pdf/documents/:documentId`: Generate a PDF for a document

## Data Models

### Roadmap Model

The roadmap model represents a personalized immigration roadmap for a user, with phases, milestones, and tasks.

Key fields:
- `userId`: User ID
- `recommendationId`: Recommendation ID
- `programId`: Immigration program ID
- `programName`: Immigration program name
- `country`: Destination country
- `status`: Roadmap status (draft, active, completed, archived)
- `progress`: Completion percentage
- `phases`: Array of phases

### Document Model

The document model represents a document in the document management system.

Key fields:
- `userId`: User ID
- `roadmapId`: Roadmap ID
- `title`: Document title
- `category`: Document category
- `documentType`: Document type
- `status`: Document status
- `fileDetails`: File details
- `metadata`: Document metadata
- `history`: Document history

## Future Enhancements

1. **Notifications**: Add notifications for upcoming deadlines and document expirations
2. **Document Templates**: Provide templates for common documents
3. **Integration with External Services**: Integrate with external services for document verification
4. **Mobile App Support**: Enhance the system for mobile app usage
5. **AI-Powered Recommendations**: Use AI to provide more personalized recommendations

## Troubleshooting

If you encounter issues with the roadmap generation system, try the following:

1. Check the logs for error messages
2. Ensure the database is properly seeded with immigration program data
3. Verify that the user has a valid recommendation
4. Check that all required dependencies are installed

For more detailed troubleshooting, refer to the error logs or contact the development team.
