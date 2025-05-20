import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import TuneIcon from '@mui/icons-material/Tune';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RecommendIcon from '@mui/icons-material/Recommend';

// Import recommendation components
import ProgramComparisonView from '../../features/recommendations/components/ProgramComparisonView';
import RecommendationFilters from '../../features/recommendations/components/RecommendationFilters';
import ProgramInfoCard from '../../features/recommendations/components/ProgramInfoCard';
import SuccessProbabilityWidget from '../../features/recommendations/components/SuccessProbabilityWidget';
import ActionRecommendations from '../../features/recommendations/components/ActionRecommendations';

// Import recommendation slice
import {
  fetchProgramRecommendations,
  fetchSuccessProbability,
  fetchGapAnalysis,
  selectProgramRecommendations,
  selectRecommendationsLoading,
  selectRecommendationsError,
  selectSuccessProbability,
  selectGapAnalysis
} from '../../features/recommendations/recommendationSlice';

// Import profile slice
import { selectUserProfile } from '../../features/profile/profileSlice';

/**
 * RecommendationsPage component
 * Displays program recommendations with filtering, comparison, and detailed views
 *
 * @returns {React.ReactElement} RecommendationsPage component
 */
const RecommendationsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Component state
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [comparisonPrograms, setComparisonPrograms] = useState([]);
  const [filters, setFilters] = useState({
    successProbability: [0, 100],
    processingTime: [0, 60],
    costRange: [0, 100000],
    countries: [],
    programTypes: [],
    savedOnly: false
  });

  // Redux state
  const recommendations = useSelector(selectProgramRecommendations);
  const isLoading = useSelector(selectRecommendationsLoading);
  const error = useSelector(selectRecommendationsError);
  const successProbability = useSelector(selectSuccessProbability);
  const gapAnalysis = useSelector(selectGapAnalysis);
  const profile = useSelector(selectUserProfile);

  // Fetch recommendations on component mount
  useEffect(() => {
    dispatch(fetchProgramRecommendations());
  }, [dispatch]);

  // Fetch success probability and gap analysis when a program is selected
  useEffect(() => {
    if (selectedProgram) {
      dispatch(fetchSuccessProbability(selectedProgram._id));
      dispatch(fetchGapAnalysis(selectedProgram._id));
    }
  }, [dispatch, selectedProgram]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Handle program selection
  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    setActiveTab(0);
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // TODO: Implement filtering logic
    console.log('Filters updated:', newFilters);
  };

  // Handle save preset
  const handleSavePreset = (preset) => {
    // TODO: Implement save preset logic
    console.log('Preset saved:', preset);
  };

  // Handle load preset
  const handleLoadPreset = (preset) => {
    setFilters(preset.filters);
    // TODO: Implement load preset logic
    console.log('Preset loaded:', preset);
  };

  // Handle save program
  const handleSaveProgram = (programId, isSaved) => {
    // TODO: Implement save program logic
    console.log(`Program ${programId} ${isSaved ? 'saved' : 'unsaved'}`);
  };

  // Handle add to comparison
  const handleAddToComparison = (programId) => {
    const program = recommendations.find(p => p._id === programId);
    if (program && !comparisonPrograms.some(p => p._id === programId)) {
      setComparisonPrograms([...comparisonPrograms, program]);
    }
  };

  // Handle remove from comparison
  const handleRemoveFromComparison = (programId) => {
    setComparisonPrograms(comparisonPrograms.filter(p => p._id !== programId));
  };

  // Handle add action to roadmap
  const handleAddActionToRoadmap = (actionId) => {
    // TODO: Implement add action to roadmap logic
    console.log(`Action ${actionId} added to roadmap`);
  };

  // Filter programs based on current filters
  const filteredPrograms = React.useMemo(() => {
    if (!recommendations) return [];

    return recommendations.filter(program => {
      // Filter by success probability
      if (program.successProbability < filters.successProbability[0] ||
          program.successProbability > filters.successProbability[1]) {
        return false;
      }

      // Filter by processing time
      const processingTime = program.estimatedProcessingTime?.average ||
                            (program.estimatedProcessingTime?.min + program.estimatedProcessingTime?.max) / 2 ||
                            12; // Default to 12 months if not specified
      if (processingTime < filters.processingTime[0] || processingTime > filters.processingTime[1]) {
        return false;
      }

      // Filter by cost
      const cost = program.estimatedCost?.average ||
                  (program.estimatedCost?.min + program.estimatedCost?.max) / 2 ||
                  5000; // Default to $5000 if not specified
      if (cost < filters.costRange[0] || cost > filters.costRange[1]) {
        return false;
      }

      // Filter by countries
      if (filters.countries.length > 0 && !filters.countries.includes(program.countryId)) {
        return false;
      }

      // Filter by program types
      if (filters.programTypes.length > 0 && !filters.programTypes.includes(program.programType)) {
        return false;
      }

      // Filter by saved only
      if (filters.savedOnly && !program.isSaved) {
        return false;
      }

      return true;
    });
  }, [recommendations, filters]);

  // Available countries for filtering
  const availableCountries = React.useMemo(() => {
    if (!recommendations) return [];

    const countries = new Set();
    recommendations.forEach(program => {
      if (program.countryId) {
        countries.add(program.countryId);
      }
    });

    return Array.from(countries).map(countryId => ({
      value: countryId,
      label: recommendations.find(p => p.countryId === countryId)?.countryName || countryId
    }));
  }, [recommendations]);

  // Available program types for filtering
  const availableProgramTypes = React.useMemo(() => {
    if (!recommendations) return [];

    const types = new Set();
    recommendations.forEach(program => {
      if (program.programType) {
        types.add(program.programType);
      }
    });

    return Array.from(types).map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1)
    }));
  }, [recommendations]);

  // If loading, show loading state
  if (isLoading && !recommendations) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 4 }} />
          <Typography variant="h5" gutterBottom>
            Loading Recommendations
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            We're finding the best immigration pathways for you.
          </Typography>
        </Box>
      </Container>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(fetchProgramRecommendations())}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Immigration Program Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore immigration programs that match your profile and compare options to find the best path forward.
        </Typography>
      </Box>

      {/* Filters */}
      <RecommendationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSavePreset={handleSavePreset}
        onLoadPreset={handleLoadPreset}
        savedPresets={[]}
        availableCountries={availableCountries}
        availableProgramTypes={availableProgramTypes}
      />

      {/* View Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            View:
          </Typography>
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<GridViewIcon />}
            onClick={() => handleViewModeChange('grid')}
            sx={{ mr: 1 }}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<ViewListIcon />}
            onClick={() => handleViewModeChange('list')}
            sx={{ mr: 1 }}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'comparison' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<CompareArrowsIcon />}
            onClick={() => handleViewModeChange('comparison')}
            disabled={comparisonPrograms.length < 2}
          >
            Compare ({comparisonPrograms.length})
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {filteredPrograms.length} programs found
        </Typography>
      </Box>

      {/* Comparison View */}
      {viewMode === 'comparison' && (
        <ProgramComparisonView
          programs={comparisonPrograms}
          onSaveProgram={handleSaveProgram}
          onRemoveProgram={handleRemoveFromComparison}
          isLoading={isLoading}
        />
      )}

      {/* Grid/List View */}
      {(viewMode === 'grid' || viewMode === 'list') && (
        <Grid container spacing={3}>
          {/* Program List */}
          <Grid item xs={12} md={selectedProgram ? 6 : 12}>
            <Grid container spacing={2}>
              {filteredPrograms.map((program) => (
                <Grid item xs={12} sm={viewMode === 'grid' && !selectedProgram ? 6 : 12} md={viewMode === 'grid' && !selectedProgram ? 4 : 12} key={program._id}>
                  <ProgramInfoCard
                    program={program}
                    profile={profile}
                    onSaveProgram={handleSaveProgram}
                    onAddToComparison={handleAddToComparison}
                    isInComparison={comparisonPrograms.some(p => p._id === program._id)}
                    isDetailed={false}
                    comparisonPrograms={comparisonPrograms.filter(p => p._id !== program._id)}
                  />
                </Grid>
              ))}
              {filteredPrograms.length === 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      No matching programs found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your filters to see more results.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<TuneIcon />}
                      onClick={() => setFilters({
                        successProbability: [0, 100],
                        processingTime: [0, 60],
                        costRange: [0, 100000],
                        countries: [],
                        programTypes: [],
                        savedOnly: false
                      })}
                      sx={{ mt: 2 }}
                    >
                      Reset Filters
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Program Details */}
          {selectedProgram && (viewMode === 'grid' || viewMode === 'list') && (
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <ProgramInfoCard
                    program={selectedProgram}
                    profile={profile}
                    onSaveProgram={handleSaveProgram}
                    onAddToComparison={handleAddToComparison}
                    isInComparison={comparisonPrograms.some(p => p._id === selectedProgram._id)}
                    isDetailed={true}
                    comparisonPrograms={comparisonPrograms.filter(p => p._id !== selectedProgram._id)}
                  />
                </Paper>

                {/* Tabs for additional information */}
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="program details tabs"
                    variant="fullWidth"
                  >
                    <Tab
                      icon={<AssessmentIcon />}
                      label="Success Probability"
                      id="tab-0"
                      aria-controls="tabpanel-0"
                    />
                    <Tab
                      icon={<RecommendIcon />}
                      label="Recommendations"
                      id="tab-1"
                      aria-controls="tabpanel-1"
                    />
                  </Tabs>

                  {/* Success Probability Tab */}
                  <Box
                    role="tabpanel"
                    hidden={activeTab !== 0}
                    id="tabpanel-0"
                    aria-labelledby="tab-0"
                    sx={{ mt: 3 }}
                  >
                    {activeTab === 0 && (
                      <SuccessProbabilityWidget
                        probability={successProbability?.probability || selectedProgram.successProbability || 0}
                        positiveFactors={successProbability?.positiveFactors || []}
                        negativeFactors={successProbability?.negativeFactors || []}
                        comparisonPrograms={comparisonPrograms.filter(p => p._id !== selectedProgram._id)}
                        onAddToComparison={() => {}}
                        isLoading={isLoading}
                      />
                    )}
                  </Box>

                  {/* Recommendations Tab */}
                  <Box
                    role="tabpanel"
                    hidden={activeTab !== 1}
                    id="tabpanel-1"
                    aria-labelledby="tab-1"
                    sx={{ mt: 3 }}
                  >
                    {activeTab === 1 && (
                      <ActionRecommendations
                        recommendations={successProbability?.recommendations || []}
                        onActionComplete={() => {}}
                        onAddToRoadmap={handleAddActionToRoadmap}
                        isLoading={isLoading}
                      />
                    )}
                  </Box>
                </Paper>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default RecommendationsPage;
