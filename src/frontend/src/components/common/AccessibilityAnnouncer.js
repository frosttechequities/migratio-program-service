import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

/**
 * AccessibilityAnnouncer component for screen readers
 * Used to announce dynamic content changes to screen reader users
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Message to announce
 * @param {string} props.politeness - ARIA live region politeness setting
 * @param {number} props.clearDelay - Delay in ms before clearing the message
 * @returns {React.ReactElement} AccessibilityAnnouncer component
 */
const AccessibilityAnnouncer = ({
  message,
  politeness = 'polite',
  clearDelay = 5000,
}) => {
  const [announcement, setAnnouncement] = useState('');
  
  useEffect(() => {
    if (!message) return;
    
    // Set the announcement
    setAnnouncement(message);
    
    // Clear the announcement after delay
    const timer = setTimeout(() => {
      setAnnouncement('');
    }, clearDelay);
    
    return () => clearTimeout(timer);
  }, [message, clearDelay]);
  
  return (
    <Box
      aria-live={politeness}
      aria-atomic="true"
      sx={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {announcement}
    </Box>
  );
};

AccessibilityAnnouncer.propTypes = {
  message: PropTypes.string,
  politeness: PropTypes.oneOf(['polite', 'assertive']),
  clearDelay: PropTypes.number,
};

export default AccessibilityAnnouncer;
