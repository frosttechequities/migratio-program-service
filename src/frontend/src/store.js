import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import profileReducer from './features/profile/profileSlice';
import assessmentReducer from './features/assessment/assessmentSlice';
import documentReducer from './features/documents/documentSlice';
import roadmapReducer from './features/roadmap/roadmapSlice';
import dashboardReducer from './features/dashboard/dashboardSlice';
import uiReducer from './features/ui/uiSlice';
import calendarReducer from './features/calendar/calendarSlice';
import programReducer from './features/programs/programSlice';
import recommendationReducer from './features/recommendations/recommendationSlice';
import pdfReducer from './features/pdf/pdfSlice';
import immigrationReducer from './features/immigration/immigrationSlice';
import comparisonReducer from './features/comparison/comparisonSlice';
import resourceReducer from './features/resources/resourceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    assessment: assessmentReducer,
    documents: documentReducer,
    roadmap: roadmapReducer,
    dashboard: dashboardReducer,
    ui: uiReducer,
    calendar: calendarReducer,
    programs: programReducer,
    recommendations: recommendationReducer,
    pdf: pdfReducer,
    immigration: immigrationReducer,
    comparison: comparisonReducer,
    resources: resourceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'auth/login/fulfilled',
          'auth/register/fulfilled',
          'calendar/setSelectedDate' // If setSelectedDate might receive a Date object
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp', 'payload'], // 'payload' for setSelectedDate if it's a Date object
        // Ignore these paths in the state
        ignoredPaths: ['auth.user', 'profile.data', 'calendar.selectedDate'],
      },
    }),
});

export { store };
