# Render Deployment Guide for Visafy Vector Search Service

This guide provides step-by-step instructions for deploying the Visafy Vector Search Service to Render.

## Prerequisites

- GitHub account with access to the repository
- Render account with access to create new services
- Supabase account with the vector database set up
- Google Gemini API key

## Deployment Steps

### Option 1: Deploy using Blueprint (Recommended)

1. Go to the Render Dashboard: https://dashboard.render.com/
2. Click on "New" and select "Blueprint" from the dropdown menu
3. Connect your GitHub repository (frosttechequities/migratio-program-service)
4. Select the branch (fix-supabase-integration)
5. Render will automatically detect the render.yaml file and create the services
6. Review the configuration and click "Apply"
7. Set the environment variables:
   - `SUPABASE_API_KEY`: Your Supabase API key
   - `GOOGLE_API_KEY`: Your Google Gemini API key
8. Click "Create Blueprint" to deploy the services

### Option 2: Deploy Manually

If the Blueprint option doesn't work, you can deploy the service manually:

1. Go to the Render Dashboard: https://dashboard.render.com/
2. Click on "New" and select "Web Service" from the dropdown menu
3. Connect your GitHub repository (frosttechequities/migratio-program-service)
4. Configure the service:
   - **Name**: visafy-vector-search-service
   - **Environment**: Node
   - **Branch**: fix-supabase-integration
   - **Build Command**: `cd src/services/vector-search-service && npm install`
   - **Start Command**: `cd src/services/vector-search-service && npm start`
   - **Plan**: Free (or select a paid plan for production)
5. Add environment variables:
   - `SUPABASE_URL`: https://qyvvrvthalxeibsmckep.supabase.co
   - `SUPABASE_API_KEY`: Your Supabase API key
   - `GOOGLE_API_KEY`: Your Google Gemini API key
   - `PORT`: 10000
   - `NODE_ENV`: production
6. Click "Create Web Service" to deploy the service

## Verifying the Deployment

After the deployment is complete, you can verify that the service is working correctly:

1. Go to the service page in the Render Dashboard
2. Click on the service URL to open the service in a new tab
3. Add `/health` to the URL to check the health endpoint
   - Example: https://visafy-vector-search-service.onrender.com/health
4. You should see a response like:
   ```json
   {
     "status": "ok",
     "message": "Vector search service is running"
   }
   ```

## Testing the Deployed Service

You can test the deployed service using the test script:

1. Update the `TEST_API_URL` in the test script to point to the deployed service
   ```javascript
   const API_URL = process.env.TEST_API_URL || 'https://visafy-vector-search-service.onrender.com';
   ```
2. Run the test script:
   ```
   cd src/services/vector-search-service
   npm test
   ```

## Updating the Frontend

After the service is deployed, you need to update the frontend to use the deployed service:

1. Update the `.env` file in the frontend directory:
   ```
   REACT_APP_VECTOR_SEARCH_SERVICE_URL=https://visafy-vector-search-service.onrender.com
   ```
2. Rebuild and deploy the frontend

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check the build logs for errors
   - Make sure the build command is correct
   - Verify that all dependencies are installed

2. **Service Crashes**
   - Check the logs for errors
   - Make sure the environment variables are set correctly
   - Verify that the Supabase and Gemini API keys are valid

3. **API Requests Fail**
   - Check the CORS configuration
   - Verify that the API endpoints are correct
   - Check the network tab in the browser developer tools for errors

### Logs

You can view the logs for the service in the Render Dashboard:

1. Go to the service page in the Render Dashboard
2. Click on the "Logs" tab
3. Select the log type (Build, Deploy, or Runtime)
4. Review the logs for errors

## Monitoring

Render provides basic monitoring for your service:

1. Go to the service page in the Render Dashboard
2. Click on the "Metrics" tab
3. View the CPU, memory, and network usage

For more advanced monitoring, consider using a third-party service like Datadog or New Relic.

## Scaling

If you need to scale the service, you can upgrade the service plan in the Render Dashboard:

1. Go to the service page in the Render Dashboard
2. Click on the "Settings" tab
3. Scroll down to the "Plan" section
4. Select a new plan and click "Update Plan"

## Conclusion

You have successfully deployed the Visafy Vector Search Service to Render. The service is now available at the URL provided by Render, and you can use it to power the semantic search and AI chat features in the Visafy platform.
