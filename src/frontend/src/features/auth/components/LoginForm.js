import React, { useState, useEffect } from 'react'; // Added useEffect
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
// No need for RouterLink here unless adding forgot password inside the form itself

// Import the actual async thunk actions from the auth slice
import { login, reset } from '../authSlice'; // Assuming reset action exists
// Placeholder for authService if needed directly, but usually handled by thunk
// import authService from '../authService';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Get relevant state from Redux store
  const { user, isLoading, isError, error: authError, isSuccess, isAuthenticated } = useSelector((state) => state.auth);
  const [apiError, setApiError] = useState(null); // Local state for displaying API error from Redux

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({}); // For client-side validation errors

  // Effect to log initial auth state from Redux
  useEffect(() => {
    console.log('[LoginForm] Initial auth state from Redux:', { isLoading, isAuthenticated, isError, authError, user });
    // This effect runs once on component mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures it runs only once

  // Effect to handle successful login or error changes from Redux state
  useEffect(() => {
    if (isError && authError) {
      setApiError(authError); // Set local error state to display the error from Redux
      // Optionally reset the error state in Redux after displaying it
      // dispatch(reset());
    }

    // Redirect if login is successful (isAuthenticated becomes true)
    if (isAuthenticated && user) {
      navigate('/dashboard'); // Redirect to dashboard on successful login
      // No need to dispatch reset() here usually, as state reflects logged-in status
    }

    // Optional: Reset error state when component unmounts
    // return () => {
    //   dispatch(reset());
    // };
  }, [isError, authError, isAuthenticated, user, navigate, dispatch]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
     // Clear specific field error on change
     if (formErrors[name]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
     // Clear API error when user starts typing again
     if (apiError) {
        setApiError(null);
     }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => { // Removed async as dispatch handles async
    console.log('[LoginForm] handleSubmit triggered');
    e.preventDefault();
    console.log('[LoginForm] before validateForm()');
    if (!validateForm()) {
      console.log('[LoginForm] validateForm() returned false. Errors:', formErrors);
      return;
    }
    console.log('[LoginForm] validateForm() returned true');

    // Reset local API error display before new submission
    setApiError(null);
    console.log('[LoginForm] before dispatch(login(formData)). FormData:', formData);
    // Dispatch the login thunk with form data
    dispatch(login(formData));
    // Navigation/error display is handled by the useEffect hook based on Redux state changes
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {/* Display API error from Redux state via local state */}
      {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
        error={!!formErrors.email}
        helperText={formErrors.email}
        disabled={isLoading} // Use isLoading from Redux state
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={!!formErrors.password}
        helperText={formErrors.password}
        disabled={isLoading} // Use isLoading from Redux state
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading} // Use isLoading from Redux state
      >
        {isLoading ? <CircularProgress size={24} /> : 'Log In'} {/* Show loader */}
      </Button>
    </Box>
  );
};

export default LoginForm;
