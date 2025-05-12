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
 * A component for displaying single choice questions
 *
 * @param {Object} props - Component props
 * @param {Array} props.options - Array of options
 * @param {string|number} props.value - Selected value
 * @param {Function} props.onChange - Function to call when value changes
 * @returns {React.ReactElement} SingleChoiceQuestion component
 */
const SingleChoiceQuestion = ({ options = [], value, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <RadioGroup
        value={value || ''}
        onChange={handleChange}
        sx={{ width: '100%' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {options.map((option) => (
            <Paper
              key={option.value}
              elevation={value === option.value ? 2 : 0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: value === option.value ? 'primary.main' : 'divider',
                backgroundColor: value === option.value ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: value === option.value ? 'primary.main' : 'primary.light',
                  backgroundColor: value === option.value
                    ? alpha(theme.palette.primary.main, 0.05)
                    : alpha(theme.palette.primary.main, 0.02),
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                },
              }}
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
                  padding: 1,
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
