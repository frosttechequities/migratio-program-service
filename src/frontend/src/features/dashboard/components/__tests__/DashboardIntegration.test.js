import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

// Import components
import DashboardLayout from '../DashboardLayout';
import WelcomeWidget from '../WelcomeWidget';
import JourneyProgressWidget from '../JourneyProgressWidget';
import RecommendationSummaryWidget from '../RecommendationSummaryWidget';
import UpcomingTasksWidget from '../UpcomingTasksWidget';
import DocumentCenterWidget from '../DocumentCenterWidget';
import ResourceRecommendationsWidget from '../ResourceRecommendationsWidget';
import GlobalOpportunitiesWidget from '../GlobalOpportunitiesWidget';

// Import reducers
import dashboardReducer from '../../dashboardSlice';
import authReducer from '../../../auth/authSlice';
import uiReducer from '../../../ui/uiSlice';
import profileReducer from '../../../profile/profileSlice';
import recommendationsReducer from '../../../recommendations/recommendationsSlice';

// Create a theme for testing
const theme = createTheme();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock the react-grid-layout module
jest.mock('react-grid-layout', () => ({
  __esModule: true,
  default: ({ children, onLayoutChange }) => {
    // Simulate layout change when rendered
    React.useEffect(() => {
      if (onLayoutChange) {
        onLayoutChange([
          { i: 'welcome', x: 0, y: 0, w: 12, h: 2 },
          { i: 'journeyProgress', x: 0, y: 2, w: 12, h: 2 },
          { i: 'recommendations', x: 0, y: 4, w: 8, h: 2 },
          { i: 'tasks', x: 8, y: 4, w: 4, h: 2 }
        ]);
      }
    }, [onLayoutChange]);

    return <div data-testid="grid-layout">{children}</div>;
  },
  Responsive: ({ children, onLayoutChange }) => {
    // Simulate layout change when rendered
    React.useEffect(() => {
      if (onLayoutChange) {
        onLayoutChange({
          lg: [
            { i: 'welcome', x: 0, y: 0, w: 12, h: 2 },
            { i: 'journeyProgress', x: 0, y: 2, w: 12, h: 2 },
            { i: 'recommendations', x: 0, y: 4, w: 8, h: 2 },
            { i: 'tasks', x: 8, y: 4, w: 4, h: 2 }
          ]
        });
      }
    }, [onLayoutChange]);

    return <div data-testid="responsive-grid-layout">{children}</div>;
  }
}));

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      auth: authReducer,
      ui: uiReducer,
      profile: profileReducer,
      recommendations: recommendationsReducer
    },
    preloadedState: {
      dashboard: {
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        data: {
          overview: {
            currentStageIndex: 2,
            completedTasks: 15,
            totalTasks: 30,
            documentsUploaded: 5,
            documentsRequired: 10
          },
          recommendations: [
            {
              id: 'rec1',
              title: 'Complete language test',
              description: 'Take an approved language test to verify your proficiency',
              priority: 'high',
              link: '/tasks/language-test'
            },
            {
              id: 'rec2',
              title: 'Submit education credentials',
              description: 'Get your education credentials assessed',
              priority: 'medium',
              link: '/tasks/education-assessment'
            }
          ],
          tasks: [
            {
              id: 'task1',
              title: 'Complete profile',
              dueDate: '2023-12-31',
              status: 'in_progress'
            },
            {
              id: 'task2',
              title: 'Upload passport',
              dueDate: '2023-12-15',
              status: 'pending'
            }
          ],
          documents: {
            recent: [
              {
                id: 'doc1',
                name: 'Passport.pdf',
                uploadDate: '2023-11-01',
                status: 'verified'
              },
              {
                id: 'doc2',
                name: 'LanguageTest.pdf',
                uploadDate: '2023-11-05',
                status: 'pending'
              }
            ],
            stats: {
              uploaded: 5,
              verified: 3,
              pending: 2,
              required: 10
            }
          }
        },
        preferences: {
          layout: 'default',
          visibleWidgets: [
            'welcome',
            'journeyProgress',
            'recommendations',
            'tasks',
            'documents',
            'resources',
            'opportunities'
          ],
          widgetOrder: [
            'welcome',
            'journeyProgress',
            'recommendations',
            'tasks',
            'documents',
            'resources',
            'opportunities'
          ]
        },
        ...initialState.dashboard
      },
      auth: {
        isAuthenticated: true,
        user: {
          id: 'user1',
          name: 'Test User',
          email: 'test@example.com',
          subscriptionTier: 'premium',
          subscriptionExpiry: '2024-12-31'
        },
        ...initialState.auth
      },
      ...initialState
    }
  });
};

// Test wrapper component
const TestWrapper = ({ children, store }) => (
  <Provider store={store || createMockStore()}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();

    // Reset mocks
    jest.clearAllMocks();
  });

  test('Dashboard components interact correctly', async () => {
    render(
      <TestWrapper>
        <DashboardLayout>
          <WelcomeWidget
            key="welcome"
            id="welcome"
            title="Welcome"
          />
          <JourneyProgressWidget
            key="journeyProgress"
            id="journeyProgress"
            title="Journey Progress"
          />
          <RecommendationSummaryWidget
            key="recommendations"
            id="recommendations"
            title="Recommendations"
          />
          <UpcomingTasksWidget
            key="tasks"
            id="tasks"
            title="Upcoming Tasks"
          />
        </DashboardLayout>
      </TestWrapper>
    );

    // Verify grid layout is rendered
    expect(screen.getByTestId('responsive-grid-layout')).toBeInTheDocument();

    // Verify widgets are rendered
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Journey Progress')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Tasks')).toBeInTheDocument();

    // Verify layout is saved to localStorage
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'dashboardLayout',
        expect.any(String)
      );
    });
  });

  test('Dashboard handles state changes correctly', async () => {
    const store = createMockStore();
    const { rerender } = render(
      <TestWrapper store={store}>
        <DashboardLayout>
          <WelcomeWidget
            key="welcome"
            id="welcome"
            title="Welcome"
          />
          <JourneyProgressWidget
            key="journeyProgress"
            id="journeyProgress"
            title="Journey Progress"
          />
          <RecommendationSummaryWidget
            key="recommendations"
            id="recommendations"
            title="Recommendations"
          />
          <UpcomingTasksWidget
            key="tasks"
            id="tasks"
            title="Upcoming Tasks"
          />
        </DashboardLayout>
      </TestWrapper>
    );

    // Verify all widgets are initially rendered
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Journey Progress')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Tasks')).toBeInTheDocument();

    // Update store with new preferences (hide some widgets)
    store.dispatch({
      type: 'dashboard/updateLayoutPreference',
      payload: {
        visibleWidgets: ['welcome', 'recommendations']
      }
    });

    // Re-render with updated store
    rerender(
      <TestWrapper store={store}>
        <DashboardLayout>
          <WelcomeWidget
            key="welcome"
            id="welcome"
            title="Welcome"
          />
          <JourneyProgressWidget
            key="journeyProgress"
            id="journeyProgress"
            title="Journey Progress"
          />
          <RecommendationSummaryWidget
            key="recommendations"
            id="recommendations"
            title="Recommendations"
          />
          <UpcomingTasksWidget
            key="tasks"
            id="tasks"
            title="Upcoming Tasks"
          />
        </DashboardLayout>
      </TestWrapper>
    );

    // Verify only visible widgets are rendered
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.queryByText('Journey Progress')).not.toBeInTheDocument();
    expect(screen.queryByText('Upcoming Tasks')).not.toBeInTheDocument();
  });

  test('Dashboard persists user preferences', async () => {
    // Set up localStorage with a saved layout
    const savedLayout = {
      lg: [
        { i: 'welcome', x: 0, y: 0, w: 12, h: 3 }, // Custom height
        { i: 'recommendations', x: 0, y: 3, w: 12, h: 4 } // Custom height
      ]
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedLayout));

    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

    render(
      <TestWrapper>
        <DashboardLayout>
          <WelcomeWidget
            key="welcome"
            id="welcome"
            title="Welcome"
          />
          <RecommendationSummaryWidget
            key="recommendations"
            id="recommendations"
            title="Recommendations"
          />
        </DashboardLayout>
      </TestWrapper>
    );

    // Verify localStorage was checked
    expect(localStorageMock.getItem).toHaveBeenCalledWith('dashboardLayout');

    // Verify dispatch was called with updateLayoutPreference
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('updateLayoutPreference'),
        payload: {
          layoutConfig: savedLayout
        }
      })
    );

    // Verify widgets are rendered with the saved layout
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });
});