import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Chip, 
  Tooltip, 
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Flag as FlagIcon,
  Assignment as AssignmentIcon,
  Alarm as AlarmIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Room as RoomIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { formatTime } from '../../utils/calendarUtils';

/**
 * Calendar event item component
 * @param {Object} props - Component props
 * @param {Object} props.event - Event data
 * @param {Function} props.onClick - Click handler
 * @param {Function} props.onMenuClick - Menu click handler
 * @param {string} props.variant - Display variant ('compact', 'default', 'detailed')
 * @returns {React.ReactNode} Calendar event item component
 */
const CalendarEventItem = ({ event, onClick, onMenuClick, variant = 'default' }) => {
  const theme = useTheme();
  
  // Get event color
  const getEventColor = () => {
    if (event.color) return event.color;
    
    switch (event.eventType) {
      case 'milestone':
        return theme.palette.purple.main;
      case 'task':
        return theme.palette.success.main;
      case 'deadline':
        return theme.palette.error.main;
      case 'appointment':
        return theme.palette.primary.main;
      case 'reminder':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Get event icon
  const getEventIcon = () => {
    switch (event.eventType) {
      case 'milestone':
        return <FlagIcon fontSize="small" />;
      case 'task':
        return <AssignmentIcon fontSize="small" />;
      case 'deadline':
        return <AlarmIcon fontSize="small" />;
      case 'appointment':
        return <EventIcon fontSize="small" />;
      case 'reminder':
        return <NotificationsIcon fontSize="small" />;
      default:
        return <EventIcon fontSize="small" />;
    }
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (event.status) {
      case 'completed':
        return theme.palette.success.main;
      case 'in_progress':
        return theme.palette.primary.main;
      case 'cancelled':
        return theme.palette.error.main;
      case 'delayed':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Format status text
  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Check if event is all day
  const isAllDay = event.allDay || !event.endDate;
  
  // Format time
  const getTimeDisplay = () => {
    if (isAllDay) return 'All Day';
    
    const startTime = formatTime(new Date(event.startDate));
    const endTime = event.endDate ? formatTime(new Date(event.endDate)) : '';
    
    return endTime ? `${startTime} - ${endTime}` : startTime;
  };
  
  // Handle click
  const handleClick = (e) => {
    if (onClick) onClick(event);
  };
  
  // Handle menu click
  const handleMenuClick = (e) => {
    e.stopPropagation();
    if (onMenuClick) onMenuClick(e, event);
  };
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="subtitle2">{event.title}</Typography>
            <Typography variant="caption" display="block">
              {getTimeDisplay()}
            </Typography>
            {event.location && (
              <Typography variant="caption" display="block">
                <RoomIcon fontSize="inherit" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
                {event.location}
              </Typography>
            )}
          </Box>
        }
        arrow
      >
        <Box
          onClick={handleClick}
          sx={{
            backgroundColor: getEventColor(),
            color: '#fff',
            borderRadius: '4px',
            p: 0.5,
            fontSize: '0.75rem',
            fontWeight: 'medium',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            '&:hover': {
              filter: 'brightness(0.9)'
            }
          }}
        >
          {event.title}
        </Box>
      </Tooltip>
    );
  }
  
  // Detailed variant
  if (variant === 'detailed') {
    return (
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          borderLeft: `4px solid ${getEventColor()}`,
          borderRadius: 1,
          backgroundColor: alpha(getEventColor(), 0.05),
          mb: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: alpha(getEventColor(), 0.1)
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: alpha(getEventColor(), 0.1),
                color: getEventColor()
              }}
            >
              {getEventIcon()}
            </Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {event.title}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={formatStatus(event.status)}
              size="small"
              sx={{
                backgroundColor: alpha(getStatusColor(), 0.1),
                color: getStatusColor(),
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            />
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ mt: 1 }}>
          {event.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {event.description}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              {getTimeDisplay()}
            </Typography>
            
            {event.location && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <RoomIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                {event.location}
              </Typography>
            )}
            
            {event.roadmapTitle && (
              <Chip
                label={event.roadmapTitle}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            )}
            
            {event.phaseTitle && (
              <Chip
                label={event.phaseTitle}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            )}
          </Box>
        </Box>
      </Box>
    );
  }
  
  // Default variant
  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        p: 1,
        borderRadius: 1,
        mb: 1,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05)
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: alpha(getEventColor(), 0.1),
          color: getEventColor(),
          mr: 1.5
        }}
      >
        {getEventIcon()}
      </Box>
      
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" fontWeight="medium">
            {event.title}
          </Typography>
          
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
            {getTimeDisplay()}
          </Typography>
          
          {event.location && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <RoomIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              {event.location}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

CalendarEventItem.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    eventType: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    allDay: PropTypes.bool,
    location: PropTypes.string,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string,
    color: PropTypes.string,
    roadmapTitle: PropTypes.string,
    phaseTitle: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func,
  onMenuClick: PropTypes.func,
  variant: PropTypes.oneOf(['compact', 'default', 'detailed'])
};

export default CalendarEventItem;
