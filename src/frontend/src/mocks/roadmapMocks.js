// Mock roadmap data for testing
export const mockRoadmapData = [
  {
    _id: 'roadmap-1',
    title: 'Express Entry Application',
    description: 'Step-by-step guide for Express Entry application process',
    targetCountry: 'Canada',
    program: 'Express Entry - Federal Skilled Worker',
    status: 'active',
    completionPercentage: 35,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    targetCompletionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    phases: [
      {
        _id: 'phase-1',
        phaseName: 'Preparation',
        phaseOrder: 1,
        status: 'in_progress',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            _id: 'task-1',
            title: 'Take language test',
            description: 'Schedule and complete IELTS or CELPIP test',
            status: 'completed',
            dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
          },
          {
            _id: 'task-2',
            title: 'Get education credentials assessed',
            description: 'Submit documents to WES or other designated organization',
            status: 'in_progress',
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
          }
        ]
      },
      {
        _id: 'phase-2',
        phaseName: 'Profile Creation',
        phaseOrder: 2,
        status: 'pending',
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            _id: 'task-3',
            title: 'Create Express Entry profile',
            description: 'Submit profile in IRCC portal',
            status: 'pending',
            dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
          }
        ]
      },
      {
        _id: 'phase-3',
        phaseName: 'Invitation and Application',
        phaseOrder: 3,
        status: 'pending',
        startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            _id: 'task-4',
            title: 'Receive ITA',
            description: 'Wait for Invitation to Apply',
            status: 'pending',
            dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
          },
          {
            _id: 'task-5',
            title: 'Submit PR application',
            description: 'Complete and submit permanent residence application',
            status: 'pending',
            dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
          }
        ]
      }
    ],
    milestones: [
      {
        _id: 'milestone-1',
        title: 'Language Test Completed',
        description: 'IELTS test completed with required scores',
        status: 'completed',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'milestone-2',
        title: 'ECA Received',
        description: 'Education Credential Assessment received',
        status: 'pending',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'milestone-3',
        title: 'Profile Submitted',
        description: 'Express Entry profile submitted',
        status: 'pending',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'milestone-4',
        title: 'ITA Received',
        description: 'Invitation to Apply received',
        status: 'pending',
        date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'milestone-5',
        title: 'PR Application Submitted',
        description: 'Permanent Residence application submitted',
        status: 'pending',
        date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];
