import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import LayoutOptions from '../LayoutOptions';
import dashboardReducer, { updateLayoutPreference } from '../../../dashboard/dashboardSlice';
import personalizationReducer from '../../personalizationSlice';

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
          ...initialState.dashboardPreferences
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
                { i: 'journey', x: 6, y: 0, w: 6, h: 2 }
              ]
            }
          },
          compact: {
            name: 'Compact Layout',
            config: {
              lg: [
                { i: 'welcome', x: 0, y: 0, w: 4, h: 2 },
                { i: 'journey', x: 4, y: 0, w: 4, h: 2 },
                { i: 'recommendations', x: 8, y: 0, w: 4, h: 2 }
              ]
            }
          },
          'focus-mode': {
            name: 'Focus Mode',
            config: {
              lg: [
                { i: 'welcome', x: 0, y: 0, w: 12, h: 2 }
              ]
            }
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

describe('LayoutOptions', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders all available layouts', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify all layout options are rendered
    expect(screen.getByText('Default Layout')).toBeInTheDocument();
    expect(screen.getByText('Compact Layout')).toBeInTheDocument();
    expect(screen.getByText('Focus Mode')).toBeInTheDocument();
  });
  
  test('highlights the currently selected layout', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify default layout is selected
    const defaultLayout = screen.getByText('Default Layout').closest('button');
    expect(defaultLayout).toHaveAttribute('aria-pressed', 'true');
    
    // Verify other layouts are not selected
    const compactLayout = screen.getByText('Compact Layout').closest('button');
    expect(compactLayout).toHaveAttribute('aria-pressed', 'false');
    
    const focusMode = screen.getByText('Focus Mode').closest('button');
    expect(focusMode).toHaveAttribute('aria-pressed', 'false');
  });
  
  test('updates layout preference when a layout is clicked', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions />
        </ThemeProvider>
      </Provider>
    );
    
    // Click compact layout
    fireEvent.click(screen.getByText('Compact Layout'));
    
    // Verify dispatch was called with updateLayoutPreference
    expect(mockDispatch).toHaveBeenCalledWith(
      updateLayoutPreference({
        layout: 'compact',
        layoutConfig: {
          lg: [
            { i: 'welcome', x: 0, y: 0, w: 4, h: 2 },
            { i: 'journey', x: 4, y: 0, w: 4, h: 2 },
            { i: 'recommendations', x: 8, y: 0, w: 4, h: 2 }
          ]
        }
      })
    );
  });
  
  test('renders layout previews', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify layout previews are rendered
    const layoutPreviews = screen.getAllByTestId('layout-preview');
    expect(layoutPreviews.length).toBe(3);
  });
  
  test('renders layout descriptions', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions showDescriptions={true} />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify layout descriptions are rendered
    expect(screen.getByText('Standard dashboard layout with balanced widget sizes')).toBeInTheDocument();
    expect(screen.getByText('Compact layout with smaller widgets to fit more on screen')).toBeInTheDocument();
    expect(screen.getByText('Minimalist layout focusing on essential information')).toBeInTheDocument();
  });
  
  test('renders in compact mode when specified', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions compact={true} />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify layout options are rendered in compact mode
    const layoutOptions = screen.getAllByRole('button');
    layoutOptions.forEach(option => {
      expect(option).toHaveClass('MuiToggleButton-sizeSmall');
    });
  });
  
  test('renders in vertical orientation when specified', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions orientation="vertical" />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify layout options are rendered in vertical orientation
    const layoutOptionsGroup = screen.getByRole('group');
    expect(layoutOptionsGroup).toHaveClass('MuiToggleButtonGroup-vertical');
  });
  
  test('calls onLayoutChange callback when layout is changed', () => {
    const mockOnLayoutChange = jest.fn();
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions onLayoutChange={mockOnLayoutChange} />
        </ThemeProvider>
      </Provider>
    );
    
    // Click compact layout
    fireEvent.click(screen.getByText('Compact Layout'));
    
    // Verify onLayoutChange callback was called
    expect(mockOnLayoutChange).toHaveBeenCalledWith('compact');
  });
  
  test('disables layout options when disabled prop is true', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions disabled={true} />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify layout options are disabled
    const layoutOptions = screen.getAllByRole('button');
    layoutOptions.forEach(option => {
      expect(option).toBeDisabled();
    });
  });
  
  test('renders only specified layouts when layouts prop is provided', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions layouts={['default', 'compact']} />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify only specified layouts are rendered
    expect(screen.getByText('Default Layout')).toBeInTheDocument();
    expect(screen.getByText('Compact Layout')).toBeInTheDocument();
    expect(screen.queryByText('Focus Mode')).not.toBeInTheDocument();
  });
  
  test('renders custom layout preview when renderPreview prop is provided', () => {
    const customRenderPreview = (layout) => (
      <div data-testid="custom-preview">{layout.name}</div>
    );
    
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <LayoutOptions renderPreview={customRenderPreview} />
        </ThemeProvider>
      </Provider>
    );
    
    // Verify custom previews are rendered
    const customPreviews = screen.getAllByTestId('custom-preview');
    expect(customPreviews.length).toBe(3);
    expect(customPreviews[0]).toHaveTextContent('Default Layout');
    expect(customPreviews[1]).toHaveTextContent('Compact Layout');
    expect(customPreviews[2]).toHaveTextContent('Focus Mode');
  });
});
