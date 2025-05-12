import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  Button, 
  Chip
} from '@mui/material';
import { 
  Description as DescriptionIcon,
  ArrowForward as ArrowForwardIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

/**
 * Document widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - Document data
 * @returns {React.ReactNode} Document widget component
 */
const DocumentWidget = ({ data }) => {
  // If no data is provided, show a placeholder
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Your Documents
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You haven't uploaded any documents yet
          </Typography>
          <Button 
            component={RouterLink} 
            to="/documents" 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            Upload Documents
          </Button>
        </Box>
      </Paper>
    );
  }

  // Sort documents by status (pending first, then missing, then verified)
  const sortedDocuments = [...data].sort((a, b) => {
    const statusOrder = { pending: 0, missing: 1, uploaded: 2, verified: 3, rejected: 4 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Get documents that need attention (pending, missing, rejected)
  const documentsNeedingAttention = sortedDocuments.filter(doc => 
    ['pending', 'missing', 'rejected'].includes(doc.status)
  );

  // Get document stats
  const documentStats = {
    total: sortedDocuments.length,
    pending: sortedDocuments.filter(doc => doc.status === 'pending').length,
    missing: sortedDocuments.filter(doc => doc.status === 'missing').length,
    uploaded: sortedDocuments.filter(doc => doc.status === 'uploaded').length,
    verified: sortedDocuments.filter(doc => doc.status === 'verified').length,
    rejected: sortedDocuments.filter(doc => doc.status === 'rejected').length
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'uploaded':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon fontSize="small" color="success" />;
      case 'pending':
      case 'uploaded':
        return <WarningIcon fontSize="small" color="warning" />;
      case 'rejected':
        return <WarningIcon fontSize="small" color="error" />;
      default:
        return <FileIcon fontSize="small" />;
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Your Documents
        </Typography>
        <Button 
          component={RouterLink} 
          to="/documents" 
          endIcon={<ArrowForwardIcon />}
          size="small"
        >
          View All
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Document stats */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip 
          label={`${documentStats.total} Total`} 
          size="small"
          variant="outlined"
        />
        {documentStats.verified > 0 && (
          <Chip 
            label={`${documentStats.verified} Verified`} 
            size="small"
            color="success"
            variant="outlined"
          />
        )}
        {documentStats.pending > 0 && (
          <Chip 
            label={`${documentStats.pending} Pending`} 
            size="small"
            color="warning"
            variant="outlined"
          />
        )}
        {documentStats.missing > 0 && (
          <Chip 
            label={`${documentStats.missing} Missing`} 
            size="small"
            variant="outlined"
          />
        )}
        {documentStats.rejected > 0 && (
          <Chip 
            label={`${documentStats.rejected} Rejected`} 
            size="small"
            color="error"
            variant="outlined"
          />
        )}
      </Box>

      {/* Documents needing attention */}
      {documentsNeedingAttention.length > 0 ? (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Documents Needing Attention
          </Typography>
          <List dense sx={{ mb: 2 }}>
            {documentsNeedingAttention.slice(0, 3).map((document) => (
              <ListItem 
                key={document._id} 
                component={RouterLink} 
                to={`/documents/${document._id}`}
                sx={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  py: 1
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {getStatusIcon(document.status)}
                </ListItemIcon>
                <ListItemText 
                  primary={document.originalName || document.documentType} 
                  secondary={document.category}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <Chip 
                  label={document.status.charAt(0).toUpperCase() + document.status.slice(1)} 
                  size="small"
                  color={getStatusColor(document.status)}
                  sx={{ ml: 1 }}
                />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            All documents are up to date
          </Typography>
        </Box>
      )}

      {/* Upload document button */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button 
          component={RouterLink} 
          to="/documents/upload" 
          variant="outlined" 
          size="small"
          startIcon={<UploadIcon />}
          fullWidth
        >
          Upload New Document
        </Button>
      </Box>
    </Paper>
  );
};

DocumentWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      originalName: PropTypes.string,
      documentType: PropTypes.string.isRequired,
      category: PropTypes.string,
      status: PropTypes.string.isRequired
    })
  )
};

export default DocumentWidget;
