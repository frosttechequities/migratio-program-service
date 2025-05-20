import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Import the DashboardPage component
import DashboardPage from '../../dashboard/DashboardPage';

// Import reducers
import dashboardReducer from '../../../features/dashboard/dashboardSlice';
import roadmapReducer from '../../../features/roadmap/roadmapSlice';
import recommendationReducer from '../../../features/recommendations/recommendationSlice';
import profileReducer from '../../../features/profile/profileSlice';
import authReducer from '../../../features/auth/authSlice';
import uiReducer from '../../../features/ui/uiSlice';

// Mock data
const mockDashboardData = {
  overview: {
    completedSteps: 5,
    totalSteps: 10,
    currentStageIndex: 2,
    daysActive: 30,
    documentsUploaded: 8,
    tasksCompleted: 12
  },
  nextSteps: [
    {
      id: 'step-1',
      title: 'Complete language test',
      priority: 'high',
      dueDate: new Date('2023-12-31').toISOString()
    },
    {
      id: 'step-2',
      title: 'Submit education documents',
      priority: 'medium',
      dueDate: new Date('2024-01-15').toISOString()
    }
  ],
  recommendations: [
    {
      id: 'rec-1',
      title: 'Express Entry - Federal Skilled Worker',
      country: 'Canada',
      score: 85,
      description: 'Strong match based on your profile'
    },
    {
      id: 'rec-2',
      title: 'Provincial Nominee Program - Ontario',
      country: 'Canada',
      score: 78,
      description: 'Good match for Ontario PNP'
    },
    {
      id: 'rec-3',
      title: 'Global Talent Stream',
      country: 'Canada',
      score: 72,
      description: 'Potential match for tech workers'
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Complete language test',
      dueDate: new Date('2023-12-31').toISOString(),
      status: 'pending',
      priority: 'high',
      category: 'language'
    },
    {
      id: 'task-2',
      title: 'Submit education documents',
      dueDate: new Date('2024-01-15').toISOString(),
      status: 'pending',
      priority: 'medium',
      category: 'education'
    }
  ],
  documents: {
    recent: [
      {
        id: 'doc-1',
        name: 'Passport',
        uploadDate: new Date('2023-11-01').toISOString(),
        type: 'identification',
        status: 'verified'
      },
      {
        id: 'doc-2',
        name: 'Degree Certificate',
        uploadDate: new Date('2023-11-15').toISOString(),
        type: 'education',
        status: 'pending'
      }
    ],
    stats: {
      total: 8,
      verified: 5,
      pending: 3,
      rejected: 0
    }
  }
};

const mockRoadmapData = {
  _id: 'roadmap-1',
  title: 'Express Entry Application',
  description: 'Complete roadmap for Express Entry application process',
  status: 'active',
  startDate: new Date('2023-01-01').toISOString(),
  targetCompletionDate: new Date('2023-12-31').toISOString(),
  phases: [
    {
      phaseName: 'Preparation',
      phaseOrder: 1,
      tasks: [
        {
          taskId: 'task-1',
          title: 'Take language test',
          description: 'Schedule and complete IELTS or CELPIP test',
          status: 'completed',
          dueDate: new Date('2023-02-15').toISOString(),
        },
        {
          taskId: 'task-2',
          title: 'Get education credentials assessed',
          description: 'Submit documents for ECA',
          status: 'in_progress',
          dueDate: new Date('2023-03-30').toISOString(),
        }
      ]
    },
    {
      phaseName: 'Profile Creation',
      phaseOrder: 2,
      tasks: [
        {
          taskId: 'task-3',
          title: 'Create Express Entry profile',
          description: 'Submit profile in IRCC portal',
          status: 'pending',
          dueDate: new Date('2023-04-15').toISOString(),
        }
      ]
    }
  ]
};

const mockProfileData = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  completionPercentage: 85,
  preferences: {
    dashboard: {
      widgets: {
        welcome: true,
        journeyProgress: true,
        recommendations: true,
        upcomingTasks: true,
        documentCenter: true,
        resourceRecommendations: true,
        subscriptionStatus: true,
        globalOpportunities: true,
        destinationSuggestions: true,
        successProbability: true,
        actionRecommendations: true,
        roadmap: true
      },
      layout: 'default'
    }
  }
};

const mockAuthData = {
  user: {
    id: 'user-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe'
  },
  isAuthenticated: true,
  isLoading: false,
  error: null
};

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      roadmap: roadmapReducer,
      recommendations: recommendationReducer,
      profile: profileReducer,
      auth: authReducer,
      ui: uiReducer,
    },
    preloadedState: {
      dashboard: {
        dashboardData: mockDashboardData,
        isLoading: false,
        error: null,
      },
      roadmap: {
        roadmaps: [mockRoadmapData],
        currentRoadmap: mockRoadmapData,
        isLoading: false,
        error: null,
      },
      recommendations: {
        programRecommendations: mockDashboardData.recommendations,
        successProbability: {
          overallScore: 75,
          positiveFactors: [
            { name: 'Education Level', description: 'Your education level meets the requirements for most programs.' },
            { name: 'Language Proficiency', description: 'Your language skills are sufficient for many immigration pathways.' }
          ],
          negativeFactors: [
            { name: 'Work Experience', description: 'Additional work experience would improve your eligibility for skilled worker programs.' }
          ]
        },
        isLoading: false,
        error: null,
      },
      profile: {
        profile: mockProfileData,
        isLoading: false,
        error: null,
      },
      auth: mockAuthData,
      ui: {
        theme: 'light',
      },
    },
  });
};

// Create a theme for testing
const theme = createTheme();

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

// Test wrapper component
const TestWrapper = ({ children }) => {
  return (
    <Provider store={createMockStore()}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

// Mock the dispatch function
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

describe('Dashboard Experience Optimization Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  test('renders dashboard with all optimized components', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );
    
    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
    });
    
    // Check if journey progress widget is displayed
    expect(screen.getByText('Your Immigration Journey')).toBeInTheDocument();
    
    // Check if recommendation summary widget is displayed
    expect(screen.getByText('Top Pathway Opportunities')).toBeInTheDocument();
    
    // Check if upcoming tasks widget is displayed
    expect(screen.getByText('Upcoming Tasks')).toBeInTheDocument();
    
    // Check if document center widget is displayed
    expect(screen.getByText('Document Center')).toBeInTheDocument();
    
    // Check if success probability widget is displayed
    expect(screen.getByText('Success Probability')).toBeInTheDocument();
  });
  
  test('handles widget visibility toggling', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );
    
    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
    });
    
    // Find and click the customize dashboard button
    const customizeButton = screen.getByLabelText('Customize Dashboard');
    fireEvent.click(customizeButton);
    
    // Wait for the customization panel to appear
    await waitFor(() => {
      expect(screen.getByText('Customize Dashboard')).toBeInTheDocument();
    });
    
    // Find and toggle a widget visibility switch
    const recommendationsSwitch = screen.getByLabelText('Show Recommendations');
    fireEvent.click(recommendationsSwitch);
    
    // Close the customization panel
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
  });
  
  test('displays enhanced visual roadmap correctly', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );
    
    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
    });
    
    // Check if roadmap widget is displayed
    expect(screen.getByText('Your Roadmaps')).toBeInTheDocument();
    
    // Check if roadmap phases are displayed
    expect(screen.getByText('Express Entry Application')).toBeInTheDocument();
  });
  
  test('displays improved recommendation display correctly', async () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );
    
    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
    });
    
    // Check if recommendation summary widget is displayed
    expect(screen.getByText('Top Pathway Opportunities')).toBeInTheDocument();
    
    // Check if program names are displayed
    expect(screen.getByText('Express Entry - Federal Skilled Worker')).toBeInTheDocument();
    
    // Check if success probability widget is displayed
    expect(screen.getByText('Success Probability')).toBeInTheDocument();
    
    // Check if positive factors are displayed
    expect(screen.getByText('Education Level')).toBeInTheDocument();
    expect(screen.getByText('Language Proficiency')).toBeInTheDocument();
  });
});
