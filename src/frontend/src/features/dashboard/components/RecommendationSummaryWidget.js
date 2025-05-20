import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid, Button, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import ScoreCircle from '../../../components/common/ScoreCircle'; // Corrected path again if needed

const RecommendationSummaryWidget = ({ recommendations = [] }) => {
  // Initialize translation hook with error handling
  let t;
  try {
    const translation = useTranslation();
    t = translation.t;
  } catch (error) {
    console.warn('Translation not available:', error);
    // Fallback translation function
    t = (key) => {
      if (key === 'dashboard.recommendations.title') return 'Top Pathway Opportunities';
      if (key === 'common.viewAll') return 'View All';
      if (key === 'dashboard.recommendations.viewDetails') return 'View Details';
      if (key === 'dashboard.recommendations.emptyState') return 'Complete your assessment to view recommendations.';
      return key;
    };
  }

  // Display top 3 recommendations or fewer if less are available - memoized for performance
  const topRecommendations = useMemo(() => {
    return recommendations.slice(0, 3);
  }, [recommendations]);

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          {t('dashboard.recommendations.title')}
        </Typography>
        <Button component={Link} to="/recommendations" size="small" data-testid="view-all-button">
          {t('common.viewAll')}
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
                    <Typography
                      variant="subtitle1"
                      component="h4"
                      noWrap
                      title={rec.programName}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%'
                      }}
                    >
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
                    {/* Display explanation summary with text truncation */}
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontStyle: 'italic',
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2,
                        maxHeight: '3.6em' // 3 lines * 1.2em line height
                      }}
                      title={rec.explanation?.summary || 'Recommendation details available.'}
                    >
                        {rec.explanation?.summary || 'Recommendation details available.'}
                    </Typography>
                    {/* TODO: Add tooltip/modal for detailed factors */}
                 </Box>
                 <Button
                  component={Link}
                  to={`/programs/${rec.programId}`}
                  size="small"
                  sx={{ mt: 1, alignSelf: 'flex-end' }}
                  data-testid={`view-details-button-${index}`}
                  aria-label={`${t('dashboard.recommendations.viewDetails')} ${rec.programName || 'Program'}`}
                >
                  {t('dashboard.recommendations.viewDetails')}
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="text.secondary">
                {t('dashboard.recommendations.emptyState')}
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
