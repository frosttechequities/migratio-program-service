import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  LinearProgress,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArticleIcon from '@mui/icons-material/Article';
import LinkIcon from '@mui/icons-material/Link';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

/**
 * StepGuidance component
 * Provides detailed guidance for each step in the roadmap
 *
 * @param {Object} props - Component props
 * @param {Array} props.steps - Array of step objects
 * @param {Function} props.onStepUpdate - Callback for step status updates
 * @param {boolean} props.isLoading - Loading state
 * @returns {React.ReactElement} StepGuidance component
 */
const StepGuidance = ({
  steps = [],
  onStepUpdate = () => {},
  isLoading = false
}) => {
  const theme = useTheme();
  const [expandedStep, setExpandedStep] = useState(null);

  // Handle accordion expansion
  const handleAccordionChange = (stepId) => (event, isExpanded) => {
    setExpandedStep(isExpanded ? stepId : null);
  };

  // Calculate step progress
  const calculateStepProgress = (step) => {
    if (!step.subtasks || step.subtasks.length === 0) {
      return step.status === 'completed' ? 100 : 0;
    }

    const completedSubtasks = step.subtasks.filter(subtask =>
      subtask.status === 'completed'
    ).length;

    return (completedSubtasks / step.subtasks.length) * 100;
  };

  // Get status chip color based on step status
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'pending':
        return 'default';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format estimated time
  const formatEstimatedTime = (days) => {
    if (!days && days !== 0) return 'Unknown';

    if (days < 1) {
      const hours = Math.round(days * 24);
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }

    const months = Math.round(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  };

  // Handle step status update
  const handleStatusUpdate = (stepId, newStatus) => {
    onStepUpdate(stepId, { status: newStatus });
  };

  // Handle subtask status update
  const handleSubtaskUpdate = (stepId, subtaskId, newStatus) => {
    onStepUpdate(stepId, { subtaskId, status: newStatus });
  };

  // Sort steps by order and status
  const sortedSteps = [...steps].sort((a, b) => {
    // Sort by order first
    if (a.order !== b.order) return a.order - b.order;

    // Then by status (in_progress first, then pending, then completed)
    if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
    if (a.status !== 'in_progress' && b.status === 'in_progress') return 1;
    if (a.status === 'pending' && b.status === 'completed') return -1;
    if (a.status === 'completed' && b.status === 'pending') return 1;

    return 0;
  });

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Step-by-Step Guidance
        </Typography>
        <Tooltip title="Detailed guidance for each step in your immigration process">
          <InfoOutlinedIcon color="action" sx={{ cursor: 'pointer' }} />
        </Tooltip>
      </Box>

      {isLoading ? (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      ) : sortedSteps.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          No steps defined for this roadmap yet.
        </Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          {sortedSteps.map((step) => (
            <Accordion
              key={step._id || step.id}
              expanded={expandedStep === (step._id || step.id)}
              onChange={handleAccordionChange(step._id || step.id)}
              sx={{
                mb: 2,
                border: '1px solid',
                borderColor: theme.palette.divider,
                boxShadow: 'none',
                '&:before': {
                  display: 'none',
                },
                opacity: step.status === 'completed' ? 0.8 : 1
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`step-${step._id || step.id}-content`}
                id={`step-${step._id || step.id}-header`}
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: expandedStep === (step._id || step.id) ? `1px solid ${theme.palette.divider}` : 'none'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
                  {/* Step number */}
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: step.status === 'completed' ? theme.palette.success.main : theme.palette.primary.main,
                      color: 'white',
                      fontWeight: 'bold',
                      mr: 1
                    }}
                  >
                    {step.order || '?'}
                  </Box>

                  {/* Step title */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      flexGrow: 1,
                      textDecoration: step.status === 'completed' ? 'line-through' : 'none'
                    }}
                  >
                    {step.title}
                  </Typography>

                  {/* Status chip */}
                  <Chip
                    label={step.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    size="small"
                    color={getStatusChipColor(step.status)}
                  />

                  {/* Estimated time */}
                  {step.estimatedDays !== undefined && (
                    <Tooltip title="Estimated time to complete">
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={formatEstimatedTime(step.estimatedDays)}
                        size="small"
                        variant="outlined"
                      />
                    </Tooltip>
                  )}
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 3 }}>
                {/* Step description */}
                <Typography variant="body2" color="text.secondary" paragraph>
                  {step.description}
                </Typography>

                {/* Progress indicator */}
                {step.subtasks && step.subtasks.length > 0 && (
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {Math.round(calculateStepProgress(step))}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={calculateStepProgress(step)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}

                {/* Subtasks */}
                {step.subtasks && step.subtasks.length > 0 && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Tasks to Complete:
                    </Typography>
                    <List dense disablePadding>
                      {step.subtasks.map((subtask) => (
                        <ListItem
                          key={subtask._id || subtask.id}
                          disablePadding
                          sx={{ py: 0.75 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Tooltip title={subtask.status === 'completed' ? 'Completed' : 'Mark as completed'}>
                              <CheckCircleIcon
                                color={subtask.status === 'completed' ? 'success' : 'disabled'}
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': {
                                    color: theme.palette.success.light
                                  }
                                }}
                                onClick={() => handleSubtaskUpdate(
                                  step._id || step.id,
                                  subtask._id || subtask.id,
                                  subtask.status === 'completed' ? 'pending' : 'completed'
                                )}
                              />
                            </Tooltip>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{
                                  textDecoration: subtask.status === 'completed' ? 'line-through' : 'none',
                                  color: subtask.status === 'completed' ? 'text.disabled' : 'text.primary'
                                }}
                              >
                                {subtask.title}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {/* Important notes */}
                {step.notes && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.grey[50], borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ErrorOutlineIcon fontSize="small" color="warning" />
                      Important Notes:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {step.notes}
                    </Typography>
                  </Box>
                )}

                {/* Resources */}
                {step.resources && step.resources.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Helpful Resources:
                    </Typography>
                    <List dense disablePadding>
                      {step.resources.map((resource, index) => (
                        <ListItem
                          key={index}
                          disablePadding
                          sx={{ py: 0.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {resource.type === 'document' ? (
                              <ArticleIcon fontSize="small" color="primary" />
                            ) : (
                              <LinkIcon fontSize="small" color="primary" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Link
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                color="primary"
                                variant="body2"
                              >
                                {resource.title}
                              </Link>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Action buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    startIcon={<HelpOutlineIcon />}
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => {/* TODO: Implement help functionality */}}
                    aria-label={`Get Help for ${step.title}`}
                    data-testid={`help-button-${step._id || step.id}`}
                  >
                    Get Help
                  </Button>

                  {step.status !== 'completed' ? (
                    <Button
                      startIcon={<AssignmentTurnedInIcon />}
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => handleStatusUpdate(step._id || step.id, 'completed')}
                      aria-label={`Mark ${step.title} as Complete`}
                      data-testid={`complete-button-${step._id || step.id}`}
                    >
                      Mark Complete
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => handleStatusUpdate(step._id || step.id, 'pending')}
                      aria-label={`Mark ${step.title} as Incomplete`}
                      data-testid={`incomplete-button-${step._id || step.id}`}
                    >
                      Mark Incomplete
                    </Button>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Paper>
  );
};

StepGuidance.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.oneOf(['completed', 'in_progress', 'pending', 'blocked']),
      order: PropTypes.number,
      estimatedDays: PropTypes.number,
      notes: PropTypes.string,
      subtasks: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          id: PropTypes.string,
          title: PropTypes.string.isRequired,
          status: PropTypes.string
        })
      ),
      resources: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['document', 'link'])
        })
      )
    })
  ),
  onStepUpdate: PropTypes.func,
  isLoading: PropTypes.bool
};

export default StepGuidance;
