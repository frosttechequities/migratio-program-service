import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Button, 
  IconButton, 
  Typography, 
  Menu, 
  MenuItem, 
  Tooltip, 
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  ViewModule as ViewModuleIcon,
  ViewDay as ViewDayIcon,
  ViewAgenda as ViewAgendaIcon,
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon,
  Add as AddIcon
} from '@mui/icons-material';

/**
 * Calendar toolbar component
 * @param {Object} props - Component props
 * @param {Date} props.currentDate - Current date
 * @param {string} props.view - Current view ('month', 'week', 'day', 'agenda')
 * @param {Object} props.filters - Current filters
 * @param {Function} props.onPrevious - Previous button click handler
 * @param {Function} props.onNext - Next button click handler
 * @param {Function} props.onToday - Today button click handler
 * @param {Function} props.onViewChange - View change handler
 * @param {Function} props.onFiltersChange - Filters change handler
 * @param {Function} props.onExport - Export button click handler
 * @param {Function} props.onAddEvent - Add event button click handler
 * @returns {React.ReactNode} Calendar toolbar component
 */
const CalendarToolbar = ({ 
  currentDate = new Date(), 
  view = 'month', 
  filters = {},
  onPrevious, 
  onNext, 
  onToday, 
  onViewChange, 
  onFiltersChange,
  onExport,
  onAddEvent
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for menus
  const [viewMenuAnchor, setViewMenuAnchor] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  
  // Format date for display
  const formatDisplayDate = () => {
    const options = { month: 'long', year: 'numeric' };
    
    if (view === 'day') {
      options.day = 'numeric';
    } else if (view === 'week') {
      // For week view, show range
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.toLocaleDateString(undefined, { month: 'long' })} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      } else {
        return `${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    }
    
    return currentDate.toLocaleDateString(undefined, options);
  };
  
  // Handle view menu
  const handleViewMenuOpen = (event) => {
    setViewMenuAnchor(event.currentTarget);
  };
  
  const handleViewMenuClose = () => {
    setViewMenuAnchor(null);
  };
  
  const handleViewChange = (newView) => {
    if (onViewChange) {
      onViewChange(newView);
    }
    handleViewMenuClose();
  };
  
  // Handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };
  
  const handleFilterChange = (filterType, value) => {
    if (onFiltersChange) {
      const updatedFilters = { ...filters };
      
      if (!updatedFilters[filterType]) {
        updatedFilters[filterType] = [];
      }
      
      const index = updatedFilters[filterType].indexOf(value);
      
      if (index === -1) {
        updatedFilters[filterType].push(value);
      } else {
        updatedFilters[filterType].splice(index, 1);
      }
      
      onFiltersChange(updatedFilters);
    }
  };
  
  // Handle export menu
  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };
  
  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };
  
  const handleExport = (format) => {
    if (onExport) {
      onExport(format);
    }
    handleExportMenuClose();
  };
  
  // Get view icon
  const getViewIcon = () => {
    switch (view) {
      case 'month':
        return <ViewModuleIcon />;
      case 'week':
      case 'day':
        return <ViewDayIcon />;
      case 'agenda':
        return <ViewAgendaIcon />;
      default:
        return <ViewModuleIcon />;
    }
  };
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    
    if (filters.eventTypes && filters.eventTypes.length > 0 && 
        filters.eventTypes.length < 5) { // 5 is the total number of event types
      count++;
    }
    
    if (filters.priorities && filters.priorities.length > 0 && 
        filters.priorities.length < 4) { // 4 is the total number of priorities
      count++;
    }
    
    if (filters.statuses && filters.statuses.length > 0 && 
        filters.statuses.length < 5) { // 5 is the total number of statuses
      count++;
    }
    
    return count;
  };
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {/* Date navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onPrevious} size={isMobile ? 'small' : 'medium'}>
            <ChevronLeftIcon />
          </IconButton>
          
          <Typography 
            variant={isMobile ? 'subtitle1' : 'h6'} 
            sx={{ 
              fontWeight: 'bold', 
              mx: { xs: 1, sm: 2 },
              cursor: 'pointer'
            }}
            onClick={onToday}
          >
            {formatDisplayDate()}
          </Typography>
          
          <IconButton onClick={onNext} size={isMobile ? 'small' : 'medium'}>
            <ChevronRightIcon />
          </IconButton>
          
          {!isMobile && (
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<TodayIcon />}
              onClick={onToday}
              sx={{ ml: 2 }}
            >
              Today
            </Button>
          )}
        </Box>
        
        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          {/* Today button (mobile only) */}
          {isMobile && (
            <Tooltip title="Today">
              <IconButton onClick={onToday} size="small">
                <TodayIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {/* View selector */}
          <Tooltip title="Change view">
            <IconButton 
              onClick={handleViewMenuOpen}
              size={isMobile ? 'small' : 'medium'}
              color={viewMenuAnchor ? 'primary' : 'default'}
            >
              {getViewIcon()}
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={viewMenuAnchor}
            open={Boolean(viewMenuAnchor)}
            onClose={handleViewMenuClose}
          >
            <MenuItem 
              onClick={() => handleViewChange('month')}
              selected={view === 'month'}
            >
              <ViewModuleIcon fontSize="small" sx={{ mr: 1 }} />
              Month
            </MenuItem>
            <MenuItem 
              onClick={() => handleViewChange('agenda')}
              selected={view === 'agenda'}
            >
              <ViewAgendaIcon fontSize="small" sx={{ mr: 1 }} />
              Agenda
            </MenuItem>
          </Menu>
          
          {/* Filters */}
          <Tooltip title="Filters">
            <IconButton 
              onClick={handleFilterMenuOpen}
              size={isMobile ? 'small' : 'medium'}
              color={filterMenuAnchor || getActiveFilterCount() > 0 ? 'primary' : 'default'}
            >
              <FilterListIcon />
              {getActiveFilterCount() > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getActiveFilterCount()}
                </Box>
              )}
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={handleFilterMenuClose}
            PaperProps={{
              sx: { width: 250 }
            }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Event Types
            </Typography>
            <FormGroup sx={{ px: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.eventTypes || filters.eventTypes.includes('milestone')}
                    onChange={() => handleFilterChange('eventTypes', 'milestone')}
                    size="small"
                  />
                }
                label="Milestones"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.eventTypes || filters.eventTypes.includes('task')}
                    onChange={() => handleFilterChange('eventTypes', 'task')}
                    size="small"
                  />
                }
                label="Tasks"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.eventTypes || filters.eventTypes.includes('deadline')}
                    onChange={() => handleFilterChange('eventTypes', 'deadline')}
                    size="small"
                  />
                }
                label="Deadlines"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.eventTypes || filters.eventTypes.includes('appointment')}
                    onChange={() => handleFilterChange('eventTypes', 'appointment')}
                    size="small"
                  />
                }
                label="Appointments"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.eventTypes || filters.eventTypes.includes('reminder')}
                    onChange={() => handleFilterChange('eventTypes', 'reminder')}
                    size="small"
                  />
                }
                label="Reminders"
              />
            </FormGroup>
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Priority
            </Typography>
            <FormGroup sx={{ px: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.priorities || filters.priorities.includes('critical')}
                    onChange={() => handleFilterChange('priorities', 'critical')}
                    size="small"
                  />
                }
                label="Critical"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.priorities || filters.priorities.includes('high')}
                    onChange={() => handleFilterChange('priorities', 'high')}
                    size="small"
                  />
                }
                label="High"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.priorities || filters.priorities.includes('medium')}
                    onChange={() => handleFilterChange('priorities', 'medium')}
                    size="small"
                  />
                }
                label="Medium"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.priorities || filters.priorities.includes('low')}
                    onChange={() => handleFilterChange('priorities', 'low')}
                    size="small"
                  />
                }
                label="Low"
              />
            </FormGroup>
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Status
            </Typography>
            <FormGroup sx={{ px: 2, pb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.statuses || filters.statuses.includes('scheduled')}
                    onChange={() => handleFilterChange('statuses', 'scheduled')}
                    size="small"
                  />
                }
                label="Scheduled"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.statuses || filters.statuses.includes('in_progress')}
                    onChange={() => handleFilterChange('statuses', 'in_progress')}
                    size="small"
                  />
                }
                label="In Progress"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.statuses || filters.statuses.includes('completed')}
                    onChange={() => handleFilterChange('statuses', 'completed')}
                    size="small"
                  />
                }
                label="Completed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.statuses || filters.statuses.includes('cancelled')}
                    onChange={() => handleFilterChange('statuses', 'cancelled')}
                    size="small"
                  />
                }
                label="Cancelled"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!filters.statuses || filters.statuses.includes('delayed')}
                    onChange={() => handleFilterChange('statuses', 'delayed')}
                    size="small"
                  />
                }
                label="Delayed"
              />
            </FormGroup>
          </Menu>
          
          {/* Export */}
          <Tooltip title="Export">
            <IconButton 
              onClick={handleExportMenuOpen}
              size={isMobile ? 'small' : 'medium'}
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={handleExportMenuClose}
          >
            <MenuItem onClick={() => handleExport('ical')}>
              Export to iCalendar (.ics)
            </MenuItem>
            <MenuItem onClick={() => handleExport('google')}>
              Export to Google Calendar
            </MenuItem>
            <MenuItem onClick={() => handleExport('outlook')}>
              Export to Outlook
            </MenuItem>
            <MenuItem onClick={() => handleExport('apple')}>
              Export to Apple Calendar
            </MenuItem>
          </Menu>
          
          {/* Add event */}
          {!isMobile && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={onAddEvent}
              size="small"
              sx={{ ml: 1 }}
            >
              Add Event
            </Button>
          )}
          
          {isMobile && (
            <Tooltip title="Add Event">
              <IconButton 
                color="primary"
                onClick={onAddEvent}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      {/* Active filters */}
      {getActiveFilterCount() > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {filters.eventTypes && filters.eventTypes.length > 0 && 
           filters.eventTypes.length < 5 && (
            <Chip
              label={`Event Types: ${filters.eventTypes.length}`}
              size="small"
              onDelete={() => onFiltersChange({ ...filters, eventTypes: [] })}
            />
          )}
          
          {filters.priorities && filters.priorities.length > 0 && 
           filters.priorities.length < 4 && (
            <Chip
              label={`Priorities: ${filters.priorities.length}`}
              size="small"
              onDelete={() => onFiltersChange({ ...filters, priorities: [] })}
            />
          )}
          
          {filters.statuses && filters.statuses.length > 0 && 
           filters.statuses.length < 5 && (
            <Chip
              label={`Statuses: ${filters.statuses.length}`}
              size="small"
              onDelete={() => onFiltersChange({ ...filters, statuses: [] })}
            />
          )}
          
          <Button 
            variant="text" 
            size="small"
            onClick={() => onFiltersChange({
              eventTypes: [],
              priorities: [],
              statuses: []
            })}
          >
            Clear All
          </Button>
        </Box>
      )}
    </Box>
  );
};

CalendarToolbar.propTypes = {
  currentDate: PropTypes.instanceOf(Date),
  view: PropTypes.oneOf(['month', 'week', 'day', 'agenda']),
  filters: PropTypes.object,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  onToday: PropTypes.func,
  onViewChange: PropTypes.func,
  onFiltersChange: PropTypes.func,
  onExport: PropTypes.func,
  onAddEvent: PropTypes.func
};

export default CalendarToolbar;
