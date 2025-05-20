import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import recommendationService from './recommendationService';
import { setMessage } from '../ui/uiSlice'; // For displaying messages

// Initial state
const initialState = {
  programRecommendations: [], // Array for program recommendations
  destinationSuggestions: [], // Array for destination suggestions
  simulationResults: null, // Add state for simulation results
  successProbability: null, // Success probability data
  gapAnalysis: null, // Gap analysis data
  isLoadingPrograms: false,
  isLoadingDestinations: false,
  isLoadingSimulation: false, // Add loading state for simulation
  isLoadingProbability: false, // Loading state for success probability
  isLoadingGapAnalysis: false, // Loading state for gap analysis
  isError: false,
  error: null,
};

// Async thunk to generate program recommendations
export const generateProgramRecommendations = createAsyncThunk(
  'recommendations/generatePrograms',
  async (_, thunkAPI) => {
    try {
      const response = await recommendationService.generateRecommendations();
      // Expect response = { status, results, data: { recommendationSet: [] } }
      return response.data.recommendationSet; // Return only the recommendationSet array
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to generate recommendations: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Alias for fetchProgramRecommendations to maintain backward compatibility
export const fetchProgramRecommendations = generateProgramRecommendations;

// Async thunk to suggest destination countries
export const suggestDestinationCountries = createAsyncThunk(
  'recommendations/suggestDestinations',
  async (_, thunkAPI) => {
    try {
      const response = await recommendationService.suggestDestinations();
      // Expect response = { status, results, data: { destinationSuggestions: [] } }
      return response.data.destinationSuggestions; // Return only the destinationSuggestions array
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to suggest destinations: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to simulate profile changes
export const simulateScenario = createAsyncThunk(
  'recommendations/simulateScenario',
  async (profileChanges, thunkAPI) => {
    try {
      // profileChanges should be an object like { financialInformation: { annualIncome: 80000 } }
      return await recommendationService.simulateProfileChange(profileChanges);
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Scenario simulation failed: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to fetch success probability for a program
export const fetchSuccessProbability = createAsyncThunk(
  'recommendations/fetchSuccessProbability',
  async (programId, thunkAPI) => {
    try {
      return await recommendationService.getSuccessProbability(programId);
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to fetch success probability: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to fetch gap analysis for a program
export const fetchGapAnalysis = createAsyncThunk(
  'recommendations/fetchGapAnalysis',
  async (programId, thunkAPI) => {
    try {
      return await recommendationService.getGapAnalysis(programId);
    } catch (error) {
      const message = error.message || error.toString();
      thunkAPI.dispatch(setMessage({ type: 'error', text: `Failed to fetch gap analysis: ${message}` }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// Recommendation slice
const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    resetRecommendations: (state) => {
      state.programRecommendations = [];
      state.destinationSuggestions = [];
      state.simulationResults = null;
      state.successProbability = null;
      state.gapAnalysis = null;
      state.isLoadingPrograms = false;
      state.isLoadingDestinations = false;
      state.isLoadingSimulation = false;
      state.isLoadingProbability = false;
      state.isLoadingGapAnalysis = false;
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Program Recommendations
      .addCase(generateProgramRecommendations.pending, (state) => {
        state.isLoadingPrograms = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(generateProgramRecommendations.fulfilled, (state, action) => {
        state.isLoadingPrograms = false;
        state.programRecommendations = action.payload;
      })
      .addCase(generateProgramRecommendations.rejected, (state, action) => {
        state.isLoadingPrograms = false;
        state.isError = true;
        state.error = action.payload;
        state.programRecommendations = [];
      })
      // Suggest Destination Countries
      .addCase(suggestDestinationCountries.pending, (state) => {
        state.isLoadingDestinations = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(suggestDestinationCountries.fulfilled, (state, action) => {
        state.isLoadingDestinations = false;
        state.destinationSuggestions = action.payload;
      })
      .addCase(suggestDestinationCountries.rejected, (state, action) => {
      state.isLoadingDestinations = false;
      state.isError = true;
      state.error = action.payload;
      state.destinationSuggestions = [];
    })
    // Simulate Scenario
    .addCase(simulateScenario.pending, (state) => {
        state.isLoadingSimulation = true;
        state.isError = false;
        state.error = null;
        state.simulationResults = null; // Clear previous results
    })
    .addCase(simulateScenario.fulfilled, (state, action) => {
        state.isLoadingSimulation = false;
        state.simulationResults = action.payload; // Store { scenario, simulatedRecommendations }
    })
    .addCase(simulateScenario.rejected, (state, action) => {
        state.isLoadingSimulation = false;
        state.isError = true;
        state.error = action.payload;
        state.simulationResults = null;
    })
    // Fetch Success Probability
    .addCase(fetchSuccessProbability.pending, (state) => {
        state.isLoadingProbability = true;
        // Don't reset error state here to maintain last error when a new request is made
    })
    .addCase(fetchSuccessProbability.fulfilled, (state, action) => {
        state.isLoadingProbability = false;
        state.successProbability = action.payload;
        // Clear error state on successful request
        state.isError = false;
        state.error = null;
    })
    .addCase(fetchSuccessProbability.rejected, (state, action) => {
        state.isLoadingProbability = false;
        state.isError = true;
        state.error = action.payload;
        state.successProbability = null;
    })
    // Fetch Gap Analysis
    .addCase(fetchGapAnalysis.pending, (state) => {
        state.isLoadingGapAnalysis = true;
        // Don't reset error state here to maintain last error when a new request is made
    })
    .addCase(fetchGapAnalysis.fulfilled, (state, action) => {
        state.isLoadingGapAnalysis = false;
        state.gapAnalysis = action.payload;
        // Clear error state on successful request
        state.isError = false;
        state.error = null;
    })
    .addCase(fetchGapAnalysis.rejected, (state, action) => {
        state.isLoadingGapAnalysis = false;
        state.isError = true;
        state.error = action.payload;
        state.gapAnalysis = null;
    });
  }
});

export const { resetRecommendations } = recommendationSlice.actions;

// Base selector for recommendations state
const selectRecommendationsState = (state) => state?.recommendations || {};

// Memoized selectors with improved null/undefined handling
export const selectProgramRecommendations = createSelector(
  [selectRecommendationsState],
  (recommendations) => {
    return Array.isArray(recommendations.programRecommendations)
      ? recommendations.programRecommendations
      : [];
  }
);

export const selectDestinationSuggestions = createSelector(
  [selectRecommendationsState],
  (recommendations) => {
    return Array.isArray(recommendations.destinationSuggestions)
      ? recommendations.destinationSuggestions
      : [];
  }
);

export const selectSimulationResults = createSelector(
  [selectRecommendationsState],
  (recommendations) => recommendations.simulationResults || null
);

export const selectSuccessProbability = createSelector(
  [selectRecommendationsState],
  (recommendations) => recommendations.successProbability || null
);

export const selectGapAnalysis = createSelector(
  [selectRecommendationsState],
  (recommendations) => recommendations.gapAnalysis || null
);

export const selectRecommendationsLoading = createSelector(
  [selectRecommendationsState],
  (recommendations) => (recommendations.isLoadingPrograms || recommendations.isLoadingDestinations) || false
);

export const selectSimulationLoading = createSelector(
  [selectRecommendationsState],
  (recommendations) => recommendations.isLoadingSimulation || false
);

export const selectProbabilityLoading = createSelector(
  [selectRecommendationsState],
  (recommendations) => recommendations.isLoadingProbability || false
);

export const selectGapAnalysisLoading = createSelector(
  [selectRecommendationsState],
  (recommendations) => recommendations.isLoadingGapAnalysis || false
);

export const selectRecommendationsError = createSelector(
  [selectRecommendationsState],
  (recommendations) => recommendations.error || null
);

export const selectError = createSelector(
  [selectRecommendationsState],
  (recommendations) => recommendations.error || null
);

export const selectIsError = createSelector(
  [selectRecommendationsState],
  (recommendations) => recommendations.isError || false
);


export default recommendationSlice.reducer;
