import React, { useState, useEffect } from 'react';
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
  ListItemButton,
  IconButton,
  Badge,
  Chip,
  Button,
  Menu,
  MenuItem,
  Skeleton
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

/**
 * Notifications widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - Notifications data
 * @returns {React.ReactNode} Notifications widget component
 */
const NotificationsWidget = ({ data: propData }) => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState(propData || []);
  const [loading, setLoading] = useState(!propData);
  const [error, setError] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const isFilterMenuOpen = Boolean(filterAnchorEl);
  const isActionMenuOpen = Boolean(menuAnchorEl);

  // Filter options
  const filters = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'task', label: 'Tasks' },
    { value: 'document', label: 'Documents' },
    { value: 'deadline', label: 'Deadlines' },
    { value: 'system', label: 'System' }
  ];

  // Fetch notifications if not provided as props
  useEffect(() => {
    if (propData) {
      setNotifications(propData);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // In a real app, this would be an API call to fetch notifications
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockNotifications = [
          {
            id: '1',
            type: 'task',
            title: 'New Task Assigned',
            message: 'You have been assigned a new task: Complete language test',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            link: '/roadmap',
            linkText: 'View Task'
          },
          {
            id: '2',
            type: 'document',
            title: 'Document Verification',
            message: 'Your passport has been verified successfully',
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            link: '/documents',
            linkText: 'View Document'
          },
          {
            id: '3',
            type: 'deadline',
            title: 'Upcoming Deadline',
            message: 'You have a deadline approaching: Submit application (3 days left)',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            link: '/roadmap',
            linkText: 'View Deadline'
          },
          {
            id: '4',
            type: 'system',
            title: 'Profile Update Required',
            message: 'Please update your contact information to ensure you receive important updates',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            link: '/profile',
            linkText: 'Update Profile'
          },
          {
            id: '5',
            type: 'document',
            title: 'Document Expiring Soon',
            message: 'Your work permit will expire in 30 days. Please renew it soon.',
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
            link: '/documents',
            linkText: 'View Document'
          }
        ];

        setNotifications(mockNotifications);
        setLoading(false);
      } catch (err) {
        setError('Failed to load notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [propData]);

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

  // Handle notification action menu
  const handleMenuClick = (event, notification) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNotification(null);
  };

  // Mark notification as read
  const handleMarkAsRead = (notification) => {
    // In a real app, this would be an API call
    const updatedNotifications = notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    handleMenuClose();
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    // In a real app, this would be an API call
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
  };

  // Delete notification
  const handleDeleteNotification = (notification) => {
    // In a real app, this would be an API call
    const updatedNotifications = notifications.filter(n => n.id !== notification.id);
    setNotifications(updatedNotifications);
    handleMenuClose();
  };

  // Filter notifications
  const filteredNotifications = Array.isArray(notifications) ? notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  }) : [];

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task':
        return <AssignmentIcon color="primary" />;
      case 'document':
        return <DescriptionIcon color="info" />;
      case 'deadline':
        return <EventIcon color="warning" />;
      case 'system':
        return <InfoIcon color="secondary" />;
      default:
        return <NotificationsIcon />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  // Count unread notifications
  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {unreadCount > 0 ? (
            <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1 }}>
              <NotificationsActiveIcon sx={{ verticalAlign: 'middle' }} />
            </Badge>
          ) : (
            <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          )}
          Notifications
        </Typography>

        <Box>
          <IconButton
            size="small"
            onClick={handleFilterClick}
            aria-controls={isFilterMenuOpen ? 'notification-filter-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isFilterMenuOpen ? 'true' : undefined}
          >
            <FilterListIcon />
          </IconButton>

          <Menu
            id="notification-filter-menu"
            anchorEl={filterAnchorEl}
            open={isFilterMenuOpen}
            onClose={handleFilterClose}
            MenuListProps={{
              'aria-labelledby': 'notification-filter-button',
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
      <Divider sx={{ mb: 2 }} />

      {/* Notifications list */}
      {loading ? (
        // Loading skeleton
        <Box>
          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Box>
      ) : error ? (
        // Error message
        <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>
          {error}
        </Typography>
      ) : filteredNotifications.length === 0 ? (
        // No notifications message
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 4 }}>
          No notifications
          {selectedFilter !== 'all' && ` matching the "${
            filters.find(f => f.value === selectedFilter)?.label || selectedFilter
          }" filter`}
        </Typography>
      ) : (
        // Notifications items
        <List disablePadding>
          {filteredNotifications.map((notification) => (
            <ListItem
              key={notification.id}
              disablePadding
              sx={{
                mb: 1,
                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                borderRadius: 1
              }}
            >
              <ListItemButton
                component={RouterLink}
                to={notification.link}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                      >
                        {notification.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          size="small"
                          variant="outlined"
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, notification)}
                          aria-label="notification actions"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                  secondaryTypographyProps={{ component: 'div' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Action menu for notifications */}
      <Menu
        id="notification-action-menu"
        anchorEl={menuAnchorEl}
        open={isActionMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'notification-action-button',
        }}
      >
        {selectedNotification && !selectedNotification.read && (
          <MenuItem onClick={() => handleMarkAsRead(selectedNotification)}>
            <CheckIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as read
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDeleteNotification(selectedNotification)}>
          <WarningIcon fontSize="small" sx={{ mr: 1 }} />
          Delete notification
        </MenuItem>
      </Menu>

      {/* Actions */}
      {notifications.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            size="small"
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.read)}
          >
            Mark all as read
          </Button>

          <Button
            component={RouterLink}
            to="/notifications"
            size="small"
          >
            View all
          </Button>
        </Box>
      )}
    </Paper>
  );
};

NotificationsWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      read: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      link: PropTypes.string,
      linkText: PropTypes.string
    })
  )
};

export default NotificationsWidget;
