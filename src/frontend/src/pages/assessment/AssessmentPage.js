import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
// MainLayout is no longer needed as we're using the parent Layout
// Placeholder for the actual quiz interface component
import QuizInterface from '../../features/assessment/components/QuizInterface'; // Uncommented import

const AssessmentPage = () => {
  return (
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
  );
};

export default AssessmentPage;
