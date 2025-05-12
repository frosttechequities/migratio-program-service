import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@mui/material';

/**
 * GlassCard component with glassmorphism effect
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {number} props.blur - Blur amount
 * @param {number} props.opacity - Background opacity
 * @param {string} props.borderColor - Border color
 * @param {number} props.elevation - Card elevation
 * @param {Object} props.sx - Additional styles
 * @returns {React.ReactElement} GlassCard component
 */
const GlassCard = ({
  children,
  blur = 10,
  opacity = 0.7,
  borderColor = 'rgba(255, 255, 255, 0.2)',
  elevation = 0,
  sx = {},
  ...rest
}) => {
  return (
    <Paper
      elevation={elevation}
      sx={{
        position: 'relative',
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: `1px solid ${borderColor}`,
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-4px)',
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};

GlassCard.propTypes = {
  children: PropTypes.node.isRequired,
  blur: PropTypes.number,
  opacity: PropTypes.number,
  borderColor: PropTypes.string,
  elevation: PropTypes.number,
  sx: PropTypes.object,
};

export default GlassCard;
