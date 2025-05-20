import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, CircularProgress, Alert, Grid } from '@mui/material';
// MainLayout is no longer needed as we're using the parent Layout
// Import Roadmap components
import RoadmapOverviewDisplay from '../../features/roadmap/components/RoadmapOverviewDisplay';
import InteractiveTimeline from '../../features/roadmap/components/InteractiveTimeline';
import RoadmapProgress from '../../features/roadmap/components/RoadmapProgress';
// Import Redux actions/selectors
import { fetchRoadmapById, selectRoadmapState, clearCurrentRoadmap } from '../../features/roadmap/roadmapSlice';

const RoadmapPage = () => {
  const { roadmapId } = useParams(); // Get roadmap ID from URL if viewing specific one
  const dispatch = useDispatch();

  // Select roadmap state from Redux
  const { currentRoadmap, isLoadingDetail, isError, error } = useSelector(selectRoadmapState);
  // Rename isLoading to avoid conflict if other loading states are used
  const isLoading = isLoadingDetail;

  useEffect(() => {
    // Fetch specific roadmap if ID exists
    if (roadmapId) {
      dispatch(fetchRoadmapById(roadmapId));
      console.log(`RoadmapPage mounted - dispatched fetchRoadmapById(${roadmapId})`);
    } else {
      // Handle case with no ID - maybe redirect or show a message/selector
      console.log("RoadmapPage mounted - No roadmapId provided.");
      // Optionally clear any previously loaded roadmap
      dispatch(clearCurrentRoadmap());
    }

    // Clear the current roadmap state when the component unmounts or roadmapId changes
    return () => {
      dispatch(clearCurrentRoadmap());
    };
  }, [dispatch, roadmapId]);

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  if (isError) {
     return <Container sx={{mt: 4}}><Alert severity="error">Error loading roadmap: {error || 'Unknown error'}</Alert></Container>;
  }

  if (!currentRoadmap && !isLoading) {
     return (
        <Container sx={{mt: 4, textAlign: 'center'}}>
            <Typography variant="h5" gutterBottom>Roadmap Not Found</Typography>
            <Typography color="text.secondary">
                Could not find the specified roadmap, or you haven't created one yet.
            </Typography>
            <Button component={RouterLink} to="/recommendations" variant="contained" sx={{mt: 2}}>
                View Recommendations to Create Roadmap
            </Button>
        </Container>
     );
  }

  // Render roadmap details if data is loaded
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Roadmap Header */}
      <RoadmapOverviewDisplay roadmap={currentRoadmap} />

      {/* Roadmap Progress and Timeline */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Roadmap Progress */}
        <Grid item xs={12} md={4}>
          <RoadmapProgress roadmap={currentRoadmap} isLoading={isLoading} />
        </Grid>

        {/* Interactive Timeline */}
        <Grid item xs={12} md={8}>
          <InteractiveTimeline roadmap={currentRoadmap} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default RoadmapPage;
