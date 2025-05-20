import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Import components to test
import InteractiveTimeline from '../components/InteractiveTimeline';
import TimelineVisualization from '../components/TimelineVisualization';
import MilestoneTracker from '../components/MilestoneTracker';
import StepGuidance from '../components/StepGuidance';

// Import reducers
import roadmapReducer from '../roadmapSlice';
import uiReducer from '../../ui/uiSlice';

// Mock data
const mockRoadmap = {
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

const mockMilestones = [
  {
    id: 'milestone-1',
    title: 'Language Test Completed',
    description: 'IELTS test completed with required scores',
    status: 'completed',
    targetDate: new Date('2023-02-15').toISOString(),
  },
  {
    id: 'milestone-2',
    title: 'ECA Received',
    description: 'Education Credential Assessment received',
    status: 'pending',
    targetDate: new Date('2023-03-30').toISOString(),
  },
  {
    id: 'milestone-3',
    title: 'Profile Submitted',
    description: 'Express Entry profile submitted',
    status: 'pending',
    targetDate: new Date('2023-04-15').toISOString(),
  }
];

const mockSteps = [
  {
    id: 'step-1',
    title: 'Register for language test',
    description: 'Create account on testing center website and schedule test',
    status: 'completed',
    order: 1,
  },
  {
    id: 'step-2',
    title: 'Prepare for language test',
    description: 'Study using practice materials',
    status: 'completed',
    order: 2,
  },
  {
    id: 'step-3',
    title: 'Take language test',
    description: 'Attend test center on scheduled date',
    status: 'completed',
    order: 3,
  }
];

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      roadmap: roadmapReducer,
      ui: uiReducer,
    },
    preloadedState: {
      roadmap: {
        roadmaps: [mockRoadmap],
        currentRoadmap: mockRoadmap,
        isLoading: false,
        error: null,
      },
      ui: {
        theme: 'light',
      },
    },
  });
};

// Create a theme for testing
const theme = createTheme();

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

describe('Enhanced Visual Roadmap Components', () => {
  describe('InteractiveTimeline Component', () => {
    test('renders with stepper view by default', () => {
      render(
        <TestWrapper>
          <InteractiveTimeline roadmap={mockRoadmap} />
        </TestWrapper>
      );

      // Check if phase names are displayed
      expect(screen.getByText('Preparation')).toBeInTheDocument();
      expect(screen.getByText('Profile Creation')).toBeInTheDocument();

      // Check if tasks are displayed
      expect(screen.getByText('Take language test')).toBeInTheDocument();
      expect(screen.getByText('Get education credentials assessed')).toBeInTheDocument();
      expect(screen.getByText('Create Express Entry profile')).toBeInTheDocument();
    });

    test('switches between different view modes', async () => {
      render(
        <TestWrapper>
          <InteractiveTimeline roadmap={mockRoadmap} />
        </TestWrapper>
      );

      // Find view mode buttons
      const timelineButton = screen.getByLabelText('Timeline View');

      // Switch to timeline view
      fireEvent.click(timelineButton);

      // Check if TimelineVisualization is rendered
      await waitFor(() => {
        expect(screen.getByText('Timeline')).toBeInTheDocument();
      });
    });
  });

  describe('TimelineVisualization Component', () => {
    test('renders timeline with phases and milestones', () => {
      render(
        <TestWrapper>
          <TimelineVisualization
            phases={mockRoadmap.phases}
            milestones={mockMilestones}
            startDate={new Date(mockRoadmap.startDate)}
            endDate={new Date(mockRoadmap.targetCompletionDate)}
            currentDate={new Date()}
          />
        </TestWrapper>
      );

      // Check if timeline elements are rendered
      expect(screen.getByText('Timeline')).toBeInTheDocument();

      // Check for zoom controls
      expect(screen.getByLabelText('Zoom In')).toBeInTheDocument();
      expect(screen.getByLabelText('Zoom Out')).toBeInTheDocument();
      expect(screen.getByLabelText('Reset Zoom')).toBeInTheDocument();
    });

    test('handles zoom controls correctly', () => {
      render(
        <TestWrapper>
          <TimelineVisualization
            phases={mockRoadmap.phases}
            milestones={mockMilestones}
            startDate={new Date(mockRoadmap.startDate)}
            endDate={new Date(mockRoadmap.targetCompletionDate)}
            currentDate={new Date()}
          />
        </TestWrapper>
      );

      // Get zoom controls
      const zoomInButton = screen.getByLabelText('Zoom In');
      const zoomOutButton = screen.getByLabelText('Zoom Out');
      const resetZoomButton = screen.getByLabelText('Reset Zoom');

      // Test zoom in
      fireEvent.click(zoomInButton);

      // Test zoom out
      fireEvent.click(zoomOutButton);

      // Test reset zoom
      fireEvent.click(resetZoomButton);
    });
  });

  describe('MilestoneTracker Component', () => {
    test('renders milestones correctly', () => {
      render(
        <TestWrapper>
          <MilestoneTracker
            milestones={mockMilestones}
            onMilestoneUpdate={() => {}}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Check if milestone titles are displayed
      expect(screen.getByText('Language Test Completed')).toBeInTheDocument();
      expect(screen.getByText('ECA Received')).toBeInTheDocument();
      expect(screen.getByText('Profile Submitted')).toBeInTheDocument();

      // Check if status chips are displayed
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getAllByText('Pending').length).toBe(2);
    });

    test('handles milestone status updates', () => {
      const mockUpdateFn = jest.fn();

      render(
        <TestWrapper>
          <MilestoneTracker
            milestones={mockMilestones}
            onMilestoneUpdate={mockUpdateFn}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Find and click the Complete button for a pending milestone
      const completeButtons = screen.getAllByText('Complete');
      fireEvent.click(completeButtons[0]);

      // Check if update function was called
      expect(mockUpdateFn).toHaveBeenCalledWith('milestone-2', 'completed');
    });
  });

  describe('StepGuidance Component', () => {
    test('renders steps correctly', () => {
      render(
        <TestWrapper>
          <StepGuidance
            steps={mockSteps}
            onStepUpdate={() => {}}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Check if step titles are displayed
      expect(screen.getByText('Register for language test')).toBeInTheDocument();
      expect(screen.getByText('Prepare for language test')).toBeInTheDocument();
      expect(screen.getByText('Take language test')).toBeInTheDocument();

      // Check if status chips are displayed
      expect(screen.getAllByText('Completed').length).toBe(3);
    });

    test('expands step details when clicked', () => {
      render(
        <TestWrapper>
          <StepGuidance
            steps={mockSteps}
            onStepUpdate={() => {}}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Find and click a step to expand it
      fireEvent.click(screen.getByText('Register for language test'));

      // Check if step description is displayed
      expect(screen.getByText('Create account on testing center website and schedule test')).toBeInTheDocument();

      // Check if action buttons are displayed
      expect(screen.getByTestId('help-button-step-1')).toBeInTheDocument();
      expect(screen.getByTestId('incomplete-button-step-1')).toBeInTheDocument();
    });
  });
});
