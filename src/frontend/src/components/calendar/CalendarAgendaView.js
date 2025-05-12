import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Divider, 
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import CalendarEventItem from './CalendarEventItem';
import { 
  groupEventsByDate, 
  sortEventsByTime, 
  formatDate, 
  isToday 
} from '../../utils/calendarUtils';

/**
 * Calendar agenda view component
 * @param {Object} props - Component props
 * @param {Array} props.events - Calendar events
 * @param {Date} props.currentDate - Current date
 * @param {Function} props.onEventClick - Event click handler
 * @param {Function} props.onEventMenuClick - Event menu click handler
 * @returns {React.ReactNode} Calendar agenda view component
 */
const CalendarAgendaView = ({ 
  events = [], 
  currentDate = new Date(), 
  onEventClick, 
  onEventMenuClick 
}) => {
  const theme = useTheme();
  
  // Group events by date
  const groupedEvents = groupEventsByDate(events);
  
  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort();
  
  // Handle event click
  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };
  
  // Handle event menu click
  const handleEventMenuClick = (e, event) => {
    if (onEventMenuClick) {
      onEventMenuClick(e, event);
    }
  };
  
  // Render date group
  const renderDateGroup = (dateKey) => {
    const date = new Date(dateKey);
    const dateEvents = sortEventsByTime(groupedEvents[dateKey]);
    const isCurrentDay = isToday(date);
    
    return (
      <Box key={dateKey} sx={{ mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            backgroundColor: isCurrentDay 
              ? alpha(theme.palette.primary.main, 0.05) 
              : alpha(theme.palette.background.default, 0.5),
            borderRadius: 1,
            border: '1px solid',
            borderColor: isCurrentDay ? 'primary.main' : 'divider'
          }}
        >
          <Typography 
            variant="subtitle1" 
            fontWeight="medium"
            color={isCurrentDay ? 'primary.main' : 'text.primary'}
          >
            {formatDate(date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            {isCurrentDay && ' (Today)'}
          </Typography>
        </Paper>
        
        <Box sx={{ mt: 1.5 }}>
          {dateEvents.map((event) => (
            <Box key={event.id} sx={{ mb: 1.5 }}>
              <CalendarEventItem
                event={event}
                onClick={handleEventClick}
                onMenuClick={handleEventMenuClick}
                variant="detailed"
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  };
  
  // If no events
  if (sortedDates.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No events to display
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your filters or date range
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {sortedDates.map(renderDateGroup)}
    </Box>
  );
};

CalendarAgendaView.propTypes = {
  events: PropTypes.array,
  currentDate: PropTypes.instanceOf(Date),
  onEventClick: PropTypes.func,
  onEventMenuClick: PropTypes.func
};

export default CalendarAgendaView;
