import React from 'react';
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';

/**
 * SingleChoiceQuestion component
 * A component for displaying single choice questions with enhanced visual design
 *
 * @param {Object} props - Component props
 * @param {Array} props.options - Array of options
 * @param {string|number} props.value - Selected value
 * @param {Function} props.onChange - Function to call when value changes
 * @param {string} props.helperText - Helper text to display below the options
 * @returns {React.ReactElement} SingleChoiceQuestion component
 */
const SingleChoiceQuestion = ({ options = [], value, onChange, helperText }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  // If no options are provided, show a message
  if (!options || options.length === 0) {
    return (
      <Typography color="error">
        No options available for this question.
      </Typography>
    );
  }

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      {helperText && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {helperText}
        </Typography>
      )}

      <RadioGroup
        value={value || ''}
        onChange={handleChange}
        sx={{ width: '100%' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {options.map((option) => (
            <Paper
              key={option.value}
              elevation={value === option.value ? 3 : 0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: value === option.value ? 'primary.main' : 'divider',
                backgroundColor: value === option.value ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: value === option.value ? 'primary.main' : 'primary.light',
                  backgroundColor: value === option.value
                    ? alpha(theme.palette.primary.main, 0.08)
                    : alpha(theme.palette.primary.main, 0.02),
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
              onClick={() => onChange(option.value)}
            >
              <FormControlLabel
                value={option.value}
                control={
                  <Radio
                    color="primary"
                    sx={{
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ py: 1 }}>
                    <Typography variant="body1" fontWeight={value === option.value ? 600 : 400}>
                      {option.label}
                    </Typography>
                    {option.helpText && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {option.helpText}
                      </Typography>
                    )}
                  </Box>
                }
                sx={{
                  margin: 0,
                  width: '100%',
                  padding: 1.5,
                  '& .MuiFormControlLabel-label': {
                    width: '100%',
                  },
                }}
              />
            </Paper>
          ))}
        </Box>
      </RadioGroup>
    </FormControl>
  );
};

export default SingleChoiceQuestion;
