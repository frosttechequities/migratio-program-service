import React from 'react';
import { Box, Typography, Paper, Grid, Button, Chip, LinearProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns'; // For formatting dates

// Helper function to format dates (or use a dedicated utils file)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'PP'); // e.g., Sep 21, 2023
  } catch (error) {
    return 'Invalid Date';
  }
};

// Helper function to calculate remaining time (example)
const calculateRemainingTime = (targetDate) => {
    if (!targetDate) return 'N/A';
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return 'Overdue';
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days > 60) return `~${Math.round(days / 30)} months`;
    return `${days} days`;
};

const RoadmapOverviewDisplay = ({ roadmap }) => {
  if (!roadmap) {
    return <Typography>No roadmap data available.</Typography>;
  }

  // Calculate overall progress (example - might come from backend or be calculated differently)
  const overallCompletion = roadmap.completionPercentage ||
                            roadmap.phases?.reduce((acc, phase) => acc + (phase.completionPercentage || 0), 0) / (roadmap.phases?.length || 1) ||
                            0;

   // Calculate overall task/doc/milestone counts (example)
   let totalTasks = 0;
   let completedTasks = 0;
   let totalDocuments = 0;
   let completedDocuments = 0;
   let totalMilestones = 0;
   let completedMilestones = 0;

   roadmap.phases?.forEach(phase => {
       phase.tasks?.forEach(task => {
           totalTasks++;
           if (task.status === 'completed') completedTasks++;
       });
       phase.documents?.forEach(doc => {
           totalDocuments++;
            if (['uploaded', 'submitted', 'verified', 'not_applicable'].includes(doc.status)) completedDocuments++;
       });
       phase.milestones?.forEach(milestone => {
           totalMilestones++;
           if (milestone.isAchieved) completedMilestones++;
       });
   });

   const estimatedCompletionDate = roadmap.phases?.[roadmap.phases.length - 1]?.endDate; // Example: end date of last phase
   const remainingTime = calculateRemainingTime(estimatedCompletionDate);


  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          {/* TODO: Fetch and display program name/flag based on roadmap.programId */}
          <Typography variant="h5" component="h1" gutterBottom>
            {roadmap.title || 'Your Roadmap'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
             <Chip label={`Status: ${roadmap.status || 'N/A'}`} size="small" variant="outlined" />
             <Typography variant="caption" color="text.secondary">
                Created: {formatDate(roadmap.createdAt)}
             </Typography>
             <Typography variant="caption" color="text.secondary">
                Last Updated: {formatDate(roadmap.updatedAt)}
             </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* TODO: Implement PDF download functionality */}
          <Button variant="outlined" size="small" disabled={!roadmap.pdfExport?.storageUrl}>Download PDF</Button>
          {/* TODO: Implement Share functionality */}
          <Button variant="outlined" size="small">Share</Button>
           {/* TODO: Implement Edit functionality */}
          <Button variant="contained" size="small">Edit</Button>
        </Box>
      </Box>

      {/* Progress Summary Section */}
      <Box sx={{ mb: 2 }}>
         <Typography variant="subtitle1" gutterBottom>Overall Progress</Typography>
         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LinearProgress variant="determinate" value={overallCompletion} sx={{ flexGrow: 1, height: 8, borderRadius: '4px', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">{`${Math.round(overallCompletion)}%`}</Typography>
         </Box>
         <Grid container spacing={1} sx={{ color: 'text.secondary' }}>
            <Grid item xs={6} sm={3}><Typography variant="caption">Tasks: {completedTasks}/{totalTasks}</Typography></Grid>
            <Grid item xs={6} sm={3}><Typography variant="caption">Documents: {completedDocuments}/{totalDocuments}</Typography></Grid>
            <Grid item xs={6} sm={3}><Typography variant="caption">Milestones: {completedMilestones}/{totalMilestones}</Typography></Grid>
            <Grid item xs={6} sm={3}><Typography variant="caption">Est. Remaining: {remainingTime}</Typography></Grid>
         </Grid>
      </Box>

    </Paper>
  );
};

export default RoadmapOverviewDisplay;
