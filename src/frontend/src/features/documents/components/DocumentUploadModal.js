import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress // For upload progress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { uploadDocument, getDocumentCategories, resetUploadProgress, selectDocumentState } from '../documentSlice'; // Import actions/thunks/selector

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const DocumentUploadModal = ({ open, onClose, onUploadSuccess }) => {
  const dispatch = useDispatch();

  // Local state for form inputs
  const [documentTypeCode, setDocumentTypeCode] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  // Add other metadata fields here if needed (e.g., issuedDate, documentNumber)

  // Select relevant state from Redux store
  const {
    isLoading, // Use isLoading from the slice for upload status
    error: uploadError, // Rename to avoid conflict with potential local errors
    uploadProgress,
    categories: documentTypes // Use fetched categories
  } = useSelector(selectDocumentState); // Assuming selectDocumentState selects the whole slice

  // Fetch document types when modal opens (if not already loaded)
  useEffect(() => {
    if (open && (!documentTypes || documentTypes.length === 0)) {
      dispatch(getDocumentCategories());
    }
  }, [open, dispatch, documentTypes]);

  // Find config for the selected document type
  const selectedDocTypeConfig = documentTypes?.find(dt => dt.code === documentTypeCode);

  const handleFileChange = useCallback((event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // TODO: Add client-side validation for size and type based on selectedDocTypeConfig
      setSelectedFile(file);
      setFileName(file.name);
      // Clear previous upload error when file changes (handled by slice on new pending)
    } else {
      setSelectedFile(null);
      setFileName('');
    }
  }, []); // Removed selectedDocTypeConfig dependency for simplicity, validation can happen on submit

  const resetForm = useCallback(() => {
    setDocumentTypeCode('');
    setSelectedFile(null);
    setFileName('');
    setExpiryDate('');
    setNotes('');
    dispatch(resetUploadProgress()); // Reset progress in Redux state
    // Error state is reset when a new upload starts (pending action)
  }, [dispatch]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose(); // Call the onClose prop passed from parent
  }, [resetForm, onClose]);

  const handleUpload = async () => {
    if (!selectedFile || !documentTypeCode) {
      // Use slice error state? Or keep local for form validation?
      // For now, let's assume slice handles API errors, keep local simple check
      alert('Please select a document type and choose a file.'); // Simple alert for now
      return;
    }
    // TODO: Add validation for expiry date if required by selectedDocTypeConfig

    const metadata = {
        documentTypeCode,
        expiryDate: expiryDate || null, // Send null if empty
        notes: notes || null,
        // Add other metadata fields here
    };

    // Dispatch the upload thunk
    // Result handling (success/error) is managed by the slice and useEffect below
    dispatch(uploadDocument({ file: selectedFile, metadata }));
  };

  // Effect to handle successful upload and close modal
  useEffect(() => {
      // Check if loading just finished and there's no error
      if (!isLoading && uploadProgress === 100 && !uploadError) {
          console.log('[UploadModal] Upload Successful via Redux state');
          onUploadSuccess(); // Notify parent
          handleClose(); // Close modal
      }
  }, [isLoading, uploadProgress, uploadError, onUploadSuccess, handleClose]);


  return (
    <Modal
      open={open}
      onClose={handleClose} // Use useCallback version
      aria-labelledby="document-upload-modal-title"
      aria-describedby="document-upload-modal-description"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose} // Use useCallback version
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          disabled={isLoading} // Disable close button while loading? Maybe not.
        >
          <CloseIcon />
        </IconButton>
        <Typography id="document-upload-modal-title" variant="h6" component="h2" mb={2}>
          Upload New Document
        </Typography>

        {/* Display Upload Error from Redux State */}
        {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}

        <Grid container spacing={2}>
           <Grid item xs={12}>
             {/* Use fetched documentTypes */}
             <FormControl fullWidth required error={!documentTypeCode && !!uploadError}>
                <InputLabel id="doc-type-select-label">Document Type</InputLabel>
                <Select
                    labelId="doc-type-select-label"
                    id="doc-type-select"
                    value={documentTypeCode}
                    label="Document Type"
                    onChange={(e) => setDocumentTypeCode(e.target.value)}
                    disabled={isLoading}
                >
                    <MenuItem value="" disabled><em>Select type...</em></MenuItem>
                    {(documentTypes || []).map(docType => (
                        // Assuming docType has _id, code, name, category
                        <MenuItem key={docType._id || docType.code} value={docType.code}>
                            {docType.name} ({docType.category})
                        </MenuItem>
                    ))}
                </Select>
             </FormControl>
           </Grid>

           <Grid item xs={12}>
                <Button
                    fullWidth
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    disabled={isLoading}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none', color: 'text.secondary', borderColor: 'rgba(0, 0, 0, 0.23)' }}
                >
                    {fileName || 'Choose File...'}
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        // accept={selectedDocTypeConfig?.acceptedFileTypes?.join(',')} // TODO: Get accepted types from docType config
                    />
                </Button>
           </Grid>

            {/* Conditionally render expiry date based on fetched config */}
            {selectedDocTypeConfig?.expiryRequired && (
                 <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="date"
                        label="Expiry Date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        disabled={isLoading}
                        required={selectedDocTypeConfig?.expiryRequired}
                        InputLabelProps={{ shrink: true }}
                    />
                 </Grid>
            )}

             <Grid item xs={12}>
                 <TextField
                    fullWidth
                    variant="outlined"
                    label="Notes (Optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isLoading}
                    multiline
                    rows={2}
                 />
             </Grid>

             {/* Upload Progress Bar */}
             {isLoading && (
                <Grid item xs={12}>
                    <Box sx={{ width: '100%', mt: 1 }}>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                        <Typography variant="caption" display="block" textAlign="center">{uploadProgress}%</Typography>
                    </Box>
                </Grid>
             )}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={handleClose} disabled={isLoading} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isLoading || !selectedFile || !documentTypeCode}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DocumentUploadModal;
