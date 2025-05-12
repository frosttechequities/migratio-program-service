import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup,
  Paper,
  Typography,
  useTheme,
  alpha
} from '@mui/material';

/**
 * MultipleChoiceQuestion component
 * A component for displaying multiple choice questions
 * 
 * @param {Object} props - Component props
 * @param {Array} props.options - Array of options
 * @param {Array} props.value - Array of selected values
 * @param {Function} props.onChange - Function to call when value changes
 * @returns {React.ReactElement} MultipleChoiceQuestion component
 */
const MultipleChoiceQuestion = ({ options = [], value = [], onChange }) => {
  const theme = useTheme();

  const handleChange = (optionValue) => {
    const newValue = [...(value || [])];
    const index = newValue.indexOf(optionValue);
    
    if (index === -1) {
      newValue.push(optionValue);
    } else {
      newValue.splice(index, 1);
    }
    
    onChange(newValue);
  };

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <FormGroup>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {options.map((option) => {
            const isSelected = value && value.includes(option.value);
            
            return (
              <Paper
                key={option.value}
                elevation={isSelected ? 2 : 0}
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: isSelected ? 'primary.main' : 'primary.light',
                    backgroundColor: isSelected 
                      ? alpha(theme.palette.primary.main, 0.05) 
                      : alpha(theme.palette.primary.main, 0.02),
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleChange(option.value)}
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
                      <Typography variant="body1" fontWeight={isSelected ? 600 : 400}>
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
            );
          })}
        </Box>
      </FormGroup>
    </FormControl>
  );
};

export default MultipleChoiceQuestion;
