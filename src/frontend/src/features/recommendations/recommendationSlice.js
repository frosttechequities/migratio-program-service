import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recommendationService from './recommendationService';
import { setMessage } from '../ui/uiSlice'; // For displaying messages

// Initial state
const initialState = {
  programRecommendations: [], // Array for program recommendations
  destinationSuggestions: [], // Array for destination suggestions
  programRecommendations: [],
  destinationSuggestions: [],
  simulationResults: null, // Add state for simulation results
  isLoadingPrograms: false,
  isLoadingDestinations: false,
  isLoadingSimulation: false, // Add loading state for simulation
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


// Recommendation slice
const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    resetRecommendations: (state) => {
      state.programRecommendations = [];
      state.destinationSuggestions = [];
      state.isLoadingPrograms = false;
      state.isLoadingDestinations = false;
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
    });
  }
});

export const { resetRecommendations } = recommendationSlice.actions;

// Selectors
export const selectProgramRecommendations = (state) => state.recommendations.programRecommendations;
export const selectDestinationSuggestions = (state) => state.recommendations.destinationSuggestions;
export const selectSimulationResults = (state) => state.recommendations.simulationResults;
export const selectRecommendationsLoading = (state) => state.recommendations.isLoadingPrograms || state.recommendations.isLoadingDestinations;
export const selectSimulationLoading = (state) => state.recommendations.isLoadingSimulation;
export const selectRecommendationsError = (state) => state.recommendations.error;


export default recommendationSlice.reducer;
