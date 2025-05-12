import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import comparisonService from './comparisonService';

const initialState = {
  programs: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk to fetch programs for comparison
export const fetchProgramsForComparison = createAsyncThunk(
  'comparison/fetchPrograms',
  async (programIds, thunkAPI) => {
    try {
      // Ensure programIds is an array of strings
      const ids = Array.isArray(programIds) ? programIds.map(String) : [String(programIds)];
      if (ids.length === 0) {
        return []; // No IDs to fetch
      }
      return await comparisonService.getProgramsForComparison(ids);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    resetComparison: (state) => {
      state.programs = [];
      state.status = 'idle';
      state.error = null;
    },
    // Could add reducers to add/remove individual programs to compare
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgramsForComparison.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProgramsForComparison.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.programs = action.payload; // Assuming payload is the array of comparisonProgram objects
      })
      .addCase(fetchProgramsForComparison.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetComparison } = comparisonSlice.actions;
export default comparisonSlice.reducer;
