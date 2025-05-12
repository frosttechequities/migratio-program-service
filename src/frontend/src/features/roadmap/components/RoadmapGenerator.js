import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  CircularProgress,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
// Date picker components temporarily removed due to compatibility issues
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import MapIcon from '@mui/icons-material/Map';
import { generateRoadmap } from '../roadmapSlice';

/**
 * RoadmapGenerator component
 * A component for generating immigration roadmaps
 *
 * @returns {React.ReactElement} RoadmapGenerator component
 */
const RoadmapGenerator = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('programId');

  const { user } = useSelector((state) => state.auth);
  const { recommendations, results } = useSelector((state) => state.assessment);
  const { loading, error, roadmap } = useSelector((state) => state.roadmap);

  // Create a unified recommendations object that works with both data structures
  const recommendationData = React.useMemo(() => {
    // If we have the new recommendations format, use it
    if (recommendations && recommendations.recommendedPrograms) {
      return recommendations;
    }
    // If we have results with recommendedPrograms, create a compatible structure
    else if (results && results.recommendedPrograms) {
      return {
        recommendedPrograms: results.recommendedPrograms
      };
    }
    // Return null if no data is available
    return null;
  }, [recommendations, results]);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    recommendationId: '',
    programId: programId || '',
    title: '',
    description: '',
    startDate: new Date(),
    visibility: 'private'
  });
  const [formErrors, setFormErrors] = useState({});

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/roadmap/create' } });
    }
  }, [user, navigate]);

  // If roadmap is created, navigate to it
  useEffect(() => {
    if (roadmap) {
      navigate(`/roadmap/${roadmap.id}`);
    }
  }, [roadmap, navigate]);

  // Set program title if programId is provided
  useEffect(() => {
    if (programId && recommendationData) {
      const program = recommendationData.recommendedPrograms?.find(p => p.id === programId);
      if (program) {
        setFormData(prev => ({
          ...prev,
          programId,
          title: `${program.name} Immigration Plan`,
          description: `My personalized roadmap for immigrating through the ${program.name} program.`
        }));
      }
    }
  }, [programId, recommendationData]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      startDate: date
    }));

    // Clear error for this field
    if (formErrors.startDate) {
      setFormErrors(prev => ({
        ...prev,
        startDate: ''
      }));
    }
  };

  // Handle next step
  const handleNext = () => {
    // Validate current step
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setActiveStep(prev => prev + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all steps
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await dispatch(generateRoadmap(formData));
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
    }
  };

  // Validate current step
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 0: // Program selection
        if (!formData.programId) {
          errors.programId = 'Please select a program';
        }
        break;
      case 1: // Basic information
        if (!formData.title.trim()) {
          errors.title = 'Title is required';
        }
        if (!formData.description.trim()) {
          errors.description = 'Description is required';
        }
        break;
      case 2: // Timeline
        if (!formData.startDate) {
          errors.startDate = 'Start date is required';
        }
        break;
      default:
        break;
    }

    return errors;
  };

  // Validate entire form
  const validateForm = () => {
    const errors = {};

    if (!formData.programId) {
      errors.programId = 'Please select a program';
    }

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    return errors;
  };

  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Immigration Program
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Choose the immigration program you want to create a roadmap for.
            </Typography>

            <FormControl component="fieldset" error={!!formErrors.programId} sx={{ width: '100%', mt: 2 }}>
              <FormLabel component="legend">Immigration Program</FormLabel>
              <RadioGroup
                name="programId"
                value={formData.programId}
                onChange={handleChange}
              >
                {recommendationData?.recommendedPrograms?.map((program) => (
                  <Paper
                    key={program.id}
                    elevation={formData.programId === program.id ? 2 : 0}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: formData.programId === program.id ? 'primary.main' : 'divider',
                      backgroundColor: formData.programId === program.id ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                    }}
                  >
                    <FormControlLabel
                      value={program.id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {program.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {program.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
              {formErrors.programId && (
                <Typography color="error" variant="caption">
                  {formErrors.programId}
                </Typography>
              )}
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Roadmap Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Provide basic information about your immigration roadmap.
            </Typography>

            <TextField
              fullWidth
              label="Roadmap Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!formErrors.title}
              helperText={formErrors.title || 'Give your roadmap a descriptive title'}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!formErrors.description}
              helperText={formErrors.description || 'Briefly describe the purpose of this roadmap'}
              margin="normal"
              multiline
              rows={4}
            />

            <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
              <FormLabel component="legend">Visibility</FormLabel>
              <RadioGroup
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                row
              >
                <FormControlLabel value="private" control={<Radio />} label="Private" />
                <FormControlLabel value="shared" control={<Radio />} label="Shared" />
                <FormControlLabel value="public" control={<Radio />} label="Public" />
              </RadioGroup>
              <Typography variant="caption" color="text.secondary">
                Private: Only you can see it | Shared: You can share with specific users | Public: Anyone with the link can view
              </Typography>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Set the timeline for your immigration journey.
            </Typography>

            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                handleDateChange(date);
              }}
              error={!!formErrors.startDate}
              helperText={formErrors.startDate || 'When do you plan to start your immigration process?'}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <Typography variant="body2" sx={{ mt: 3 }}>
              Based on your selected program and start date, we'll generate a comprehensive roadmap with:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  Key milestones and deadlines
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Required documents and forms
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Step-by-step tasks and instructions
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Estimated processing times and costs
                </Typography>
              </li>
            </ul>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review & Generate
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Review your roadmap details before generating.
            </Typography>

            <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.background.default, 0.7), borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Program
              </Typography>
              <Typography variant="body2" paragraph>
                {recommendationData?.recommendedPrograms?.find(p => p.id === formData.programId)?.name || formData.programId}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight={600}>
                Title
              </Typography>
              <Typography variant="body2" paragraph>
                {formData.title}
              </Typography>

              <Typography variant="subtitle1" fontWeight={600}>
                Description
              </Typography>
              <Typography variant="body2" paragraph>
                {formData.description}
              </Typography>

              <Typography variant="subtitle1" fontWeight={600}>
                Start Date
              </Typography>
              <Typography variant="body2" paragraph>
                {formData.startDate ? formData.startDate.toLocaleDateString() : 'Not set'}
              </Typography>

              <Typography variant="subtitle1" fontWeight={600}>
                Visibility
              </Typography>
              <Typography variant="body2">
                {formData.visibility.charAt(0).toUpperCase() + formData.visibility.slice(1)}
              </Typography>
            </Paper>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  // If loading, show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <CircularProgress size={60} thickness={4} sx={{ mb: 4 }} />
        <Typography variant="h5" gutterBottom>
          Generating Your Roadmap
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          We're creating your personalized immigration roadmap. This may take a moment...
        </Typography>
      </Box>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error.includes('Network Error') ? 'Network Error' : 'Error'}
        </Typography>
        <Typography variant="body1" paragraph>
          {error.includes('Network Error')
            ? 'There was a problem connecting to the server. This could be due to a temporary service outage or network issue.'
            : error}
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/assessment/results')}
          >
            Back to Results
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Box>
      </Paper>
    );
  }

  // If no recommendations, show message
  if (!recommendationData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          No Assessment Results Found
        </Typography>
        <Typography variant="body1" paragraph>
          You need to complete an assessment before creating a roadmap.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/assessment')}
        >
          Take Assessment
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <MapIcon sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4">
          Create Your Immigration Roadmap
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>Select Program</StepLabel>
          <StepContent>
            {getStepContent(0)}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<NavigateNextIcon />}
              >
                Next
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Basic Information</StepLabel>
          <StepContent>
            {getStepContent(1)}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<NavigateBeforeIcon />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<NavigateNextIcon />}
              >
                Next
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Timeline</StepLabel>
          <StepContent>
            {getStepContent(2)}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<NavigateBeforeIcon />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<NavigateNextIcon />}
              >
                Next
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Review & Generate</StepLabel>
          <StepContent>
            {getStepContent(3)}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<NavigateBeforeIcon />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                endIcon={<CheckCircleIcon />}
              >
                Generate Roadmap
              </Button>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
    </Paper>
  );
};

export default RoadmapGenerator;
