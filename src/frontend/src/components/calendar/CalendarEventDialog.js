import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Box,
  Typography,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon,
  Alarm as AlarmIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
// Temporarily disabled due to compatibility issues
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';

/**
 * Calendar event dialog component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Dialog open state
 * @param {Object} props.event - Event data for editing (null for new event)
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onDelete - Delete handler
 * @returns {React.ReactNode} Calendar event dialog component
 */
const CalendarEventDialog = ({ open, event, onClose, onSave, onDelete }) => {
  const theme = useTheme();
  const isEditMode = Boolean(event && event.id);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'task',
    startDate: new Date(),
    startTime: new Date(),
    endDate: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    allDay: false,
    location: '',
    status: 'scheduled',
    priority: 'medium',
    roadmapId: '',
    roadmapTitle: '',
    phaseTitle: '',
    milestoneTitle: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Initialize form data when event changes
  useEffect(() => {
    if (event) {
      const startDate = event.startDate ? new Date(event.startDate) : new Date();
      const endDate = event.endDate ? new Date(event.endDate) : new Date();

      setFormData({
        title: event.title || '',
        description: event.description || '',
        eventType: event.eventType || 'task',
        startDate: startDate,
        startTime: startDate,
        endDate: endDate,
        endTime: endDate,
        allDay: event.allDay || false,
        location: event.location || '',
        status: event.status || 'scheduled',
        priority: event.priority || 'medium',
        roadmapId: event.roadmapId || '',
        roadmapTitle: event.roadmapTitle || '',
        phaseTitle: event.phaseTitle || '',
        milestoneTitle: event.milestoneTitle || ''
      });
      setErrors({});
    } else {
      // Reset form for new event
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      setFormData({
        title: '',
        description: '',
        eventType: 'task',
        startDate: now,
        startTime: now,
        endDate: now,
        endTime: oneHourLater,
        allDay: false,
        location: '',
        status: 'scheduled',
        priority: 'medium',
        roadmapId: '',
        roadmapTitle: '',
        phaseTitle: '',
        milestoneTitle: ''
      });
      setErrors({});
    }
  }, [event]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle date change
  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle switch change
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.allDay && !formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.allDay && !formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (!formData.allDay && formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      const start = new Date(
        formData.startDate.getFullYear(),
        formData.startDate.getMonth(),
        formData.startDate.getDate(),
        formData.startTime.getHours(),
        formData.startTime.getMinutes()
      );

      const end = new Date(
        formData.endDate.getFullYear(),
        formData.endDate.getMonth(),
        formData.endDate.getDate(),
        formData.endTime.getHours(),
        formData.endTime.getMinutes()
      );

      if (end < start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) return;

    // Combine date and time
    const startDateTime = new Date(
      formData.startDate.getFullYear(),
      formData.startDate.getMonth(),
      formData.startDate.getDate(),
      formData.allDay ? 0 : formData.startTime.getHours(),
      formData.allDay ? 0 : formData.startTime.getMinutes()
    );

    const endDateTime = new Date(
      formData.endDate.getFullYear(),
      formData.endDate.getMonth(),
      formData.endDate.getDate(),
      formData.allDay ? 23 : formData.endTime.getHours(),
      formData.allDay ? 59 : formData.endTime.getMinutes()
    );

    // Prepare event data
    const eventData = {
      ...formData,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString()
    };

    // Remove unnecessary fields
    delete eventData.startTime;
    delete eventData.endTime;

    // Add id if editing
    if (isEditMode) {
      eventData.id = event.id;
    }

    if (onSave) {
      onSave(eventData);
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (isEditMode && onDelete) {
      onDelete(event.id);
    }
  };

  // Get event type icon
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'milestone':
        return <FlagIcon />;
      case 'task':
        return <AssignmentIcon />;
      case 'deadline':
        return <AlarmIcon />;
      case 'appointment':
        return <EventIcon />;
      case 'reminder':
        return <NotificationsIcon />;
      default:
        return <EventIcon />;
    }
  };

  // Get event type color
  const getEventTypeColor = (type) => {
    switch (type) {
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {isEditMode ? 'Edit Event' : 'Add New Event'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Temporarily disabled LocalizationProvider due to compatibility issues */}
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
          <Grid container spacing={2}>
            {/* Event Type */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="event-type-label">Event Type</InputLabel>
                <Select
                  labelId="event-type-label"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  label="Event Type"
                  startAdornment={
                    <Box
                      sx={{
                        color: getEventTypeColor(formData.eventType),
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {getEventTypeIcon(formData.eventType)}
                    </Box>
                  }
                >
                  <MenuItem value="milestone">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FlagIcon sx={{ mr: 1, color: theme.palette.purple.main }} />
                      Milestone
                    </Box>
                  </MenuItem>
                  <MenuItem value="task">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                      Task
                    </Box>
                  </MenuItem>
                  <MenuItem value="deadline">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AlarmIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                      Deadline
                    </Box>
                  </MenuItem>
                  <MenuItem value="appointment">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EventIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      Appointment
                    </Box>
                  </MenuItem>
                  <MenuItem value="reminder">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <NotificationsIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                      Reminder
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Title */}
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                required
                error={Boolean(errors.title)}
                helperText={errors.title}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            {/* All Day Switch */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="allDay"
                    checked={formData.allDay}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="All Day"
              />
            </Grid>

            {/* Start Date/Time */}
            <Grid item xs={12} sm={6}>
              {/* Temporarily disabled DatePicker due to compatibility issues */}
              <TextField
                label="Start Date"
                type="date"
                value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleDateChange('startDate', date);
                }}
                fullWidth
                required
                error={Boolean(errors.startDate)}
                helperText={errors.startDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {!formData.allDay && (
                /* Temporarily disabled TimePicker due to compatibility issues */
                <TextField
                  label="Start Time"
                  type="time"
                  value={formData.startTime ?
                    `${String(formData.startTime.getHours()).padStart(2, '0')}:${String(formData.startTime.getMinutes()).padStart(2, '0')}`
                    : ''}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const time = new Date(formData.startTime);
                    time.setHours(hours);
                    time.setMinutes(minutes);
                    handleDateChange('startTime', time);
                  }}
                  fullWidth
                  required
                  error={Boolean(errors.startTime)}
                  helperText={errors.startTime}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            </Grid>

            {/* End Date/Time */}
            <Grid item xs={12} sm={6}>
              {/* Temporarily disabled DatePicker due to compatibility issues */}
              <TextField
                label="End Date"
                type="date"
                value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleDateChange('endDate', date);
                }}
                fullWidth
                required
                error={Boolean(errors.endDate)}
                helperText={errors.endDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {!formData.allDay && (
                /* Temporarily disabled TimePicker due to compatibility issues */
                <TextField
                  label="End Time"
                  type="time"
                  value={formData.endTime ?
                    `${String(formData.endTime.getHours()).padStart(2, '0')}:${String(formData.endTime.getMinutes()).padStart(2, '0')}`
                    : ''}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const time = new Date(formData.endTime);
                    time.setHours(hours);
                    time.setMinutes(minutes);
                    handleDateChange('endTime', time);
                  }}
                  fullWidth
                  required
                  error={Boolean(errors.endTime)}
                  helperText={errors.endTime}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="delayed">Delayed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Priority */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  label="Priority"
                >
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Roadmap Title */}
            <Grid item xs={12}>
              <TextField
                name="roadmapTitle"
                label="Roadmap"
                value={formData.roadmapTitle}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            {/* Phase Title */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="phaseTitle"
                label="Phase"
                value={formData.phaseTitle}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            {/* Milestone Title */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="milestoneTitle"
                label="Milestone"
                value={formData.milestoneTitle}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        {/* </LocalizationProvider> */}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        {isEditMode ? (
          <Button
            onClick={handleDelete}
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        ) : (
          <Box />
        )}

        <Box>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
          >
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

CalendarEventDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  event: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default CalendarEventDialog;
