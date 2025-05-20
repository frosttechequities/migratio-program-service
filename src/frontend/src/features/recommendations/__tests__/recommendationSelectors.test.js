import { createSelector } from '@reduxjs/toolkit';
import { 
  selectDestinationSuggestions, 
  selectProgramRecommendations,
  selectRecommendationsLoading,
  selectRecommendationsError
} from '../recommendationSelectors';

// Mock state
const mockState = {
  recommendations: {
    recommendations: [
      {
        id: 1,
        program: 'Express Entry',
        country: 'Canada',
        score: 85,
        requirements: [
          { name: 'Language', met: true, score: 20 },
          { name: 'Education', met: true, score: 25 },
          { name: 'Work Experience', met: true, score: 15 },
          { name: 'Age', met: true, score: 12 },
          { name: 'Adaptability', met: true, score: 10 }
        ]
      },
      {
        id: 2,
        program: 'Skilled Worker Program',
        country: 'Australia',
        score: 78,
        requirements: [
          { name: 'Language', met: true, score: 20 },
          { name: 'Education', met: true, score: 20 },
          { name: 'Work Experience', met: true, score: 15 },
          { name: 'Age', met: true, score: 10 },
          { name: 'Adaptability', met: false, score: 5 }
        ]
      }
    ],
    simulationResults: null,
    isLoading: false,
    isSimulationLoading: false,
    error: null
  }
};

// Create memoized selectors using createSelector
export const memoizedSelectDestinationSuggestions = createSelector(
  [(state) => state.recommendations.recommendations],
  (recommendations) => {
    return recommendations.map(rec => ({
      id: rec.id,
      country: rec.country,
      program: rec.program,
      score: rec.score
    }));
  }
);

export const memoizedSelectProgramRecommendations = createSelector(
  [(state) => state.recommendations.recommendations],
  (recommendations) => {
    return recommendations.map(rec => ({
      id: rec.id,
      program: rec.program,
      country: rec.country,
      score: rec.score,
      requirements: rec.requirements
    }));
  }
);

describe('Recommendation Selectors', () => {
  test('selectDestinationSuggestions returns the same reference for the same state', () => {
    // Call the selector twice with the same state
    const result1 = selectDestinationSuggestions(mockState);
    const result2 = selectDestinationSuggestions(mockState);
    
    // Check that the results are the same reference
    expect(result1).toBe(result2);
  });
  
  test('selectProgramRecommendations returns the same reference for the same state', () => {
    // Call the selector twice with the same state
    const result1 = selectProgramRecommendations(mockState);
    const result2 = selectProgramRecommendations(mockState);
    
    // Check that the results are the same reference
    expect(result1).toBe(result2);
  });
  
  test('selectRecommendationsLoading returns the loading state', () => {
    // Call the selector
    const result = selectRecommendationsLoading(mockState);
    
    // Check that it returns the correct value
    expect(result).toBe(false);
  });
  
  test('selectRecommendationsError returns the error state', () => {
    // Call the selector
    const result = selectRecommendationsError(mockState);
    
    // Check that it returns the correct value
    expect(result).toBe(null);
  });
  
  test('memoizedSelectDestinationSuggestions returns the same reference for the same state', () => {
    // Call the selector twice with the same state
    const result1 = memoizedSelectDestinationSuggestions(mockState);
    const result2 = memoizedSelectDestinationSuggestions(mockState);
    
    // Check that the results are the same reference
    expect(result1).toBe(result2);
  });
  
  test('memoizedSelectProgramRecommendations returns the same reference for the same state', () => {
    // Call the selector twice with the same state
    const result1 = memoizedSelectProgramRecommendations(mockState);
    const result2 = memoizedSelectProgramRecommendations(mockState);
    
    // Check that the results are the same reference
    expect(result1).toBe(result2);
  });
  
  test('memoizedSelectDestinationSuggestions returns a new reference for different state', () => {
    // Call the selector with the original state
    const result1 = memoizedSelectDestinationSuggestions(mockState);
    
    // Create a new state with different recommendations
    const newState = {
      ...mockState,
      recommendations: {
        ...mockState.recommendations,
        recommendations: [
          ...mockState.recommendations.recommendations,
          {
            id: 3,
            program: 'New Program',
            country: 'New Country',
            score: 90,
            requirements: []
          }
        ]
      }
    };
    
    // Call the selector with the new state
    const result2 = memoizedSelectDestinationSuggestions(newState);
    
    // Check that the results are different references
    expect(result1).not.toBe(result2);
  });
});
