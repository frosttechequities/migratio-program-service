import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resourceService from './resourceService';
import { setMessage } from '../ui/uiSlice'; // For displaying messages

// Initial state
const initialState = {
  resources: [],
  currentResource: null,
  isLoading: false,
  isError: false,
  error: null,
};

// Async thunk to fetch resources (optionally filtered by tags)
export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async (tags = [], thunkAPI) => {
    try {
      const response = await resourceService.getResources(tags);
      // Expect response = { status, results, data: { resources: [] } }
      return response.data.resources; // Return only the resources array
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to load resources: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to fetch a single resource by ID
export const fetchResourceById = createAsyncThunk(
  'resources/fetchById',
  async (resourceId, thunkAPI) => {
    try {
      const response = await resourceService.getResourceById(resourceId);
      // Expect response = { status, data: { resource: {} } }
      return response.data.resource; // Return only the resource object
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to load resource details: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// TODO: Add thunks for create, update, delete resources (admin) if needed

// Resource slice
const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    resetResources: (state) => {
      state.resources = [];
      state.currentResource = null;
      state.isLoading = false;
      state.isError = false;
      state.error = null;
    },
    clearCurrentResource: (state) => {
        state.currentResource = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch resources
      .addCase(fetchResources.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.resources = [];
      })
      // Fetch resource by ID
      .addCase(fetchResourceById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
        state.currentResource = null;
      })
      .addCase(fetchResourceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResource = action.payload;
      })
      .addCase(fetchResourceById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.currentResource = null;
      });
      // TODO: Add cases for admin actions (create, update, delete)
  }
});

export const { resetResources, clearCurrentResource } = resourceSlice.actions;

// Selectors
export const selectAllResources = (state) => state.resources.resources;
export const selectCurrentResource = (state) => state.resources.currentResource;
export const selectResourcesLoading = (state) => state.resources.isLoading;
export const selectResourcesError = (state) => state.resources.error;

export default resourceSlice.reducer;
