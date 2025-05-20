import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Import components
import DashboardLayout from '../DashboardLayout';
import WelcomeWidget from '../WelcomeWidget';
import JourneyProgressWidget from '../JourneyProgressWidget';
import RecommendationSummaryWidget from '../RecommendationSummaryWidget';
import UpcomingTasksWidget from '../UpcomingTasksWidget';
import DocumentCenterWidget from '../DocumentCenterWidget';

// Import reducers
import dashboardReducer, { updateLayoutPreference } from '../../dashboardSlice';
import authReducer from '../../../auth/authSlice';
import uiReducer from '../../../ui/uiSlice';

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
  Responsive: ({ children, onLayoutChange, onResize, onDragStop }) => {
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

    // Add functions to simulate drag and resize events
    const handleDrag = (layout) => {
      if (onDragStop) {
        onDragStop(layout);
      }
    };

    const handleResize = (layout) => {
      if (onResize) {
        onResize(layout);
      }
    };

    return (
      <div data-testid="responsive-grid-layout">
        {children}
        <button
          data-testid="simulate-drag"
          onClick={() => handleDrag({
            lg: [
              { i: 'welcome', x: 0, y: 0, w: 12, h: 2 },
              { i: 'journeyProgress', x: 0, y: 2, w: 12, h: 2 },
              { i: 'recommendations', x: 8, y: 0, w: 4, h: 2 }, // Changed position
              { i: 'tasks', x: 0, y: 4, w: 12, h: 2 } // Changed position
            ]
          })}
        >
          Simulate Drag
        </button>
        <button
          data-testid="simulate-resize"
          onClick={() => handleResize({
            lg: [
              { i: 'welcome', x: 0, y: 0, w: 12, h: 3 }, // Increased height
              { i: 'journeyProgress', x: 0, y: 3, w: 12, h: 2 },
              { i: 'recommendations', x: 0, y: 5, w: 6, h: 2 }, // Decreased width
              { i: 'tasks', x: 6, y: 5, w: 6, h: 2 }
            ]
          })}
        >
          Simulate Resize
        </button>
      </div>
    );
  }
}));

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      auth: authReducer,
      ui: uiReducer
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
            totalTasks: 30
          },
          recommendations: [
            {
              id: 'rec1',
              title: 'Complete language test',
              description: 'Take an approved language test to verify your proficiency',
              priority: 'high',
              link: '/tasks/language-test'
            }
          ],
          tasks: [
            {
              id: 'task1',
              title: 'Complete profile',
              dueDate: '2023-12-31',
              status: 'in_progress'
            }
          ]
        },
        preferences: {
          layout: 'default',
          visibleWidgets: [
            'welcome',
            'journeyProgress',
            'recommendations',
            'tasks'
          ],
          widgetOrder: [
            'welcome',
            'journeyProgress',
            'recommendations',
            'tasks'
          ]
        },
        ...initialState.dashboard
      },
      auth: {
        isAuthenticated: true,
        user: {
          id: 'user1',
          name: 'Test User',
          email: 'test@example.com'
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

describe('Dashboard User Interaction Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();

    // Reset mocks
    jest.clearAllMocks();
  });

  test('User can customize widget visibility', async () => {
    const store = createMockStore();
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;

    render(
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

    // Simulate user clicking on widget settings
    const settingsButtons = screen.getAllByTitle('Widget Settings');
    fireEvent.click(settingsButtons[0]); // Click on first widget's settings

    // Dispatch action to hide a widget (simulating user interaction)
    store.dispatch(updateLayoutPreference({
      visibleWidgets: ['welcome', 'recommendations', 'tasks'] // Remove journeyProgress
    }));

    // Re-render with updated store
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('updateLayoutPreference'),
          payload: expect.objectContaining({
            visibleWidgets: ['welcome', 'recommendations', 'tasks']
          })
        })
      );
    });
  });

  test('User can rearrange dashboard layout', async () => {
    const store = createMockStore();
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;

    render(
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

    // Simulate drag event
    const dragButton = screen.getByTestId('simulate-drag');
    fireEvent.click(dragButton);

    // Verify layout change was dispatched
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('updateLayoutPreference'),
          payload: expect.objectContaining({
            layoutConfig: expect.objectContaining({
              lg: expect.arrayContaining([
                expect.objectContaining({ i: 'recommendations', x: 8, y: 0 }), // Changed position
                expect.objectContaining({ i: 'tasks', x: 0, y: 4 }) // Changed position
              ])
            })
          })
        })
      );
    });

    // Verify localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'dashboardLayout',
      expect.any(String)
    );
  });

  test('User can resize widgets', async () => {
    const store = createMockStore();
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;

    render(
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

    // Simulate resize event
    const resizeButton = screen.getByTestId('simulate-resize');
    fireEvent.click(resizeButton);

    // Verify layout change was dispatched
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('updateLayoutPreference'),
          payload: expect.objectContaining({
            layoutConfig: expect.objectContaining({
              lg: expect.arrayContaining([
                expect.objectContaining({ i: 'welcome', h: 3 }), // Increased height
                expect.objectContaining({ i: 'recommendations', w: 6 }) // Decreased width
              ])
            })
          })
        })
      );
    });

    // Verify localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'dashboardLayout',
      expect.any(String)
    );
  });

  test('User preferences persist across sessions', async () => {
    // Set up localStorage with a saved layout
    const savedLayout = {
      lg: [
        { i: 'welcome', x: 0, y: 0, w: 12, h: 3 }, // Custom height
        { i: 'recommendations', x: 0, y: 3, w: 12, h: 4 } // Custom height
      ]
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedLayout));

    // Create a store with custom preferences
    const store = createMockStore({
      dashboard: {
        preferences: {
          visibleWidgets: ['welcome', 'recommendations'], // Only show two widgets
          layout: 'compact'
        }
      }
    });

    render(
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

    // Verify localStorage was checked
    expect(localStorageMock.getItem).toHaveBeenCalledWith('dashboardLayout');

    // Verify only visible widgets are rendered
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.queryByText('Journey Progress')).not.toBeInTheDocument();
    expect(screen.queryByText('Upcoming Tasks')).not.toBeInTheDocument();

    // Simulate page reload by unmounting and remounting
    const { unmount } = render(
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

    unmount();

    // Re-render with same store
    render(
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

    // Verify preferences were maintained
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.queryByText('Journey Progress')).not.toBeInTheDocument();
    expect(screen.queryByText('Upcoming Tasks')).not.toBeInTheDocument();
  });

  test('Dashboard responds to window resizing', async () => {
    // Mock window resize
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    // Create a store
    const store = createMockStore();
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;

    render(
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

    // Simulate window resize to mobile size
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 480 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });

    // Dispatch window resize event
    fireEvent(window, new Event('resize'));

    // Wait for resize to be processed
    await waitFor(() => {
      // Verify all widgets are still rendered
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('Journey Progress')).toBeInTheDocument();
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Upcoming Tasks')).toBeInTheDocument();
    });

    // Restore original window dimensions
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalInnerWidth });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: originalInnerHeight });
  });
});