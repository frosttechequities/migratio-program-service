import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  VerifiedUser as VerifiedUserIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

/**
 * Document Verification Status Widget Component
 * Displays current verification status with detailed information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.document - Document object
 * @param {Function} props.onRequestVerification - Function to call when requesting verification
 * @param {Function} props.onCancelVerification - Function to call when canceling verification
 * @returns {React.ReactElement} DocumentVerificationStatusWidget component
 */
const DocumentVerificationStatusWidget = ({ 
  document, 
  onRequestVerification, 
  onCancelVerification 
}) => {
  // Check if document has verification details
  if (!document) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedUserIcon sx={{ mr: 1 }} />
            Document Verification Status
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No document information available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Get verification status and details
  const verificationStatus = document.verificationStatus || document.verification_status || 'pending_submission';
  const verificationDetails = document.verificationDetails || document.verification_details || {};
  const workflowState = verificationDetails.workflowState || 'none';
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (error) {
      return dateString;
    }
  };
  
  // Get status chip based on verification status
  const getStatusChip = (status) => {
    switch (status) {
      case 'verified':
        return <Chip label="Verified" color="success" icon={<CheckCircleIcon />} />;
      case 'pending_verification':
      case 'verification_in_progress':
        return <Chip label="In Progress" color="warning" icon={<PendingIcon />} />;
      case 'rejected':
        return <Chip label="Rejected" color="error" icon={<CancelIcon />} />;
      case 'unable_to_verify':
        return <Chip label="Unable to Verify" color="error" icon={<ErrorIcon />} />;
      case 'not_required':
        return <Chip label="Not Required" color="default" icon={<InfoIcon />} />;
      case 'pending_submission':
        return <Chip label="Pending Submission" color="info" icon={<HourglassEmptyIcon />} />;
      default:
        return <Chip label={status} color="default" icon={<InfoIcon />} />;
    }
  };
  
  // Get workflow state chip
  const getWorkflowStateChip = (state) => {
    switch (state) {
      case 'pending_review':
        return <Chip label="Pending Review" color="info" size="small" />;
      case 'under_review':
        return <Chip label="Under Review" color="warning" size="small" />;
      case 'escalated':
        return <Chip label="Escalated" color="error" size="small" />;
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'none':
      default:
        return <Chip label="No Workflow" color="default" size="small" />;
    }
  };
  
  // Get verification steps based on document type and status
  const getVerificationSteps = () => {
    // Basic steps for all document types
    const steps = [
      {
        label: 'Document Submission',
        description: 'Submit your document for verification',
        completed: verificationStatus !== 'pending_submission',
        active: verificationStatus === 'pending_submission'
      },
      {
        label: 'Initial Review',
        description: 'Document is reviewed for completeness and quality',
        completed: ['verified', 'rejected', 'unable_to_verify'].includes(verificationStatus) || workflowState === 'under_review' || workflowState === 'escalated' || workflowState === 'completed',
        active: verificationStatus === 'pending_verification' || workflowState === 'pending_review'
      },
      {
        label: 'Detailed Verification',
        description: 'Document content and authenticity are verified',
        completed: ['verified', 'rejected', 'unable_to_verify'].includes(verificationStatus) || workflowState === 'completed',
        active: verificationStatus === 'verification_in_progress' || workflowState === 'under_review' || workflowState === 'escalated'
      },
      {
        label: 'Verification Complete',
        description: 'Document verification is complete',
        completed: ['verified', 'rejected', 'unable_to_verify'].includes(verificationStatus),
        active: ['verified', 'rejected', 'unable_to_verify'].includes(verificationStatus)
      }
    ];
    
    return steps;
  };
  
  // Get active step index
  const getActiveStepIndex = () => {
    const steps = getVerificationSteps();
    const activeIndex = steps.findIndex(step => step.active);
    return activeIndex === -1 ? 0 : activeIndex;
  };
  
  // Get verification status message
  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'verified':
        return {
          title: 'Document Verified',
          message: 'This document has been successfully verified and is valid for use in your immigration process.',
          severity: 'success'
        };
      case 'pending_verification':
        return {
          title: 'Verification Pending',
          message: 'Your document has been submitted for verification. We will notify you once the verification process begins.',
          severity: 'info'
        };
      case 'verification_in_progress':
        return {
          title: 'Verification in Progress',
          message: 'Your document is currently being verified. This process may take 1-3 business days.',
          severity: 'info'
        };
      case 'rejected':
        return {
          title: 'Verification Rejected',
          message: verificationDetails.rejectionReason || 'Your document could not be verified. Please check the rejection reason and submit a new document if necessary.',
          severity: 'error'
        };
      case 'unable_to_verify':
        return {
          title: 'Unable to Verify',
          message: 'We were unable to verify this document. This may be due to quality issues or missing information.',
          severity: 'warning'
        };
      case 'not_required':
        return {
          title: 'Verification Not Required',
          message: 'This document type does not require verification.',
          severity: 'info'
        };
      case 'pending_submission':
        return {
          title: 'Verification Required',
          message: 'This document requires verification. Please submit it for verification to proceed with your immigration process.',
          severity: 'warning'
        };
      default:
        return {
          title: 'Status Unknown',
          message: 'The verification status of this document is unknown.',
          severity: 'info'
        };
    }
  };
  
  const statusMessage = getStatusMessage();
  const verificationSteps = getVerificationSteps();
  const activeStepIndex = getActiveStepIndex();
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <VerifiedUserIcon sx={{ mr: 1 }} />
          Document Verification Status
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Current Status:
          </Typography>
          {getStatusChip(verificationStatus)}
          
          {workflowState !== 'none' && (
            <Box sx={{ ml: 2 }}>
              {getWorkflowStateChip(workflowState)}
            </Box>
          )}
        </Box>
        
        <Alert severity={statusMessage.severity} sx={{ mb: 3 }}>
          <AlertTitle>{statusMessage.title}</AlertTitle>
          {statusMessage.message}
        </Alert>
        
        {/* Verification Timeline */}
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <TimelineIcon sx={{ mr: 1, fontSize: 20 }} />
          Verification Timeline
        </Typography>
        
        <Stepper activeStep={activeStepIndex} orientation="vertical" sx={{ mb: 3 }}>
          {verificationSteps.map((step, index) => (
            <Step key={index} completed={step.completed}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        {/* Verification Details */}
        {(verificationStatus !== 'pending_submission' && verificationStatus !== 'not_required') && (
          <>
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
              Verification Details
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Verified By
                  </Typography>
                  <Typography variant="body2">
                    {verificationDetails.verifiedBy === 'system_automated' ? 'Automated System' :
                     verificationDetails.verifiedBy === 'agent_manual' ? 'Manual Review' :
                     verificationDetails.verifiedBy === 'third_party_api' ? 'Third-Party Service' :
                     verificationDetails.verifiedBy || 'N/A'}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Verification Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(verificationDetails.verifiedAt)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            {verificationDetails.verificationNotes && (
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Verification Notes
                </Typography>
                <Typography variant="body2">
                  {verificationDetails.verificationNotes}
                </Typography>
              </Paper>
            )}
          </>
        )}
        
        {/* Action Buttons */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {verificationStatus === 'pending_submission' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onRequestVerification(document.id)}
              startIcon={<VerifiedUserIcon />}
            >
              Request Verification
            </Button>
          )}
          
          {(verificationStatus === 'pending_verification' || verificationStatus === 'verification_in_progress') && (
            <Button
              variant="outlined"
              color="warning"
              onClick={() => onCancelVerification(document.id)}
              startIcon={<CancelIcon />}
            >
              Cancel Verification
            </Button>
          )}
          
          {(verificationStatus === 'rejected' || verificationStatus === 'unable_to_verify') && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onRequestVerification(document.id)}
              startIcon={<VerifiedUserIcon />}
            >
              Request Re-Verification
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

DocumentVerificationStatusWidget.propTypes = {
  document: PropTypes.object,
  onRequestVerification: PropTypes.func,
  onCancelVerification: PropTypes.func
};

export default DocumentVerificationStatusWidget;
