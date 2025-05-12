import React, { useEffect, useState } from 'react'; // Import useState
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Grid, Paper, Typography, Link, Button, Skeleton, Alert, Switch, FormControlLabel, FormGroup, Collapse } from '@mui/material'; // Added more imports
import SettingsIcon from '@mui/icons-material/Settings'; // Icon for customize button
import MainLayout from '../../components/layout/MainLayout';
import WelcomeWidget from '../../features/dashboard/components/WelcomeWidget';
import JourneyProgressWidget from '../../features/dashboard/components/JourneyProgressWidget';
import RecommendationSummaryWidget from '../../features/dashboard/components/RecommendationSummaryWidget';
import UpcomingTasksWidget from '../../features/dashboard/components/UpcomingTasksWidget';
import DocumentCenterWidget from '../../features/dashboard/components/DocumentCenterWidget';
import ResourceRecommendationsWidget from '../../features/dashboard/components/ResourceRecommendationsWidget';
import SubscriptionStatusWidget from '../../features/dashboard/components/SubscriptionStatusWidget';
import GlobalOpportunitiesWidget from '../../features/dashboard/components/GlobalOpportunitiesWidget';

// Import dashboard actions/selectors
import { fetchDashboardData, resetDashboard } from '../../features/dashboard/dashboardSlice';
// Import profile actions/selectors
import { fetchUserProfile, selectUserProfile, selectProfileIsLoading, selectProfileError } from '../../features/profile/profileSlice';
// Import the new checklist component
import ReadinessChecklist from '../../features/profile/components/ReadinessChecklist';
import DestinationSuggestionsWidget from '../../features/recommendations/components/DestinationSuggestionsWidget';
import ScenarioPlanner from '../../features/recommendations/components/ScenarioPlanner'; // Import Scenario Planner

// Helper function to get initial visibility from localStorage or defaults
const getInitialVisibility = (widgetKey, defaultValue = true) => {
    const stored = localStorage.getItem(`widgetVisibility_${widgetKey}`);
    return stored !== null ? JSON.parse(stored) : defaultValue;
};


const DashboardPage = () => {
  const dispatch = useDispatch();

  // State for widget visibility - Initialize from localStorage or default to true
  const [widgetVisibility, setWidgetVisibility] = useState({
      welcome: getInitialVisibility('welcome'),
      journeyProgress: getInitialVisibility('journeyProgress'),
      recommendations: getInitialVisibility('recommendations'),
      tasks: getInitialVisibility('tasks'),
      documents: getInitialVisibility('documents'),
      resources: getInitialVisibility('resources'),
      opportunities: getInitialVisibility('opportunities'),
      subscription: getInitialVisibility('subscription'),
      readiness: getInitialVisibility('readiness'),
      destinations: getInitialVisibility('destinations'),
  });
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);


  // Select data from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Debugging state.dashboard
  const dashboardState = useSelector((state) => state.dashboard);
  console.log('[DashboardPage] state.dashboard:', dashboardState); 
  
  const { data: dashboardData, isLoading: isLoadingDashboard, isError: isErrorDashboard, error: errorDashboard } = dashboardState || {}; // Add fallback for undefined
  const { profile, isLoading: isLoadingProfile, isError: isErrorProfile, error: errorProfile } = useSelector((state) => state.profile);

  // Fetch dashboard and profile data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Only fetch if data isn't already loaded (basic check)
      if (!dashboardData) dispatch(fetchDashboardData());
      if (!profile) dispatch(fetchUserProfile());
    }
    // Optional: Reset states on unmount?
    // return () => {
    //   dispatch(resetDashboard());
    // }
  }, [dispatch, isAuthenticated]);

  // Display loading skeletons while data is fetching
  // Combine loading states
  const isLoading = isLoadingDashboard || isLoadingProfile;
  if (isLoading && (!dashboardData || !profile)) { // Show skeleton if either is loading and not yet available
    return (
        <MainLayout title="Dashboard">
             <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Skeleton placeholders for widgets */}
                    <Grid item xs={12}><Skeleton variant="rectangular" height={100} /></Grid>
                    <Grid item xs={12}><Skeleton variant="rectangular" height={100} /></Grid>
                    <Grid item xs={12} md={8} lg={9}><Skeleton variant="rectangular" height={240} /></Grid>
                    <Grid item xs={12} md={4} lg={3}><Skeleton variant="rectangular" height={240} /></Grid>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={200} /></Grid>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={200} /></Grid>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={150} /></Grid>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={150} /></Grid>
                </Grid>
             </Container>
        </MainLayout>
    );
  }

  // Display error message if fetching failed
  const isError = isErrorDashboard || isErrorProfile;
  const error = errorDashboard || errorProfile;
  if (isError) {
     return (
        <MainLayout title="Dashboard">
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">Error loading dashboard data: {String(error) || 'Unknown error'}</Alert>
            </Container>
        </MainLayout>
     );
  }

  // Handle visibility toggle and save to localStorage
  const handleVisibilityChange = (event) => {
      const { name, checked } = event.target;
      setWidgetVisibility(prev => {
          const newState = { ...prev, [name]: checked };
          // Save to localStorage
          localStorage.setItem(`widgetVisibility_${name}`, JSON.stringify(checked));
          return newState;
      });
  };


  // Render dashboard with fetched data (or default/empty states if data is null/undefined)
  return (
    <MainLayout title="Your Dashboard">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
         {/* Customization Toggle Button */}
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
             <Button
                 variant="outlined"
                 size="small"
                 startIcon={<SettingsIcon />}
                 onClick={() => setShowCustomizePanel(!showCustomizePanel)}
             >
                 Customize Dashboard
             </Button>
         </Box>

         {/* Customization Panel */}
         <Collapse in={showCustomizePanel}>
             <Paper sx={{ p: 2, mb: 3 }}>
                 <Typography variant="subtitle1" gutterBottom>Show/Hide Widgets</Typography>
                 <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1 }}>
                     {Object.entries(widgetVisibility).map(([key, value]) => (
                         <FormControlLabel
                             key={key}
                             control={<Switch checked={value} onChange={handleVisibilityChange} name={key} size="small" />}
                             label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} // Format key to label
                         />
                     ))}
                 </FormGroup>
             </Paper>
         </Collapse>


        <Grid container spacing={3}>
          {/* Welcome Widget */}
          {widgetVisibility.welcome && <Grid item xs={12}>
             <WelcomeWidget
                user={user}
                stats={dashboardData?.overview || {}}
                nextStepSuggestion={dashboardData?.nextSteps?.[0]?.title || "Review your recommendations"}
                primaryAction={{ text: "View Recommendations", link: "/recommendations" }}
             />
          </Grid>}

          {/* Journey Progress Widget */}
          {widgetVisibility.journeyProgress && <Grid item xs={12}>
             <JourneyProgressWidget currentStageIndex={dashboardData?.overview?.currentStageIndex || 1} />
          </Grid>}

          {/* Recommendation Summary Widget */}
          {widgetVisibility.recommendations && <Grid item xs={12} md={8} lg={9}>
             <RecommendationSummaryWidget recommendations={dashboardData?.recommendations || []} />
          </Grid>}

          {/* Upcoming Tasks Widget */}
          {widgetVisibility.tasks && <Grid item xs={12} md={4} lg={3}>
             <UpcomingTasksWidget tasks={dashboardData?.tasks || []} />
          </Grid>}

          {/* Document Center Widget */}
           {widgetVisibility.documents && <Grid item xs={12} md={6}>
             <DocumentCenterWidget
                documents={dashboardData?.documents?.recent || []}
                stats={dashboardData?.documents?.stats || {}}
             />
           </Grid>}

           {/* Resource Recommendations Widget */}
           {widgetVisibility.resources && <Grid item xs={12} md={6}>
              {/* This widget now fetches its own data */}
              <ResourceRecommendationsWidget />
           </Grid>}

           {/* Global Opportunities Widget */}
           {widgetVisibility.opportunities && <Grid item xs={12} md={6}>
              <GlobalOpportunitiesWidget />
           </Grid>}

           {/* Subscription Status Widget */}
           {widgetVisibility.subscription && <Grid item xs={12} md={6}>
              <SubscriptionStatusWidget subscription={{ tier: user?.subscriptionTier || 'free', expiryDate: user?.subscriptionExpiry }} />
           </Grid>}

           {/* Readiness Checklist Widget */}
           {profile && widgetVisibility.readiness && (
             <Grid item xs={12} md={6}>
                <ReadinessChecklist profile={profile} />
             </Grid>
           )}
           {/* Add placeholder if profile still loading but dashboard isn't */}
           {isLoadingProfile && !profile && widgetVisibility.readiness &&
             <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={200} /></Grid>
           }

           {/* Destination Suggestions Widget */}
           {widgetVisibility.destinations && <Grid item xs={12} md={6}>
              <DestinationSuggestionsWidget />
           </Grid>}

            {/* Scenario Planner */}
            <Grid item xs={12}>
                <ScenarioPlanner />
            </Grid>

           {/* Ensure Grid container is closed */}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage;
