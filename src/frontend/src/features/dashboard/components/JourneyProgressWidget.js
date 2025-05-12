import React from 'react';
import { Box, Stepper, Step, StepLabel, StepConnector, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
// Import specific icons for each step
import ExploreIcon from '@mui/icons-material/TravelExplore';
import AssessmentIcon from '@mui/icons-material/Assignment';
import RecommendIcon from '@mui/icons-material/Recommend';
import ApplicationIcon from '@mui/icons-material/Article';
import FlightLandIcon from '@mui/icons-material/FlightLand'; // Post-Arrival
import IntegrationIcon from '@mui/icons-material/MapsHomeWork'; // Integration

// Define the steps of the enhanced journey
const steps = [
  { label: 'Exploration & Planning', icon: <ExploreIcon /> },
  { label: 'Assessment', icon: <AssessmentIcon /> },
  { label: 'Recommendations', icon: <RecommendIcon /> },
  { label: 'Application Prep & Submission', icon: <ApplicationIcon /> },
  { label: 'Post-Approval & Arrival', icon: <FlightLandIcon /> },
  { label: 'Integration & Settlement', icon: <IntegrationIcon /> },
];

// Custom Connector Styling (Optional)
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.Mui-active`]: {
    [`& .MuiStepConnector-line`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.Mui-completed`]: {
    [`& .MuiStepConnector-line`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .MuiStepConnector-line`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

// Custom Step Icon Styling (Optional)
const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
  '& .QontoStepIcon-completedIcon': {
    color: theme.palette.primary.main,
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className, icon: stepIconIndex } = props;
  // stepIconIndex is 1-based, adjust if needed or pass icon directly
  const icon = steps[stepIconIndex - 1]?.icon || <div className="QontoStepIcon-circle" />;


  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
         React.cloneElement(icon, { sx: { fontSize: 18 } }) // Render the actual icon
        // <div className="QontoStepIcon-circle" /> // Original circle
      )}
    </QontoStepIconRoot>
  );
}


// TODO: Fetch actual progress data dynamically
const JourneyProgressWidget = ({ currentStageIndex = 0 }) => { // Example prop: index of the current stage (0-based)

  return (
    <Paper sx={{ p: 3 }}>
       <Typography variant="h6" gutterBottom mb={3}>Your Immigration Journey</Typography>
       <Box sx={{ width: '100%', overflowX: 'auto', pb: 1 }}> {/* Allow horizontal scroll on small screens */}
         <Stepper alternativeLabel activeStep={currentStageIndex} connector={<QontoConnector />}>
            {steps.map((step, index) => (
            <Step key={step.label}>
                <StepLabel StepIconComponent={QontoStepIcon}>{step.label}</StepLabel>
            </Step>
            ))}
         </Stepper>
       </Box>
    </Paper>
  );
};

export default JourneyProgressWidget;
