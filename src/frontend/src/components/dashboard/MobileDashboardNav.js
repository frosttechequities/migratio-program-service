import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  Lightbulb as LightbulbIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarIcon,
  Article as ArticleIcon,
  Insights as InsightsIcon,
  Notifications as NotificationsIcon,
  FileDownload as FileDownloadIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

/**
 * Mobile dashboard navigation component
 * @param {Object} props - Component props
 * @param {string} props.activeSection - Currently active section
 * @param {Function} props.onSectionChange - Function to call when section changes
 * @param {Object} props.widgetConfig - Widget configuration
 * @returns {React.ReactNode} Mobile dashboard navigation component
 */
const MobileDashboardNav = ({ activeSection, onSectionChange, widgetConfig }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Get icon for widget
  const getWidgetIcon = (widgetId) => {
    switch (widgetId) {
      case 'overview':
        return <DashboardIcon />;
      case 'roadmap':
        return <TimelineIcon />;
      case 'recommendation':
        return <LightbulbIcon />;
      case 'document':
        return <DescriptionIcon />;
      case 'task':
        return <AssignmentIcon />;
      case 'analytics':
        return <InsightsIcon />;
      case 'notifications':
        return <NotificationsIcon />;
      case 'calendar':
        return <CalendarIcon />;
      case 'news':
        return <ArticleIcon />;
      case 'export':
        return <FileDownloadIcon />;
      default:
        return <DashboardIcon />;
    }
  };
  
  // Handle drawer toggle
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // Handle section change
  const handleSectionChange = (section) => {
    onSectionChange(section);
    setDrawerOpen(false);
  };
  
  // Main navigation items for bottom nav
  const mainNavItems = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'roadmap', label: 'Roadmap', icon: <TimelineIcon /> },
    { id: 'document', label: 'Documents', icon: <DescriptionIcon /> },
    { id: 'task', label: 'Tasks', icon: <AssignmentIcon /> },
    { id: 'menu', label: 'More', icon: <MenuIcon /> }
  ];

  return (
    <>
      {/* Bottom navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1100,
          display: { xs: 'block', md: 'none' }
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={activeSection === 'menu' ? 'menu' : mainNavItems.findIndex(item => item.id === activeSection)}
          onChange={(_, newValue) => {
            if (newValue === 4 || mainNavItems[newValue]?.id === 'menu') {
              toggleDrawer();
            } else {
              handleSectionChange(mainNavItems[newValue]?.id);
            }
          }}
          showLabels
        >
          {mainNavItems.map((item) => (
            <BottomNavigationAction 
              key={item.id} 
              label={item.label} 
              icon={item.icon} 
            />
          ))}
        </BottomNavigation>
      </Paper>
      
      {/* Drawer for additional navigation items */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            maxHeight: '70vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            pb: 7 // Space for bottom navigation
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">More Options</Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {Object.keys(widgetConfig)
            .filter(id => !mainNavItems.some(item => item.id === id) && id !== 'menu')
            .map((widgetId) => (
              <ListItem key={widgetId} disablePadding>
                <ListItemButton 
                  selected={activeSection === widgetId}
                  onClick={() => handleSectionChange(widgetId)}
                >
                  <ListItemIcon>
                    {getWidgetIcon(widgetId)}
                  </ListItemIcon>
                  <ListItemText primary={widgetConfig[widgetId].title} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
      
      {/* Spacer for bottom navigation */}
      <Box sx={{ height: { xs: 56, md: 0 } }} />
    </>
  );
};

MobileDashboardNav.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  widgetConfig: PropTypes.object.isRequired
};

export default MobileDashboardNav;
