import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';
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

// Create a real Redux store with all necessary reducer
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
    preloadedState: initialState
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

describe('Dashboard Loading and Initialization', () => {
  beforeEach(() => {
    jest.clearAllMock();
  });

  test('shows loading state for individual widget', async () => {
    const { store } = renderDashboard({
      dashboard: {
        isLoading: false,
        data: {
          overview: {},
          nextSteps: [],
          recommendation: [],
          task: [],
          document: { recent: [], stats: {} }
        }
      },
      recommendations: {
        isLoading: true,
        programRecommendations: null,
        error: null
      }
    });

    const recommendationWidget = await screen.findByRole('article', {
      name: /recommendation/i
    });
    const loadingIndicator = within(recommendationWidget).getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
  });

  // Other test case...
});
