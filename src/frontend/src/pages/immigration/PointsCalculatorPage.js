import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';

/**
 * Simplified Points calculator page component for testing
 * @returns {React.ReactNode} Points calculator page component
 */
const PointsCalculatorPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Immigration Points Calculator
      </Typography>

      <Typography variant="body1" paragraph>
        This is a simplified test page to verify content display.
      </Typography>

      <Paper sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'info.light' }}>
        <Typography variant="h6" color="white" gutterBottom>
          Test Content
        </Typography>
        <Typography variant="body1" color="white">
          If you can see this text, the Points Calculator page is rendering correctly.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Canada Express Entry
              </Typography>
              <Typography variant="body2" paragraph>
                Maximum Points: 1200
              </Typography>
              <Typography variant="body2" paragraph>
                Passing Score: 470
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">
                The Comprehensive Ranking System (CRS) is used to score Express Entry profiles.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Australia Skilled Independent Visa
              </Typography>
              <Typography variant="body2" paragraph>
                Maximum Points: 100
              </Typography>
              <Typography variant="body2" paragraph>
                Passing Score: 65
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">
                The Points Test is used to assess eligibility for skilled migration to Australia.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PointsCalculatorPage;
