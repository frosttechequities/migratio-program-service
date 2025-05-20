import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import personalizationService from './services/personalizationService';
import { setMessage } from '../ui/uiSlice';

// Get user preferences from localStorage or use defaults
const getUserPreferencesFromStorage = () => {
  try {
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      return JSON.parse(storedPreferences);
    }
  } catch (error) {
    console.error('Error parsing stored preferences:', error);
  }

  // Default preferences
  return {
    layout: {
      defaultView: 'overview',
      visibleWidgets: [
        'welcome',
        'journeyProgress',
        'recommendations',
        'tasks',
        'documents',
        'resources',
        'opportunities',
        'subscription',
        'readiness',
        'destinations',
        'successProbability',
        'actionRecommendations'
      ],
      widgetOrder: [
        'welcome',
        'journeyProgress',
        'recommendations',
        'tasks',
        'documents',
        'resources',
        'opportunities',
        'subscription',
        'readiness',
        'destinations',
        'successProbability',
        'actionRecommendations'
      ],
      widgetSizes: {
        welcome: { xs: 12, md: 12 },
        journeyProgress: { xs: 12, md: 12 },
        recommendations: { xs: 12, md: 8, lg: 9 },
        tasks: { xs: 12, md: 4, lg: 3 },
        documents: { xs: 12, md: 6 },
        resources: { xs: 12, md: 6 },
        opportunities: { xs: 12, md: 6 },
        subscription: { xs: 12, md: 6 },
        readiness: { xs: 12, md: 6 },
        destinations: { xs: 12, md: 6 },
        successProbability: { xs: 12, md: 6 },
        actionRecommendations: { xs: 12, md: 6 }
      }
    },
    display: {
      theme: 'light',
      fontSize: 'medium',
      density: 'comfortable',
      colorAccent: 'blue'
    },
    content: {
      preferredLanguage: 'en',
      topicInterests: [],
      expertiseLevel: 'intermediate',
      priorityCountries: [],
      dashboardFocus: 'overview',
      defaultComparisonCriteria: ['success_probability', 'processing_time', 'cost'],
      enablePredictiveAnalytics: true,
      enableAISuggestions: true
    },
    savedViews: []
  };
};

// Initial state
const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  preferences: getUserPreferencesFromStorage(),
  savedViews: []
};

// Fetch user preferences
export const fetchUserPreferences = createAsyncThunk(
  'personalization/fetchUserPreferences',
  async (_, thunkAPI) => {
    try {
      const response = await personalizationService.getUserPreferences();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch user preferences';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Save user preferences
export const saveUserPreferences = createAsyncThunk(
  'personalization/saveUserPreferences',
  async (preferences, thunkAPI) => {
    try {
      const response = await personalizationService.saveUserPreferences(preferences);
      thunkAPI.dispatch(setMessage({ message: 'Preferences saved successfully', type: 'success' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to save user preferences';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Save dashboard view
export const saveDashboardView = createAsyncThunk(
  'personalization/saveDashboardView',
  async (view, thunkAPI) => {
    try {
      const response = await personalizationService.saveDashboardView(view);
      thunkAPI.dispatch(setMessage({ message: 'Dashboard view saved successfully', type: 'success' }));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to save dashboard view';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete dashboard view
export const deleteDashboardView = createAsyncThunk(
  'personalization/deleteDashboardView',
  async (viewId, thunkAPI) => {
    try {
      const response = await personalizationService.deleteDashboardView(viewId);
      thunkAPI.dispatch(setMessage({ message: 'Dashboard view deleted successfully', type: 'success' }));
      return { viewId, ...response };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete dashboard view';
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Personalization slice
const personalizationSlice = createSlice({
  name: 'personalization',
  initialState,
  reducers: {
    // Update preferences locally (without API call)
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload
      };

      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },

    // Update layout preferences
    updateLayoutPreferences: (state, action) => {
      state.preferences.layout = {
        ...state.preferences.layout,
        ...action.payload
      };

      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },

    // Update display preferences
    updateDisplayPreferences: (state, action) => {
      state.preferences.display = {
        ...state.preferences.display,
        ...action.payload
      };

      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },

    // Update content preferences
    updateContentPreferences: (state, action) => {
      state.preferences.content = {
        ...state.preferences.content,
        ...action.payload
      };

      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },

    // Reset preferences to defaults
    resetPreferences: (state) => {
      state.preferences = getUserPreferencesFromStorage();
      localStorage.removeItem('userPreferences');
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user preferences
      .addCase(fetchUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.preferences = action.payload;
        localStorage.setItem('userPreferences', JSON.stringify(action.payload));
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Save user preferences
      .addCase(saveUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(saveUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.preferences = action.payload;
        localStorage.setItem('userPreferences', JSON.stringify(action.payload));
      })
      .addCase(saveUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Save dashboard view
      .addCase(saveDashboardView.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(saveDashboardView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.savedViews = [...state.savedViews, action.payload];
      })
      .addCase(saveDashboardView.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Delete dashboard view
      .addCase(deleteDashboardView.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(deleteDashboardView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.savedViews = state.savedViews.filter(view => view.id !== action.payload.viewId);
      })
      .addCase(deleteDashboardView.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  updatePreferences,
  updateLayoutPreferences,
  updateDisplayPreferences,
  updateContentPreferences,
  resetPreferences
} = personalizationSlice.actions;

// Export selectors
export const selectUserPreferences = (state) => state.personalization?.preferences || getUserPreferencesFromStorage();
export const selectLayoutPreferences = (state) => {
  const preferences = state.personalization?.preferences;
  return preferences?.layout || getUserPreferencesFromStorage().layout;
};
export const selectDisplayPreferences = (state) => {
  const preferences = state.personalization?.preferences;
  return preferences?.display || getUserPreferencesFromStorage().display;
};
export const selectContentPreferences = (state) => {
  const preferences = state.personalization?.preferences;
  return preferences?.content || getUserPreferencesFromStorage().content;
};
export const selectSavedViews = (state) => state.personalization?.savedViews || [];
export const selectPersonalizationLoading = (state) => state.personalization?.isLoading || false;
export const selectPersonalizationError = (state) => state.personalization?.error || null;

export default personalizationSlice.reducer;
