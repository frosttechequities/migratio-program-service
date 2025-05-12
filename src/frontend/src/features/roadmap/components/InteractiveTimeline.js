import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { Box, Typography, Paper, Button, ButtonGroup, IconButton, Tooltip } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
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

// TODO: Implement actual timeline visualization using D3
// TODO: Implement Calendar/Gantt views
const InteractiveTimeline = ({ roadmap }) => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState('stepper'); // stepper, list (calendar, gantt later)
  const [activeStep, setActiveStep] = useState(0); // For Stepper view

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
                 <Tooltip title="Calendar View (Not Implemented)">
                    <Button onClick={() => setViewMode('calendar')} variant={viewMode === 'calendar' ? 'contained' : 'outlined'} disabled><CalendarViewMonthIcon /></Button>
                 </Tooltip>
                 <Tooltip title="List View">
                    <Button onClick={() => setViewMode('list')} variant={viewMode === 'list' ? 'contained' : 'outlined'}><ViewListIcon /></Button>
                 </Tooltip>
                 {/* Add Gantt view button if needed */}
           </ButtonGroup>
           {/* Zoom Buttons (Keep disabled for V1) */}
           <ButtonGroup size="small" variant="outlined" aria-label="timeline zoom controls">
               <Tooltip title="Zoom Out (Not Implemented)">
                 <IconButton size="small" disabled><ZoomOutIcon fontSize="small" /></IconButton>
               </Tooltip>
                <Tooltip title="Zoom In (Not Implemented)">
                 <IconButton size="small" disabled><ZoomInIcon fontSize="small" /></IconButton>
               </Tooltip>
           </ButtonGroup>
           {/* Filter Button */}
           <Tooltip title="Filter Tasks (Not Implemented)">
              <IconButton size="small" disabled><FilterListIcon /></IconButton>
           </Tooltip>
        </Box>
      </Box>

      {/* Conditional Rendering based on viewMode */}
      {viewMode === 'stepper' && (
         <Stepper activeStep={activeStep} orientation="vertical">
            {roadmap.phases.map((phase, index) => (
              <Step key={phase.phaseName || index} expanded={true}> {/* Keep expanded for visibility */}
                <StepLabel
                   // Optional: Add icon based on phase status
                >
                  <Typography variant="subtitle1">{phase.phaseName}</Typography>
                </StepLabel>
                <StepContent>
                  <List dense disablePadding>
                    {phase.tasks?.map((task) => (
                      <ListItem
                        key={task.taskId}
                        secondaryAction={
                          <Tooltip title="Edit Task (Not Implemented)">
                             <IconButton edge="end" size="small" disabled>
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
                             {/* TODO: Add link to uploaded document if doc.documentId exists */}
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                   {/* TODO: Add Milestones display here */}
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
                    {/* TODO: Add Milestones display here */}
                 </List>
               </React.Fragment>
            ))}
         </List>
      )}

       {/* Placeholder for other views */}
       {viewMode !== 'stepper' && viewMode !== 'list' && (
           <Box sx={{ minHeight: '300px', border: '1px dashed lightblue', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Typography color="text.secondary">
                   Visualization Placeholder (View Mode: {viewMode})
               </Typography>
           </Box>
       )}
    </Paper>
  );
};

export default InteractiveTimeline;
