import React from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';

/**
 * Enhanced loading indicator component with various styles
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of loading indicator (circular, linear, overlay)
 * @param {string} props.size - Size of the loading indicator (small, medium, large)
 * @param {string} props.color - Color of the loading indicator
 * @param {string} props.message - Optional message to display
 * @param {number} props.value - Value for determinate progress
 * @param {boolean} props.fullPage - Whether to display as a full page overlay
 * @returns {React.ReactElement} LoadingIndicator component
 */
const LoadingIndicator = ({
  type = 'circular',
  size = 'medium',
  color = 'primary',
  message = '',
  value = 0,
  fullPage = false,
}) => {
  // Size mapping for circular progress
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };
  
  // Determine if progress is determinate
  const isDeterminate = value > 0;
  
  // Circular progress indicator
  const circularProgress = (
    <CircularProgress
      size={sizeMap[size]}
      color={color}
      variant={isDeterminate ? 'determinate' : 'indeterminate'}
      value={isDeterminate ? value : 0}
      aria-label={message || 'Loading'}
      thickness={4}
      sx={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    />
  );
  
  // Linear progress indicator
  const linearProgress = (
    <LinearProgress
      color={color}
      variant={isDeterminate ? 'determinate' : 'indeterminate'}
      value={isDeterminate ? value : 0}
      aria-label={message || 'Loading'}
      sx={{
        width: '100%',
        height: size === 'small' ? 4 : size === 'medium' ? 6 : 8,
        borderRadius: 1,
      }}
    />
  );
  
  // Overlay loading indicator
  if (type === 'overlay' || fullPage) {
    return (
      <Box
        sx={{
          position: fullPage ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: fullPage ? 9999 : 10,
        }}
        role="progressbar"
        aria-label={message || 'Loading'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isDeterminate ? value : undefined}
      >
        {circularProgress}
        {message && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontWeight: 500 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    );
  }
  
  // Standard loading indicator
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="progressbar"
      aria-label={message || 'Loading'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={isDeterminate ? value : undefined}
    >
      {type === 'linear' ? linearProgress : circularProgress}
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

LoadingIndicator.propTypes = {
  type: PropTypes.oneOf(['circular', 'linear', 'overlay']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info']),
  message: PropTypes.string,
  value: PropTypes.number,
  fullPage: PropTypes.bool,
};

export default LoadingIndicator;
