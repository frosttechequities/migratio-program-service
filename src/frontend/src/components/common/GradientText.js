import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

/**
 * GradientText component for displaying text with gradient colors
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Text content
 * @param {string} props.gradient - Gradient colors
 * @param {string} props.variant - Typography variant
 * @param {Object} props.sx - Additional styles
 * @param {string} props.component - Component to render as
 * @returns {React.ReactElement} GradientText component
 */
const GradientText = ({
  children,
  gradient = 'linear-gradient(90deg, #0066FF 0%, #5271FF 100%)',
  variant = 'h1',
  sx = {},
  component,
  ...rest
}) => {
  return (
    <Typography
      variant={variant}
      component={component || variant.includes('h') ? variant : 'span'}
      sx={{
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        display: 'inline-block',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Typography>
  );
};

GradientText.propTypes = {
  children: PropTypes.node.isRequired,
  gradient: PropTypes.string,
  variant: PropTypes.string,
  sx: PropTypes.object,
  component: PropTypes.elementType,
};

export default GradientText;
