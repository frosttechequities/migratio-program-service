import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Button,
  Link as MuiLink,
  CircularProgress, // Added for loading state
  Alert // Added for error state
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { fetchResources, selectAllResources, selectResourcesLoading, selectResourcesError } from '../../resources/resourceSlice'; // Import slice actions/selectors
import ResourceList from '../../resources/components/ResourceList'; // Import the new list component

const ResourceRecommendationsWidget = () => {
  const dispatch = useDispatch();
  const resources = useSelector(selectAllResources);
  const isLoading = useSelector(selectResourcesLoading);
  const error = useSelector(selectResourcesError);

  // Fetch resources relevant to the dashboard on mount
  useEffect(() => {
    // Example: Fetch resources tagged 'dashboard' and 'post-arrival'
    dispatch(fetchResources(['dashboard', 'post-arrival']));
    // TODO: Refine tag filtering based on user context if needed
  }, [dispatch]);

  // Display top 3-4 resources or fewer
  const recommendedResources = resources.slice(0, 3); // Example: show top 3

  // Render loading state
  if (isLoading) {
    return (
      <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '150px' }}>
        <CircularProgress />
      </Paper>
    );
  }

  // Render error state
  if (error) {
     return (
       <Paper sx={{ p: 2, height: '100%' }}>
         <Typography variant="h6" component="h3" gutterBottom>Recommended Resources</Typography>
         <Alert severity="warning">Could not load resources: {error}</Alert>
       </Paper>
     );
  }

  // Render the ResourceList component with fetched data
  return (
    // The ResourceList component includes its own Paper wrapper.
    // We might want to add the "View All" button back here, positioned relative to the list.
    <Box sx={{ position: 'relative', height: '100%' }}>
       <ResourceList resources={recommendedResources} title="Recommended Resources" />
       <Button
         component={RouterLink}
         to="/resources" // Assuming a /resources route exists
         size="small"
         sx={{ position: 'absolute', top: 8, right: 8 }} // Position button top-right
       >
         View All
       </Button>
    </Box>
  );
};

export default ResourceRecommendationsWidget;
