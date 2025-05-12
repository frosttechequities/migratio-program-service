import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Directions as DirectionsIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Next steps widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - Next steps data
 * @returns {React.ReactNode} Next steps widget component
 */
const NextStepsWidget = ({ data }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  // If no data is provided, use mock data
  const steps = Array.isArray(data) ? data : [
    {
      id: 'step1',
      title: 'Complete Your Profile',
      description: 'Fill in all sections of your profile to get personalized recommendations',
      status: 'in_progress',
      type: 'profile',
      link: '/profile',
      tasks: [
        { id: 'task1', title: 'Add personal information', completed: true },
        { id: 'task2', title: 'Add education history', completed: true },
        { id: 'task3', title: 'Add work experience', completed: false },
        { id: 'task4', title: 'Add language proficiency', completed: false }
      ]
    },
    {
      id: 'step2',
      title: 'Upload Required Documents',
      description: 'Upload key documents needed for your immigration process',
      status: 'not_started',
      type: 'document',
      link: '/documents',
      tasks: [
        { id: 'task5', title: 'Upload passport', completed: false },
        { id: 'task6', title: 'Upload education certificates', completed: false },
        { id: 'task7', title: 'Upload language test results', completed: false }
      ]
    },
    {
      id: 'step3',
      title: 'Review Recommended Programs',
      description: 'Explore immigration programs that match your profile',
      status: 'not_started',
      type: 'program',
      link: '/recommendations',
      tasks: [
        { id: 'task8', title: 'Review Express Entry eligibility', completed: false },
        { id: 'task9', title: 'Explore Provincial Nominee Programs', completed: false },
        { id: 'task10', title: 'Check other immigration pathways', completed: false }
      ]
    },
    {
      id: 'step4',
      title: 'Create Your Immigration Roadmap',
      description: 'Generate a personalized step-by-step plan for your immigration journey',
      status: 'not_started',
      type: 'roadmap',
      link: '/roadmap/create',
      tasks: [
        { id: 'task11', title: 'Select preferred immigration program', completed: false },
        { id: 'task12', title: 'Set timeline preferences', completed: false },
        { id: 'task13', title: 'Generate roadmap', completed: false }
      ]
    }
  ];

  // Handle step change
  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  // Get icon based on step type
  const getStepIcon = (type) => {
    switch (type) {
      case 'profile':
        return <AssignmentIcon />;
      case 'document':
        return <DescriptionIcon />;
      case 'program':
        return <InfoIcon />;
      case 'roadmap':
        return <DirectionsIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  // Get color based on step status
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'in_progress':
        return theme.palette.primary.main;
      case 'not_started':
        return theme.palette.text.secondary;
      default:
        return theme.palette.text.secondary;
    }
  };

  // Calculate step completion percentage
  const getStepCompletion = (step) => {
    if (!step.tasks || step.tasks.length === 0) return 0;
    const completedTasks = step.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / step.tasks.length) * 100);
  };

  // Get step status text
  const getStatusText = (status, completion) => {
    if (status === 'completed') return 'Completed';
    if (status === 'in_progress') return `${completion}% Complete`;
    return 'Not Started';
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: alpha(theme.palette.primary.main, 0.05)
        }}
      >
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsIcon color="primary" />
          Next Steps
        </Typography>
        <Tooltip title="These are the recommended next steps to progress your immigration journey">
          <IconButton size="small">
            <HelpIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stepper */}
      <Box sx={{ p: 2 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => {
            const stepCompletion = getStepCompletion(step);
            const isStepCompleted = step.status === 'completed';
            const isStepActive = activeStep === index;

            return (
              <Step key={step.id} expanded={isStepActive}>
                <StepLabel
                  StepIconProps={{
                    icon: getStepIcon(step.type),
                    active: isStepActive || step.status === 'in_progress',
                    completed: isStepCompleted
                  }}
                  onClick={() => handleStepChange(index)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    width: '100%',
                    gap: { xs: 1, sm: 0 }
                  }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={isStepActive ? 'bold' : 'normal'}
                      sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    >
                      {step.title}
                    </Typography>
                    <Chip
                      label={getStatusText(step.status, stepCompletion)}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getStatusColor(step.status), 0.1),
                        color: getStatusColor(step.status),
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        height: { xs: 20, sm: 24 }
                      }}
                    />
                  </Box>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {step.description}
                  </Typography>

                  {/* Tasks */}
                  {step.tasks && step.tasks.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          mb: 1,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        Tasks:
                      </Typography>
                      {step.tasks.map((task) => (
                        <Box
                          key={task.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            mb: 1,
                            color: task.completed ? theme.palette.success.main : 'text.primary'
                          }}
                        >
                          <CheckCircleIcon
                            fontSize="small"
                            sx={{
                              mr: 1,
                              mt: 0.1,
                              color: task.completed ? theme.palette.success.main : theme.palette.action.disabled,
                              fontSize: { xs: '0.9rem', sm: '1.1rem' }
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? 'text.secondary' : 'text.primary',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              lineHeight: 1.4
                            }}
                          >
                            {task.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  <Button
                    component={RouterLink}
                    to={step.link}
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 1,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                    }}
                  >
                    {step.status === 'not_started' ? 'Start Now' : 'Continue'}
                  </Button>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Button
          size="small"
          disabled={activeStep === 0}
          onClick={() => handleStepChange(activeStep - 1)}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.8125rem' }
          }}
        >
          Previous
        </Button>
        <Button
          size="small"
          disabled={activeStep === steps.length - 1}
          onClick={() => handleStepChange(activeStep + 1)}
          endIcon={<ArrowForwardIcon />}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.8125rem' }
          }}
        >
          Next
        </Button>
      </Box>
    </Paper>
  );
};

NextStepsWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      tasks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          completed: PropTypes.bool.isRequired
        })
      )
    })
  )
};

export default NextStepsWidget;
