import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  ViewQuilt as ViewQuiltIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

import DashboardCustomizer from '../../features/personalization/components/DashboardCustomizer';
import UserPreferencesForm from '../../features/personalization/components/UserPreferencesForm';
import LayoutOptions from '../../features/personalization/components/LayoutOptions';
import SavedViewsManager from '../../features/personalization/components/SavedViewsManager';

/**
 * PersonalizationPage component
 * Page for managing user preferences and dashboard customization
 * 
 * @returns {React.ReactElement} PersonalizationPage component
 */
const PersonalizationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);
  
  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle layout selection
  const handleLayoutSelect = (layout) => {
    // Navigate to dashboard to see the changes
    navigate('/dashboard');
  };
  
  // If user is not authenticated, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/personalization' } });
    }
  }, [user, navigate]);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link 
          color="inherit" 
          href="/dashboard" 
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Typography 
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <SettingsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Personalization
        </Typography>
      </Breadcrumbs>
      
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Personalization Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your dashboard and preferences to enhance your immigration journey experience.
        </Typography>
      </Box>
      
      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="personalization tabs"
          variant="fullWidth"
        >
          <Tab 
            icon={<DashboardIcon />} 
            label="Dashboard Customizer" 
            id="tab-0" 
            aria-controls="tabpanel-0" 
          />
          <Tab 
            icon={<ViewQuiltIcon />} 
            label="Layout Options" 
            id="tab-1" 
            aria-controls="tabpanel-1" 
          />
          <Tab 
            icon={<SaveIcon />} 
            label="Saved Views" 
            id="tab-2" 
            aria-controls="tabpanel-2" 
          />
          <Tab 
            icon={<PersonIcon />} 
            label="User Preferences" 
            id="tab-3" 
            aria-controls="tabpanel-3" 
          />
        </Tabs>
      </Paper>
      
      {/* Dashboard Customizer Tab */}
      <Box
        role="tabpanel"
        hidden={activeTab !== 0}
        id="tabpanel-0"
        aria-labelledby="tab-0"
      >
        {activeTab === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Use the dashboard customizer to show/hide widgets and reorder them according to your preferences.
              </Alert>
              <DashboardCustomizer />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Layout Options Tab */}
      <Box
        role="tabpanel"
        hidden={activeTab !== 1}
        id="tabpanel-1"
        aria-labelledby="tab-1"
      >
        {activeTab === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Choose from predefined dashboard layouts optimized for different stages of your immigration journey.
              </Alert>
              <LayoutOptions onLayoutSelect={handleLayoutSelect} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Saved Views Tab */}
      <Box
        role="tabpanel"
        hidden={activeTab !== 2}
        id="tabpanel-2"
        aria-labelledby="tab-2"
      >
        {activeTab === 2 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Save and manage your custom dashboard layouts for quick access later.
              </Alert>
              <SavedViewsManager />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* User Preferences Tab */}
      <Box
        role="tabpanel"
        hidden={activeTab !== 3}
        id="tabpanel-3"
        aria-labelledby="tab-3"
      >
        {activeTab === 3 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Customize your user experience with theme settings, content preferences, and more.
              </Alert>
              <UserPreferencesForm />
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default PersonalizationPage;
