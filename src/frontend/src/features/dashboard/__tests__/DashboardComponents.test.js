import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Import components to test
import RecommendationSummaryWidget from '../components/RecommendationSummaryWidget';
import JourneyProgressWidget from '../components/JourneyProgressWidget';
import UpcomingTasksWidget from '../components/UpcomingTasksWidget';
import DocumentCenterWidget from '../components/DocumentCenterWidget';

// Create a theme for testing
const theme = createTheme();

// Create a mock store
const mockStore = configureStore([]);

// Mock data
const mockRecommendations = [
  {
    programId: 'program-1',
    programName: 'Express Entry - Federal Skilled Worker',
    country: 'Canada',
    category: 'Skilled Worker',
    scores: {
      mlMatchScore: 0.85,
      mlSuccessProbability: 0.75
    }
  },
  {
    programId: 'program-2',
    programName: 'Provincial Nominee Program - Ontario',
    country: 'Canada',
    category: 'Provincial Nominee',
    scores: {
      mlMatchScore: 0.78,
      mlSuccessProbability: 0.70
    }
  },
  {
    programId: 'program-3',
    programName: 'Global Talent Stream',
    country: 'Canada',
    category: 'Work Permit',
    scores: {
      mlMatchScore: 0.72,
      mlSuccessProbability: 0.65
    }
  }
];

const mockJourneyProgress = {
  currentStage: 'Preparation',
  stages: [
    { name: 'Research', status: 'completed', progress: 100 },
    { name: 'Preparation', status: 'in_progress', progress: 65 },
    { name: 'Application', status: 'pending', progress: 0 },
    { name: 'Processing', status: 'pending', progress: 0 },
    { name: 'Arrival', status: 'pending', progress: 0 }
  ]
};

const mockTasks = [
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
];

const mockDocuments = [
  {
    id: 'doc-1',
    name: 'Passport',
    type: 'identification',
    status: 'verified',
    uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'doc-2',
    name: 'Resume',
    type: 'employment',
    status: 'pending',
    uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'doc-3',
    name: 'Degree Certificate',
    type: 'education',
    status: 'pending',
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Test wrapper component
const TestWrapper = ({ children }) => {
  const store = mockStore({});

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('Dashboard Components', () => {
  test('RecommendationSummaryWidget renders correctly', () => {
    render(
      <TestWrapper>
        <RecommendationSummaryWidget recommendations={mockRecommendations} />
      </TestWrapper>
    );

    // Check if title is rendered
    expect(screen.getByText('Top Pathway Opportunities')).toBeInTheDocument();

    // Check if program names are rendered
    expect(screen.getByText('Express Entry - Federal Skilled Worker')).toBeInTheDocument();
    expect(screen.getByText('Provincial Nominee Program - Ontario')).toBeInTheDocument();
    expect(screen.getByText('Global Talent Stream')).toBeInTheDocument();

    // Check if view all button is rendered
    expect(screen.getByText('View All')).toBeInTheDocument();
  });

  test('JourneyProgressWidget renders correctly', () => {
    render(
      <TestWrapper>
        <JourneyProgressWidget journeyProgress={mockJourneyProgress} />
      </TestWrapper>
    );

    // Check if title is rendered
    expect(screen.getByText('Your Immigration Journey')).toBeInTheDocument();

    // Check if stages are rendered
    expect(screen.getByText('Exploration & Planning')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Application Prep & Submission')).toBeInTheDocument();
    expect(screen.getByText('Post-Approval & Arrival')).toBeInTheDocument();
  });

  test('UpcomingTasksWidget renders correctly', () => {
    render(
      <TestWrapper>
        <UpcomingTasksWidget tasks={mockTasks} />
      </TestWrapper>
    );

    // Check if title is rendered
    expect(screen.getByText('Upcoming Tasks')).toBeInTheDocument();

    // Check if task titles are rendered
    expect(screen.getByText('Task Title')).toBeInTheDocument();

    // Check if view all button is rendered
    expect(screen.getByText('View All')).toBeInTheDocument();
  });

  test('DocumentCenterWidget renders correctly', () => {
    render(
      <TestWrapper>
        <DocumentCenterWidget documents={mockDocuments} />
      </TestWrapper>
    );

    // Check if title is rendered
    expect(screen.getByText('Document Center')).toBeInTheDocument();

    // Check if document names are rendered
    expect(screen.getByText('Document Name')).toBeInTheDocument();

    // Check if manage documents button is rendered
    expect(screen.getByText('Manage Documents')).toBeInTheDocument();
  });
});
