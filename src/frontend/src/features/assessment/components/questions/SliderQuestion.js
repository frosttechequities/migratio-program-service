import React from 'react';
import {
  Box,
  Slider,
  Typography,
  Grid,
  Paper,
  useTheme
} from '@mui/material';

/**
 * SliderQuestion component
 * A component for displaying slider questions
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Slider value
 * @param {Function} props.onChange - Function to call when value changes
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.step - Step value
 * @param {Array} props.marks - Marks for the slider
 * @param {string} props.minLabel - Label for minimum value
 * @param {string} props.maxLabel - Label for maximum value
 * @param {string} props.valueLabel - Label for current value
 * @returns {React.ReactElement} SliderQuestion component
 */
const SliderQuestion = ({
  value = 0,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  marks = [],
  minLabel = '',
  maxLabel = '',
  valueLabel = ''
}) => {
  const theme = useTheme();
  
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  // Generate default marks if none provided
  const defaultMarks = marks.length > 0 ? marks : [
    { value: min, label: min.toString() },
    { value: max, label: max.toString() }
  ];

  // Add min and max labels if provided
  const sliderMarks = defaultMarks.map(mark => ({
    ...mark,
    label: mark.value === min && minLabel ? minLabel : 
           mark.value === max && maxLabel ? maxLabel : 
           mark.label
  }));

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <Paper
        elevation={1}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Current value display */}
        {value !== null && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 4,
              position: 'relative',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: `8px solid ${theme.palette.primary.main}`,
                }
              }}
            >
              <Typography variant="h5" fontWeight={600} align="center">
                {valueLabel ? `${valueLabel}: ${value}` : value}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Slider */}
        <Slider
          value={value || 0}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          marks={sliderMarks}
          valueLabelDisplay="auto"
          sx={{
            color: 'primary.main',
            height: 8,
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: 'white',
              border: '2px solid currentColor',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(0, 102, 255, 0.16)',
              },
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: 'primary.main',
            },
            '& .MuiSlider-track': {
              height: 8,
              borderRadius: 4,
            },
            '& .MuiSlider-rail': {
              height: 8,
              borderRadius: 4,
              opacity: 0.5,
              backgroundColor: '#bfbfbf',
            },
            '& .MuiSlider-mark': {
              backgroundColor: '#bfbfbf',
              height: 8,
              width: 2,
              marginTop: 0,
            },
            '& .MuiSlider-markActive': {
              opacity: 1,
              backgroundColor: 'currentColor',
            },
          }}
        />

        {/* Min/Max labels */}
        {(minLabel || maxLabel) && (
          <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                {minLabel}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                {maxLabel}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default SliderQuestion;
