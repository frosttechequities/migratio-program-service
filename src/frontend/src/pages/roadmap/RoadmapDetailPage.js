import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Divider,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarTodayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { fetchRoadmapById } from '../../features/roadmap/roadmapSlice';

/**
 * RoadmapDetailPage component
 * Displays detailed information about a specific roadmap
 *
 * @returns {React.ReactElement} RoadmapDetailPage component
 */
const RoadmapDetailPage = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentRoadmap, isLoading, isError, error } = useSelector((state) => state.roadmap);

  // Local state for UI
  const [expandedPhase, setExpandedPhase] = useState(null);

  // Fetch roadmap data on component mount
  useEffect(() => {
    if (roadmapId) {
      dispatch(fetchRoadmapById(roadmapId));
    }
  }, [dispatch, roadmapId]);

  // Handle phase expansion
  const handlePhaseChange = (phaseId) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status chip based on status
  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'in_progress':
        return <Chip label="In Progress" color="primary" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="default" size="small" />;
      case 'delayed':
        return <Chip label="Delayed" color="warning" size="small" />;
      default:
        return <Chip label={status || 'Unknown'} size="small" />;
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/roadmap');
  };

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    if (currentRoadmap && currentRoadmap._id) {
      try {
        console.log('Generating PDF for roadmap:', currentRoadmap._id);

        // Instead of using the PDF blob directly, we'll create a text representation
        // that can be displayed in a new window

        // Create a formatted text version of the roadmap
        const roadmapText = `
ROADMAP: ${currentRoadmap.title}
=======================================================================
Description: ${currentRoadmap.description}
Program: ${currentRoadmap.programId}
Created: ${formatDate(currentRoadmap.createdAt)}
Progress: ${currentRoadmap.progress?.percentage || 0}%

PHASES:
=======================================================================
${currentRoadmap.phases?.map((phase, phaseIndex) => `
PHASE ${phaseIndex + 1}: ${phase.name || 'Unnamed Phase'}
-----------------------------------------------------------------------
Status: ${phase.status || 'Pending'}
Description: ${phase.description || 'No description provided'}

MILESTONES:
${phase.milestones?.map((milestone, milestoneIndex) => `
  MILESTONE ${milestoneIndex + 1}: ${milestone.name}
  Status: ${milestone.status || 'Pending'}
  Description: ${milestone.description || 'No description provided'}
  Due Date: ${formatDate(milestone.dueDate)}

  TASKS:
  ${milestone.tasks?.map((task, taskIndex) => `
    ☐ ${task.status === 'completed' ? '✓' : '☐'} ${task.name}
      ${task.description || 'No description provided'}
  `).join('') || '    No tasks defined'}
`).join('') || '  No milestones defined'}
`).join('') || 'No phases defined'}
`;

        // Open a new window and write the roadmap text to it
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>${currentRoadmap.title} - PDF Export</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                    white-space: pre-wrap;
                  }
                  h1 {
                    color: #1976d2;
                    border-bottom: 1px solid #e0e0e0;
                    padding-bottom: 10px;
                  }
                  .print-button {
                    background-color: #1976d2;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-bottom: 20px;
                  }
                  .note {
                    background-color: #f5f5f5;
                    padding: 10px;
                    border-radius: 4px;
                    margin-bottom: 20px;
                    font-style: italic;
                  }
                </style>
              </head>
              <body>
                <h1>${currentRoadmap.title}</h1>
                <div class="note">This is a text representation of your roadmap. Click the button below to print or save as PDF.</div>
                <button class="print-button" onclick="window.print()">Print / Save as PDF</button>
                <pre>${roadmapText}</pre>
              </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          alert('Unable to open new window. Please check your browser settings and try again.');
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again later.');
      }
    }
  };

  // Loading state
  if (isLoading && !currentRoadmap) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 4 }} />
          <Typography variant="h5" gutterBottom>
            Loading Roadmap Details
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Please wait while we load your roadmap information...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error state
  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error && error.includes('Network Error') ? 'Network Error' : 'Error'}
          </Typography>
          <Typography variant="body1" paragraph>
            {error && error.includes('Network Error')
              ? 'There was a problem connecting to the server. This could be due to a temporary service outage or network issue.'
              : error || 'An error occurred while loading the roadmap.'}
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back to Roadmaps
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(fetchRoadmapById(roadmapId))}
            >
              Try Again
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // If no roadmap found
  if (!currentRoadmap) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Roadmap Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The roadmap you're looking for doesn't exist or you don't have permission to view it.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Roadmaps
          </Button>
        </Paper>
      </Container>
    );
  }

  // Calculate completion percentage
  const completionPercentage = currentRoadmap.progress?.percentage || 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Back button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="text"
        >
          Back to Roadmaps
        </Button>
      </Box>

      {/* Roadmap header */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {currentRoadmap.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {getStatusChip(currentRoadmap.status || 'pending')}
              <Chip
                label={currentRoadmap.visibility || 'Private'}
                size="small"
                color={currentRoadmap.visibility === 'public' ? 'info' : 'default'}
              />
              <Chip
                label={currentRoadmap.programId}
                size="small"
                color="primary"
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Generate PDF">
              <IconButton color="primary" onClick={handleGeneratePDF}>
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton color="primary">
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="body1" paragraph>
          {currentRoadmap.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Start Date: <strong>{formatDate(currentRoadmap.startDate)}</strong>
              </Typography>
            </Box>
            {currentRoadmap.targetCompletionDate && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Target Completion: <strong>{formatDate(currentRoadmap.targetCompletionDate)}</strong>
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" gutterBottom>
                Overall Progress: {completionPercentage}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Roadmap phases */}
      <Typography variant="h5" gutterBottom>
        Roadmap Phases
      </Typography>

      {currentRoadmap.phases && currentRoadmap.phases.length > 0 ? (
        currentRoadmap.phases.map((phase, phaseIndex) => (
          <Accordion
            key={phase._id || phaseIndex}
            expanded={expandedPhase === (phase._id || phaseIndex)}
            onChange={() => handlePhaseChange(phase._id || phaseIndex)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">
                    {phase.name || `Phase ${phaseIndex + 1}`}
                  </Typography>
                  <Box sx={{ ml: 2 }}>
                    {getStatusChip(phase.status)}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {phase.milestones?.filter(m => m.status === 'completed').length || 0}/{phase.milestones?.length || 0} Milestones
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                {phase.description || 'No description provided.'}
              </Typography>

              {phase.milestones && phase.milestones.length > 0 ? (
                <List>
                  {phase.milestones.map((milestone, milestoneIndex) => (
                    <Card key={milestone._id || milestoneIndex} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {milestone.status === 'completed' ? (
                              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                            ) : (
                              <RadioButtonUncheckedIcon color="action" sx={{ mr: 1 }} />
                            )}
                            <Typography variant="subtitle1" fontWeight="bold">
                              {milestone.name}
                            </Typography>
                          </Box>
                          {getStatusChip(milestone.status)}
                        </Box>

                        <Typography variant="body2" paragraph>
                          {milestone.description}
                        </Typography>

                        {milestone.dueDate && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Due: {formatDate(milestone.dueDate)}
                          </Typography>
                        )}

                        {milestone.tasks && milestone.tasks.length > 0 && (
                          <>
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                              Tasks:
                            </Typography>
                            <List dense>
                              {milestone.tasks.map((task, taskIndex) => (
                                <ListItem key={task._id || taskIndex}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    {task.status === 'completed' ? (
                                      <CheckCircleIcon color="success" fontSize="small" />
                                    ) : (
                                      <RadioButtonUncheckedIcon color="action" fontSize="small" />
                                    )}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={task.name}
                                    secondary={task.description}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </>
                        )}

                        {milestone.documents && milestone.documents.length > 0 && (
                          <>
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                              Required Documents:
                            </Typography>
                            <List dense>
                              {milestone.documents.map((doc, docIndex) => (
                                <ListItem key={doc._id || docIndex}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <DescriptionIcon color="primary" fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={doc.name}
                                    secondary={doc.description}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No milestones defined for this phase.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Phases Defined
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This roadmap doesn't have any phases defined yet.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default RoadmapDetailPage;
