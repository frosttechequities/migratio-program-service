import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import assessmentReducer from '../features/assessment/assessmentSlice';
import documentReducer from '../features/documents/documentSlice';
import documentOptimizationReducer from '../features/documents/documentOptimizationSlice';
import documentVerificationReducer from '../features/documents/documentVerificationSlice';
import roadmapReducer from '../features/roadmap/roadmapSlice';
import programReducer from '../features/programs/programSlice';
import recommendationReducer from '../features/recommendations/recommendationSlice';
import pdfReducer from '../features/pdf/pdfSlice';
import calendarReducer from '../features/calendar/calendarSlice';
import immigrationReducer from '../features/immigration/immigrationSlice';
import comparisonReducer from '../features/comparison/comparisonSlice';
import profileReducer from '../features/profile/profileSlice';
import resourceReducer from '../features/resources/resourceSlice'; // Import resource reducer
import dashboardReducer from '../features/dashboard/dashboardSlice'; // Import dashboard reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    assessment: assessmentReducer,
    documents: documentReducer,
    documentOptimization: documentOptimizationReducer,
    documentVerification: documentVerificationReducer,
    roadmap: roadmapReducer,
    programs: programReducer,
    recommendations: recommendationReducer,
    pdf: pdfReducer,
    calendar: calendarReducer,
    immigration: immigrationReducer,
    comparison: comparisonReducer,
    profile: profileReducer,
    resources: resourceReducer, // Add resource reducer
    dashboard: dashboardReducer, // Add dashboard reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user', 'documents.uploadProgress'],
      },
    }),
});

export { store };
