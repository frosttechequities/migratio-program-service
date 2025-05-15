# Deployment Guide

This document provides detailed information about deploying the Visafy platform.

## Render Deployment

The Visafy platform is deployed on Render, a cloud platform that provides easy deployment for web applications.

### Vector Search Service

#### Deployment URL
https://visafy-vector-search-service.onrender.com

#### Deployment Configuration

- **Repository**: https://github.com/frosttechequities/migratio-program-service
- **Branch**: fix-supabase-integration
- **Build Command**: `cd src/services/vector-search-service && npm install`
- **Start Command**: `cd src/services/vector-search-service && npm start`
- **Plan**: Free

#### Environment Variables

| Variable | Value |
|----------|-------|
| PORT | 10000 |
| SUPABASE_URL | https://qyvvrvthalxeibsmckep.supabase.co |
| SUPABASE_KEY | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |
| OLLAMA_MODEL | deepseek-r1:1.5b |
| OLLAMA_FALLBACK_MODEL | mistral |

#### Deployment Steps

1. **Initial Setup**
   - Create a new Web Service on Render
   - Connect to the GitHub repository
   - Configure the build and start commands
   - Set environment variables
   - Deploy the service

2. **Manual Deployment**
   - Go to the Render dashboard
   - Navigate to the vector search service
   - Click on "Manual Deploy" and select "Deploy latest commit"

3. **Automatic Deployment**
   - Render automatically deploys when changes are pushed to the connected branch
   - You can disable automatic deployments in the service settings

### Other Services

#### Program Service
- **URL**: https://migratio-program-service.onrender.com
- **Repository**: https://github.com/frosttechequities/migratio-program-service
- **Branch**: main

#### Quiz Service
- **URL**: https://migratio-quiz-api.onrender.com
- **Repository**: https://github.com/frosttechequities/migratio-quiz-api
- **Branch**: main

#### User Auth Service
- **URL**: https://migratio-user-auth.onrender.com
- **Repository**: https://github.com/frosttechequities/migratio-user-auth
- **Branch**: main

## Frontend Deployment

The frontend is deployed on Netlify.

### Deployment URL
https://visafy-platform.netlify.app

### Deployment Configuration

- **Repository**: https://github.com/frosttechequities/migratio-program-service
- **Branch**: main
- **Build Command**: `cd src/frontend && npm install && npm run build`
- **Publish Directory**: `src/frontend/build`

### Environment Variables

| Variable | Value |
|----------|-------|
| REACT_APP_API_URL | https://migratio-program-service.onrender.com |
| REACT_APP_VECTOR_SEARCH_URL | https://visafy-vector-search-service.onrender.com |
| REACT_APP_SUPABASE_URL | https://qyvvrvthalxeibsmckep.supabase.co |
| REACT_APP_SUPABASE_ANON_KEY | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |

## Local Development

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Running the Vector Search Service Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/frosttechequities/migratio-program-service.git
   cd migratio-program-service
   ```

2. Install dependencies:
   ```bash
   cd src/services/vector-search-service
   npm install
   ```

3. Set environment variables:
   ```bash
   # Windows PowerShell
   $env:SUPABASE_URL="https://qyvvrvthalxeibsmckep.supabase.co"
   $env:SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   $env:PORT=3006
   ```

4. Start the service:
   ```bash
   npm start
   ```

5. The service will be available at http://localhost:3006

### Running the Frontend Locally

1. Clone the repository (if not already done):
   ```bash
   git clone https://github.com/frosttechequities/migratio-program-service.git
   cd migratio-program-service
   ```

2. Install dependencies:
   ```bash
   cd src/frontend
   npm install
   ```

3. Set environment variables:
   Create a `.env.local` file with:
   ```
   REACT_APP_API_URL=http://localhost:3006
   REACT_APP_VECTOR_SEARCH_URL=http://localhost:3006
   REACT_APP_SUPABASE_URL=https://qyvvrvthalxeibsmckep.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. The frontend will be available at http://localhost:3000

## Continuous Integration

### GitHub Actions

The repository uses GitHub Actions for continuous integration:

```yaml
name: CI

on:
  push:
    branches: [ main, fix-supabase-integration ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16.x'
      - name: Install dependencies
        run: cd src/services/vector-search-service && npm ci
      - name: Run tests
        run: cd src/services/vector-search-service && npm test
```

## Monitoring

### Render Logs

To view logs for the deployed service:
1. Go to the Render dashboard
2. Navigate to the vector search service
3. Click on "Logs" in the sidebar

### Metrics

To view metrics for the deployed service:
1. Go to the Render dashboard
2. Navigate to the vector search service
3. Click on "Metrics" in the sidebar

## Scaling

The vector search service is currently on the free tier of Render, which has the following limitations:
- 512 MB RAM
- Shared CPU
- Spins down with inactivity
- 750 hours per month

To scale the service:
1. Go to the Render dashboard
2. Navigate to the vector search service
3. Click on "Settings" in the sidebar
4. Under "Instance Type", select a higher tier

## Backup and Restore

### Database Backup

To backup the Supabase database:
1. Go to the Supabase dashboard
2. Navigate to Project Settings > Database
3. Click on "Backups"
4. Click "Create Backup"

### Code Backup

The code is backed up in the GitHub repository. To create a backup:
1. Clone the repository:
   ```bash
   git clone https://github.com/frosttechequities/migratio-program-service.git
   ```

2. Create a backup branch:
   ```bash
   git checkout -b backup-YYYY-MM-DD
   git push origin backup-YYYY-MM-DD
   ```

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check the build logs for errors
   - Verify that all dependencies are installed
   - Check that the build command is correct

2. **Runtime Errors**
   - Check the application logs for errors
   - Verify that all environment variables are set correctly
   - Check that the start command is correct

3. **Connection Issues**
   - Verify that the service is running
   - Check that the URL is correct
   - Verify that CORS is configured correctly

4. **Performance Issues**
   - Consider upgrading to a higher tier
   - Optimize database queries
   - Implement caching
