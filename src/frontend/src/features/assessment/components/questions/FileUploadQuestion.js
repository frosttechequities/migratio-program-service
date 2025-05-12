import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

/**
 * FileUploadQuestion component
 * A component for displaying file upload questions
 * 
 * @param {Object} props - Component props
 * @param {Array} props.value - Array of uploaded files
 * @param {Function} props.onChange - Function to call when value changes
 * @param {string} props.helperText - Helper text
 * @param {Array} props.acceptedFileTypes - Array of accepted file types
 * @param {number} props.maxFileSize - Maximum file size in bytes
 * @param {number} props.maxFiles - Maximum number of files
 * @returns {React.ReactElement} FileUploadQuestion component
 */
const FileUploadQuestion = ({
  value = [],
  onChange,
  helperText = 'Drag and drop files here, or click to select files',
  acceptedFileTypes = ['image/*', 'application/pdf'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5
}) => {
  const theme = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    // Check file type
    const fileType = file.type;
    const isValidType = acceptedFileTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return fileType.startsWith(`${category}/`);
      }
      return type === fileType;
    });

    if (!isValidType) {
      return { valid: false, error: 'Invalid file type' };
    }

    // Check file size
    if (file.size > maxFileSize) {
      return { valid: false, error: 'File too large' };
    }

    return { valid: true };
  };

  const processFiles = (files) => {
    // Convert FileList to Array
    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the maximum
    if (value.length + fileArray.length > maxFiles) {
      setErrors({ general: `You can only upload a maximum of ${maxFiles} files` });
      return;
    }

    // Validate and process each file
    const newFiles = [];
    const newErrors = {};
    const newProgress = { ...uploadProgress };

    fileArray.forEach(file => {
      const validation = validateFile(file);
      
      if (validation.valid) {
        // Create a unique ID for the file
        const fileId = `${file.name}-${Date.now()}`;
        
        // Add file to list
        newFiles.push({
          id: fileId,
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString()
        });
        
        // Initialize progress
        newProgress[fileId] = 0;
        
        // Simulate upload progress
        simulateUpload(fileId);
      } else {
        newErrors[file.name] = validation.error;
      }
    });

    // Update state
    setErrors(newErrors);
    setUploadProgress(newProgress);
    
    // Update value with new files
    onChange([...value, ...newFiles]);
  };

  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: progress
      }));
    }, 200);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDelete = (fileId) => {
    const newValue = value.filter(file => file.id !== fileId);
    onChange(newValue);
    
    // Remove from progress tracking
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Drop zone */}
      <Paper
        elevation={0}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          backgroundColor: dragActive ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.light',
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
          },
        }}
      >
        <input
          type="file"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleChange}
          style={{ display: 'none' }}
          id="file-upload-input"
        />
        <label htmlFor="file-upload-input" style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'block' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" color="primary" gutterBottom>
              Upload Files
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {helperText}
            </Typography>
            <Button
              variant="contained"
              component="span"
              sx={{ mt: 2 }}
              startIcon={<CloudUploadIcon />}
            >
              Select Files
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
              Maximum file size: {formatFileSize(maxFileSize)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Accepted file types: {acceptedFileTypes.join(', ')}
            </Typography>
          </Box>
        </label>
      </Paper>

      {/* Error messages */}
      {errors.general && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {errors.general}
        </Typography>
      )}

      {/* File list */}
      {value.length > 0 && (
        <Paper elevation={0} sx={{ mt: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <List>
            {value.map((file, index) => {
              const progress = uploadProgress[file.id] || 0;
              const isComplete = progress === 100;
              
              return (
                <ListItem
                  key={file.id}
                  sx={{
                    borderBottom: index < value.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    py: 1.5,
                  }}
                >
                  <ListItemIcon>
                    {isComplete ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <InsertDriveFileIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.size)}
                        </Typography>
                        {!isComplete && (
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ mt: 1, height: 4, borderRadius: 2 }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(file.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default FileUploadQuestion;
