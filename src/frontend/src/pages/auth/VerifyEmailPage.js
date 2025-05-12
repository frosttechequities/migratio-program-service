import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    // In a real app, this would make an API call to verify the token
    const verifyEmail = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (token) {
          setStatus('success');
        } else {
          setStatus('waiting');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('waiting');
    }
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress sx={{ mb: 3 }} />
            <Typography variant="h6">Verifying your email...</Typography>
          </Box>
        );
      case 'success':
        return (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your email has been successfully verified!
            </Alert>
            <Typography paragraph>
              Thank you for verifying your email address. You can now access all features of Visafy.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </Box>
        );
      case 'error':
        return (
          <Box>
            <Alert severity="error" sx={{ mb: 3 }}>
              Email verification failed
            </Alert>
            <Typography paragraph>
              We couldn't verify your email address. The verification link may have expired or is invalid.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Back to Sign In
            </Button>
          </Box>
        );
      case 'waiting':
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please check your email
            </Alert>
            <Typography paragraph>
              We've sent a verification link to your email address. Please check your inbox and click
              the link to verify your account.
            </Typography>
            <Typography paragraph>
              If you don't see the email, check your spam folder or request a new verification link.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Back to Sign In
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Email Verification
          </Typography>
          {renderContent()}
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyEmailPage;
