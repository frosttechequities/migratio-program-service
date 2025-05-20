import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

/**
 * Document Completeness Component
 * Displays document completeness assessment results
 */
const DocumentCompleteness = ({ document }) => {
  // Check if document has analysis results
  if (!document || !document.analysis_results || !document.analysis_results.completenessAnalysis) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Document Completeness
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No completeness analysis available for this document
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Extract completeness analysis data
  const { completenessAnalysis } = document.analysis_results;
  const { 
    completenessScore, 
    completenessLevel, 
    requiredFields, 
    presentFields, 
    missingFields 
  } = completenessAnalysis;
  
  /**
   * Get color based on score
   * @param {number} score - Score value (0-100)
   * @returns {string} - Color code
   */
  const getScoreColor = (score) => {
    if (score >= 85) return 'success.main';
    if (score >= 70) return '#4caf50';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };
  
  /**
   * Get completeness level chip
   * @param {string} level - Completeness level
   * @returns {JSX.Element} - Chip component with appropriate color
   */
  const getCompletenessLevelChip = (level) => {
    switch (level) {
      case 'complete':
        return <Chip label="Complete" color="success" size="small" />;
      case 'mostly_complete':
        return <Chip label="Mostly Complete" color="primary" size="small" />;
      case 'partially_complete':
        return <Chip label="Partially Complete" color="warning" size="small" />;
      case 'incomplete':
        return <Chip label="Incomplete" color="error" size="small" />;
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };
  
  /**
   * Format field name for display
   * @param {string} field - Field name
   * @returns {string} - Formatted field name
   */
  const formatFieldName = (field) => {
    // Replace dots with spaces
    let formatted = field.replace(/\./g, ' ');
    
    // Convert camelCase to space-separated words
    formatted = formatted.replace(/([A-Z])/g, ' $1');
    
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Document Completeness
        </Typography>
        
        {/* Completeness Score */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Completeness
            </Typography>
            <Typography variant="body2" fontWeight="bold" color={getScoreColor(completenessScore)}>
              {completenessScore}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={completenessScore} 
            sx={{ 
              height: 8, 
              borderRadius: 1,
              bgcolor: 'background.paper',
              '& .MuiLinearProgress-bar': {
                bgcolor: getScoreColor(completenessScore)
              }
            }} 
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
            {getCompletenessLevelChip(completenessLevel)}
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Required Fields Summary */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Required Fields
          </Typography>
          
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: 'success.light',
                  color: 'success.contrastText'
                }}
              >
                <CheckCircleIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {presentFields.length} Present
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={6}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: missingFields.length > 0 ? 'error.light' : 'background.paper',
                  color: missingFields.length > 0 ? 'error.contrastText' : 'text.primary'
                }}
              >
                <CancelIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {missingFields.length} Missing
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        {/* Field Details */}
        {requiredFields.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Field Details
            </Typography>
            
            <List dense disablePadding>
              {requiredFields.map((field) => {
                const isPresent = presentFields.includes(field);
                
                return (
                  <ListItem key={field} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {isPresent ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : (
                        <CancelIcon color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={formatFieldName(field)}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
        
        {/* No Required Fields */}
        {requiredFields.length === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <AssignmentIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No required fields defined for this document type
            </Typography>
          </Box>
        )}
        
        {/* Completeness Message */}
        {completenessLevel === 'complete' && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" color="success.contrastText">
              This document contains all required information
            </Typography>
          </Box>
        )}
        
        {completenessLevel !== 'complete' && missingFields.length > 0 && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body2" color="warning.contrastText">
              {missingFields.length === 1 
                ? 'This document is missing 1 required field' 
                : `This document is missing ${missingFields.length} required fields`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentCompleteness;
