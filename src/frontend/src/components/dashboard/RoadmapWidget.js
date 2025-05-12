import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  Button, 
  LinearProgress,
  Chip,
  Badge
} from '@mui/material';
import { 
  Timeline as TimelineIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

/**
 * Roadmap widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - Roadmap data
 * @returns {React.ReactNode} Roadmap widget component
 */
const RoadmapWidget = ({ data }) => {
  // If no data is provided, show a placeholder
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Your Roadmaps
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You don't have any roadmaps yet
          </Typography>
          <Button 
            component={RouterLink} 
            to="/recommendations" 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            Create Your First Roadmap
          </Button>
        </Box>
      </Paper>
    );
  }

  // Sort roadmaps by last updated date
  const sortedRoadmaps = [...data].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  // Get the most recent roadmap
  const latestRoadmap = sortedRoadmaps[0];

  // Get the current phase of the latest roadmap
  const currentPhase = latestRoadmap.phases.find(phase => 
    phase.status === 'in_progress'
  ) || latestRoadmap.phases[0];

  // Get the next milestone
  const nextMilestone = currentPhase?.milestones?.find(milestone => 
    milestone.status !== 'completed'
  );

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Your Roadmaps
        </Typography>
        <Button 
          component={RouterLink} 
          to="/roadmap" 
          endIcon={<ArrowForwardIcon />}
          size="small"
        >
          View All
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Latest roadmap */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" component={RouterLink} to={`/roadmaps/${latestRoadmap._id}`} sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
            {latestRoadmap.title}
          </Typography>
          <Chip 
            label={latestRoadmap.status.charAt(0).toUpperCase() + latestRoadmap.status.slice(1)} 
            size="small"
            color={latestRoadmap.status === 'active' ? 'primary' : 'default'}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={latestRoadmap.completionPercentage} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">
              {latestRoadmap.completionPercentage}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Current Phase: {currentPhase?.title || 'Not started'}
        </Typography>
      </Box>

      {/* Next milestones */}
      <Typography variant="subtitle2" gutterBottom>
        Next Milestones
      </Typography>
      <List dense sx={{ mb: 2 }}>
        {nextMilestone ? (
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <RadioButtonUncheckedIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary={nextMilestone.title} 
              secondary={`Due: ${nextMilestone.dueDate ? new Date(nextMilestone.dueDate).toLocaleDateString() : 'Not set'}`}
            />
          </ListItem>
        ) : (
          <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="All milestones completed!" 
              secondary="Great job on your progress"
            />
          </ListItem>
        )}
      </List>

      {/* Other roadmaps */}
      {sortedRoadmaps.length > 1 && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Other Roadmaps
          </Typography>
          <List dense>
            {sortedRoadmaps.slice(1, 3).map((roadmap) => (
              <ListItem 
                key={roadmap._id} 
                component={RouterLink} 
                to={`/roadmaps/${roadmap._id}`}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Badge 
                    color="primary" 
                    badgeContent={roadmap.completionPercentage + '%'} 
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: '16px', minWidth: '16px' } }}
                  >
                    <FlagIcon fontSize="small" />
                  </Badge>
                </ListItemIcon>
                <ListItemText 
                  primary={roadmap.title} 
                  secondary={`Status: ${roadmap.status.charAt(0).toUpperCase() + roadmap.status.slice(1)}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Create new roadmap button */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button 
          component={RouterLink} 
          to="/recommendations" 
          variant="outlined" 
          size="small"
          fullWidth
        >
          Create New Roadmap
        </Button>
      </Box>
    </Paper>
  );
};

RoadmapWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      completionPercentage: PropTypes.number.isRequired,
      updatedAt: PropTypes.string.isRequired,
      phases: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          status: PropTypes.string.isRequired,
          milestones: PropTypes.arrayOf(
            PropTypes.shape({
              title: PropTypes.string.isRequired,
              status: PropTypes.string.isRequired,
              dueDate: PropTypes.string
            })
          )
        })
      )
    })
  )
};

export default RoadmapWidget;
