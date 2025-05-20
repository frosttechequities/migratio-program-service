import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import dashboardService from './dashboardService';
import { setMessage } from '../ui/uiSlice';

// Initial state
const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  data: null,
  preferences: {
    layout: 'default',
    visibleWidgets: [
      'overview',
      'nextSteps',
      'upcomingDeadlines',
      'personalizedRecommendations',
      'roadmap',
      'document',
      'task',
      'notifications'
    ],
    widgetOrder: [
      'overview',
      'nextSteps',
      'upcomingDeadlines',
      'personalizedRecommendations',
      'roadmap',
      'document',
      'task',
      'notifications'
    ]
  }
};

// Fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (options = {}, thunkAPI) => {
    try {
      return await dashboardService.getDashboardData(options);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      thunkAPI.dispatch(setMessage({
        type: 'error',
        text: message
      }));

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update dashboard preferences
export const updateDashboardPreferences = createAsyncThunk(
  'dashboard/updatePreferences',
  async (preferences, thunkAPI) => {
    try {
      return await dashboardService.updateDashboardPreferences(preferences);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      thunkAPI.dispatch(setMessage({
        type: 'error',
        text: message
      }));

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear dashboard cache
export const clearDashboardCache = createAsyncThunk(
  'dashboard/clearCache',
  async (_, thunkAPI) => {
    try {
      // Since we're not using a cache anymore, just return success
      return { success: true };
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to clear dashboard cache');
    }
  }
);

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
    },
    setDashboardPreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Make sure we're handling the data correctly
        state.data = action.payload?.data || action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Update dashboard preferences
      .addCase(updateDashboardPreferences.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(updateDashboardPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.preferences = action.payload.data;
      })
      .addCase(updateDashboardPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  }
});

export const { resetDashboard, setDashboardPreferences } = dashboardSlice.actions;

// Selectors
export const selectDashboardData = (state) => state.dashboard?.data || null;
export const selectDashboardLoading = (state) => state.dashboard?.isLoading || false;
export const selectDashboardError = (state) => state.dashboard?.error || null;
export const selectDashboardSuccess = (state) => state.dashboard?.isSuccess || false;
const selectDashboardState = (state) => state.dashboard;

export const selectDashboardPreferences = createSelector(
  selectDashboardState,
  (dashboardState) => dashboardState?.preferences || {
    layout: 'default',
    visibleWidgets: [],
    widgetOrder: []
  }
);

export default dashboardSlice.reducer;
