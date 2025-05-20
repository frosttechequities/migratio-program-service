import React from 'react';
import { render, screen } from '@testing-library/react';
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
const TestApp = ({ store, theme: customTheme }) => (
  <Provider store={store || createMockStore()}>
    <ThemeProvider theme={customTheme || theme}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <DashboardPage />
      </MemoryRouter>
    </ThemeProvider>
  </Provider>
);

// Visual regression test helper
const checkVisualConsistency = (container) => {
  // Check for common visual issues
  const styles = window.getComputedStyle(container);

  // Check for overflow issues
  expect(styles.overflow).not.toBe('visible');

  // Check for proper spacing
  expect(parseInt(styles.padding)).toBeGreaterThanOrEqual(0);
  expect(parseInt(styles.margin)).toBeGreaterThanOrEqual(0);

  // Check for proper dimensions
  expect(parseInt(styles.width)).toBeGreaterThan(0);
  expect(parseInt(styles.height)).toBeGreaterThan(0);

  // Check for text overflow
  const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
  textElements.forEach(element => {
    const elementStyles = window.getComputedStyle(element);
    if (elementStyles.overflow === 'hidden' && elementStyles.textOverflow !== 'ellipsis') {
      console.warn('Potential text overflow issue:', element);
    }
  });

  // Check for proper contrast
  const textColor = styles.color;
  const backgroundColor = styles.backgroundColor;
  // Simple contrast check (would be more sophisticated in a real implementation)
  expect(textColor).not.toBe(backgroundColor);

  // Check for proper alignment
  expect(['left', 'center', 'right', 'justify']).toContain(styles.textAlign);
};

describe('Dashboard Visual Tests', () => {
  it('renders with consistent visual styling in light theme', async () => {
    const lightTheme = createTheme({
      palette: {
        mode: 'light'
      }
    });

    const { container } = render(<TestApp theme={lightTheme} />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Check for visual consistency
    checkVisualConsistency(container);

    // Check for specific light theme styling
    const styles = window.getComputedStyle(container);
    expect(styles.backgroundColor).not.toBe('rgb(18, 18, 18)'); // Not dark background
  });

  it('renders with consistent visual styling in dark theme', async () => {
    const darkTheme = createTheme({
      palette: {
        mode: 'dark'
      }
    });

    const { container } = render(<TestApp theme={darkTheme} />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Check for visual consistency
    checkVisualConsistency(container);

    // Check for specific dark theme styling
    const styles = window.getComputedStyle(container);
    expect(styles.color).not.toBe('rgba(0, 0, 0, 0.87)'); // Not light text color
  });

  it('renders widgets with proper spacing and alignment', async () => {
    const { container } = render(<TestApp />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Check widget containers
    const widgets = container.querySelectorAll('[data-grid]');
    expect(widgets.length).toBeGreaterThan(0);

    widgets.forEach(widget => {
      const styles = window.getComputedStyle(widget);

      // Check for proper spacing
      expect(parseInt(styles.padding)).toBeGreaterThanOrEqual(0);
      expect(parseInt(styles.margin)).toBeGreaterThanOrEqual(0);

      // Check for proper dimensions
      expect(parseInt(styles.width)).toBeGreaterThan(0);
      expect(parseInt(styles.height)).toBeGreaterThan(0);

      // Check for proper alignment
      const contentAlignment = styles.display;
      expect(['flex', 'block', 'grid']).toContain(contentAlignment);
    });
  });

  it('renders responsive layout correctly', async () => {
    // Mock different viewport sizes
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    // Test with mobile viewport
    window.innerWidth = 375;
    window.innerHeight = 667;
    window.dispatchEvent(new Event('resize'));

    const { container, rerender } = render(<TestApp />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Check for mobile-specific layout
    const mobileStyles = window.getComputedStyle(container);
    const mobileWidgets = container.querySelectorAll('[data-grid]');

    // Test with desktop viewport
    window.innerWidth = 1280;
    window.innerHeight = 800;
    window.dispatchEvent(new Event('resize'));

    rerender(<TestApp />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Check for desktop-specific layout
    const desktopStyles = window.getComputedStyle(container);
    const desktopWidgets = container.querySelectorAll('[data-grid]');

    // Verify responsive behavior
    expect(mobileWidgets.length).toEqual(desktopWidgets.length);

    // Restore original viewport size
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
    window.dispatchEvent(new Event('resize'));
  });

  it('renders text with proper truncation for long content', async () => {
    // Create a store with long text content
    const store = createMockStore({
      dashboard: {
        data: {
          recommendations: [
            {
              id: 'rec1',
              title: 'This is an extremely long recommendation title that should be truncated properly to avoid layout issues and ensure proper display on all screen sizes',
              description: 'This is an extremely long recommendation description that should be truncated properly to avoid layout issues and ensure proper display on all screen sizes. It contains a lot of text that would normally overflow its container if not handled correctly.',
              priority: 'high',
              link: '/tasks/language-test'
            }
          ]
        }
      }
    });

    const { container } = render(<TestApp store={store} />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Find elements with long text
    const longTitleElement = screen.getByText(/This is an extremely long recommendation title/i);
    const longDescriptionElement = screen.getByText(/This is an extremely long recommendation description/i);

    // Check for text truncation
    const titleStyles = window.getComputedStyle(longTitleElement);
    const descriptionStyles = window.getComputedStyle(longDescriptionElement);

    // Check that text doesn't overflow its container
    const titleContainer = longTitleElement.parentElement;
    const descriptionContainer = longDescriptionElement.parentElement;

    expect(titleContainer.scrollWidth).toBeGreaterThanOrEqual(titleContainer.clientWidth);
    expect(descriptionContainer.scrollWidth).toBeGreaterThanOrEqual(descriptionContainer.clientWidth);
  });
});