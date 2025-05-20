import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Chip,
  Grid
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ImageSearch as ImageSearchIcon,
  TextFields as TextFieldsIcon,
  DataObject as DataObjectIcon,
  FormatAlignLeft as FormatAlignLeftIcon
} from '@mui/icons-material';

/**
 * Document Quality Widget Component
 * Displays document quality assessment results
 */
const DocumentQualityWidget = ({ document }) => {
  // Check if document has analysis results
  if (!document || !document.analysis_results || !document.analysis_results.qualityAnalysis) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Document Quality
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No quality analysis available for this document
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Extract quality analysis data
  const { qualityAnalysis } = document.analysis_results;
  const { overallScore, qualityLevel, metrics, issues } = qualityAnalysis;
  
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
   * Get quality level label
   * @param {string} level - Quality level
   * @returns {JSX.Element} - Chip component with appropriate color
   */
  const getQualityLevelChip = (level) => {
    switch (level) {
      case 'excellent':
        return <Chip label="Excellent" color="success" size="small" />;
      case 'good':
        return <Chip label="Good" color="primary" size="small" />;
      case 'fair':
        return <Chip label="Fair" color="warning" size="small" />;
      case 'poor':
        return <Chip label="Poor" color="error" size="small" />;
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };
  
  /**
   * Get icon for metric
   * @param {string} metricName - Metric name
   * @returns {JSX.Element} - Icon component
   */
  const getMetricIcon = (metricName) => {
    switch (metricName) {
      case 'imageQuality':
        return <ImageSearchIcon />;
      case 'textClarity':
        return <TextFieldsIcon />;
      case 'extractionConfidence':
        return <DataObjectIcon />;
      case 'formatConsistency':
        return <FormatAlignLeftIcon />;
      default:
        return <InfoIcon />;
    }
  };
  
  /**
   * Get icon for issue severity
   * @param {string} severity - Issue severity
   * @returns {JSX.Element} - Icon component
   */
  const getIssueIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };
  
  /**
   * Format metric name for display
   * @param {string} name - Metric name
   * @returns {string} - Formatted name
   */
  const formatMetricName = (name) => {
    // Convert camelCase to space-separated words
    const formatted = name.replace(/([A-Z])/g, ' $1');
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Document Quality
        </Typography>
        
        {/* Overall Score */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
            <CircularProgress
              variant="determinate"
              value={overallScore}
              size={80}
              thickness={4}
              sx={{ color: getScoreColor(overallScore) }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" component="div" color="text.secondary">
                {overallScore}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Quality Level
            </Typography>
            {getQualityLevelChip(qualityLevel)}
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Quality Metrics */}
        <Typography variant="subtitle2" gutterBottom>
          Quality Metrics
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {metrics && Object.entries(metrics).map(([name, value]) => (
            <Grid item xs={6} key={name}>
              <Tooltip title={`${formatMetricName(name)}: ${Math.round(value * 100)}%`}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 1 }}>
                    {getMetricIcon(name)}
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {formatMetricName(name)}
                    </Typography>
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                      <Box
                        sx={{
                          width: `${value * 100}%`,
                          height: 4,
                          bgcolor: getScoreColor(value * 100),
                          borderRadius: 1
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
        
        {/* Quality Issues */}
        {issues && issues.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Quality Issues
            </Typography>
            <List dense disablePadding>
              {issues.map((issue, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getIssueIcon(issue.severity)}
                  </ListItemIcon>
                  <ListItemText
                    primary={issue.message}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
        
        {/* No Issues */}
        {(!issues || issues.length === 0) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="body2">
              No quality issues detected
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentQualityWidget;
