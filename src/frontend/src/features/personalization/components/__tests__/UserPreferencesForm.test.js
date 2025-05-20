import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import UserPreferencesForm from '../UserPreferencesForm';
import personalizationReducer, { savePreferences } from '../../personalizationSlice';

// Create a theme for testing
const theme = createTheme();

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      personalization: personalizationReducer
    },
    preloadedState: {
      personalization: {
        preferences: {
          theme: 'light',
          fontSize: 'medium',
          density: 'comfortable',
          notifications: {
            email: true,
            push: true,
            inApp: true
          },
          language: 'en',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          ...initialState.preferences
        },
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
        ...initialState
      }
    }
  });
};

// Mock dispatch function
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn()
}));

describe('UserPreferencesForm', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders all preference sections', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify all sections are rendered
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Regional Settings')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
  });
  
  test('displays current preferences', () => {
    render(
      <Provider store={createMockStore({
        preferences: {
          theme: 'dark',
          fontSize: 'large',
          density: 'compact',
          notifications: {
            email: false,
            push: true,
            inApp: false
          },
          language: 'fr',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h'
        }
      })}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify theme selection
    expect(screen.getByRole('button', { name: /dark/i })).toHaveAttribute('aria-pressed', 'true');
    
    // Verify font size selection
    expect(screen.getByRole('button', { name: /large/i })).toHaveAttribute('aria-pressed', 'true');
    
    // Verify density selection
    expect(screen.getByRole('button', { name: /compact/i })).toHaveAttribute('aria-pressed', 'true');
    
    // Verify notification toggles
    expect(screen.getByRole('checkbox', { name: /email notifications/i })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /push notifications/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /in-app notifications/i })).not.toBeChecked();
    
    // Verify language selection
    expect(screen.getByRole('button', { name: /français/i })).toBeInTheDocument();
    
    // Verify date format selection
    expect(screen.getByRole('button', { name: /dd\/mm\/yyyy/i })).toHaveAttribute('aria-pressed', 'true');
    
    // Verify time format selection
    expect(screen.getByRole('button', { name: /24-hour/i })).toHaveAttribute('aria-pressed', 'true');
  });
  
  test('updates theme preference when theme button is clicked', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Click dark theme button
    fireEvent.click(screen.getByRole('button', { name: /dark/i }));
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        theme: 'dark'
      })
    );
  });
  
  test('updates font size preference when font size button is clicked', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Click large font size button
    fireEvent.click(screen.getByRole('button', { name: /large/i }));
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        fontSize: 'large'
      })
    );
  });
  
  test('updates density preference when density button is clicked', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Click compact density button
    fireEvent.click(screen.getByRole('button', { name: /compact/i }));
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        density: 'compact'
      })
    );
  });
  
  test('updates notification preferences when toggles are clicked', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Toggle email notifications off
    fireEvent.click(screen.getByRole('checkbox', { name: /email notifications/i }));
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        notifications: {
          email: false,
          push: true,
          inApp: true
        }
      })
    );
    
    // Reset mock
    mockDispatch.mockClear();
    
    // Toggle push notifications off
    fireEvent.click(screen.getByRole('checkbox', { name: /push notifications/i }));
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        notifications: {
          email: true,
          push: false,
          inApp: true
        }
      })
    );
    
    // Reset mock
    mockDispatch.mockClear();
    
    // Toggle in-app notifications off
    fireEvent.click(screen.getByRole('checkbox', { name: /in-app notifications/i }));
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        notifications: {
          email: true,
          push: true,
          inApp: false
        }
      })
    );
  });
  
  test('updates language preference when language is changed', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Open language dropdown
    fireEvent.mouseDown(screen.getByRole('button', { name: /english/i }));
    
    // Select French
    fireEvent.click(screen.getByText('Français'));
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        language: 'fr'
      })
    );
  });
  
  test('updates date format preference when date format button is clicked', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Click DD/MM/YYYY date format button
    fireEvent.click(screen.getByRole('button', { name: /dd\/mm\/yyyy/i }));
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        dateFormat: 'DD/MM/YYYY'
      })
    );
  });
  
  test('updates time format preference when time format button is clicked', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Click 24-hour time format button
    fireEvent.click(screen.getByRole('button', { name: /24-hour/i }));
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        timeFormat: '24h'
      })
    );
  });
  
  test('shows loading state when isLoading is true', () => {
    render(
      <Provider store={createMockStore({
        isLoading: true
      })}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify loading indicator is displayed
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Verify form controls are disabled
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
  
  test('shows success message when isSuccess is true', async () => {
    render(
      <Provider store={createMockStore({
        isSuccess: true
      })}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify success message is displayed
    expect(screen.getByText('Preferences saved successfully!')).toBeInTheDocument();
  });
  
  test('shows error message when isError is true', async () => {
    render(
      <Provider store={createMockStore({
        isError: true,
        error: 'Failed to save preferences'
      })}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify error message is displayed
    expect(screen.getByText('Error: Failed to save preferences')).toBeInTheDocument();
  });
  
  test('resets to default preferences when reset button is clicked', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore({
        preferences: {
          theme: 'dark',
          fontSize: 'large',
          density: 'compact'
        }
      })}>
        <ThemeProvider theme={theme}>
          <UserPreferencesForm />
        </ThemeProvider>
      </Provider>
    );
    
    // Click reset button
    fireEvent.click(screen.getByRole('button', { name: /reset to defaults/i }));
    
    // Verify confirmation dialog is shown
    expect(screen.getByText('Reset to Default Preferences?')).toBeInTheDocument();
    
    // Click confirm button
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        theme: 'light',
        fontSize: 'medium',
        density: 'comfortable',
        notifications: {
          email: true,
          push: true,
          inApp: true
        },
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      })
    );
  });
});
