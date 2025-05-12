import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roadmapService from './roadmapService';
import { setMessage } from '../ui/uiSlice'; // Assuming uiSlice exists for messages

// Initial state
const initialState = {
  roadmaps: [], // List of user's roadmaps (summary view)
  currentRoadmap: null, // The currently selected/viewed roadmap (detailed view)
  isLoadingList: false,
  isLoadingDetail: false,
  isError: false,
  error: null,
};

// Async thunk to fetch all roadmaps for the user
export const fetchAllRoadmaps = createAsyncThunk(
  'roadmap/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await roadmapService.getAllRoadmaps();
      // Expect response = { status, results, data: { roadmaps } }
      return response.data.roadmaps; // Return only the roadmaps array
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to load roadmaps: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to fetch a single roadmap by ID
export const fetchRoadmapById = createAsyncThunk(
  'roadmap/fetchById',
  async (roadmapId, thunkAPI) => {
    try {
      const response = await roadmapService.getRoadmapById(roadmapId);
       // Expect response = { status, data: { roadmap } }
      return response.data.roadmap; // Return only the roadmap object
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to load roadmap details: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to update a task's status
export const updateTaskStatus = createAsyncThunk(
  'roadmap/updateTaskStatus',
  async ({ roadmapId, phaseId, taskId, updateData }, thunkAPI) => {
    try {
      const updatedTask = await roadmapService.updateTaskStatus(roadmapId, phaseId, taskId, updateData);
      // Return necessary info to update the state
      return { roadmapId, phaseId, taskId, updatedTask };
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to update task status: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to update a document status entry
export const updateDocumentStatus = createAsyncThunk(
  'roadmap/updateDocumentStatus',
  async ({ roadmapId, phaseId, docStatusId, updateData }, thunkAPI) => {
    try {
      const updatedDocumentStatus = await roadmapService.updateDocumentStatus(roadmapId, phaseId, docStatusId, updateData); // Fix variable name here
      // Return necessary info to update the state
      return { roadmapId, phaseId, docStatusId, updatedDocumentStatus };
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to update document status: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to generate a new roadmap
export const generateRoadmap = createAsyncThunk(
  'roadmap/generate',
  async (roadmapData, thunkAPI) => {
    try {
      // Assuming roadmapService.generateRoadmap exists and returns the new roadmap
      const response = await roadmapService.generateRoadmap(roadmapData);
      thunkAPI.dispatch(setMessage({ type: 'success', text: 'Roadmap generated successfully!' }));
      return response.data.roadmap; // Or however the new roadmap is returned
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to generate roadmap';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// TODO: Add thunks for update, delete roadmap if needed

// Roadmap slice
const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState,
  reducers: {
    resetRoadmapState: (state) => {
      state.roadmaps = [];
      state.currentRoadmap = null;
      state.isLoadingList = false;
      state.isLoadingDetail = false;
      state.isError = false;
      state.error = null;
    },
    clearCurrentRoadmap: (state) => {
        state.currentRoadmap = null;
        state.isLoadingDetail = false;
        state.isError = false;
        state.error = null;
    }
    // TODO: Add reducers for local updates (e.g., updating task status) if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch all roadmaps
      .addCase(fetchAllRoadmaps.pending, (state) => {
        state.isLoadingList = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchAllRoadmaps.fulfilled, (state, action) => {
        state.isLoadingList = false;
        state.roadmaps = action.payload;
      })
      .addCase(fetchAllRoadmaps.rejected, (state, action) => {
        state.isLoadingList = false;
        state.isError = true;
        state.error = action.payload;
        state.roadmaps = []; // Clear list on error
      })
      // Fetch roadmap by ID
      .addCase(fetchRoadmapById.pending, (state) => {
        state.isLoadingDetail = true;
        state.isError = false;
        state.error = null;
        state.currentRoadmap = null; // Clear previous detail view
      })
      .addCase(fetchRoadmapById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.currentRoadmap = action.payload;
      })
      .addCase(fetchRoadmapById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.isError = true;
        state.error = action.payload;
        state.currentRoadmap = null;
      })
      // Update task status
      .addCase(updateTaskStatus.pending, (state) => {
        // Optionally indicate loading state for the specific task?
        // For now, just prevent errors during update
        state.isError = false;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { phaseId, taskId, updatedTask } = action.payload;
        if (state.currentRoadmap) {
          const phaseIndex = state.currentRoadmap.phases.findIndex(p => p._id === phaseId);
          if (phaseIndex !== -1) {
            const taskIndex = state.currentRoadmap.phases[phaseIndex].tasks.findIndex(t => t._id === taskId);
            if (taskIndex !== -1) {
              // Update the specific task in the currentRoadmap state
              state.currentRoadmap.phases[phaseIndex].tasks[taskIndex] = {
                ...state.currentRoadmap.phases[phaseIndex].tasks[taskIndex], // Keep existing fields
                ...updatedTask // Overwrite with updated fields from payload
              };
            }
          }
        }
        // Also update in the list view if the roadmap exists there? Less critical.
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        // Set error state, maybe show a message
        state.isError = true;
        state.error = action.payload; // Error message from rejectWithValue
        // Optionally revert optimistic updates if implemented
      })
      // Update document status
      .addCase(updateDocumentStatus.pending, (state) => {
        state.isError = false;
        state.error = null;
      })
      .addCase(updateDocumentStatus.fulfilled, (state, action) => {
        const { phaseId, docStatusId, updatedDocumentStatus } = action.payload;
        if (state.currentRoadmap) {
          const phaseIndex = state.currentRoadmap.phases.findIndex(p => p._id === phaseId);
          if (phaseIndex !== -1) {
            const docIndex = state.currentRoadmap.phases[phaseIndex].documents.findIndex(d => d._id === docStatusId);
            if (docIndex !== -1) {
              // Update the specific document status entry in the currentRoadmap state
              state.currentRoadmap.phases[phaseIndex].documents[docIndex] = {
                ...state.currentRoadmap.phases[phaseIndex].documents[docIndex],
                ...updatedDocumentStatus
              };
            }
          }
        }
      })
      .addCase(updateDocumentStatus.rejected, (state, action) => {
        state.isError = true;
        state.error = action.payload;
      })
      // Generate roadmap
      .addCase(generateRoadmap.pending, (state) => {
        state.isLoadingDetail = true; // Or a new loading state like isGenerating
        state.isError = false;
        state.error = null;
      })
      .addCase(generateRoadmap.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.currentRoadmap = action.payload; // Set the new roadmap as current
        state.roadmaps.push(action.payload); // Add to the list of roadmaps
        // Potentially navigate or give success feedback
      })
      .addCase(generateRoadmap.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.isError = true;
        state.error = action.payload;
      });
      // TODO: Add cases for update, delete thunks
  }
});

export const { resetRoadmapState, clearCurrentRoadmap } = roadmapSlice.actions;

// Selector for the entire roadmap state
export const selectRoadmapState = (state) => state.roadmap;

export default roadmapSlice.reducer;
