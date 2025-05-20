import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { Box, Typography, Paper, Button, ButtonGroup, IconButton, Tooltip, Tab, Tabs } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import TimelineIcon from '@mui/icons-material/Timeline';
// Import Stepper components
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import Select from '@mui/material/Select'; // For document status dropdown
import MenuItem from '@mui/material/MenuItem'; // For document status dropdown
import FormControl from '@mui/material/FormControl'; // For document status dropdown
import InputLabel from '@mui/material/InputLabel'; // For document status dropdown
import Divider from '@mui/material/Divider'; // To separate tasks and documents
import { updateTaskStatus, updateDocumentStatus } from '../roadmapSlice'; // Import actions

// Import new components
import TimelineVisualization from './TimelineVisualization';
import MilestoneTracker from './MilestoneTracker';
import StepGuidance from './StepGuidance';

const InteractiveTimeline = ({ roadmap }) => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState('stepper'); // stepper, list, timeline, calendar, gantt
  const [activeStep, setActiveStep] = useState(0); // For Stepper view
  const [activeTab, setActiveTab] = useState(0); // For tab navigation

  // Determine active step based on task statuses (simplified logic)
  useEffect(() => {
      if (roadmap?.phases) {
          let currentPhaseIndex = 0;
          for (let i = 0; i < roadmap.phases.length; i++) {
              const phase = roadmap.phases[i];
              // If any task in the phase is not completed, this is likely the active phase
              if (phase.tasks?.some(t => t.status !== 'completed')) {
                  currentPhaseIndex = i;
                  break;
              }
              // If all tasks in this phase are complete, move to check next
              if (i === roadmap.phases.length - 1 && phase.tasks?.every(t => t.status === 'completed')) {
                   currentPhaseIndex = roadmap.phases.length; // Mark all as complete
              }
          }
          setActiveStep(currentPhaseIndex);
      }
  }, [roadmap]);

  const handleTaskToggle = (phaseId, taskId, currentStatus) => {
    if (!roadmap?._id || !phaseId || !taskId) {
        console.error("Missing IDs for task toggle");
        return;
    }
    // Simple toggle: completed -> pending, otherwise -> completed
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    console.log(`Toggling task ${taskId} in phase ${phaseId} to ${newStatus}`);
    dispatch(updateTaskStatus({
        roadmapId: roadmap._id,
        phaseId,
        taskId,
        updateData: { status: newStatus }
    }));
    // TODO: Add visual feedback for loading/error state of the specific task update
  };

  const handleDocumentStatusChange = (phaseId, docStatusId, newStatus) => {
     if (!roadmap?._id || !phaseId || !docStatusId || !newStatus) {
        console.error("Missing IDs or status for document status update");
        return;
    }
     console.log(`Updating document status ${docStatusId} in phase ${phaseId} to ${newStatus}`);
     dispatch(updateDocumentStatus({
        roadmapId: roadmap._id,
        phaseId,
        docStatusId,
        updateData: { status: newStatus }
     }));
     // TODO: Add visual feedback for loading/error state
  };

  if (!roadmap || !roadmap.phases) {
    return <Typography>No timeline data available for this roadmap.</Typography>;
  }

  // Define possible document statuses for the dropdown
  const documentStatuses = ['needed', 'in_progress', 'uploaded', 'submitted', 'verified', 'rejected', 'not_applicable'];

  // Extract milestones from roadmap data
  const extractMilestones = () => {
    if (!roadmap.milestones) {
      // If no explicit milestones, create them from phase start/end dates
      return roadmap.phases.map((phase, index) => ({
        id: `auto-milestone-${index}`,
        title: `${phase.phaseName} ${index === 0 ? 'Start' : 'Completion'}`,
        description: `${index === 0 ? 'Beginning' : 'Completion'} of ${phase.phaseName} phase`,
        date: index === 0 ? phase.startDate : phase.endDate,
        status: phase.status || 'pending',
        phaseId: phase._id
      }));
    }
    return roadmap.milestones;
  };

  // Extract steps from roadmap data
  const extractSteps = () => {
    if (!roadmap.phases) return [];

    // Create steps from phases and their tasks
    return roadmap.phases.flatMap((phase, phaseIndex) => {
      // Create a main step for the phase
      const phaseStep = {
        id: phase._id || `phase-${phaseIndex}`,
        title: phase.phaseName,
        description: phase.description || `Complete all tasks in the ${phase.phaseName} phase`,
        status: phase.status || 'pending',
        order: phaseIndex + 1,
        estimatedDays: phase.estimatedDays,
        subtasks: phase.tasks?.map(task => ({
          id: task._id,
          title: task.title,
          status: task.status || 'pending'
        })) || []
      };

      return phaseStep;
    });
  };

  // Handle milestone status update
  const handleMilestoneUpdate = (milestoneId, updateData) => {
    console.log(`Updating milestone ${milestoneId} with data:`, updateData);
    // TODO: Implement milestone update functionality
  };

  // Handle step update
  const handleStepUpdate = (stepId, updateData) => {
    console.log(`Updating step ${stepId} with data:`, updateData);
    // If this is a subtask update, find the corresponding task and update it
    if (updateData.subtaskId) {
      // Find the phase containing this task
      const phase = roadmap.phases.find(p =>
        p.tasks?.some(t => t._id === updateData.subtaskId)
      );

      if (phase) {
        handleTaskToggle(
          phase._id,
          updateData.subtaskId,
          updateData.status === 'completed' ? 'pending' : 'completed'
        );
      }
    } else {
      // This is a phase update
      // TODO: Implement phase status update
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" component="h3">
          Roadmap Progress
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
           {/* View Mode Buttons */}
           <ButtonGroup size="small" variant="outlined" aria-label="timeline view mode">
                <Tooltip title="Stepper View">
                    <Button onClick={() => setViewMode('stepper')} variant={viewMode === 'stepper' ? 'contained' : 'outlined'}><ViewTimelineIcon /></Button>
                </Tooltip>
                <Tooltip title="Timeline View">
                    <Button onClick={() => setViewMode('timeline')} variant={viewMode === 'timeline' ? 'contained' : 'outlined'}><TimelineIcon /></Button>
                </Tooltip>
                <Tooltip title="List View">
                    <Button onClick={() => setViewMode('list')} variant={viewMode === 'list' ? 'contained' : 'outlined'}><ViewListIcon /></Button>
                </Tooltip>
                <Tooltip title="Calendar View (Coming Soon)">
                    <span>
                        <Button onClick={() => setViewMode('calendar')} variant={viewMode === 'calendar' ? 'contained' : 'outlined'} disabled><CalendarViewMonthIcon /></Button>
                    </span>
                </Tooltip>
           </ButtonGroup>
           {/* Filter Button */}
           <Tooltip title="Filter Tasks">
              <IconButton size="small"><FilterListIcon /></IconButton>
           </Tooltip>
        </Box>
      </Box>

      {/* Tabs for different roadmap views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="roadmap views"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Progress" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Milestones" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Guidance" id="tab-2" aria-controls="tabpanel-2" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box role="tabpanel" hidden={activeTab !== 0} id="tabpanel-0" aria-labelledby="tab-0">
        {activeTab === 0 && (
          <>
            {/* Conditional Rendering based on viewMode */}
            {viewMode === 'stepper' && (
               <Stepper activeStep={activeStep} orientation="vertical">
                  {roadmap.phases.map((phase, index) => (
                    <Step key={phase.phaseName || index} expanded={true}> {/* Keep expanded for visibility */}
                      <StepLabel>
                        <Typography variant="subtitle1">{phase.phaseName}</Typography>
                      </StepLabel>
                      <StepContent>
                        <List dense disablePadding>
                          {phase.tasks?.map((task) => (
                            <ListItem
                              key={task.taskId}
                              secondaryAction={
                                <Tooltip title="Edit Task">
                                   <IconButton edge="end" size="small">
                                     <EditIcon fontSize="inherit" />
                                   </IconButton>
                                </Tooltip>
                              }
                              disablePadding
                            >
                              <Checkbox
                                edge="start"
                                checked={task.status === 'completed'}
                                onChange={() => handleTaskToggle(phase._id, task._id, task.status)} // Use phase._id and task._id
                                size="small"
                              />
                              <ListItemText
                                primary={task.title}
                                secondary={task.description || null}
                                sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'text.disabled' : 'text.primary' }}
                              />
                            </ListItem>
                          ))}
                        </List>

                        {/* Document Checklist for the Phase */}
                        {phase.documents && phase.documents.length > 0 && (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="caption" sx={{ pl: 2, color: 'text.secondary' }}>Required Documents:</Typography>
                            <List dense disablePadding sx={{ pl: 2 }}>
                              {phase.documents.map((doc) => (
                                <ListItem key={doc._id} disablePadding>
                                   <ListItemText primary={doc.name} sx={{ flexGrow: 1, mr: 1 }} />
                                   <FormControl size="small" sx={{ minWidth: 120 }}>
                                     <InputLabel id={`doc-status-label-${doc._id}`}>Status</InputLabel>
                                     <Select
                                       labelId={`doc-status-label-${doc._id}`}
                                       id={`doc-status-select-${doc._id}`}
                                       value={doc.status || 'needed'}
                                       label="Status"
                                       onChange={(e) => handleDocumentStatusChange(phase._id, doc._id, e.target.value)}
                                       sx={{ fontSize: '0.8rem' }}
                                     >
                                       {documentStatuses.map((statusOption) => (
                                          <MenuItem key={statusOption} value={statusOption} sx={{ fontSize: '0.8rem' }}>
                                              {statusOption.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                          </MenuItem>
                                       ))}
                                     </Select>
                                   </FormControl>
                                </ListItem>
                              ))}
                            </List>
                          </>
                        )}
                      </StepContent>
                    </Step>
                  ))}
               </Stepper>
            )}

            {viewMode === 'list' && (
               <List>
                  {roadmap.phases.map((phase, index) => (
                     <React.Fragment key={phase.phaseName || index}>
                       <ListItem>
                         <ListItemText primary={<Typography variant="h6">{phase.phaseName}</Typography>} />
                       </ListItem>
                       <List component="div" disablePadding sx={{ pl: 4 }}>
                          {phase.tasks?.map((task) => (
                             <ListItem key={task.taskId}>
                                <Checkbox
                                   edge="start"
                                   checked={task.status === 'completed'}
                                   onChange={() => handleTaskToggle(phase._id, task._id, task.status)} // Use phase._id and task._id
                                   size="small"
                                   sx={{ mr: 1 }}
                                />
                                <ListItemText
                                   primary={task.title}
                                   secondary={task.description || null}
                                   sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'text.disabled' : 'text.primary' }}
                                />
                             </ListItem>
                          ))}
                          {/* Document Checklist for the Phase */}
                          {phase.documents && phase.documents.length > 0 && (
                              <>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Required Documents:</Typography>
                                <List dense disablePadding>
                                  {phase.documents.map((doc) => (
                                    <ListItem key={doc._id} disablePadding>
                                       <ListItemText primary={doc.name} sx={{ flexGrow: 1, mr: 1 }} />
                                       <FormControl size="small" sx={{ minWidth: 120 }}>
                                         <InputLabel id={`doc-status-label-list-${doc._id}`}>Status</InputLabel>
                                         <Select
                                           labelId={`doc-status-label-list-${doc._id}`}
                                           id={`doc-status-select-list-${doc._id}`}
                                           value={doc.status || 'needed'}
                                           label="Status"
                                           onChange={(e) => handleDocumentStatusChange(phase._id, doc._id, e.target.value)}
                                           sx={{ fontSize: '0.8rem' }}
                                         >
                                           {documentStatuses.map((statusOption) => (
                                              <MenuItem key={statusOption} value={statusOption} sx={{ fontSize: '0.8rem' }}>
                                                  {statusOption.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                              </MenuItem>
                                           ))}
                                         </Select>
                                       </FormControl>
                                    </ListItem>
                                  ))}
                                </List>
                              </>
                          )}
                       </List>
                     </React.Fragment>
                  ))}
               </List>
            )}

            {viewMode === 'timeline' && (
              <TimelineVisualization
                phases={roadmap.phases}
                milestones={extractMilestones()}
                startDate={roadmap.startDate ? new Date(roadmap.startDate) : new Date()}
                endDate={roadmap.targetCompletionDate ? new Date(roadmap.targetCompletionDate) : new Date(new Date().setMonth(new Date().getMonth() + 6))}
                currentDate={new Date()}
              />
            )}

            {/* Placeholder for calendar view */}
            {viewMode === 'calendar' && (
               <Box sx={{ minHeight: '300px', border: '1px dashed lightblue', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Typography color="text.secondary">
                       Calendar View Coming Soon
                   </Typography>
               </Box>
            )}
          </>
        )}
      </Box>

      <Box role="tabpanel" hidden={activeTab !== 1} id="tabpanel-1" aria-labelledby="tab-1">
        {activeTab === 1 && (
          <MilestoneTracker
            milestones={extractMilestones()}
            onMilestoneUpdate={handleMilestoneUpdate}
            isLoading={false}
          />
        )}
      </Box>

      <Box role="tabpanel" hidden={activeTab !== 2} id="tabpanel-2" aria-labelledby="tab-2">
        {activeTab === 2 && (
          <StepGuidance
            steps={extractSteps()}
            onStepUpdate={handleStepUpdate}
            isLoading={false}
          />
        )}
      </Box>
    </Paper>
  );
};

export default InteractiveTimeline;
