import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import CalendarEventItem from './CalendarEventItem';
import { 
  generateCalendarGrid, 
  isToday, 
  isPastDate 
} from '../../utils/calendarUtils';

/**
 * Calendar month view component
 * @param {Object} props - Component props
 * @param {Array} props.events - Calendar events
 * @param {Date} props.currentDate - Current date
 * @param {Function} props.onDateClick - Date click handler
 * @param {Function} props.onEventClick - Event click handler
 * @param {Function} props.onEventMenuClick - Event menu click handler
 * @returns {React.ReactNode} Calendar month view component
 */
const CalendarMonthView = ({ 
  events = [], 
  currentDate = new Date(), 
  onDateClick, 
  onEventClick, 
  onEventMenuClick 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Generate calendar grid
  const calendarGrid = generateCalendarGrid(currentYear, currentMonth, events);
  
  // Handle date click
  const handleDateClick = (date) => {
    if (onDateClick && date) {
      onDateClick(date);
    }
  };
  
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
  
  // Determine how many events to show per day
  const getMaxEventsToShow = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };
  
  // Render day cell
  const renderDayCell = (cell, index) => {
    const { day, date, events: dayEvents } = cell;
    
    // Empty cell
    if (!day) {
      return (
        <Paper
          key={`empty-${index}`}
          elevation={0}
          sx={{
            height: '100%',
            minHeight: { xs: 80, sm: 100, md: 120 },
            backgroundColor: alpha(theme.palette.background.default, 0.5),
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        />
      );
    }
    
    const isCurrentDay = date && isToday(new Date(date));
    const isPast = date && isPastDate(new Date(date));
    const maxEventsToShow = getMaxEventsToShow();
    const hasMoreEvents = dayEvents.length > maxEventsToShow;
    const visibleEvents = dayEvents.slice(0, maxEventsToShow);
    
    return (
      <Paper
        key={`day-${day}`}
        elevation={0}
        onClick={() => handleDateClick(date)}
        sx={{
          height: '100%',
          minHeight: { xs: 80, sm: 100, md: 120 },
          p: 1,
          backgroundColor: isCurrentDay 
            ? alpha(theme.palette.primary.main, 0.05) 
            : 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: isCurrentDay ? 'primary.main' : 'divider',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05)
          },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: isCurrentDay ? 'bold' : 'medium',
              color: isPast ? 'text.secondary' : 'text.primary'
            }}
          >
            {day}
          </Typography>
          
          {dayEvents.length > 0 && (
            <Typography variant="caption" color="primary.main">
              {dayEvents.length}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {visibleEvents.map((event) => (
            <Box key={event.id} sx={{ mb: 0.5 }}>
              <CalendarEventItem
                event={event}
                onClick={handleEventClick}
                onMenuClick={handleEventMenuClick}
                variant="compact"
              />
            </Box>
          ))}
          
          {hasMoreEvents && (
            <Typography
              variant="caption"
              color="primary"
              sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}
            >
              +{dayEvents.length - maxEventsToShow} more
            </Typography>
          )}
        </Box>
      </Paper>
    );
  };
  
  return (
    <Box>
      {/* Weekday headers */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <Grid item key={day} xs={12/7}>
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ display: 'block', fontWeight: 'medium' }}
            >
              {isMobile ? day.charAt(0) : day}
            </Typography>
          </Grid>
        ))}
      </Grid>
      
      {/* Calendar grid */}
      <Grid container spacing={1}>
        {calendarGrid.map((cell, index) => (
          <Grid item key={`cell-${index}`} xs={12/7}>
            {renderDayCell(cell, index)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

CalendarMonthView.propTypes = {
  events: PropTypes.array,
  currentDate: PropTypes.instanceOf(Date),
  onDateClick: PropTypes.func,
  onEventClick: PropTypes.func,
  onEventMenuClick: PropTypes.func
};

export default CalendarMonthView;
