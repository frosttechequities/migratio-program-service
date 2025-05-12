/**
 * Calendar Slice
 * Redux slice for calendar state management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import calendarService from './calendarService';

// Initial state
const initialState = {
  events: [],
  integrations: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  selectedDate: new Date().toISOString(), // Store as ISO string
  selectedEvent: null,
  view: 'month', // 'month', 'week', 'day', 'agenda'
  filters: {
    eventTypes: ['milestone', 'task', 'deadline', 'appointment', 'reminder'],
    priorities: ['low', 'medium', 'high', 'critical'],
    statuses: ['scheduled', 'in_progress', 'completed', 'cancelled', 'delayed']
  }
};

// Get calendar events
export const getCalendarEvents = createAsyncThunk(
  'calendar/getEvents',
  async (_, thunkAPI) => {
    try {
      return await calendarService.getCalendarEvents(); // Use actual service call
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

// Export to iCalendar
export const exportToICalendar = createAsyncThunk(
  'calendar/exportToICalendar',
  async (options, thunkAPI) => {
    try {
      return await calendarService.exportToICalendar(options);
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

// Export to Google Calendar
export const exportToGoogleCalendar = createAsyncThunk(
  'calendar/exportToGoogleCalendar',
  async (options, thunkAPI) => {
    try {
      const events = thunkAPI.getState().calendar.events; // Still need events for mock/external API
      return await calendarService.exportToGoogleCalendar(events, options);
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

// Export to Outlook Calendar
export const exportToOutlookCalendar = createAsyncThunk(
  'calendar/exportToOutlookCalendar',
  async (options, thunkAPI) => {
    try {
      const events = thunkAPI.getState().calendar.events;
      return await calendarService.exportToOutlookCalendar(events, options);
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

// Export to Apple Calendar
export const exportToAppleCalendar = createAsyncThunk(
  'calendar/exportToAppleCalendar',
  async (options, thunkAPI) => {
    try {
      // const events = thunkAPI.getState().calendar.events; // Not needed if service handles it
      return await calendarService.exportToAppleCalendar(options);
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

// Create calendar event
export const createCalendarEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData, thunkAPI) => {
    try {
      return await calendarService.createCalendarEvent(eventData);
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

// Update calendar event
export const updateCalendarEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ eventId, eventData }, thunkAPI) => {
    try {
      return await calendarService.updateCalendarEvent(eventId, eventData);
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

// Delete calendar event
export const deleteCalendarEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (eventId, thunkAPI) => {
    try {
      return await calendarService.deleteCalendarEvent(eventId);
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

// Get calendar integrations
export const getCalendarIntegrations = createAsyncThunk(
  'calendar/getIntegrations',
  async (_, thunkAPI) => {
    try {
      return await calendarService.getCalendarIntegrations(); // Use actual service call
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

// Add calendar integration
export const addCalendarIntegration = createAsyncThunk(
  'calendar/addIntegration',
  async (integrationData, thunkAPI) => {
    try {
      return await calendarService.addCalendarIntegration(integrationData);
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

// Remove calendar integration
export const removeCalendarIntegration = createAsyncThunk(
  'calendar/removeIntegration',
  async (integrationId, thunkAPI) => {
    try {
      return await calendarService.removeCalendarIntegration(integrationId);
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

// Calendar slice
export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setSelectedDate: (state, action) => {
      if (action.payload instanceof Date) {
        state.selectedDate = action.payload.toISOString();
      } else {
        state.selectedDate = action.payload; 
      }
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Get calendar events
      .addCase(getCalendarEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCalendarEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = action.payload.data?.events || action.payload.events || action.payload || []; // Adjust based on actual API response
      })
      .addCase(getCalendarEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Export to iCalendar, Google, Outlook, Apple (assuming they don't change state beyond loading/success/error)
      .addCase(exportToICalendar.pending, (state) => { state.isLoading = true; })
      .addCase(exportToICalendar.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; })
      .addCase(exportToICalendar.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      
      .addCase(exportToGoogleCalendar.pending, (state) => { state.isLoading = true; })
      .addCase(exportToGoogleCalendar.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; })
      .addCase(exportToGoogleCalendar.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })

      .addCase(exportToOutlookCalendar.pending, (state) => { state.isLoading = true; })
      .addCase(exportToOutlookCalendar.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; })
      .addCase(exportToOutlookCalendar.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })

      .addCase(exportToAppleCalendar.pending, (state) => { state.isLoading = true; })
      .addCase(exportToAppleCalendar.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; })
      .addCase(exportToAppleCalendar.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      
      // Create calendar event
      .addCase(createCalendarEvent.pending, (state) => { state.isLoading = true; })
      .addCase(createCalendarEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events.push(action.payload.data?.event || action.payload); // Adjust based on API response
      })
      .addCase(createCalendarEvent.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      
      // Update calendar event
      .addCase(updateCalendarEvent.pending, (state) => { state.isLoading = true; })
      .addCase(updateCalendarEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedEvent = action.payload.data?.event || action.payload;
        state.events = state.events.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event // Assuming events have 'id'
        );
      })
      .addCase(updateCalendarEvent.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      
      // Delete calendar event
      .addCase(deleteCalendarEvent.pending, (state) => { state.isLoading = true; })
      .addCase(deleteCalendarEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Assuming action.payload is the eventId or an object {id: eventId}
        const eventIdToRemove = action.payload.id || action.payload; 
        state.events = state.events.filter(event => event.id !== eventIdToRemove);
      })
      .addCase(deleteCalendarEvent.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      
      // Get calendar integrations
      .addCase(getCalendarIntegrations.pending, (state) => { state.isLoading = true; })
      .addCase(getCalendarIntegrations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.integrations = action.payload.data?.integrations || action.payload.integrations || action.payload || []; // Adjust
      })
      .addCase(getCalendarIntegrations.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      
      // Add calendar integration
      .addCase(addCalendarIntegration.pending, (state) => { state.isLoading = true; })
      .addCase(addCalendarIntegration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.integrations.push(action.payload.data?.integration || action.payload); // Adjust
      })
      .addCase(addCalendarIntegration.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      
      // Remove calendar integration
      .addCase(removeCalendarIntegration.pending, (state) => { state.isLoading = true; })
      .addCase(removeCalendarIntegration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const integrationIdToRemove = action.payload.id || action.payload;
        state.integrations = state.integrations.filter(
          integration => integration.id !== integrationIdToRemove
        );
      })
      .addCase(removeCalendarIntegration.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
  }
});

export const { reset, setSelectedDate, setSelectedEvent, setView, setFilters } = calendarSlice.actions;
export default calendarSlice.reducer;
