# Visafy Platform - Integrations and APIs

## Supabase Integration

### Overview
Supabase is used as the primary backend service for the Visafy Platform, providing authentication, database, storage, and real-time functionality.

### Configuration
- **Project URL**: https://qyvvrvthalxeibsmckep.supabase.co
- **Project ID**: qyvvrvthalxeibsmckep
- **Region**: eu-central-1

### Authentication
Supabase Auth is used for user authentication with the following features:
- Email/password authentication
- Email verification
- Password reset
- JWT token management

**Key Files**:
- `src/frontend/src/utils/supabaseClient.js`: Main Supabase client configuration
- `src/frontend/src/utils/authUtils.js`: Authentication utilities
- `src/frontend/src/features/auth/authService.js`: Authentication service

**Example Usage**:
```javascript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Get current user
const { data: { user }, error } = await supabase.auth.getUser();

// Logout
const { error } = await supabase.auth.signOut();
```

### Database
Supabase PostgreSQL is used for data storage with the following tables:
- `profiles`: User profile information
- `user_progress`: User progress through the immigration process
- `user_tasks`: Tasks assigned to users
- `user_documents`: Documents uploaded by users
- `user_recommendations`: Immigration program recommendations
- `immigration_programs`: Available immigration programs
- `countries`: Country information
- `documents`: Document templates and requirements

**Example Usage**:
```javascript
// Get user profile
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// Update user profile
const { data, error } = await supabase
  .from('profiles')
  .update({ first_name: 'John', last_name: 'Doe' })
  .eq('id', user.id);
```

### Storage
Supabase Storage is used for file storage with the following buckets:
- `documents`: User-uploaded documents
- `templates`: Document templates
- `avatars`: User profile pictures

**Example Usage**:
```javascript
// Upload file
const { data, error } = await supabase.storage
  .from('documents')
  .upload(`${user.id}/${file.name}`, file);

// Get file URL
const { data } = supabase.storage
  .from('documents')
  .getPublicUrl(`${user.id}/${file.name}`);
```

### Real-time
Supabase Real-time is used for real-time updates with the following channels:
- `user_tasks`: Real-time updates for user tasks
- `user_documents`: Real-time updates for user documents

**Example Usage**:
```javascript
// Subscribe to changes
const subscription = supabase
  .channel('public:user_tasks')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'user_tasks',
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

## Backend API Services

### Program Service
The Program Service provides information about immigration programs and countries.

- **Base URL**: https://migratio-program-service.onrender.com
- **Repository**: https://github.com/frosttechequities/migratio-program-service

#### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/programs` | GET | Get all immigration programs |
| `/api/programs/:id` | GET | Get a specific immigration program |
| `/api/countries` | GET | Get all countries |
| `/api/countries/:id` | GET | Get a specific country |
| `/api/requirements` | GET | Get all document requirements |
| `/api/requirements/:id` | GET | Get a specific document requirement |

**Example Usage**:
```javascript
// Get all programs
const response = await axios.get('https://migratio-program-service.onrender.com/api/programs');
const programs = response.data;
```

### Quiz Service
The Quiz Service provides functionality for the assessment quiz.

- **Base URL**: https://migratio-quiz-api.onrender.com
- **Repository**: https://github.com/frosttechequities/migratio-quiz-service

#### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/quiz/questions` | GET | Get all quiz questions |
| `/quiz/submit` | POST | Submit quiz answers |
| `/quiz/results/:id` | GET | Get quiz results |

**Example Usage**:
```javascript
// Submit quiz answers
const response = await axios.post('https://migratio-quiz-api.onrender.com/quiz/submit', {
  userId: user.id,
  answers: [
    { questionId: 1, answer: 'yes' },
    { questionId: 2, answer: 'no' }
  ]
});
const results = response.data;
```

### User Auth Service
The User Auth Service provides user authentication and profile management.

- **Base URL**: https://migratio-user-auth.onrender.com
- **Repository**: https://github.com/frosttechequities/migratio-user-auth-service

#### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register a new user |
| `/auth/login` | POST | Login a user |
| `/auth/logout` | POST | Logout a user |
| `/auth/verify-email/:token` | GET | Verify email address |
| `/auth/forgot-password` | POST | Request password reset |
| `/auth/reset-password/:token` | POST | Reset password |
| `/profiles/:id` | GET | Get user profile |
| `/profiles/:id` | PUT | Update user profile |
| `/dashboard/:id` | GET | Get dashboard data |

**Example Usage**:
```javascript
// Register a new user
const response = await axios.post('https://migratio-user-auth.onrender.com/auth/register', {
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});
const user = response.data;
```

## Third-Party Integrations

### Netlify
Netlify is used for frontend deployment.

- **Site URL**: https://visafy-platform.netlify.app
- **Repository**: Connected to GitHub repository
- **Build Command**: `npm run build`
- **Publish Directory**: `build`

**Configuration File**: `netlify.toml`
```toml
[build]
  command = "CI= npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  REACT_APP_API_URL = "https://remarkable-fairy-b57541.netlify.app"
  REACT_APP_PROGRAM_SERVICE_URL = "https://migratio-program-service.onrender.com/api"
  REACT_APP_QUIZ_API_URL = "https://migratio-quiz-api.onrender.com/quiz"
  REACT_APP_USER_AUTH_URL = "https://migratio-user-auth.onrender.com/auth"
  REACT_APP_SUPABASE_URL = "https://qyvvrvthalxeibsmckep.supabase.co"
  REACT_APP_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDkxODgsImV4cCI6MjA2MjY4NTE4OH0.l1B9Ew14YyQri9EGsOZd7MJ4XVA7YbgmuNX-w_b0NKc"
```

### Render
Render is used for backend service deployment.

- **Program Service URL**: https://migratio-program-service.onrender.com
- **Quiz Service URL**: https://migratio-quiz-api.onrender.com
- **User Auth Service URL**: https://migratio-user-auth.onrender.com

### Material UI
Material UI is used for the user interface.

- **Version**: 5.x
- **Theme**: Custom theme defined in `src/frontend/src/theme.js`
- **Components**: Various Material UI components used throughout the application

**Example Usage**:
```jsx
import { Button, TextField, Typography } from '@mui/material';

function MyComponent() {
  return (
    <div>
      <Typography variant="h4">Hello World</Typography>
      <TextField label="Email" variant="outlined" />
      <Button variant="contained" color="primary">Submit</Button>
    </div>
  );
}
```

### i18next
i18next is used for internationalization.

- **Configuration**: `src/frontend/src/i18n.js`
- **Languages**: English, French, Spanish
- **Namespaces**: common, auth, dashboard, assessment

**Example Usage**:
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

## Environment Variables

### Development (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENABLE_DOCUMENT_UPLOAD=true
REACT_APP_ENABLE_PDF_GENERATION=true
REACT_APP_ENV=development
REACT_APP_SUPABASE_URL=https://qyvvrvthalxeibsmckep.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDkxODgsImV4cCI6MjA2MjY4NTE4OH0.l1B9Ew14YyQri9EGsOZd7MJ4XVA7YbgmuNX-w_b0NKc
```

### Production (.env.production)
```
REACT_APP_API_URL=https://migratio-program-service.onrender.com/api
REACT_APP_ENABLE_DOCUMENT_UPLOAD=true
REACT_APP_ENABLE_PDF_GENERATION=true
REACT_APP_ENV=production
REACT_APP_SUPABASE_URL=https://qyvvrvthalxeibsmckep.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dnZydnRoYWx4ZWlic21ja2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDkxODgsImV4cCI6MjA2MjY4NTE4OH0.l1B9Ew14YyQri9EGsOZd7MJ4XVA7YbgmuNX-w_b0NKc
```
