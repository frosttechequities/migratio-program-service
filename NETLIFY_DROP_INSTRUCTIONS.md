# Deploying Visafy to Netlify using the Build Folder Drop Method

This guide will walk you through deploying the Visafy platform to Netlify using the direct build folder drop method.

## Prerequisites

- The Visafy frontend has been built successfully with the authentication fixes
- You have a Netlify account (free tier is sufficient)

## Step 1: Access Netlify Drop

1. Go to [Netlify Drop](https://app.netlify.com/drop) in your browser
2. If you're not already logged in, you'll be prompted to sign in or create an account

## Step 2: Drag and Drop the Build Folder Contents

1. Open your file explorer and navigate to `C:\Users\USER\Documents\Migratio\src\frontend\build`
2. Select all files and folders inside the build folder (not the build folder itself)
3. Drag and drop these files onto the Netlify Drop area in your browser
4. Wait for the upload to complete (this may take a few minutes depending on your internet connection)

## Step 3: Configure Your Site

Once the upload is complete, Netlify will automatically deploy your site. You'll be redirected to the site overview page.

1. Click on "Site settings" to customize your site
2. Under "Site information", click "Change site name" to give your site a custom subdomain (e.g., visafy-platform.netlify.app)
3. Navigate to "Domain management" to add a custom domain if desired

## Step 4: Configure Environment Variables (Optional)

If you need to add or modify environment variables:

1. Go to "Site settings" > "Environment variables"
2. Click "Add a variable" and enter the key-value pairs as needed
3. After adding variables, go to "Deploys" and trigger a new deploy by clicking "Clear cache and deploy site"

## Step 5: Test Your Deployed Site

1. Click on the URL provided by Netlify (e.g., random-name-123456.netlify.app or your custom domain)
2. Test the following features:
   - Try logging in with test credentials to verify that the authentication issues are fixed
   - Navigate to `/test/vector-search` to test the vector search functionality
   - Chat functionality using the chatbot widget
   - Navigation between different pages
   - Responsive design on different device sizes

## Troubleshooting

### Issue: Authentication Errors Still Occurring

**Solution**: Clear your browser cache and local storage before testing:
1. Open browser developer tools (F12)
2. Go to Application > Storage > Clear Site Data
3. Refresh the page and try again

### Issue: API Calls Failing

**Solution**: Check the _redirects file in your build folder. It should contain:
```
# Proxy API requests to backend services
/api/countries/*  https://migratio-program-service.onrender.com/api/countries/:splat  200
/api/programs/*  https://migratio-program-service.onrender.com/api/programs/:splat  200
/api/quiz/*  https://migratio-quiz-api.onrender.com/quiz/:splat  200
/auth/*  https://migratio-user-auth.onrender.com/auth/:splat  200

# Vector search service endpoints
/search  https://visafy-vector-search-service.onrender.com/search  200
/chat  https://visafy-vector-search-service.onrender.com/chat  200
/health  https://visafy-vector-search-service.onrender.com/health  200

# Handle React Router (this must be the last rule)
/*    /index.html   200
```

### Issue: Page Not Found on Refresh or Direct URL Access

**Solution**: Verify that the last rule in your _redirects file is:
```
/*    /index.html   200
```

### Issue: Styling or Assets Missing

**Solution**: Make sure all assets are properly referenced with relative paths or absolute URLs.

## Next Steps

After successful deployment, consider:

1. Setting up continuous deployment by connecting your GitHub repository to Netlify
2. Adding custom domains and SSL certificates
3. Configuring form handling for any contact or feedback forms
4. Setting up serverless functions for additional backend functionality

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)
- [Custom Domains on Netlify](https://docs.netlify.com/domains-https/custom-domains/)
