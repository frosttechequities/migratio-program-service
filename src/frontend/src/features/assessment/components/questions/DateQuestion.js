import React from 'react';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

/**
 * DateQuestion component
 * A component for displaying date input questions
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Date value (YYYY-MM-DD)
 * @param {Function} props.onChange - Function to call when value changes
 * @param {string} props.helperText - Helper text
 * @param {Object} props.validation - Validation rules
 * @param {string} props.minDate - Minimum date
 * @param {string} props.maxDate - Maximum date
 * @returns {React.ReactElement} DateQuestion component
 */
const DateQuestion = ({
  value = '',
  onChange,
  helperText = '',
  validation = {},
  minDate = '',
  maxDate = ''
}) => {
  const theme = useTheme();

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
        type="date"
        variant="outlined"
        value={value || ''}
        onChange={handleChange}
        helperText={helperText}
        inputProps={{
          min: minDate,
          max: maxDate
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CalendarTodayIcon color="primary" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear date"
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
      
      {validation.minDate && validation.maxDate && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1 }}
        >
          Please select a date between {new Date(validation.minDate).toLocaleDateString()} and {new Date(validation.maxDate).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
};

export default DateQuestion;
