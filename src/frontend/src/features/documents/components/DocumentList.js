import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Box,
  Link as MuiLink
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // For unknown/other status
import { format } from 'date-fns'; // For formatting dates

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'PP'); // e.g., Sep 21, 2023
  } catch (error) {
    return 'Invalid Date';
  }
};

// Helper function to get verification status chip
const getVerificationChip = (status) => {
    switch (status) {
        case 'verified':
            return <Chip label="Verified" color="success" size="small" icon={<CheckCircleOutlineIcon fontSize="small" />} />;
        case 'pending_verification':
        case 'verification_in_progress':
            return <Chip label="Pending" color="warning" size="small" icon={<PendingActionsIcon fontSize="small" />} />;
        case 'rejected':
        case 'unable_to_verify':
            return <Chip label="Rejected" color="error" size="small" icon={<ErrorOutlineIcon fontSize="small" />} />;
        case 'not_required':
             return <Chip label="Not Required" color="default" size="small" />;
        case 'pending_submission':
             return <Chip label="Pending Submission" color="info" size="small" />;
        default:
            return <Chip label={status || 'Unknown'} size="small" />;
    }
};

// TODO: Fetch actual documents dynamically
const DocumentList = ({ documents = [], onEdit, onDelete, onView }) => {
  const navigate = useNavigate(); // Instantiate navigate hook

  if (!documents || documents.length === 0) {
    return <Typography sx={{ p: 3, textAlign: 'center' }} color="text.secondary">No documents uploaded yet.</Typography>;
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} aria-label="document list table">
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell>Document Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Upload Date</TableCell>
            <TableCell>Expiry Date</TableCell>
            <TableCell>Verification</TableCell>
            <TableCell>Analysis/Suggestions</TableCell> {/* New Column */}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <TableRow
              key={doc._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {/* Link to view details? */}
                <MuiLink component={RouterLink} to={`/documents/${doc._id}`} underline="hover">
                     {doc.originalFilename || 'N/A'}
                </MuiLink>
              </TableCell>
              <TableCell>{doc.documentTypeId?.name || doc.documentTypeCode || 'Unknown'}</TableCell> {/* Assumes population or code */}
              <TableCell>{formatDate(doc.uploadDate)}</TableCell>
              <TableCell>{formatDate(doc.expiryDate)}</TableCell>
              <TableCell>{getVerificationChip(doc.verificationStatus)}</TableCell>
              {/* Analysis Suggestions Cell */}
              <TableCell>
                {doc.analysis?.hasOptimizationSuggestions && doc.analysis?.optimizationSuggestions?.length > 0 ? (
                  <Tooltip
                    title={
                      <Box component="ul" sx={{ margin: 0, paddingLeft: '15px' }}>
                        {doc.analysis.optimizationSuggestions.map((suggestion, index) => (
                          <li key={index}><Typography variant="caption">{suggestion}</Typography></li>
                        ))}
                      </Box>
                    }
                    arrow
                  >
                    <Chip label={`${doc.analysis.optimizationSuggestions.length} Suggestion(s)`} size="small" color="info" variant="outlined" />
                  </Tooltip>
                ) : (
                  <Typography variant="caption" color="text.secondary">N/A</Typography>
                )}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="View Details">
                  <IconButton size="small" onClick={() => onView ? onView(doc._id) : navigate(`/documents/${doc._id}`)}>
                    <VisibilityIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Metadata">
                  <IconButton size="small" onClick={() => onEdit ? onEdit(doc._id) : alert('Edit not implemented')}>
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Document">
                  <IconButton size="small" onClick={() => onDelete ? onDelete(doc._id) : alert('Delete not implemented')} sx={{ color: 'error.main' }}>
                    <DeleteOutlineIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DocumentList;
