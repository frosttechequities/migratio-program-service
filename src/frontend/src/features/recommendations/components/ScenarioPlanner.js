import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { simulateScenario, selectSimulationResults, selectSimulationLoading, selectRecommendationsError, selectProgramRecommendations } from '../recommendationSlice';
import RecommendationSummaryWidget from '../../dashboard/components/RecommendationSummaryWidget'; // Reuse for display

// Basic list of fields that might be simulated (extend as needed)
const simulatableFields = [
    { key: 'financialInformation.annualIncome', label: 'Annual Income', type: 'number' },
    { key: 'languageProficiency.english.ielts', label: 'IELTS Score (Overall)', type: 'number', nestedPath: ['languageProficiency', 0, 'formalTest', 'results', 'overall'] }, // Example for nested path - needs robust handling
    { key: 'education.highestLevel', label: 'Highest Education Level', type: 'select', options: ['bachelor', 'master', 'doctorate'] }, // Example select
    // Add more fields like age, work experience years, etc.
];

const ScenarioPlanner = () => {
  const dispatch = useDispatch();
  const [selectedField, setSelectedField] = useState('');
  const [newValue, setNewValue] = useState('');
  const simulationResults = useSelector(selectSimulationResults);
  const isLoading = useSelector(selectSimulationLoading);
  const error = useSelector(selectRecommendationsError); // Use shared error state for now
  const originalRecommendations = useSelector(selectProgramRecommendations); // Get original recommendations for comparison

  const handleSimulate = () => {
    if (!selectedField || newValue === '') {
      // Basic validation
      alert('Please select a field and enter a new value.');
      return;
    }

    // Construct the profileChanges object based on selectedField and newValue
    // This needs robust logic to handle nested paths correctly.
    // Simple V1: Assume top-level or handle specific cases like IELTS example
    let profileChanges = {};
    const fieldConfig = simulatableFields.find(f => f.key === selectedField);

    if (fieldConfig?.nestedPath) {
        // Basic nested path handling (assumes structure exists) - Needs improvement
        let currentLevel = profileChanges;
        fieldConfig.nestedPath.forEach((level, index) => {
            if (index === fieldConfig.nestedPath.length - 1) {
                currentLevel[level] = fieldConfig.type === 'number' ? Number(newValue) : newValue;
            } else {
                currentLevel[level] = currentLevel[level] || (Array.isArray(currentLevel[level]) ? [] : {}); // Create intermediate levels if they don't exist
                currentLevel = currentLevel[level];
                 // This basic logic won't work well for arrays (like languageProficiency) without knowing which element to update.
                 // Needs refinement based on actual profile structure and how changes are applied.
                 // For now, this example might only work for non-array nested paths.
                 console.warn("Nested array path simulation is complex and may not work correctly with this basic logic.");
            }
        });
         // Temporary fix for IELTS example (assuming first language entry is English)
         if (selectedField === 'languageProficiency.english.ielts') {
             profileChanges = { languageProficiency: [ { formalTest: { results: { overall: Number(newValue) } } } ] };
             console.warn("Applying simplified IELTS update logic.");
         }

    } else if (selectedField.includes('.')) {
         // Simple dot notation for one level deep
         const [section, field] = selectedField.split('.');
         profileChanges[section] = { [field]: fieldConfig.type === 'number' ? Number(newValue) : newValue };
    }
     else {
        // Top-level field (unlikely for profile data)
        profileChanges[selectedField] = fieldConfig.type === 'number' ? Number(newValue) : newValue;
    }


    console.log("Dispatching simulation with changes:", profileChanges);
    dispatch(simulateScenario(profileChanges));
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>What-If Scenario Planner</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        See how potential changes to your profile might affect your top recommendations. (V1 - Limited Fields)
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth size="small">
            <InputLabel id="scenario-field-label">Field to Change</InputLabel>
            <Select
              labelId="scenario-field-label"
              value={selectedField}
              label="Field to Change"
              onChange={(e) => setSelectedField(e.target.value)}
            >
              <MenuItem value="" disabled><em>Select Field</em></MenuItem>
              {simulatableFields.map(field => (
                <MenuItem key={field.key} value={field.key}>{field.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={5}>
           {/* TODO: Render appropriate input based on field type */}
           <TextField
             label="New Value"
             variant="outlined"
             fullWidth
             size="small"
             value={newValue}
             onChange={(e) => setNewValue(e.target.value)}
             type={simulatableFields.find(f => f.key === selectedField)?.type === 'number' ? 'number' : 'text'}
             disabled={!selectedField}
           />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            onClick={handleSimulate}
            disabled={isLoading || !selectedField || newValue === ''}
            fullWidth
          >
            {isLoading ? <CircularProgress size={24} /> : 'Simulate'}
          </Button>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Simulation failed: {error}</Alert>}

      {simulationResults && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>Simulation Results:</Typography>
          {/* Display comparison - Use RecommendationSummaryWidget? Or a simpler list? */}
          {/* For simplicity, just show the new list */}
           <RecommendationSummaryWidget recommendations={simulationResults.simulatedRecommendations || []} />
           {/* TODO: Add comparison logic vs originalRecommendations */}
        </Box>
      )}
    </Paper>
  );
};

export default ScenarioPlanner;
