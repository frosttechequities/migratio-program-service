import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  LinearProgress, 
  Chip,
  Divider,
  Tooltip,
  useTheme
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';

/**
 * RoadmapProgress component
 * Displays overall progress of the roadmap with statistics and visualizations
 * 
 * @param {Object} props - Component props
 * @param {Object} props.roadmap - Roadmap data
 * @param {boolean} props.isLoading - Loading state
 * @returns {React.ReactElement} RoadmapProgress component
 */
const RoadmapProgress = ({ 
  roadmap = {}, 
  isLoading = false 
}) => {
  const theme = useTheme();
  
  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!roadmap.phases || roadmap.phases.length === 0) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    roadmap.phases.forEach(phase => {
      if (phase.tasks && phase.tasks.length > 0) {
        totalTasks += phase.tasks.length;
        completedTasks += phase.tasks.filter(task => task.status === 'completed').length;
      }
    });
    
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };
  
  // Calculate document progress
  const calculateDocumentProgress = () => {
    let totalDocs = 0;
    let completedDocs = 0;
    
    roadmap.phases?.forEach(phase => {
      if (phase.documents && phase.documents.length > 0) {
        totalDocs += phase.documents.length;
        completedDocs += phase.documents.filter(doc => 
          doc.status === 'verified' || doc.status === 'submitted'
        ).length;
      }
    });
    
    return totalDocs > 0 ? (completedDocs / totalDocs) * 100 : 0;
  };
  
  // Calculate phase progress
  const calculatePhaseProgress = () => {
    if (!roadmap.phases || roadmap.phases.length === 0) return [];
    
    return roadmap.phases.map(phase => {
      let totalTasks = phase.tasks?.length || 0;
      let completedTasks = phase.tasks?.filter(task => task.status === 'completed').length || 0;
      let progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      return {
        name: phase.phaseName,
        value: progress,
        color: getColorForProgress(progress),
        totalTasks,
        completedTasks
      };
    });
  };
  
  // Get color based on progress percentage
  const getColorForProgress = (progress) => {
    if (progress >= 100) return theme.palette.success.main;
    if (progress >= 75) return theme.palette.success.light;
    if (progress >= 50) return theme.palette.primary.main;
    if (progress >= 25) return theme.palette.primary.light;
    return theme.palette.grey[400];
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate time remaining
  const calculateTimeRemaining = () => {
    if (!roadmap.targetCompletionDate) return { days: 0, months: 0 };
    
    const targetDate = new Date(roadmap.targetCompletionDate);
    const today = new Date();
    
    // If target date is in the past, return 0
    if (targetDate < today) return { days: 0, months: 0 };
    
    const diffTime = Math.abs(targetDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    
    return {
      days: diffDays,
      months: diffMonths
    };
  };
  
  // Get status of the roadmap
  const getRoadmapStatus = () => {
    if (!roadmap.status) return 'pending';
    return roadmap.status;
  };
  
  // Get color for roadmap status
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'active':
      case 'in_progress':
        return 'primary';
      case 'on_hold':
        return 'warning';
      case 'abandoned':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Calculate statistics
  const overallProgress = calculateOverallProgress();
  const documentProgress = calculateDocumentProgress();
  const phaseProgress = calculatePhaseProgress();
  const timeRemaining = calculateTimeRemaining();
  const roadmapStatus = getRoadmapStatus();
  
  // Prepare data for pie chart
  const pieData = [
    { name: 'Completed', value: overallProgress, color: theme.palette.success.main },
    { name: 'Remaining', value: 100 - overallProgress, color: theme.palette.grey[300] }
  ];
  
  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body2">{`${payload[0].name}: ${payload[0].value.toFixed(1)}%`}</Typography>
        </Box>
      );
    }
    return null;
  };
  
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Roadmap Overview
        </Typography>
        <Tooltip title="Overall progress of your immigration roadmap">
          <InfoOutlinedIcon color="action" sx={{ cursor: 'pointer' }} />
        </Tooltip>
      </Box>
      
      {isLoading ? (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Left column - Progress visualization */}
          <Grid item xs={12} md={5}>
            <Box sx={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <Typography variant="h4" sx={{ mt: -12, color: theme.palette.text.primary, fontWeight: 'bold' }}>
                {Math.round(overallProgress)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 8 }}>
                Overall Completion
              </Typography>
            </Box>
          </Grid>
          
          {/* Right column - Statistics */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              {/* Status */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip 
                  label={roadmapStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  color={getStatusColor(roadmapStatus)}
                  sx={{ fontWeight: 'medium' }}
                />
              </Box>
              
              {/* Timeline */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Timeline
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(roadmap.startDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Target Completion
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(roadmap.targetCompletionDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Time Remaining */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Time Remaining
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon color="primary" sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">
                    {timeRemaining.months > 0 ? 
                      `${timeRemaining.months} month${timeRemaining.months !== 1 ? 's' : ''} (${timeRemaining.days} days)` : 
                      `${timeRemaining.days} day${timeRemaining.days !== 1 ? 's' : ''}`
                    }
                  </Typography>
                </Box>
              </Box>
              
              {/* Document Progress */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Document Progress
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(documentProgress)}% Complete
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={documentProgress} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            </Box>
          </Grid>
          
          {/* Phase Progress */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
              Phase Progress
            </Typography>
            <Grid container spacing={2}>
              {phaseProgress.map((phase, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2">
                        {phase.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {phase.completedTasks}/{phase.totalTasks} Tasks
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={phase.value} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: phase.color
                        }
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

RoadmapProgress.propTypes = {
  roadmap: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    startDate: PropTypes.string,
    targetCompletionDate: PropTypes.string,
    actualCompletionDate: PropTypes.string,
    phases: PropTypes.array,
    milestones: PropTypes.array
  }),
  isLoading: PropTypes.bool
};

export default RoadmapProgress;
