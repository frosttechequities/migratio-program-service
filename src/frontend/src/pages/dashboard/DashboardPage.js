import React, { useEffect, useState } from 'react'; // Import useState
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Grid, Paper, Typography, Button, Skeleton, Alert, Switch, FormControlLabel, FormGroup, Collapse } from '@mui/material'; // Added more imports
import SettingsIcon from '@mui/icons-material/Settings'; // Icon for customize button
// MainLayout is no longer needed as we're using the parent Layout
import WelcomeWidget from '../../features/dashboard/components/WelcomeWidget';
import JourneyProgressWidget from '../../features/dashboard/components/JourneyProgressWidget';
import RecommendationSummaryWidget from '../../features/dashboard/components/RecommendationSummaryWidget';
import UpcomingTasksWidget from '../../features/dashboard/components/UpcomingTasksWidget';
import DocumentCenterWidget from '../../features/dashboard/components/DocumentCenterWidget';
import ResourceRecommendationsWidget from '../../features/dashboard/components/ResourceRecommendationsWidget';
import SubscriptionStatusWidget from '../../features/dashboard/components/SubscriptionStatusWidget';
import GlobalOpportunitiesWidget from '../../features/dashboard/components/GlobalOpportunitiesWidget';

// Import dashboard actions/selectors
import { fetchDashboardData } from '../../features/dashboard/dashboardSlice';
// Import profile actions/selectors
import { fetchUserProfile } from '../../features/profile/profileSlice';
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
    console.log('[DashboardPage] useEffect - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('[DashboardPage] Fetching data - dashboardData:', dashboardData, 'profile:', profile);

      // Wrap in try-catch to handle any errors
      try {
        // Always fetch fresh data on mount
        dispatch(fetchDashboardData());
        dispatch(fetchUserProfile());
      } catch (error) {
        console.error('[DashboardPage] Error fetching data:', error);
      }
    }

    // Optional: Reset states on unmount
    return () => {
      console.log('[DashboardPage] Cleaning up');
      // No cleanup needed
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAuthenticated]);

  // Display loading skeletons while data is fetching
  // Combine loading states
  const isLoading = isLoadingDashboard || isLoadingProfile;
  if (isLoading && (!dashboardData || !profile)) { // Show skeleton if either is loading and not yet available
    return (
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
    );
  }

  // Display error message if fetching failed
  const isError = isErrorDashboard || isErrorProfile;
  const error = errorDashboard || errorProfile;
  if (isError) {
     return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Error loading dashboard data: {String(error) || 'Unknown error'}
            </Alert>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Dashboard Unavailable</Typography>
              <Typography variant="body1" paragraph>
                We're having trouble loading your dashboard data. This could be due to:
              </Typography>
              <ul>
                <li>A temporary connection issue</li>
                <li>Your session may have expired</li>
                <li>Our servers might be experiencing high load</li>
              </ul>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // Retry loading data
                    dispatch(fetchDashboardData());
                    dispatch(fetchUserProfile());
                  }}
                  sx={{ mr: 2 }}
                >
                  Retry
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  href="/login"
                >
                  Return to Login
                </Button>
              </Box>
            </Paper>
        </Container>
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
  );
};

export default DashboardPage;
