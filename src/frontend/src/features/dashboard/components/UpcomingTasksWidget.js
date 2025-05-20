import React, { useMemo, useCallback } from 'react';
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
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'; // Example for high priority
import LowPriorityIcon from '@mui/icons-material/LowPriority'; // Example for low priority

// TODO: Fetch actual tasks dynamically
const UpcomingTasksWidget = ({ tasks = [] }) => {
  // Initialize translation hook with error handling
  let t;
  try {
    const translation = useTranslation();
    t = translation.t;
  } catch (error) {
    console.warn('Translation not available:', error);
    // Fallback translation function
    t = (key) => {
      if (key === 'dashboard.tasks.title') return 'Upcoming Tasks';
      if (key === 'common.viewAll') return 'View All';
      if (key === 'dashboard.tasks.markComplete') return 'Mark as complete';
      if (key === 'dashboard.tasks.markIncomplete') return 'Mark as incomplete';
      if (key === 'dashboard.tasks.options') return 'Task Options';
      if (key === 'dashboard.tasks.due') return 'Due';
      if (key === 'dashboard.tasks.priority.high') return 'High priority';
      if (key === 'dashboard.tasks.priority.medium') return 'Medium priority';
      if (key === 'dashboard.tasks.priority.low') return 'Low priority';
      if (key === 'dashboard.tasks.emptyState') return 'No upcoming tasks.';
      return key;
    };
  }

  // Ensure tasks is an array and handle undefined/null - memoized for performance
  const validTasks = useMemo(() => {
    return Array.isArray(tasks) ? tasks : [];
  }, [tasks]);

  // Display top 3-5 tasks or fewer - memoized for performance
  const upcomingTasks = useMemo(() => {
    return validTasks.slice(0, 4); // Example: show top 4
  }, [validTasks]);

  // Memoized task check handler to prevent unnecessary re-renders
  const handleTaskCheck = useCallback((taskId) => {
    // TODO: Implement logic to mark task as complete (dispatch Redux action)
    console.log(`Task ${taskId} checked/unchecked`);
  }, []);

  // Memoized priority icon function to prevent unnecessary re-renders
  const getPriorityIcon = useCallback((priority) => {
    if (priority === 'high') return <PriorityHighIcon color="error" fontSize="small" />;
    if (priority === 'low') return <LowPriorityIcon color="disabled" fontSize="small" />;
    return null; // Medium priority might not need an icon
  }, []);

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" component="h3">
          {t('dashboard.tasks.title')}
        </Typography>
        <Button component={RouterLink} to="/tasks" size="small">
          {t('common.viewAll')}
        </Button>
      </Box>
      {upcomingTasks.length > 0 ? (
        <List dense sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {upcomingTasks.map((task, index) => (
            <ListItem
              key={task?.taskId || task?.id || index}
              disablePadding
              secondaryAction={
                <Tooltip title={t('dashboard.tasks.options')}>
                  <IconButton
                    edge="end"
                    aria-label={`${t('dashboard.tasks.options')}: ${task?.title || task?.name || 'Task'}`}
                    tabIndex="0"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              }
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                 <Tooltip title={task?.status === 'completed' ? t('dashboard.tasks.markIncomplete') : t('dashboard.tasks.markComplete')}>
                    <Checkbox
                        edge="start"
                        checked={task?.status === 'completed' || false}
                        onChange={() => handleTaskCheck(task?.taskId || task?.id || index)}
                        tabIndex="0"
                        disableRipple
                        inputProps={{
                          'aria-labelledby': `task-label-${task?.taskId || task?.id || index}`,
                          'aria-label': `${task?.status === 'completed' ? t('dashboard.tasks.markIncomplete') : t('dashboard.tasks.markComplete')}: ${task?.title || task?.name || 'Task'}`
                        }}
                    />
                 </Tooltip>
              </ListItemIcon>
              <ListItemText
                id={`task-label-${task?.taskId || task?.id || index}`}
                primary={
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: task?.status === 'completed' ? 'line-through' : 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%'
                      }}
                      title={task?.title || task?.name || 'Task Title'}
                    >
                        {task?.title || task?.name || 'Task Title'}
                    </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      maxWidth: '100%'
                    }}
                    title={`${t('dashboard.tasks.due')}: ${task?.dueDate || task?.due || 'N/A'} ${task?.relatedProgram ? `(${task.relatedProgram})` : ''}`}
                  >
                    {t('dashboard.tasks.due')}: {task?.dueDate || task?.due || 'N/A'} {task?.relatedProgram ? `(${task.relatedProgram})` : ''}
                  </Typography>
                }
              />
               {getPriorityIcon(task?.priority) && (
                 <Tooltip title={task?.priority === 'high' ? t('dashboard.tasks.priority.high') :
                                  task?.priority === 'low' ? t('dashboard.tasks.priority.low') :
                                  t('dashboard.tasks.priority.medium')}>
                    <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                        {getPriorityIcon(task?.priority)}
                    </ListItemIcon>
                 </Tooltip>
               )}
            </ListItem>
          ))}
        </List>
      ) : (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexGrow: 1 }}>
            <Typography color="text.secondary">
                {t('dashboard.tasks.emptyState')}
            </Typography>
         </Box>
      )}
    </Paper>
  );
};

export default UpcomingTasksWidget;
