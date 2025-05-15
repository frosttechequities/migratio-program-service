# Troubleshooting Guide

This document provides solutions to common issues and debugging tips for the Visafy platform.

## Vector Search Service Issues

### Service Won't Start

**Symptoms:**
- Error message: `Error: listen EADDRINUSE: address already in use :::3006`
- Service fails to start

**Solutions:**
1. **Port is already in use**
   - Change the port:
     ```powershell
     $env:PORT=3007
     node src\services\vector-search-service\server.js
     ```
   - Or kill the process using the port:
     ```powershell
     # Find the process
     netstat -ano | findstr :3006
     
     # Kill the process (replace PID with the actual process ID)
     taskkill /F /PID PID
     ```

2. **Node.js process crashed but port is still reserved**
   - Restart your computer
   - Or wait a few minutes for the OS to release the port

### Supabase Connection Issues

**Symptoms:**
- Error message: `Error connecting to Supabase`
- No search results returned

**Solutions:**
1. **Invalid API Key**
   - Verify that you're using the correct API key
   - Check that the API key has the necessary permissions
   - Generate a new API key if necessary

2. **Network Issues**
   - Check your internet connection
   - Verify that Supabase is not down
   - Check if your IP is blocked by Supabase

3. **CORS Issues**
   - Check that CORS is configured correctly
   - Verify that the request includes the necessary headers

### Embedding Generation Issues

**Symptoms:**
- Error message: `Error generating embedding`
- Search functionality doesn't work

**Solutions:**
1. **Transformers.js Library Issues**
   - Reinstall the library:
     ```bash
     npm uninstall @xenova/transformers
     npm install @xenova/transformers
     ```
   - Check for compatibility issues with your Node.js version

2. **Model Not Found**
   - Verify that the model is available
   - Try using a different model
   - Check system resources (CPU, RAM)

3. **Out of Memory**
   - Increase the available memory
   - Use a smaller model
   - Process smaller batches of data

## Ollama Integration Issues

### Ollama Not Responding

**Symptoms:**
- Error message: `Error using Ollama API: timeout of 60000ms exceeded`
- No response from Ollama

**Solutions:**
1. **Ollama Not Running**
   - Check if Ollama is running:
     ```powershell
     ollama list
     ```
   - Start Ollama if it's not running

2. **Ollama Needs Update**
   - Update Ollama to the latest version
   - Download from [ollama.ai](https://ollama.ai/download)
   - Restart your computer after updating

3. **Model Not Found**
   - Pull the model:
     ```powershell
     ollama pull mistral
     ```
   - Check available models:
     ```powershell
     ollama list
     ```

4. **System Resources**
   - Check CPU and RAM usage
   - Close other memory-intensive applications
   - Try using a smaller model

### API Timeouts

**Symptoms:**
- Error message: `Error using Ollama API: timeout of 60000ms exceeded`
- Request takes too long to complete

**Solutions:**
1. **Increase Timeout**
   - Modify the timeout value in your API calls:
     ```javascript
     const result = await axios.post(
       `${OLLAMA_URL}/api/chat`,
       {
         // ...
       },
       {
         timeout: 120000 // 2 minutes
       }
     );
     ```

2. **Use a Smaller Model**
   - Switch to a smaller, faster model:
     ```javascript
     const OLLAMA_MODEL = 'deepseek-r1:1.5b'; // Smaller model
     ```

3. **Optimize Prompt**
   - Use shorter, more concise prompts
   - Break complex queries into smaller parts

### CLI vs. API Discrepancy

**Symptoms:**
- CLI works but API doesn't
- Different responses from CLI and API

**Solutions:**
1. **Use CLI Wrapper**
   - Create a wrapper that uses the CLI instead of the API:
     ```javascript
     const { spawn } = require('child_process');
     
     function runOllamaCLI(model, prompt) {
       return new Promise((resolve, reject) => {
         const ollamaProcess = spawn('ollama', ['run', model, prompt], {
           shell: true
         });
         
         let fullOutput = '';
         
         ollamaProcess.stdout.on('data', (data) => {
           fullOutput += data.toString();
         });
         
         ollamaProcess.on('close', (code) => {
           if (code !== 0) {
             reject(new Error(`Ollama process exited with code ${code}`));
           } else {
             resolve(fullOutput);
           }
         });
       });
     }
     ```

2. **Check API Endpoint**
   - Verify that you're using the correct API endpoint
   - Check for any differences in request format

3. **Check for Version Mismatch**
   - Ensure that the CLI and API are using the same version of Ollama
   - Update Ollama to the latest version

## Deployment Issues

### Render Deployment Fails

**Symptoms:**
- Build or deployment fails on Render
- Error in the Render logs

**Solutions:**
1. **Build Command Issues**
   - Check that the build command is correct
   - Verify that all dependencies are installed
   - Check for any environment-specific code

2. **Environment Variables**
   - Verify that all required environment variables are set
   - Check for typos in environment variable names
   - Ensure that sensitive values are properly escaped

3. **Node.js Version**
   - Check the Node.js version used by Render
   - Update the `engines` field in package.json:
     ```json
     "engines": {
       "node": ">=16.0.0"
     }
     ```

### Service Crashes on Render

**Symptoms:**
- Service starts but crashes shortly after
- Error in the Render logs

**Solutions:**
1. **Memory Issues**
   - Check memory usage in the Render metrics
   - Optimize memory usage in your code
   - Upgrade to a higher tier with more memory

2. **Timeout Issues**
   - Check for long-running operations
   - Implement proper error handling and timeouts
   - Use asynchronous operations where appropriate

3. **Dependency Issues**
   - Check for missing or incompatible dependencies
   - Update dependencies to the latest versions
   - Use exact versions in package.json

## Testing Issues

### PowerShell Testing Fails

**Symptoms:**
- Error when using Invoke-WebRequest
- Unable to connect to the service

**Solutions:**
1. **Service Not Running**
   - Check that the service is running
   - Verify that the port is correct
   - Check for any error messages in the service logs

2. **CORS Issues**
   - Add the necessary CORS headers to the service
   - Use a tool like Postman that doesn't enforce CORS

3. **PowerShell Syntax**
   - Check the PowerShell syntax for Invoke-WebRequest
   - Ensure that the JSON is properly formatted
   - Try using curl instead:
     ```powershell
     curl -X POST http://localhost:3006/search -H "Content-Type: application/json" -d '{"query":"What are the requirements for a work visa?"}'
     ```

### Mock Implementation Always Used

**Symptoms:**
- Service always falls back to mock implementation
- No real LLM responses

**Solutions:**
1. **Ollama Not Available**
   - Check if Ollama is running
   - Verify that the service can connect to Ollama
   - Check the availability check function

2. **Error Handling**
   - Check the error handling in the service
   - Verify that errors are properly caught and logged
   - Implement better fallback mechanisms

3. **Environment Configuration**
   - Check that the environment is properly configured
   - Verify that the service is using the correct URL for Ollama
   - Check for any environment-specific code

## General Debugging Tips

### Logging

Enable verbose logging to get more information about what's happening:

```javascript
// In server.js
app.use(morgan('dev'));

// Add more detailed logging
console.log('Detailed information:', {
  supabaseUrl,
  ollamaUrl,
  port,
  // Don't log sensitive information like API keys
});
```

### Testing in Isolation

Test different components in isolation to identify the source of the issue:

1. **Test Supabase Connection**
   ```javascript
   const { data, error } = await supabase.from('documents').select('*').limit(1);
   console.log('Supabase test:', { data, error });
   ```

2. **Test Ollama Connection**
   ```javascript
   try {
     const response = await axios.get(`${OLLAMA_URL}/api/tags`);
     console.log('Ollama test:', response.data);
   } catch (error) {
     console.error('Ollama test error:', error.message);
   }
   ```

3. **Test Embedding Pipeline**
   ```javascript
   try {
     const embedding = await generateEmbedding('Test query');
     console.log('Embedding test:', embedding.length);
   } catch (error) {
     console.error('Embedding test error:', error.message);
   }
   ```

### Using Browser Developer Tools

For frontend issues, use browser developer tools:

1. Open the browser developer tools (F12)
2. Go to the Network tab
3. Make a request and examine the response
4. Check for any errors in the Console tab

### Checking System Resources

Monitor system resources to identify performance issues:

1. **CPU Usage**
   - Use Task Manager (Windows) or Activity Monitor (Mac)
   - Check for processes using excessive CPU

2. **Memory Usage**
   - Monitor RAM usage
   - Check for memory leaks
   - Restart the service if memory usage is too high

3. **Disk Space**
   - Ensure that there's enough disk space
   - Check for large log files or temporary files
