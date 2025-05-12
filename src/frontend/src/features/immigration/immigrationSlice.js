/**
 * Immigration data slice
 * Redux slice for immigration data
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import immigrationService from './immigrationService';
import { REGIONS, PROGRAM_TYPES } from '../../config/constants';

// Initial state
const initialState = {
  programs: [],
  program: null,
  countries: [],
  country: null,
  pointsSystems: [],
  pointsSystem: null,
  pointsCalculation: null,
  regions: REGIONS,
  programTypes: PROGRAM_TYPES,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Get all immigration programs
export const getAllPrograms = createAsyncThunk(
  'immigration/getAllPrograms',
  async (params, thunkAPI) => {
    try {
      // Use mock data for development regardless of authentication
      return { data: immigrationService.getMockImmigrationPrograms() };
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

// Get immigration program by ID
export const getProgramById = createAsyncThunk(
  'immigration/getProgramById',
  async (id, thunkAPI) => {
    try {
      // Use mock data for development regardless of authentication
      const mockPrograms = immigrationService.getMockImmigrationPrograms();
      const program = mockPrograms.find(p => p._id === id);
      return { data: program };
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

// Get immigration programs by country
export const getProgramsByCountry = createAsyncThunk(
  'immigration/getProgramsByCountry',
  async ({ country, params }, thunkAPI) => {
    try {
      // Use mock data for development regardless of authentication
      const mockPrograms = immigrationService.getMockImmigrationPrograms();
      const programs = mockPrograms.filter(p => p.country.toLowerCase() === country.toLowerCase());
      return { data: programs };
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

// Get all country profiles
export const getAllCountries = createAsyncThunk(
  'immigration/getAllCountries',
  async (params, thunkAPI) => {
    try {
      // Use mock data for development regardless of authentication
      return { data: immigrationService.getMockCountryProfiles() };
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

// Get country profile by name
export const getCountryByName = createAsyncThunk(
  'immigration/getCountryByName',
  async (name, thunkAPI) => {
    try {
      // Use mock data for development regardless of authentication
      const mockCountries = immigrationService.getMockCountryProfiles();
      const country = mockCountries.find(c => c.name.toLowerCase() === name.toLowerCase());
      return { data: country };
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

// Get top immigration countries
export const getTopCountries = createAsyncThunk(
  'immigration/getTopCountries',
  async (limit, thunkAPI) => {
    try {
      // Use mock data for development regardless of authentication
      return { data: immigrationService.getMockCountryProfiles() };
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

// Calculate points for a user profile
export const calculatePoints = createAsyncThunk(
  'immigration/calculatePoints',
  async ({ id, userProfile }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await immigrationService.calculatePoints(token, id, userProfile);
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

// Immigration slice
export const immigrationSlice = createSlice({
  name: 'immigration',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearProgram: (state) => {
      state.program = null;
    },
    clearCountry: (state) => {
      state.country = null;
    },
    clearPointsCalculation: (state) => {
      state.pointsCalculation = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all immigration programs
      .addCase(getAllPrograms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPrograms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.programs = action.payload.data;
      })
      .addCase(getAllPrograms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get immigration program by ID
      .addCase(getProgramById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProgramById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.program = action.payload.data;
      })
      .addCase(getProgramById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get immigration programs by country
      .addCase(getProgramsByCountry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProgramsByCountry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.programs = action.payload.data;
      })
      .addCase(getProgramsByCountry.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get all country profiles
      .addCase(getAllCountries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCountries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.countries = action.payload.data;
      })
      .addCase(getAllCountries.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get country profile by name
      .addCase(getCountryByName.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCountryByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.country = action.payload.data;
      })
      .addCase(getCountryByName.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Get top immigration countries
      .addCase(getTopCountries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTopCountries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.countries = action.payload.data;
      })
      .addCase(getTopCountries.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Calculate points for a user profile
      .addCase(calculatePoints.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(calculatePoints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pointsCalculation = action.payload.data;
      })
      .addCase(calculatePoints.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearProgram, clearCountry, clearPointsCalculation } = immigrationSlice.actions;

// Helper functions to get static data
export const getRegions = () => REGIONS;
export const getProgramTypes = () => PROGRAM_TYPES;

// Get all points systems
export const getAllPointsSystems = createAsyncThunk(
  'immigration/getAllPointsSystems',
  async (params, thunkAPI) => {
    try {
      // Use mock data for development regardless of authentication
      return { data: immigrationService.getMockPointsSystems() };
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

// Get points system by ID
export const getPointsSystemById = createAsyncThunk(
  'immigration/getPointsSystemById',
  async (id, thunkAPI) => {
    try {
      // Use mock data for development regardless of authentication
      const mockPointsSystems = immigrationService.getMockPointsSystems();
      const pointsSystem = mockPointsSystems.find(p => p._id === id);
      return { data: pointsSystem };
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

export default immigrationSlice.reducer;
