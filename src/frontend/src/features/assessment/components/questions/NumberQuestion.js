import React from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment } from '@mui/material';

/**
 * Number input question component
 */
const NumberQuestion = ({ value, onChange, error, min, max, step, prefix, suffix }) => {
  const handleChange = (e) => {
    const newValue = e.target.value === '' ? '' : Number(e.target.value);
    onChange(newValue);
  };
  
  return (
    <TextField
      type="number"
      value={value === null || value === undefined ? '' : value}
      onChange={handleChange}
      fullWidth
      variant="outlined"
      error={!!error}
      helperText={error}
      inputProps={{
        min: min,
        max: max,
        step: step || 1
      }}
      InputProps={{
        startAdornment: prefix ? (
          <InputAdornment position="start">{prefix}</InputAdornment>
        ) : null,
        endAdornment: suffix ? (
          <InputAdornment position="end">{suffix}</InputAdornment>
        ) : null
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main'
          }
        }
      }}
    />
  );
};

NumberQuestion.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string
};

export default NumberQuestion;
