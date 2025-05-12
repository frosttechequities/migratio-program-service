import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Link, Box, Paper } from '@mui/material';
// Placeholder for the actual login form component
import LoginForm from '../../features/auth/components/LoginForm'; // Uncommented import
import AuthLayout from '../../components/layout/AuthLayout'; // Assuming an AuthLayout exists

const LoginPage = () => {
  return (
    <AuthLayout title="Log In to Migratio">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Log In
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Access your personalized immigration dashboard.
        </Typography>

        {/* Render the actual LoginForm component */}
        <LoginForm />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2" underline="hover">
                Forgot password?
            </Link>
            <Link component={RouterLink} to="/register" variant="body2" underline="hover">
                {"Don't have an account? Sign Up"}
            </Link>
        </Box>
      </Paper>
    </AuthLayout>
  );
};

export default LoginPage;
