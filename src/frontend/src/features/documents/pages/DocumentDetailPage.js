import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  PictureAsPdf as PictureAsPdfIcon,
  TipsAndUpdates as TipsIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import { getDocumentById, deleteDocument, processDocumentOcr } from '../documentSlice';
import { selectDocumentState } from '../documentSlice';
import DocumentQualityWidget from '../components/DocumentQualityWidget';
import ExtractedDataReview from '../components/ExtractedDataReview';
import DocumentCompleteness from '../components/DocumentCompleteness';
import { format } from 'date-fns';

/**
 * Document Detail Page Component
 * Displays detailed information about a document
 */
const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentDocument, isLoading, isError, error } = useSelector(selectDocumentState);

  // State for tabs
  const [activeTab, setActiveTab] = useState(0);
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // State for OCR processing dialog
  const [ocrDialogOpen, setOcrDialogOpen] = useState(false);
  // State for OCR engine selection
  const [selectedOcrEngine, setSelectedOcrEngine] = useState('tesseract');
  // State for OCR processing status
  const [ocrProcessing, setOcrProcessing] = useState(false);

  // Fetch document on component mount
  useEffect(() => {
    if (id) {
      dispatch(getDocumentById(id));
    }
  }, [dispatch, id]);

  /**
   * Handle tab change
   * @param {Event} event - Tab change event
   * @param {number} newValue - New tab index
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Handle document deletion
   */
  const handleDeleteDocument = async () => {
    try {
      await dispatch(deleteDocument(id)).unwrap();
      navigate('/documents');
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  /**
   * Handle OCR processing
   */
  const handleProcessOcr = async () => {
    try {
      setOcrProcessing(true);
      await dispatch(processDocumentOcr({ id, engineType: selectedOcrEngine })).unwrap();
      setOcrDialogOpen(false);
    } catch (error) {
      console.error('Failed to process document OCR:', error);
    } finally {
      setOcrProcessing(false);
    }
  };

  /**
   * Get file icon based on file type
   * @returns {JSX.Element} - File icon
   */
  const getFileIcon = () => {
    if (!currentDocument) {
      return <DescriptionIcon fontSize="large" color="action" />;
    }

    const fileType = currentDocument.file_type || '';

    if (fileType.includes('pdf')) {
      return <PictureAsPdfIcon fontSize="large" color="error" />;
    } else if (fileType.includes('image')) {
      return <ImageIcon fontSize="large" color="primary" />;
    } else {
      return <DescriptionIcon fontSize="large" color="action" />;
    }
  };

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  /**
   * Get status chip based on document status
   * @returns {JSX.Element} - Status chip
   */
  const getStatusChip = () => {
    if (!currentDocument) return null;

    const status = currentDocument.status || 'pending';

    switch (status) {
      case 'processed':
        return <Chip label="Processed" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  // Loading state
  if (isLoading && !currentDocument) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Error state
  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Document
          </Typography>
          <Typography variant="body1">
            {error || 'Failed to load document details'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/documents')}
            sx={{ mt: 2 }}
          >
            Back to Documents
          </Button>
        </Paper>
      </Container>
    );
  }

  // Document not found
  if (!currentDocument) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Document Not Found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/documents')}
            sx={{ mt: 2 }}
          >
            Back to Documents
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          Dashboard
        </Link>
        <Link color="inherit" href="/documents" onClick={(e) => { e.preventDefault(); navigate('/documents'); }}>
          Documents
        </Link>
        <Typography color="text.primary">{currentDocument.name}</Typography>
      </Breadcrumbs>

      {/* Document Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Box sx={{ mr: 2 }}>
            {getFileIcon()}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h5" component="h1" gutterBottom>
                {currentDocument.name}
              </Typography>
              <Box>
                {getStatusChip()}
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Document Type
                </Typography>
                <Typography variant="body2">
                  {currentDocument.document_type || 'Unknown'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Upload Date
                </Typography>
                <Typography variant="body2">
                  {formatDate(currentDocument.upload_date)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Expiry Date
                </Typography>
                <Typography variant="body2">
                  {formatDate(currentDocument.expires_at) || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" display="block">
                  OCR Engine
                </Typography>
                <Typography variant="body2">
                  {currentDocument.ocr_engine || 'None'}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/documents')}
                size="small"
              >
                Back
              </Button>

              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => {
                  if (currentDocument.file_url) {
                    window.open(currentDocument.file_url, '_blank');
                  } else if (currentDocument.file_path) {
                    // Create a signed URL for the file path
                    const { supabaseUrl } = window.ENV || {};
                    const url = `${supabaseUrl || ''}/storage/v1/object/public/documents/${currentDocument.file_path}`;
                    window.open(url, '_blank');
                  } else {
                    alert('Document file not available for viewing');
                  }
                }}
                size="small"
              >
                View
              </Button>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  if (currentDocument.file_url) {
                    const a = document.createElement('a');
                    a.href = currentDocument.file_url;
                    a.download = currentDocument.name || 'document';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  } else if (currentDocument.file_path) {
                    // Create a signed URL for the file path
                    const { supabaseUrl } = window.ENV || {};
                    const url = `${supabaseUrl || ''}/storage/v1/object/public/documents/${currentDocument.file_path}`;
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = currentDocument.name || 'document';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  } else {
                    alert('Document file not available for download');
                  }
                }}
                size="small"
              >
                Download
              </Button>

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => setOcrDialogOpen(true)}
                size="small"
              >
                Re-Process OCR
              </Button>

              <Button
                variant="outlined"
                startIcon={<TipsIcon />}
                onClick={() => navigate(`/documents/${id}/optimize`)}
                size="small"
                color="primary"
              >
                Optimize Document
              </Button>

              <Button
                variant="outlined"
                startIcon={<VerifiedUserIcon />}
                onClick={() => navigate(`/documents/${id}/verify`)}
                size="small"
                color="primary"
              >
                Verify Document
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                size="small"
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Document Content Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="document tabs">
          <Tab label="Analysis" />
          <Tab label="Extracted Data" />
          <Tab label="Completeness" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box sx={{ mb: 3 }}>
        {/* Analysis Tab */}
        {activeTab === 0 && (
          <DocumentQualityWidget document={currentDocument} />
        )}

        {/* Extracted Data Tab */}
        {activeTab === 1 && (
          <ExtractedDataReview document={currentDocument} />
        )}

        {/* Completeness Tab */}
        {activeTab === 2 && (
          <DocumentCompleteness document={currentDocument} />
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ elevation: 24 }}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this document? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteDocument} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* OCR Processing Dialog */}
      <Dialog
        open={ocrDialogOpen}
        onClose={() => !ocrProcessing && setOcrDialogOpen(false)}
        PaperProps={{ elevation: 24 }}
      >
        <DialogTitle>Process Document with OCR</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select an OCR engine to process this document. This will extract text and data from the document.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Tabs
              value={selectedOcrEngine}
              onChange={(e, value) => setSelectedOcrEngine(value)}
            >
              <Tab value="tesseract" label="Tesseract (Free)" />
              <Tab value="azure" label="Azure AI (Premium)" />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              {selectedOcrEngine === 'tesseract' && (
                <Typography variant="body2" color="text.secondary">
                  Tesseract is a free, open-source OCR engine. It works well for clean, typed documents. This option is completely free to use.
                </Typography>
              )}
              {selectedOcrEngine === 'azure' && (
                <Typography variant="body2" color="text.secondary">
                  Azure AI Document Intelligence provides advanced OCR capabilities, including handwriting recognition and better accuracy for complex documents. This is a premium feature that may require additional credits in the future.
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOcrDialogOpen(false)} disabled={ocrProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleProcessOcr}
            color="primary"
            disabled={ocrProcessing}
            startIcon={ocrProcessing ? <CircularProgress size={20} /> : <RefreshIcon />}
          >
            {ocrProcessing ? 'Processing...' : 'Process'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DocumentDetailPage;
