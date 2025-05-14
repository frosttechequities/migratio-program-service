# Roadmap Service Deployment Steps

This document provides step-by-step instructions for deploying the Roadmap Service to Render.

## Prerequisites

- GitHub account
- Render account
- MongoDB Atlas account (or other MongoDB provider)

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/new) and create a new repository:
   - Repository name: `migratio-roadmap-service`
   - Description: "Visafy Roadmap Service for managing immigration roadmaps"
   - Public repository
   - Do NOT initialize with README, .gitignore, or license
   - Click "Create repository"

2. Copy the repository URL:
   ```
   https://github.com/frosttechequities/migratio-roadmap-service.git
   ```

## Step 2: Push the Code to GitHub

1. Initialize a Git repository in the roadmap-service directory:
   ```
   cd services/roadmap-service
   git init
   ```

2. Add all files to the repository:
   ```
   git add .
   ```

3. Commit the files:
   ```
   git commit -m "Initial commit for Roadmap Service"
   ```

4. Add the remote repository:
   ```
   git remote add origin https://github.com/frosttechequities/migratio-roadmap-service.git
   ```

5. Push the code to GitHub:
   ```
   git push -u origin main
   ```

## Step 3: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect to your GitHub repository:
   - Select "GitHub" as the deployment method
   - Find and select your repository: `frosttechequities/migratio-roadmap-service`
   - If you don't see it, click "Configure account" to refresh your repository list

4. Configure the service:
   - Name: `migratio-roadmap-service`
   - Environment: `Docker`
   - Branch: `main`
   - Root Directory: Leave empty (or specify if in a subdirectory)

5. Set environment variables:
   - Key: `MONGODB_URI`, Value: Your MongoDB Atlas connection string
   - Key: `JWT_SECRET`, Value: A secure random string for JWT token generation
   - Key: `PROGRAM_SERVICE_URL`, Value: `https://migratio-program-service.onrender.com/api`
   - Key: `NODE_ENV`, Value: `production`
   - Key: `CORS_ORIGIN`, Value: `*` (or your frontend URL)

6. Click "Create Web Service"

## Step 4: Monitor the Deployment

1. Watch the build logs for any errors
2. Once deployed, check the logs for successful MongoDB connection
3. Test the API endpoints using a tool like Postman or curl

## Step 5: Update Frontend Configuration

1. Update the `roadmapService.js` file in the frontend to use the deployed Roadmap Service URL:
   ```javascript
   const API_URL = process.env.REACT_APP_ROADMAP_SERVICE_URL || 'https://migratio-roadmap-service.onrender.com/api';
   ```

2. Implement the `generateRoadmap` function in `roadmapService.js` to create roadmaps using the deployed service.

## Step 6: Test the Integration

1. Test creating a roadmap from the frontend
2. Test viewing roadmap details
3. Test updating task and document status

## Troubleshooting

### Common Issues and Solutions

1. **Authentication Errors**:
   - Ensure the JWT_SECRET is set correctly
   - Verify the token is being sent in the Authorization header

2. **MongoDB Connection Errors**:
   - Check that the MONGODB_URI is correct
   - Ensure network access is configured properly in MongoDB Atlas

3. **CORS Errors**:
   - Set CORS_ORIGIN to the correct frontend URL or use "*" for development

4. **Build Failures**:
   - Check the build logs for specific errors
   - Ensure all dependencies are correctly specified in package.json
