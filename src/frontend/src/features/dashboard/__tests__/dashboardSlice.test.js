import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer, {
  fetchDashboardData,
  updateDashboardPreferences,
  resetDashboard,
  setDashboardPreferences
} from '../dashboardSlice';

// Mock the dashboard service
jest.mock('../dashboardService', () => ({
  getDashboardData: jest.fn(),
  updateDashboardPreferences: jest.fn()
}));

// Import the mocked service
import dashboardService from '../dashboardService';

describe('dashboardSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        dashboard: dashboardReducer
      }
    });
  });

  it('should handle initial state', () => {
    expect(store.getState().dashboard).toEqual({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: null,
      preferences: {
        layout: 'default',
        visibleWidgets: ['overview', 'nextSteps', 'upcomingDeadlines', 'personalizedRecommendations', 'roadmap', 'document', 'task', 'notifications'],
        widgetOrder: ['overview', 'nextSteps', 'upcomingDeadlines', 'personalizedRecommendations', 'roadmap', 'document', 'task', 'notifications']
      }
    });
  });

  it('should handle fetchDashboardData.pending', () => {
    store.dispatch({ type: fetchDashboardData.pending.type });
    expect(store.getState().dashboard.isLoading).toBe(true);
    expect(store.getState().dashboard.isSuccess).toBe(false);
    expect(store.getState().dashboard.isError).toBe(false);
    expect(store.getState().dashboard.error).toBe(null);
  });

  it('should handle fetchDashboardData.fulfilled', () => {
    const mockData = {
      data: {
        overview: {
          profileCompletion: 75,
          assessmentCompletion: 100
        },
        roadmaps: [
          { _id: 'roadmap1', title: 'Test Roadmap' }
        ]
      }
    };

    store.dispatch({
      type: fetchDashboardData.fulfilled.type,
      payload: mockData
    });

    expect(store.getState().dashboard.isLoading).toBe(false);
    expect(store.getState().dashboard.isSuccess).toBe(true);
    expect(store.getState().dashboard.data).toEqual(mockData.data);
  });

  it('should handle fetchDashboardData.rejected', () => {
    const errorMessage = 'Failed to fetch dashboard data';

    store.dispatch({
      type: fetchDashboardData.rejected.type,
      payload: errorMessage
    });

    expect(store.getState().dashboard.isLoading).toBe(false);
    expect(store.getState().dashboard.isError).toBe(true);
    expect(store.getState().dashboard.error).toBe(errorMessage);
  });

  it('should handle updateDashboardPreferences.fulfilled', () => {
    const mockPreferences = {
      data: {
        layout: 'compact',
        visibleWidgets: ['overview', 'roadmap'],
        widgetOrder: ['roadmap', 'overview']
      }
    };

    store.dispatch({
      type: updateDashboardPreferences.fulfilled.type,
      payload: mockPreferences
    });

    expect(store.getState().dashboard.isLoading).toBe(false);
    expect(store.getState().dashboard.isSuccess).toBe(true);
    expect(store.getState().dashboard.preferences).toEqual(mockPreferences.data);
  });

  it('should handle resetDashboard', () => {
    // First set some state
    store.dispatch({
      type: fetchDashboardData.rejected.type,
      payload: 'Error message'
    });

    // Then reset
    store.dispatch(resetDashboard());

    expect(store.getState().dashboard.isLoading).toBe(false);
    expect(store.getState().dashboard.isSuccess).toBe(false);
    expect(store.getState().dashboard.isError).toBe(false);
    expect(store.getState().dashboard.error).toBe(null);
  });

  it('should handle setDashboardPreferences', () => {
    const newPreferences = {
      layout: 'compact',
      visibleWidgets: ['overview', 'roadmap']
    };

    store.dispatch(setDashboardPreferences(newPreferences));

    expect(store.getState().dashboard.preferences).toEqual({
      layout: 'compact',
      visibleWidgets: ['overview', 'roadmap'],
      widgetOrder: ['overview', 'nextSteps', 'upcomingDeadlines', 'personalizedRecommendations', 'roadmap', 'document', 'task', 'notifications']
    });
  });

  it('should call the service when fetchDashboardData is dispatched', async () => {
    const mockData = {
      data: {
        overview: {
          profileCompletion: 75
        }
      }
    };

    dashboardService.getDashboardData.mockResolvedValue(mockData);

    await store.dispatch(fetchDashboardData());

    expect(dashboardService.getDashboardData).toHaveBeenCalled();
  });

  it('should call the service when updateDashboardPreferences is dispatched', async () => {
    const preferences = {
      layout: 'compact'
    };

    const mockResponse = {
      data: preferences
    };

    dashboardService.updateDashboardPreferences.mockResolvedValue(mockResponse);

    await store.dispatch(updateDashboardPreferences(preferences));

    expect(dashboardService.updateDashboardPreferences).toHaveBeenCalledWith(preferences);
  });
});
