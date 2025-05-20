import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Button,
  Divider,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewQuilt as ViewQuiltIcon,
  Check as CheckIcon
} from '@mui/icons-material';

import { updateLayoutPreferences } from '../personalizationSlice';

/**
 * LayoutOptions component
 * Provides predefined layout options for the dashboard
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLayoutSelect - Callback for layout selection
 * @returns {React.ReactElement} LayoutOptions component
 */
const LayoutOptions = ({ onLayoutSelect = () => {} }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  // Predefined layouts
  const predefinedLayouts = [
    {
      id: 'default',
      name: 'Default',
      description: 'Standard dashboard layout with all widgets',
      icon: <DashboardIcon fontSize="large" />,
      layout: {
        visibleWidgets: [
          'welcome',
          'journeyProgress',
          'recommendations',
          'tasks',
          'documents',
          'resources',
          'opportunities',
          'subscription',
          'readiness',
          'destinations',
          'successProbability',
          'actionRecommendations'
        ],
        widgetOrder: [
          'welcome',
          'journeyProgress',
          'recommendations',
          'tasks',
          'documents',
          'resources',
          'opportunities',
          'subscription',
          'readiness',
          'destinations',
          'successProbability',
          'actionRecommendations'
        ],
        widgetSizes: {
          welcome: { xs: 12, md: 12 },
          journeyProgress: { xs: 12, md: 12 },
          recommendations: { xs: 12, md: 8, lg: 9 },
          tasks: { xs: 12, md: 4, lg: 3 },
          documents: { xs: 12, md: 6 },
          resources: { xs: 12, md: 6 },
          opportunities: { xs: 12, md: 6 },
          subscription: { xs: 12, md: 6 },
          readiness: { xs: 12, md: 6 },
          destinations: { xs: 12, md: 6 },
          successProbability: { xs: 12, md: 6 },
          actionRecommendations: { xs: 12, md: 6 }
        }
      }
    },
    {
      id: 'planning',
      name: 'Planning Focus',
      description: 'Focused on planning and research widgets',
      icon: <ViewQuiltIcon fontSize="large" />,
      layout: {
        visibleWidgets: [
          'welcome',
          'recommendations',
          'destinations',
          'successProbability',
          'actionRecommendations',
          'resources'
        ],
        widgetOrder: [
          'welcome',
          'recommendations',
          'destinations',
          'successProbability',
          'actionRecommendations',
          'resources'
        ],
        widgetSizes: {
          welcome: { xs: 12, md: 12 },
          recommendations: { xs: 12, md: 12 },
          destinations: { xs: 12, md: 6 },
          successProbability: { xs: 12, md: 6 },
          actionRecommendations: { xs: 12, md: 12 },
          resources: { xs: 12, md: 12 }
        }
      }
    },
    {
      id: 'application',
      name: 'Application Focus',
      description: 'Focused on application process widgets',
      icon: <ViewListIcon fontSize="large" />,
      layout: {
        visibleWidgets: [
          'welcome',
          'journeyProgress',
          'tasks',
          'documents',
          'actionRecommendations'
        ],
        widgetOrder: [
          'welcome',
          'journeyProgress',
          'tasks',
          'documents',
          'actionRecommendations'
        ],
        widgetSizes: {
          welcome: { xs: 12, md: 12 },
          journeyProgress: { xs: 12, md: 12 },
          tasks: { xs: 12, md: 6 },
          documents: { xs: 12, md: 6 },
          actionRecommendations: { xs: 12, md: 12 }
        }
      }
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simplified dashboard with essential widgets only',
      icon: <ViewModuleIcon fontSize="large" />,
      layout: {
        visibleWidgets: [
          'welcome',
          'journeyProgress',
          'recommendations',
          'tasks'
        ],
        widgetOrder: [
          'welcome',
          'journeyProgress',
          'recommendations',
          'tasks'
        ],
        widgetSizes: {
          welcome: { xs: 12, md: 12 },
          journeyProgress: { xs: 12, md: 12 },
          recommendations: { xs: 12, md: 8 },
          tasks: { xs: 12, md: 4 }
        }
      }
    }
  ];
  
  // Handle layout selection
  const handleLayoutSelect = (layout) => {
    dispatch(updateLayoutPreferences(layout));
    onLayoutSelect(layout);
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard Layouts
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Choose a predefined layout for your dashboard or customize your own.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {predefinedLayouts.map((layoutOption) => (
          <Grid item xs={12} sm={6} md={3} key={layoutOption.id}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleLayoutSelect(layoutOption.layout)}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <Box 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText
                  }}
                >
                  {layoutOption.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {layoutOption.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {layoutOption.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Divider />
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  size="small" 
                  startIcon={<CheckIcon />}
                  onClick={() => handleLayoutSelect(layoutOption.layout)}
                >
                  Apply Layout
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Want more control? Use the Dashboard Customizer to create your own layout.
        </Typography>
      </Box>
    </Paper>
  );
};

LayoutOptions.propTypes = {
  onLayoutSelect: PropTypes.func
};

export default LayoutOptions;
