// Mock dashboard data for testing
export const mockDashboardData = {
  overview: {
    profileCompletion: 75,
    assessmentCompletion: 100,
    currentStageIndex: 2,
    daysActive: 30,
    documentsUploaded: 5,
    tasksCompleted: 8,
    totalTasks: 12,
    nextDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  nextSteps: [
    { 
      id: 'task-1', 
      title: 'Complete language test', 
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      category: 'documentation'
    },
    { 
      id: 'task-2', 
      title: 'Take eligibility assessment', 
      priority: 'medium',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      category: 'assessment'
    },
    { 
      id: 'task-3', 
      title: 'Update resume', 
      priority: 'low',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      category: 'documentation'
    }
  ],
  journeyProgress: {
    currentStage: 'Preparation',
    stages: [
      { name: 'Research', status: 'completed', progress: 100 },
      { name: 'Preparation', status: 'in_progress', progress: 65 },
      { name: 'Application', status: 'pending', progress: 0 },
      { name: 'Processing', status: 'pending', progress: 0 },
      { name: 'Arrival', status: 'pending', progress: 0 }
    ],
    milestones: [
      { name: 'Research Complete', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed' },
      { name: 'Documents Ready', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), status: 'in_progress' },
      { name: 'Application Submitted', date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
      { name: 'Decision Received', date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' },
      { name: 'Arrival', date: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(), status: 'pending' }
    ]
  },
  successProbability: {
    overall: 75,
    factors: {
      positive: [
        { name: 'Education', weight: 15, description: 'Master\'s degree in a high-demand field' },
        { name: 'Language Proficiency', weight: 20, description: 'High English proficiency scores' },
        { name: 'Age', weight: 10, description: 'Within optimal age range for immigration' }
      ],
      negative: [
        { name: 'Work Experience', weight: -5, description: 'Limited work experience in target country' },
        { name: 'Financial Resources', weight: -10, description: 'Below recommended savings amount' }
      ]
    }
  },
  documentCenter: {
    recent: [
      { id: 'doc-1', name: 'Passport', type: 'identification', status: 'verified', uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'doc-2', name: 'Resume', type: 'employment', status: 'pending', uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'doc-3', name: 'Degree Certificate', type: 'education', status: 'pending', uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    stats: {
      total: 5,
      verified: 1,
      pending: 3,
      rejected: 1
    },
    required: [
      { name: 'Passport', status: 'completed' },
      { name: 'Language Test Results', status: 'pending' },
      { name: 'Education Credentials', status: 'pending' },
      { name: 'Work References', status: 'pending' },
      { name: 'Police Clearance', status: 'not_started' }
    ]
  }
};
