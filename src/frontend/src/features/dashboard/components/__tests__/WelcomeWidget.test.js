import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import WelcomeWidget from '../WelcomeWidget';
import authReducer from '../../../auth/authSlice';
import profileReducer from '../../../profile/profileSlice';
import dashboardReducer from '../../dashboardSlice';

// Create a theme for testing
const theme = createTheme();

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      profile: profileReducer,
      dashboard: dashboardReducer
    },
    preloadedState: {
      auth: {
        user: {
          id: 'user1',
          name: 'Test User',
          email: 'test@example.com'
        },
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
          ...initialState.profile
        },
        isLoading: false,
        ...initialState.profileState
      },
      dashboard: {
        data: {
          overview: {
            profileCompletion: 75,
            assessmentCompletion: 100,
            currentStageIndex: 2
          },
          nextSteps: [
            { id: 'step1', title: 'Complete your profile', path: '/profile' },
            { id: 'step2', title: 'Upload your documents', path: '/documents' },
            { id: 'step3', title: 'Take the assessment', path: '/assessment' }
          ],
          ...initialState.dashboardData
        },
        isLoading: false,
        ...initialState.dashboardState
      }
    }
  });
};

describe('WelcomeWidget', () => {
  test('renders welcome message with user name', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify welcome message is rendered
    expect(screen.getByText('Welcome back, Test!')).toBeInTheDocument();
  });
  
  test('renders profile completion progress', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify profile completion progress is rendered
    expect(screen.getByText('Profile Completion')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
  
  test('renders next steps', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify next steps are rendered
    expect(screen.getByText('Next Steps')).toBeInTheDocument();
    expect(screen.getByText('Complete your profile')).toBeInTheDocument();
    expect(screen.getByText('Upload your documents')).toBeInTheDocument();
    expect(screen.getByText('Take the assessment')).toBeInTheDocument();
  });
  
  test('renders quick links', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify quick links are rendered
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Roadmap')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
  });
  
  test('navigates to profile page when profile link is clicked', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Find profile link
    const profileLink = screen.getByText('My Profile');
    
    // Verify link has correct href
    expect(profileLink.closest('a')).toHaveAttribute('href', '/profile');
  });
  
  test('navigates to next step when next step is clicked', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Find next step link
    const nextStepLink = screen.getByText('Complete your profile');
    
    // Verify link has correct href
    expect(nextStepLink.closest('a')).toHaveAttribute('href', '/profile');
  });
  
  test('renders loading skeleton when data is loading', () => {
    render(
      <Provider store={createMockStore({
        dashboardState: { isLoading: true },
        profileState: { isLoading: true }
      })}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify skeletons are rendered
    const skeletons = screen.getAllByRole('progressbar');
    expect(skeletons.length).toBeGreaterThan(0);
    
    // Verify welcome message is not rendered
    expect(screen.queryByText(/Welcome back/)).not.toBeInTheDocument();
  });
  
  test('renders fallback message when user profile is not available', () => {
    render(
      <Provider store={createMockStore({
        profile: null
      })}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify fallback message is rendered
    expect(screen.getByText('Welcome to Migratio!')).toBeInTheDocument();
  });
  
  test('renders custom greeting when provided', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget greeting="Hello" />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify custom greeting is rendered
    expect(screen.getByText('Hello, Test!')).toBeInTheDocument();
  });
  
  test('renders custom next steps when provided', () => {
    const customNextSteps = [
      { id: 'custom1', title: 'Custom Step 1', path: '/custom1' },
      { id: 'custom2', title: 'Custom Step 2', path: '/custom2' }
    ];
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget nextSteps={customNextSteps} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify custom next steps are rendered
    expect(screen.getByText('Custom Step 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Step 2')).toBeInTheDocument();
    
    // Verify default next steps are not rendered
    expect(screen.queryByText('Complete your profile')).not.toBeInTheDocument();
  });
  
  test('renders custom quick links when provided', () => {
    const customQuickLinks = [
      { id: 'custom1', title: 'Custom Link 1', path: '/custom1' },
      { id: 'custom2', title: 'Custom Link 2', path: '/custom2' }
    ];
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget quickLinks={customQuickLinks} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify custom quick links are rendered
    expect(screen.getByText('Custom Link 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Link 2')).toBeInTheDocument();
    
    // Verify default quick links are not rendered
    expect(screen.queryByText('My Profile')).not.toBeInTheDocument();
  });
  
  test('renders with custom elevation when provided', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <WelcomeWidget elevation={0} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify paper has elevation 0
    const paper = screen.getByText('Welcome back, Test!').closest('.MuiPaper-root');
    expect(paper).toHaveClass('MuiPaper-elevation0');
  });
});
