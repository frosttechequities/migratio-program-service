import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Grid,
  Link as MuiLink,
  Tooltip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // For expiring/rejected
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; // Default icon

// TODO: Fetch actual document data and calculate stats dynamically
const DocumentCenterWidget = ({ documents = [], stats = {} }) => {

  // Ensure documents is an array and handle undefined/null
  const validDocuments = Array.isArray(documents) ? documents : [];

  // Use default values if stats are not provided
  const {
    uploaded = 0,
    needed = 0,
    verified = 0,
    expiring = 0,
    pendingVerification = 0 // Added based on integrated spec
  } = stats || {};

  // Get top 3-4 recent documents
  const recentDocuments = validDocuments.slice(0, 3); // Example: show top 3

  const getStatusIcon = (status, verificationStatus) => {
     if (verificationStatus === 'verified') return <CheckCircleOutlineIcon color="success" />;
     if (verificationStatus === 'rejected') return <ErrorOutlineIcon color="error" />;
     if (verificationStatus === 'pending_verification' || verificationStatus === 'verification_in_progress') return <PendingActionsIcon color="warning" />;
     if (status === 'uploaded') return <UploadFileIcon color="info" />;
     // Add more specific icons based on document type if needed
     return <InsertDriveFileIcon color="action" />;
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          Document Center
        </Typography>
        <Button component={RouterLink} to="/documents" size="small">
          Manage Documents
        </Button>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={1} sx={{ mb: 2 }}>
         <Grid item xs={6} sm={3} textAlign="center">
            <Typography variant="h6">{uploaded}</Typography>
            <Typography variant="caption" color="text.secondary">Uploaded</Typography>
         </Grid>
         <Grid item xs={6} sm={3} textAlign="center">
            <Typography variant="h6">{verified}</Typography>
            <Typography variant="caption" color="text.secondary">Verified</Typography>
         </Grid>
         <Grid item xs={6} sm={3} textAlign="center">
            <Typography variant="h6">{pendingVerification}</Typography>
            <Typography variant="caption" color="text.secondary">Pending</Typography>
         </Grid>
         <Grid item xs={6} sm={3} textAlign="center">
            <Typography variant="h6" color={expiring > 0 ? 'error' : 'text.secondary'}>{expiring}</Typography>
            <Typography variant="caption" color={expiring > 0 ? 'error' : 'text.secondary'}>Expiring Soon</Typography>
         </Grid>
      </Grid>

      {/* Recent Documents List */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Recently Updated:</Typography>
      {recentDocuments.length > 0 ? (
        <List dense sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {recentDocuments.map((doc, index) => (
            <ListItem key={doc?.documentId || doc?.id || doc?.filename || index} disablePadding>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                 <Tooltip title={doc?.verificationStatus || doc?.status || 'Status'}>
                    {getStatusIcon(doc?.status, doc?.verificationStatus)}
                 </Tooltip>
              </ListItemIcon>
              <ListItemText
                primary={
                    <Typography variant="body2" noWrap>
                        {doc?.name || doc?.documentName || doc?.originalFilename || 'Document Name'}
                    </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Updated: {doc?.lastUpdated || doc?.uploadDate || doc?.updatedAt || 'N/A'}
                  </Typography>
                }
              />
               <Button
                  component={RouterLink}
                  to={`/documents/${doc?.documentId || doc?.id || index}`}
                  size="small"
                  sx={{ ml: 1 }}
               >
                  View
               </Button>
            </ListItem>
          ))}
        </List>
      ) : (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexGrow: 1, minHeight: '50px' }}>
            <Typography color="text.secondary" variant="body2">
                No recent documents.
            </Typography>
         </Box>
      )}
    </Paper>
  );
};

export default DocumentCenterWidget;
