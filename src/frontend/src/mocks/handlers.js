import { rest } from 'msw';

// Sample dashboard data for testing
const dashboardData = {
  overview: {
    profileCompletion: 75,
    assessmentCompletion: 100,
    currentStageIndex: 2,
    daysActive: 30,
    documentsUploaded: 5,
    tasksCompleted: 8
  },
  nextSteps: [
    { id: 1, title: 'Complete profile', priority: 'high' },
    { id: 2, title: 'Take eligibility assessment', priority: 'medium' }
  ],
  recommendations: [
    { id: 1, title: 'Express Entry', country: 'Canada', score: 85 },
    { id: 2, title: 'Skilled Worker Program', country: 'Australia', score: 78 }
  ],
  tasks: [
    { id: 1, title: 'Submit application', dueDate: '2023-12-31', status: 'pending' },
    { id: 2, title: 'Upload passport', dueDate: '2023-12-15', status: 'completed' }
  ],
  documents: {
    recent: [
      { id: 1, name: 'Passport.pdf', uploadDate: '2023-11-01' },
      { id: 2, name: 'Resume.pdf', uploadDate: '2023-11-05' }
    ],
    stats: {
      total: 10,
      verified: 5,
      pending: 3,
      rejected: 2
    }
  }
};

// Sample profile data for testing
const profileData = {
  id: 'profile1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  completedSteps: ['personal', 'education'],
  currentCountry: 'United States',
  targetCountries: ['Canada', 'Australia'],
  skills: ['Software Development', 'Project Management'],
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'French', proficiency: 'Intermediate' }
  ],
  education: [
    {
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      institution: 'Test University',
      year: 2018
    }
  ],
  workExperience: [
    {
      title: 'Software Engineer',
      company: 'Test Company',
      startDate: '2018-01-01',
      endDate: '2022-12-31',
      description: 'Developed web applications'
    }
  ]
};

// Sample resources data for testing
const resourcesData = [
  {
    id: 1,
    title: 'Guide to Express Entry',
    category: 'Immigration',
    url: '/resources/express-entry-guide',
    thumbnail: 'express-entry.jpg'
  },
  {
    id: 2,
    title: 'Language Testing Information',
    category: 'Language',
    url: '/resources/language-testing',
    thumbnail: 'language-testing.jpg'
  }
];

// Sample recommendations data for testing
const recommendationsData = [
  {
    id: 1,
    program: 'Express Entry',
    country: 'Canada',
    score: 85,
    requirements: [
      { name: 'Language', met: true, score: 20 },
      { name: 'Education', met: true, score: 25 },
      { name: 'Work Experience', met: true, score: 15 },
      { name: 'Age', met: true, score: 12 },
      { name: 'Adaptability', met: true, score: 10 }
    ]
  },
  {
    id: 2,
    program: 'Skilled Worker Program',
    country: 'Australia',
    score: 78,
    requirements: [
      { name: 'Language', met: true, score: 20 },
      { name: 'Education', met: true, score: 20 },
      { name: 'Work Experience', met: true, score: 15 },
      { name: 'Age', met: true, score: 10 },
      { name: 'Adaptability', met: false, score: 5 }
    ]
  }
];

// Define handlers for API endpoints
export const handlers = [
  // Dashboard data
  rest.get('/api/dashboard', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dashboardData));
  }),

  // Dashboard data with error
  rest.get('/api/dashboard/error', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: 'Failed to load dashboard data' }));
  }),

  // Dashboard data with delay
  rest.get('/api/dashboard/slow', (req, res, ctx) => {
    return res(ctx.delay(2000), ctx.status(200), ctx.json(dashboardData));
  }),

  // Profile data
  rest.get('/api/profile', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(profileData));
  }),

  // Resources data
  rest.get('/api/resources', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(resourcesData));
  }),

  // Recommendations data
  rest.get('/api/recommendations', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(recommendationsData));
  }),

  // Program recommendations data from external service
  rest.get('https://migratio-program-service.onrender.com/api/recommendations', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({
      status: 'success',
      results: recommendationsData.length,
      data: {
        recommendationSet: recommendationsData
      }
    }));
  }),

  // Update dashboard preferences
  rest.put('/api/dashboard/preferences', (req, res, ctx) => {
    const updatedPreferences = req.body;
    return res(ctx.status(200), ctx.json(updatedPreferences));
  }),

  // Save dashboard layout
  rest.post('/api/dashboard/layout', (req, res, ctx) => {
    const layout = req.body;
    return res(ctx.status(200), ctx.json({ id: 'layout1', ...layout }));
  }),

  // Get dashboard layouts
  rest.get('/api/dashboard/layouts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      { id: 'layout1', name: 'Default Layout', createdAt: '2023-01-01' },
      { id: 'layout2', name: 'Compact Layout', createdAt: '2023-02-01' }
    ]));
  })
];
