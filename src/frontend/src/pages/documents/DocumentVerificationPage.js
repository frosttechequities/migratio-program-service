import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  VerifiedUser as VerifiedUserIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  NavigateNext as NavigateNextIcon,
  Event as EventIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

// Import document components
import DocumentVerificationStatusWidget from '../../features/documents/components/DocumentVerificationStatusWidget';
import DocumentVerificationRequestForm from '../../features/documents/components/DocumentVerificationRequestForm';
import DocumentVerificationWorkflow from '../../features/documents/components/DocumentVerificationWorkflow';
import ThirdPartyVerificationIntegration from '../../features/documents/components/ThirdPartyVerificationIntegration';

// Import document slice and selectors
import { fetchDocumentById, selectDocumentById, selectIsLoadingDocument } from '../../features/documents/documentSlice';

// Import document verification slice and selectors
import {
  fetchVerificationStatus,
  requestVerification,
  cancelVerification,
  submitAdditionalInfo,
  uploadSupportingDocument,
  fetchVerificationProviders,
  setSelectedProvider,
  submitToProvider,
  checkProviderStatus,
  resetVerificationRequest,
  resetProviderSubmission,
  selectVerificationStatus,
  selectIsLoadingStatus,
  selectStatusError,
  selectVerificationRequest,
  selectIsSubmittingRequest,
  selectRequestError,
  selectAdditionalInfo,
  selectIsSubmittingInfo,
  selectInfoError,
  selectSupportingDocument,
  selectIsUploadingDocument,
  selectUploadError,
  selectVerificationProviders,
  selectIsLoadingProviders,
  selectProvidersError,
  selectSelectedProvider,
  selectProviderSubmission,
  selectIsSubmittingToProvider,
  selectProviderSubmissionError,
  selectProviderStatus,
  selectIsCheckingProviderStatus,
  selectProviderStatusError
} from '../../features/documents/documentVerificationSlice';

/**
 * Document Verification Page
 * Page for verifying documents
 */
const DocumentVerificationPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showThirdPartyIntegration, setShowThirdPartyIntegration] = useState(false);

  // Redux state
  const document = useSelector((state) => selectDocumentById(state, documentId));
  const isLoadingDocument = useSelector(selectIsLoadingDocument);

  const verificationStatus = useSelector(selectVerificationStatus);
  const isLoadingStatus = useSelector(selectIsLoadingStatus);
  const statusError = useSelector(selectStatusError);

  const verificationRequest = useSelector(selectVerificationRequest);
  const isSubmittingRequest = useSelector(selectIsSubmittingRequest);
  const requestError = useSelector(selectRequestError);

  const additionalInfo = useSelector(selectAdditionalInfo);
  const isSubmittingInfo = useSelector(selectIsSubmittingInfo);
  const infoError = useSelector(selectInfoError);

  const supportingDocument = useSelector(selectSupportingDocument);
  const isUploadingDocument = useSelector(selectIsUploadingDocument);
  const uploadError = useSelector(selectUploadError);

  const verificationProviders = useSelector(selectVerificationProviders);
  const isLoadingProviders = useSelector(selectIsLoadingProviders);
  const providersError = useSelector(selectProvidersError);

  const selectedProvider = useSelector(selectSelectedProvider);
  const providerSubmission = useSelector(selectProviderSubmission);
  const isSubmittingToProvider = useSelector(selectIsSubmittingToProvider);
  const providerSubmissionError = useSelector(selectProviderSubmissionError);

  const providerStatus = useSelector(selectProviderStatus);
  const isCheckingProviderStatus = useSelector(selectIsCheckingProviderStatus);
  const providerStatusError = useSelector(selectProviderStatusError);

  // Fetch document and verification status on mount
  useEffect(() => {
    if (documentId) {
      dispatch(fetchDocumentById(documentId));
      dispatch(fetchVerificationStatus(documentId));
    }
  }, [dispatch, documentId]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle request verification
  const handleRequestVerification = (documentId) => {
    setShowRequestForm(true);
  };

  // Handle cancel verification
  const handleCancelVerification = (documentId) => {
    dispatch(cancelVerification(documentId));
  };

  // Handle submit verification request
  const handleSubmitVerificationRequest = (verificationRequest) => {
    dispatch(requestVerification({ documentId, verificationRequest }));
    setShowRequestForm(false);
    setShowWorkflow(true);
  };

  // Handle cancel verification request
  const handleCancelVerificationRequest = () => {
    setShowRequestForm(false);
  };

  // Handle submit additional info
  const handleSubmitAdditionalInfo = (documentId, additionalInfo) => {
    dispatch(submitAdditionalInfo({ documentId, additionalInfo }));
  };

  // Handle upload supporting document
  const handleUploadSupportingDocument = (documentId, file) => {
    dispatch(uploadSupportingDocument({ documentId, file }));
  };

  // Handle complete workflow
  const handleCompleteWorkflow = (documentId) => {
    setShowWorkflow(false);
  };

  // Handle cancel workflow
  const handleCancelWorkflow = () => {
    setShowWorkflow(false);
    dispatch(resetVerificationRequest());
  };

  // Handle select provider
  const handleSelectProvider = (provider) => {
    dispatch(setSelectedProvider(provider));
  };

  // Handle submit to provider
  const handleSubmitToProvider = (documentId, providerId, reference) => {
    dispatch(submitToProvider({ documentId, providerId, reference }));
  };

  // Handle check provider status
  const handleCheckProviderStatus = (documentId, reference) => {
    dispatch(checkProviderStatus({ documentId, reference }));
  };

  // Handle cancel third-party integration
  const handleCancelThirdPartyIntegration = () => {
    setShowThirdPartyIntegration(false);
    dispatch(resetProviderSubmission());
  };

  // If loading document, show loading indicator
  if (isLoadingDocument || isLoadingStatus) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // If document not found, show error
  if (!document) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Document not found
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/documents')}
          sx={{ mt: 2 }}
        >
          Back to Documents
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link color="inherit" href="/dashboard" underline="hover">
          Dashboard
        </Link>
        <Link color="inherit" href="/documents" underline="hover">
          Documents
        </Link>
        <Typography color="text.primary">Verify Document</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/documents/${documentId}`)}
          sx={{ mr: 2 }}
        >
          Back to Document
        </Button>
        <Typography variant="h5" component="h1">
          Document Verification
        </Typography>
      </Box>

      {/* Document Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {document.document_name || 'Document'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Document Type:
            </Typography>
            <Typography variant="body1">
              {document.document_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Uploaded On:
            </Typography>
            <Typography variant="body1">
              {new Date(document.created_at).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Show Request Form if active */}
      {showRequestForm && (
        <Box sx={{ mb: 3 }}>
          <DocumentVerificationRequestForm
            document={document}
            onSubmit={handleSubmitVerificationRequest}
            onCancel={handleCancelVerificationRequest}
            isSubmitting={isSubmittingRequest}
          />
        </Box>
      )}

      {/* Show Workflow if active */}
      {showWorkflow && (
        <Box sx={{ mb: 3 }}>
          <DocumentVerificationWorkflow
            document={document}
            verificationRequest={verificationRequest}
            onSubmitAdditionalInfo={handleSubmitAdditionalInfo}
            onUploadSupportingDocument={handleUploadSupportingDocument}
            onCompleteWorkflow={handleCompleteWorkflow}
            onCancelWorkflow={handleCancelWorkflow}
          />
        </Box>
      )}

      {/* Show Third-Party Integration if active */}
      {showThirdPartyIntegration && (
        <Box sx={{ mb: 3 }}>
          <ThirdPartyVerificationIntegration
            document={document}
            verificationProviders={verificationProviders}
            onSelectProvider={handleSelectProvider}
            onSubmitToProvider={handleSubmitToProvider}
            onCheckStatus={handleCheckProviderStatus}
            onCancel={handleCancelThirdPartyIntegration}
          />
        </Box>
      )}

      {/* Main Content - Only show if no forms or workflows are active */}
      {!showRequestForm && !showWorkflow && !showThirdPartyIntegration && (
        <>
          {/* Verification Status Widget */}
          <Box sx={{ mb: 3 }}>
            <DocumentVerificationStatusWidget
              document={{
                ...document,
                verificationStatus: verificationStatus?.verificationStatus,
                verificationDetails: verificationStatus?.verificationDetails,
                workflowState: verificationStatus?.workflowState
              }}
              onRequestVerification={handleRequestVerification}
              onCancelVerification={handleCancelVerification}
            />
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab icon={<VerifiedUserIcon />} label="Standard Verification" />
            <Tab icon={<SecurityIcon />} label="Third-Party Verification" />
            <Tab icon={<AssignmentIcon />} label="Verification History" />
          </Tabs>

          {/* Standard Verification Tab */}
          {activeTab === 0 && (
            <Box>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Standard Verification
                </Typography>
                <Typography variant="body2" paragraph>
                  Standard verification is performed by our team to verify the authenticity and content of your document.
                  This process typically takes 2-3 business days.
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRequestVerification(documentId)}
                  startIcon={<VerifiedUserIcon />}
                  disabled={verificationStatus?.verificationStatus === 'verification_in_progress' || verificationStatus?.verificationStatus === 'verified'}
                >
                  Request Standard Verification
                </Button>
              </Paper>
            </Box>
          )}

          {/* Third-Party Verification Tab */}
          {activeTab === 1 && (
            <Box>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Third-Party Verification
                </Typography>
                <Typography variant="body2" paragraph>
                  Third-party verification is performed by trusted external providers specializing in document verification.
                  This process may take 3-7 business days depending on the provider.
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    dispatch(fetchVerificationProviders());
                    setShowThirdPartyIntegration(true);
                  }}
                  startIcon={<SecurityIcon />}
                  disabled={verificationStatus?.verificationStatus === 'verification_in_progress' || verificationStatus?.verificationStatus === 'verified'}
                >
                  Request Third-Party Verification
                </Button>
              </Paper>
            </Box>
          )}

          {/* Verification History Tab */}
          {activeTab === 2 && (
            <Box>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Verification History
                </Typography>

                {verificationStatus?.verificationDetails?.requested_at ? (
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Verification Requested"
                        secondary={new Date(verificationStatus.verificationDetails.requested_at).toLocaleString()}
                      />
                    </ListItem>

                    {verificationStatus?.verificationDetails?.submitted_to_provider_at && (
                      <ListItem>
                        <ListItemIcon>
                          <SendIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Submitted to Provider"
                          secondary={new Date(verificationStatus.verificationDetails.submitted_to_provider_at).toLocaleString()}
                        />
                      </ListItem>
                    )}

                    {verificationStatus?.verificationDetails?.verifiedAt && (
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Verification Completed"
                          secondary={new Date(verificationStatus.verificationDetails.verifiedAt).toLocaleString()}
                        />
                      </ListItem>
                    )}

                    {verificationStatus?.verificationDetails?.canceled_at && (
                      <ListItem>
                        <ListItemIcon>
                          <CancelIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Verification Canceled"
                          secondary={new Date(verificationStatus.verificationDetails.canceled_at).toLocaleString()}
                        />
                      </ListItem>
                    )}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No verification history available for this document.
                  </Typography>
                )}
              </Paper>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default DocumentVerificationPage;
