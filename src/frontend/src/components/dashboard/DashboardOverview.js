import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Card,
  CardContent,
  Button,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Description as DocumentIcon,
  Timeline as TimelineIcon,
  CheckCircle as TaskIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarTodayIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Dashboard overview component
 * @param {Object} props - Component props
 * @param {Object} props.data - Overview data
 * @returns {React.ReactNode} Dashboard overview component
 */
const DashboardOverview = ({ data }) => {
  const theme = useTheme();

  // If no data is provided, show a placeholder
  if (!data) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Paper>
    );
  }

  const {
    profileCompletion = 0,
    assessmentCompletion = 0,
    roadmapProgress = 0,
    documentsUploaded = 0,
    documentsRequired = 0,
    tasksCompleted = 0,
    totalTasks = 0,
    daysActive = 0,
    nextDeadline = null
  } = data;

  // Calculate document completion percentage
  const documentCompletion = documentsRequired > 0
    ? Math.round((documentsUploaded / documentsRequired) * 100)
    : 0;

  // Calculate task completion percentage
  const taskCompletion = totalTasks > 0
    ? Math.round((tasksCompleted / totalTasks) * 100)
    : 0;

  // Calculate overall progress
  const overallProgress = Math.round(
    (profileCompletion + assessmentCompletion + roadmapProgress + documentCompletion) / 4
  );

  // Format date for next deadline
  const formatDeadlineDate = (dateString) => {
    if (!dateString) return null;

    const deadlineDate = new Date(dateString);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;

    return deadlineDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: deadlineDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 0,
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: alpha('#fff', 0.1),
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: alpha('#fff', 0.05),
            zIndex: 0
          }}
        />

        <Box sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Your Immigration Journey
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              Track your progress and upcoming tasks
            </Typography>
          </Box>

          {/* Overall progress circle */}
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={{ xs: 70, sm: 80 }}
                thickness={4}
                sx={{ color: alpha('#fff', 0.2) }}
              />
              <CircularProgress
                variant="determinate"
                value={overallProgress}
                size={{ xs: 70, sm: 80 }}
                thickness={4}
                sx={{
                  color: '#fff',
                  position: 'absolute',
                  left: 0,
                }}
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
                <Typography variant="h5" component="div" color="white" fontWeight="bold">
                  {overallProgress}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'white' }}>
              Overall Progress
            </Typography>
          </Box>
        </Box>

        {/* Progress bars */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Profile completion */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <span>Profile</span>
                <span>{profileCompletion}%</span>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={profileCompletion}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mt: 1,
                  backgroundColor: alpha('#fff', 0.2),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Assessment completion */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <span>Assessment</span>
                <span>{assessmentCompletion}%</span>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={assessmentCompletion}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mt: 1,
                  backgroundColor: alpha('#fff', 0.2),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Roadmap progress */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <span>Roadmap</span>
                <span>{roadmapProgress}%</span>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={roadmapProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mt: 1,
                  backgroundColor: alpha('#fff', 0.2),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Document completion */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <span>Documents</span>
                <span>{documentsUploaded}/{documentsRequired}</span>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={documentCompletion}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mt: 1,
                  backgroundColor: alpha('#fff', 0.2),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2}>
          {/* Active Days Card */}
          <Grid item xs={6} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: { xs: 'none', md: 'translateY(-5px)' },
                  boxShadow: { xs: 1, md: 3 }
                }
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      borderRadius: '50%',
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      mr: { xs: 0, sm: 2 },
                      mb: { xs: 1, sm: 0 }
                    }}
                  >
                    <CalendarTodayIcon fontSize={window.innerWidth < 600 ? 'small' : 'medium'} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {daysActive}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                >
                  Days Active
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Tasks Card */}
          <Grid item xs={6} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: { xs: 'none', md: 'translateY(-5px)' },
                  boxShadow: { xs: 1, md: 3 }
                }
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      borderRadius: '50%',
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      mr: { xs: 0, sm: 2 },
                      mb: { xs: 1, sm: 0 }
                    }}
                  >
                    <TaskIcon fontSize={window.innerWidth < 600 ? 'small' : 'medium'} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {tasksCompleted}/{totalTasks}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                >
                  Tasks Completed
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={taskCompletion}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    mt: 1,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.success.main
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Documents Card */}
          <Grid item xs={6} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: { xs: 'none', md: 'translateY(-5px)' },
                  boxShadow: { xs: 1, md: 3 }
                }
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      borderRadius: '50%',
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      mr: { xs: 0, sm: 2 },
                      mb: { xs: 1, sm: 0 }
                    }}
                  >
                    <DocumentIcon fontSize={window.innerWidth < 600 ? 'small' : 'medium'} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {documentsUploaded}/{documentsRequired}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                >
                  Documents Uploaded
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={documentCompletion}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    mt: 1,
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.info.main
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Next Deadline Card */}
          <Grid item xs={6} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: nextDeadline ? 'warning.main' : 'divider',
                backgroundColor: nextDeadline ? alpha(theme.palette.warning.main, 0.05) : 'transparent',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: { xs: 'none', md: 'translateY(-5px)' },
                  boxShadow: { xs: 1, md: 3 }
                }
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      borderRadius: '50%',
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      mr: { xs: 0, sm: 2 },
                      mb: { xs: 1, sm: 0 }
                    }}
                  >
                    <FlagIcon fontSize={window.innerWidth < 600 ? 'small' : 'medium'} />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={nextDeadline ? 'warning.main' : 'text.secondary'}
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    {nextDeadline ? formatDeadlineDate(nextDeadline) : 'None'}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                >
                  Next Deadline
                </Typography>
                {nextDeadline && (
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Button
                      component={RouterLink}
                      to="/roadmap"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ mt: 1, p: 0 }}
                    >
                      View Details
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick actions */}
        <Box sx={{
          mt: 3,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          <Button
            component={RouterLink}
            to="/roadmap"
            variant="outlined"
            size="small"
            startIcon={<TimelineIcon />}
            sx={{
              minWidth: { xs: '45%', sm: 'auto' },
              fontSize: { xs: '0.75rem', sm: '0.8125rem' }
            }}
          >
            View Roadmap
          </Button>
          <Button
            component={RouterLink}
            to="/documents"
            variant="outlined"
            size="small"
            startIcon={<DocumentIcon />}
            sx={{
              minWidth: { xs: '45%', sm: 'auto' },
              fontSize: { xs: '0.75rem', sm: '0.8125rem' }
            }}
          >
            Manage Documents
          </Button>
          <Button
            component={RouterLink}
            to="/tasks"
            variant="outlined"
            size="small"
            startIcon={<TaskIcon />}
            sx={{
              minWidth: { xs: '45%', sm: 'auto' },
              fontSize: { xs: '0.75rem', sm: '0.8125rem' }
            }}
          >
            View Tasks
          </Button>
          <Button
            component={RouterLink}
            to="/notifications"
            variant="outlined"
            size="small"
            startIcon={<NotificationsIcon />}
            sx={{
              minWidth: { xs: '45%', sm: 'auto' },
              fontSize: { xs: '0.75rem', sm: '0.8125rem' }
            }}
          >
            Notifications
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

DashboardOverview.propTypes = {
  data: PropTypes.shape({
    profileCompletion: PropTypes.number,
    assessmentCompletion: PropTypes.number,
    roadmapProgress: PropTypes.number,
    documentsUploaded: PropTypes.number,
    documentsRequired: PropTypes.number,
    tasksCompleted: PropTypes.number,
    totalTasks: PropTypes.number,
    daysActive: PropTypes.number,
    nextDeadline: PropTypes.string
  })
};

export default DashboardOverview;
