import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Slider,
  Chip,
  TextField,
  Autocomplete,
  Radio,
  RadioGroup,
  Divider,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import {
  updateDisplayPreferences,
  updateContentPreferences,
  resetPreferences,
  saveUserPreferences,
  selectUserPreferences,
  selectDisplayPreferences,
  selectContentPreferences,
  selectPersonalizationLoading,
  selectPersonalizationError
} from '../personalizationSlice';
import personalizationService from '../services/personalizationService';

/**
 * UserPreferencesForm component
 * Form for managing user preferences
 * 
 * @returns {React.ReactElement} UserPreferencesForm component
 */
const UserPreferencesForm = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  // Get state from Redux
  const userPreferences = useSelector(selectUserPreferences);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const contentPreferences = useSelector(selectContentPreferences);
  const isLoading = useSelector(selectPersonalizationLoading);
  const error = useSelector(selectPersonalizationError);
  
  // Component state
  const [activeTab, setActiveTab] = useState(0);
  const [formValues, setFormValues] = useState({
    display: { ...displayPreferences },
    content: { ...contentPreferences }
  });
  
  // Available options
  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System Default' }
  ];
  
  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];
  
  const densityOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'spacious', label: 'Spacious' }
  ];
  
  const colorAccentOptions = [
    { value: 'blue', label: 'Blue', color: theme.palette.primary.main },
    { value: 'purple', label: 'Purple', color: theme.palette.purple.main },
    { value: 'green', label: 'Green', color: theme.palette.success.main },
    { value: 'orange', label: 'Orange', color: theme.palette.warning.main }
  ];
  
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'zh', label: 'Chinese' }
  ];
  
  const expertiseLevelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];
  
  const dashboardFocusOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'planning', label: 'Planning' },
    { value: 'application', label: 'Application' },
    { value: 'settlement', label: 'Settlement' }
  ];
  
  const topicOptions = [
    { value: 'work-visas', label: 'Work Visas' },
    { value: 'study-permits', label: 'Study Permits' },
    { value: 'family-sponsorship', label: 'Family Sponsorship' },
    { value: 'express-entry', label: 'Express Entry' },
    { value: 'provincial-nominees', label: 'Provincial Nominees' },
    { value: 'language-requirements', label: 'Language Requirements' },
    { value: 'document-preparation', label: 'Document Preparation' },
    { value: 'settlement-services', label: 'Settlement Services' }
  ];
  
  const countryOptions = [
    { value: 'CA', label: 'Canada' },
    { value: 'US', label: 'United States' },
    { value: 'AU', label: 'Australia' },
    { value: 'NZ', label: 'New Zealand' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'SG', label: 'Singapore' }
  ];
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle form value changes
  const handleDisplayChange = (field, value) => {
    setFormValues({
      ...formValues,
      display: {
        ...formValues.display,
        [field]: value
      }
    });
  };
  
  const handleContentChange = (field, value) => {
    setFormValues({
      ...formValues,
      content: {
        ...formValues.content,
        [field]: value
      }
    });
  };
  
  // Apply display changes
  const applyDisplayChanges = () => {
    dispatch(updateDisplayPreferences(formValues.display));
    personalizationService.applyThemePreferences(formValues.display);
  };
  
  // Apply content changes
  const applyContentChanges = () => {
    dispatch(updateContentPreferences(formValues.content));
  };
  
  // Save all preferences
  const saveAllPreferences = () => {
    dispatch(saveUserPreferences({
      ...userPreferences,
      display: formValues.display,
      content: formValues.content
    }));
    personalizationService.applyThemePreferences(formValues.display);
  };
  
  // Reset preferences
  const resetAllPreferences = () => {
    dispatch(resetPreferences());
    setFormValues({
      display: { ...displayPreferences },
      content: { ...contentPreferences }
    });
  };
  
  // Update form values when preferences change
  useEffect(() => {
    setFormValues({
      display: { ...displayPreferences },
      content: { ...contentPreferences }
    });
  }, [displayPreferences, contentPreferences]);
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        User Preferences
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="user preferences tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="Display" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Content" id="tab-1" aria-controls="tabpanel-1" />
      </Tabs>
      
      {/* Display Tab */}
      <Box
        role="tabpanel"
        hidden={activeTab !== 0}
        id="tabpanel-0"
        aria-labelledby="tab-0"
      >
        {activeTab === 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Theme Settings
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="theme-select-label">Theme</InputLabel>
              <Select
                labelId="theme-select-label"
                id="theme-select"
                value={formValues.display.theme}
                label="Theme"
                onChange={(e) => handleDisplayChange('theme', e.target.value)}
              >
                {themeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="font-size-select-label">Font Size</InputLabel>
              <Select
                labelId="font-size-select-label"
                id="font-size-select"
                value={formValues.display.fontSize}
                label="Font Size"
                onChange={(e) => handleDisplayChange('fontSize', e.target.value)}
              >
                {fontSizeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="density-select-label">Layout Density</InputLabel>
              <Select
                labelId="density-select-label"
                id="density-select"
                value={formValues.display.density}
                label="Layout Density"
                onChange={(e) => handleDisplayChange('density', e.target.value)}
              >
                {densityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Typography variant="subtitle2" gutterBottom>
              Color Accent
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {colorAccentOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  onClick={() => handleDisplayChange('colorAccent', option.value)}
                  sx={{
                    bgcolor: option.color,
                    color: 'white',
                    fontWeight: formValues.display.colorAccent === option.value ? 'bold' : 'normal',
                    border: formValues.display.colorAccent === option.value ? '2px solid white' : 'none',
                    boxShadow: formValues.display.colorAccent === option.value ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none'
                  }}
                />
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RefreshIcon />}
                onClick={() => setFormValues({
                  ...formValues,
                  display: { ...displayPreferences }
                })}
                sx={{ mr: 1 }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckIcon />}
                onClick={applyDisplayChanges}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Apply'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      
      {/* Content Tab */}
      <Box
        role="tabpanel"
        hidden={activeTab !== 1}
        id="tabpanel-1"
        aria-labelledby="tab-1"
      >
        {activeTab === 1 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Content Preferences
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="language-select-label">Preferred Language</InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={formValues.content.preferredLanguage}
                label="Preferred Language"
                onChange={(e) => handleContentChange('preferredLanguage', e.target.value)}
              >
                {languageOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="expertise-select-label">Expertise Level</InputLabel>
              <Select
                labelId="expertise-select-label"
                id="expertise-select"
                value={formValues.content.expertiseLevel}
                label="Expertise Level"
                onChange={(e) => handleContentChange('expertiseLevel', e.target.value)}
              >
                {expertiseLevelOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="dashboard-focus-select-label">Dashboard Focus</InputLabel>
              <Select
                labelId="dashboard-focus-select-label"
                id="dashboard-focus-select"
                value={formValues.content.dashboardFocus}
                label="Dashboard Focus"
                onChange={(e) => handleContentChange('dashboardFocus', e.target.value)}
              >
                {dashboardFocusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Autocomplete
              multiple
              id="topic-interests"
              options={topicOptions}
              getOptionLabel={(option) => option.label}
              value={topicOptions.filter(option => 
                formValues.content.topicInterests?.includes(option.value)
              )}
              onChange={(event, newValue) => {
                handleContentChange('topicInterests', newValue.map(item => item.value));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Topic Interests"
                  placeholder="Select topics"
                  margin="normal"
                />
              )}
              sx={{ mb: 2 }}
            />
            
            <Autocomplete
              multiple
              id="priority-countries"
              options={countryOptions}
              getOptionLabel={(option) => option.label}
              value={countryOptions.filter(option => 
                formValues.content.priorityCountries?.includes(option.value)
              )}
              onChange={(event, newValue) => {
                handleContentChange('priorityCountries', newValue.map(item => item.value));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Priority Countries"
                  placeholder="Select countries"
                  margin="normal"
                />
              )}
              sx={{ mb: 2 }}
            />
            
            <Typography variant="subtitle2" gutterBottom>
              AI Features
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.content.enablePredictiveAnalytics}
                    onChange={(e) => handleContentChange('enablePredictiveAnalytics', e.target.checked)}
                  />
                }
                label="Enable Predictive Analytics"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.content.enableAISuggestions}
                    onChange={(e) => handleContentChange('enableAISuggestions', e.target.checked)}
                  />
                }
                label="Enable AI Suggestions"
              />
            </FormGroup>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RefreshIcon />}
                onClick={() => setFormValues({
                  ...formValues,
                  content: { ...contentPreferences }
                })}
                sx={{ mr: 1 }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckIcon />}
                onClick={applyContentChanges}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Apply'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RefreshIcon />}
          onClick={resetAllPreferences}
        >
          Reset All
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={saveAllPreferences}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Save All Preferences'}
        </Button>
      </Box>
    </Paper>
  );
};

export default UserPreferencesForm;
