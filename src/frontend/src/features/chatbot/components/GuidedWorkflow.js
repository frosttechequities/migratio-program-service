import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import {
  sendMessage,
  addUserMessage,
  resetActiveWorkflow,
  selectActiveWorkflow,
  selectChatbotLoading
} from '../chatbotSlice';

/**
 * GuidedWorkflow component
 * Provides a step-by-step guided workflow for common immigration tasks
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onComplete - Callback for workflow completion
 * @returns {React.ReactElement} GuidedWorkflow component
 */
const GuidedWorkflow = ({ onComplete = () => {} }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  // Get state from Redux
  const activeWorkflow = useSelector(selectActiveWorkflow);
  const isLoading = useSelector(selectChatbotLoading);
  
  // Component state
  const [activeStep, setActiveStep] = useState(activeWorkflow?.currentStep - 1 || 0);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  
  // If no active workflow, return null
  if (!activeWorkflow) return null;
  
  // Get current step
  const currentStep = activeWorkflow.steps[activeStep];
  
  // Handle next step
  const handleNext = () => {
    // Validate current step
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    // If last step, complete workflow
    if (activeStep === activeWorkflow.steps.length - 1) {
      handleComplete();
      return;
    }
    
    // Send step data to chatbot
    const stepData = {
      workflowId: activeWorkflow.id,
      stepId: currentStep.id,
      data: formValues
    };
    
    dispatch(addUserMessage(`Step ${activeStep + 1} completed: ${currentStep.title}`));
    dispatch(sendMessage(JSON.stringify(stepData)));
    
    // Move to next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setErrors({});
  };
  
  // Handle back
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setErrors({});
  };
  
  // Handle complete
  const handleComplete = () => {
    // Send completion data to chatbot
    const completionData = {
      workflowId: activeWorkflow.id,
      completed: true,
      data: formValues
    };
    
    dispatch(addUserMessage(`Workflow completed: ${activeWorkflow.title}`));
    dispatch(sendMessage(JSON.stringify(completionData)));
    
    // Reset active workflow
    dispatch(resetActiveWorkflow());
    
    // Call onComplete callback
    onComplete();
  };
  
  // Handle cancel
  const handleCancel = () => {
    // Reset active workflow
    dispatch(resetActiveWorkflow());
  };
  
  // Handle form value change
  const handleFormValueChange = (field, value) => {
    setFormValues({
      ...formValues,
      [field]: value
    });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Validate step
  const validateStep = (step) => {
    const stepErrors = {};
    const stepFields = getStepFields(step);
    
    stepFields.forEach((field) => {
      if (field.required && !formValues[field.name]) {
        stepErrors[field.name] = 'This field is required';
      }
    });
    
    return stepErrors;
  };
  
  // Get fields for current step
  const getStepFields = (step) => {
    // This would normally come from the API, but for now we'll use some hardcoded fields
    const workflowFields = {
      'express-entry': [
        [
          { name: 'program', label: 'Express Entry Program', type: 'select', required: true, options: [
            { value: 'fsw', label: 'Federal Skilled Worker' },
            { value: 'fst', label: 'Federal Skilled Trades' },
            { value: 'cec', label: 'Canadian Experience Class' }
          ] }
        ],
        [
          { name: 'age', label: 'Age', type: 'select', required: true, options: [
            { value: '18-24', label: '18-24' },
            { value: '25-29', label: '25-29' },
            { value: '30-34', label: '30-34' },
            { value: '35-39', label: '35-39' },
            { value: '40-44', label: '40-44' },
            { value: '45+', label: '45+' }
          ] },
          { name: 'education', label: 'Highest Level of Education', type: 'select', required: true, options: [
            { value: 'high-school', label: 'High School' },
            { value: 'one-year', label: 'One-year Degree/Diploma' },
            { value: 'two-year', label: 'Two-year Degree/Diploma' },
            { value: 'bachelors', label: 'Bachelor\'s Degree' },
            { value: 'masters', label: 'Master\'s Degree' },
            { value: 'phd', label: 'PhD' }
          ] }
        ],
        [
          { name: 'language', label: 'Language Test', type: 'select', required: true, options: [
            { value: 'ielts', label: 'IELTS' },
            { value: 'celpip', label: 'CELPIP' },
            { value: 'tef', label: 'TEF' },
            { value: 'tcf', label: 'TCF' }
          ] },
          { name: 'clb', label: 'CLB Level', type: 'select', required: true, options: [
            { value: '4', label: 'CLB 4' },
            { value: '5', label: 'CLB 5' },
            { value: '6', label: 'CLB 6' },
            { value: '7', label: 'CLB 7' },
            { value: '8', label: 'CLB 8' },
            { value: '9', label: 'CLB 9' },
            { value: '10+', label: 'CLB 10+' }
          ] }
        ],
        [
          { name: 'work_experience', label: 'Years of Work Experience', type: 'select', required: true, options: [
            { value: '0', label: 'None' },
            { value: '1', label: '1 year' },
            { value: '2', label: '2 years' },
            { value: '3', label: '3 years' },
            { value: '4', label: '4 years' },
            { value: '5+', label: '5+ years' }
          ] },
          { name: 'canadian_experience', label: 'Canadian Work Experience', type: 'select', required: true, options: [
            { value: '0', label: 'None' },
            { value: '1', label: '1 year' },
            { value: '2', label: '2 years' },
            { value: '3+', label: '3+ years' }
          ] }
        ],
        [
          { name: 'confirmation', label: 'Confirmation', type: 'checkbox', required: true, options: [
            { value: 'confirm', label: 'I confirm that the information provided is accurate' }
          ] }
        ]
      ],
      'document-checklist': [
        [
          { name: 'program', label: 'Immigration Program', type: 'select', required: true, options: [
            { value: 'express-entry', label: 'Express Entry' },
            { value: 'family', label: 'Family Sponsorship' },
            { value: 'study', label: 'Study Permit' },
            { value: 'work', label: 'Work Permit' },
            { value: 'visitor', label: 'Visitor Visa' }
          ] }
        ],
        [
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'email', label: 'Email Address', type: 'text', required: true }
        ],
        [
          { name: 'confirmation', label: 'Confirmation', type: 'checkbox', required: true, options: [
            { value: 'confirm', label: 'I would like to receive my document checklist by email' }
          ] }
        ]
      ]
    };
    
    return (workflowFields[activeWorkflow.id] && workflowFields[activeWorkflow.id][step]) || [];
  };
  
  // Render form field
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={formValues[field.name] || ''}
            onChange={(e) => handleFormValueChange(field.name, e.target.value)}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            required={field.required}
            margin="normal"
          />
        );
      case 'select':
        return (
          <FormControl fullWidth margin="normal" error={!!errors[field.name]} required={field.required}>
            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.name}-label`}
              value={formValues[field.name] || ''}
              onChange={(e) => handleFormValueChange(field.name, e.target.value)}
              label={field.label}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors[field.name] && (
              <Typography variant="caption" color="error">
                {errors[field.name]}
              </Typography>
            )}
          </FormControl>
        );
      case 'radio':
        return (
          <FormControl component="fieldset" margin="normal" error={!!errors[field.name]} required={field.required}>
            <Typography variant="body2" gutterBottom>
              {field.label}
            </Typography>
            <RadioGroup
              value={formValues[field.name] || ''}
              onChange={(e) => handleFormValueChange(field.name, e.target.value)}
            >
              {field.options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {errors[field.name] && (
              <Typography variant="caption" color="error">
                {errors[field.name]}
              </Typography>
            )}
          </FormControl>
        );
      case 'checkbox':
        return (
          <FormControl component="fieldset" margin="normal" error={!!errors[field.name]} required={field.required}>
            <Typography variant="body2" gutterBottom>
              {field.label}
            </Typography>
            {field.options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={formValues[field.name] === option.value}
                    onChange={(e) => handleFormValueChange(field.name, e.target.checked ? option.value : '')}
                  />
                }
                label={option.label}
              />
            ))}
            {errors[field.name] && (
              <Typography variant="caption" color="error">
                {errors[field.name]}
              </Typography>
            )}
          </FormControl>
        );
      default:
        return null;
    }
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PlayArrowIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">
          {activeWorkflow.title}
        </Typography>
      </Box>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {activeWorkflow.steps.map((step, index) => (
          <Step key={step.id}>
            <StepLabel>{step.title}</StepLabel>
            <StepContent>
              {index === activeStep && (
                <>
                  <Box sx={{ mb: 2 }}>
                    {getStepFields(activeStep).map((field) => (
                      <Box key={field.name}>
                        {renderField(field)}
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      startIcon={<NavigateBeforeIcon />}
                    >
                      Back
                    </Button>
                    <Box>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancel}
                        sx={{ mr: 1 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        endIcon={activeStep === activeWorkflow.steps.length - 1 ? <CheckIcon /> : <NavigateNextIcon />}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} />
                        ) : activeStep === activeWorkflow.steps.length - 1 ? (
                          'Complete'
                        ) : (
                          'Next'
                        )}
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

GuidedWorkflow.propTypes = {
  onComplete: PropTypes.func
};

export default GuidedWorkflow;
