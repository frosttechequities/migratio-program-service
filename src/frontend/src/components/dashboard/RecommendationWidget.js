import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Button, 
  Avatar,
  CircularProgress
} from '@mui/material';
import { 
  Lightbulb as LightbulbIcon,
  ArrowForward as ArrowForwardIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

/**
 * Recommendation widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - Recommendation data
 * @returns {React.ReactNode} Recommendation widget component
 */
const RecommendationWidget = ({ data }) => {
  // If no data is provided, show a placeholder
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Your Recommendations
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Complete your assessment to get personalized recommendations
          </Typography>
          <Button 
            component={RouterLink} 
            to="/assessment" 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            Start Assessment
          </Button>
        </Box>
      </Paper>
    );
  }

  // Sort recommendations by match percentage
  const sortedRecommendations = [...data].sort((a, b) => 
    b.matchPercentage - a.matchPercentage
  );

  // Get the top 3 recommendations
  const topRecommendations = sortedRecommendations.slice(0, 3);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Your Recommendations
        </Typography>
        <Button 
          component={RouterLink} 
          to="/recommendations" 
          endIcon={<ArrowForwardIcon />}
          size="small"
        >
          View All
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Top recommendations */}
      <List sx={{ mb: 2 }}>
        {topRecommendations.map((recommendation) => (
          <ListItem 
            key={recommendation._id} 
            component={RouterLink} 
            to={`/recommendations/${recommendation._id}`}
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              mb: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              {/* Country flag */}
              <Avatar 
                src={recommendation.countryFlagUrl} 
                alt={recommendation.countryName}
                variant="rounded"
                sx={{ mr: 2, width: 40, height: 30 }}
              >
                <FlagIcon />
              </Avatar>
              
              {/* Program details */}
              <ListItemText 
                primary={recommendation.programName} 
                secondary={recommendation.countryName}
                sx={{ flex: 1 }}
              />
              
              {/* Match percentage */}
              <Box sx={{ position: 'relative', display: 'inline-flex', ml: 2 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={recommendation.matchPercentage} 
                  size={40}
                  thickness={4}
                  sx={{ 
                    color: (theme) => {
                      if (recommendation.matchPercentage >= 80) return theme.palette.success.main;
                      if (recommendation.matchPercentage >= 60) return theme.palette.warning.main;
                      return theme.palette.error.main;
                    }
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(recommendation.matchPercentage)}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Key strengths */}
      {topRecommendations[0]?.keyPoints && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Why {topRecommendations[0].programName} is a good match:
          </Typography>
          <List dense sx={{ mb: 2 }}>
            {topRecommendations[0].keyPoints.slice(0, 3).map((point, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemText 
                  primary={point} 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Create roadmap button */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button 
          component={RouterLink} 
          to={`/recommendations/${topRecommendations[0]?._id}`} 
          variant="outlined" 
          size="small"
          fullWidth
        >
          Create Roadmap from Top Match
        </Button>
      </Box>
    </Paper>
  );
};

RecommendationWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      programName: PropTypes.string.isRequired,
      countryName: PropTypes.string.isRequired,
      countryFlagUrl: PropTypes.string,
      matchPercentage: PropTypes.number.isRequired,
      keyPoints: PropTypes.arrayOf(PropTypes.string)
    })
  )
};

export default RecommendationWidget;
