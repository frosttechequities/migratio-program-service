import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Flag as FlagIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarTodayIcon,
  FilterList as FilterListIcon,
  Check as CheckIcon,
  Alarm as AlarmIcon,
  NotificationsActive as NotificationsActiveIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Upcoming deadlines widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - Deadlines data
 * @returns {React.ReactNode} Upcoming deadlines widget component
 */
const UpcomingDeadlines = ({ data }) => {
  const theme = useTheme();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedDeadline, setSelectedDeadline] = useState(null);

  const isFilterMenuOpen = Boolean(filterAnchorEl);
  const isActionMenuOpen = Boolean(menuAnchorEl);

  // Filter options
  const filters = [
    { value: 'all', label: 'All Deadlines' },
    { value: 'upcoming', label: 'Upcoming (7 days)' },
    { value: 'critical', label: 'Critical (3 days)' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'completed', label: 'Completed' }
  ];

  // If no data is provided, use mock data
  const deadlines = Array.isArray(data) ? data : [
    {
      id: '1',
      title: 'Submit Language Test Results',
      description: 'Upload your IELTS test results to your profile',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      status: 'upcoming',
      priority: 'high',
      type: 'document',
      roadmapId: 'road1',
      roadmapTitle: 'Express Entry Immigration',
      phaseTitle: 'Preparation Phase',
      milestoneTitle: 'Language Testing'
    },
    {
      id: '2',
      title: 'Complete Medical Examination',
      description: 'Schedule and complete your immigration medical examination',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      status: 'upcoming',
      priority: 'medium',
      type: 'task',
      roadmapId: 'road1',
      roadmapTitle: 'Express Entry Immigration',
      phaseTitle: 'Application Phase',
      milestoneTitle: 'Submit PR Application'
    },
    {
      id: '3',
      title: 'Pay Application Fee',
      description: 'Pay the required application processing fee',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      status: 'upcoming',
      priority: 'medium',
      type: 'task',
      roadmapId: 'road1',
      roadmapTitle: 'Express Entry Immigration',
      phaseTitle: 'Application Phase',
      milestoneTitle: 'Submit PR Application'
    },
    {
      id: '4',
      title: 'Submit Express Entry Profile',
      description: 'Complete and submit your Express Entry profile',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: 'overdue',
      priority: 'high',
      type: 'task',
      roadmapId: 'road1',
      roadmapTitle: 'Express Entry Immigration',
      phaseTitle: 'Preparation Phase',
      milestoneTitle: 'Create Express Entry Profile'
    },
    {
      id: '5',
      title: 'Police Clearance Certificate',
      description: 'Obtain police clearance certificate from your home country',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      status: 'completed',
      priority: 'high',
      type: 'document',
      roadmapId: 'road1',
      roadmapTitle: 'Express Entry Immigration',
      phaseTitle: 'Document Collection',
      milestoneTitle: 'Gather Required Documents'
    }
  ];

  // Handle filter menu
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    handleFilterClose();
  };

  // Handle deadline action menu
  const handleMenuClick = (event, deadline) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedDeadline(deadline);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedDeadline(null);
  };

  // Mark deadline as completed
  const handleMarkAsCompleted = (deadline) => {
    // In a real app, this would be an API call
    console.log('Marking deadline as completed:', deadline.id);
    handleMenuClose();
  };

  // Set reminder for deadline
  const handleSetReminder = (deadline) => {
    // In a real app, this would be an API call
    console.log('Setting reminder for deadline:', deadline.id);
    handleMenuClose();
  };

  // Filter deadlines
  const filteredDeadlines = deadlines.filter(deadline => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'completed') return deadline.status === 'completed';
    if (selectedFilter === 'overdue') return deadline.status === 'overdue';

    const today = new Date();
    const dueDate = new Date(deadline.dueDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (selectedFilter === 'upcoming') return diffDays <= 7 && diffDays >= 0 && deadline.status !== 'completed';
    if (selectedFilter === 'critical') return diffDays <= 3 && diffDays >= 0 && deadline.status !== 'completed';

    return true;
  });

  // Sort deadlines by due date (closest first)
  const sortedDeadlines = [...filteredDeadlines].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';

    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0 && diffDays <= 7) {
      return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }

    if (diffDays < 0 && diffDays >= -7) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`;
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  // Get status color
  const getStatusColor = (deadline) => {
    if (deadline.status === 'completed') return theme.palette.success.main;
    if (deadline.status === 'overdue') return theme.palette.error.main;

    const today = new Date();
    const dueDate = new Date(deadline.dueDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 3 && diffDays >= 0) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  // Get status text
  const getStatusText = (deadline) => {
    if (deadline.status === 'completed') return 'Completed';
    if (deadline.status === 'overdue') return 'Overdue';

    const today = new Date();
    const dueDate = new Date(deadline.dueDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    if (diffDays > 1) return `Due in ${diffDays} days`;

    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
  };

  // Get icon based on deadline type
  const getDeadlineIcon = (type) => {
    switch (type) {
      case 'document':
        return <FlagIcon color="info" />;
      case 'task':
        return <AssignmentIcon color="primary" />;
      default:
        return <EventIcon color="secondary" />;
    }
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
          <CalendarTodayIcon color="primary" />
          Upcoming Deadlines
        </Typography>

        <Box>
          <Tooltip title="Filter deadlines">
            <IconButton
              size="small"
              onClick={handleFilterClick}
              aria-controls={isFilterMenuOpen ? 'deadline-filter-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isFilterMenuOpen ? 'true' : undefined}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          <Menu
            id="deadline-filter-menu"
            anchorEl={filterAnchorEl}
            open={isFilterMenuOpen}
            onClose={handleFilterClose}
            MenuListProps={{
              'aria-labelledby': 'deadline-filter-button',
            }}
          >
            {filters.map((filter) => (
              <MenuItem
                key={filter.value}
                onClick={() => handleFilterSelect(filter.value)}
                selected={selectedFilter === filter.value}
              >
                {filter.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Deadlines list */}
      {sortedDeadlines.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No deadlines
            {selectedFilter !== 'all' && ` matching the "${
              filters.find(f => f.value === selectedFilter)?.label || selectedFilter
            }" filter`}
          </Typography>
          <Button
            component={RouterLink}
            to="/roadmap"
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
            startIcon={<TimelineIcon />}
          >
            View Roadmap
          </Button>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {sortedDeadlines.map((deadline, index) => (
            <React.Fragment key={deadline.id}>
              <ListItem
                sx={{
                  px: 2,
                  py: 1.5,
                  backgroundColor: deadline.status === 'completed'
                    ? alpha(theme.palette.success.main, 0.05)
                    : deadline.status === 'overdue'
                      ? alpha(theme.palette.error.main, 0.05)
                      : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getDeadlineIcon(deadline.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 1, sm: 0 }
                    }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: deadline.status === 'completed' ? 'normal' : 'bold',
                          textDecoration: deadline.status === 'completed' ? 'line-through' : 'none',
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                      >
                        {deadline.title}
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        alignSelf: { xs: 'flex-end', sm: 'center' }
                      }}>
                        <Chip
                          label={getStatusText(deadline)}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getStatusColor(deadline), 0.1),
                            color: getStatusColor(deadline),
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            height: { xs: 20, sm: 24 }
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, deadline)}
                          aria-label="deadline actions"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {deadline.description}
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        mt: 1,
                        gap: { xs: 1, sm: 2 }
                      }}>
                        <Chip
                          icon={<EventIcon fontSize="small" />}
                          label={formatDate(deadline.dueDate)}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: { xs: 20, sm: 24 },
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        />
                        <Chip
                          label={deadline.roadmapTitle}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: { xs: 20, sm: 24 },
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            maxWidth: { xs: '100%', sm: 200 },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        />
                      </Box>
                    </Box>
                  }
                  secondaryTypographyProps={{ component: 'div' }}
                />
              </ListItem>
              {index < sortedDeadlines.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Action menu for deadlines */}
      <Menu
        id="deadline-action-menu"
        anchorEl={menuAnchorEl}
        open={isActionMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'deadline-action-button',
        }}
      >
        {selectedDeadline && selectedDeadline.status !== 'completed' && (
          <MenuItem onClick={() => handleMarkAsCompleted(selectedDeadline)}>
            <CheckIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as completed
          </MenuItem>
        )}
        <MenuItem onClick={() => handleSetReminder(selectedDeadline)}>
          <NotificationsActiveIcon fontSize="small" sx={{ mr: 1 }} />
          Set reminder
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to={`/roadmap/${selectedDeadline?.roadmapId}`}
          onClick={handleMenuClose}
        >
          <ArrowForwardIcon fontSize="small" sx={{ mr: 1 }} />
          View in roadmap
        </MenuItem>
      </Menu>

      {/* Footer */}
      {sortedDeadlines.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Button
            startIcon={<AlarmIcon />}
            size="small"
            onClick={() => console.log('Set reminders for all')}
          >
            Set Reminders
          </Button>
          <Button
            component={RouterLink}
            to="/roadmap"
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            View All
          </Button>
        </Box>
      )}
    </Paper>
  );
};

UpcomingDeadlines.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      priority: PropTypes.string,
      type: PropTypes.string,
      roadmapId: PropTypes.string,
      roadmapTitle: PropTypes.string,
      phaseTitle: PropTypes.string,
      milestoneTitle: PropTypes.string
    })
  )
};

export default UpcomingDeadlines;
