import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  Event as EventIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getCalendarEvents } from '../../features/calendar/calendarSlice';
import CalendarEventItem from '../calendar/CalendarEventItem';
import { getUpcomingEvents } from '../../utils/calendarUtils';

/**
 * Calendar widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - Task data for calendar events
 * @returns {React.ReactNode} Calendar widget component
 */
const CalendarWidget = ({ data }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Get calendar events from Redux store
  const { events, isLoading } = useSelector(state => state.calendar || { events: [], isLoading: false });

  // Convert task data to calendar events format if provided
  const convertTasksToEvents = (tasks) => {
    if (!tasks) return [];

    return tasks.map(task => ({
      id: task._id,
      title: task.title,
      description: task.description || '',
      eventType: 'task',
      startDate: task.dueDate,
      endDate: task.dueDate,
      allDay: true,
      status: task.status,
      priority: task.priority || 'medium',
      roadmapId: task.roadmapId || '',
      roadmapTitle: task.roadmapTitle || '',
      phaseTitle: task.phaseTitle || '',
      milestoneTitle: task.milestoneTitle || ''
    }));
  };

  // Use provided data or events from Redux store
  const calendarEvents = data ? convertTasksToEvents(data) : events;

  // Get upcoming events
  const upcomingEvents = getUpcomingEvents(calendarEvents, 30, 5);

  // Load calendar events on mount
  useEffect(() => {
    if (!data && events.length === 0 && !isLoading) {
      dispatch(getCalendarEvents());
    }
  }, [dispatch, data, events.length, isLoading]);

  // Handle event click
  const handleEventClick = (event) => {
    // Navigate to calendar page with selected event
    // This would typically be handled by a router
    console.log('Event clicked:', event);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: alpha(theme.palette.primary.main, 0.05)
        }}
      >
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon color="primary" />
          Upcoming Events
        </Typography>
      </Box>

      {/* Events list */}
      <Box sx={{ p: 2 }}>
        {upcomingEvents.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No upcoming events
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your scheduled events and deadlines will appear here
            </Typography>
          </Box>
        ) : (
          <Box>
            {upcomingEvents.map(event => (
              <Box key={event.id} sx={{ mb: 2 }}>
                <CalendarEventItem
                  event={event}
                  onClick={handleEventClick}
                  variant="default"
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          component={RouterLink}
          to="/calendar"
          endIcon={<ArrowForwardIcon />}
          size="small"
        >
          View Calendar
        </Button>
      </Box>
    </Paper>
  );
};

CalendarWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.string.isRequired,
      dueDate: PropTypes.string,
      priority: PropTypes.string,
      roadmapId: PropTypes.string,
      roadmapTitle: PropTypes.string,
      phaseTitle: PropTypes.string,
      milestoneTitle: PropTypes.string
    })
  )
};

export default CalendarWidget;
