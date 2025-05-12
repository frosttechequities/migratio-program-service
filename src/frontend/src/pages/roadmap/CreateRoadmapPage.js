import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import RoadmapGenerator from '../../features/roadmap/components/RoadmapGenerator';

/**
 * CreateRoadmapPage component
 * Page for creating a new immigration roadmap
 * 
 * @returns {React.ReactElement} CreateRoadmapPage component
 */
const CreateRoadmapPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Immigration Roadmap
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate a personalized step-by-step plan for your immigration journey based on your assessment results.
        </Typography>
      </Box>
      
      <RoadmapGenerator />
    </Container>
  );
};

export default CreateRoadmapPage;
