import React from 'react';
import PropTypes from 'prop-types';
import { Box, LinearProgress, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * Progress bar component for the assessment quiz
 * Shows the current section and progress percentage
 */
const ProgressBar = ({ progress }) => {
  const theme = useTheme();
  
  // Format section name for display
  const formatSectionName = (section) => {
    return section.charAt(0).toUpperCase() + section.slice(1);
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Chip
          label={formatSectionName(progress.section)}
          color="primary"
          sx={{
            fontWeight: 600,
            borderRadius: 1,
            px: 1
          }}
        />
        
        <Typography variant="body2" color="text.secondary">
          {progress.completed} of {progress.total} questions
        </Typography>
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={progress.percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.palette.grey[200],
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
          }
        }}
      />
      
      <Typography
        variant="body2"
        color="text.secondary"
        align="right"
        sx={{ mt: 0.5 }}
      >
        {progress.percentage}% complete
      </Typography>
    </Box>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.shape({
    percentage: PropTypes.number.isRequired,
    section: PropTypes.string.isRequired,
    completed: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired
};

export default ProgressBar;
