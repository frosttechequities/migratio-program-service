import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Divider } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import supabase, { refreshToken } from '../../utils/supabaseClient';
import { getTokenFromLocalStorage, parseJwt } from '../../utils/authUtils';
import { loginSuccess } from '../../features/auth/authSlice';

/**
 * Test component to verify authentication and token refresh
 */
const TestComponent = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [sessionData, setSessionData] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        setError(null);
        
        // Get token from localStorage
        const token = getTokenFromLocalStorage();
        
        if (token) {
          try {
            // Parse token to get expiration time
            const tokenInfo = parseJwt(token);
            const currentTime = Math.floor(Date.now() / 1000);
            const expiresIn = tokenInfo.exp - currentTime;
            
            setTokenData({
              exists: true,
              token: `${token.substring(0, 10)}...`,
              expiresIn: expiresIn,
              expired: expiresIn <= 0,
              tokenInfo
            });
          } catch (parseError) {
            console.error('Error parsing token:', parseError);
            setTokenData({
              exists: true,
              token: `${token.substring(0, 10)}...`,
              error: parseError.message
            });
          }
        } else {
          setTokenData({ exists: false });
        }
        
        // Get session from Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSessionData({
          exists: !!data.session,
          user: data.session?.user ? {
            id: data.session.user.id,
            email: data.session.user.email,
            role: data.session.user.role,
          } : null,
        });
      } catch (err) {
        console.error('Error checking authentication:', err);
        setError(err.message);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      setIsCheckingAuth(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'frosttechequities@gmail.com',
        password: 'newpassword123',
      });
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        dispatch(loginSuccess({
          user: data.session.user,
          token: data.session.access_token,
        }));
        
        // Update session data
        setSessionData({
          exists: true,
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
            role: data.session.user.role,
          },
        });
        
        // Update token data
        const tokenInfo = parseJwt(data.session.access_token);
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresIn = tokenInfo.exp - currentTime;
        
        setTokenData({ 
          exists: true, 
          token: `${data.session.access_token.substring(0, 10)}...`,
          expiresIn: expiresIn,
          expired: expiresIn <= 0,
          tokenInfo
        });
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError(err.message);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Handle token refresh
  const handleRefreshToken = async () => {
    try {
      setIsCheckingAuth(true);
      setError(null);
      
      const newToken = await refreshToken();
      
      if (!newToken) {
        throw new Error('Failed to refresh token');
      }
      
      // Update token data
      const tokenInfo = parseJwt(newToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = tokenInfo.exp - currentTime;
      
      setTokenData({ 
        exists: true, 
        token: `${newToken.substring(0, 10)}...`,
        expiresIn: expiresIn,
        expired: expiresIn <= 0,
        tokenInfo
      });
      
      // Get session from Supabase
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      setSessionData({
        exists: !!data.session,
        user: data.session?.user ? {
          id: data.session.user.id,
          email: data.session.user.email,
          role: data.session.user.role,
        } : null,
      });
    } catch (err) {
      console.error('Error refreshing token:', err);
      setError(err.message);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Authentication Test Component</Typography>
      
      {isCheckingAuth && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography>Checking authentication...</Typography>
        </Box>
      )}
      
      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleLogin} 
          disabled={isCheckingAuth}
          sx={{ mr: 1 }}
        >
          Login
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleRefreshToken} 
          disabled={isCheckingAuth}
        >
          Refresh Token
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Redux Auth State</Typography>
        <Box component="pre" sx={{ 
          p: 2, 
          bgcolor: '#f5f5f5', 
          borderRadius: 1,
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>
          {JSON.stringify({
            isAuthenticated,
            isLoading,
            user: user ? {
              id: user.id,
              email: user.email,
              role: user.role
            } : null
          }, null, 2)}
        </Box>
      </Paper>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Token Information</Typography>
        <Box component="pre" sx={{ 
          p: 2, 
          bgcolor: '#f5f5f5', 
          borderRadius: 1,
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>
          {JSON.stringify(tokenData, null, 2)}
        </Box>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Session Information</Typography>
        <Box component="pre" sx={{ 
          p: 2, 
          bgcolor: '#f5f5f5', 
          borderRadius: 1,
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>
          {JSON.stringify(sessionData, null, 2)}
        </Box>
      </Paper>
    </Box>
  );
};

export default TestComponent;
