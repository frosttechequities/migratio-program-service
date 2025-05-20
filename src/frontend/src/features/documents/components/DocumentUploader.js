import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  InsertDriveFile as InsertDriveFileIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { uploadDocument, resetUploadProgress } from '../documentSlice';
import { selectDocumentState } from '../documentSlice';
import { format } from 'date-fns';

/**
 * Document Uploader Component
 * Allows users to upload documents with metadata
 */
const DocumentUploader = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, uploadProgress } = useSelector(selectDocumentState);

  // File input ref
  const fileInputRef = useRef(null);

  // Form state
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [notes, setNotes] = useState('');

  // Form validation state
  const [errors, setErrors] = useState({
    file: '',
    documentType: ''
  });

  // Document types
  const documentTypes = [
    { code: 'passport', name: 'Passport' },
    { code: 'language_test', name: 'Language Test Result' },
    { code: 'education_credential', name: 'Education Credential' },
    { code: 'employment_letter', name: 'Employment Letter' },
    { code: 'birth_certificate', name: 'Birth Certificate' },
    { code: 'marriage_certificate', name: 'Marriage Certificate' },
    { code: 'police_certificate', name: 'Police Certificate' },
    { code: 'medical_exam', name: 'Medical Examination' },
    { code: 'financial_document', name: 'Financial Document' },
    { code: 'other', name: 'Other Document' }
  ];

  /**
   * Handle file selection
   * @param {Event} event - File input change event
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/tiff',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          file: 'Invalid file type. Please upload a PDF, image, or Office document.'
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({
          ...errors,
          file: 'File too large. Maximum size is 10MB.'
        });
        return;
      }

      // Clear file error
      setErrors({
        ...errors,
        file: ''
      });

      // Set selected file
      setSelectedFile(file);

      // Set document name if not already set
      if (!documentName) {
        // Remove file extension from name
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
        setDocumentName(nameWithoutExtension);
      }
    }
  };

  /**
   * Handle document type selection
   * @param {Event} event - Select change event
   */
  const handleDocumentTypeChange = (event) => {
    const type = event.target.value;
    setDocumentType(type);

    // Clear document type error
    setErrors({
      ...errors,
      documentType: ''
    });
  };

  /**
   * Validate form
   * @returns {boolean} - Whether form is valid
   */
  const validateForm = () => {
    const newErrors = {
      file: '',
      documentType: ''
    };

    let isValid = true;

    // Validate file
    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload';
      isValid = false;
    }

    // Validate document type
    if (!documentType) {
      newErrors.documentType = 'Please select a document type';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', documentName);
    formData.append('documentType', documentType);

    if (expiryDate) {
      formData.append('expiryDate', format(expiryDate, 'yyyy-MM-dd'));
    }

    if (notes) {
      formData.append('notes', notes);
    }

    // Dispatch upload action
    dispatch(uploadDocument(formData));
  };

  /**
   * Handle dialog close
   */
  const handleClose = () => {
    // Reset form state
    setSelectedFile(null);
    setDocumentName('');
    setDocumentType('');
    setExpiryDate(null);
    setNotes('');
    setErrors({
      file: '',
      documentType: ''
    });

    // Reset upload progress
    dispatch(resetUploadProgress());

    // Close dialog
    onClose();
  };

  /**
   * Get file icon based on file type
   * @returns {JSX.Element} - File icon
   */
  const getFileIcon = () => {
    if (!selectedFile) {
      return <InsertDriveFileIcon fontSize="large" color="action" />;
    }

    const fileType = selectedFile.type;

    if (fileType.includes('pdf')) {
      return <PictureAsPdfIcon fontSize="large" color="error" />;
    } else if (fileType.includes('image')) {
      return <ImageIcon fontSize="large" color="primary" />;
    } else if (fileType.includes('word') || fileType.includes('office')) {
      return <DescriptionIcon fontSize="large" color="info" />;
    } else {
      return <InsertDriveFileIcon fontSize="large" color="action" />;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Upload Document
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* File Upload Area */}
          <Grid item xs={12}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: selectedFile ? 'rgba(0, 0, 0, 0.02)' : 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              onClick={() => fileInputRef.current.click()}
            >
              {selectedFile ? (
                <Box sx={{ textAlign: 'center' }}>
                  {getFileIcon()}
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  <Chip
                    label="Change File"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              ) : (
                <>
                  <CloudUploadIcon fontSize="large" color="primary" />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Drag and drop a file here or click to browse
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Supported formats: PDF, JPEG, PNG, TIFF, Word, Excel
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    Document processing is completely free
                  </Typography>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx,.xls,.xlsx"
              />
            </Paper>
            {errors.file && (
              <FormHelperText error>{errors.file}</FormHelperText>
            )}
          </Grid>

          {/* Document Metadata */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Document Name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              margin="normal"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" error={!!errors.documentType}>
              <InputLabel id="document-type-label">Document Type</InputLabel>
              <Select
                labelId="document-type-label"
                value={documentType}
                onChange={handleDocumentTypeChange}
                label="Document Type"
              >
                {documentTypes.map((type) => (
                  <MenuItem key={type.code} value={type.code}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.documentType && (
                <FormHelperText>{errors.documentType}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Expiry Date (if applicable)"
                value={expiryDate}
                onChange={(date) => setExpiryDate(date)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
            />
          </Grid>

          {/* Upload Progress */}
          {isLoading && (
            <Grid item xs={12}>
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  {uploadProgress}% Uploaded
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={<CloudUploadIcon />}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentUploader;
