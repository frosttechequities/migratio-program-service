import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  Divider,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { fetchUserProfile, updateProfileSection, getProfileCompletion } from '../../features/profile/profileSlice';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const isLoading = useSelector((state) => state.profile.isLoading);
  const isError = useSelector((state) => state.profile.isError);
  const error = useSelector((state) => state.profile.error);
  const profileCompletion = useSelector((state) => state.profile.profileCompletion);
  const [tabValue, setTabValue] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(getProfileCompletion());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdateProfile = async (values, sectionId) => {
    try {
      await dispatch(updateProfileSection({ section: sectionId, data: values })).unwrap();
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      dispatch(getProfileCompletion());
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (isLoading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Complete your profile to get personalized immigration recommendations.
        </Typography>

        {/* Profile completion progress */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
            <CircularProgress
              variant="determinate"
              value={profileCompletion || 0}
              size={60}
              thickness={5}
              color={profileCompletion < 50 ? 'error' : profileCompletion < 80 ? 'warning' : 'success'}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div" color="text.secondary">
                {`${Math.round(profileCompletion || 0)}%`}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Profile Completion
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profileCompletion < 50
                ? 'Your profile needs more information'
                : profileCompletion < 80
                ? 'Good progress, keep going!'
                : 'Your profile is almost complete!'}
            </Typography>
          </Box>
        </Box>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Personal Information" />
            <Tab label="Education" />
            <Tab label="Work Experience" />
            <Tab label="Language Proficiency" />
            <Tab label="Financial Information" />
            <Tab label="Immigration Preferences" />
          </Tabs>
        </Box>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Formik
            initialValues={
              profile?.personalInfo || {
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                nationality: '',
                currentCountry: '',
                address: '',
                phone: '',
                maritalStatus: '',
                dependents: 0,
              }
            }
            validationSchema={Yup.object({
              firstName: Yup.string().required('Required'),
              lastName: Yup.string().required('Required'),
              dateOfBirth: Yup.date().required('Required'),
              nationality: Yup.string().required('Required'),
              currentCountry: Yup.string().required('Required'),
              phone: Yup.string(),
              maritalStatus: Yup.string(),
              dependents: Yup.number().min(0),
            })}
            onSubmit={(values) => handleUpdateProfile(values, 'personalInfo')}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="firstName"
                      label="First Name"
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="lastName"
                      label="Last Name"
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                      helperText={touched.dateOfBirth && errors.dateOfBirth}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="nationality"
                      label="Nationality"
                      error={touched.nationality && Boolean(errors.nationality)}
                      helperText={touched.nationality && errors.nationality}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="currentCountry"
                      label="Current Country of Residence"
                      error={touched.currentCountry && Boolean(errors.currentCountry)}
                      helperText={touched.currentCountry && errors.currentCountry}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="phone"
                      label="Phone Number"
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="address"
                      label="Address"
                      multiline
                      rows={2}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="maritalStatus"
                      label="Marital Status"
                      select
                      SelectProps={{ native: true }}
                      error={touched.maritalStatus && Boolean(errors.maritalStatus)}
                      helperText={touched.maritalStatus && errors.maritalStatus}
                    >
                      <option value=""></option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="dependents"
                      label="Number of Dependents"
                      type="number"
                      error={touched.dependents && Boolean(errors.dependents)}
                      helperText={touched.dependents && errors.dependents}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </TabPanel>

        {/* Education Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Education History
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Add your educational qualifications to help us assess your eligibility for various immigration programs.
          </Typography>

          {/* Placeholder for education form */}
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1">
              Education section will be implemented in the next phase.
            </Typography>
          </Box>
        </TabPanel>

        {/* Work Experience Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Work Experience
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Add your work history to help us assess your eligibility for various immigration programs.
          </Typography>

          {/* Placeholder for work experience form */}
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1">
              Work experience section will be implemented in the next phase.
            </Typography>
          </Box>
        </TabPanel>

        {/* Language Proficiency Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Language Proficiency
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Add your language test scores to help us assess your eligibility for various immigration programs.
          </Typography>

          {/* Placeholder for language proficiency form */}
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1">
              Language proficiency section will be implemented in the next phase.
            </Typography>
          </Box>
        </TabPanel>

        {/* Financial Information Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Financial Information
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Add your financial information to help us assess your eligibility for various immigration programs.
          </Typography>

          {/* Placeholder for financial information form */}
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1">
              Financial information section will be implemented in the next phase.
            </Typography>
          </Box>
        </TabPanel>

        {/* Immigration Preferences Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>
            Immigration Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Tell us about your immigration goals and preferences.
          </Typography>

          {/* Placeholder for immigration preferences form */}
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1">
              Immigration preferences section will be implemented in the next phase.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
