import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import CalendarToolbar from './CalendarToolbar';
import CalendarMonthView from './CalendarMonthView';
import CalendarAgendaView from './CalendarAgendaView';
import CalendarEventDialog from './CalendarEventDialog';
import { applyFilters, downloadICSFile } from '../../utils/calendarUtils';

/**
 * Calendar component
 * @param {Object} props - Component props
 * @param {Array} props.events - Calendar events
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onCreateEvent - Create event handler
 * @param {Function} props.onUpdateEvent - Update event handler
 * @param {Function} props.onDeleteEvent - Delete event handler
 * @param {Function} props.onExportEvents - Export events handler
 * @returns {React.ReactNode} Calendar component
 */
const Calendar = ({ 
  events = [], 
  isLoading = false, 
  onCreateEvent, 
  onUpdateEvent, 
  onDeleteEvent,
  onExportEvents
}) => {
  const theme = useTheme();
  
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [filters, setFilters] = useState({
    eventTypes: [],
    priorities: [],
    statuses: []
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
  const [contextMenuEvent, setContextMenuEvent] = useState(null);
  
  // Filtered events
  const filteredEvents = applyFilters(events, filters);
  
  // Handle previous month/week/day
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  // Handle next month/week/day
  const handleNext = () => {
    const newDate = new Date(currentDate);
    
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  // Handle today
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  // Handle view change
  const handleViewChange = (newView) => {
    setView(newView);
  };
  
  // Handle filters change
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Handle date click
  const handleDateClick = (date) => {
    setCurrentDate(date);
    
    // If in month view, switch to day view
    if (view === 'month') {
      // For now, just stay in month view
      // setView('day');
    }
  };
  
  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };
  
  // Handle event menu click
  const handleEventMenuClick = (e, event) => {
    setContextMenuAnchor(e.currentTarget);
    setContextMenuEvent(event);
  };
  
  // Handle context menu close
  const handleContextMenuClose = () => {
    setContextMenuAnchor(null);
    setContextMenuEvent(null);
  };
  
  // Handle edit event from context menu
  const handleEditEvent = () => {
    setSelectedEvent(contextMenuEvent);
    setEventDialogOpen(true);
    handleContextMenuClose();
  };
  
  // Handle delete event from context menu
  const handleDeleteEvent = () => {
    if (onDeleteEvent && contextMenuEvent) {
      onDeleteEvent(contextMenuEvent.id);
    }
    handleContextMenuClose();
  };
  
  // Handle duplicate event from context menu
  const handleDuplicateEvent = () => {
    if (contextMenuEvent) {
      const duplicatedEvent = { ...contextMenuEvent };
      delete duplicatedEvent.id;
      duplicatedEvent.title = `Copy of ${duplicatedEvent.title}`;
      
      setSelectedEvent(duplicatedEvent);
      setEventDialogOpen(true);
    }
    handleContextMenuClose();
  };
  
  // Handle add event
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };
  
  // Handle event dialog close
  const handleEventDialogClose = () => {
    setEventDialogOpen(false);
    setSelectedEvent(null);
  };
  
  // Handle event save
  const handleEventSave = (eventData) => {
    if (eventData.id) {
      // Update existing event
      if (onUpdateEvent) {
        onUpdateEvent(eventData);
      }
    } else {
      // Create new event
      if (onCreateEvent) {
        onCreateEvent(eventData);
      }
    }
    
    setEventDialogOpen(false);
    setSelectedEvent(null);
  };
  
  // Handle event delete
  const handleEventDelete = (eventId) => {
    if (onDeleteEvent) {
      onDeleteEvent(eventId);
    }
    
    setEventDialogOpen(false);
    setSelectedEvent(null);
  };
  
  // Handle export
  const handleExport = (format) => {
    if (format === 'ical') {
      // Download ICS file directly
      downloadICSFile(filteredEvents);
    } else if (onExportEvents) {
      // Use the provided export handler for other formats
      onExportEvents(format, filteredEvents);
    }
  };
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      {/* Toolbar */}
      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        filters={filters}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        onAddEvent={handleAddEvent}
      />
      
      {/* Calendar content */}
      <Box sx={{ position: 'relative', minHeight: 400 }}>
        {isLoading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: 400
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {view === 'month' && (
              <CalendarMonthView
                events={filteredEvents}
                currentDate={currentDate}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onEventMenuClick={handleEventMenuClick}
              />
            )}
            
            {view === 'agenda' && (
              <CalendarAgendaView
                events={filteredEvents}
                currentDate={currentDate}
                onEventClick={handleEventClick}
                onEventMenuClick={handleEventMenuClick}
              />
            )}
          </>
        )}
      </Box>
      
      {/* Event context menu */}
      <Menu
        anchorEl={contextMenuAnchor}
        open={Boolean(contextMenuAnchor)}
        onClose={handleContextMenuClose}
      >
        <MenuItem onClick={handleEditEvent}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDuplicateEvent}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteEvent}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleContextMenuClose}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleContextMenuClose}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Event dialog */}
      <CalendarEventDialog
        open={eventDialogOpen}
        event={selectedEvent}
        onClose={handleEventDialogClose}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
      />
    </Paper>
  );
};

Calendar.propTypes = {
  events: PropTypes.array,
  isLoading: PropTypes.bool,
  onCreateEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onExportEvents: PropTypes.func
};

export default Calendar;
