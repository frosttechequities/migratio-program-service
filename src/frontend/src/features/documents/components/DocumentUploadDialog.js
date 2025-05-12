import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Paper,
  useTheme,
  alpha,
  Grid
} from '@mui/material';
// Date picker components temporarily removed due to compatibility issues
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

/**
 * DocumentUploadDialog component
 * A dialog for uploading documents
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Function} props.onUpload - Function to call when document is uploaded
 * @param {Array} props.categories - Array of document categories
 * @returns {React.ReactElement} DocumentUploadDialog component
 */
const DocumentUploadDialog = ({ open, onClose, onUpload, categories }) => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    category: '',
    documentType: '',
    description: '',
    expiryDate: null,
    issuedDate: null,
    issuedBy: '',
    documentNumber: '',
    country: '',
  });
  const [errors, setErrors] = useState({});

  // Document types by category
  const documentTypes = {
    identity: [
      { value: 'passport', label: 'Passport' },
      { value: 'national_id', label: 'National ID' },
      { value: 'birth_certificate', label: 'Birth Certificate' },
      { value: 'marriage_certificate', label: 'Marriage Certificate' },
    ],
    education: [
      { value: 'diploma', label: 'Diploma' },
      { value: 'degree', label: 'Degree Certificate' },
      { value: 'transcript', label: 'Transcript' },
    ],
    work: [
      { value: 'employment_letter', label: 'Employment Letter' },
      { value: 'reference_letter', label: 'Reference Letter' },
      { value: 'pay_stub', label: 'Pay Stub' },
      { value: 'tax_return', label: 'Tax Return' },
    ],
    language: [
      { value: 'language_test', label: 'Language Test Result' },
    ],
    financial: [
      { value: 'bank_statement', label: 'Bank Statement' },
      { value: 'property_document', label: 'Property Document' },
    ],
    other: [
      { value: 'medical_report', label: 'Medical Report' },
      { value: 'police_clearance', label: 'Police Clearance' },
      { value: 'other', label: 'Other Document' },
    ],
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Clear file error if exists
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: '' }));
      }
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset document type if category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        documentType: ''
      }));
    }
  };

  // Handle date change
  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle dialog close
  const handleClose = () => {
    // Reset form
    setFile(null);
    setFormData({
      category: '',
      documentType: '',
      description: '',
      expiryDate: null,
      issuedDate: null,
      issuedBy: '',
      documentNumber: '',
      country: '',
    });
    setErrors({});
    setUploading(false);
    setUploadProgress(0);

    onClose();
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!file) {
      newErrors.file = 'Please select a file to upload';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.documentType) {
      newErrors.documentType = 'Please select a document type';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate upload
    setUploading(true);

    // Create form data
    const documentData = new FormData();
    documentData.append('file', file);
    documentData.append('category', formData.category);
    documentData.append('documentType', formData.documentType);

    if (formData.description) {
      documentData.append('description', formData.description);
    }

    if (formData.expiryDate) {
      documentData.append('expiryDate', formData.expiryDate.toISOString());
    }

    if (formData.issuedDate) {
      documentData.append('issuedDate', formData.issuedDate.toISOString());
    }

    if (formData.issuedBy) {
      documentData.append('issuedBy', formData.issuedBy);
    }

    if (formData.documentNumber) {
      documentData.append('documentNumber', formData.documentNumber);
    }

    if (formData.country) {
      documentData.append('country', formData.country);
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Call onUpload callback
        onUpload(documentData);
      }
    }, 300);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
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

      <DialogContent dividers>
        {/* File upload section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Select Document
          </Typography>

          <input
            type="file"
            id="document-upload"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />

          {!file ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: errors.file ? 'error.main' : 'divider',
                bgcolor: alpha(theme.palette.background.default, 0.7),
                cursor: 'pointer',
              }}
              component="label"
              htmlFor="document-upload"
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Click to select a file or drag and drop
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported formats: PDF, Word, JPEG, PNG (Max size: 10MB)
              </Typography>

              {errors.file && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                  {errors.file}
                </Typography>
              )}
            </Paper>
          ) : (
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InsertDriveFileIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(file.size)} • {file.type}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                size="small"
                onClick={() => setFile(null)}
              >
                Change
              </Button>
            </Paper>
          )}
        </Box>

        {/* Document details section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Document Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category} required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography color="error" variant="caption">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.documentType} required disabled={!formData.category}>
                <InputLabel>Document Type</InputLabel>
                <Select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  label="Document Type"
                >
                  {formData.category && documentTypes[formData.category]?.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.documentType && (
                  <Typography color="error" variant="caption">
                    {errors.documentType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="Add a brief description of this document"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issue Date"
                type="date"
                name="issuedDate"
                value={formData.issuedDate ? formData.issuedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleDateChange('issuedDate', date);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                name="expiryDate"
                value={formData.expiryDate ? formData.expiryDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleDateChange('expiryDate', date);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Issued By"
                name="issuedBy"
                value={formData.issuedBy}
                onChange={handleChange}
                placeholder="e.g., Government of Canada"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Document Number"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                placeholder="e.g., Passport number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g., Canada"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Upload progress */}
        {uploading && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Uploading: {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={uploading}
          startIcon={<CloudUploadIcon />}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentUploadDialog;
