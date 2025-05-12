import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import TravelExploreIcon from '@mui/icons-material/TravelExplore'; // Using Explore icon

// This widget might not need specific props initially,
// but could later take user profile summary to tailor the prompt.
const GlobalOpportunitiesWidget = () => {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
           <TravelExploreIcon color="primary" sx={{ mr: 1 }}/>
           <Typography variant="h6" component="h3">
             Explore Global Opportunities
           </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Did you know your profile might qualify you for programs in multiple countries? Use our comparison tools to explore pathways beyond your initial preferences.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
         <Button component={RouterLink} to="/profile/preferences" size="small" variant="outlined">
            Update Preferences
         </Button>
         <Button component={RouterLink} to="/explore" size="small" variant="contained">
            Compare Destinations
         </Button>
      </Box>
    </Paper>
  );
};

export default GlobalOpportunitiesWidget;
