import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  AlertTitle,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Compare as CompareIcon,
  Done as DoneIcon
} from '@mui/icons-material';

/**
 * Document Improvement Workflow Component
 * Step-by-step guided workflow for document improvement
 * 
 * @param {Object} props - Component props
 * @param {Object} props.document - Document object
 * @param {Array} props.suggestions - Optimization suggestions
 * @param {Function} props.onUploadImprovedDocument - Function to call when uploading improved document
 * @param {Function} props.onCompleteWorkflow - Function to call when workflow is completed
 * @param {Function} props.onCancelWorkflow - Function to call when workflow is cancelled
 * @returns {React.ReactElement} DocumentImprovementWorkflow component
 */
const DocumentImprovementWorkflow = ({ 
  document, 
  suggestions = [], 
  onUploadImprovedDocument, 
  onCompleteWorkflow, 
  onCancelWorkflow 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // If no document or suggestions, show error
  if (!document) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Document Improvement Workflow
          </Typography>
          <Alert severity="error">
            No document provided for improvement workflow
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // If no suggestions, show success message
  if (!suggestions || suggestions.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Document Improvement Workflow
          </Typography>
          <Alert severity="success">
            <AlertTitle>No improvements needed</AlertTitle>
            This document meets all quality and completeness requirements.
          </Alert>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onCancelWorkflow}>Close</Button>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Group suggestions by severity
  const criticalSuggestions = suggestions.filter(s => s.severity === 'critical');
  const importantSuggestions = suggestions.filter(s => s.severity === 'important');
  const minorSuggestions = suggestions.filter(s => s.severity === 'minor');
  
  // Define workflow steps
  const steps = [
    {
      label: 'Review Improvement Suggestions',
      description: 'Review the suggestions to improve your document quality and completeness.',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            We've analyzed your document and identified the following areas for improvement:
          </Typography>
          
          {criticalSuggestions.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="error" gutterBottom>
                Critical Issues ({criticalSuggestions.length})
              </Typography>
              <List dense disablePadding>
                {criticalSuggestions.map((suggestion, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ErrorIcon color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.message}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {importantSuggestions.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="warning.main" gutterBottom>
                Important Issues ({importantSuggestions.length})
              </Typography>
              <List dense disablePadding>
                {importantSuggestions.map((suggestion, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <WarningIcon color="warning" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.message}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {minorSuggestions.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="info.main" gutterBottom>
                Minor Issues ({minorSuggestions.length})
              </Typography>
              <List dense disablePadding>
                {minorSuggestions.map((suggestion, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <InfoIcon color="info" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.message}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      )
    },
    {
      label: 'Prepare Improved Document',
      description: 'Follow the guidelines to prepare an improved version of your document.',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            Based on the suggestions, please prepare an improved version of your document following these guidelines:
          </Typography>
          
          <List dense>
            {criticalSuggestions.length > 0 && (
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon>
                  <AssignmentIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Address all critical issues"
                  secondary="These issues must be fixed for document acceptance"
                />
              </ListItem>
            )}
            
            {importantSuggestions.length > 0 && (
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon>
                  <AssignmentIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Address important issues if possible"
                  secondary="These issues may affect document processing"
                />
              </ListItem>
            )}
            
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon>
                <AssignmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Ensure document is clear and legible"
                secondary="All text should be easily readable"
              />
            </ListItem>
            
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon>
                <AssignmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Check document format requirements"
                secondary="Ensure document meets format specifications"
              />
            </ListItem>
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>Tip</AlertTitle>
            If you need to obtain a new document, please follow the official guidelines for the document type.
          </Alert>
        </Box>
      )
    },
    {
      label: 'Upload Improved Document',
      description: 'Upload the improved version of your document.',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            Please upload the improved version of your document. The system will analyze it and compare it with the original.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <input
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              id="improved-document-upload"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadedFile(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="improved-document-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadIcon />}
                disabled={isUploading}
              >
                Select Improved Document
              </Button>
            </label>
            
            {uploadedFile && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {uploadedFile.name} selected
                </Typography>
              </Box>
            )}
            
            {isUploading && (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Uploading and analyzing...
                </Typography>
              </Box>
            )}
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            disabled={!uploadedFile || isUploading}
            onClick={() => {
              setIsUploading(true);
              // Simulate upload and analysis
              setTimeout(() => {
                onUploadImprovedDocument(document.id, uploadedFile);
                setIsUploading(false);
                setActiveStep(activeStep + 1);
              }, 2000);
            }}
          >
            Upload and Analyze
          </Button>
        </Box>
      )
    },
    {
      label: 'Review Improvements',
      description: 'Review the improvements made to your document.',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            Your improved document has been analyzed. Here's a comparison with the original:
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Improvement Summary
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Original Quality Score
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    65%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Improved Quality Score
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    92%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Issues Resolved
            </Typography>
            
            <List dense disablePadding>
              {criticalSuggestions.map((suggestion, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={suggestion.message}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Button
              variant="outlined"
              startIcon={<CompareIcon />}
              sx={{ mt: 2 }}
              onClick={() => {
                // Open comparison view
                console.log('Open comparison view');
              }}
            >
              View Detailed Comparison
            </Button>
          </Paper>
          
          <Alert severity="success">
            <AlertTitle>Great improvement!</AlertTitle>
            Your document now meets the quality and completeness requirements.
          </Alert>
        </Box>
      )
    }
  ];
  
  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Handle workflow completion
  const handleComplete = () => {
    onCompleteWorkflow(document.id);
  };
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Document Improvement Workflow
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography variant="subtitle1">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {step.description}
                </Typography>
                
                {step.content}
                
                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleComplete : handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={onCancelWorkflow}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Workflow Completed
            </Typography>
            <Typography variant="body2" paragraph>
              Your document has been successfully improved and meets all requirements.
            </Typography>
            <Button onClick={onCancelWorkflow} sx={{ mt: 1, mr: 1 }}>
              Close
            </Button>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

DocumentImprovementWorkflow.propTypes = {
  document: PropTypes.object.isRequired,
  suggestions: PropTypes.array,
  onUploadImprovedDocument: PropTypes.func.isRequired,
  onCompleteWorkflow: PropTypes.func.isRequired,
  onCancelWorkflow: PropTypes.func.isRequired
};

export default DocumentImprovementWorkflow;
