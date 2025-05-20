import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import DashboardPage from '../DashboardPage';
import dashboardReducer, { fetchDashboardData } from '../../../features/dashboard/dashboardSlice';
import profileReducer, { fetchUserProfile } from '../../../features/profile/profileSlice';
import authReducer from '../../../features/auth/authSlice';

// Create a theme for testing
const theme = createTheme();

// Mock the dashboard and profile services
jest.mock('../../../features/dashboard/dashboardService', () => ({
  getDashboardData: jest.fn()
}));

jest.mock('../../../features/profile/profileService', () => ({
  getUserProfile: jest.fn()
}));

// Mock the components to simplify testing
jest.mock('../../../features/dashboard/components/WelcomeWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="welcome-widget">Welcome Widget</div>
}));

jest.mock('../../../features/dashboard/components/JourneyProgressWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="journey-progress-widget">Journey Progress Widget</div>
}));

jest.mock('../../../features/dashboard/components/RecommendationSummaryWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="recommendation-summary-widget">Recommendation Summary Widget</div>
}));

jest.mock('../../../features/dashboard/components/UpcomingTasksWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="upcoming-tasks-widget">Upcoming Tasks Widget</div>
}));

jest.mock('../../../features/dashboard/components/DocumentCenterWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="document-center-widget">Document Center Widget</div>
}));

jest.mock('../../../features/dashboard/components/ResourceRecommendationsWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="resource-recommendations-widget">Resource Recommendations Widget</div>
}));

jest.mock('../../../features/dashboard/components/GlobalOpportunitiesWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="global-opportunities-widget">Global Opportunities Widget</div>
}));

jest.mock('../../../features/dashboard/components/SubscriptionStatusWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="subscription-status-widget">Subscription Status Widget</div>
}));

jest.mock('../../../features/profile/components/ReadinessChecklist', () => ({
  __esModule: true,
  default: () => <div data-testid="readiness-checklist">Readiness Checklist</div>
}));

jest.mock('../../../features/recommendations/components/DestinationSuggestionsWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="destination-suggestions-widget">Destination Suggestions Widget</div>
}));

jest.mock('../../../features/recommendations/components/ScenarioPlanner', () => ({
  __esModule: true,
  default: () => <div data-testid="scenario-planner">Scenario Planner</div>
}));

jest.mock('../../../features/recommendations/components/SuccessProbabilityWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="success-probability-widget">Success Probability Widget</div>
}));

jest.mock('../../../features/recommendations/components/ActionRecommendations', () => ({
  __esModule: true,
  default: () => <div data-testid="action-recommendations">Action Recommendations</div>
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

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      profile: profileReducer,
      auth: authReducer
    },
    preloadedState: {
      auth: {
        user: { id: 'user1', name: 'Test User', email: 'test@example.com', subscriptionTier: 'premium' },
        isAuthenticated: true,
        ...initialState.auth
      },
      dashboard: {
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        data: {
          overview: {
            profileCompletion: 75,
            assessmentCompletion: 100,
            currentStageIndex: 2
          },
          recommendations: [
            { id: 'rec1', title: 'Recommendation 1', description: 'Description 1' }
          ],
          tasks: [
            { id: 'task1', title: 'Task 1', dueDate: '2023-12-31', status: 'pending' }
          ],
          documents: {
            recent: [{ id: 'doc1', name: 'Document 1', type: 'pdf' }],
            stats: { total: 5, completed: 3 }
          },
          nextSteps: [{ id: 'step1', title: 'Next Step 1' }]
        },
        preferences: {
          layout: 'default',
          visibleWidgets: ['overview', 'nextSteps', 'upcomingDeadlines']
        },
        ...initialState.dashboard
      },
      profile: {
        profile: {
          id: 'profile1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          completedSteps: ['personal', 'education']
        },
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        ...initialState.profile
      }
    }
  });
};

// Mock dispatch function
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn()
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders dashboard with all widgets when authenticated', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify all widgets are rendered
    expect(screen.getByTestId('welcome-widget')).toBeInTheDocument();
    expect(screen.getByTestId('journey-progress-widget')).toBeInTheDocument();
    expect(screen.getByTestId('recommendation-summary-widget')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-tasks-widget')).toBeInTheDocument();
    expect(screen.getByTestId('document-center-widget')).toBeInTheDocument();
    expect(screen.getByTestId('resource-recommendations-widget')).toBeInTheDocument();
    expect(screen.getByTestId('global-opportunities-widget')).toBeInTheDocument();
    expect(screen.getByTestId('subscription-status-widget')).toBeInTheDocument();
    expect(screen.getByTestId('readiness-checklist')).toBeInTheDocument();
    expect(screen.getByTestId('destination-suggestions-widget')).toBeInTheDocument();
    expect(screen.getByTestId('success-probability-widget')).toBeInTheDocument();
    expect(screen.getByTestId('action-recommendations')).toBeInTheDocument();
    expect(screen.getByTestId('scenario-planner')).toBeInTheDocument();
  });
  
  test('renders loading skeletons when data is loading', () => {
    render(
      <Provider store={createMockStore({
        dashboard: { isLoading: true, data: null },
        profile: { isLoading: true, profile: null }
      })}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify skeletons are rendered
    const skeletons = screen.getAllByRole('progressbar');
    expect(skeletons.length).toBeGreaterThan(0);
    
    // Verify widgets are not rendered
    expect(screen.queryByTestId('welcome-widget')).not.toBeInTheDocument();
  });
  
  test('renders error message when there is an error', () => {
    render(
      <Provider store={createMockStore({
        dashboard: { isError: true, error: 'Failed to load dashboard data' }
      })}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify error message is rendered
    expect(screen.getByText('Error loading dashboard data: Failed to load dashboard data')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Unavailable')).toBeInTheDocument();
    
    // Verify retry button is rendered
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
  
  test('toggles widget visibility when customization panel is used', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Open customization panel
    fireEvent.click(screen.getByRole('button', { name: /quick settings/i }));
    
    // Verify panel is visible
    expect(screen.getByText('Show/Hide Widgets')).toBeInTheDocument();
    
    // Toggle a widget off
    const welcomeSwitch = screen.getByRole('checkbox', { name: /welcome/i });
    fireEvent.click(welcomeSwitch);
    
    // Verify localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith('widgetVisibility_welcome', 'false');
    
    // Verify widget is no longer visible
    expect(screen.queryByTestId('welcome-widget')).not.toBeInTheDocument();
  });
  
  test('fetches dashboard data and profile on mount when authenticated', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify dispatch was called with fetchDashboardData and fetchUserProfile
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // fetchDashboardData
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // fetchUserProfile
  });
  
  test('navigates to personalization page when advanced customization is clicked', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardPage />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Click advanced customization button
    fireEvent.click(screen.getByRole('button', { name: /advanced customization/i }));
    
    // Verify link has correct href
    expect(screen.getByRole('button', { name: /advanced customization/i })).toHaveAttribute('href', '/personalization');
  });
});
