import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Chip,
  Alert,
  AlertTitle,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Send as SendIcon,
  CloudUpload as CloudUploadIcon,
  Sync as SyncIcon,
  Public as PublicIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';

/**
 * Third-Party Verification Integration Component
 * Interface for third-party verification services
 * 
 * @param {Object} props - Component props
 * @param {Object} props.document - Document object
 * @param {Array} props.verificationProviders - List of available verification providers
 * @param {Function} props.onSelectProvider - Function to call when a provider is selected
 * @param {Function} props.onSubmitToProvider - Function to call when submitting to a provider
 * @param {Function} props.onCheckStatus - Function to call when checking verification status
 * @param {Function} props.onCancel - Function to call when canceling the process
 * @returns {React.ReactElement} ThirdPartyVerificationIntegration component
 */
const ThirdPartyVerificationIntegration = ({ 
  document, 
  verificationProviders = [],
  onSelectProvider,
  onSubmitToProvider,
  onCheckStatus,
  onCancel
}) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationReference, setVerificationReference] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  
  // If no document, show error
  if (!document) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 1 }} />
            Third-Party Verification
          </Typography>
          <Alert severity="error">
            No document information available
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // If no providers, show message
  if (!verificationProviders || verificationProviders.length === 0) {
    // Mock providers for demo
    verificationProviders = [
      {
        id: 'idv_global',
        name: 'IDV Global',
        description: 'Global document verification service with support for over 150 countries.',
        logo: '/logos/idv-global.png',
        processingTime: '2-3 business days',
        cost: 'Included in your plan',
        supportedDocumentTypes: ['passport', 'national_id', 'driver_license', 'birth_certificate'],
        rating: 4.8
      },
      {
        id: 'verify_plus',
        name: 'VerifyPlus',
        description: 'Advanced verification with biometric matching and fraud detection.',
        logo: '/logos/verify-plus.png',
        processingTime: '1-2 business days',
        cost: 'Included in your plan',
        supportedDocumentTypes: ['passport', 'national_id', 'driver_license'],
        rating: 4.5
      },
      {
        id: 'doc_verify',
        name: 'DocVerify',
        description: 'Specialized in legal and educational document verification.',
        logo: '/logos/doc-verify.png',
        processingTime: '3-5 business days',
        cost: 'Included in your plan',
        supportedDocumentTypes: ['diploma', 'degree', 'transcript', 'marriage_certificate', 'birth_certificate'],
        rating: 4.2
      }
    ];
  }
  
  // Handle provider selection
  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider);
    onSelectProvider(provider);
    setActiveStep(1);
  };
  
  // Handle submission to provider
  const handleSubmitToProvider = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const reference = `VRF-${Math.floor(Math.random() * 1000000)}`;
      setVerificationReference(reference);
      onSubmitToProvider(document.id, selectedProvider.id, reference);
      setIsSubmitting(false);
      setActiveStep(2);
    }, 2000);
  };
  
  // Handle status check
  const handleCheckStatus = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onCheckStatus(document.id, verificationReference);
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Define verification steps
  const steps = [
    {
      label: 'Select Verification Provider',
      description: 'Choose a third-party verification service provider.',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            Select a verification provider to verify your document. Each provider specializes in different types of documents and offers different processing times.
          </Typography>
          
          <Grid container spacing={2}>
            {verificationProviders.map((provider) => (
              <Grid item xs={12} key={provider.id}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 1
                    }
                  }}
                  onClick={() => handleSelectProvider(provider)}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <Typography variant="subtitle1" gutterBottom>
                        {provider.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {provider.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          icon={<BusinessIcon fontSize="small" />} 
                          label={`Processing: ${provider.processingTime}`} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Chip 
                          icon={<VerifiedIcon fontSize="small" />} 
                          label={`Rating: ${provider.rating}/5`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProvider(provider);
                        }}
                      >
                        Select
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )
    },
    {
      label: 'Submit Document for Verification',
      description: 'Submit your document to the selected provider.',
      content: (
        <Box>
          {selectedProvider && (
            <>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Provider: {selectedProvider.name}
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedProvider.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    icon={<BusinessIcon fontSize="small" />} 
                    label={`Processing: ${selectedProvider.processingTime}`} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<PublicIcon fontSize="small" />} 
                    label={`Supported Documents: ${selectedProvider.supportedDocumentTypes.length}`} 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
              </Paper>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <AlertTitle>Document Sharing Consent</AlertTitle>
                <Typography variant="body2" paragraph>
                  By proceeding, you consent to sharing your document with {selectedProvider.name} for verification purposes.
                  The document will be processed according to their privacy policy and terms of service.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Checkbox
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    color="primary"
                  />
                  <Typography variant="body2">
                    I consent to sharing my document with {selectedProvider.name} for verification purposes.
                  </Typography>
                </Box>
              </Alert>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                onClick={handleSubmitToProvider}
                disabled={isSubmitting || !consentGiven}
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </>
          )}
        </Box>
      )
    },
    {
      label: 'Verification in Progress',
      description: 'Your document is being verified by the provider.',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            Your document has been submitted to {selectedProvider?.name} for verification.
            The verification process may take {selectedProvider?.processingTime} to complete.
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Verification Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Reference Number:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {verificationReference}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Submission Date:
                </Typography>
                <Typography variant="body2">
                  {new Date().toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Estimated Completion:
                </Typography>
                <Typography variant="body2">
                  {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Status:
                </Typography>
                <Chip label="In Progress" color="warning" size="small" />
              </Grid>
            </Grid>
          </Paper>
          
          <Alert severity="info">
            <AlertTitle>Verification Process</AlertTitle>
            <Typography variant="body2">
              The verification process includes the following steps:
            </Typography>
            <List dense disablePadding>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Document authenticity check"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Security features verification"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Database cross-reference"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Alert>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <SyncIcon />}
              onClick={handleCheckStatus}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Checking...' : 'Check Verification Status'}
            </Button>
          </Box>
        </Box>
      )
    }
  ];
  
  // Checkbox component for consent
  const Checkbox = ({ checked, onChange, color }) => {
    return (
      <Box 
        sx={{ 
          width: 24, 
          height: 24, 
          border: '1px solid',
          borderColor: checked ? 'primary.main' : 'divider',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: checked ? 'primary.main' : 'background.paper',
          cursor: 'pointer',
          mr: 1
        }}
        onClick={() => onChange({ target: { checked: !checked } })}
      >
        {checked && <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />}
      </Box>
    );
  };
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1 }} />
          Third-Party Verification
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
                
                {index < steps.length - 1 && index > 0 && (
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      <Button
                        disabled={index === 0 || isSubmitting}
                        onClick={() => setActiveStep(index - 1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                      
                      <Button
                        onClick={onCancel}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Box>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </CardContent>
    </Card>
  );
};

ThirdPartyVerificationIntegration.propTypes = {
  document: PropTypes.object,
  verificationProviders: PropTypes.array,
  onSelectProvider: PropTypes.func.isRequired,
  onSubmitToProvider: PropTypes.func.isRequired,
  onCheckStatus: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ThirdPartyVerificationIntegration;
