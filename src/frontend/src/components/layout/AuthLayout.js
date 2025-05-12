import React from 'react';
import { Box, Container } from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default AuthLayout;