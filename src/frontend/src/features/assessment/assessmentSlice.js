import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assessmentService from './assessmentService';
import { setMessage } from '../ui/uiSlice'; // Assuming uiSlice exists for messages

const initialState = {
  sessionId: null,
  currentQuestion: null,
  progress: 0,
  isComplete: false,
  isLoading: false, // Loading state specific to assessment actions
  isError: false,
  error: null,
  quizResults: null, // To store the results of the quiz
  // Store answers within the session or link to QuizResponse model?
  // For now, keep answers managed locally in QuizInterface or fetch with session status
};

// Async thunk to start/resume a quiz session
export const startQuizSession = createAsyncThunk(
  'assessment/startSession',
  async (_, thunkAPI) => {
    try {
      // Calls the assessmentService function which hits the backend API
      const data = await assessmentService.startQuiz();
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
           // Potentially trigger recommendation fetch here or navigate
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

// Assessment slice
const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    resetAssessment: (state) => initialState, // Action to reset quiz state
    // Add other specific reducers if needed
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
        state.quizResults = null;
      })
      .addCase(getQuizResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizResults = action.payload;
        state.isError = false;
        state.error = null;
      })
      .addCase(getQuizResults.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.quizResults = null;
      });
  },
});

export const { resetAssessment } = assessmentSlice.actions;

// Selector example (can create more specific selectors)
export const selectQuizState = (state) => state.assessment;

export default assessmentSlice.reducer;
