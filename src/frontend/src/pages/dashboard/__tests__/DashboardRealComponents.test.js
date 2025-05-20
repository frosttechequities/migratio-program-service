import React from 'react';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../../../mocks/server';
import { renderWithProviders, createAuthenticatedState } from '../../../utils/testUtils';
import DashboardPage from '../DashboardPage';

// Silence React 18 console warnings about act()
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('Dashboard Page with Real Components', () => {
  test('renders dashboard with all widgets when authenticated', async () => {
    // Render the dashboard with authenticated state
    renderWithProviders(<DashboardPage />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for the dashboard to load
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });

    // Check that all expected widgets are rendered
    expect(screen.getByText(/Journey Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Documents/i)).toBeInTheDocument();
    expect(screen.getByText(/Resources/i)).toBeInTheDocument();
  });

  test('displays loading state while fetching dashboard data', async () => {
    // Override the server response to delay
    server.use(
      rest.get('/api/dashboard', (req, res, ctx) => {
        return res(ctx.delay(500), ctx.json({}));
      })
    );

    // Render the dashboard with loading state
    renderWithProviders(<DashboardPage />, {
      preloadedState: {
        ...createAuthenticatedState(),
        dashboard: {
          ...createAuthenticatedState().dashboard,
          isLoading: true,
        },
      },
    });

    // Check that loading indicators are displayed
    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard-loading')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('displays error message when dashboard data fetch fails', async () => {
    // Override the server response to return an error
    server.use(
      rest.get('/api/dashboard', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Failed to load dashboard data' }));
      })
    );

    // Render the dashboard
    renderWithProviders(<DashboardPage />, {
      preloadedState: {
        ...createAuthenticatedState(),
        dashboard: {
          ...createAuthenticatedState().dashboard,
          isError: true,
          error: 'Failed to load dashboard data',
        },
      },
    });

    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to load dashboard data/i)).toBeInTheDocument();
    });
  });

  test('toggles widget visibility when user clicks hide/show button', async () => {
    // Setup user event
    const user = userEvent.setup();

    // Render the dashboard
    renderWithProviders(<DashboardPage />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for the dashboard to load
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });

    // Find a widget's hide button and click it
    const hideButtons = screen.getAllByLabelText(/hide widget/i);
    await act(async () => {
      await user.click(hideButtons[0]);
    });

    // Check that the widget is hidden
    await waitFor(() => {
      expect(screen.getByText(/Widget hidden/i)).toBeInTheDocument();
    });

    // Find the show button and click it
    const showButton = screen.getByText(/Show widget/i);
    await act(async () => {
      await user.click(showButton);
    });

    // Check that the widget is visible again
    await waitFor(() => {
      expect(screen.queryByText(/Widget hidden/i)).not.toBeInTheDocument();
    });
  });

  test('saves dashboard layout preferences when user customizes layout', async () => {
    // Setup user event
    const user = userEvent.setup();

    // Render the dashboard
    const { store } = renderWithProviders(<DashboardPage />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for the dashboard to load
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });

    // Find the customize layout button and click it
    const customizeButton = screen.getByText(/Customize Dashboard/i);
    await act(async () => {
      await user.click(customizeButton);
    });

    // Check that the customization dialog is open
    await waitFor(() => {
      expect(screen.getByText(/Dashboard Customization/i)).toBeInTheDocument();
    });

    // Toggle some widgets
    const toggles = screen.getAllByRole('checkbox');
    await act(async () => {
      await user.click(toggles[0]);
    });

    // Save the changes
    const saveButton = screen.getByText(/Save Changes/i);
    await act(async () => {
      await user.click(saveButton);
    });

    // Check that the store was updated with new preferences
    await waitFor(() => {
      const state = store.getState();
      expect(state.dashboard.preferences.visibleWidgets.length).toBeLessThan(
        createAuthenticatedState().dashboard.preferences.visibleWidgets.length
      );
    });
  });

  test('loads resources related to dashboard', async () => {
    // Render the dashboard
    renderWithProviders(<DashboardPage />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for the resources to load
    await waitFor(() => {
      expect(screen.getByText(/Resources/i)).toBeInTheDocument();
    });

    // Check that resource items are displayed
    await waitFor(() => {
      expect(screen.getByText(/Guide to Express Entry/i)).toBeInTheDocument();
      expect(screen.getByText(/Language Testing Information/i)).toBeInTheDocument();
    });
  });

  test('displays recommendations based on user profile', async () => {
    // Render the dashboard
    renderWithProviders(<DashboardPage />, {
      preloadedState: createAuthenticatedState(),
    });

    // Wait for the recommendations to load
    await waitFor(() => {
      expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
    });

    // Check that recommendation items are displayed
    await waitFor(() => {
      expect(screen.getByText(/Express Entry/i)).toBeInTheDocument();
      expect(screen.getByText(/Skilled Worker Program/i)).toBeInTheDocument();
    });
  });
});
