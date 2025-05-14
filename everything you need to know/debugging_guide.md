# Visafy Platform - Debugging Guide

## Resolved Issues

### 1. Blank Pages Issue - RESOLVED

**Previous Symptoms:**
- Most pages in the application displayed as blank
- No visible errors in the UI
- Application appeared to load but no content was rendered

**Root Causes Identified and Fixed:**
1. **Layout Structure Issues**
   - Nested layout components were causing rendering problems
   - Fixed by restructuring the layout hierarchy

2. **Authentication Flow Issues**
   - Token expiration was not properly handled
   - JWT validation was failing
   - Fixed by implementing proper token refresh and validation

3. **Component Rendering Issues**
   - Components were not properly handling loading and error states
   - Fixed by adding better error handling and loading indicators

### 2. Duplicate Headers and Footers - RESOLVED

**Previous Symptoms:**
- Multiple headers and footers appeared on some pages
- UI elements were duplicated

**Root Causes Identified and Fixed:**
1. **Nested Layouts**
   - Layout components were nested inside each other
   - Fixed by updating the MainLayout component to not use the Layout component

2. **Route Configuration**
   - Routes were nested incorrectly
   - Fixed by restructuring the routes in App.js to have a single Layout wrapper

## Debugging Steps

### Step 1: Check Browser Console for Errors

Open the browser's developer tools (F12) and check the console for any errors. Look for:
- JavaScript errors
- Network request failures
- React rendering errors

### Step 2: Examine Redux Store

1. **Install Redux DevTools Extension** in your browser
2. Open the application and check the Redux store state
3. Verify that the store is properly initialized
4. Check that actions are being dispatched correctly
5. Verify that reducers are updating the state correctly

**Key Files to Check:**
- `src/frontend/src/store.js`: Main Redux store configuration
- `src/frontend/src/index.js`: Store provider setup
- `src/frontend/src/features/*/[feature]Slice.js`: Redux slices

### Step 3: Debug React Router

1. Add console logs to route components to verify they're being rendered
2. Check the URL in the browser to ensure it matches the expected route
3. Verify that the correct components are being rendered for each route

**Key Files to Check:**
- `src/frontend/src/App.js`: Main routing configuration
- `src/frontend/src/components/auth/ProtectedRoute.js`: Protected route component
- `src/frontend/src/components/layout/Layout.js` and `MainLayout.js`: Layout components

### Step 4: Investigate Authentication Flow

1. Check localStorage for authentication tokens
2. Verify that tokens are being stored and retrieved correctly
3. Check Supabase session management
4. Test the login and logout functionality

**Key Files to Check:**
- `src/frontend/src/utils/authUtils.js`: Authentication utilities
- `src/frontend/src/utils/supabaseClient.js`: Supabase client configuration
- `src/frontend/src/features/auth/authService.js`: Authentication service
- `src/frontend/src/features/auth/authSlice.js`: Authentication Redux slice

### Step 5: Debug Component Rendering

1. Add console logs to component lifecycle methods
2. Check that components are receiving the expected props
3. Verify that state is being updated correctly
4. Check for any errors in component rendering

**Key Files to Check:**
- `src/frontend/src/pages/*/*.js`: Page components
- `src/frontend/src/components/*/*.js`: Reusable components
- `src/frontend/src/features/*/components/*.js`: Feature-specific components

## Specific Debugging Techniques

### 1. Create a Simplified Version

Create a simplified version of the application to isolate the problem:

```jsx
// SimpleApp.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

function SimpleHomePage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#0066FF' }}>Visafy</h1>
        <p>Simple React App is working correctly.</p>
      </div>
    </div>
  );
}

function SimpleApp() {
  return (
    <Routes>
      <Route path="/" element={<SimpleHomePage />} />
      <Route path="*" element={<SimpleHomePage />} />
    </Routes>
  );
}

export default SimpleApp;
```

Then update `index.js` to use this simplified app:

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import SimpleApp from './SimpleApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SimpleApp />
    </BrowserRouter>
  </React.StrictMode>
);
```

### 2. Add Redux to the Simplified Version

Once the simplified version works, add Redux:

```jsx
// simpleStore.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    }
  }
});

export const { setTheme, setLoading, setError, setMessage, clearMessage } = uiSlice.actions;

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer
  }
});

export { store };
```

Update `index.js` to use Redux:

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import SimpleApp from './SimpleApp';
import { store } from './simpleStore';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SimpleApp />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

### 3. Add Supabase to the Simplified Version

Next, add Supabase:

```jsx
// simpleSupabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qyvvrvthalxeibsmckep.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDkxODgsImV4cCI6MjA2MjY4NTE4OH0.l1B9Ew14YyQri9EGsOZd7MJ4XVA7YbgmuNX-w_b0NKc';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('[simpleSupabaseClient] Error getting session:', error.message);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('[simpleSupabaseClient] Exception getting session:', error);
    return null;
  }
};

export default supabase;
```

### 4. Gradually Add Back Features

Once the simplified version with Redux and Supabase works, gradually add back features:

1. Add the full Redux store
2. Add the full routing configuration
3. Add the authentication flow
4. Add the layout components
5. Add the page components

## How We Fixed the Duplicate Headers and Footers

### 1. Updated Layout Components

We identified that the layout components were nested, causing duplicate headers and footers:

- The `MainLayout` component was using the `Layout` component
- Page components were wrapped in `MainLayout` while routes were already wrapped in `Layout`

**Solution:**
```jsx
// Updated MainLayout.js
import React from 'react';
import { Box } from '@mui/material';

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* We don't render Header and Footer here since they're already in the main Layout */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          py: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
```

### 2. Updated Route Configuration

We restructured the routes to have a single Layout wrapper:

```jsx
// Updated App.js
<Routes>
  <Route path="/" element={<Layout />}>
    {/* Public routes */}
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    {/* More public routes */}

    {/* Protected routes */}
    <Route path="dashboard" element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } />
    {/* More protected routes */}
  </Route>
</Routes>
```

### 3. Removed Layout Wrappers from Page Components

We updated all page components to render their content directly without wrapping it in MainLayout:

```jsx
// Before
return (
  <MainLayout title="Dashboard">
    <Container>
      {/* Content */}
    </Container>
  </MainLayout>
);

// After
return (
  <Container>
    {/* Content */}
  </Container>
);
```

### 4. Added Document Title Management

We added document title management in the App.js file to set appropriate titles based on the current route:

```jsx
// App.js
useEffect(() => {
  const pageTitles = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/assessment': 'Immigration Assessment',
    // More routes...
  };

  const pathKey = Object.keys(pageTitles).find(path =>
    location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(path))
  );

  document.title = pathKey
    ? `${pageTitles[pathKey]} | Visafy`
    : 'Visafy - Your Immigration Assistant';
}, [location]);
```

## How We Fixed the Authentication Issues

### 1. Enhanced Token Management

We identified issues with token expiration and validation:

- Tokens were not being checked for expiration
- Expired tokens were still being used for API calls
- No token refresh mechanism was in place

**Solution:**
```jsx
// Updated authUtils.js
export const getTokenFromLocalStorage = () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Check if token is expired
      try {
        const tokenData = parseJwt(token);
        const currentTime = Math.floor(Date.now() / 1000);

        // If token is expired, remove it
        if (tokenData.exp && tokenData.exp < currentTime) {
          console.log('[authUtils] Token expired, removing from localStorage');
          localStorage.removeItem('token');
          return null;
        }

        return token;
      } catch (parseError) {
        console.error('[authUtils] Error parsing token', parseError);
        return null;
      }
    }

    return null;
  } catch (e) {
    console.error("[authUtils] Error getting token from localStorage", e);
    return null;
  }
};

// Added JWT parser
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('[authUtils] Error parsing JWT token', e);
    throw e;
  }
};
```

### 2. Implemented Token Refresh

We added token refresh functionality to handle expired tokens:

```jsx
// Added to supabaseClient.js
export const refreshToken = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('[supabaseClient] Error refreshing token:', error.message);
      return null;
    }

    if (data.session) {
      // Update token in localStorage
      localStorage.setItem('token', data.session.access_token);
      return data.session.access_token;
    }

    return null;
  } catch (error) {
    console.error('[supabaseClient] Error refreshing token:', error.message);
    return null;
  }
};
```

### 3. Created a Singleton Pattern for Supabase Client

We implemented a singleton pattern to prevent multiple Supabase client instances:

```jsx
// Updated supabaseClient.js
let supabaseInstance = null;

const getSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'sb-qyvvrvthalxeibsmckep-auth-token',
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });

  return supabaseInstance;
};

const supabase = getSupabaseClient();
```

### 4. Enhanced Error Handling

We improved error handling in authentication-related components:

```jsx
// Updated ProtectedRoute.js
const verifyAuthentication = async () => {
  try {
    // Check if we have a token
    const token = getTokenFromLocalStorage();

    if (!token && !isAuthenticated) {
      setIsVerifying(false);
      return;
    }

    // If we have a token but not authenticated in Redux, try to get the session
    if (token && !isAuthenticated) {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.log('[ProtectedRoute] Session error, trying to refresh token:', error.message);
          // If there's an error, try to refresh the token
          const newToken = await refreshToken();

          if (!newToken) {
            throw new Error('Failed to refresh authentication token');
          }

          // Try to get the session again with the new token
          // ... rest of the code
        }
      } catch (sessionError) {
        console.error('[ProtectedRoute] Session error:', sessionError);
        throw sessionError;
      }
    }
  } catch (err) {
    console.error('[ProtectedRoute] Error verifying authentication:', err);
    setError(err.message);
  } finally {
    setIsVerifying(false);
  }
};
```

## Current API Connection Issues

While the blank pages and duplicate headers/footers issues have been resolved, there are still some API connection issues that need to be addressed. These issues are now visible in the live application:

### 1. Recommendations API (401 Unauthorized)

**Symptoms:**
- Calls to `/api/recommendations/destinations` return 401 Unauthorized errors
- Console shows: "Suggest Destinations Service Error: User not authenticated"
- UI displays: "Potential Destinations - Could not load suggestions: User not authenticated"

**Confirmed Causes:**
- The authentication token is not being properly passed to the API
- The backend service is running but not recognizing the authentication token

**Solution:**
1. Update the recommendationService.js file to properly pass the authentication token:
```jsx
// src/frontend/src/features/recommendations/recommendationService.js
const suggestDestinations = async () => {
  try {
    console.log('[recommendationService] Fetching destination suggestions...');

    // Get the token from localStorage
    const token = getTokenFromLocalStorage();

    // Make the API call with the token in the Authorization header
    const response = await axios.get(`${API_URL}/recommendations/destinations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Suggest Destinations Service Error:', error.message);
    throw error;
  }
};
```

2. Ensure the backend API is configured to validate the token correctly

### 2. Resources API (404 Not Found)

**Symptoms:**
- Calls to `/api/resources?tags=dashboard,post-arrival` fail with 404 Not Found errors
- Console shows: "Get Resources Service Error: Request failed with status code 404"
- UI displays: "Recommended Resources - Could not load resources: Request failed with status code 404"

**Confirmed Causes:**
- The resources endpoint does not exist on the deployed backend service
- The API path is incorrect or the endpoint hasn't been implemented

**Solution:**
1. Check if the resources endpoint exists in the backend code:
```bash
# Check the routes in the backend service
grep -r "resources" services/
```

2. Implement the missing endpoint in the backend service:
```javascript
// Example implementation for the resources endpoint
router.get('/resources', authenticateToken, async (req, res) => {
  try {
    const { tags } = req.query;
    const tagArray = tags ? tags.split(',') : [];

    // Query the database for resources with matching tags
    const resources = await Resource.find({
      tags: { $in: tagArray }
    }).limit(10);

    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
});
```

3. Update the resourceService.js file to use the correct API path:
```jsx
// src/frontend/src/features/resources/resourceService.js
const getResources = async (tags) => {
  try {
    console.log('[resourceService] Fetching resources with tags:', tags);

    // Get the token from localStorage
    const token = getTokenFromLocalStorage();

    // Make the API call with the token in the Authorization header
    const response = await axios.get(`${API_URL}/api/resources`, {
      params: { tags },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get Resources Service Error:', error.message);
    throw error;
  }
};
```

### 3. Supabase Queries (406 Status Code)

**Symptoms:**
- Queries to the user_progress table return 406 status codes
- Console shows: "Failed to load resource: the server responded with a status of 406 ()"

**Confirmed Causes:**
- The Accept header is not being set correctly
- The Supabase API is expecting a specific content type

**Solution:**
1. Update the dashboardService.js file to set the correct headers:
```jsx
// src/frontend/src/features/dashboard/dashboardService.js
const { data: progressData, error: progressError } = await client
  .from('user_progress')
  .select('*')
  .eq('user_id', user.id)
  .single()
  .headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });
```

2. Alternatively, update the Supabase client configuration:
```jsx
// src/frontend/src/utils/supabaseClient.js
const supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-qyvvrvthalxeibsmckep-auth-token',
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  },
});
```

### 4. Roadmap Events API (Connection Refused)

**Symptoms:**
- Calls to `/api/roadmaps/events` fail with connection refused errors
- Console shows: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Confirmed Causes:**
- The API is trying to connect to localhost:3006 instead of the deployed backend URL

**Solution:**
1. Update the API URL in the roadmapService.js file:
```jsx
// src/frontend/src/features/roadmap/roadmapService.js
// Replace this:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3006/api';

// With this:
const API_URL = process.env.REACT_APP_API_URL || 'https://migratio-program-service.onrender.com/api';
```

2. Update the .env.production file to set the correct API URL:
```
REACT_APP_API_URL=https://migratio-program-service.onrender.com/api
REACT_APP_SUPABASE_URL=https://qyvvrvthalxeibsmckep.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Useful Debugging Commands

### Running the Development Server
```
cd src/frontend
npm start
```

### Building the Application
```
cd src/frontend
npm run build
```

### Deploying to Netlify
```
cd src/frontend
npx netlify-cli deploy --prod --dir=build
```

### Running Tests
```
cd src/frontend
npm test
```

### Checking for Errors
```
cd src/frontend
npm run lint
```
