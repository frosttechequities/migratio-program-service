import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectRecommendationsState = (state) => state.recommendations;
const selectRecommendationsArray = (state) => state.recommendations?.recommendations || [];
const selectSimulationResultsRaw = (state) => state.recommendations?.simulationResults || null;
const selectLoadingState = (state) => ({
  isLoading: state.recommendations?.isLoading || false,
  isSimulationLoading: state.recommendations?.isSimulationLoading || false
});
const selectErrorState = (state) => state.recommendations?.error || null;

// Memoized selectors with proper handling for empty/undefined state
export const selectDestinationSuggestions = createSelector(
  [selectRecommendationsState],
  (state) => {
    // First check if we have a valid state object
    if (!state) return [];

    // Then check if we have a destinationSuggestions array directly
    if (state.destinationSuggestions && Array.isArray(state.destinationSuggestions)) {
      return state.destinationSuggestions.map(suggestion => ({
        id: suggestion?.id || '',
        countryCode: suggestion?.countryCode || '',
        countryName: suggestion?.countryName || suggestion?.country || '',
        matchScore: suggestion?.matchScore || suggestion?.score || 0,
        reasons: suggestion?.reasons || []
      }));
    }

    // If no destinationSuggestions, try to use recommendations array
    const recommendations = state.recommendations;
    if (!recommendations || !Array.isArray(recommendations)) {
      return [];
    }

    return recommendations.map(rec => ({
      id: rec?.id || '',
      countryCode: rec?.countryCode || '',
      countryName: rec?.country || '',
      program: rec?.program || '',
      matchScore: rec?.score || 0,
      reasons: rec?.reasons || []
    }));
  }
);

export const selectProgramRecommendations = createSelector(
  [selectRecommendationsArray],
  (recommendations) => {
    if (!recommendations || !Array.isArray(recommendations)) {
      return [];
    }

    return recommendations.map(rec => ({
      id: rec?.id || '',
      program: rec?.program || '',
      country: rec?.country || '',
      score: rec?.score || 0,
      requirements: rec?.requirements || []
    }));
  }
);

export const selectSimulationResults = createSelector(
  [selectSimulationResultsRaw],
  (simulationResults) => simulationResults
);

export const selectRecommendationsLoading = createSelector(
  [selectLoadingState],
  (loadingState) => {
    if (!loadingState) return false;
    return loadingState.isLoading || false;
  }
);

export const selectSimulationLoading = createSelector(
  [selectLoadingState],
  (loadingState) => {
    if (!loadingState) return false;
    return loadingState.isSimulationLoading || false;
  }
);

export const selectRecommendationsError = createSelector(
  [selectErrorState],
  (error) => error || null
);

// Additional selectors for specific use cases
export const selectTopRecommendations = createSelector(
  [selectProgramRecommendations],
  (recommendations) => {
    return recommendations
      .slice()
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
);

export const selectRecommendationsByCountry = createSelector(
  [selectProgramRecommendations, (_, country) => country],
  (recommendations, country) => {
    if (!country) return recommendations;
    return recommendations.filter(rec => rec.country === country);
  }
);

export const selectCountriesFromRecommendations = createSelector(
  [selectProgramRecommendations],
  (recommendations) => {
    if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
      return [];
    }

    const countries = recommendations.map(rec => rec?.country || '').filter(country => country !== '');
    return [...new Set(countries)]; // Remove duplicates
  }
);

export const selectRecommendationsWithHighScore = createSelector(
  [selectProgramRecommendations, (_, threshold = 70) => threshold],
  (recommendations, threshold) => {
    return recommendations.filter(rec => rec.score >= threshold);
  }
);

export const selectRecommendationsWithLowScore = createSelector(
  [selectProgramRecommendations, (_, threshold = 70) => threshold],
  (recommendations, threshold) => {
    return recommendations.filter(rec => rec.score < threshold);
  }
);

export const selectRecommendationById = createSelector(
  [selectProgramRecommendations, (_, id) => id],
  (recommendations, id) => {
    return recommendations.find(rec => rec.id === id) || null;
  }
);

export const selectRecommendationsStats = createSelector(
  [selectProgramRecommendations],
  (recommendations) => {
    if (recommendations.length === 0) {
      return {
        count: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      };
    }

    const scores = recommendations.map(rec => rec.score);
    return {
      count: recommendations.length,
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores)
    };
  }
);
