// Mock tasks data for testing
export const mockTasks = [
  {
    _id: 'task-1',
    title: 'Complete language test',
    description: 'Schedule and complete IELTS or CELPIP test',
    status: 'completed',
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    category: 'documentation',
    roadmapId: 'roadmap-1',
    phaseId: 'phase-1',
    assignedTo: 'user-1',
    estimatedTime: 5, // in days
    notes: 'IELTS test completed with CLB 9 in all categories',
    relatedDocuments: ['doc-3'],
    subtasks: [
      {
        _id: 'subtask-1-1',
        title: 'Register for IELTS test',
        status: 'completed',
        completedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'subtask-1-2',
        title: 'Study for IELTS test',
        status: 'completed',
        completedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'subtask-1-3',
        title: 'Take IELTS test',
        status: 'completed',
        completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    _id: 'task-2',
    title: 'Get education credentials assessed',
    description: 'Submit documents to WES or other designated organization',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    category: 'documentation',
    roadmapId: 'roadmap-1',
    phaseId: 'phase-1',
    assignedTo: 'user-1',
    estimatedTime: 60, // in days
    notes: 'Documents submitted to WES, waiting for assessment',
    relatedDocuments: ['doc-4'],
    subtasks: [
      {
        _id: 'subtask-2-1',
        title: 'Research ECA providers',
        status: 'completed',
        completedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'subtask-2-2',
        title: 'Gather education documents',
        status: 'completed',
        completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'subtask-2-3',
        title: 'Submit documents to WES',
        status: 'completed',
        completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'subtask-2-4',
        title: 'Receive ECA report',
        status: 'pending',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    _id: 'task-3',
    title: 'Create Express Entry profile',
    description: 'Submit profile in IRCC portal',
    status: 'pending',
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    category: 'application',
    roadmapId: 'roadmap-1',
    phaseId: 'phase-2',
    assignedTo: 'user-1',
    estimatedTime: 7, // in days
    notes: 'Waiting for ECA before creating profile',
    relatedDocuments: [],
    subtasks: [
      {
        _id: 'subtask-3-1',
        title: 'Create IRCC account',
        status: 'pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'subtask-3-2',
        title: 'Fill out Express Entry profile',
        status: 'pending',
        dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'subtask-3-3',
        title: 'Submit profile',
        status: 'pending',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    _id: 'task-4',
    title: 'Update resume',
    description: 'Update resume to Canadian format',
    status: 'pending',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    category: 'documentation',
    roadmapId: 'roadmap-1',
    phaseId: 'phase-1',
    assignedTo: 'user-1',
    estimatedTime: 3, // in days
    notes: 'Need to update resume to Canadian format',
    relatedDocuments: ['doc-2'],
    subtasks: [
      {
        _id: 'subtask-4-1',
        title: 'Research Canadian resume format',
        status: 'completed',
        completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'subtask-4-2',
        title: 'Update resume content',
        status: 'in_progress',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'subtask-4-3',
        title: 'Get resume reviewed',
        status: 'pending',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];
