import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';

import DashboardLayout from '../DashboardLayout';
import dashboardReducer, { updateLayoutPreference } from '../../dashboardSlice';
import personalizationReducer, { saveLayout } from '../../../personalization/personalizationSlice';

// Create a theme for testing
const theme = createTheme();

// Mock the react-grid-layout module
jest.mock('react-grid-layout', () => {
  // Import React inside the mock to avoid reference errors
  const React = require('react');

  return {
    __esModule: true,
    default: ({ children, onLayoutChange }) => {
      // Simulate layout change when rendered
      React.useEffect(() => {
        if (onLayoutChange) {
          onLayoutChange([
            { i: 'widget1', x: 0, y: 0, w: 6, h: 2 },
            { i: 'widget2', x: 6, y: 0, w: 6, h: 2 }
          ]);
        }
      }, [onLayoutChange]);

      return <div data-testid="grid-layout">{children}</div>;
    },
    Responsive: ({ children, onLayoutChange }) => {
      // Simulate layout change when rendered
      React.useEffect(() => {
        if (onLayoutChange) {
          onLayoutChange({
            lg: [
              { i: 'widget1', x: 0, y: 0, w: 6, h: 2 },
              { i: 'widget2', x: 6, y: 0, w: 6, h: 2 }
            ]
          });
        }
      }, [onLayoutChange]);

      return <div data-testid="responsive-grid-layout">{children}</div>;
    }
  };
});

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
          visibleWidgets: ['widget1', 'widget2', 'widget3'],
          layoutConfig: {
            lg: [
              { i: 'widget1', x: 0, y: 0, w: 6, h: 2 },
              { i: 'widget2', x: 6, y: 0, w: 6, h: 2 },
              { i: 'widget3', x: 0, y: 2, w: 12, h: 2 }
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
                { i: 'widget1', x: 0, y: 0, w: 6, h: 2 },
                { i: 'widget2', x: 6, y: 0, w: 6, h: 2 },
                { i: 'widget3', x: 0, y: 2, w: 12, h: 2 }
              ]
            }
          },
          compact: {
            name: 'Compact Layout',
            config: {
              lg: [
                { i: 'widget1', x: 0, y: 0, w: 4, h: 2 },
                { i: 'widget2', x: 4, y: 0, w: 4, h: 2 },
                { i: 'widget3', x: 8, y: 0, w: 4, h: 2 }
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

// Mock children components
const Widget1 = () => <div data-testid="widget1">Widget 1</div>;
const Widget2 = () => <div data-testid="widget2">Widget 2</div>;
const Widget3 = () => <div data-testid="widget3">Widget 3</div>;

describe('DashboardLayout', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();

    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders grid layout with widgets', () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <DashboardLayout>
            <Widget1 key="widget1" id="widget1" />
            <Widget2 key="widget2" id="widget2" />
            <Widget3 key="widget3" id="widget3" />
          </DashboardLayout>
        </ThemeProvider>
      </Provider>
    );

    // Verify grid layout is rendered
    expect(screen.getByTestId('responsive-grid-layout')).toBeInTheDocument();

    // Verify widgets are rendered
    expect(screen.getByTestId('widget1')).toBeInTheDocument();
    expect(screen.getByTestId('widget2')).toBeInTheDocument();
    expect(screen.getByTestId('widget3')).toBeInTheDocument();
  });

  test('only renders visible widgets', () => {
    render(
      <Provider store={createMockStore({
        dashboard: {
          preferences: {
            visibleWidgets: ['widget1', 'widget3'] // widget2 is hidden
          }
        }
      })}>
        <ThemeProvider theme={theme}>
          <DashboardLayout>
            <Widget1 key="widget1" id="widget1" />
            <Widget2 key="widget2" id="widget2" />
            <Widget3 key="widget3" id="widget3" />
          </DashboardLayout>
        </ThemeProvider>
      </Provider>
    );

    // Verify visible widgets are rendered
    expect(screen.getByTestId('widget1')).toBeInTheDocument();
    expect(screen.getByTestId('widget3')).toBeInTheDocument();

    // Verify hidden widget is not rendered
    expect(screen.queryByTestId('widget2')).not.toBeInTheDocument();
  });

  test('updates layout when grid layout changes', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <DashboardLayout>
            <Widget1 key="widget1" id="widget1" />
            <Widget2 key="widget2" id="widget2" />
          </DashboardLayout>
        </ThemeProvider>
      </Provider>
    );

    // Verify dispatch was called with updateLayoutPreference
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        updateLayoutPreference({
          layoutConfig: {
            lg: [
              { i: 'widget1', x: 0, y: 0, w: 6, h: 2 },
              { i: 'widget2', x: 6, y: 0, w: 6, h: 2 }
            ]
          }
        })
      );
    });
  });

  test('saves layout to localStorage', async () => {
    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <DashboardLayout>
            <Widget1 key="widget1" id="widget1" />
            <Widget2 key="widget2" id="widget2" />
          </DashboardLayout>
        </ThemeProvider>
      </Provider>
    );

    // Verify localStorage was updated
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'dashboardLayout',
        expect.any(String)
      );
    });
  });

  test('loads layout from localStorage on mount', () => {
    // Set up localStorage with a saved layout
    const savedLayout = {
      lg: [
        { i: 'widget1', x: 0, y: 0, w: 4, h: 2 },
        { i: 'widget2', x: 4, y: 0, w: 8, h: 2 }
      ]
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedLayout));

    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <DashboardLayout>
            <Widget1 key="widget1" id="widget1" />
            <Widget2 key="widget2" id="widget2" />
          </DashboardLayout>
        </ThemeProvider>
      </Provider>
    );

    // Verify localStorage was checked
    expect(localStorageMock.getItem).toHaveBeenCalledWith('dashboardLayout');

    // Verify dispatch was called with updateLayoutPreference
    expect(mockDispatch).toHaveBeenCalledWith(
      updateLayoutPreference({
        layoutConfig: savedLayout
      })
    );
  });

  test('applies different layout when layout preference changes', () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

    const { rerender } = render(
      <Provider store={createMockStore({
        dashboard: {
          preferences: {
            layout: 'default'
          }
        }
      })}>
        <ThemeProvider theme={theme}>
          <DashboardLayout>
            <Widget1 key="widget1" id="widget1" />
            <Widget2 key="widget2" id="widget2" />
            <Widget3 key="widget3" id="widget3" />
          </DashboardLayout>
        </ThemeProvider>
      </Provider>
    );

    // Change layout preference to 'compact'
    rerender(
      <Provider store={createMockStore({
        dashboard: {
          preferences: {
            layout: 'compact'
          }
        }
      })}>
        <ThemeProvider theme={theme}>
          <DashboardLayout>
            <Widget1 key="widget1" id="widget1" />
            <Widget2 key="widget2" id="widget2" />
            <Widget3 key="widget3" id="widget3" />
          </DashboardLayout>
        </ThemeProvider>
      </Provider>
    );

    // Verify dispatch was called with updateLayoutPreference
    expect(mockDispatch).toHaveBeenCalledWith(
      updateLayoutPreference({
        layoutConfig: {
          lg: [
            { i: 'widget1', x: 0, y: 0, w: 4, h: 2 },
            { i: 'widget2', x: 4, y: 0, w: 4, h: 2 },
            { i: 'widget3', x: 8, y: 0, w: 4, h: 2 }
          ]
        }
      })
    );
  });

  test('handles widget resizing', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);

    render(
      <Provider store={createMockStore()}>
        <ThemeProvider theme={theme}>
          <DashboardLayout>
            <Widget1 key="widget1" id="widget1" />
            <Widget2 key="widget2" id="widget2" />
          </DashboardLayout>
        </ThemeProvider>
      </Provider>
    );

    // Simulate resize event
    const layout = [
      { i: 'widget1', x: 0, y: 0, w: 8, h: 3 }, // Resized
      { i: 'widget2', x: 8, y: 0, w: 4, h: 2 }
    ];

    // Get the onLayoutChange prop from the mock and call it
    const gridLayout = screen.getByTestId('responsive-grid-layout');
    fireEvent(gridLayout, new CustomEvent('layoutchange', { detail: { layout } }));

    // Verify dispatch was called with updateLayoutPreference
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        updateLayoutPreference({
          layoutConfig: {
            lg: layout
          }
        })
      );
    });
  });
});
