import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  Container,
  ListItemIcon,
  Divider,
  Badge,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import MapIcon from '@mui/icons-material/Map';
import EventIcon from '@mui/icons-material/Event';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PublicIcon from '@mui/icons-material/Public';
import CalculateIcon from '@mui/icons-material/Calculate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search'; // Import SearchIcon
import LanguageIcon from '@mui/icons-material/Language'; // Icon for language switcher
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'; // Icon for AI Assistant
import { useTranslation } from 'react-i18next'; // Import useTranslation

import { logout } from '../../features/auth/authSlice';
import logo from '../../assets/logo.png';

/**
 * Header component with navigation and user menu
 * @returns {React.ReactNode} - Header component
 */
const Header = () => {
  const { t, i18n } = useTranslation(); // Initialize translation hook
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElLang, setAnchorElLang] = useState(null); // State for language menu

  // Navigation links for public pages
  const publicPages = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Pricing', path: '/pricing' },
  ];

  // Research pages
  const researchPages = [
    { title: 'Research Hub', path: '/research', icon: <LibraryBooksIcon fontSize="small" /> },
    { title: 'Semantic Search', path: '/research/search', icon: <SearchIcon fontSize="small" /> },
    { title: 'Immigration Programs', path: '/immigration/programs', icon: <PublicIcon fontSize="small" /> },
    { title: 'Country Profiles', path: '/immigration/countries', icon: <PublicIcon fontSize="small" /> },
    { title: 'Points Calculator', path: '/immigration/points-calculator', icon: <CalculateIcon fontSize="small" /> },
  ];

  // Dashboard pages
  const dashboardPages = [
    { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { title: 'Profile', path: '/profile', icon: <PersonIcon fontSize="small" /> },
    { title: 'Assessment', path: '/assessment', icon: <AssignmentIcon fontSize="small" /> },
    { title: 'Documents', path: '/documents', icon: <DescriptionIcon fontSize="small" /> },
    { title: 'Roadmap', path: '/roadmap', icon: <MapIcon fontSize="small" /> },
    { title: 'Calendar', path: '/calendar', icon: <EventIcon fontSize="small" /> },
    { title: 'AI Assistant', path: '/assistant', icon: <QuestionAnswerIcon fontSize="small" /> },
    { title: 'Generate PDF', path: '/pdf/generate', icon: <PictureAsPdfIcon fontSize="small" /> },
  ];

  // Dropdown menu states
  const [researchMenuOpen, setResearchMenuOpen] = useState(false);
  const researchMenuAnchorRef = React.useRef(null);

  const [dashboardMenuOpen, setDashboardMenuOpen] = useState(false);
  const dashboardMenuAnchorRef = React.useRef(null);

  // User menu options
  const userSettings = [
    { title: 'Dashboard', action: () => navigate('/dashboard') },
    { title: 'Profile', action: () => navigate('/profile') },
    { title: 'Account Settings', action: () => navigate('/profile/settings') },
    { title: 'Logout', action: handleLogout },
  ];

  // Handle opening the navigation menu
  const handleOpenNavMenu = (event) => {
    console.log('Opening nav menu');
    setAnchorElNav(event.currentTarget);
  };

  // Handle opening the user menu
  const handleOpenUserMenu = (event) => {
    console.log('Opening user menu');
    setAnchorElUser(event.currentTarget);
  };

  // Handle closing the navigation menu
  const handleCloseNavMenu = () => {
    console.log('Closing nav menu');
    setAnchorElNav(null);
  };

  // Handle closing the user menu
  const handleCloseUserMenu = () => {
    console.log('Closing user menu');
    setAnchorElUser(null);
  };

  // Handle research menu toggle
  const handleResearchMenuToggle = () => {
    setResearchMenuOpen((prevOpen) => !prevOpen);
  };

  // Handle research menu close
  const handleResearchMenuClose = (event) => {
    if (researchMenuAnchorRef.current && researchMenuAnchorRef.current.contains(event.target)) {
      return;
    }
    setResearchMenuOpen(false);
  };

  // Handle research menu item click
  const handleResearchMenuItemClick = (path) => {
    navigate(path);
    setResearchMenuOpen(false);
  };

  // Handle dashboard menu toggle
  const handleDashboardMenuToggle = () => {
    setDashboardMenuOpen((prevOpen) => !prevOpen);
  };

  // Handle dashboard menu close
  const handleDashboardMenuClose = (event) => {
    if (dashboardMenuAnchorRef.current && dashboardMenuAnchorRef.current.contains(event.target)) {
      return;
    }
    setDashboardMenuOpen(false);
  };

  // Handle dashboard menu item click
  const handleDashboardMenuItemClick = (path) => {
    navigate(path);
    setDashboardMenuOpen(false);
  };

  // Log authentication state
  console.log('Authentication state:', { isAuthenticated, user });

  // Handle logout
  function handleLogout() {
    console.log('Logout initiated from Header component');
    // First close the menu
    handleCloseUserMenu();

    // Dispatch the logout action
    dispatch(logout());

    // We don't need to navigate here as the authService will handle the redirect
    // The page will be reloaded by the authService logout function
  }

  // Handle opening language menu
  const handleOpenLangMenu = (event) => {
    setAnchorElLang(event.currentTarget);
  };

  // Handle closing language menu
  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  // Handle changing language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleCloseLangMenu();
  };

  const languages = [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'es', name: 'Español' },
  ];

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 1100,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        top: 0,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1.8 }}>
          {/* Logo for desktop - Improved */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 4,
              alignItems: 'center'
            }}
          >
            <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <img
                  src={logo}
                  alt="Visafy Logo"
                  height="100"
                  style={{
                    padding: '4px 0',
                    filter: 'drop-shadow(0 6px 8px rgba(0, 0, 0, 0.15))',
                    marginTop: '4px',
                    marginBottom: '4px',
                  }}
                />
              </Box>
            </RouterLink>
          </Box>



          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="medium"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
              sx={{
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.15)',
                },
                borderRadius: '10px',
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  mt: 1.5,
                  width: 220,
                  overflow: 'visible',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                }
              }}
            >
              {/* Public pages */}
              {publicPages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.path);
                  }}
                  sx={{ borderRadius: '8px', mx: 1, my: 0.5 }}
                >
                  <Typography>{page.title}</Typography>
                </MenuItem>
              ))}

              <Divider sx={{ my: 1.5 }} />

              {/* Research section */}
              <Box sx={{ px: 2, py: 0.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  RESEARCH
                </Typography>
              </Box>

              {researchPages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.path);
                  }}
                  sx={{ borderRadius: '8px', mx: 1, my: 0.5 }}
                >
                  <ListItemIcon>
                    {page.icon}
                  </ListItemIcon>
                  <Typography>{page.title}</Typography>
                </MenuItem>
              ))}

              {isAuthenticated && (
                <>
                  <Divider sx={{ my: 1.5 }} />

                  {/* Dashboard section */}
                  <Box sx={{ px: 2, py: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      DASHBOARD
                    </Typography>
                  </Box>

                  {dashboardPages.map((page) => (
                    <MenuItem
                      key={page.title}
                      onClick={() => {
                        handleCloseNavMenu();
                        navigate(page.path);
                      }}
                      sx={{ borderRadius: '8px', mx: 1, my: 0.5 }}
                    >
                      <ListItemIcon>
                        {page.icon}
                      </ListItemIcon>
                      <Typography>{page.title}</Typography>
                    </MenuItem>
                  ))}
                </>
              )}
            </Menu>
          </Box>

          {/* Logo for mobile - Improved */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'center' }}>
            <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <img
                  src={logo}
                  alt="Visafy Logo"
                  height="90"
                  style={{
                    padding: '4px 0',
                    filter: 'drop-shadow(0 6px 8px rgba(0, 0, 0, 0.15))',
                    marginTop: '4px',
                    marginBottom: '4px',
                  }}
                />
              </Box>
            </RouterLink>
          </Box>

          {/* Desktop navigation links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            {publicPages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  mx: 1,
                  color: 'text.primary',
                  fontWeight: 600,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '3px',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'primary.main',
                    transition: 'width 0.3s ease',
                    borderRadius: '3px',
                  },
                  '&:hover::after': {
                    width: '70%',
                  },
                  '&.active::after': {
                    width: '70%',
                  }
                }}
              >
                {page.title}
              </Button>
            ))}

            {/* Research dropdown menu */}
            <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <Button
                ref={researchMenuAnchorRef}
                aria-controls={researchMenuOpen ? 'research-menu' : undefined}
                aria-expanded={researchMenuOpen ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleResearchMenuToggle}
                sx={{
                  mx: 1,
                  color: 'text.primary',
                  fontWeight: 600,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '3px',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'primary.main',
                    transition: 'width 0.3s ease',
                    borderRadius: '3px',
                  },
                  '&:hover::after': {
                    width: '70%',
                  }
                }}
                endIcon={<ExpandMoreIcon />}
                startIcon={<LibraryBooksIcon />}
              >
                Research
              </Button>
              <Popper
                open={researchMenuOpen}
                anchorEl={researchMenuAnchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                sx={{ zIndex: 1000 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        mt: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                        overflow: 'visible',
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          left: 20,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      }}
                    >
                      <ClickAwayListener onClickAway={handleResearchMenuClose}>
                        <MenuList
                          autoFocusItem={researchMenuOpen}
                          id="research-menu"
                          aria-labelledby="research-button"
                          sx={{ p: 1, width: 240 }}
                        >
                          {researchPages.map((page) => (
                            <MenuItem
                              key={page.title}
                              onClick={() => handleResearchMenuItemClick(page.path)}
                              sx={{
                                borderRadius: 1.5,
                                py: 1,
                                px: 2,
                                my: 0.5,
                                '&:hover': {
                                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {page.icon}
                              </ListItemIcon>
                              <Typography variant="body1">{page.title}</Typography>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>

            {/* Dashboard dropdown menu for authenticated users */}
            {isAuthenticated && (
              <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <Button
                  ref={dashboardMenuAnchorRef}
                  aria-controls={dashboardMenuOpen ? 'dashboard-menu' : undefined}
                  aria-expanded={dashboardMenuOpen ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleDashboardMenuToggle}
                  sx={{
                    mx: 1,
                    color: 'text.primary',
                    fontWeight: 600,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '3px',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'primary.main',
                      transition: 'width 0.3s ease',
                      borderRadius: '3px',
                    },
                    '&:hover::after': {
                      width: '70%',
                    }
                  }}
                  endIcon={<ExpandMoreIcon />}
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
                <Popper
                  open={dashboardMenuOpen}
                  anchorEl={dashboardMenuAnchorRef.current}
                  role={undefined}
                  placement="bottom-start"
                  transition
                  disablePortal
                  sx={{ zIndex: 1000 }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                      }}
                    >
                      <Paper
                        elevation={3}
                        sx={{
                          mt: 1.5,
                          borderRadius: 2,
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                          overflow: 'visible',
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            left: 20,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        }}
                      >
                        <ClickAwayListener onClickAway={handleDashboardMenuClose}>
                          <MenuList
                            autoFocusItem={dashboardMenuOpen}
                            id="dashboard-menu"
                            aria-labelledby="dashboard-button"
                            sx={{ p: 1, width: 240 }}
                          >
                            {dashboardPages.map((page) => (
                              <MenuItem
                                key={page.title}
                                onClick={() => handleDashboardMenuItemClick(page.path)}
                                sx={{
                                  borderRadius: 1.5,
                                  py: 1,
                                  px: 2,
                                  my: 0.5,
                                  '&:hover': {
                                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                  },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  {page.icon}
                                </ListItemIcon>
                                <Typography variant="body1">{page.title}</Typography>
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>
            )}
          </Box>

          {/* User menu or login/register buttons */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
             {/* Language Switcher */}
             <Tooltip title="Change Language">
                <IconButton
                    onClick={handleOpenLangMenu}
                    color="primary"
                     sx={{
                      mx: 1,
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.15)',
                      },
                    }}
                >
                    <LanguageIcon />
                </IconButton>
             </Tooltip>
             <Menu
                id="language-menu"
                anchorEl={anchorElLang}
                open={Boolean(anchorElLang)}
                onClose={handleCloseLangMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                 sx={{
                      mt: '45px',
                      '& .MuiPaper-root': {
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        minWidth: 160,
                      }
                    }}
             >
                {languages.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        selected={i18n.language === lang.code}
                        onClick={() => changeLanguage(lang.code)}
                         sx={{ borderRadius: '8px', mx: 1, my: 0.5 }}
                    >
                        {lang.name}
                    </MenuItem>
                ))}
             </Menu>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton
                    color="primary"
                    sx={{
                      mx: 1,
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.15)',
                      },
                    }}
                  >
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* User menu */}
                <Box sx={{ ml: 1 }}>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: 0.5,
                        border: '2px solid',
                        borderColor: 'primary.light',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      {user?.profileImage ? (
                        <Avatar
                          alt={user.firstName}
                          src={user.profileImage}
                          sx={{
                            width: 40,
                            height: 40,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {(user?.firstName?.charAt(0) || '')}{(user?.lastName?.charAt(0) || '')}
                        </Avatar>
                      )}
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{
                      mt: '45px',
                      '& .MuiPaper-root': {
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        minWidth: 200,
                        overflow: 'visible',
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      }
                    }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {/* User info */}
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                        {user?.firstName || ''} {user?.lastName || ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email || ''}
                      </Typography>
                    </Box>
                    <Divider />

                    {/* User menu items */}
                    {userSettings.map((setting) => (
                      <MenuItem
                        key={setting.title}
                        onClick={() => {
                          setting.action();
                          handleCloseUserMenu();
                        }}
                        sx={{
                          borderRadius: '8px',
                          mx: 1,
                          my: 0.5,
                          px: 1.5,
                          py: 1
                        }}
                      >
                        <ListItemIcon>
                          {setting.title === 'Dashboard' && <DashboardIcon fontSize="small" color="primary" />}
                          {setting.title === 'Profile' && <PersonIcon fontSize="small" color="primary" />}
                          {setting.title === 'Account Settings' && <SettingsIcon fontSize="small" color="primary" />}
                          {setting.title === 'Logout' && <ExitToAppIcon fontSize="small" color="error" />}
                        </ListItemIcon>
                        <Typography>{setting.title}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderWidth: '2px',
                    px: 3,
                    '&:hover': {
                      borderWidth: '2px',
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{
                    px: 3,
                    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.4)',
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
