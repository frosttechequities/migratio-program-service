import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  MoreVert as MoreVertIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';

const UpcomingTasksWidget = () => {
  const { roadmaps } = useSelector((state) => state.roadmap);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Extract tasks from roadmaps
  const allTasks = [];
  roadmaps.forEach((roadmap) => {
    if (roadmap.phases) {
      roadmap.phases.forEach((phase) => {
        if (phase.milestones) {
          phase.milestones.forEach((milestone) => {
            if (milestone.tasks) {
              milestone.tasks.forEach((task) => {
                if (task.status !== 'completed') {
                  allTasks.push({
                    ...task,
                    roadmapId: roadmap._id,
                    roadmapTitle: roadmap.title,
                    phaseId: phase._id,
                    phaseTitle: phase.title,
                    milestoneId: milestone._id,
                    milestoneTitle: milestone.title,
                    dueDate: milestone.dueDate || null,
                  });
                }
              });
            }
          });
        }
      });
    }
  });

  // Sort tasks by due date (if available)
  const sortedTasks = [...allTasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleMarkAsCompleted = () => {
    // In a real app, this would dispatch an action to update the task status
    console.log('Mark as completed:', selectedTask);
    handleMenuClose();
  };

  const handleMarkAsHighPriority = () => {
    // In a real app, this would dispatch an action to update the task priority
    console.log('Mark as high priority:', selectedTask);
    handleMenuClose();
  };

  const getPriorityColor = (dueDate) => {
    if (!dueDate) return 'default';
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'error';
    if (diffDays <= 7) return 'warning';
    if (diffDays <= 14) return 'info';
    return 'default';
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Tasks
      </Typography>

      {sortedTasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No upcoming tasks found.
          </Typography>
        </Box>
      ) : (
        <List sx={{ maxHeight: 350, overflow: 'auto' }}>
          {sortedTasks.slice(0, 5).map((task, index) => (
            <React.Fragment key={task._id || index}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="more"
                    onClick={(e) => handleMenuOpen(e, task)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <Checkbox edge="start" tabIndex={-1} disableRipple />
                </ListItemIcon>
                <ListItemText
                  primary={task.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block' }}
                      >
                        {task.milestoneTitle} - {task.phaseTitle}
                      </Typography>
                      <Typography component="span" variant="caption" color="text.secondary">
                        {task.roadmapTitle}
                      </Typography>
                      {task.dueDate && (
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                            size="small"
                            color={getPriorityColor(task.dueDate)}
                            icon={<FlagIcon />}
                          />
                        </Box>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < sortedTasks.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleMarkAsCompleted}>Mark as completed</MenuItem>
        <MenuItem onClick={handleMarkAsHighPriority}>Mark as high priority</MenuItem>
      </Menu>
    </Paper>
  );
};

export default UpcomingTasksWidget;
