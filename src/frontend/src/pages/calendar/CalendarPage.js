import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Home as HomeIcon,
  Event as EventIcon
} from '@mui/icons-material';
import Calendar from '../../components/calendar/Calendar';
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  exportToICalendar,
  exportToGoogleCalendar,
  exportToOutlookCalendar,
  exportToAppleCalendar,
  reset
} from '../../features/calendar/calendarSlice';

/**
 * Calendar page component
 * @returns {React.ReactNode} Calendar page component
 */
const CalendarPage = () => {
  const dispatch = useDispatch();

  // Get calendar state from Redux store
  const calendarState = useSelector(state => state.calendar);
  const { events = [], isLoading = false, isSuccess = false, isError = false, message = '' } = calendarState || {};

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

  // Load calendar events on mount
  useEffect(() => {
    dispatch(getCalendarEvents());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Handle snackbar
  useEffect(() => {
    if (isSuccess) {
      setSnackbarMessage('Operation completed successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      dispatch(reset());
    }

    if (isError) {
      setSnackbarMessage(message || 'An error occurred');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Handle create event
  const handleCreateEvent = (eventData) => {
    dispatch(createCalendarEvent(eventData));
  };

  // Handle update event
  const handleUpdateEvent = (eventData) => {
    dispatch(updateCalendarEvent({ eventId: eventData.id, eventData }));
  };

  // Handle delete event
  const handleDeleteEvent = (eventId) => {
    dispatch(deleteCalendarEvent(eventId));
  };

  // Handle export events
  const handleExportEvents = (format, events) => {
    switch (format) {
      case 'google':
        dispatch(exportToGoogleCalendar());
        break;
      case 'outlook':
        dispatch(exportToOutlookCalendar());
        break;
      case 'apple':
        dispatch(exportToAppleCalendar());
        break;
      default:
        dispatch(exportToICalendar());
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <EventIcon fontSize="small" sx={{ mr: 0.5 }} />
          Calendar
        </Typography>
      </Breadcrumbs>

      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Calendar
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your immigration journey events, deadlines, and appointments
      </Typography>

      {/* Calendar */}
      <Box sx={{ mt: 4 }}>
        <Calendar
          events={events}
          isLoading={isLoading}
          onCreateEvent={handleCreateEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          onExportEvents={handleExportEvents}
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CalendarPage;
