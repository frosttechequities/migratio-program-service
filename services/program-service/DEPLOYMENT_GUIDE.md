# Visafy API Services Deployment Guide

This guide provides step-by-step instructions for deploying the Visafy (formerly Migratio) API services to Render.

## Overview of Visafy API Services

Visafy currently has the following API services:

1. **Quiz Data API (`migratio-quiz-api`)**
   - **Purpose:** Serves quiz questions for the assessment
   - **Technology:** FastAPI, SQLite
   - **Deployed URL:** [https://migratio-quiz-api.onrender.com](https://migratio-quiz-api.onrender.com)
   - **Live API Docs:** [https://migratio-quiz-api.onrender.com/docs](https://migratio-quiz-api.onrender.com/docs)
   - **Key Endpoints:**
     - `GET /quiz/questions`: Retrieves all quiz questions
   - **Database:**
     - Type: SQLite
     - Data Source: `quiz_data_api/quiz_data.json` (loaded into `quiz_data.db` within the service)

2. **User Authentication API (`migratio-user-auth`)**
   - **Purpose:** Handles user signup, login, and token-based authentication
   - **Technology:** FastAPI, Supabase
   - **Deployed URL:** [https://migratio-user-auth.onrender.com](https://migratio-user-auth.onrender.com)
   - **Live API Docs:** [https://migratio-user-auth.onrender.com/docs](https://migratio-user-auth.onrender.com/docs)
   - **Environment Variables:**
     - `SUPABASE_URL`: https://xcjtfkaigogalnytjybk.supabase.co
     - `SUPABASE_KEY`: The Supabase anon key (public)
     - `JWT_SECRET`: Secret for JWT token generation

3. **Program Service (`migratio-program-service`)**
   - **Purpose:** Manages immigration program data and country information
   - **Technology:** Node.js, Express, MongoDB
   - **GitHub Repository:** [https://github.com/frosttechequities/migratio-program-service](https://github.com/frosttechequities/migratio-program-service)
   - **Deployed URL:** [https://migratio-program-service.onrender.com](https://migratio-program-service.onrender.com)
   - **Deployment Status:** Live (Free tier - spins down with inactivity)
   - **Environment Variables:**
     - `MONGODB_URI`: MongoDB connection string
     - `PROGRAM_SERVICE_PORT`: `10000` (Render uses port 10000 by default)
     - `NODE_ENV`: `production`
     - `CORS_ORIGIN`: `*` (to allow requests from any origin during development)

## Step 1: Set Up MongoDB Atlas (for Program Service)

1. **Create a MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a New Cluster**:
   - Click "Build a Database"
   - Choose the free tier option (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Set Up Database Access**:
   - In the left sidebar, click "Database Access"
   - Click "Add New Database User"
   - Create a username and password (save these for your connection string)
   - Set privileges to "Read and Write to Any Database"
   - Click "Add User"

4. **Set Up Network Access**:
   - In the left sidebar, click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for simplicity during development)
   - Click "Confirm"

5. **Get Your Connection String**:
   - Once your cluster is created, click "Connect"
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with `migratio_program_service`

## Step 2: Deploy Program Service to Render

1. **Prepare Your GitHub Repository**:
   - Create a new repository on GitHub: [https://github.com/frosttechequities/migratio-program-service](https://github.com/frosttechequities/migratio-program-service)
   - Push your code to GitHub using these commands:
     ```
     git remote add origin https://github.com/frosttechequities/migratio-program-service.git
     git branch -M main
     git push -u origin main
     ```

2. **Sign in to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Sign in to your account

3. **Create a New Web Service**:
   - Click "New +"
   - Select "Web Service"

4. **Connect Your GitHub Repository**:
   - Select "GitHub" as the deployment method
   - Find and select your repository: `frosttechequities/migratio-program-service`
   - If you don't see it, click "Configure account" to refresh your repository list

5. **Configure the Service**:
   - Name: `migratio-program-service`
   - Root Directory: `services/program-service` (this is crucial - make sure it's exactly this path)
   - Runtime: `Docker`
   - Branch: `main`
   - Instance Type: `Free`

6. **Set Environment Variables**:
   - Scroll down to the "Environment" section
   - Add the following environment variables:
     - Key: `MONGODB_URI`, Value: Your MongoDB Atlas connection string (e.g., `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/migratio_program_service?retryWrites=true&w=majority`)
     - Key: `PROGRAM_SERVICE_PORT`, Value: `10000` (Render uses port 10000 by default for web services)
     - Key: `NODE_ENV`, Value: `production`
     - Key: `CORS_ORIGIN`, Value: `*` (to allow requests from any origin during development)

7. **Deploy the Service**:
   - Click "Create Web Service"
   - Render will start building and deploying your service

## Step 3: Monitor the Deployment

1. **Watch the Build Logs**:
   - On the service page, you'll see the build logs
   - Look for any errors during the build process

2. **Check the Deployment Status**:
   - Once the build is complete, Render will deploy your service
   - The status will change to "Live" when the deployment is successful

3. **View the Logs**:
   - Click on the "Logs" tab to see the runtime logs
   - Look for messages about MongoDB connection and database seeding

## Step 4: Test the Deployed Service

1. **Test the Health Endpoint**:
   - Visit your service URL (e.g., `https://migratio-program-service.onrender.com/`)
   - You should see "Migratio Program Service is running."

2. **Test the Countries API**:
   - Visit `https://migratio-program-service.onrender.com/api/countries`
   - You should see a JSON response with the list of countries

3. **Test the Programs API**:
   - Visit `https://migratio-program-service.onrender.com/api/programs`
   - You should see a JSON response (might be an empty array if no programs are seeded yet)

## Step 5: Seed Program Data (Optional)

If you want to seed program data after deployment:

1. **Connect to Render Shell**:
   - In your service dashboard, click on the "Shell" tab
   - This opens a terminal connected to your deployed service

2. **Run the Seed Script**:
   ```
   node scripts/seed.js
   ```

3. **Verify Seeding**:
   - Check the logs for successful seeding messages
   - Visit the programs API endpoint to see the seeded data

## Step 6: Integrate with Frontend

1. **Update API Base URL**:
   - In your frontend code, update the API base URL to point to your deployed service
   - Use the programService.ts file provided in the src/frontend/src/services directory

2. **Test the Integration**:
   - Make sure the frontend can successfully fetch data from the deployed service
   - Check for any CORS issues (the service is configured to allow all origins by default)

## Existing Services Reference

### Program Service API

- **GitHub Repository:** [https://github.com/frosttechequities/migratio-program-service](https://github.com/frosttechequities/migratio-program-service)
- **Deployed URL:** [https://migratio-program-service.onrender.com](https://migratio-program-service.onrender.com) (after deployment)
- **Key Endpoints:**
  - `GET /api/countries`: Retrieves all countries
  - `GET /api/countries/:countryCode`: Retrieves a specific country by code
  - `GET /api/programs`: Retrieves all immigration programs
  - `GET /api/programs/:id`: Retrieves a specific program by ID
  - `GET /api/programs/country/:countryCode`: Retrieves all programs for a specific country
- **Environment Variables:**
  - `MONGODB_URI`: MongoDB connection string
  - `PROGRAM_SERVICE_PORT`: `10000` (Render uses port 10000 by default)
  - `NODE_ENV`: `production`
  - `CORS_ORIGIN`: `*` (to allow requests from any origin during development)
- **Deployment Platform:** Render (Free Tier)

### Quiz Data API

- **GitHub Repository:** [https://github.com/frosttechequities/migratio-quiz-service.git](https://github.com/frosttechequities/migratio-quiz-service.git)
- **Deployed URL:** [https://migratio-quiz-api.onrender.com](https://migratio-quiz-api.onrender.com)
- **Live API Docs:** [https://migratio-quiz-api.onrender.com/docs](https://migratio-quiz-api.onrender.com/docs)
- **Key Endpoints:**
  - `GET /quiz/questions`: Retrieves all quiz questions
- **Database:**
  - Type: SQLite
  - Data Source: `quiz_data_api/quiz_data.json` (loaded into `quiz_data.db` within the service)

### User Authentication API

- **GitHub Repository:** [https://github.com/frosttechequities/migratio-user-auth-service.git](https://github.com/frosttechequities/migratio-user-auth-service.git)
- **Deployed URL:** [https://migratio-user-auth.onrender.com](https://migratio-user-auth.onrender.com)
- **Live API Docs:** [https://migratio-user-auth.onrender.com/docs](https://migratio-user-auth.onrender.com/docs)
- **Key Endpoints:**
  - `POST /auth/signup`: Register a new user
  - `POST /auth/login`: Log in an existing user, returns access/refresh tokens
  - `GET /auth/me`: Get details for the currently authenticated user (requires Bearer token)
  - `POST /auth/logout`: Log out the current user (requires Bearer token)
- **Supabase Configuration:**
  - Project URL: `https://xcjtfkaigogalnytjybk.supabase.co`
  - Anon Key (public): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjanRma2FpZ29nYWxueXRqeWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjQzMTYsImV4cCI6MjA2MjYwMDMxNn0.B5dayJJVA4wFHoCh2TyCbv7p6MDsfIv1BkDki-6ckDA`
  - These are stored in `user_auth_api/.env` for local development and set as environment variables on Render.
- **Test User Credentials:**
  - Email: `frosttechequities@gmail.com`
  - Password: `newpassword123`
  - *(Note: For actual use, ensure strong, unique passwords. Manage test users directly in your Supabase dashboard.)*
- **Known Issue:** The logout endpoint currently returns a `500 Internal Server Error` due to an issue in the Supabase Python client library's handling of the logout response. Core auth (signup, login, /me) is unaffected.

## Troubleshooting

### Common Issues and Solutions

1. **Build Fails**:
   - Check that the Root Directory is set correctly (e.g., `services/program-service`)
   - Ensure your Dockerfile is valid and in the correct location
   - Check for any syntax errors in your code

2. **MongoDB Connection Fails**:
   - Verify your MongoDB Atlas connection string is correct
   - Check that you've allowed access from anywhere in the Network Access settings
   - Ensure your database user has the correct permissions

3. **Service Starts but API Returns 500 Errors**:
   - Check the logs for specific error messages
   - Verify that the database was seeded correctly
   - Check for any issues with the routes or controllers

4. **Service is Slow to Respond**:
   - This is normal for free tier Render services, which spin down after inactivity
   - The first request after inactivity may take up to 50 seconds to respond
   - Consider upgrading to a paid tier for production use

5. **CORS Issues**:
   - If your frontend can't access the API due to CORS errors, check the CORS configuration in your service
   - The Program Service is configured to allow all origins by default

### Getting Help

If you encounter issues not covered in this guide:

1. Check the Render documentation: [https://render.com/docs](https://render.com/docs)
2. Check the MongoDB Atlas documentation: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
3. Contact the Visafy development team for assistance
