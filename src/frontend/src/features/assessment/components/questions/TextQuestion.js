import React from 'react';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * TextQuestion component
 * A component for displaying text input questions
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Function to call when value changes
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.helperText - Helper text
 * @param {boolean} props.multiline - Whether the input should be multiline
 * @param {number} props.rows - Number of rows for multiline input
 * @param {Object} props.validation - Validation rules
 * @returns {React.ReactElement} TextQuestion component
 */
const TextQuestion = ({
  value = '',
  onChange,
  placeholder = 'Type your answer here...',
  helperText = '',
  multiline = false,
  rows = 4,
  validation = {}
}) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        multiline={multiline}
        rows={multiline ? rows : 1}
        helperText={helperText}
        InputProps={{
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear input"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
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
          {value ? value.length : 0} / {validation.maxLength} characters
        </Typography>
      )}
    </Box>
  );
};

export default TextQuestion;
