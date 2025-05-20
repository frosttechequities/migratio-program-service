import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

/**
 * RecommendationFilters component
 * Provides filtering options for immigration program recommendations
 * 
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Callback for filter changes
 * @param {Function} props.onSavePreset - Callback for saving filter presets
 * @param {Function} props.onLoadPreset - Callback for loading filter presets
 * @param {Array} props.savedPresets - Array of saved filter presets
 * @param {Array} props.availableCountries - Array of available countries for filtering
 * @param {Array} props.availableProgramTypes - Array of available program types for filtering
 * @returns {React.ReactElement} RecommendationFilters component
 */
const RecommendationFilters = ({ 
  filters = {}, 
  onFilterChange = () => {}, 
  onSavePreset = () => {}, 
  onLoadPreset = () => {},
  savedPresets = [],
  availableCountries = [],
  availableProgramTypes = []
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [presetName, setPresetName] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);
  
  // Default filter values
  const defaultFilters = {
    successProbability: [0, 100],
    processingTime: [0, 60], // in months
    costRange: [0, 100000], // in USD
    countries: [],
    programTypes: [],
    languageRequirements: [],
    educationRequirements: [],
    workExperienceRequired: null,
    investmentRequired: null,
    savedOnly: false
  };
  
  // Initialize local filter state
  const [localFilters, setLocalFilters] = useState({
    ...defaultFilters,
    ...filters
  });
  
  // Update active filters count when filters change
  useEffect(() => {
    let count = 0;
    
    // Count non-default filters
    if (localFilters.successProbability[0] > defaultFilters.successProbability[0] || 
        localFilters.successProbability[1] < defaultFilters.successProbability[1]) {
      count++;
    }
    
    if (localFilters.processingTime[0] > defaultFilters.processingTime[0] || 
        localFilters.processingTime[1] < defaultFilters.processingTime[1]) {
      count++;
    }
    
    if (localFilters.costRange[0] > defaultFilters.costRange[0] || 
        localFilters.costRange[1] < defaultFilters.costRange[1]) {
      count++;
    }
    
    if (localFilters.countries.length > 0) count++;
    if (localFilters.programTypes.length > 0) count++;
    if (localFilters.languageRequirements.length > 0) count++;
    if (localFilters.educationRequirements.length > 0) count++;
    if (localFilters.workExperienceRequired !== null) count++;
    if (localFilters.investmentRequired !== null) count++;
    if (localFilters.savedOnly) count++;
    
    setActiveFilters(count);
  }, [localFilters]);
  
  // Handle accordion expansion
  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };
  
  // Handle slider change
  const handleSliderChange = (name) => (event, newValue) => {
    setLocalFilters({
      ...localFilters,
      [name]: newValue
    });
  };
  
  // Handle slider change commit (when user releases slider)
  const handleSliderChangeCommitted = (name) => (event, newValue) => {
    onFilterChange({
      ...localFilters,
      [name]: newValue
    });
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (name, value) => (event) => {
    const checked = event.target.checked;
    let newValues;
    
    if (checked) {
      // Add value to array
      newValues = [...localFilters[name], value];
    } else {
      // Remove value from array
      newValues = localFilters[name].filter(item => item !== value);
    }
    
    const newFilters = {
      ...localFilters,
      [name]: newValues
    };
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Handle boolean filter change
  const handleBooleanFilterChange = (name) => (event) => {
    const newValue = event.target.checked ? true : null;
    
    const newFilters = {
      ...localFilters,
      [name]: newValue
    };
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Handle saved only filter change
  const handleSavedOnlyChange = (event) => {
    const newFilters = {
      ...localFilters,
      savedOnly: event.target.checked
    };
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };
  
  // Apply current filters
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setExpanded(false);
  };
  
  // Handle preset name change
  const handlePresetNameChange = (event) => {
    setPresetName(event.target.value);
  };
  
  // Save current filters as preset
  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset({
        name: presetName.trim(),
        filters: localFilters
      });
      setPresetName('');
      setShowPresetInput(false);
    }
  };
  
  // Load a saved preset
  const handleLoadPreset = (preset) => {
    setLocalFilters(preset.filters);
    onFilterChange(preset.filters);
  };
  
  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format processing time for display
  const formatProcessingTime = (months) => {
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  };
  
  // Available language requirements
  const languageOptions = [
    { value: 'none', label: 'None' },
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'fluent', label: 'Fluent' }
  ];
  
  // Available education requirements
  const educationOptions = [
    { value: 'none', label: 'None' },
    { value: 'high_school', label: 'High School' },
    { value: 'associates', label: 'Associate\'s Degree' },
    { value: 'bachelors', label: 'Bachelor\'s Degree' },
    { value: 'masters', label: 'Master\'s Degree' },
    { value: 'doctorate', label: 'Doctorate' }
  ];
  
  return (
    <Paper sx={{ mb: 3 }}>
      <Accordion expanded={expanded} onChange={handleAccordionChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-panel-content"
          id="filter-panel-header"
          sx={{ 
            borderBottom: expanded ? `1px solid ${theme.palette.divider}` : 'none'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Typography variant="subtitle1">Filters</Typography>
              {activeFilters > 0 && (
                <Chip 
                  label={activeFilters} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            
            {!expanded && activeFilters > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {localFilters.savedOnly && (
                  <Chip 
                    label="Saved Only" 
                    size="small" 
                    onDelete={() => {
                      const newFilters = { ...localFilters, savedOnly: false };
                      setLocalFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                  />
                )}
                
                {localFilters.countries.length > 0 && (
                  <Chip 
                    label={`${localFilters.countries.length} Countries`} 
                    size="small" 
                    onDelete={() => {
                      const newFilters = { ...localFilters, countries: [] };
                      setLocalFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                  />
                )}
                
                {(localFilters.successProbability[0] > defaultFilters.successProbability[0] || 
                  localFilters.successProbability[1] < defaultFilters.successProbability[1]) && (
                  <Chip 
                    label={`Success: ${localFilters.successProbability[0]}%-${localFilters.successProbability[1]}%`} 
                    size="small" 
                    onDelete={() => {
                      const newFilters = { ...localFilters, successProbability: defaultFilters.successProbability };
                      setLocalFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                  />
                )}
                
                {/* More filter chips can be added here */}
                
                <Chip 
                  label="Clear All" 
                  size="small" 
                  color="secondary"
                  onClick={handleResetFilters}
                />
              </Box>
            )}
          </Box>
        </AccordionSummary>
        
        <AccordionDetails sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Success Probability Filter */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Success Probability
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={localFilters.successProbability}
                  onChange={handleSliderChange('successProbability')}
                  onChangeCommitted={handleSliderChangeCommitted('successProbability')}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Box>
            </Box>
            
            {/* Processing Time Filter */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Processing Time
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={localFilters.processingTime}
                  onChange={handleSliderChange('processingTime')}
                  onChangeCommitted={handleSliderChangeCommitted('processingTime')}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => formatProcessingTime(value)}
                  min={0}
                  max={60}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 12, label: '1yr' },
                    { value: 24, label: '2yr' },
                    { value: 36, label: '3yr' },
                    { value: 60, label: '5yr' }
                  ]}
                />
              </Box>
            </Box>
            
            {/* Cost Range Filter */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Cost Range
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={localFilters.costRange}
                  onChange={handleSliderChange('costRange')}
                  onChangeCommitted={handleSliderChangeCommitted('costRange')}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => formatCurrency(value)}
                  min={0}
                  max={100000}
                  step={1000}
                  marks={[
                    { value: 0, label: '$0' },
                    { value: 25000, label: '$25k' },
                    { value: 50000, label: '$50k' },
                    { value: 75000, label: '$75k' },
                    { value: 100000, label: '$100k' }
                  ]}
                />
              </Box>
            </Box>
            
            <Divider />
            
            {/* Country Filter */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Countries
              </Typography>
              <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {availableCountries.map((country) => (
                  <FormControlLabel
                    key={country.value}
                    control={
                      <Checkbox
                        checked={localFilters.countries.includes(country.value)}
                        onChange={handleCheckboxChange('countries', country.value)}
                        size="small"
                      />
                    }
                    label={country.label}
                    sx={{ width: '33%', minWidth: 150 }}
                  />
                ))}
              </FormGroup>
            </Box>
            
            {/* Program Type Filter */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Program Types
              </Typography>
              <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {availableProgramTypes.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    control={
                      <Checkbox
                        checked={localFilters.programTypes.includes(type.value)}
                        onChange={handleCheckboxChange('programTypes', type.value)}
                        size="small"
                      />
                    }
                    label={type.label}
                    sx={{ width: '50%', minWidth: 200 }}
                  />
                ))}
              </FormGroup>
            </Box>
            
            <Divider />
            
            {/* Language Requirements Filter */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Language Requirements
              </Typography>
              <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {languageOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={localFilters.languageRequirements.includes(option.value)}
                        onChange={handleCheckboxChange('languageRequirements', option.value)}
                        size="small"
                      />
                    }
                    label={option.label}
                    sx={{ width: '33%', minWidth: 120 }}
                  />
                ))}
              </FormGroup>
            </Box>
            
            {/* Education Requirements Filter */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Education Requirements
              </Typography>
              <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {educationOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={localFilters.educationRequirements.includes(option.value)}
                        onChange={handleCheckboxChange('educationRequirements', option.value)}
                        size="small"
                      />
                    }
                    label={option.label}
                    sx={{ width: '33%', minWidth: 150 }}
                  />
                ))}
              </FormGroup>
            </Box>
            
            <Divider />
            
            {/* Additional Filters */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Additional Filters
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFilters.workExperienceRequired === true}
                      onChange={handleBooleanFilterChange('workExperienceRequired')}
                      size="small"
                    />
                  }
                  label="Work Experience Required"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFilters.investmentRequired === true}
                      onChange={handleBooleanFilterChange('investmentRequired')}
                      size="small"
                    />
                  }
                  label="Investment Required"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFilters.savedOnly}
                      onChange={handleSavedOnlyChange}
                      size="small"
                    />
                  }
                  label="Saved Programs Only"
                />
              </FormGroup>
            </Box>
            
            <Divider />
            
            {/* Filter Presets */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Filter Presets
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {savedPresets.map((preset, index) => (
                  <Chip
                    key={index}
                    label={preset.name}
                    onClick={() => handleLoadPreset(preset)}
                    onDelete={() => {/* TODO: Implement delete preset */}}
                    icon={<BookmarkIcon />}
                  />
                ))}
                {savedPresets.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No saved presets
                  </Typography>
                )}
              </Box>
              
              {showPresetInput ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Preset Name"
                    value={presetName}
                    onChange={handlePresetNameChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BookmarkBorderIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={handleSavePreset}
                    disabled={!presetName.trim()}
                  >
                    Save
                  </Button>
                  <IconButton size="small" onClick={() => setShowPresetInput(false)}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={() => setShowPresetInput(true)}
                >
                  Save Current Filters
                </Button>
              )}
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={handleResetFilters}
              >
                Reset All
              </Button>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

RecommendationFilters.propTypes = {
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  onSavePreset: PropTypes.func,
  onLoadPreset: PropTypes.func,
  savedPresets: PropTypes.array,
  availableCountries: PropTypes.array,
  availableProgramTypes: PropTypes.array
};

export default RecommendationFilters;
