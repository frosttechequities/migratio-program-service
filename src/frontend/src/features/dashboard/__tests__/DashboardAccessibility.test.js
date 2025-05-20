import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
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

// Extend Jest matchers
expect.extend(toHaveNoViolations);

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

describe('Dashboard Accessibility Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<TestApp />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Run axe accessibility tests
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading structure', async () => {
    render(<TestApp />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Check for proper heading structure
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);

    // Check that the first heading is a higher level than subsequent headings
    const mainHeading = headings[0];
    expect(mainHeading).toHaveAttribute('aria-level', '2');
  });

  it('should have proper button labels', async () => {
    render(<TestApp />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Check that all buttons have accessible names
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });

  it('should have proper link labels', async () => {
    render(<TestApp />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Check that all links have accessible names
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAccessibleName();
    });
  });

  it('should have proper image alt text', async () => {
    render(<TestApp />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Check that all images have alt text
    const images = screen.getAllByRole('img');
    images.forEach(image => {
      expect(image).toHaveAttribute('alt');
    });
  });
});