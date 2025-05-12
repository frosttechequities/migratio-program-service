import React from 'react';
import { Box, Typography, Paper, Grid, Button, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ScoreCircle from '../../../components/common/ScoreCircle'; // Corrected path again if needed

const RecommendationSummaryWidget = ({ recommendations = [] }) => {

  // Display top 3 recommendations or fewer if less are available
  const topRecommendations = recommendations.slice(0, 3);

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          Top Pathway Opportunities
        </Typography>
        <Button component={RouterLink} to="/recommendations" size="small">
          View All
        </Button>
      </Box>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {topRecommendations.length > 0 ? (
          topRecommendations.map((rec, index) => (
            <Grid item xs={12} md={recommendations.length === 1 ? 12 : recommendations.length === 2 ? 6 : 4} key={rec.programId || index}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {/* Placeholder for flag */}
                    <Box sx={{ width: 20, height: 14, bgcolor: 'grey.300', mr: 1, borderRadius: '2px' }}></Box>
                    <Typography variant="subtitle1" component="h4" noWrap title={rec.programName}>
                       {rec.programName || 'Program Name'}
                    </Typography>
                  </Box>
                   <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                       {rec.country || 'Country'} - {rec.category || 'Category'}
                   </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 1 }}>
                      <ScoreCircle score={rec.scores?.mlMatchScore * 100 || 0} label="Match" /> {/* Use mlMatchScore */}
                      <ScoreCircle score={rec.scores?.mlSuccessProbability * 100 || 0} label="Est. Success" variant="probability" /> {/* Use mlSuccessProbability */}
                   </Box>
                    {/* Display explanation summary */}
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                        {rec.explanation?.summary || 'Recommendation details available.'}
                    </Typography>
                    {/* TODO: Add tooltip/modal for detailed factors */}
                 </Box>
                 <Button component={RouterLink} to={`/programs/${rec.programId}`} size="small" sx={{ mt: 1, alignSelf: 'flex-end' }}> {/* Link to program detail page */}
                   View Details
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="text.secondary">
                Complete your assessment to view recommendations.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

// Removed ScoreCircle definition from here

export default RecommendationSummaryWidget;
