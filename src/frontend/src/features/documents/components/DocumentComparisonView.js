import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Paper,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Compare as CompareIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Remove as RemoveIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

/**
 * Document Comparison View Component
 * Side-by-side comparison of original and improved documents
 * 
 * @param {Object} props - Component props
 * @param {Object} props.originalDocument - Original document object
 * @param {Object} props.improvedDocument - Improved document object
 * @param {Object} props.originalAnalysis - Original document analysis
 * @param {Object} props.improvedAnalysis - Improved document analysis
 * @returns {React.ReactElement} DocumentComparisonView component
 */
const DocumentComparisonView = ({ 
  originalDocument, 
  improvedDocument, 
  originalAnalysis, 
  improvedAnalysis 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Check if documents are provided
  if (!originalDocument || !improvedDocument) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CompareIcon sx={{ mr: 1 }} />
            Document Comparison
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Documents not available for comparison
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.25, 2));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.25, 0.5));
  };
  
  // Handle reset zoom
  const handleResetZoom = () => {
    setZoomLevel(1);
  };
  
  // Calculate improvement percentage
  const calculateImprovement = (original, improved) => {
    if (!original || !improved) return 0;
    return Math.max(0, Math.min(100, ((improved - original) / original) * 100));
  };
  
  // Get improvement indicator
  const getImprovementIndicator = (original, improved) => {
    if (!original || !improved) return <RemoveIcon />;
    
    const diff = improved - original;
    if (diff > 0) return <ArrowUpwardIcon color="success" />;
    if (diff < 0) return <ArrowDownwardIcon color="error" />;
    return <RemoveIcon />;
  };
  
  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 85) return 'success.main';
    if (score >= 70) return '#4caf50';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };
  
  // Mock analysis data for demo
  const mockOriginalAnalysis = originalAnalysis || {
    qualityScore: 65,
    completenessScore: 70,
    issues: [
      { message: 'Image resolution is too low', severity: 'critical' },
      { message: 'Document is not properly aligned', severity: 'important' },
      { message: 'Expiry date is partially visible', severity: 'important' }
    ]
  };
  
  const mockImprovedAnalysis = improvedAnalysis || {
    qualityScore: 92,
    completenessScore: 95,
    issues: [
      { message: 'Minor glare on bottom right corner', severity: 'minor' }
    ]
  };
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CompareIcon sx={{ mr: 1 }} />
          Document Comparison
        </Typography>
        
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Visual Comparison" />
          <Tab label="Analysis Comparison" />
        </Tabs>
        
        {/* Visual Comparison Tab */}
        {activeTab === 0 && (
          <Box>
            {/* Zoom Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Tooltip title="Zoom Out">
                <IconButton onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset Zoom">
                <IconButton onClick={handleResetZoom} disabled={zoomLevel === 1}>
                  <FullscreenIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom In">
                <IconButton onClick={handleZoomIn} disabled={zoomLevel >= 2}>
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                {Math.round(zoomLevel * 100)}%
              </Typography>
            </Box>
            
            {/* Document Images */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column' 
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom align="center">
                    Original Document
                  </Typography>
                  <Box 
                    sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <Box 
                      component="img"
                      src={originalDocument.file_url || '/placeholder-document.png'}
                      alt="Original Document"
                      sx={{ 
                        maxWidth: '100%', 
                        maxHeight: 400,
                        transform: `scale(${zoomLevel})`,
                        transition: 'transform 0.3s ease'
                      }}
                    />
                    <Chip 
                      label={`Quality: ${mockOriginalAnalysis.qualityScore}%`}
                      color={mockOriginalAnalysis.qualityScore >= 85 ? 'success' : mockOriginalAnalysis.qualityScore >= 70 ? 'primary' : 'warning'}
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column' 
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom align="center">
                    Improved Document
                  </Typography>
                  <Box 
                    sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <Box 
                      component="img"
                      src={improvedDocument.file_url || '/placeholder-document-improved.png'}
                      alt="Improved Document"
                      sx={{ 
                        maxWidth: '100%', 
                        maxHeight: 400,
                        transform: `scale(${zoomLevel})`,
                        transition: 'transform 0.3s ease'
                      }}
                    />
                    <Chip 
                      label={`Quality: ${mockImprovedAnalysis.qualityScore}%`}
                      color={mockImprovedAnalysis.qualityScore >= 85 ? 'success' : mockImprovedAnalysis.qualityScore >= 70 ? 'primary' : 'warning'}
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Analysis Comparison Tab */}
        {activeTab === 1 && (
          <Box>
            {/* Score Comparison */}
            <Typography variant="subtitle2" gutterBottom>
              Quality & Completeness Improvement
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Quality Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 80 }}>
                      Original:
                    </Typography>
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={mockOriginalAnalysis.qualityScore} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getScoreColor(mockOriginalAnalysis.qualityScore)
                          }
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold" color={getScoreColor(mockOriginalAnalysis.qualityScore)}>
                      {mockOriginalAnalysis.qualityScore}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ width: 80 }}>
                      Improved:
                    </Typography>
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={mockImprovedAnalysis.qualityScore} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getScoreColor(mockImprovedAnalysis.qualityScore)
                          }
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold" color={getScoreColor(mockImprovedAnalysis.qualityScore)}>
                      {mockImprovedAnalysis.qualityScore}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                      <ArrowUpwardIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                      {calculateImprovement(mockOriginalAnalysis.qualityScore, mockImprovedAnalysis.qualityScore).toFixed(0)}% improvement
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Completeness Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 80 }}>
                      Original:
                    </Typography>
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={mockOriginalAnalysis.completenessScore} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getScoreColor(mockOriginalAnalysis.completenessScore)
                          }
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold" color={getScoreColor(mockOriginalAnalysis.completenessScore)}>
                      {mockOriginalAnalysis.completenessScore}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ width: 80 }}>
                      Improved:
                    </Typography>
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={mockImprovedAnalysis.completenessScore} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getScoreColor(mockImprovedAnalysis.completenessScore)
                          }
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold" color={getScoreColor(mockImprovedAnalysis.completenessScore)}>
                      {mockImprovedAnalysis.completenessScore}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                      <ArrowUpwardIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                      {calculateImprovement(mockOriginalAnalysis.completenessScore, mockImprovedAnalysis.completenessScore).toFixed(0)}% improvement
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
            {/* Issues Comparison */}
            <Typography variant="subtitle2" gutterBottom>
              Issues Resolved
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Issue</TableCell>
                    <TableCell align="center">Original</TableCell>
                    <TableCell align="center">Improved</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockOriginalAnalysis.issues.map((issue, index) => {
                    const isResolved = !mockImprovedAnalysis.issues.some(
                      i => i.message === issue.message
                    );
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>{issue.message}</TableCell>
                        <TableCell align="center">
                          {issue.severity === 'critical' ? (
                            <Chip size="small" label="Critical" color="error" />
                          ) : issue.severity === 'important' ? (
                            <Chip size="small" label="Important" color="warning" />
                          ) : (
                            <Chip size="small" label="Minor" color="info" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {isResolved ? (
                            <Chip size="small" label="Resolved" color="success" />
                          ) : (
                            <Chip size="small" label={issue.severity} color={
                              issue.severity === 'critical' ? 'error' : 
                              issue.severity === 'important' ? 'warning' : 'info'
                            } />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {isResolved ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            issue.severity === 'critical' ? (
                              <ErrorIcon color="error" />
                            ) : issue.severity === 'important' ? (
                              <WarningIcon color="warning" />
                            ) : (
                              <WarningIcon color="info" />
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {/* New issues in improved document */}
                  {mockImprovedAnalysis.issues.filter(issue => 
                    !mockOriginalAnalysis.issues.some(i => i.message === issue.message)
                  ).map((issue, index) => (
                    <TableRow key={`new-${index}`}>
                      <TableCell>{issue.message}</TableCell>
                      <TableCell align="center">
                        <Chip size="small" label="Not present" color="default" />
                      </TableCell>
                      <TableCell align="center">
                        {issue.severity === 'critical' ? (
                          <Chip size="small" label="Critical" color="error" />
                        ) : issue.severity === 'important' ? (
                          <Chip size="small" label="Important" color="warning" />
                        ) : (
                          <Chip size="small" label="Minor" color="info" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {issue.severity === 'critical' ? (
                          <ErrorIcon color="error" />
                        ) : issue.severity === 'important' ? (
                          <WarningIcon color="warning" />
                        ) : (
                          <WarningIcon color="info" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

DocumentComparisonView.propTypes = {
  originalDocument: PropTypes.object,
  improvedDocument: PropTypes.object,
  originalAnalysis: PropTypes.object,
  improvedAnalysis: PropTypes.object
};

export default DocumentComparisonView;
