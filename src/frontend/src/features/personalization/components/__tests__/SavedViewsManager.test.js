import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import SavedViewsManager from '../SavedViewsManager';
import dashboardReducer, { updateLayoutPreference } from '../../../dashboard/dashboardSlice';
import personalizationReducer, { saveLayout, deleteLayout } from '../../personalizationSlice';

// Create a theme for testing
const theme = createTheme();

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
            },
            visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents']
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
            },
            visibleWidgets: ['welcome', 'journey', 'recommendations', 'tasks', 'documents']
          },
          'my-custom-view': {
            name: 'My Custom View',
            config: {
              lg: [
                { i: 'welcome', x: 0, y: 0, w: 12, h: 2 },
                { i: 'recommendations', x: 0, y: 2, w: 12, h: 2 }
              ]
            },
            visibleWidgets: ['welcome', 'recommendations']
          }
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

describe('SavedViewsManager', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders all saved views', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify all saved views are rendered
    expect(screen.getByText('Default Layout')).toBeInTheDocument();
    expect(screen.getByText('Compact Layout')).toBeInTheDocument();
    expect(screen.getByText('My Custom View')).toBeInTheDocument();
  });
  
  test('highlights the currently selected view', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify default layout is selected
    const defaultLayout = screen.getByText('Default Layout').closest('li');
    expect(defaultLayout).toHaveClass('Mui-selected');
    
    // Verify other layouts are not selected
    const compactLayout = screen.getByText('Compact Layout').closest('li');
    expect(compactLayout).not.toHaveClass('Mui-selected');
    
    const customView = screen.getByText('My Custom View').closest('li');
    expect(customView).not.toHaveClass('Mui-selected');
  });
  
  test('applies a view when clicked', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager />
        </ThemeProvider>
      </Provider>
    );
    
    // Click My Custom View
    fireEvent.click(screen.getByText('My Custom View'));
    
    // Verify dispatch was called with updateLayoutPreference
    expect(mockDispatch).toHaveBeenCalledWith(
      updateLayoutPreference({
        layout: 'my-custom-view',
        visibleWidgets: ['welcome', 'recommendations'],
        layoutConfig: {
          lg: [
            { i: 'welcome', x: 0, y: 0, w: 12, h: 2 },
            { i: 'recommendations', x: 0, y: 2, w: 12, h: 2 }
          ]
        }
      })
    );
  });
  
  test('opens save dialog when save button is clicked', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager />
        </ThemeProvider>
      </Provider>
    );
    
    // Click Save Current View button
    fireEvent.click(screen.getByRole('button', { name: /save current view/i }));
    
    // Verify dialog is open
    expect(screen.getByText('Save Current Layout as View')).toBeInTheDocument();
    expect(screen.getByLabelText('View Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
  
  test('saves a new view when save dialog is submitted', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager />
        </ThemeProvider>
      </Provider>
    );
    
    // Click Save Current View button
    fireEvent.click(screen.getByRole('button', { name: /save current view/i }));
    
    // Enter a name for the new view
    fireEvent.change(screen.getByLabelText('View Name'), {
      target: { value: 'New Test View' }
    });
    
    // Click Save button
    fireEvent.click(screen.getByRole('button', { name: /save$/i }));
    
    // Verify dispatch was called with saveLayout
    expect(mockDispatch).toHaveBeenCalledWith(
      saveLayout({
        name: 'New Test View',
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
  
  test('validates view name in save dialog', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager />
        </ThemeProvider>
      </Provider>
    );
    
    // Click Save Current View button
    fireEvent.click(screen.getByRole('button', { name: /save current view/i }));
    
    // Try to save without entering a name
    fireEvent.click(screen.getByRole('button', { name: /save$/i }));
    
    // Verify validation error is shown
    expect(screen.getByText('View name is required')).toBeInTheDocument();
    
    // Enter a name that's too short
    fireEvent.change(screen.getByLabelText('View Name'), {
      target: { value: 'A' }
    });
    
    // Try to save
    fireEvent.click(screen.getByRole('button', { name: /save$/i }));
    
    // Verify validation error is shown
    expect(screen.getByText('View name must be at least 3 characters')).toBeInTheDocument();
    
    // Enter a name that already exists
    fireEvent.change(screen.getByLabelText('View Name'), {
      target: { value: 'Compact Layout' }
    });
    
    // Try to save
    fireEvent.click(screen.getByRole('button', { name: /save$/i }));
    
    // Verify validation error is shown
    expect(screen.getByText('A view with this name already exists')).toBeInTheDocument();
  });
  
  test('deletes a view when delete button is clicked', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager />
        </ThemeProvider>
      </Provider>
    );
    
    // Find the delete button for My Custom View
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    const customViewDeleteButton = deleteButtons[2]; // Third view in the list
    
    // Click delete button
    fireEvent.click(customViewDeleteButton);
    
    // Verify confirmation dialog is shown
    expect(screen.getByText('Delete View?')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete "My Custom View"?')).toBeInTheDocument();
    
    // Click confirm button
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    
    // Verify dispatch was called with deleteLayout
    expect(mockDispatch).toHaveBeenCalledWith(
      deleteLayout('my-custom-view')
    );
  });
  
  test('cannot delete default layouts', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager />
        </ThemeProvider>
      </Provider>
    );
    
    // Find all delete buttons
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    
    // Verify delete buttons for default layouts are disabled
    expect(deleteButtons[0]).toBeDisabled(); // Default Layout
    expect(deleteButtons[1]).toBeDisabled(); // Compact Layout
    
    // Verify delete button for custom view is enabled
    expect(deleteButtons[2]).not.toBeDisabled(); // My Custom View
  });
  
  test('renders empty state when no custom views exist', () => {
    render(
      <Provider store={createMockStore({
        personalization: {
          layouts: {
            default: {
              name: 'Default Layout',
              config: {}
            },
            compact: {
              name: 'Compact Layout',
              config: {}
            }
          }
        }
      })}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify empty state message is shown
    expect(screen.getByText('No custom views saved yet')).toBeInTheDocument();
    expect(screen.getByText('Save your current dashboard layout as a custom view to quickly switch between different layouts.')).toBeInTheDocument();
  });
  
  test('calls onViewApplied callback when a view is applied', () => {
    const mockOnViewApplied = jest.fn();
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager onViewApplied={mockOnViewApplied} />
        </ThemeProvider>
      </Provider>
    );
    
    // Click My Custom View
    fireEvent.click(screen.getByText('My Custom View'));
    
    // Verify callback was called
    expect(mockOnViewApplied).toHaveBeenCalledWith('my-custom-view');
  });
  
  test('renders in compact mode when specified', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <SavedViewsManager compact={true} />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify list is rendered in compact mode
    const list = screen.getByRole('list');
    expect(list).toHaveClass('MuiList-dense');
  });
});
