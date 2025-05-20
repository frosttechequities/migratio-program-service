import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DataObject as DataObjectIcon
} from '@mui/icons-material';
import { updateDocument } from '../documentSlice';

/**
 * Extracted Data Review Component
 * Displays and allows editing of extracted document data
 */
const ExtractedDataReview = ({ document }) => {
  const dispatch = useDispatch();
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State for edited data
  const [editedData, setEditedData] = useState({});
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({});
  // State for save status
  const [saveStatus, setSaveStatus] = useState({ success: false, error: null });
  
  // Check if document has extracted data
  if (!document || !document.extracted_data) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Extracted Data
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No data extracted from this document
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Initialize edited data if empty
  if (Object.keys(editedData).length === 0 && document.extracted_data) {
    setEditedData({ ...document.extracted_data });
  }
  
  /**
   * Toggle editing mode
   */
  const toggleEditing = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditedData({ ...document.extracted_data });
      setSaveStatus({ success: false, error: null });
    }
    setIsEditing(!isEditing);
  };
  
  /**
   * Handle save changes
   */
  const handleSave = async () => {
    try {
      // Dispatch update action
      await dispatch(updateDocument({
        id: document.id,
        data: {
          extracted_data: editedData
        }
      })).unwrap();
      
      // Set success status
      setSaveStatus({ success: true, error: null });
      
      // Exit editing mode
      setIsEditing(false);
    } catch (error) {
      // Set error status
      setSaveStatus({ success: false, error: error.message || 'Failed to save changes' });
    }
  };
  
  /**
   * Handle field change
   * @param {string} field - Field name
   * @param {any} value - New field value
   */
  const handleFieldChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value
    });
  };
  
  /**
   * Handle nested field change
   * @param {string} section - Section name
   * @param {string} field - Field name
   * @param {any} value - New field value
   */
  const handleNestedFieldChange = (section, field, value) => {
    setEditedData({
      ...editedData,
      [section]: {
        ...editedData[section],
        [field]: value
      }
    });
  };
  
  /**
   * Toggle section expansion
   * @param {string} section - Section name
   */
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  /**
   * Format field name for display
   * @param {string} name - Field name
   * @returns {string} - Formatted name
   */
  const formatFieldName = (name) => {
    // Convert camelCase to space-separated words
    const formatted = name.replace(/([A-Z])/g, ' $1');
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };
  
  /**
   * Render field value based on type
   * @param {string} field - Field name
   * @param {any} value - Field value
   * @param {string} section - Section name (optional)
   * @returns {JSX.Element} - Rendered field value
   */
  const renderFieldValue = (field, value, section = null) => {
    // If value is null or undefined
    if (value === null || value === undefined) {
      return <Typography variant="body2" color="text.secondary">Not available</Typography>;
    }
    
    // If value is a string
    if (typeof value === 'string') {
      if (isEditing) {
        return (
          <TextField
            fullWidth
            size="small"
            value={value}
            onChange={(e) => section ? 
              handleNestedFieldChange(section, field, e.target.value) : 
              handleFieldChange(field, e.target.value)
            }
            margin="dense"
            variant="outlined"
          />
        );
      }
      return <Typography variant="body2">{value}</Typography>;
    }
    
    // If value is a number
    if (typeof value === 'number') {
      if (isEditing) {
        return (
          <TextField
            fullWidth
            size="small"
            type="number"
            value={value}
            onChange={(e) => section ? 
              handleNestedFieldChange(section, field, parseFloat(e.target.value)) : 
              handleFieldChange(field, parseFloat(e.target.value))
            }
            margin="dense"
            variant="outlined"
          />
        );
      }
      return <Typography variant="body2">{value}</Typography>;
    }
    
    // If value is a boolean
    if (typeof value === 'boolean') {
      return <Chip label={value ? 'Yes' : 'No'} color={value ? 'success' : 'default'} size="small" />;
    }
    
    // If value is an array
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <Typography variant="body2" color="text.secondary">None</Typography>;
      }
      
      return (
        <Box>
          {value.map((item, index) => (
            <Chip 
              key={index} 
              label={typeof item === 'object' ? JSON.stringify(item) : item.toString()} 
              size="small" 
              sx={{ mr: 0.5, mb: 0.5 }} 
            />
          ))}
        </Box>
      );
    }
    
    // If value is an object
    if (typeof value === 'object') {
      const isExpanded = expandedSections[field] || false;
      
      return (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleSection(field)}>
            <Typography variant="body2" color="primary" sx={{ mr: 1 }}>
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </Typography>
            {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </Box>
          
          <Collapse in={isExpanded}>
            <Box sx={{ mt: 1, ml: 2 }}>
              {Object.entries(value).map(([subField, subValue]) => (
                <Box key={subField} sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatFieldName(subField)}
                  </Typography>
                  {renderFieldValue(subField, subValue, field)}
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      );
    }
    
    // Default fallback
    return <Typography variant="body2">{value.toString()}</Typography>;
  };
  
  /**
   * Render document type specific data
   * @returns {JSX.Element} - Rendered document type specific data
   */
  const renderDocumentTypeSpecificData = () => {
    const documentType = document.document_type;
    const data = editedData;
    
    switch (documentType) {
      case 'passport':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Passport Number
              </Typography>
              {renderFieldValue('passportNumber', data.passportNumber)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Name
              </Typography>
              {renderFieldValue('name', data.name)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Date of Birth
              </Typography>
              {renderFieldValue('dateOfBirth', data.dateOfBirth)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Nationality
              </Typography>
              {renderFieldValue('nationality', data.nationality)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Expiry Date
              </Typography>
              {renderFieldValue('expiryDate', data.expiryDate)}
            </Grid>
          </Grid>
        );
        
      case 'language_test':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Test Type
              </Typography>
              {renderFieldValue('testType', data.testType)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Candidate Name
              </Typography>
              {renderFieldValue('candidateName', data.candidateName)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Test Date
              </Typography>
              {renderFieldValue('testDate', data.testDate)}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Scores
              </Typography>
              {renderFieldValue('scores', data.scores)}
            </Grid>
          </Grid>
        );
        
      case 'education_credential':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Institution
              </Typography>
              {renderFieldValue('institution', data.institution)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Degree
              </Typography>
              {renderFieldValue('degree', data.degree)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Graduation Date
              </Typography>
              {renderFieldValue('graduationDate', data.graduationDate)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Student Name
              </Typography>
              {renderFieldValue('studentName', data.studentName)}
            </Grid>
          </Grid>
        );
        
      case 'employment_letter':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Company
              </Typography>
              {renderFieldValue('company', data.company)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Employee Name
              </Typography>
              {renderFieldValue('employeeName', data.employeeName)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Position
              </Typography>
              {renderFieldValue('position', data.position)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Start Date
              </Typography>
              {renderFieldValue('startDate', data.startDate)}
            </Grid>
          </Grid>
        );
        
      default:
        // Generic data display
        return (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(data).map(([field, value]) => (
                  <TableRow key={field}>
                    <TableCell component="th" scope="row">
                      {formatFieldName(field)}
                    </TableCell>
                    <TableCell>{renderFieldValue(field, value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
    }
  };
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Extracted Data
          </Typography>
          <Box>
            {isEditing ? (
              <>
                <IconButton color="primary" onClick={handleSave} title="Save">
                  <SaveIcon />
                </IconButton>
                <IconButton color="error" onClick={toggleEditing} title="Cancel">
                  <CancelIcon />
                </IconButton>
              </>
            ) : (
              <IconButton color="primary" onClick={toggleEditing} title="Edit">
                <EditIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        
        {/* Save Status Alert */}
        {saveStatus.success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Changes saved successfully
          </Alert>
        )}
        
        {saveStatus.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveStatus.error}
          </Alert>
        )}
        
        <Divider sx={{ mb: 2 }} />
        
        {/* Extracted Data Display */}
        <Box>
          {renderDocumentTypeSpecificData()}
        </Box>
        
        {/* Confidence Score */}
        {document.extracted_data.confidence && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <DataObjectIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Extraction Confidence: {Math.round(document.extracted_data.confidence * 100)}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtractedDataReview;
