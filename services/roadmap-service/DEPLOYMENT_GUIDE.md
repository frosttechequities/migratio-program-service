# Visafy Roadmap Service Deployment Guide

This guide provides step-by-step instructions for deploying the Visafy Roadmap Service to Render.

## Prerequisites

Before deploying, ensure you have:

1. A GitHub account
2. A Render account
3. A MongoDB Atlas account (or other MongoDB provider)
4. Access to the Visafy Roadmap Service code

## Step 1: Prepare the Code

1. Create a new GitHub repository:
   - Name: `migratio-roadmap-service`
   - Description: "Visafy Roadmap Service for managing immigration roadmaps"
   - Public or Private (your choice)

2. Clone the repository locally:
   ```
   git clone https://github.com/your-username/migratio-roadmap-service.git
   ```

3. Copy the Roadmap Service code to the cloned repository

4. Push the code to GitHub:
   ```
   git add .
   git commit -m "Initial commit for Roadmap Service"
   git push -u origin main
   ```

## Step 2: Set Up MongoDB Atlas

1. Log in to MongoDB Atlas
2. Create a new cluster (or use an existing one)
3. Create a database user with read/write permissions
4. Configure network access (allow access from anywhere for Render)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with `migratio_roadmap_service`

## Step 3: Deploy to Render

1. Log in to Render dashboard
2. Click "New +" and select "Web Service"
3. Connect to your GitHub repository:
   - Select GitHub
   - Find and select your `migratio-roadmap-service` repository
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

## Step 5: Test the Deployed Service

1. Test creating a roadmap:
   ```
   POST https://migratio-roadmap-service.onrender.com/api/roadmaps
   Headers:
     Authorization: Bearer <your_jwt_token>
     Content-Type: application/json
   Body:
     {
       "programId": "your_program_id",
       "recommendationId": "your_recommendation_id",
       "title": "My Immigration Roadmap"
     }
   ```

2. Test getting all roadmaps:
   ```
   GET https://migratio-roadmap-service.onrender.com/api/roadmaps
   Headers:
     Authorization: Bearer <your_jwt_token>
   ```

## Step 6: Integrate with Frontend

1. Update the frontend code to use the deployed Roadmap Service API
2. Test the integration to ensure it works correctly

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

## Next Steps

After successful deployment:

1. Set up monitoring for the service
2. Implement logging for better debugging
3. Consider setting up CI/CD for automated deployments
4. Implement rate limiting and other security measures

For any issues or questions, contact the Visafy development team.
