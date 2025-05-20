import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import DashboardPage from '../../../pages/dashboard/DashboardPage';

// Import reducers
import dashboardReducer from '../dashboardSlice';
import authReducer from '../../auth/authSlice';
import uiReducer from '../../ui/uiSlice';
import profileReducer from '../../profile/profileSlice';

// Create a theme for testing
const theme = createTheme();

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      auth: authReducer,
      ui: uiReducer,
      profile: profileReducer
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
        }
      },
      auth: {
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user1',
          name: 'Test User',
          email: 'test@example.com',
          subscriptionTier: 'premium',
          subscriptionExpiry: '2024-12-31'
        }
      },
      profile: {
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        data: {
          personalInfo: {
            firstName: 'Test',
            lastName: 'User',
            dateOfBirth: '1990-01-01',
            nationality: 'United States',
            currentCountry: 'United States'
          }
        }
      }
    }
  });
};

// Test wrapper component
const TestApp = ({ store }) => (
  <Provider store={store || createMockStore()}>
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <DashboardPage />
      </MemoryRouter>
    </ThemeProvider>
  </Provider>
);

// Mock large data set
const createLargeDataSet = (count) => {
  const recommendations = [];
  const tasks = [];
  const documents = [];

  for (let i = 0; i < count; i++) {
    recommendations.push({
      id: `rec${i}`,
      title: `Recommendation ${i}`,
      description: `Description for recommendation ${i}`,
      priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low',
      link: `/tasks/recommendation-${i}`
    });

    tasks.push({
      id: `task${i}`,
      title: `Task ${i}`,
      dueDate: `2023-12-${(i % 30) + 1}`,
      status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'in_progress' : 'pending'
    });

    documents.push({
      id: `doc${i}`,
      name: `Document ${i}.pdf`,
      uploadDate: `2023-11-${(i % 30) + 1}`,
      status: i % 3 === 0 ? 'verified' : i % 3 === 1 ? 'pending' : 'rejected'
    });
  }

  return { recommendations, tasks, documents };
};

// Performance measurement helper
const measurePerformance = async (component, iterations = 5) => {
  const renderTimes = [];
  const updateTimes = [];

  // Measure initial render time
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const { rerender } = render(component);
    const end = performance.now();
    renderTimes.push(end - start);

    // Clean up
    rerender(<div />);
  }

  // Measure update time
  const { rerender } = render(component);

  // Wait for initial render to complete
  await screen.findByTestId('dashboard-container');

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    act(() => {
      rerender(component);
    });
    const end = performance.now();
    updateTimes.push(end - start);
  }

  return {
    averageRenderTime: renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length,
    averageUpdateTime: updateTimes.reduce((a, b) => a + b, 0) / updateTimes.length
  };
};

describe('Dashboard Performance Tests', () => {
  // Set a timeout threshold for performance tests
  const RENDER_TIME_THRESHOLD = 200; // ms
  const UPDATE_TIME_THRESHOLD = 100; // ms

  it('renders dashboard with acceptable performance', async () => {
    const { averageRenderTime, averageUpdateTime } = await measurePerformance(<TestApp />);

    console.log(`Average render time: ${averageRenderTime.toFixed(2)}ms`);
    console.log(`Average update time: ${averageUpdateTime.toFixed(2)}ms`);

    expect(averageRenderTime).toBeLessThan(RENDER_TIME_THRESHOLD);
    expect(averageUpdateTime).toBeLessThan(UPDATE_TIME_THRESHOLD);
  });

  it('handles large data sets efficiently', async () => {
    // Create a store with large data sets
    const { recommendations, tasks, documents } = createLargeDataSet(100);

    const store = createMockStore({
      dashboard: {
        data: {
          recommendations,
          tasks,
          documents: {
            recent: documents,
            stats: {
              uploaded: documents.length,
              verified: documents.filter(d => d.status === 'verified').length,
              pending: documents.filter(d => d.status === 'pending').length,
              required: documents.length * 2
            }
          }
        }
      }
    });

    const { averageRenderTime, averageUpdateTime } = await measurePerformance(<TestApp store={store} />);

    console.log(`Average render time with large data: ${averageRenderTime.toFixed(2)}ms`);
    console.log(`Average update time with large data: ${averageUpdateTime.toFixed(2)}ms`);

    // Thresholds are higher for large data sets
    expect(averageRenderTime).toBeLessThan(RENDER_TIME_THRESHOLD * 2);
    expect(averageUpdateTime).toBeLessThan(UPDATE_TIME_THRESHOLD * 2);
  });

  it('maintains performance when all widgets are visible', async () => {
    // Create a store with all widgets visible
    const store = createMockStore({
      dashboard: {
        preferences: {
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
          ]
        }
      }
    });

    const { averageRenderTime, averageUpdateTime } = await measurePerformance(<TestApp store={store} />);

    console.log(`Average render time with all widgets: ${averageRenderTime.toFixed(2)}ms`);
    console.log(`Average update time with all widgets: ${averageUpdateTime.toFixed(2)}ms`);

    expect(averageRenderTime).toBeLessThan(RENDER_TIME_THRESHOLD * 1.5);
    expect(averageUpdateTime).toBeLessThan(UPDATE_TIME_THRESHOLD * 1.5);
  });
});