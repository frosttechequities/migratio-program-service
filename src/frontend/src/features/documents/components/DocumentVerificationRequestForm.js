import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  AlertTitle,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  Send as SendIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';

/**
 * Document Verification Request Form Component
 * Form for users to request document verification
 * 
 * @param {Object} props - Component props
 * @param {Object} props.document - Document object
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Function} props.onCancel - Function to call when form is canceled
 * @param {boolean} props.isSubmitting - Whether the form is currently submitting
 * @returns {React.ReactElement} DocumentVerificationRequestForm component
 */
const DocumentVerificationRequestForm = ({ 
  document, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  // Form state
  const [verificationMethod, setVerificationMethod] = useState('standard');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [expedited, setExpedited] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create verification request data
    const verificationRequest = {
      documentId: document?.id,
      verificationMethod,
      additionalNotes,
      expedited,
      termsAccepted
    };
    
    // Call onSubmit with verification request data
    onSubmit(verificationRequest);
  };
  
  // If no document, show error
  if (!document) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedUserIcon sx={{ mr: 1 }} />
            Request Document Verification
          </Typography>
          <Alert severity="error">
            No document information available
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <VerifiedUserIcon sx={{ mr: 1 }} />
          Request Document Verification
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Verification Information</AlertTitle>
          Please provide the necessary information to request verification for your document.
          The verification process may take 1-3 business days depending on the method selected.
        </Alert>
        
        <form onSubmit={handleSubmit}>
          {/* Document Information */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Document Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                  Document Type:
                </Typography>
                <Typography variant="body2">
                  {document.documentType || document.document_type || 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                  File Name:
                </Typography>
                <Typography variant="body2">
                  {document.originalFilename || document.filename || 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                  Upload Date:
                </Typography>
                <Typography variant="body2">
                  {document.uploadDate || document.created_at || 'Unknown'}
                </Typography>
              </Box>
            </Box>
          </Paper>
          
          {/* Verification Method */}
          <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
            <FormLabel component="legend">Verification Method</FormLabel>
            <RadioGroup
              value={verificationMethod}
              onChange={(e) => setVerificationMethod(e.target.value)}
            >
              <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                <FormControlLabel 
                  value="standard" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Standard Verification
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Basic verification of document authenticity and content.
                        Processing time: 2-3 business days.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                <FormControlLabel 
                  value="enhanced" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Enhanced Verification
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Detailed verification with additional security checks.
                        Processing time: 3-5 business days.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2 }}>
                <FormControlLabel 
                  value="third_party" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Third-Party Verification
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Verification through an accredited third-party service.
                        Processing time: 5-7 business days.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>
          </FormControl>
          
          {/* Additional Options */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expedited}
                  onChange={(e) => setExpedited(e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Expedited Processing
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Request expedited processing for urgent cases.
                    Processing time: 1 business day (when available).
                  </Typography>
                </Box>
              }
            />
          </Paper>
          
          {/* Additional Notes */}
          <TextField
            label="Additional Notes"
            multiline
            rows={4}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Provide any additional information that may help with the verification process."
            sx={{ mb: 3 }}
          />
          
          {/* Verification Benefits */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Benefits of Document Verification
            </Typography>
            
            <List dense disablePadding>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SecurityIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Enhanced Security"
                  secondary="Verified documents provide additional security and trust in your application."
                />
              </ListItem>
              
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SpeedIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Faster Processing"
                  secondary="Pre-verified documents can speed up your immigration application process."
                />
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <VerifiedIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Higher Acceptance Rate"
                  secondary="Verified documents have a higher acceptance rate with immigration authorities."
                />
              </ListItem>
            </List>
          </Box>
          
          {/* Terms and Conditions */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
              }
              label={
                <Typography variant="body2">
                  I understand that document verification may require additional information
                  and that the verification result is based on the quality and authenticity
                  of the provided document.
                </Typography>
              }
            />
          </Paper>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              startIcon={<CancelIcon />}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
              disabled={!termsAccepted || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Verification Request'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

DocumentVerificationRequestForm.propTypes = {
  document: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool
};

export default DocumentVerificationRequestForm;
