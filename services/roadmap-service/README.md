# Visafy Roadmap Service

This service manages the generation and management of personalized immigration roadmaps for users based on their assessment results and program recommendations.

## Features

- Create personalized immigration roadmaps based on program recommendations
- Retrieve and manage user roadmaps
- Update roadmap details, task status, and document status
- Track progress through immigration journey phases

## API Endpoints

### Roadmaps

- `POST /api/roadmaps` - Create a new roadmap
- `GET /api/roadmaps` - Get all roadmaps for the authenticated user
- `GET /api/roadmaps/:id` - Get a specific roadmap by ID
- `PATCH /api/roadmaps/:id` - Update a roadmap's details
- `DELETE /api/roadmaps/:id` - Delete a roadmap

### Tasks and Documents

- `PATCH /api/roadmaps/:roadmapId/phases/:phaseId/tasks/:taskId` - Update a task's status
- `PATCH /api/roadmaps/:roadmapId/phases/:phaseId/documents/:docStatusId` - Update a document's status

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- JWT Secret for authentication

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the service:
   ```
   npm start
   ```

## Deployment to Render

### Using GitHub Integration

1. Create a GitHub repository for the Roadmap Service
2. Push the code to the repository
3. In Render dashboard, create a new Web Service
4. Connect to your GitHub repository
5. Configure the service:
   - Name: `migratio-roadmap-service`
   - Environment: `Docker`
   - Branch: `main`
   - Root Directory: Leave empty (or specify if in a subdirectory)
6. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret for JWT token generation
   - `PROGRAM_SERVICE_URL`: URL of the Program Service API (e.g., `https://migratio-program-service.onrender.com/api`)
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `*` (or your frontend URL)
7. Click "Create Web Service"

### Manual Deployment

1. Create a new Web Service in Render
2. Choose "Deploy from Docker Registry"
3. Configure the service as above
4. Set the same environment variables

## Integration with Frontend

The frontend should use the deployed Roadmap Service API for:

1. Creating new roadmaps based on recommendations
2. Displaying roadmap details and progress
3. Updating task and document status
4. Managing roadmaps (update, delete)

## Dependencies

- Express - Web framework
- Mongoose - MongoDB object modeling
- JWT - Authentication
- Axios - HTTP client for service communication
- Cors - Cross-Origin Resource Sharing

## License

ISC
