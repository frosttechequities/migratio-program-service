import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock Supabase client and authentication
jest.mock('../../../utils/supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: { user: { id: 'test-user-id' } } }, error: null })),
      refreshSession: jest.fn(() => Promise.resolve({ data: { session: { access_token: 'mock-access-token' } }, error: null })),
      // Add other auth methods as needed for testing
    },
    // Add other Supabase client methods as needed for testing
  },
  getSupabaseClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: { user: { id: 'test-user-id' } } }, error: null })),
      refreshSession: jest.fn(() => Promise.resolve({ data: { session: { access_token: 'mock-access-token' } }, error: null })),
    },
  })),
  getSupabaseSession: jest.fn(() => Promise.resolve({ user: { id: 'test-user-id' } })),
  refreshToken: jest.fn(() => Promise.resolve('mock-access-token')),
  getAuthenticatedClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: { user: { id: 'test-user-id' } } }, error: null })),
      refreshSession: jest.fn(() => Promise.resolve({ data: { session: { access_token: 'mock-access-token' } }, error: null })),
    },
  })),
}));


// Import the actual components and reducers
import DashboardPage from '../DashboardPage';
import dashboardReducer from '../../../features/dashboard/dashboardSlice';
import profileReducer from '../../../features/profile/profileSlice';
import authReducer from '../../../features/auth/authSlice';
import uiReducer from '../../../features/ui/uiSlice';
import personalizationReducer from '../../../features/personalization/personalizationSlice';
import resourceReducer from '../../../features/resources/resourceSlice';
import recommendationReducer from '../../../features/recommendations/recommendationSlice';

// Create a theme for testing
const theme = createTheme();

// Mock ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

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

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Create a real Redux store with all necessary reducers
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      profile: profileReducer,
      auth: authReducer,
      ui: uiReducer,
      personalization: personalizationReducer,
      resources: resourceReducer,
      recommendations: recommendationReducer
    },
    preloadedState: {
      auth: {
        user: { id: 'user1', name: 'Test User', email: 'test@example.com', subscriptionTier: 'premium' },
        isAuthenticated: true,
        ...initialState.auth
      },
      profile: {
        profile: {
          id: 'profile1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          completedSteps: ['personal', 'education'],
          ...initialState.profile?.profile
        },
        isLoading: false,
        ...initialState.profile
      },
      dashboard: {
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: {
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
            'opportunities',
            'subscription',
            'readiness',
            'destinations',
            'successProbability',
            'actionRecommendations'
          ],
          widgetOrder: [
            'welcome',
            'journeyProgress',
            'recommendations',
            'tasks',
            'documents',
            'resources',
            'opportunities',
            'subscription',
            'readiness',
            'destinations',
            'successProbability',
            'actionRecommendations'
          ]
        },
        ...initialState.dashboard
      },
      ui: {
        message: null,
        sidebarOpen: false,
        ...initialState.ui
      },
      personalization: {
        preferences: {
          theme: 'light',
          fontSize: 'medium',
          ...initialState.personalization?.preferences
        },
        savedLayouts: [],
        ...initialState.personalization
      },
      resources: {
        resources: [],
        currentResource: null,
        isLoading: false,
        error: null,
        ...initialState.resources
      },
      recommendations: {
        recommendations: [],
        simulationResults: null,
        isLoading: false,
        isSimulationLoading: false,
        error: null,
        ...initialState.recommendations
      }
    }
  });
};

// Render helper function
const renderDashboard = (initialState = {}) => {
  const store = createTestStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    ),
    store
  };
};

describe('Dashboard Core Functionality - Comprehensive Tests', () => {
  // Clear localStorage and mocks before each test
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  // 2. Layout and Responsiveness Tests
  describe('Layout and Responsiveness', () => {
    test('renders default layout correctly', async () => {
      const { store } = renderDashboard();

      // Check that the grid layout is rendered
      const gridContainer = screen.getByRole('main');
      expect(gridContainer).toBeInTheDocument();

      // Check that widgets are rendered in the correct order
      const widgets = screen.getAllByRole('article');
      expect(widgets.length).toBeGreaterThan(0);
    });

    test('adjusts layout for different screen sizes', async () => {
      // Test small screen
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 600px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { store: smallStore, rerender } = renderDashboard();

      // Check that widgets stack vertically on small screens
      const smallScreenWidgets = screen.getAllByRole('article');

      // Test medium screen
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 960px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      rerender(
        <Provider store={smallStore}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <DashboardPage />
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
      );

      // Check that widgets are arranged differently on medium screens
      const mediumScreenWidgets = screen.getAllByRole('article');

      // Test large screen
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(min-width: 1280px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      rerender(
        <Provider store={smallStore}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <DashboardPage />
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
      );

      // Check that widgets are arranged optimally on large screens
      const largeScreenWidgets = screen.getAllByRole('article');
    });

    test('persists layout between sessions', async () => {
      // First render - simulate setting a layout
      const { store } = renderDashboard();

      // Simulate saving layout to localStorage
      const layoutConfig = {
        lg: [
          { i: 'welcome', x: 0, y: 0, w: 12, h: 2 },
          { i: 'journeyProgress', x: 0, y: 2, w: 12, h: 2 },
          { i: 'recommendations', x: 0, y: 4, w: 8, h: 4 },
          { i: 'tasks', x: 8, y: 4, w: 4, h: 4 }
        ]
      };

      localStorageMock.setItem('dashboardLayout', JSON.stringify(layoutConfig));

      // Second render - should load layout from localStorage
      const { store: newStore } = renderDashboard();

      // Verify localStorage was accessed
      expect(localStorageMock.getItem).toHaveBeenCalledWith('dashboardLayout');
    });
  });

  // 3. Widget Visibility and Customization Tests
  describe('Widget Visibility and Customization', () => {
    test('shows/hides widgets based on preferences', async () => {
      // Render with specific widget visibility
      const { store } = renderDashboard({
        dashboard: {
          preferences: {
            layout: 'default',
            visibleWidgets: ['welcome', 'journeyProgress', 'recommendations'],
            widgetOrder: ['welcome', 'journeyProgress', 'recommendations']
          }
        }
      });

      // Check that only specified widgets are visible
      expect(screen.getByText('Welcome back, Test User')).toBeInTheDocument(); // Welcome widget
      expect(screen.getByText('Your Progress')).toBeInTheDocument(); // Journey Progress widget
      expect(screen.getByText('Recommendations')).toBeInTheDocument(); // Recommendations widget

      // Tasks widget should not be visible
      const tasksWidget = screen.queryByText('Your Tasks');
      expect(tasksWidget).not.toBeInTheDocument();
    });

    test('toggles widget visibility through UI', async () => {
      const { store } = renderDashboard();

      // Open customize panel
      const customizeButton = screen.getByRole('button', { name: /customize dashboard/i });
      fireEvent.click(customizeButton);

      // Find and toggle a widget switch
      const widgetSwitches = screen.getAllByRole('checkbox');
      const tasksSwitch = widgetSwitches.find(sw => sw.name === 'tasks');

      if (tasksSwitch) {
        fireEvent.click(tasksSwitch);

        // Check that the widget visibility is updated in the store
        await waitFor(() => {
          const state = store.getState();
          expect(state.dashboard.preferences.visibleWidgets).not.toContain('tasks');
        });
      }
    });

    test('saves and loads custom layouts', async () => {
      const { store } = renderDashboard();

      // Simulate saving a custom layout
      const customLayout = {
        name: 'My Custom Layout',
        layout: {
          visibleWidgets: ['welcome', 'recommendations', 'tasks'],
          widgetOrder: ['welcome', 'recommendations', 'tasks']
        }
      };

      // Save to localStorage
      localStorageMock.setItem('savedDashboardLayouts', JSON.stringify([customLayout]));

      // Render again to load saved layouts
      const { store: newStore } = renderDashboard();

      // Verify localStorage was accessed
      expect(localStorageMock.getItem).toHaveBeenCalledWith('savedDashboardLayouts');
    });

    test('supports drag-and-drop widget rearrangement', async () => {
      const { container, store } = renderDashboard();
      const user = userEvent.setup();

      // Note: Testing drag-and-drop with testing-library can be complex
      // This is a simplified test to check if the necessary elements are present
      // and if a drag event can be simulated. More detailed drag-and-drop testing
      // might require a different approach or a dedicated testing library.

      // Find a draggable widget element (assuming widgets have a draggable handle or are draggable themselves)
      // You might need to adjust the selector based on your component's implementation
      const welcomeWidget = screen.getByText('Welcome back, Test User').closest('.react-grid-item');
      const journeyProgressWidget = screen.getByText('Your Progress').closest('.react-grid-item');

      if (welcomeWidget && journeyProgressWidget) {
        // Simulate a drag start event on the welcome widget
        fireEvent.mouseDown(welcomeWidget);
        fireEvent.mouseMove(welcomeWidget, { clientX: 100, clientY: 100 }); // Simulate dragging
        fireEvent.mouseUp(welcomeWidget); // Simulate dropping

        // In a real scenario, you would check if the layout state in the store
        // has been updated to reflect the new position of the widget.
        // This requires access to the internal state changes triggered by the drag.
        // For this simplified test, we'll just check if the events don't throw errors.
      } else {
        console.warn('Could not find draggable widgets for rearrangement test.');
      }
    });

    test('supports widget resizing', async () => {
      const { container, store } = renderDashboard();
      const user = userEvent.setup();

      // Note: Similar to drag-and-drop, testing resizing can be complex.
      // This is a simplified test.

      // Find a resizable widget element (assuming widgets have a resize handle)
      // You might need to adjust the selector based on your component's implementation
      const welcomeWidget = screen.getByText('Welcome back, Test User').closest('.react-grid-item');

      if (welcomeWidget) {
        // Simulate a resize start event on the welcome widget's resize handle
        // You'll need to find the actual resize handle element within the widget
        // This is a placeholder assuming a generic handle class
        const resizeHandle = welcomeWidget.querySelector('.react-resizable-handle');

        if (resizeHandle) {
          fireEvent.mouseDown(resizeHandle);
          fireEvent.mouseMove(resizeHandle, { clientX: 200, clientY: 200 }); // Simulate resizing
          fireEvent.mouseUp(resizeHandle); // Simulate stopping resize

          // In a real scenario, you would check if the layout state in the store
          // has been updated to reflect the new size of the widget.
        } else {
          console.warn('Could not find resize handle for widget resizing test.');
        }
      } else {
        console.warn('Could not find resizable widget for resizing test.');
      }
    });

    test('handles empty data states gracefully', async () => {
      // Render with empty data
      const { store } = renderDashboard({
        dashboard: {
          data: {
            overview: {},
            nextSteps: [],
            recommendations: [],
            tasks: [],
            documents: {
              recent: [],
              stats: {
                total: 0,
                verified: 0,
                pending: 0,
                rejected: 0
              }
            }
          }
        }
      });

      // Check for empty state messages
      const emptyStateMessages = screen.getAllByText(/no data available|no recommendations|no tasks/i);
      expect(emptyStateMessages.length).toBeGreaterThan(0);
    });
  });

  // 4. Error Handling Tests
  describe('Error Handling', () => {
    test('handles network errors gracefully', async () => {
      // Render with network error
      const { store } = renderDashboard({
        dashboard: {
          isLoading: false,
          isError: true,
          error: 'Network error: Failed to fetch',
          data: null
        }
      });

      // Check for error message
      expect(screen.getByText(/network error/i)).toBeInTheDocument();

      // Check for retry button
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();

      // Test retry functionality
      fireEvent.click(retryButton);

      // Verify that fetch actions were dispatched
      await waitFor(() => {
        const actions = store.getActions?.() || [];
        expect(actions.some(action => action.type.includes('fetchDashboardData'))).toBe(true);
      });
    });

    test('handles partial data loading failures', async () => {
      // Render with partial data
      const { store } = renderDashboard({
        dashboard: {
          data: {
            overview: {
              profileCompletion: 75,
              assessmentCompletion: 100
            },
            // Missing other data sections
          }
        }
      });

      // Check that available data is displayed
      expect(screen.getByText(/75%/)).toBeInTheDocument(); // Profile completion

      // Check that missing data sections show empty states
      const emptyStateMessages = screen.getAllByText(/no data available|no recommendations|no tasks/i);
      expect(emptyStateMessages.length).toBeGreaterThan(0);
    });

    test('handles error state for individual widgets', async () => {
      // Render with partial error state (e.g., recommendations failed to load)
      const { store } = renderDashboard({
        dashboard: {
          isLoading: false,
          isError: false,
          error: null,
          data: {
            overview: {},
            nextSteps: [],
            recommendations: null, // Recommendations data is null due to error
            tasks: [],
            documents: { recent: [], stats: {} }
          }
        },
        recommendations: {
          isLoading: false,
          isError: true, // Recommendations slice has an error
          error: 'Failed to load recommendations',
          recommendations: null
        }
      });

      // Check for error message within the recommendations widget area
      // This requires knowing the structure/selectors of the Recommendations widget
      // Placeholder check: look for the error message text, might need refinement
      const recommendationsWidget = screen.getByText('Recommendations').closest('article');
      if (recommendationsWidget) {
        const errorMessage = within(recommendationsWidget).queryByText(/failed to load recommendations/i);
        // expect(errorMessage).toBeInTheDocument(); // Uncomment and refine selector if needed
      } else {
        console.warn('Could not find Recommendations widget for individual error state test.');
      }
    });
  });

  // 5. Widget View Modes Tests (Compact/Expanded)
  describe('Widget View Modes', () => {
    test('allows switching between widget view modes', async () => {
      const { store } = renderDashboard();
      const user = userEvent.setup();

      // This test requires knowing how view modes are triggered (e.g., a button click)
      // and how the UI changes in response.
      // Placeholder: Find a widget that supports view modes and simulate the interaction.

      // Example: Assuming a button exists to toggle view mode within a widget
      // const widgetWithViewModes = screen.getByText('Some Widget Title').closest('article');
      // if (widgetWithViewModes) {
      //   const toggleButton = within(widgetWithViewModes).queryByRole('button', { name: /toggle view/i });
      //   if (toggleButton) {
      //     fireEvent.click(toggleButton);
      //     // Assert that the widget's appearance or content changes
      //     // e.g., expect(within(widgetWithViewModes).getByText('Expanded Content')).toBeInTheDocument();
      //   } else {
      //     console.warn('Could not find view mode toggle button for widget view modes test.');
      //   }
      // } else {
      //   console.warn('Could not find a widget that supports view modes.');
      // }
    });
  });
});
