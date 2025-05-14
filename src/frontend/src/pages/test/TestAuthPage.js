import React from 'react';
import { Container, Paper } from '@mui/material';
import Layout from '../../components/layout/Layout';
import TestComponent from './TestComponent';

/**
 * Test page to verify authentication
 */
const TestAuthPage = () => {
  return (
    <Layout title="Test Authentication">
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 0 }}>
          <TestComponent />
        </Paper>
      </Container>
    </Layout>
  );
};

export default TestAuthPage;
