import React, { useEffect, useState, useCallback, useMemo } from 'react'; // Import hooks
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Grid, Paper, Typography, Button, Skeleton, Alert, Link, Collapse, FormGroup, FormControlLabel, Switch } from '@mui/material'; // Added more imports
import SettingsIcon from '@mui/icons-material/Settings'; // Icon for customize button
import { Link as RouterLink } from 'react-router-dom';
import LanguageSelector from '../../components/common/LanguageSelector'; // Import LanguageSelector
import { sanitizeData, sanitizeLocalStorage, sanitizeUrl } from '../../utils/sanitize'; // Import sanitization utilities
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
import SuccessProbabilityWidget from '../../features/recommendations/components/SuccessProbabilityWidget';
import ActionRecommendations from '../../features/recommendations/components/ActionRecommendations';

// Helper function to get initial visibility from localStorage or defaults
const getInitialVisibility = (widgetKey, defaultValue = true) => {
    // Check if localStorage is available (might not be in test environment)
    if (typeof localStorage === 'undefined') {
        return defaultValue;
    }

    try {
        // Use sanitizeLocalStorage to safely get and parse localStorage data
        const key = `widgetVisibility_${widgetKey}`;
        const sanitizedValue = sanitizeLocalStorage(key);

        // If sanitizedValue is null, return default
        if (sanitizedValue === null) {
            return defaultValue;
        }

        return sanitizedValue;
    } catch (error) {
        // This catches any other errors
        console.warn(`Error accessing localStorage for ${widgetKey}:`, error);
        return defaultValue;
    }
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
      successProbability: getInitialVisibility('successProbability'),
      actionRecommendations: getInitialVisibility('actionRecommendations'),
  });
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);

  // Toggle customization panel - memoized for performance
  const toggleCustomizePanel = useCallback(() => {
    setShowCustomizePanel(prevState => !prevState);
  }, []);

  // Handle visibility toggle and save to localStorage - memoized for performance
  const handleVisibilityChange = useCallback((event) => {
    const { name, checked } = event.target;
    setWidgetVisibility(prev => {
      const newState = { ...prev, [name]: checked };
      // Save to localStorage with sanitized data
      const sanitizedValue = JSON.stringify(sanitizeData(checked));
      localStorage.setItem(`widgetVisibility_${name}`, sanitizedValue);
      return newState;
    });
  }, []);

  // Select data from Redux store
  const authState = useSelector((state) => state.auth);
  const { user: unsanitizedUser, isAuthenticated } = authState;

  // Sanitize user data to prevent XSS attacks
  const user = useMemo(() => {
    return unsanitizedUser ? sanitizeData(unsanitizedUser) : null;
  }, [unsanitizedUser]);

  // Get dashboard state from Redux
  const dashboardState = useSelector((state) => state.dashboard);

  // Only log in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('[DashboardPage] state.dashboard:', dashboardState);
  }

  // Memoize dashboard data to prevent unnecessary re-renders and sanitize for security
  const { data: dashboardData, isLoading: isLoadingDashboard, isError: isErrorDashboard, error: errorDashboard } = useMemo(() => {
    const state = dashboardState || {}; // Add fallback for undefined

    // Create a new object instead of mutating the original state
    return {
      ...state,
      // Sanitize dashboard data to prevent XSS attacks
      data: state.data ? sanitizeData(state.data) : null
    };
  }, [dashboardState]);

  // Get profile data from Redux store and sanitize it
  const profileState = useSelector((state) => state.profile);
  const { profile: unsanitizedProfile, isLoading: isLoadingProfile, isError: isErrorProfile, error: errorProfile } = profileState;

  // Sanitize profile data to prevent XSS attacks
  const profile = useMemo(() => {
    return unsanitizedProfile ? sanitizeData(unsanitizedProfile) : null;
  }, [unsanitizedProfile]);

  // Fetch dashboard and profile data on mount if authenticated
  useEffect(() => {
    // Only log in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('[DashboardPage] useEffect - isAuthenticated:', isAuthenticated);
    }

    if (isAuthenticated) {
      // Only log in development environment
      if (process.env.NODE_ENV === 'development') {
        console.log('[DashboardPage] Fetching data - dashboardData:', dashboardData, 'profile:', profile);
      }

      // Wrap in try-catch to handle any errors
      try {
        // Always fetch fresh data on mount
        dispatch(fetchDashboardData());
        dispatch(fetchUserProfile());
      } catch (error) {
        // Always log errors, but with more context in development
        if (process.env.NODE_ENV === 'development') {
          console.error('[DashboardPage] Error fetching data:', error);
        } else {
          console.error('[DashboardPage] Error fetching data');
        }
      }
    }

    // Optional: Reset states on unmount
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[DashboardPage] Cleaning up');
      }
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
            <Grid container spacing={3} data-testid="loading-indicator">
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
                  Try again
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




  // Render dashboard with fetched data (or default/empty states if data is null/undefined)
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} data-testid="dashboard-container">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          top: '-40px',
          left: 0,
          background: '#1976d2',
          color: '#fff',
          padding: '8px',
          zIndex: 1000,
          transition: 'top 0.3s'
        }}
        onFocus={(e) => {
          e.target.style.top = '0';
        }}
        onBlur={(e) => {
          e.target.style.top = '-40px';
        }}
      >
        Skip to main content
      </a>
       {/* Customization Buttons */}
       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1 }}>
           <Box>
               <LanguageSelector />
           </Box>
           <Box sx={{ display: 'flex', gap: 1 }}>
               <Button
                   variant="outlined"
                   size="small"
                   onClick={toggleCustomizePanel}
               >
                   Quick Settings
               </Button>
               <Button
                   variant="outlined"
                   size="small"
                   startIcon={<SettingsIcon />}
                   component={RouterLink}
                   to="/personalization"
               >
                   Advanced Customization
               </Button>
           </Box>
       </Box>

       {/* Quick Widget Visibility Panel */}
       <Collapse in={showCustomizePanel}>
           <Paper sx={{ p: 2, mb: 3 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                   <Typography variant="subtitle1">Show/Hide Widgets</Typography>
                   <Link component={RouterLink} to="/personalization" underline="hover">
                       Advanced Customization
                   </Link>
               </Box>
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


      <Grid container spacing={3} id="main-content" tabIndex="-1">
        {/* Welcome Widget */}
        {widgetVisibility.welcome && <Grid item xs={12}>
           <WelcomeWidget
              user={{
                ...user,
                firstName: profile?.first_name || user?.firstName,
                lastName: profile?.last_name || user?.lastName,
                name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : user?.name
              }}
              stats={{
                ...dashboardData?.overview || {},
                profileCompletion: profileState?.profileCompletion || 0
              }}
              nextStepSuggestion={dashboardData?.nextSteps?.[0]?.title || "Review your recommendations"}
              primaryAction={{ text: "View Recommendations", link: sanitizeUrl("/recommendations") }}
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
            <SubscriptionStatusWidget subscription={{
              tier: profile?.subscription_tier || user?.subscriptionTier || 'free',
              expiryDate: profile?.subscription_expiry || user?.subscriptionExpiry
            }} />
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

          {/* Success Probability Widget */}
          {widgetVisibility.successProbability && <Grid item xs={12} md={6}>
            <SuccessProbabilityWidget
              probability={75}
              positiveFactors={[
                {
                  name: profile?.education?.length > 0 ? 'Education Level' : 'Education Level',
                  description: profile?.education?.length > 0
                    ? `Your ${profile.education[0]?.degree || 'education'} meets the requirements for most programs.`
                    : 'Your education level meets the requirements for most programs.'
                },
                {
                  name: profile?.language_proficiency?.length > 0 ? 'Language Proficiency' : 'Language Proficiency',
                  description: profile?.language_proficiency?.length > 0
                    ? `Your ${profile.language_proficiency[0]?.language || 'language'} skills are sufficient for many immigration pathways.`
                    : 'Your language skills are sufficient for many immigration pathways.'
                }
              ]}
              negativeFactors={[
                {
                  name: 'Work Experience',
                  description: profile?.work_experience?.length > 0
                    ? `Additional work experience beyond your ${profile.work_experience.length} ${profile.work_experience.length === 1 ? 'position' : 'positions'} would improve your eligibility.`
                    : 'Additional work experience would improve your eligibility for skilled worker programs.'
                }
              ]}
              isLoading={isLoadingProfile}
            />
          </Grid>}

          {/* Action Recommendations Widget */}
          {widgetVisibility.actionRecommendations && <Grid item xs={12} md={6}>
            <ActionRecommendations
              recommendations={[
                {
                  title: profile?.language_proficiency?.length > 0 ? 'Update Language Test' : 'Complete Language Test',
                  description: profile?.language_proficiency?.length > 0
                    ? `Update your ${profile.language_proficiency[0]?.language || 'language'} test results for better assessment.`
                    : 'Take an approved language test to verify your proficiency.',
                  category: 'High',
                  type: 'language',
                  estimatedImpact: 15
                },
                {
                  title: profile?.education?.length > 0 ? 'Verify Education Credentials' : 'Obtain Education Credential Assessment',
                  description: profile?.education?.length > 0
                    ? `Get your ${profile.education[0]?.degree || 'education'} credentials assessed by an approved organization.`
                    : 'Get your education credentials assessed by an approved organization.',
                  category: 'Medium',
                  type: 'education',
                  estimatedImpact: 10
                }
              ]}
              isLoading={isLoadingProfile}
            />
          </Grid>}

          {/* Scenario Planner */}
          <Grid item xs={12}>
              <ScenarioPlanner
                profile={profile}
                isLoading={isLoadingProfile}
              />
          </Grid>

         {/* Ensure Grid container is closed */}
      </Grid>
    </Container>
  );
};

export default DashboardPage;
