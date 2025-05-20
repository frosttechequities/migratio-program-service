# Deploying the Fixed Visafy Platform to Netlify

This guide will walk you through deploying the fixed version of the Visafy platform to Netlify using the Netlify Drop method.

## Step 1: Prepare the Fixed Build

1. Make sure you have the following files in your `fixed-build` directory:
   - `index.html` - Contains fixes for JWT token parsing and API endpoint issues
   - `redirects.txt` - Contains updated redirects for the vector search service

2. Copy all other files from the original build directory:
   ```
   Copy-Item -Path src\frontend\build\* -Destination fixed-build -Recurse -Force -Exclude index.html,_redirects
   ```

3. Rename the redirects file:
   ```
   Rename-Item -Path fixed-build\redirects.txt -NewName _redirects
   ```

## Step 2: Deploy Using Netlify Drop

1. **Open Netlify Drop**:
   - Go to [Netlify Drop](https://app.netlify.com/drop) in your web browser
   - Sign in to your Netlify account if prompted

2. **Drag and Drop the Fixed Build Folder**:
   - Open your file explorer and navigate to the `fixed-build` directory
   - Select all files and folders in the directory
   - Drag these files and drop them onto the designated area on the Netlify Drop page

3. **Wait for Deployment**:
   - Netlify will upload your files and deploy your site
   - This typically takes less than a minute

## Step 3: Configure Your Site

After deployment, you can:
- Change the auto-generated site name to something more memorable (e.g., visafy-platform.netlify.app)
- Add a custom domain if desired
- Configure additional settings through the Netlify dashboard

## Step 4: Test Your Deployed Site

Once deployed, test the following:
- Navigate to `/test/vector-search` to test the vector search functionality
- Try the chat functionality to ensure it connects to the Hugging Face API
- Test navigation between different pages
- Verify that the site is responsive on different device sizes

## Troubleshooting

If you encounter any issues:

1. **Authentication Issues**:
   - The fixed `index.html` file includes a script that handles JWT token parsing errors gracefully
   - If you still see authentication errors, try clearing your browser cache and local storage

2. **API Endpoint Issues**:
   - The fixed `_redirects` file includes routes for the vector search service
   - If you still see 404 errors, check the Netlify logs to see if the redirects are working correctly

3. **Deployment Issues**:
   - If the deployment fails, check the Netlify logs for error messages
   - Make sure all required files are included in the build directory

## Next Steps

After successful deployment:
1. Consider setting up continuous deployment by connecting your GitHub repository to Netlify
2. Add custom domains and SSL certificates
3. Configure form handling for any contact or feedback forms
4. Set up serverless functions for additional backend functionality

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)
- [Custom Domains on Netlify](https://docs.netlify.com/domains-https/custom-domains/)
