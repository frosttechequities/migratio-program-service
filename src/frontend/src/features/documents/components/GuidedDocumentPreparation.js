import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  AlertTitle,
  Chip,
  Grid,
  Link
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Description as DescriptionIcon,
  PhotoCamera as PhotoCameraIcon,
  Translate as TranslateIcon,
  Verified as VerifiedIcon,
  Info as InfoIcon,
  OpenInNew as OpenInNewIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Apartment as ApartmentIcon
} from '@mui/icons-material';

/**
 * Guided Document Preparation Component
 * Interactive guide for preparing documents before upload
 * 
 * @param {Object} props - Component props
 * @param {string} props.documentType - Document type code
 * @param {Object} props.documentTypeDetails - Document type details
 * @param {string} props.countryCode - Country code
 * @param {Function} props.onComplete - Function to call when preparation is complete
 * @param {Function} props.onCancel - Function to call when preparation is cancelled
 * @returns {React.ReactElement} GuidedDocumentPreparation component
 */
const GuidedDocumentPreparation = ({ 
  documentType, 
  documentTypeDetails, 
  countryCode, 
  onComplete, 
  onCancel 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  
  // If no document type, show error
  if (!documentType) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Document Preparation Guide
          </Typography>
          <Alert severity="error">
            No document type specified for preparation guide
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Mock document type details for demo
  const mockDocumentTypeDetails = documentTypeDetails || {
    name: documentType === 'passport' ? 'Passport' : 
          documentType === 'birth_certificate' ? 'Birth Certificate' : 
          documentType === 'marriage_certificate' ? 'Marriage Certificate' : 
          'Document',
    description: 'Official identification document issued by a government authority.',
    requirements: {
      format: ['original', 'certified_copy'],
      translation: countryCode !== 'US' && countryCode !== 'GB',
      certification: countryCode !== 'US' && countryCode !== 'GB',
      certificationType: 'apostille'
    },
    requiredFields: [
      'full_name',
      'date_of_birth',
      'place_of_birth',
      'nationality',
      'passport_number',
      'issue_date',
      'expiry_date'
    ],
    tips: [
      'Ensure all pages are included, including blank pages',
      'Make sure the document is not expired',
      'Ensure all text is clearly legible',
      'Avoid glare or shadows when taking photos'
    ],
    examples: [
      {
        title: 'Sample Passport Photo',
        url: 'https://example.com/sample-passport.jpg',
        description: 'Example of a properly photographed passport'
      }
    ],
    officialLinks: [
      {
        title: 'Official Passport Requirements',
        url: 'https://travel.state.gov/content/travel/en/passports.html',
        description: 'U.S. Department of State passport information'
      }
    ]
  };
  
  // Toggle checklist item
  const handleToggleChecklist = (itemId) => {
    setCheckedItems({
      ...checkedItems,
      [itemId]: !checkedItems[itemId]
    });
  };
  
  // Check if all items in a step are checked
  const isStepComplete = (stepIndex) => {
    const stepItems = getStepChecklistItems(stepIndex);
    return stepItems.every(item => checkedItems[`${stepIndex}-${item.id}`]);
  };
  
  // Get checklist items for a step
  const getStepChecklistItems = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Document Requirements
        return [
          { id: 'read-requirements', label: 'I have read and understood the document requirements' },
          { id: 'have-document', label: 'I have the required document available' }
        ];
      case 1: // Document Format
        return [
          { id: 'correct-format', label: 'My document is in the correct format' },
          { id: 'all-pages', label: 'I have all required pages of the document' }
        ];
      case 2: // Translation & Certification
        const items = [];
        if (mockDocumentTypeDetails.requirements.translation) {
          items.push({ id: 'translation', label: 'I have a certified translation of the document (if not in English)' });
        }
        if (mockDocumentTypeDetails.requirements.certification) {
          items.push({ id: 'certification', label: `I have the document ${mockDocumentTypeDetails.requirements.certificationType} certification` });
        }
        if (items.length === 0) {
          items.push({ id: 'no-requirements', label: 'No translation or certification required for this document' });
        }
        return items;
      case 3: // Preparation Tips
        return [
          { id: 'read-tips', label: 'I have read the preparation tips' },
          { id: 'checked-examples', label: 'I have reviewed the example documents' }
        ];
      default:
        return [];
    }
  };
  
  // Define preparation steps
  const steps = [
    {
      label: 'Document Requirements',
      description: 'Understand the requirements for this document type.',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            Please review the requirements for {mockDocumentTypeDetails.name}:
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Document Description
            </Typography>
            <Typography variant="body2" paragraph>
              {mockDocumentTypeDetails.description}
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              Required Information
            </Typography>
            <List dense disablePadding>
              {mockDocumentTypeDetails.requiredFields.map((field, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          {mockDocumentTypeDetails.officialLinks && mockDocumentTypeDetails.officialLinks.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Official Resources
              </Typography>
              <List dense disablePadding>
                {mockDocumentTypeDetails.officialLinks.map((link, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DescriptionIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Link 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          {link.title}
                          <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
                        </Link>
                      }
                      secondary={link.description}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Checklist
          </Typography>
          <List>
            {getStepChecklistItems(0).map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={!!checkedItems[`0-${item.id}`]}
                    onChange={() => handleToggleChecklist(`0-${item.id}`)}
                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${item.id}` }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={`checkbox-list-label-${item.id}`}
                  primary={item.label}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )
    },
    {
      label: 'Document Format',
      description: 'Ensure your document is in the correct format.',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            The {mockDocumentTypeDetails.name} must be in one of the following formats:
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {mockDocumentTypeDetails.requirements.format.map((format, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  {format === 'original' ? (
                    <DescriptionIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  ) : format === 'certified_copy' ? (
                    <VerifiedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  ) : (
                    <DescriptionIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  )}
                  <Typography variant="subtitle2" align="center">
                    {format === 'original' ? 'Original Document' : 
                     format === 'certified_copy' ? 'Certified Copy' : 
                     format.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    {format === 'original' ? 'The original document issued by the authority' : 
                     format === 'certified_copy' ? 'A copy certified by a notary or authorized official' : 
                     'Document in required format'}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Important</AlertTitle>
            Ensure that all pages of the document are included, including any blank pages that are part of the document.
          </Alert>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Checklist
          </Typography>
          <List>
            {getStepChecklistItems(1).map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={!!checkedItems[`1-${item.id}`]}
                    onChange={() => handleToggleChecklist(`1-${item.id}`)}
                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${item.id}` }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={`checkbox-list-label-${item.id}`}
                  primary={item.label}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )
    },
    {
      label: 'Translation & Certification',
      description: 'Check if translation or certification is required.',
      content: (
        <Box>
          {mockDocumentTypeDetails.requirements.translation && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TranslateIcon sx={{ mr: 1 }} />
                Translation Requirements
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" paragraph>
                  This document must be translated if it is not in English. The translation must be:
                </Typography>
                <List dense disablePadding>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Completed by a certified translator"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Include the translator's certification"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Include all information from the original document"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Box>
          )}
          
          {mockDocumentTypeDetails.requirements.certification && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <VerifiedIcon sx={{ mr: 1 }} />
                Certification Requirements
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" paragraph>
                  This document requires {mockDocumentTypeDetails.requirements.certificationType.replace(/_/g, ' ')} certification:
                </Typography>
                <List dense disablePadding>
                  {mockDocumentTypeDetails.requirements.certificationType === 'apostille' && (
                    <>
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Document must have an apostille certificate"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Apostille must be issued by the appropriate authority in the country of origin"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    </>
                  )}
                  {mockDocumentTypeDetails.requirements.certificationType === 'notarized' && (
                    <>
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Document must be notarized by a licensed notary public"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      <ListItem disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Notarization must include the notary's seal and signature"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    </>
                  )}
                </List>
              </Paper>
            </Box>
          )}
          
          {!mockDocumentTypeDetails.requirements.translation && !mockDocumentTypeDetails.requirements.certification && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Good news!</AlertTitle>
              No translation or certification is required for this document.
            </Alert>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Checklist
          </Typography>
          <List>
            {getStepChecklistItems(2).map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={!!checkedItems[`2-${item.id}`]}
                    onChange={() => handleToggleChecklist(`2-${item.id}`)}
                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${item.id}` }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={`checkbox-list-label-${item.id}`}
                  primary={item.label}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )
    },
    {
      label: 'Preparation Tips',
      description: 'Tips for preparing your document for upload.',
      content: (
        <Box>
          <Typography variant="body2" paragraph>
            Follow these tips to ensure your {mockDocumentTypeDetails.name} is properly prepared for upload:
          </Typography>
          
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                <PhotoCameraIcon sx={{ mr: 1 }} />
                Photography Tips
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense disablePadding>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Use good lighting to ensure all text is clearly visible"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Avoid glare or shadows on the document"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Capture the entire document, including all edges"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Use a dark, solid background for contrast"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon sx={{ mr: 1 }} />
                Document Quality Tips
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense disablePadding>
                {mockDocumentTypeDetails.tips.map((tip, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={tip}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          
          {mockDocumentTypeDetails.examples && mockDocumentTypeDetails.examples.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Example Documents
              </Typography>
              <Grid container spacing={2}>
                {mockDocumentTypeDetails.examples.map((example, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      <Typography variant="body2" gutterBottom>
                        {example.title}
                      </Typography>
                      <Box 
                        component="img"
                        src={example.url || '/placeholder-document.png'}
                        alt={example.title}
                        sx={{ 
                          maxWidth: '100%', 
                          maxHeight: 150,
                          objectFit: 'contain',
                          mb: 1
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" align="center">
                        {example.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Checklist
          </Typography>
          <List>
            {getStepChecklistItems(3).map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={!!checkedItems[`3-${item.id}`]}
                    onChange={() => handleToggleChecklist(`3-${item.id}`)}
                    inputProps={{ 'aria-labelledby': `checkbox-list-label-${item.id}` }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={`checkbox-list-label-${item.id}`}
                  primary={item.label}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )
    }
  ];
  
  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Handle preparation completion
  const handleComplete = () => {
    onComplete();
  };
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {mockDocumentTypeDetails.name} Preparation Guide
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
                
                <Box sx={{ mb: 2, mt: 3 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleComplete : handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={!isStepComplete(index)}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={onCancel}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preparation Complete!
            </Typography>
            <Typography variant="body2" paragraph>
              You have completed the preparation guide for {mockDocumentTypeDetails.name}. You are now ready to upload your document.
            </Typography>
            <Button onClick={onCancel} sx={{ mt: 1, mr: 1 }}>
              Close
            </Button>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

// Checkbox component for the checklist
const Checkbox = ({ checked, onChange, inputProps }) => {
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
        cursor: 'pointer'
      }}
      onClick={onChange}
    >
      {checked && <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />}
    </Box>
  );
};

GuidedDocumentPreparation.propTypes = {
  documentType: PropTypes.string.isRequired,
  documentTypeDetails: PropTypes.object,
  countryCode: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default GuidedDocumentPreparation;
