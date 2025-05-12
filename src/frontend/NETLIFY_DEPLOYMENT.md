# Deploying Visafy to Netlify

This document provides instructions for deploying the Visafy platform to Netlify.

## Manual Deployment Steps

1. **Create a Netlify account**
   - Go to [Netlify](https://app.netlify.com/) and sign up for a free account

2. **Deploy the site**
   - Click "New site from Git" or "Import an existing project"
   - Choose "Deploy manually" option
   - Drag and drop the `build` folder after running `npm run build` locally
   
   OR
   
   - Connect to your Git repository (GitHub, GitLab, or Bitbucket)
   - Select the repository containing the Visafy project
   - Configure build settings:
     - Build command: `CI= npm run build`
     - Publish directory: `build`
     - Click "Deploy site"

3. **Configure environment variables**
   - Go to Site settings > Build & deploy > Environment
   - Add environment variables:
     - `REACT_APP_API_URL`: URL of your backend API

4. **Set up custom domain (optional)**
   - Go to Site settings > Domain management
   - Click "Add custom domain"
   - Follow the instructions to configure your domain's DNS settings

## Handling the Backend

For the backend, you have several options:

1. **Netlify Functions**: For simple backend needs
2. **Separate Backend Hosting**: Deploy your Node.js backend on:
   - Heroku (free tier available)
   - Render (free tier available)
   - Railway (limited free tier)
   - Fly.io (generous free tier)

## Updating Your Deployment

To update your site after making changes:

1. **Git-connected sites**: Simply push to your repository
2. **Manual deployments**: Run `npm run build` and upload the new build folder

## Troubleshooting

- **Build failures**: Check the build logs in the Netlify dashboard
- **Routing issues**: Ensure the `_redirects` file is in the `public` folder
- **API connection problems**: Verify your environment variables and CORS settings

## Netlify Features to Explore

- **Deploy Previews**: Preview changes before merging
- **Split Testing**: A/B test different versions
- **Forms**: Use Netlify's built-in form handling
- **Identity**: Add authentication to your site
- **Analytics**: Monitor site performance and usage
