import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  LinearProgress,
  Collapse,
  IconButton,
  Tooltip,
  Grid,
  Paper,
  Alert
} from '@mui/material';
import {
  TipsAndUpdates as TipsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Lightbulb as LightbulbIcon,
  Assignment as AssignmentIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled expand button with rotation animation
const ExpandButton = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

/**
 * Document Optimizer Widget Component
 * Displays optimization suggestions with actionable steps
 * 
 * @param {Object} props - Component props
 * @param {Object} props.document - Document object
 * @param {Function} props.onApplySuggestion - Function to call when a suggestion is applied
 * @param {Function} props.onStartWorkflow - Function to call to start improvement workflow
 * @returns {React.ReactElement} DocumentOptimizerWidget component
 */
const DocumentOptimizerWidget = ({ document, onApplySuggestion, onStartWorkflow }) => {
  const [expandedSuggestions, setExpandedSuggestions] = useState({});
  
  // Check if document has optimization suggestions
  if (!document || !document.analysis || !document.analysis.optimizationSuggestions) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TipsIcon sx={{ mr: 1 }} />
            Document Optimization
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No optimization suggestions available for this document
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Extract optimization suggestions
  const { optimizationSuggestions } = document.analysis;
  
  // If no suggestions, show success message
  if (!optimizationSuggestions || optimizationSuggestions.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TipsIcon sx={{ mr: 1 }} />
            Document Optimization
          </Typography>
          <Alert severity="success" sx={{ mt: 2 }}>
            <AlertTitle>Great job!</AlertTitle>
            This document meets all quality and completeness requirements. No optimization needed.
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Toggle suggestion details
  const handleToggleSuggestion = (index) => {
    setExpandedSuggestions({
      ...expandedSuggestions,
      [index]: !expandedSuggestions[index]
    });
  };
  
  // Get icon based on suggestion severity
  const getSuggestionIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'important':
        return <WarningIcon color="warning" />;
      case 'minor':
        return <InfoIcon color="info" />;
      default:
        return <LightbulbIcon color="primary" />;
    }
  };
  
  // Get chip based on suggestion severity
  const getSeverityChip = (severity) => {
    switch (severity) {
      case 'critical':
        return <Chip size="small" label="Critical" color="error" />;
      case 'important':
        return <Chip size="small" label="Important" color="warning" />;
      case 'minor':
        return <Chip size="small" label="Minor" color="info" />;
      default:
        return <Chip size="small" label="Suggestion" color="primary" />;
    }
  };
  
  // Calculate optimization score
  const calculateOptimizationScore = () => {
    // Count critical and important issues
    const criticalCount = optimizationSuggestions.filter(s => s.severity === 'critical').length;
    const importantCount = optimizationSuggestions.filter(s => s.severity === 'important').length;
    const minorCount = optimizationSuggestions.filter(s => s.severity === 'minor').length;
    
    // Calculate score (100 - weighted sum of issues)
    const score = 100 - (criticalCount * 20 + importantCount * 10 + minorCount * 5);
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  };
  
  // Get color based on optimization score
  const getScoreColor = (score) => {
    if (score >= 85) return 'success.main';
    if (score >= 70) return '#4caf50';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };
  
  // Mock suggestions with severity and steps for demo
  const enhancedSuggestions = optimizationSuggestions.map((suggestion, index) => {
    // For demo purposes, assign severity based on index
    const severities = ['critical', 'important', 'minor'];
    const severity = severities[index % 3];
    
    // Create steps for each suggestion
    const steps = [
      'Review the document for clarity and legibility',
      'Ensure all required information is visible',
      'Check that the document meets format requirements'
    ];
    
    return {
      message: suggestion,
      severity,
      steps,
      applied: false
    };
  });
  
  const optimizationScore = calculateOptimizationScore();
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <TipsIcon sx={{ mr: 1 }} />
          Document Optimization
        </Typography>
        
        {/* Optimization Score */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Optimization Score
            </Typography>
            <Typography variant="body2" fontWeight="bold" color={getScoreColor(optimizationScore)}>
              {optimizationScore}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={optimizationScore} 
            sx={{ 
              height: 8, 
              borderRadius: 1,
              bgcolor: 'background.paper',
              '& .MuiLinearProgress-bar': {
                bgcolor: getScoreColor(optimizationScore)
              }
            }} 
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Suggestions Summary */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Optimization Suggestions ({enhancedSuggestions.length})
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'error.light',
                  color: 'error.contrastText'
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {enhancedSuggestions.filter(s => s.severity === 'critical').length}
                </Typography>
                <Typography variant="caption">
                  Critical
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'warning.light',
                  color: 'warning.contrastText'
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {enhancedSuggestions.filter(s => s.severity === 'important').length}
                </Typography>
                <Typography variant="caption">
                  Important
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: 'info.light',
                  color: 'info.contrastText'
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {enhancedSuggestions.filter(s => s.severity === 'minor').length}
                </Typography>
                <Typography variant="caption">
                  Minor
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        {/* Suggestions List */}
        <List disablePadding>
          {enhancedSuggestions.map((suggestion, index) => (
            <React.Fragment key={index}>
              <ListItem 
                alignItems="flex-start" 
                disablePadding 
                sx={{ 
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                <ListItemIcon sx={{ mt: 0 }}>
                  {getSuggestionIcon(suggestion.severity)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {suggestion.message}
                      </Typography>
                      <Box sx={{ ml: 1 }}>
                        {getSeverityChip(suggestion.severity)}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Collapse in={expandedSuggestions[index]} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 1, ml: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Steps to improve:
                          </Typography>
                          <List dense disablePadding>
                            {suggestion.steps.map((step, stepIndex) => (
                              <ListItem key={stepIndex} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 24 }}>
                                  <AssignmentIcon fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={step}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={() => onApplySuggestion(document.id, index)}
                            endIcon={<ArrowForwardIcon />}
                          >
                            Apply This Suggestion
                          </Button>
                        </Box>
                      </Collapse>
                    </Box>
                  }
                />
                <ExpandButton
                  expand={expandedSuggestions[index]}
                  onClick={() => handleToggleSuggestion(index)}
                  aria-expanded={expandedSuggestions[index]}
                  aria-label="show more"
                  size="small"
                >
                  <ExpandMoreIcon />
                </ExpandButton>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
        
        {/* Start Improvement Workflow Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onStartWorkflow(document.id)}
            startIcon={<TipsIcon />}
          >
            Start Improvement Workflow
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

DocumentOptimizerWidget.propTypes = {
  document: PropTypes.object,
  onApplySuggestion: PropTypes.func,
  onStartWorkflow: PropTypes.func
};

export default DocumentOptimizerWidget;
