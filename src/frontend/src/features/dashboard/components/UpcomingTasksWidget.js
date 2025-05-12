import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  Tooltip,
  Link as MuiLink,
  Chip,
  Button // Added Button import
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'; // Example for high priority
import LowPriorityIcon from '@mui/icons-material/LowPriority'; // Example for low priority

// TODO: Fetch actual tasks dynamically
const UpcomingTasksWidget = ({ tasks = [] }) => {

  // Display top 3-5 tasks or fewer
  const upcomingTasks = tasks.slice(0, 4); // Example: show top 4

  const handleTaskCheck = (taskId) => {
    // TODO: Implement logic to mark task as complete (dispatch Redux action)
    console.log(`Task ${taskId} checked/unchecked`);
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return <PriorityHighIcon color="error" fontSize="small" />;
    if (priority === 'low') return <LowPriorityIcon color="disabled" fontSize="small" />;
    return null; // Medium priority might not need an icon
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" component="h3">
          Upcoming Tasks
        </Typography>
        <Button component={RouterLink} to="/tasks" size="small">
          View All
        </Button>
      </Box>
      {upcomingTasks.length > 0 ? (
        <List dense sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {upcomingTasks.map((task) => (
            <ListItem
              key={task.taskId}
              disablePadding
              secondaryAction={
                <Tooltip title="Task Options">
                  <IconButton edge="end" aria-label="options">
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              }
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                 <Tooltip title={task.completed ? "Mark as incomplete" : "Mark as complete"}>
                    <Checkbox
                        edge="start"
                        checked={task.completed || false}
                        onChange={() => handleTaskCheck(task.taskId)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': `task-label-${task.taskId}` }}
                    />
                 </Tooltip>
              </ListItemIcon>
              <ListItemText
                id={`task-label-${task.taskId}`}
                primary={
                    <Typography variant="body2" sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.taskTitle || 'Task Title'}
                    </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Due: {task.dueDate || 'N/A'} {task.relatedProgram ? `(${task.relatedProgram})` : ''}
                  </Typography>
                }
              />
               {getPriorityIcon(task.priority) && (
                 <Tooltip title={`${task.priority || 'Medium'} priority`}>
                    <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                        {getPriorityIcon(task.priority)}
                    </ListItemIcon>
                 </Tooltip>
               )}
            </ListItem>
          ))}
        </List>
      ) : (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexGrow: 1 }}>
            <Typography color="text.secondary">
                No upcoming tasks.
            </Typography>
         </Box>
      )}
    </Paper>
  );
};

export default UpcomingTasksWidget;
