import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Box, Typography, Paper } from '@mui/material';
import PDFGenerator from '../../features/pdf/components/PDFGenerator';

/**
 * GeneratePDFPage component
 * Page for generating PDF documents
 * 
 * @returns {React.ReactElement} GeneratePDFPage component
 */
const GeneratePDFPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Check if user is logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/pdf/generate' } });
    }
  }, [user, navigate]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Generate Documents
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create professional PDF documents for your immigration journey.
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
        <PDFGenerator />
      </Paper>
    </Container>
  );
};

export default GeneratePDFPage;
