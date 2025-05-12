import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import programService from './programService'; // Updated import

// Async thunks
export const getAllPrograms = createAsyncThunk(
  'programs/getAll',
  async (params = {}, { rejectWithValue }) => { // params is already an object { country, category }
    try {
      // No need to reconstruct params if it's passed directly
      const responseData = await programService.getAllPrograms(params);
      return responseData; // programService already returns response.data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get programs');
    }
  }
);

export const getProgramById = createAsyncThunk(
  'programs/getById',
  async (programId, { rejectWithValue }) => {
    try {
      const responseData = await programService.getProgramById(programId);
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get program');
    }
  }
);

export const getProgramCategories = createAsyncThunk(
  'programs/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const responseData = await programService.getProgramCategories();
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get program categories');
    }
  }
);

export const getProgramCountries = createAsyncThunk(
  'programs/getCountries',
  async (_, { rejectWithValue }) => {
    try {
      const responseData = await programService.getProgramCountries();
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get program countries');
    }
  }
);

// Initial state
const initialState = {
  programs: [],
  program: null,
  categories: [],
  countries: [],
  loading: false,
  error: null
};

// Slice
const programSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    resetPrograms: (state) => {
      state.programs = [];
      state.program = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all programs
      .addCase(getAllPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
      })
      .addCase(getAllPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get programs';
      })
      
      // Get program by ID
      .addCase(getProgramById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgramById.fulfilled, (state, action) => {
        state.loading = false;
        state.program = action.payload;
      })
      .addCase(getProgramById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get program';
      })
      
      // Get program categories
      .addCase(getProgramCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgramCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getProgramCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get program categories';
      })
      
      // Get program countries
      .addCase(getProgramCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgramCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(getProgramCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get program countries';
      });
  }
});

export const { resetPrograms, clearError } = programSlice.actions;

export default programSlice.reducer;
