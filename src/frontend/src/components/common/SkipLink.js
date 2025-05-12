import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * SkipLink component for accessibility
 * Allows keyboard users to skip navigation and go directly to main content
 * 
 * @returns {React.ReactElement} SkipLink component
 */
const SkipLink = () => {
  return (
    <Box
      component="a"
      href="#main-content"
      sx={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        right: 0,
        p: 2,
        zIndex: 2000,
        textAlign: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        textDecoration: 'none',
        transition: 'top 0.2s ease',
        '&:focus': {
          top: 0,
          outline: '2px solid white',
        },
      }}
    >
      <Typography variant="body1" fontWeight={600}>
        Skip to main content
      </Typography>
    </Box>
  );
};

export default SkipLink;
