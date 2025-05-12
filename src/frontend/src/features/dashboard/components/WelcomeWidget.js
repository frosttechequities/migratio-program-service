import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const WelcomeWidget = ({ user, stats = {}, nextStepSuggestion = "Review your recommendations", primaryAction = { text: "View Recommendations", link: "/recommendations" } }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation hook

  // Use default values if stats are not provided
  const {
    daysActive = 0,
    completedTasks = 0,
    totalTasks = 0,
    profileCompletion = 0
  } = stats;

  const handlePrimaryAction = () => {
    if (primaryAction.link) {
      navigate(primaryAction.link);
    } else if (primaryAction.onClick) {
      primaryAction.onClick();
    }
  };

  return (
    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2} alignItems="center">
        {/* Greeting */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h2" gutterBottom>
            {/* Use t function for translation */}
            {t('dashboard.welcome', { name: user?.firstName || 'User' })}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {nextStepSuggestion || "Let's continue your immigration journey."}
          </Typography>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'space-around', md: 'flex-end' }, gap: 2, flexWrap: 'wrap' }}>
            <Box textAlign="center">
              <Typography variant="h6">{profileCompletion}%</Typography>
              <Typography variant="caption" color="text.secondary">Profile</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6">{completedTasks}/{totalTasks}</Typography>
              <Typography variant="caption" color="text.secondary">Tasks</Typography>
            </Box>
             <Box textAlign="center">
              <Typography variant="h6">{daysActive}</Typography>
              <Typography variant="caption" color="text.secondary">Days Active</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Action Button */}
        <Grid item xs={12} sx={{ mt: 2, textAlign: { xs: 'center', md: 'left'} }}>
           <Button variant="contained" onClick={handlePrimaryAction}>
             {primaryAction.text || "Get Started"}
           </Button>
           {/* Optionally add a secondary action button */}
           {/* <Button variant="outlined" sx={{ ml: 2 }}>Secondary Action</Button> */}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default WelcomeWidget;
