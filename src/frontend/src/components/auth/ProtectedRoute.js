import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getTokenFromLocalStorage } from '../../utils/authUtils';
import supabase, { refreshToken } from '../../utils/supabaseClient';
import { loginSuccess } from '../../features/auth/authSlice';

/**
 * Protected route component that redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} - Protected route component
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        // Check if we have a token
        const token = getTokenFromLocalStorage();

        if (!token && !isAuthenticated) {
          setIsVerifying(false);
          return;
        }

        // If we have a token but not authenticated in Redux, try to get the session
        if (token && !isAuthenticated) {
          try {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
              console.log('[ProtectedRoute] Session error, trying to refresh token:', error.message);
              // If there's an error, try to refresh the token
              const newToken = await refreshToken();

              if (!newToken) {
                throw new Error('Failed to refresh authentication token');
              }

              console.log('[ProtectedRoute] Token refreshed successfully');

              // Try to get the session again with the new token
              try {
                const { data: refreshedData, error: refreshedError } = await supabase.auth.getSession();

                if (refreshedError) {
                  throw refreshedError;
                }

                if (refreshedData?.session) {
                  console.log('[ProtectedRoute] Session found after token refresh');
                  // Update Redux state with user data
                  dispatch(loginSuccess({
                    user: refreshedData.session.user,
                    token: refreshedData.session.access_token
                  }));
                } else {
                  throw new Error('No session found after token refresh');
                }
              } catch (sessionError) {
                console.error('[ProtectedRoute] Error getting session after token refresh:', sessionError);
                throw sessionError;
              }
            } else if (data?.session) {
              console.log('[ProtectedRoute] Session found, updating Redux state');
              // Update Redux state with user data
              dispatch(loginSuccess({
                user: data.session.user,
                token: data.session.access_token
              }));
            } else {
              console.log('[ProtectedRoute] No session found');
            }
          } catch (sessionError) {
            console.error('[ProtectedRoute] Session error:', sessionError);
            throw sessionError;
          }
        }
      } catch (err) {
        console.error('[ProtectedRoute] Error verifying authentication:', err);
        setError(err.message);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuthentication();
  }, [isAuthenticated, dispatch]);

  // Show loading indicator while checking authentication
  if (isLoading || isVerifying) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  // Show error if there was a problem
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          p: 3,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Authentication Error
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Typography variant="body2">
          Please try <a href="/login">logging in</a> again.
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  // Check if children is a React element or a function
  if (typeof children === 'function') {
    return children();
  }

  return children;
};

export default ProtectedRoute;
