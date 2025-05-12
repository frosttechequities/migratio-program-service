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
  Chip,
  Checkbox
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon,
  Today as TodayIcon,
  Add as AddIcon
} from '@mui/icons-material';

/**
 * Task widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - Task data
 * @returns {React.ReactNode} Task widget component
 */
const TaskWidget = ({ data }) => {
  // If no data is provided, show a placeholder
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Your Tasks
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You don't have any tasks yet
          </Typography>
          <Button 
            component={RouterLink} 
            to="/roadmap" 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            View Your Roadmap
          </Button>
        </Box>
      </Paper>
    );
  }

  // Sort tasks by due date (overdue first, then upcoming)
  const sortedTasks = [...data].sort((a, b) => {
    // If task is completed, put it at the end
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    
    // If task has no due date, put it at the end
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && !b.dueDate) return -1;
    
    // Sort by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    
    return 0;
  });

  // Get tasks that need attention (not completed and due soon or overdue)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tasksNeedingAttention = sortedTasks.filter(task => {
    if (task.status === 'completed') return false;
    
    if (!task.dueDate) return true;
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    // Due within 7 days or overdue
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    return dueDate <= sevenDaysFromNow;
  });

  // Get task stats
  const taskStats = {
    total: sortedTasks.length,
    completed: sortedTasks.filter(task => task.status === 'completed').length,
    inProgress: sortedTasks.filter(task => task.status === 'in_progress').length,
    notStarted: sortedTasks.filter(task => task.status === 'not_started').length,
    blocked: sortedTasks.filter(task => task.status === 'blocked').length,
    overdue: sortedTasks.filter(task => {
      if (task.status === 'completed' || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length
  };

  // Format due date
  const formatDueDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    
    // Check if overdue
    if (dueDate < today) {
      const diffTime = Math.abs(today - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Overdue by ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
    
    // Check if due today
    if (dueDate.getTime() === today.getTime()) {
      return 'Due today';
    }
    
    // Check if due tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (dueDate.getTime() === tomorrow.getTime()) {
      return 'Due tomorrow';
    }
    
    // Check if due within a week
    const oneWeek = new Date(today);
    oneWeek.setDate(today.getDate() + 7);
    if (dueDate <= oneWeek) {
      const options = { weekday: 'long' };
      return `Due ${dueDate.toLocaleDateString(undefined, options)}`;
    }
    
    // Otherwise, show the date
    return `Due ${dueDate.toLocaleDateString()}`;
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Your Tasks
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

      {/* Task stats */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip 
          label={`${taskStats.completed}/${taskStats.total} Completed`} 
          size="small"
          variant="outlined"
        />
        {taskStats.overdue > 0 && (
          <Chip 
            label={`${taskStats.overdue} Overdue`} 
            size="small"
            color="error"
            variant="outlined"
          />
        )}
      </Box>

      {/* Tasks needing attention */}
      {tasksNeedingAttention.length > 0 ? (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Upcoming Tasks
          </Typography>
          <List dense sx={{ mb: 2 }}>
            {tasksNeedingAttention.slice(0, 3).map((task) => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < today;
              
              return (
                <ListItem 
                  key={task._id} 
                  sx={{ 
                    py: 1,
                    opacity: task.status === 'completed' ? 0.6 : 1
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox 
                      edge="start"
                      checked={task.status === 'completed'}
                      tabIndex={-1}
                      disableRipple
                      size="small"
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={task.title} 
                    secondary={formatDueDate(task.dueDate)}
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      style: { 
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                      }
                    }}
                    secondaryTypographyProps={{ 
                      variant: 'caption',
                      color: isOverdue ? 'error' : 'text.secondary'
                    }}
                  />
                  {isOverdue && (
                    <WarningIcon color="error" fontSize="small" sx={{ ml: 1 }} />
                  )}
                  {!isOverdue && task.dueDate && new Date(task.dueDate).getTime() === today.getTime() && (
                    <TodayIcon color="primary" fontSize="small" sx={{ ml: 1 }} />
                  )}
                </ListItem>
              );
            })}
          </List>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No upcoming tasks
          </Typography>
        </Box>
      )}

      {/* Add task button */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button 
          component={RouterLink} 
          to="/roadmap" 
          variant="outlined" 
          size="small"
          startIcon={<AddIcon />}
          fullWidth
        >
          Add New Task
        </Button>
      </Box>
    </Paper>
  );
};

TaskWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      dueDate: PropTypes.string
    })
  )
};

export default TaskWidget;
