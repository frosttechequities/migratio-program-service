import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  Paper,
  Collapse
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

/**
 * TextQuestion component
 * A component for displaying text input questions with optional NLP processing
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Function to call when value changes
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.helperText - Helper text
 * @param {boolean} props.multiline - Whether the input should be multiline
 * @param {number} props.rows - Number of rows for multiline input
 * @param {Object} props.validation - Validation rules
 * @param {boolean} props.enableNlp - Whether to enable NLP processing
 * @param {Object} props.nlpResults - NLP processing results
 * @param {boolean} props.isProcessingNlp - Whether NLP processing is in progress
 * @param {Function} props.onNlpRequest - Function to call to request NLP processing
 * @returns {React.ReactElement} TextQuestion component
 */
const TextQuestion = ({
  value = '',
  onChange,
  placeholder = 'Type your answer here...',
  helperText = '',
  multiline = false,
  rows = 4,
  validation = {},
  enableNlp = false,
  nlpResults = null,
  isProcessingNlp = false,
  onNlpRequest = null
}) => {
  const [showNlpResults, setShowNlpResults] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    onChange(newValue);

    // We'll let the user trigger NLP analysis manually by clicking the prompt
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const toggleNlpResults = () => {
    setShowNlpResults(!showNlpResults);
  };

  // Render NLP results if available
  const renderNlpResults = () => {
    if (!nlpResults) return null;

    const { extractedEntities, keywords, sentiment, confidence } = nlpResults;

    return (
      <Collapse in={showNlpResults}>
        <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle2" gutterBottom>
            Analysis Results
          </Typography>

          {extractedEntities && extractedEntities.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Extracted Entities:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {extractedEntities.map((entity, index) => (
                  <Chip
                    key={index}
                    label={`${entity.text} (${entity.label})`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </>
          )}

          {keywords && keywords.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Keywords:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword.text}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Sentiment: {sentiment}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confidence: {Math.round(confidence * 100)}%
            </Typography>
          </Box>
        </Paper>
      </Collapse>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        value={localValue || ''}
        onChange={handleChange}
        placeholder={placeholder}
        multiline={multiline || enableNlp}
        rows={multiline || enableNlp ? rows : 1}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isProcessingNlp && (
                <CircularProgress size={20} sx={{ mr: 1 }} />
              )}
              {enableNlp && nlpResults && (
                <IconButton
                  aria-label="toggle nlp results"
                  onClick={toggleNlpResults}
                  edge="end"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  {showNlpResults ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
              {localValue ? (
                <IconButton
                  aria-label="clear input"
                  onClick={handleClear}
                  edge="end"
                  size="small"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ) : null}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.1)',
            },
          },
        }}
      />

      {validation.maxLength && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'right', mt: 1 }}
        >
          {localValue ? localValue.length : 0} / {validation.maxLength} characters
        </Typography>
      )}

      {enableNlp && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {isProcessingNlp ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={12} sx={{ mr: 1 }} />
                Analyzing your response...
              </Box>
            ) : nlpResults ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                Analysis complete. {showNlpResults ? 'Hide' : 'Show'} details.
              </Box>
            ) : (
              "Your response will be analyzed to provide better recommendations."
            )}
          </Typography>

          {!isProcessingNlp && !nlpResults && localValue && localValue.length > 20 && (
            <Box
              component="button"
              onClick={() => onNlpRequest && onNlpRequest(localValue)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                bgcolor: 'primary.main',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                py: 0.5,
                px: 1.5,
                fontSize: '0.75rem',
                fontWeight: 'medium',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&:disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled',
                }
              }}
              disabled={isProcessingNlp || !localValue || localValue.length <= 20}
            >
              Analyze Text
            </Box>
          )}
        </Box>
      )}

      {renderNlpResults()}
    </Box>
  );
};

export default TextQuestion;
