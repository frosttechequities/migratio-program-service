import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Radio,
  RadioGroup,
  TextField,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { generatePDF } from '../pdfSlice';

/**
 * PDFGenerator component
 * A component for generating PDF documents
 *
 * @returns {React.ReactElement} PDFGenerator component
 */
const PDFGenerator = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const roadmapState = useSelector((state) => state.roadmap);
  const documentState = useSelector((state) => state.documents);
  const pdfState = useSelector((state) => state.pdf);

  // Safely extract values with fallbacks
  const roadmaps = roadmapState?.roadmaps || [];
  const documents = documentState?.documents || [];
  const loading = pdfState?.loading || false;
  const error = pdfState?.error || null;
  const pdfUrl = pdfState?.pdfUrl || null;

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    documentType: 'roadmap',
    roadmapId: '',
    includeDocuments: true,
    includeTimeline: true,
    includeNotes: true,
    customTitle: '',
    customDescription: '',
    selectedDocuments: [],
    format: 'pdf',
    colorScheme: 'default'
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle document selection
  const handleDocumentSelection = (documentId) => {
    setFormData(prev => {
      const selectedDocuments = [...prev.selectedDocuments];
      const index = selectedDocuments.indexOf(documentId);

      if (index === -1) {
        selectedDocuments.push(documentId);
      } else {
        selectedDocuments.splice(index, 1);
      }

      return {
        ...prev,
        selectedDocuments
      };
    });
  };

  // Handle next step
  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Handle PDF generation
  const handleGeneratePDF = () => {
    try {
      console.log('Generating document with data:', formData);

      // Create document content based on document type
      let title = '';
      let content = '';

      // Set title based on document type
      if (formData.documentType === 'roadmap') {
        title = formData.customTitle || 'Immigration Roadmap';

        // Create roadmap content
        content = `
# Immigration Roadmap
${formData.customDescription || 'A personalized roadmap for your immigration journey'}

**Created:** ${new Date().toLocaleDateString()}
**Format:** ${formData.format === 'pdf' ? 'PDF Document' : 'Word Document'}
**Color Scheme:** ${formData.colorScheme.charAt(0).toUpperCase() + formData.colorScheme.slice(1)}

## Timeline & Milestones
- Phase 1: Preparation and Planning
  - Milestone 1: Document Collection (Due: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()})
  - Milestone 2: Language Testing (Due: ${new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString()})

- Phase 2: Application Submission
  - Milestone 1: Form Completion (Due: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()})
  - Milestone 2: Fee Payment (Due: ${new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toLocaleDateString()})

## Required Documents
1. Valid Passport
2. Birth Certificate
3. Marriage Certificate (if applicable)
4. Educational Credentials
5. Language Test Results
6. Employment Records

## Notes & Comments
- Remember to get all documents translated by a certified translator
- Keep copies of all submitted documents
- Check processing times regularly
`;
      } else if (formData.documentType === 'checklist') {
        title = formData.customTitle || 'Document Checklist';

        // Create checklist content
        content = `
# Immigration Document Checklist
${formData.customDescription || 'A checklist of required documents for your immigration process'}

**Created:** ${new Date().toLocaleDateString()}
**Format:** ${formData.format === 'pdf' ? 'PDF Document' : 'Word Document'}
**Color Scheme:** ${formData.colorScheme.charAt(0).toUpperCase() + formData.colorScheme.slice(1)}

## Personal Documents
- [ ] Valid Passport (valid for at least 6 months beyond intended stay)
- [ ] Birth Certificate (original and translated copy)
- [ ] Marriage Certificate (if applicable)
- [ ] Divorce Certificate (if applicable)
- [ ] Change of Name Documents (if applicable)

## Educational Documents
- [ ] Diplomas and Degrees
- [ ] Transcripts
- [ ] Educational Credential Assessment (ECA)
- [ ] Professional Certifications

## Employment Documents
- [ ] Resume/CV
- [ ] Reference Letters
- [ ] Employment Contracts
- [ ] Pay Stubs
- [ ] Tax Documents

## Financial Documents
- [ ] Bank Statements (last 6 months)
- [ ] Proof of Assets
- [ ] Investment Statements
`;
      } else if (formData.documentType === 'summary') {
        title = formData.customTitle || 'Application Summary';

        // Create summary content
        content = `
# Immigration Application Summary
${formData.customDescription || 'A summary of your immigration application status and details'}

**Created:** ${new Date().toLocaleDateString()}
**Format:** ${formData.format === 'pdf' ? 'PDF Document' : 'Word Document'}
**Color Scheme:** ${formData.colorScheme.charAt(0).toUpperCase() + formData.colorScheme.slice(1)}

## Application Details
**Application Type:** Immigration Application
**Status:** In Progress
**Submitted Date:** ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
**Last Updated:** ${new Date().toLocaleDateString()}
**Reference Number:** IMM-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}

## Applicant Information
**Name:** John Doe
**Email:** john.doe@example.com
**Phone:** +1 (555) 123-4567
**Nationality:** United States
**Date of Birth:** January 1, 1985

## Program Details
**Program:** Express Entry
**Category:** Federal Skilled Worker
**Processing Time:** 6-12 months
**Current Stage:** Document Collection
**Points Score:** 450
`;
      }

      // Create a data URL for the content
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      color: #333;
    }
    h1 {
      color: #1976d2;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #2196f3;
      margin-top: 30px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 5px;
    }
    .print-button {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin: 20px 0;
      display: block;
    }
    .note {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
      border-left: 4px solid #2196f3;
    }
    pre {
      white-space: pre-wrap;
      font-family: inherit;
    }
    strong {
      color: #1976d2;
    }
    ul, ol {
      margin-left: 20px;
    }
    li {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>

  <div class="note">
    This document was generated by Visafy. Click the button below to print or save as PDF.
  </div>

  <button class="print-button" onclick="window.print()">Print / Save as PDF</button>

  <div class="content">
    ${content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>').replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>').replace(/- \[ \] (.*?)(\n|$)/g, '<div style="margin-bottom: 10px;"><input type="checkbox"> $1</div>').replace(/- \[(x|X)\] (.*?)(\n|$)/g, '<div style="margin-bottom: 10px;"><input type="checkbox" checked> $2</div>').replace(/- (.*?)(\n|$)/g, '<div style="margin-bottom: 10px;">• $1</div>')}
  </div>

  <button class="print-button" onclick="window.print()">Print / Save as PDF</button>
</body>
</html>
      `;

      // Create a blob from the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // Open the document in a new tab
      window.open(url, '_blank');

      // Update the state to show success message
      dispatch({
        type: 'pdf/generate/fulfilled',
        payload: {
          pdfUrl: url,
          pdfId: 'mock-pdf-' + Date.now()
        }
      });

      // Clean up the URL object after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (error) {
      console.error('Error generating document:', error);

      // Update the state to show error message
      dispatch({
        type: 'pdf/generate/rejected',
        payload: error.message || 'Failed to generate document'
      });
    }
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  // Get step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Document Type
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Choose what type of document you want to generate.
            </Typography>

            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
              >
                <Paper
                  elevation={formData.documentType === 'roadmap' ? 2 : 0}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: formData.documentType === 'roadmap' ? 'primary.main' : 'divider',
                    backgroundColor: formData.documentType === 'roadmap' ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                  }}
                >
                  <FormControlLabel
                    value="roadmap"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Immigration Roadmap
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Generate a detailed PDF of your immigration roadmap with all steps and milestones.
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>

                <Paper
                  elevation={formData.documentType === 'checklist' ? 2 : 0}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: formData.documentType === 'checklist' ? 'primary.main' : 'divider',
                    backgroundColor: formData.documentType === 'checklist' ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                  }}
                >
                  <FormControlLabel
                    value="checklist"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Document Checklist
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Create a checklist of all required documents for your immigration process.
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>

                <Paper
                  elevation={formData.documentType === 'summary' ? 2 : 0}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: formData.documentType === 'summary' ? 'primary.main' : 'divider',
                    backgroundColor: formData.documentType === 'summary' ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                  }}
                >
                  <FormControlLabel
                    value="summary"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Application Summary
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Generate a summary of your immigration application with key details and status.
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Content
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Choose what to include in your document.
            </Typography>

            {formData.documentType === 'roadmap' && (
              <>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Roadmap
                  </Typography>
                  <TextField
                    select
                    name="roadmapId"
                    value={formData.roadmapId}
                    onChange={handleChange}
                    SelectProps={{
                      native: true,
                    }}
                    variant="outlined"
                  >
                    <option value="">Select a roadmap</option>
                    {roadmaps && roadmaps.length > 0 ? (
                      roadmaps.map((roadmap) => (
                        <option key={roadmap._id || roadmap.id} value={roadmap._id || roadmap.id}>
                          {roadmap.title}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No roadmaps available</option>
                    )}
                  </TextField>
                </FormControl>

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Include Sections
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.includeTimeline}
                          onChange={handleChange}
                          name="includeTimeline"
                        />
                      }
                      label="Timeline and Milestones"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.includeDocuments}
                          onChange={handleChange}
                          name="includeDocuments"
                        />
                      }
                      label="Required Documents"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.includeNotes}
                          onChange={handleChange}
                          name="includeNotes"
                        />
                      }
                      label="Notes and Comments"
                    />
                  </FormGroup>
                </FormControl>
              </>
            )}

            {formData.documentType === 'checklist' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Select Documents to Include
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                  <FormGroup>
                    {documents.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No documents available. Upload documents first.
                      </Typography>
                    ) : (
                      documents.map((document) => (
                        <FormControlLabel
                          key={document.id}
                          control={
                            <Checkbox
                              checked={formData.selectedDocuments.includes(document.id)}
                              onChange={() => handleDocumentSelection(document.id)}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2">{document.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {document.category} • {new Date(document.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      ))
                    )}
                  </FormGroup>
                </Paper>
              </Box>
            )}

            <TextField
              fullWidth
              label="Custom Title"
              name="customTitle"
              value={formData.customTitle}
              onChange={handleChange}
              placeholder="Enter a custom title for your document"
              margin="normal"
            />

            <TextField
              fullWidth
              label="Custom Description"
              name="customDescription"
              value={formData.customDescription}
              onChange={handleChange}
              placeholder="Enter a custom description"
              margin="normal"
              multiline
              rows={2}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Format Options
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Choose the format and appearance of your document.
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <Typography variant="subtitle2" gutterBottom>
                File Format
              </Typography>
              <RadioGroup
                name="format"
                value={formData.format}
                onChange={handleChange}
                row
              >
                <FormControlLabel value="pdf" control={<Radio />} label="PDF Document" />
                <FormControlLabel value="docx" control={<Radio />} label="Word Document" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <Typography variant="subtitle2" gutterBottom>
                Color Scheme
              </Typography>
              <RadioGroup
                name="colorScheme"
                value={formData.colorScheme}
                onChange={handleChange}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <Paper
                      elevation={formData.colorScheme === 'default' ? 3 : 1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: formData.colorScheme === 'default' ? 'primary.main' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, colorScheme: 'default' }))}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Radio
                          checked={formData.colorScheme === 'default'}
                          value="default"
                          name="colorScheme"
                          onChange={handleChange}
                          sx={{ p: 0.5, mr: 1 }}
                        />
                        <Typography variant="body2" fontWeight={500}>Default</Typography>
                      </Box>
                      <Box sx={{ height: 20, bgcolor: theme.palette.primary.main, borderRadius: 1, mb: 1 }} />
                      <Box sx={{ height: 10, bgcolor: theme.palette.primary.light, borderRadius: 1 }} />
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Paper
                      elevation={formData.colorScheme === 'professional' ? 3 : 1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: formData.colorScheme === 'professional' ? 'primary.main' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, colorScheme: 'professional' }))}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Radio
                          checked={formData.colorScheme === 'professional'}
                          value="professional"
                          name="colorScheme"
                          onChange={handleChange}
                          sx={{ p: 0.5, mr: 1 }}
                        />
                        <Typography variant="body2" fontWeight={500}>Professional</Typography>
                      </Box>
                      <Box sx={{ height: 20, bgcolor: '#1E3A8A', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ height: 10, bgcolor: '#93C5FD', borderRadius: 1 }} />
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Paper
                      elevation={formData.colorScheme === 'modern' ? 3 : 1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: formData.colorScheme === 'modern' ? 'primary.main' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, colorScheme: 'modern' }))}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Radio
                          checked={formData.colorScheme === 'modern'}
                          value="modern"
                          name="colorScheme"
                          onChange={handleChange}
                          sx={{ p: 0.5, mr: 1 }}
                        />
                        <Typography variant="body2" fontWeight={500}>Modern</Typography>
                      </Box>
                      <Box sx={{ height: 20, bgcolor: '#4F46E5', borderRadius: 1, mb: 1 }} />
                      <Box sx={{ height: 10, bgcolor: '#C7D2FE', borderRadius: 1 }} />
                    </Paper>
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review & Generate
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Review your selections and generate your document.
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Document Type
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.documentType === 'roadmap'
                      ? 'Immigration Roadmap'
                      : formData.documentType === 'checklist'
                      ? 'Document Checklist'
                      : 'Application Summary'}
                  </Typography>
                </Grid>

                {formData.documentType === 'roadmap' && formData.roadmapId && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Selected Roadmap
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {roadmaps.find(r => (r._id || r.id) === formData.roadmapId)?.title || 'Unknown Roadmap'}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    File Format
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.format === 'pdf' ? 'PDF Document' : 'Word Document'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Color Scheme
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.colorScheme.charAt(0).toUpperCase() + formData.colorScheme.slice(1)}
                  </Typography>
                </Grid>

                {formData.customTitle && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Custom Title
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.customTitle}
                    </Typography>
                  </Grid>
                )}

                {formData.customDescription && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Custom Description
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.customDescription}
                    </Typography>
                  </Grid>
                )}

                {formData.documentType === 'roadmap' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Included Sections
                    </Typography>
                    <Typography variant="body1">
                      {[
                        formData.includeTimeline && 'Timeline and Milestones',
                        formData.includeDocuments && 'Required Documents',
                        formData.includeNotes && 'Notes and Comments'
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </Typography>
                  </Grid>
                )}

                {formData.documentType === 'checklist' && formData.selectedDocuments.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Selected Documents
                    </Typography>
                    <Typography variant="body1">
                      {formData.selectedDocuments.length} documents selected
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {pdfUrl && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Your document has been generated successfully!
              </Alert>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <PictureAsPdfIcon sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4">
          Generate Documents
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>Select Document Type</StepLabel>
          <StepContent>
            {getStepContent(0)}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<NavigateNextIcon />}
              >
                Next
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Select Content</StepLabel>
          <StepContent>
            {getStepContent(1)}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<NavigateBeforeIcon />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<NavigateNextIcon />}
              >
                Next
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Format Options</StepLabel>
          <StepContent>
            {getStepContent(2)}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<NavigateBeforeIcon />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<NavigateNextIcon />}
              >
                Next
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Review & Generate</StepLabel>
          <StepContent>
            {getStepContent(3)}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<NavigateBeforeIcon />}
              >
                Back
              </Button>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {pdfUrl && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleDownloadPDF}
                    startIcon={<DownloadIcon />}
                  >
                    Download
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGeneratePDF}
                  startIcon={<DescriptionIcon />}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Generating...
                    </>
                  ) : pdfUrl ? (
                    'Regenerate'
                  ) : (
                    'Generate Document'
                  )}
                </Button>
              </Box>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
};

export default PDFGenerator;
