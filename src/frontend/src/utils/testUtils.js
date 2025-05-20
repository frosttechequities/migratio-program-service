import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Import all reducers
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import uiReducer from '../features/ui/uiSlice';
import personalizationReducer from '../features/personalization/personalizationSlice';
import resourcesReducer from '../features/resources/resourceSlice';
import recommendationsReducer from '../features/recommendations/recommendationSlice';

// Create a theme for testing
const theme = createTheme();

/**
 * Create a testing store with imported reducers, initial state, and middleware
 * @param {Object} preloadedState - Initial state for the store
 * @return {Store} Redux store
 */
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      profile: profileReducer,
      dashboard: dashboardReducer,
      ui: uiReducer,
      personalization: personalizationReducer,
      resources: resourcesReducer,
      recommendations: recommendationsReducer,
    },
    preloadedState,
  });
};

/**
 * Testing utility to render a component with Redux, Router, and Theme providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Additional options
 * @param {Object} options.preloadedState - Initial state for the Redux store
 * @param {Store} options.store - Redux store to use (will create one if not provided)
 * @return {Object} Object containing the store and all of RTL's query functions
 */
export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  };

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

/**
 * Create a default authenticated state for testing
 * @return {Object} Default authenticated state
 */
export const createAuthenticatedState = () => ({
  auth: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    },
    isAuthenticated: true,
  },
  profile: {
    profile: {
      id: 'profile1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      completedSteps: ['personal', 'education'],
    },
    isLoading: false,
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
        tasksCompleted: 8,
      },
      nextSteps: [
        { id: 1, title: 'Complete profile', priority: 'high' },
        { id: 2, title: 'Take eligibility assessment', priority: 'medium' },
      ],
      recommendations: [
        { id: 1, title: 'Express Entry', country: 'Canada', score: 85 },
        { id: 2, title: 'Skilled Worker Program', country: 'Australia', score: 78 },
      ],
      tasks: [
        { id: 1, title: 'Submit application', dueDate: '2023-12-31', status: 'pending' },
        { id: 2, title: 'Upload passport', dueDate: '2023-12-15', status: 'completed' },
      ],
      documents: {
        recent: [
          { id: 1, name: 'Passport.pdf', uploadDate: '2023-11-01' },
          { id: 2, name: 'Resume.pdf', uploadDate: '2023-11-05' },
        ],
        stats: {
          total: 10,
          verified: 5,
          pending: 3,
          rejected: 2,
        },
      },
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
      ],
      widgetOrder: [
        'welcome',
        'journeyProgress',
        'recommendations',
        'tasks',
        'documents',
        'resources',
      ],
    },
  },
  ui: {
    message: null,
    sidebarOpen: false,
  },
  personalization: {
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      language: 'en',
    },
    savedLayouts: [],
  },
  resources: {
    resources: [],
    currentResource: null,
    isLoading: false,
    error: null,
  },
  recommendations: {
    recommendations: [],
    simulationResults: null,
    isLoading: false,
    isSimulationLoading: false,
    error: null,
  },
});
