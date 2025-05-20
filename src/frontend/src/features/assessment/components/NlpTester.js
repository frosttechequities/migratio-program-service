import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Chip, Divider, Alert } from '@mui/material';
import assessmentService from '../assessmentService';

/**
 * NLP Tester component
 * A simple component to test the NLP service
 */
const NlpTester = () => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [serviceStatus, setServiceStatus] = useState('checking');

  // Check if the NLP service is available when the component loads
  useEffect(() => {
    const checkServiceStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
          setServiceStatus('available');
          console.log('NLP service is available');
        } else {
          setServiceStatus('unavailable');
          console.error('NLP service health check failed:', response.status, response.statusText);
        }
      } catch (err) {
        setServiceStatus('unavailable');
        console.error('NLP service health check error:', err);
      }
    };

    checkServiceStatus();
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Sending request to NLP service...');

      // Use fetch with better error handling
      try {
        const response = await fetch('http://localhost:8000/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, questionId: 'nlp-q1' }),
        });

        console.log('NLP service response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('NLP service response data:', data);
          setResults(data);
        } else {
          const errorText = await response.text().catch(() => 'Unknown error');
          console.error('NLP service error:', response.status, errorText);
          setError(`NLP service error: ${response.status} ${response.statusText}`);
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        setError(`Network error: ${fetchError.message}. Make sure the NLP service is running at http://localhost:8000`);
      }
    } catch (err) {
      console.error('Error in handleAnalyze:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>NLP Service Tester</Typography>

      {/* Service Status Indicator */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          NLP Service Status:
        </Typography>
        {serviceStatus === 'checking' && (
          <Chip
            label="Checking..."
            color="default"
            size="small"
            icon={<CircularProgress size={16} />}
          />
        )}
        {serviceStatus === 'available' && (
          <Chip
            label="Available"
            color="success"
            size="small"
          />
        )}
        {serviceStatus === 'unavailable' && (
          <Chip
            label="Unavailable"
            color="error"
            size="small"
          />
        )}
      </Box>

      {serviceStatus === 'unavailable' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          The NLP service is not available. Make sure it's running at http://localhost:8000
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" paragraph>
        Enter some text to test the NLP service. The service will analyze the text and return entities, sentiment, and keywords.
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={5}
        variant="outlined"
        label="Enter text to analyze"
        placeholder="I want to immigrate to Canada to work in the tech industry as a software engineer. I have 5 years of experience in web development."
        value={text}
        onChange={handleTextChange}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleAnalyze}
        disabled={isProcessing || !text.trim() || serviceStatus !== 'available'}
        sx={{ mb: 3 }}
      >
        {isProcessing ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
        Analyze Text
      </Button>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#FFF4F4', color: 'error.main' }}>
          <Typography variant="subtitle2">Error</Typography>
          <Typography variant="body2">{error}</Typography>
        </Paper>
      )}

      {results && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Analysis Results</Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Sentiment</Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {results.sentiment}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Extracted Entities</Typography>
            {results.extractedEntities && results.extractedEntities.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {results.extractedEntities.map((entity, index) => (
                  <Chip
                    key={index}
                    label={`${entity.text} (${entity.label})`}
                    color={entity.label === 'LOCATION' ? 'primary' : 'default'}
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No entities found</Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Keywords</Typography>
            {results.keywords && results.keywords.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {results.keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword.text}
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No keywords found</Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="caption" color="text.secondary">
              Confidence: {Math.round(results.confidence * 100)}%
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default NlpTester;
