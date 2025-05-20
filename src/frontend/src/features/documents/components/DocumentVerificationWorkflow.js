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
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Compare as CompareIcon,
  Done as DoneIcon,
  Send as SendIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

/**
 * Document Verification Workflow Component
 * Step-by-step guided workflow for document verification
 * 
 * @param {Object} props - Component props
 * @param {Object} props.document - Document object
 * @param {Object} props.verificationRequest - Verification request object
 * @param {Function} props.onSubmitAdditionalInfo - Function to call when submitting additional info
 * @param {Function} props.onUploadSupportingDocument - Function to call when uploading supporting document
 * @param {Function} props.onCompleteWorkflow - Function to call when workflow is completed
 * @param {Function} props.onCancelWorkflow - Function to call when workflow is cancelled
 * @returns {React.ReactElement} DocumentVerificationWorkflow component
 */
const DocumentVerificationWorkflow = ({ 
  document, 
  verificationRequest,
  onSubmitAdditionalInfo,
  onUploadSupportingDocument,
  onCompleteWorkflow, 
  onCancelWorkflow 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState({
    documentNumber: '',
    issuedBy: '',
    issuedDate: '',
    expiryDate: '',
    documentPurpose: '',
    additionalNotes: ''
  });
  
  // If no document, show error
  if (!document) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Document Verification Workflow
          </Typography>
          <Alert severity="error">
            No document provided for verification workflow
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Get verification method from request
  const verificationMethod = verificationRequest?.verificationMethod || 'standard';
  const isExpedited = verificationRequest?.expedited || false;
  
  // Define workflow steps based on verification method
  const getWorkflowSteps = () => {
    // Common steps for all methods
    const commonSteps = [
      {
        label: 'Verification Request Submitted',
        description: 'Your verification request has been submitted successfully.',
        content: (
          <Box>
            <Typography variant="body2" paragraph>
              Thank you for submitting your document for verification. Your request has been received and will be processed according to the selected verification method.
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Verification Request Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Verification Method:
                  </Typography>
                  <Typography variant="body2">
                    {verificationMethod === 'standard' ? 'Standard Verification' :
                     verificationMethod === 'enhanced' ? 'Enhanced Verification' :
                     verificationMethod === 'third_party' ? 'Third-Party Verification' :
                     verificationMethod}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Processing Time:
                  </Typography>
                  <Typography variant="body2">
                    {isExpedited ? (
                      <Chip label="Expedited" color="success" size="small" />
                    ) : (
                      verificationMethod === 'standard' ? '2-3 business days' :
                      verificationMethod === 'enhanced' ? '3-5 business days' :
                      verificationMethod === 'third_party' ? '5-7 business days' :
                      'Standard processing'
                    )}
                  </Typography>
                </Grid>
                
                {verificationRequest?.additionalNotes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Additional Notes:
                    </Typography>
                    <Typography variant="body2">
                      {verificationRequest.additionalNotes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
            
            <Alert severity="info">
              <AlertTitle>Next Steps</AlertTitle>
              We may need additional information to complete the verification process. Please proceed to the next step to provide any required details.
            </Alert>
          </Box>
        )
      },
      {
        label: 'Provide Additional Information',
        description: 'Provide additional details to help with verification.',
        content: (
          <Box>
            <Typography variant="body2" paragraph>
              Please provide the following additional information about your document to help with the verification process.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Document Number"
                  value={additionalInfo.documentNumber}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, documentNumber: e.target.value})}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Issued By"
                  value={additionalInfo.issuedBy}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, issuedBy: e.target.value})}
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Authority that issued the document"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Issue Date"
                  type="date"
                  value={additionalInfo.issuedDate}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, issuedDate: e.target.value})}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expiry Date (if applicable)"
                  type="date"
                  value={additionalInfo.expiryDate}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, expiryDate: e.target.value})}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Document Purpose</InputLabel>
                  <Select
                    value={additionalInfo.documentPurpose}
                    onChange={(e) => setAdditionalInfo({...additionalInfo, documentPurpose: e.target.value})}
                    label="Document Purpose"
                  >
                    <MenuItem value="immigration">Immigration Application</MenuItem>
                    <MenuItem value="visa">Visa Application</MenuItem>
                    <MenuItem value="employment">Employment Verification</MenuItem>
                    <MenuItem value="education">Education Verification</MenuItem>
                    <MenuItem value="identity">Identity Verification</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Additional Notes"
                  multiline
                  rows={3}
                  value={additionalInfo.additionalNotes}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, additionalNotes: e.target.value})}
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Any additional information that may help with verification"
                />
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setIsSubmitting(true);
                // Simulate API call
                setTimeout(() => {
                  onSubmitAdditionalInfo(document.id, additionalInfo);
                  setIsSubmitting(false);
                  setActiveStep(activeStep + 1);
                }, 1000);
              }}
              disabled={isSubmitting || !additionalInfo.documentNumber}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Information'}
            </Button>
          </Box>
        )
      }
    ];
    
    // Additional steps based on verification method
    if (verificationMethod === 'enhanced' || verificationMethod === 'third_party') {
      commonSteps.push({
        label: 'Upload Supporting Documents',
        description: 'Upload additional documents to support verification.',
        content: (
          <Box>
            <Typography variant="body2" paragraph>
              Please upload any supporting documents that may help with the verification process.
              This could include additional pages, translations, or certification documents.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
              <input
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                id="supporting-document-upload"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedFile(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="supporting-document-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                  disabled={isSubmitting}
                >
                  Select Supporting Document
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
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setIsSubmitting(true);
                // Simulate API call
                setTimeout(() => {
                  onUploadSupportingDocument(document.id, uploadedFile);
                  setIsSubmitting(false);
                  setActiveStep(activeStep + 1);
                }, 1000);
              }}
              disabled={isSubmitting || !uploadedFile}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <UploadIcon />}
            >
              {isSubmitting ? 'Uploading...' : 'Upload Document'}
            </Button>
          </Box>
        )
      });
    }
    
    // Final step for all methods
    commonSteps.push({
      label: 'Verification in Progress',
      description: 'Your document is being verified.',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            Your document is now being verified. This process may take {
              isExpedited ? '1 business day' :
              verificationMethod === 'standard' ? '2-3 business days' :
              verificationMethod === 'enhanced' ? '3-5 business days' :
              verificationMethod === 'third_party' ? '5-7 business days' :
              'some time'
            } to complete.
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Verification Process</AlertTitle>
            <Typography variant="body2">
              During the verification process, our team will:
            </Typography>
            <List dense disablePadding>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Check document authenticity"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Verify document content"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Validate against official records"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Alert>
          
          <Typography variant="body2" paragraph>
            You will be notified once the verification process is complete. You can check the status of your verification request at any time from the document details page.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
          
          <Typography variant="body2" align="center" color="text.secondary">
            Estimated completion: {
              new Date(Date.now() + (
                isExpedited ? 1 :
                verificationMethod === 'standard' ? 3 :
                verificationMethod === 'enhanced' ? 5 :
                verificationMethod === 'third_party' ? 7 : 3
              ) * 24 * 60 * 60 * 1000).toLocaleDateString()
            }
          </Typography>
        </Box>
      )
    });
    
    return commonSteps;
  };
  
  const steps = getWorkflowSteps();
  
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
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <VerifiedUserIcon sx={{ mr: 1 }} />
          Document Verification Workflow
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
                    {index < steps.length - 1 && (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={
                          (index === 1 && !additionalInfo.documentNumber) || // Additional Info step
                          (index === 2 && !uploadedFile) || // Upload step (if present)
                          isSubmitting
                        }
                      >
                        Continue
                      </Button>
                    )}
                    
                    {index === steps.length - 1 && (
                      <Button
                        variant="contained"
                        onClick={handleComplete}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Complete
                      </Button>
                    )}
                    
                    <Button
                      disabled={index === 0 || isSubmitting}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                    
                    <Button
                      onClick={onCancelWorkflow}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={isSubmitting}
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
              Your document verification workflow has been completed. You will be notified once the verification process is complete.
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

DocumentVerificationWorkflow.propTypes = {
  document: PropTypes.object.isRequired,
  verificationRequest: PropTypes.object,
  onSubmitAdditionalInfo: PropTypes.func.isRequired,
  onUploadSupportingDocument: PropTypes.func.isRequired,
  onCompleteWorkflow: PropTypes.func.isRequired,
  onCancelWorkflow: PropTypes.func.isRequired
};

export default DocumentVerificationWorkflow;
