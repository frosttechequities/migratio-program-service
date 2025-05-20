import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import DashboardCustomizer from '../DashboardCustomizer';
import dashboardReducer, { updateLayoutPreference } from '../../../dashboard/dashboardSlice';
import personalizationReducer, { saveLayout, savePreferences } from '../../personalizationSlice';

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

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      personalization: personalizationReducer
    },
    preloadedState: {
      dashboard: {
        preferences: {
          layout: 'default',
          visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents'],
          layoutConfig: {
            lg: [
              { i: 'welcome', x: 0, y: 0, w: 6, h: 2 },
              { i: 'journey', x: 6, y: 0, w: 6, h: 2 },
              { i: 'recommendations', x: 0, y: 2, w: 12, h: 2 },
              { i: 'tasks', x: 0, y: 4, w: 6, h: 2 },
              { i: 'documents', x: 6, y: 4, w: 6, h: 2 }
            ]
          }
        },
        ...initialState.dashboard
      },
      personalization: {
        layouts: {
          default: {
            name: 'Default Layout',
            config: {
              lg: [
                { i: 'welcome', x: 0, y: 0, w: 6, h: 2 },
                { i: 'journey', x: 6, y: 0, w: 6, h: 2 },
                { i: 'recommendations', x: 0, y: 2, w: 12, h: 2 },
                { i: 'tasks', x: 0, y: 4, w: 6, h: 2 },
                { i: 'documents', x: 6, y: 4, w: 6, h: 2 }
              ]
            }
          },
          compact: {
            name: 'Compact Layout',
            config: {
              lg: [
                { i: 'welcome', x: 0, y: 0, w: 4, h: 2 },
                { i: 'journey', x: 4, y: 0, w: 4, h: 2 },
                { i: 'recommendations', x: 8, y: 0, w: 4, h: 2 },
                { i: 'tasks', x: 0, y: 2, w: 6, h: 2 },
                { i: 'documents', x: 6, y: 2, w: 6, h: 2 }
              ]
            }
          }
        },
        preferences: {
          theme: 'light',
          fontSize: 'medium',
          density: 'comfortable'
        },
        ...initialState.personalization
      }
    }
  });
};

// Mock dispatch function
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn()
}));

// Mock widget definitions
const mockWidgetDefinitions = [
  { id: 'welcome', title: 'Welcome', description: 'Welcome message and quick links' },
  { id: 'journey', title: 'Journey Progress', description: 'Track your immigration journey progress' },
  { id: 'recommendations', title: 'Recommendations', description: 'Personalized recommendations' },
  { id: 'tasks', title: 'Upcoming Tasks', description: 'Tasks and deadlines' },
  { id: 'documents', title: 'Document Center', description: 'Manage your documents' },
  { id: 'resources', title: 'Resources', description: 'Helpful resources and guides' },
  { id: 'opportunities', title: 'Global Opportunities', description: 'Job and education opportunities' }
];

describe('DashboardCustomizer', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders customizer with all sections', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardCustomizer widgetDefinitions={mockWidgetDefinitions} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Verify all sections are rendered
    expect(screen.getByText('Dashboard Customization')).toBeInTheDocument();
    expect(screen.getByText('Layout Options')).toBeInTheDocument();
    expect(screen.getByText('Widget Visibility')).toBeInTheDocument();
    expect(screen.getByText('Appearance Settings')).toBeInTheDocument();
    expect(screen.getByText('Saved Views')).toBeInTheDocument();
  });
  
  test('toggles widget visibility when checkbox is clicked', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardCustomizer widgetDefinitions={mockWidgetDefinitions} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Find the Welcome widget checkbox
    const welcomeCheckbox = screen.getByRole('checkbox', { name: /welcome/i });
    
    // Verify it's checked
    expect(welcomeCheckbox).toBeChecked();
    
    // Click to uncheck
    fireEvent.click(welcomeCheckbox);
    
    // Verify dispatch was called with updateLayoutPreference
    expect(mockDispatch).toHaveBeenCalledWith(
      updateLayoutPreference({
        visibleWidgets: ['journey', 'recommendations', 'tasks', 'documents']
      })
    );
  });
  
  test('changes layout when layout option is selected', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardCustomizer widgetDefinitions={mockWidgetDefinitions} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Find the Compact layout option
    const compactLayout = screen.getByRole('button', { name: /compact layout/i });
    
    // Click to select
    fireEvent.click(compactLayout);
    
    // Verify dispatch was called with updateLayoutPreference
    expect(mockDispatch).toHaveBeenCalledWith(
      updateLayoutPreference({
        layout: 'compact',
        layoutConfig: {
          lg: [
            { i: 'welcome', x: 0, y: 0, w: 4, h: 2 },
            { i: 'journey', x: 4, y: 0, w: 4, h: 2 },
            { i: 'recommendations', x: 8, y: 0, w: 4, h: 2 },
            { i: 'tasks', x: 0, y: 2, w: 6, h: 2 },
            { i: 'documents', x: 6, y: 2, w: 6, h: 2 }
          ]
        }
      })
    );
  });
  
  test('changes theme when theme option is selected', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardCustomizer widgetDefinitions={mockWidgetDefinitions} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Find the Dark theme option
    const darkTheme = screen.getByRole('button', { name: /dark/i });
    
    // Click to select
    fireEvent.click(darkTheme);
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        theme: 'dark'
      })
    );
  });
  
  test('changes font size when font size option is selected', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardCustomizer widgetDefinitions={mockWidgetDefinitions} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Find the Large font size option
    const largeFont = screen.getByRole('button', { name: /large/i });
    
    // Click to select
    fireEvent.click(largeFont);
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        fontSize: 'large'
      })
    );
  });
  
  test('changes density when density option is selected', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardCustomizer widgetDefinitions={mockWidgetDefinitions} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Find the Compact density option
    const compactDensity = screen.getByRole('button', { name: /compact density/i });
    
    // Click to select
    fireEvent.click(compactDensity);
    
    // Verify dispatch was called with savePreferences
    expect(mockDispatch).toHaveBeenCalledWith(
      savePreferences({
        density: 'compact'
      })
    );
  });
  
  test('saves current layout as a new view', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardCustomizer widgetDefinitions={mockWidgetDefinitions} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Find the Save Current Layout button
    const saveButton = screen.getByRole('button', { name: /save current layout/i });
    
    // Click to open dialog
    fireEvent.click(saveButton);
    
    // Verify dialog is open
    expect(screen.getByText('Save Current Layout as View')).toBeInTheDocument();
    
    // Enter a name for the new view
    fireEvent.change(screen.getByLabelText('View Name'), {
      target: { value: 'My Custom View' }
    });
    
    // Click Save button
    fireEvent.click(screen.getByRole('button', { name: /save$/i }));
    
    // Verify dispatch was called with saveLayout
    expect(mockDispatch).toHaveBeenCalledWith(
      saveLayout({
        name: 'My Custom View',
        config: {
          lg: [
            { i: 'welcome', x: 0, y: 0, w: 6, h: 2 },
            { i: 'journey', x: 6, y: 0, w: 6, h: 2 },
            { i: 'recommendations', x: 0, y: 2, w: 12, h: 2 },
            { i: 'tasks', x: 0, y: 4, w: 6, h: 2 },
            { i: 'documents', x: 6, y: 4, w: 6, h: 2 }
          ]
        },
        visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents']
      })
    );
  });
  
  test('resets to default layout when reset button is clicked', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore({
        dashboard: {
          preferences: {
            layout: 'compact',
            visibleWidgets: ['welcome', 'journey']
          }
        }
      })}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <DashboardCustomizer widgetDefinitions={mockWidgetDefinitions} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
    
    // Find the Reset to Default button
    const resetButton = screen.getByRole('button', { name: /reset to default/i });
    
    // Click to reset
    fireEvent.click(resetButton);
    
    // Verify dialog is open
    expect(screen.getByText('Reset to Default Layout?')).toBeInTheDocument();
    
    // Click Confirm button
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    
    // Verify dispatch was called with updateLayoutPreference
    expect(mockDispatch).toHaveBeenCalledWith(
      updateLayoutPreference({
        layout: 'default',
        visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents'],
        layoutConfig: {
          lg: [
            { i: 'welcome', x: 0, y: 0, w: 6, h: 2 },
            { i: 'journey', x: 6, y: 0, w: 6, h: 2 },
            { i: 'recommendations', x: 0, y: 2, w: 12, h: 2 },
            { i: 'tasks', x: 0, y: 4, w: 6, h: 2 },
            { i: 'documents', x: 6, y: 4, w: 6, h: 2 }
          ]
        }
      })
    );
  });
});
