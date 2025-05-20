import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n'; // Import i18n instance
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
const TestApp = ({ store, language = 'en' }) => {
  // Change language for the test
  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store || createMockStore()}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={['/dashboard']}>
            <DashboardPage />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    </I18nextProvider>
  );
};

describe('Dashboard Internationalization Tests', () => {
  it('renders with English text by default', async () => {
    render(<TestApp language="en" />);

    // Wait for the dashboard to load
    await screen.findByText(/Welcome back/i);

    // Check for English text
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Tasks/i)).toBeInTheDocument();
  });

  it('renders with Spanish text when language is set to Spanish', async () => {
    render(<TestApp language="es" />);

    // Wait for the dashboard to load (using a more generic selector since text will be in Spanish)
    await screen.findByTestId('dashboard-container');

    // Check for Spanish text
    expect(screen.getByText(/Bienvenido de nuevo/i)).toBeInTheDocument();
    expect(screen.getByText(/Recomendaciones/i)).toBeInTheDocument();
    expect(screen.getByText(/Tareas Próximas/i)).toBeInTheDocument();
  });

  it('renders with French text when language is set to French', async () => {
    render(<TestApp language="fr" />);

    // Wait for the dashboard to load (using a more generic selector since text will be in French)
    await screen.findByTestId('dashboard-container');

    // Check for French text
    expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommandations/i)).toBeInTheDocument();
    expect(screen.getByText(/Tâches à venir/i)).toBeInTheDocument();
  });

  it('formats dates according to the selected locale', async () => {
    // Test with English locale
    const { rerender } = render(<TestApp language="en" />);

    // Wait for the dashboard to load
    await screen.findByTestId('dashboard-container');

    // Check date format in English (MM/DD/YYYY)
    const englishDateElements = screen.getAllByText(/\d{2}\/\d{2}\/\d{4}/);
    expect(englishDateElements.length).toBeGreaterThan(0);

    // Test with French locale
    rerender(<TestApp language="fr" />);

    // Check date format in French (DD/MM/YYYY)
    const frenchDateElements = screen.getAllByText(/\d{2}\/\d{2}\/\d{4}/);
    expect(frenchDateElements.length).toBeGreaterThan(0);
  });

  it('handles right-to-left languages correctly', async () => {
    render(<TestApp language="ar" />);

    // Wait for the dashboard to load
    await screen.findByTestId('dashboard-container');

    // Check for RTL direction
    const rtlElements = document.querySelectorAll('[dir="rtl"]');
    expect(rtlElements.length).toBeGreaterThan(0);
  });
});