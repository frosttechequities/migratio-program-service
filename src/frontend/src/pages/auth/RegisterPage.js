import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress // Import CircularProgress for loading indicator
} from '@mui/material';

// Import the actual async thunk actions from the auth slice
import { register, reset } from '../../features/auth/authSlice';

// Validation Schema remains the same
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Get relevant state from Redux store
  const { isLoading, isError, error: authError, isSuccess } = useSelector((state) => state.auth);
  const [apiError, setApiError] = useState(null); // Local state for displaying API error from Redux

  // Effect to handle successful registration or error changes from Redux state
  useEffect(() => {
    if (isError && authError) {
      setApiError(authError); // Set local error state to display the error from Redux
      // Optionally reset the error state in Redux after displaying it
      // dispatch(reset());
    }
    if (isSuccess) {
      // Registration was successful (handled by the thunk/slice)
      // Navigate to verification prompt page after success message potentially shown by thunk
      navigate('/verify-email');
      dispatch(reset()); // Reset auth state (isLoading, isSuccess, isError, error)
    }
  }, [isError, authError, isSuccess, navigate, dispatch]);

  const handleSubmit = (values) => {
    // Reset local API error display before new submission
    setApiError(null);
    // Dispatch the register thunk with form values
    // Destructure to avoid sending confirmPassword to backend if not needed there
    const { firstName, lastName, email, password } = values;
    dispatch(register({ firstName, lastName, email, password }));
    // Navigation/error display is handled by the useEffect hook based on Redux state changes
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Create Your Migratio Account
          </Typography>

          {/* Display API error from Redux state via local state */}
          {apiError && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {apiError}
            </Alert>
          )}

          <Box sx={{ mt: 1, width: '100%' }}>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {/* Use Formik's render prop pattern */}
              {({ errors, touched }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        disabled={isLoading} // Disable field when loading
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        disabled={isLoading} // Disable field when loading
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        disabled={isLoading} // Disable field when loading
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password ? errors.password : 'Minimum 8 characters'}
                        disabled={isLoading} // Disable field when loading
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                        disabled={isLoading} // Disable field when loading
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading} // Use isLoading from Redux state
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Sign Up'} {/* Show loader */}
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link component={RouterLink} to="/login" variant="body2">
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
