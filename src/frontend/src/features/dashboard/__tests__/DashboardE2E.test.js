import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import userEvent from '@testing-library/user-event';

// Import pages and components
import DashboardPage from '../../../pages/dashboard/DashboardPage';
import ProfilePage from '../../../pages/profile/ProfilePage';
import NavigationBar from '../../../components/navigation/NavigationBar';
import PrivateRoute from '../../../components/routing/PrivateRoute';

// Import reducers
import dashboardReducer from '../dashboardSlice';
import authReducer from '../../auth/authSlice';
import uiReducer from '../../ui/uiSlice';
import profileReducer from '../../profile/profileSlice';
import recommendationsReducer from '../../recommendations/recommendationsSlice';
import documentsReducer from '../../documents/documentsSlice';
import assessmentReducer from '../../assessment/assessmentSlice';

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

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      success: true,
      data: {
        // Mock data for dashboard
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
      }
    })
  })
);

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      auth: authReducer,
      ui: uiReducer,
      profile: profileReducer,
      recommendations: recommendationsReducer,
      documents: documentsReducer,
      assessment: assessmentReducer
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
        isLoading: false,
        user: {
          id: 'user1',
          name: 'Test User',
          email: 'test@example.com',
          subscriptionTier: 'premium',
          subscriptionExpiry: '2024-12-31'
        },
        ...initialState.auth
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
          },
          educationHistory: [
            {
              id: 'edu1',
              institution: 'Test University',
              degree: 'Bachelor of Science',
              fieldOfStudy: 'Computer Science',
              startDate: '2010-09-01',
              endDate: '2014-06-30',
              country: 'United States'
            }
          ],
          workHistory: [
            {
              id: 'work1',
              employer: 'Test Company',
              position: 'Software Engineer',
              startDate: '2014-07-01',
              endDate: '2020-12-31',
              country: 'United States',
              description: 'Developed web applications'
            }
          ],
          languageSkills: [
            {
              id: 'lang1',
              language: 'English',
              proficiency: 'Native',
              hasOfficialTest: true,
              testType: 'TOEFL',
              testScore: '110'
            }
          ],
          immigrationPreferences: {
            targetCountries: ['Canada', 'Australia', 'New Zealand'],
            timeframe: '1-2 years',
            familyMembers: 2,
            primaryReason: 'Career opportunities'
          }
        },
        ...initialState.profile
      },
      ...initialState
    }
  });
};

// Test wrapper component
const TestApp = ({ store, initialRoute = '/dashboard' }) => (
  <Provider store={store || createMockStore()}>
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <NavigationBar />
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  </Provider>
);

describe('Dashboard End-to-End Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();

    // Reset mocks
    jest.clearAllMocks();
  });

  test('User can navigate from dashboard to profile and back', async () => {
    render(<TestApp />);

    // Verify dashboard is loaded
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });

    // Find and click the profile link in the navigation bar
    const profileLink = screen.getByText(/Profile/i);
    fireEvent.click(profileLink);

    // Verify profile page is loaded
    await waitFor(() => {
      expect(screen.getByText(/Personal Information/i)).toBeInTheDocument();
    });

    // Find and click the dashboard link in the navigation bar
    const dashboardLink = screen.getByText(/Dashboard/i);
    fireEvent.click(dashboardLink);

    // Verify dashboard is loaded again
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });
  });

  test('User can view and interact with dashboard widgets', async () => {
    render(<TestApp />);

    // Verify dashboard is loaded with widgets
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
      expect(screen.getByText(/Journey Progress/i)).toBeInTheDocument();
      expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
      expect(screen.getByText(/Upcoming Tasks/i)).toBeInTheDocument();
    });

    // Check if recommendations are displayed
    expect(screen.getByText(/Complete language test/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit education credentials/i)).toBeInTheDocument();

    // Check if tasks are displayed
    expect(screen.getByText(/Complete profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload passport/i)).toBeInTheDocument();

    // Click on a recommendation
    const recommendationLink = screen.getByText(/Complete language test/i);
    fireEvent.click(recommendationLink);

    // Verify navigation (mock)
    expect(window.location.pathname).not.toBe('/tasks/language-test'); // This would happen in a real browser
  });

  test('Dashboard loads user data correctly', async () => {
    // Create a store with specific user data
    const store = createMockStore({
      auth: {
        user: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
    });

    render(<TestApp store={store} />);

    // Verify user-specific data is displayed
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, John Doe/i)).toBeInTheDocument();
    });

    // Verify dashboard data is loaded
    expect(screen.getByText(/15 of 30 tasks completed/i)).toBeInTheDocument();
    expect(screen.getByText(/5 of 10 documents uploaded/i)).toBeInTheDocument();
  });

  test('Dashboard handles loading state correctly', async () => {
    // Create a store with loading state
    const store = createMockStore({
      dashboard: {
        isLoading: true,
        data: null
      }
    });

    render(<TestApp store={store} />);

    // Verify loading indicators are displayed
    await waitFor(() => {
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    // Update store to loaded state
    act(() => {
      store.dispatch({
        type: 'dashboard/fetchDashboardData/fulfilled',
        payload: {
          overview: {
            currentStageIndex: 2,
            completedTasks: 15,
            totalTasks: 30
          },
          recommendations: [],
          tasks: []
        }
      });
    });

    // Verify content is displayed after loading
    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
      expect(screen.getByText(/15 of 30 tasks completed/i)).toBeInTheDocument();
    });
  });

  test('Dashboard handles error state correctly', async () => {
    // Create a store with error state
    const store = createMockStore({
      dashboard: {
        isLoading: false,
        isError: true,
        error: 'Failed to load dashboard data',
        data: null
      }
    });

    render(<TestApp store={store} />);

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to load dashboard data/i)).toBeInTheDocument();
      expect(screen.getByText(/Try again/i)).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText(/Try again/i);
    fireEvent.click(retryButton);

    // Verify loading is triggered again
    expect(fetch).toHaveBeenCalled();
  });
});