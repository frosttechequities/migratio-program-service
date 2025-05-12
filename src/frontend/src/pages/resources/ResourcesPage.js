import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import MainLayout from '../../components/layout/MainLayout';
import ResourceList from '../../features/resources/components/ResourceList';
import { fetchResources, selectAllResources, selectResourcesLoading, selectResourcesError, resetResources } from '../../features/resources/resourceSlice';

const ResourcesPage = () => {
  const dispatch = useDispatch();
  const resources = useSelector(selectAllResources);
  const isLoading = useSelector(selectResourcesLoading);
  const error = useSelector(selectResourcesError);

  useEffect(() => {
    // Fetch all active resources when the component mounts
    dispatch(fetchResources());

    // Optional: Reset resources state on unmount
    // return () => {
    //   dispatch(resetResources());
    // };
  }, [dispatch]);

  return (
    <MainLayout title="Resource Library">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resource Library
        </Typography>

        {/* TODO: Add filtering/search options here */}

        <Box sx={{ mt: 3 }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          )}
          {error && <Alert severity="error">Error loading resources: {error}</Alert>}
          {!isLoading && !error && (
            <ResourceList resources={resources} title="All Resources" />
          )}
        </Box>
      </Container>
    </MainLayout>
  );
};

export default ResourcesPage;
