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
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TipsAndUpdates as TipsIcon,
  Compare as CompareIcon,
  Assignment as AssignmentIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

// Import document components
import DocumentOptimizerWidget from '../../features/documents/components/DocumentOptimizerWidget';
import DocumentImprovementWorkflow from '../../features/documents/components/DocumentImprovementWorkflow';
import DocumentComparisonView from '../../features/documents/components/DocumentComparisonView';
import GuidedDocumentPreparation from '../../features/documents/components/GuidedDocumentPreparation';

// Import document slice and selectors
import { fetchDocumentById, selectDocumentById, selectIsLoadingDocument } from '../../features/documents/documentSlice';

// Import document optimization slice and selectors
import {
  fetchOptimizationSuggestions,
  applySuggestion,
  startImprovementWorkflow,
  uploadImprovedDocument,
  completeImprovementWorkflow,
  fetchDocumentComparison,
  fetchDocumentTypeDetails,
  resetWorkflow,
  resetComparison,
  resetImprovedDocument,
  selectOptimizationSuggestions,
  selectIsLoadingSuggestions,
  selectSuggestionsError,
  selectWorkflowStatus,
  selectIsWorkflowActive,
  selectWorkflowError,
  selectComparisonData,
  selectIsLoadingComparison,
  selectComparisonError,
  selectDocumentTypeDetails,
  selectIsLoadingDocumentTypeDetails,
  selectDocumentTypeDetailsError,
  selectImprovedDocument,
  selectIsUploadingImproved,
  selectUploadImprovedError
} from '../../features/documents/documentOptimizationSlice';

/**
 * Document Optimization Page
 * Page for optimizing documents
 */
const DocumentOptimizationPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showPreparationGuide, setShowPreparationGuide] = useState(false);
  
  // Redux state
  const document = useSelector((state) => selectDocumentById(state, documentId));
  const isLoadingDocument = useSelector(selectIsLoadingDocument);
  
  const suggestions = useSelector(selectOptimizationSuggestions);
  const isLoadingSuggestions = useSelector(selectIsLoadingSuggestions);
  const suggestionsError = useSelector(selectSuggestionsError);
  
  const workflowStatus = useSelector(selectWorkflowStatus);
  const isWorkflowActive = useSelector(selectIsWorkflowActive);
  const workflowError = useSelector(selectWorkflowError);
  
  const comparisonData = useSelector(selectComparisonData);
  const isLoadingComparison = useSelector(selectIsLoadingComparison);
  const comparisonError = useSelector(selectComparisonError);
  
  const documentTypeDetails = useSelector(selectDocumentTypeDetails);
  const isLoadingDocumentTypeDetails = useSelector(selectIsLoadingDocumentTypeDetails);
  const documentTypeDetailsError = useSelector(selectDocumentTypeDetailsError);
  
  const improvedDocument = useSelector(selectImprovedDocument);
  const isUploadingImproved = useSelector(selectIsUploadingImproved);
  const uploadImprovedError = useSelector(selectUploadImprovedError);
  
  // Fetch document and suggestions on mount
  useEffect(() => {
    if (documentId) {
      dispatch(fetchDocumentById(documentId));
      dispatch(fetchOptimizationSuggestions(documentId));
    }
  }, [dispatch, documentId]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle apply suggestion
  const handleApplySuggestion = (documentId, suggestionIndex) => {
    dispatch(applySuggestion({ documentId, suggestionIndex }));
  };
  
  // Handle start workflow
  const handleStartWorkflow = (documentId) => {
    dispatch(startImprovementWorkflow(documentId));
    setShowWorkflow(true);
  };
  
  // Handle upload improved document
  const handleUploadImprovedDocument = (documentId, file) => {
    dispatch(uploadImprovedDocument({ documentId, file }));
  };
  
  // Handle complete workflow
  const handleCompleteWorkflow = (documentId) => {
    dispatch(completeImprovementWorkflow(documentId));
    setShowWorkflow(false);
    
    // Show comparison view if improved document exists
    if (improvedDocument) {
      dispatch(fetchDocumentComparison({
        originalDocumentId: documentId,
        improvedDocumentId: improvedDocument.improvedDocumentId
      }));
      setShowComparison(true);
    }
  };
  
  // Handle cancel workflow
  const handleCancelWorkflow = () => {
    setShowWorkflow(false);
    dispatch(resetWorkflow());
  };
  
  // Handle close comparison
  const handleCloseComparison = () => {
    setShowComparison(false);
    dispatch(resetComparison());
  };
  
  // Handle start preparation guide
  const handleStartPreparationGuide = () => {
    if (document && document.document_type) {
      dispatch(fetchDocumentTypeDetails(document.document_type));
      setShowPreparationGuide(true);
    }
  };
  
  // Handle complete preparation guide
  const handleCompletePreparationGuide = () => {
    setShowPreparationGuide(false);
  };
  
  // Handle cancel preparation guide
  const handleCancelPreparationGuide = () => {
    setShowPreparationGuide(false);
  };
  
  // If loading document, show loading indicator
  if (isLoadingDocument) {
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
        <Typography color="text.primary">Optimize Document</Typography>
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
          Document Optimization
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
      
      {/* Show Workflow if active */}
      {showWorkflow && (
        <Box sx={{ mb: 3 }}>
          <DocumentImprovementWorkflow
            document={document}
            suggestions={suggestions}
            onUploadImprovedDocument={handleUploadImprovedDocument}
            onCompleteWorkflow={handleCompleteWorkflow}
            onCancelWorkflow={handleCancelWorkflow}
          />
        </Box>
      )}
      
      {/* Show Comparison if active */}
      {showComparison && (
        <Box sx={{ mb: 3 }}>
          <DocumentComparisonView
            originalDocument={document}
            improvedDocument={improvedDocument}
            originalAnalysis={comparisonData?.originalAnalysis}
            improvedAnalysis={comparisonData?.improvedAnalysis}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={handleCloseComparison}>
              Close Comparison
            </Button>
          </Box>
        </Box>
      )}
      
      {/* Show Preparation Guide if active */}
      {showPreparationGuide && (
        <Box sx={{ mb: 3 }}>
          <GuidedDocumentPreparation
            documentType={document.document_type}
            documentTypeDetails={documentTypeDetails}
            countryCode={document.country_code || 'US'}
            onComplete={handleCompletePreparationGuide}
            onCancel={handleCancelPreparationGuide}
          />
        </Box>
      )}
      
      {/* Main Content - Only show if no workflow, comparison, or preparation guide is active */}
      {!showWorkflow && !showComparison && !showPreparationGuide && (
        <>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab icon={<TipsIcon />} label="Optimization" />
            <Tab icon={<CompareIcon />} label="Comparison" />
            <Tab icon={<AssignmentIcon />} label="Preparation Guide" />
          </Tabs>
          
          {/* Optimization Tab */}
          {activeTab === 0 && (
            <Box>
              {isLoadingSuggestions ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : suggestionsError ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                  Error loading optimization suggestions: {suggestionsError}
                </Alert>
              ) : (
                <DocumentOptimizerWidget
                  document={document}
                  onApplySuggestion={handleApplySuggestion}
                  onStartWorkflow={handleStartWorkflow}
                />
              )}
            </Box>
          )}
          
          {/* Comparison Tab */}
          {activeTab === 1 && (
            <Box>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Document Version Comparison
                </Typography>
                <Typography variant="body2" paragraph>
                  Compare different versions of your document to see improvements.
                </Typography>
                
                {improvedDocument ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      dispatch(fetchDocumentComparison({
                        originalDocumentId: documentId,
                        improvedDocumentId: improvedDocument.improvedDocumentId
                      }));
                      setShowComparison(true);
                    }}
                    startIcon={<CompareIcon />}
                  >
                    Compare with Improved Version
                  </Button>
                ) : (
                  <Alert severity="info">
                    No improved versions of this document are available for comparison.
                  </Alert>
                )}
              </Paper>
            </Box>
          )}
          
          {/* Preparation Guide Tab */}
          {activeTab === 2 && (
            <Box>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Document Preparation Guide
                </Typography>
                <Typography variant="body2" paragraph>
                  Follow our guided preparation process to ensure your document meets all requirements.
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStartPreparationGuide}
                  startIcon={<AssignmentIcon />}
                >
                  Start Preparation Guide
                </Button>
              </Paper>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default DocumentOptimizationPage;
