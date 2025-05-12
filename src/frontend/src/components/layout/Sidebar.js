import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Map as MapIcon,
  Event as EventIcon,
  ExitToApp as ExitToAppIcon,
  Public as PublicIcon,
  Flag as FlagIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    dispatch({ type: 'ui/toggleSidebar' });
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      requiresAuth: true,
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/profile',
      requiresAuth: true,
    },
    {
      text: 'Assessment',
      icon: <AssignmentIcon />,
      path: '/assessment',
      requiresAuth: true,
    },
    {
      text: 'Documents',
      icon: <DescriptionIcon />,
      path: '/documents',
      requiresAuth: true,
    },
    {
      text: 'Roadmap',
      icon: <MapIcon />,
      path: '/roadmap',
      requiresAuth: true,
    },
    {
      text: 'Calendar',
      icon: <EventIcon />,
      path: '/calendar',
      requiresAuth: true,
    },
    {
      text: 'Immigration Programs',
      icon: <PublicIcon />,
      path: '/immigration/programs',
      requiresAuth: true,
    },
    {
      text: 'Country Profiles',
      icon: <FlagIcon />,
      path: '/immigration/countries',
      requiresAuth: true,
    },
    {
      text: 'Points Calculator',
      icon: <CalculateIcon />,
      path: '/immigration/points-calculator',
      requiresAuth: true,
    },
    {
      text: 'Logout',
      icon: <ExitToAppIcon />,
      path: '/logout',
      requiresAuth: true,
      onClick: () => {
        // Handle logout logic here
        navigate('/');
      },
    },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems
          .filter((item) => !item.requiresAuth || isAuthenticated)
          .map((item) => (
            <ListItem
              key={item.text}
              onClick={item.onClick || (() => navigate(item.path))}
              sx={{
                bgcolor: location.pathname === item.path ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            position: 'relative',
            height: '100%',
            zIndex: 1
          },
        }}
        open={sidebarOpen}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
