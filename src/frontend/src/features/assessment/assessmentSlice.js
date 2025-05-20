import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assessmentService from './assessmentService';
import { setMessage } from '../ui/uiSlice'; // Assuming uiSlice exists for messages

const initialState = {
  sessionId: null,
  currentQuestion: null,
  currentQuestionIndex: 0, // Track the current question index
  questions: [], // Store all questions for the assessment
  progress: 0,
  isComplete: false,
  isLoading: false, // Loading state specific to assessment actions
  isError: false,
  error: null,
  results: null, // To store the results of the quiz
  recommendations: null, // To store the recommendation results
  recommendedPrograms: null, // To store the recommended programs
  // NLP related state
  isProcessingNlp: false, // Whether NLP processing is in progress
  nlpResults: null, // To store the NLP analysis results
  nlpError: null, // To store any NLP processing errors
  // Store answers within the session or link to QuizResponse model?
  // For now, keep answers managed locally in QuizInterface or fetch with session status
};

// Async thunk to start/resume a quiz session
export const startQuizSession = createAsyncThunk(
  'assessment/startSession',
  async (forceNew = false, thunkAPI) => {
    try {
      // Calls the assessmentService function which hits the backend API
      // Pass forceNew parameter to force creation of a new session
      const data = await assessmentService.startQuiz(forceNew);
      // The service now returns the data part directly on success
      return data;
    } catch (error) {
      const message = error.message || 'Failed to start quiz session.';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to submit an answer
export const submitQuizAnswer = createAsyncThunk(
  'assessment/submitAnswer',
  async ({ sessionId, questionId, answer }, thunkAPI) => {
    try {
      // Calls the assessmentService function which hits the backend API
      const data = await assessmentService.submitAnswer(sessionId, questionId, answer);
      // The service returns data including nextQuestion, progress, isComplete etc.
      if (data.isComplete) {
        thunkAPI.dispatch(setMessage({ type: 'success', text: 'Assessment Completed!' }));

        // Immediately fetch results when the quiz is complete
        console.log('[assessmentSlice] Quiz complete, fetching results...');
        try {
          // Get the mock quiz results
          const resultsData = await assessmentService.getQuizResults(sessionId);

          // Store the results in the state
          if (resultsData) {
            thunkAPI.dispatch({
              type: 'assessment/getResults/fulfilled',
              payload: resultsData
            });
          }
        } catch (resultsError) {
          console.error('[assessmentSlice] Error fetching results:', resultsError);
        }
      }
      return data;
    } catch (error) {
      const message = error.message || 'Failed to submit answer.';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to get quiz results
export const getQuizResults = createAsyncThunk(
  'assessment/getResults',
  async (sessionId, thunkAPI) => {
    try {
      const data = await assessmentService.getQuizResults(sessionId);
      // Assuming service returns { success: true, data: { results } } or similar
      return data.results;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch quiz results.';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk to analyze text with NLP
export const analyzeTextWithNlp = createAsyncThunk(
  'assessment/analyzeText',
  async ({ text, questionId }, thunkAPI) => {
    try {
      const response = await assessmentService.analyzeTextResponse(text, questionId);

      if (response.status === 'error') {
        throw new Error(response.error || 'NLP analysis failed');
      }

      // If the user is authenticated, update their profile with the NLP data
      try {
        const { data: { user } } = await assessmentService.supabase.auth.getUser();
        if (user) {
          await assessmentService.updateUserProfileWithNlpData(user.id, response.data);
        }
      } catch (profileError) {
        console.error('Error updating user profile with NLP data:', profileError);
        // Continue even if profile update fails
      }

      return response.data;
    } catch (error) {
      const message = error.message || 'Failed to analyze text.';
      thunkAPI.dispatch(setMessage({ type: 'error', text: message }));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Assessment slice
const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    resetAssessment: () => initialState, // Action to reset quiz state
    // Add other specific reducers if needed
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    // Support for dynamic question paths
    setPreviousQuestion: (state, action) => {
      state.currentQuestion = action.payload.question;
      state.currentQuestionIndex = action.payload.index;
      // Don't change progress to avoid confusing the user
    },
    // NLP related reducers
    startNlpAnalysis: (state) => {
      state.isProcessingNlp = true;
      state.nlpError = null;
    },
    completeNlpAnalysis: (state, action) => {
      state.isProcessingNlp = false;
      state.nlpResults = action.payload;
      state.nlpError = null;
    },
    failNlpAnalysis: (state, action) => {
      state.isProcessingNlp = false;
      state.nlpError = action.payload;
    },
    clearNlpResults: (state) => {
      state.nlpResults = null;
      state.nlpError = null;
      state.isProcessingNlp = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Quiz Session
      .addCase(startQuizSession.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(startQuizSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessionId = action.payload.sessionId;
        state.currentQuestion = action.payload.nextQuestion;
        state.progress = action.payload.progress;
        state.isComplete = action.payload.isComplete;
        state.isError = false;
        state.error = null;
        state.currentQuestionIndex = 0; // Reset to first question

        // Store all questions if available
        if (action.payload.questions) {
          state.questions = action.payload.questions;
        } else {
          // If questions aren't provided, try to get them from the assessmentService
          try {
            state.questions = assessmentService.getAllQuestions();
          } catch (error) {
            console.warn('Failed to get all questions:', error);
            state.questions = [];
          }
        }
      })
      .addCase(startQuizSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.sessionId = null;
        state.currentQuestion = null;
        state.progress = 0;
        state.isComplete = false;
      })

      // Submit Quiz Answer
      .addCase(submitQuizAnswer.pending, (state) => {
        state.isLoading = true; // Indicate loading while submitting
        state.isError = false;
        state.error = null;
      })
      .addCase(submitQuizAnswer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuestion = action.payload.nextQuestion;
        state.progress = action.payload.progress;
        state.isComplete = action.payload.isComplete;
        state.isError = false;
        state.error = null;

        // Increment the question index if we have a next question
        if (action.payload.nextQuestion) {
          state.currentQuestionIndex += 1;
        }

        // If recommendations are available, store them
        if (action.payload.recommendations) {
          console.log('[assessmentSlice] Storing recommendations from submitQuizAnswer:', action.payload.recommendations);
          state.recommendations = {
            recommendationResults: action.payload.recommendations
          };
        }

        // If recommendedPrograms are available, store them directly
        if (action.payload.recommendedPrograms) {
          console.log('[assessmentSlice] Storing recommendedPrograms from submitQuizAnswer:', action.payload.recommendedPrograms);
          state.recommendedPrograms = action.payload.recommendedPrograms;
        }

        // Note: We don't store the answer itself in this slice,
        // assuming QuizInterface handles temporary answer state between submissions.
        // Alternatively, answers could be stored here or fetched with session status.
      })
      .addCase(submitQuizAnswer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        // Keep current question state as is on submission failure? Or clear?
        // Clearing might be confusing if it was a network error.
      })

      // Get Quiz Results
      .addCase(getQuizResults.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
        state.results = null;
        state.recommendations = null;
      })
      .addCase(getQuizResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.error = null;

        console.log('[assessmentSlice] getQuizResults.fulfilled payload:', action.payload);

        // Handle the new response format with fallbacks for missing data
        if (action.payload) {
          // Store the results data
          state.results = action.payload.data || {};

          // Store the recommendation results if available
          if (action.payload.recommendationResults) {
            state.recommendations = {
              recommendationResults: action.payload.recommendationResults
            };
          } else {
            // Provide a fallback empty array
            state.recommendations = {
              recommendationResults: []
            };
          }

          // Store the recommended programs with priority order:
          // 1. Direct recommendedPrograms in the payload
          // 2. recommendedPrograms in the data object
          // 3. Fallback to empty array
          if (action.payload.recommendedPrograms && action.payload.recommendedPrograms.length > 0) {
            state.recommendedPrograms = action.payload.recommendedPrograms;
            console.log('[assessmentSlice] Using payload.recommendedPrograms:', action.payload.recommendedPrograms);
          } else if (action.payload.data && action.payload.data.recommendedPrograms && action.payload.data.recommendedPrograms.length > 0) {
            state.recommendedPrograms = action.payload.data.recommendedPrograms;
            console.log('[assessmentSlice] Using payload.data.recommendedPrograms:', action.payload.data.recommendedPrograms);
          } else {
            // Fallback to empty array to prevent undefined errors
            state.recommendedPrograms = [];
            console.log('[assessmentSlice] No recommendations found, using empty array');
          }
        } else {
          // Provide fallbacks for completely missing payload
          state.results = {};
          state.recommendations = { recommendationResults: [] };
          state.recommendedPrograms = [];
          console.log('[assessmentSlice] No payload received, using fallbacks');
        }
      })
      .addCase(getQuizResults.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.results = null;
        state.recommendations = null;
      })

      // Analyze Text with NLP
      .addCase(analyzeTextWithNlp.pending, (state) => {
        state.isProcessingNlp = true;
        state.nlpError = null;
      })
      .addCase(analyzeTextWithNlp.fulfilled, (state, action) => {
        state.isProcessingNlp = false;
        state.nlpResults = action.payload;
        state.nlpError = null;
      })
      .addCase(analyzeTextWithNlp.rejected, (state, action) => {
        state.isProcessingNlp = false;
        state.nlpError = action.payload;
      });
  },
});

export const {
  resetAssessment,
  setRecommendations,
  setPreviousQuestion,
  startNlpAnalysis,
  completeNlpAnalysis,
  failNlpAnalysis,
  clearNlpResults
} = assessmentSlice.actions;

// Selector example (can create more specific selectors)
export const selectQuizState = (state) => state.assessment;

export default assessmentSlice.reducer;
