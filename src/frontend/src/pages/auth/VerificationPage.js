import React, { useState, useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, Paper, Button, CircularProgress, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import supabase from '../../utils/supabaseClient';

const VerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Extract email from query params or state
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || (location.state ? location.state.email : '') || '';

  useEffect(() => {
    // Check if this is a verification callback from Supabase
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery') || hash.includes('type=signup')) {
      handleSupabaseCallback();
    }
  }, []);

  const handleSupabaseCallback = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.refreshSession();

      if (error) {
        setVerificationStatus('error');
        setMessage(error.message || 'Verification failed. Please try again.');
      } else {
        setVerificationStatus('success');
        setMessage('Your email has been verified successfully!');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Email address is required to resend verification.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify`
        }
      });

      if (error) {
        setMessage(`Failed to resend verification email: ${error.message}`);
      } else {
        setMessage('Verification email has been resent. Please check your inbox.');
      }
    } catch (error) {
      setMessage(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          {verificationStatus === 'pending' && (
            <MailOutlineIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
          )}
          {verificationStatus === 'success' && (
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          )}
          {verificationStatus === 'error' && (
            <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          )}

          <Typography variant="h4" component="h1" gutterBottom align="center">
            {verificationStatus === 'pending' && 'Verify Your Email'}
            {verificationStatus === 'success' && 'Email Verified'}
            {verificationStatus === 'error' && 'Verification Failed'}
          </Typography>

          <Typography variant="body1" align="center" paragraph>
            {verificationStatus === 'pending' && (
              <>
                We've sent a verification email to <strong>{email || 'your email address'}</strong>.
                <br />
                Please check your inbox and click the verification link to complete your registration.
              </>
            )}
            {(verificationStatus === 'success' || verificationStatus === 'error') && message}
          </Typography>

          {message && message !== '' && verificationStatus === 'pending' && (
            <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
              {message}
            </Alert>
          )}

          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            {verificationStatus === 'pending' && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResendVerification}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Resend Verification Email
              </Button>
            )}

            {verificationStatus === 'success' && (
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/login"
              >
                Proceed to Login
              </Button>
            )}

            {verificationStatus === 'error' && (
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/register"
              >
                Back to Registration
              </Button>
            )}

            <Button
              variant="text"
              color="primary"
              component={RouterLink}
              to="/"
              sx={{ mt: 1 }}
            >
              Return to Home
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerificationPage;
