import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import MainLayout from '../../components/layout/MainLayout.js'; // Assuming a MainLayout for authenticated areas
// Placeholder for the actual quiz interface component
import QuizInterface from '../../features/assessment/components/QuizInterface'; // Uncommented import

const AssessmentPage = () => {
  return (
    <MainLayout title="Immigration Assessment">
      <Container maxWidth="md"> {/* Use medium width for focus */}
        <Paper elevation={2} sx={{ padding: { xs: 2, sm: 4 }, marginTop: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Personalized Immigration Assessment
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Answer the following questions to help us understand your profile and find the best immigration pathways for you. Your progress will be saved automatically.
          </Typography>

          {/* Render the actual QuizInterface component */}
          <QuizInterface />

        </Paper>
      </Container>
    </MainLayout>
  );
};

export default AssessmentPage;
