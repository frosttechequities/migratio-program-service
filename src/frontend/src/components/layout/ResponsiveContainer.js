import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';

/**
 * ResponsiveContainer component
 * A container component that adapts to different screen sizes
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} props.sx - Additional styles
 * @param {string} props.maxWidth - Maximum width of the container
 * @param {boolean} props.disableGutters - Whether to disable gutters
 * @param {string} props.backgroundColor - Background color
 * @param {boolean} props.fullHeight - Whether the container should take full height
 * @returns {React.ReactElement} ResponsiveContainer component
 */
const ResponsiveContainer = ({
  children,
  sx = {},
  maxWidth = 'lg',
  disableGutters = false,
  backgroundColor = 'transparent',
  fullHeight = false,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor,
        minHeight: fullHeight ? '100vh' : 'auto',
        py: { xs: 3, sm: 4, md: 5 },
        ...sx
      }}
      {...props}
    >
      <Container
        maxWidth={maxWidth}
        disableGutters={disableGutters || isMobile}
        sx={{
          px: {
            xs: disableGutters ? 0 : 2,
            sm: disableGutters ? 0 : 3,
            md: disableGutters ? 0 : 4
          }
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default ResponsiveContainer;
