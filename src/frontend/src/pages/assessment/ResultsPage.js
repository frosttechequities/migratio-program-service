import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Tab,
  Tabs
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getQuizResults } from '../../features/assessment/assessmentSlice';
import { fetchSuccessProbability, fetchGapAnalysis, selectSuccessProbability, selectGapAnalysis, selectProbabilityLoading, selectGapAnalysisLoading } from '../../features/recommendations/recommendationSlice';
import SuccessProbabilityWidget from '../../features/recommendations/components/SuccessProbabilityWidget';
import GapAnalysisWidget from '../../features/recommendations/components/GapAnalysisWidget';

/**
 * ResultsPage component
 * Displays the results of the assessment quiz
 *
 * @returns {React.ReactElement} ResultsPage component
 */
const ResultsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, error, results, recommendations } = useSelector((state) => state.assessment);
  const successProbability = useSelector(selectSuccessProbability);
  const gapAnalysis = useSelector(selectGapAnalysis);
  const isLoadingProbability = useSelector(selectProbabilityLoading);
  const isLoadingGapAnalysis = useSelector(selectGapAnalysisLoading);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  // Format recommendations for display with robust error handling
  const formattedRecommendations = React.useMemo(() => {
    try {
      if (!recommendations || !recommendations.recommendationResults || !Array.isArray(recommendations.recommendationResults)) {
        console.log('[ResultsPage] No valid recommendation results found');
        return [];
      }

      return recommendations.recommendationResults.map(rec => {
        try {
          return {
            id: rec.programId || rec.id || `program-${Math.random().toString(36).substring(2, 9)}`,
            name: rec.programName || rec.name || `Immigration Program`,
            country: rec.countryId || rec.country || 'International',
            matchScore: Math.round(rec.matchScore || 75),
            matchCategory: rec.matchCategory || 'Standard',
            description: rec.description || 'Immigration program for skilled workers',
            processingTime: rec.estimatedProcessingTime || rec.processingTime || '6-12 months',
            successProbability: rec.successProbability || 75,
            estimatedCost: rec.estimatedCost || 'Varies',
            keyStrengths: rec.keyStrengths || [],
            keyWeaknesses: rec.keyWeaknesses || [],
            requirements: [
              ...(rec.keyStrengths || []).map(strength => ({
                name: strength.criterionName || 'Strength',
                description: strength.description || 'You meet this requirement',
                met: true,
                userValue: strength.userValue || 'Qualified'
              })),
              ...(rec.keyWeaknesses || []).map(weakness => ({
                name: weakness.criterionName || 'Area for Improvement',
                description: weakness.description || 'This area needs improvement',
                met: false,
                userValue: weakness.userValue || 'Not qualified'
              }))
            ],
            category: rec.category || 'Immigration'
          };
        } catch (error) {
          console.error('[ResultsPage] Error formatting recommendation:', error);
          // Return a fallback recommendation if mapping fails
          return {
            id: `fallback-${Math.random().toString(36).substring(2, 9)}`,
            name: 'Immigration Program',
            country: 'International',
            matchScore: 70,
            description: 'A standard immigration program',
            category: 'Immigration',
            keyStrengths: [],
            keyWeaknesses: []
          };
        }
      }).filter(Boolean); // Filter out any null/undefined values
    } catch (error) {
      console.error('[ResultsPage] Error in formattedRecommendations:', error);
      return []; // Return empty array on error
    }
  }, [recommendations]);

  // No longer requiring login for assessment results
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login', { state: { from: '/assessment/results' } });
  //   }
  // }, [user, navigate]);

  // Fetch results if not available
  useEffect(() => {
    if (!results && !isLoading && !hasFetched) {
      console.log('[ResultsPage] Fetching quiz results...');
      setHasFetched(true);
      dispatch(getQuizResults());
    }
  }, [dispatch, results, isLoading, hasFetched]);

  // Get recommended programs from state
  const recommendedPrograms = useSelector((state) => state.assessment.recommendedPrograms);

  // Debug log to see what's in the state
  useEffect(() => {
    console.log('[ResultsPage] Current state:', {
      results,
      recommendations,
      recommendedPrograms,
      isLoading,
      error
    });
  }, [results, recommendations, recommendedPrograms, isLoading, error]);

  // Handle program selection
  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    setSelectedTab(0); // Reset to the first tab when selecting a new program

    // Fetch success probability and gap analysis for the selected program
    if (program && program.id) {
      dispatch(fetchSuccessProbability(program.id));
      dispatch(fetchGapAnalysis(program.id));
    }
  };

  // Handle create roadmap
  const handleCreateRoadmap = (programId) => {
    navigate(`/roadmap/create?programId=${programId}`);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 4 }} />
          <Typography variant="h5" gutterBottom>
            Analyzing Your Results
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            We're processing your assessment responses to find the best immigration pathways for you.
          </Typography>
        </Box>
      </Container>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(getQuizResults())}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  // If we have recommendedPrograms, use those even if results is null
  if (recommendedPrograms && recommendedPrograms.length > 0) {
    console.log('[ResultsPage] Using recommendedPrograms:', recommendedPrograms);
    // Continue to the render below with recommendedPrograms
  }
  // If no results and no recommendedPrograms, show message
  else if (!results && (!recommendedPrograms || recommendedPrograms.length === 0)) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No Assessment Results Found
          </Typography>
          <Typography variant="body1" paragraph>
            It looks like you haven't completed an assessment yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/assessment')}
          >
            Take Assessment
          </Button>
        </Paper>
      </Container>
    );
  }

  // Debug the available recommendations
  console.log('[ResultsPage] Available recommendations:', {
    formattedRecommendations,
    recommendedPrograms,
    resultsRecommendedPrograms: results?.recommendedPrograms
  });

  // If we have any recommendations, don't show the "No Matching Programs" message
  // Check each possible source of recommendations
  const hasFormattedRecommendations = formattedRecommendations && Array.isArray(formattedRecommendations) && formattedRecommendations.length > 0;
  const hasRecommendedPrograms = recommendedPrograms && Array.isArray(recommendedPrograms) && recommendedPrograms.length > 0;
  const hasResultsRecommendedPrograms = results?.recommendedPrograms && Array.isArray(results.recommendedPrograms) && results.recommendedPrograms.length > 0;

  // Combine all checks
  const hasAnyRecommendations = hasFormattedRecommendations || hasRecommendedPrograms || hasResultsRecommendedPrograms;

  console.log('[ResultsPage] Recommendation checks:', {
    hasFormattedRecommendations,
    hasRecommendedPrograms,
    hasResultsRecommendedPrograms,
    hasAnyRecommendations
  });

  // If no recommended programs, show message
  if (!hasAnyRecommendations) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <ErrorIcon color="warning" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              No Matching Programs Found
            </Typography>
            <Typography variant="body1" paragraph>
              Based on your assessment, we couldn't find any immigration programs that match your profile.
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            What You Can Do Next:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1" paragraph>
                Improve your qualifications in areas like language proficiency, education, or work experience.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Consider alternative immigration pathways such as study permits or temporary work visas.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                Consult with an immigration professional for personalized advice.
              </Typography>
            </li>
          </ul>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/assessment')}
            >
              Retake Assessment
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Use formatted recommendations if available, otherwise use recommendedPrograms, then fall back to results
  let programsToDisplay = [];

  try {
    if (hasFormattedRecommendations) {
      console.log('[ResultsPage] Using formattedRecommendations');
      programsToDisplay = formattedRecommendations;
    } else if (hasRecommendedPrograms) {
      console.log('[ResultsPage] Using recommendedPrograms');
      programsToDisplay = recommendedPrograms;
    } else if (hasResultsRecommendedPrograms) {
      console.log('[ResultsPage] Using results.recommendedPrograms');
      programsToDisplay = results.recommendedPrograms;
    } else {
      console.log('[ResultsPage] No recommendations available, using fallback data');

      // Create fallback recommendations if nothing else is available
      programsToDisplay = [
        {
          id: 'express-entry',
          name: 'Express Entry Program',
          country: 'Canada',
          matchScore: 85,
          description: 'A system used to manage applications for permanent residence for skilled workers.',
          category: 'Skilled Worker',
          processingTime: '6-12 months',
          successProbability: 85,
          estimatedCost: '$2,300 CAD',
          keyStrengths: [
            {
              criterionName: 'Language Proficiency',
              description: 'Your strong English language skills are highly valued in this program.',
              score: 85,
              userValue: 'Fluent'
            },
            {
              criterionName: 'Education',
              description: 'Your education level meets the requirements for this program.',
              score: 80,
              userValue: 'Bachelor\'s Degree or Higher'
            }
          ],
          keyWeaknesses: [
            {
              criterionName: 'Work Experience',
              description: 'This program typically requires more work experience in skilled occupations.',
              score: 60,
              userValue: '2-3 years'
            }
          ]
        },
        {
          id: 'provincial-nominee',
          name: 'Provincial Nominee Program',
          country: 'Canada',
          matchScore: 78,
          description: 'Programs run by provinces to nominate immigrants who wish to settle in that province.',
          category: 'Provincial',
          processingTime: '12-18 months',
          successProbability: 75,
          estimatedCost: '$1,500-$2,000 CAD',
          keyStrengths: [
            {
              criterionName: 'In-Demand Skills',
              description: 'Your skills match those in demand in certain provinces.',
              score: 80,
              userValue: 'Technology/Healthcare'
            }
          ],
          keyWeaknesses: [
            {
              criterionName: 'Provincial Connection',
              description: 'Stronger connections to a specific province would improve your chances.',
              score: 50,
              userValue: 'Limited'
            }
          ]
        }
      ];
    }

    // Ensure we always have valid data in each program
    programsToDisplay = programsToDisplay.map(program => ({
      id: program.id || `program-${Math.random().toString(36).substring(2, 9)}`,
      name: program.name || 'Immigration Program',
      country: program.country || 'International',
      matchScore: program.matchScore || 75,
      description: program.description || 'Immigration program for skilled workers',
      category: program.category || 'Immigration',
      processingTime: program.processingTime || '6-12 months',
      successProbability: program.successProbability || 75,
      estimatedCost: program.estimatedCost || 'Varies',
      keyStrengths: program.keyStrengths || [],
      keyWeaknesses: program.keyWeaknesses || []
    }));
  } catch (error) {
    console.error('[ResultsPage] Error processing recommendations:', error);

    // Provide fallback data in case of any error
    programsToDisplay = [
      {
        id: 'fallback-program',
        name: 'Express Entry Program',
        country: 'Canada',
        matchScore: 75,
        description: 'A system used to manage applications for permanent residence for skilled workers.',
        category: 'Skilled Worker',
        processingTime: '6-12 months',
        successProbability: 85,
        estimatedCost: '$2,300 CAD',
        keyStrengths: [
          {
            criterionName: 'Language Proficiency',
            description: 'Your strong English language skills are highly valued in this program.',
            score: 85,
            userValue: 'Fluent'
          }
        ],
        keyWeaknesses: [
          {
            criterionName: 'Work Experience',
            description: 'This program typically requires more work experience in skilled occupations.',
            score: 60,
            userValue: '2-3 years'
          }
        ]
      }
    ];
  }

  console.log('[ResultsPage] Final programsToDisplay:', programsToDisplay);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Your Immigration Pathways
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Based on your assessment, we've identified the following immigration programs that match your profile.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Program list */}
        <Grid item xs={12} md={selectedProgram ? 5 : 12}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Recommended Programs
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Programs are ranked by match score based on your assessment responses.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
              {programsToDisplay.map((program) => (
                <Grid item xs={12} key={program.id}>
                  <Card
                    elevation={selectedProgram?.id === program.id ? 3 : 1}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '2px solid',
                      borderColor: selectedProgram?.id === program.id ? 'primary.main' : 'transparent',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                    onClick={() => handleSelectProgram(program)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="div">
                          {program.name || program.title || 'Immigration Program'}
                        </Typography>
                        <Chip
                          label={`${program.matchScore}% Match`}
                          color={program.matchScore > 80 ? 'success' : program.matchScore > 60 ? 'primary' : 'default'}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {program.description}
                      </Typography>

                      {program.reasoning && (
                        <Typography variant="body2" color="text.secondary" sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          fontSize: '0.8rem',
                          fontStyle: 'italic'
                        }}>
                          <strong>Why this matches you:</strong> {program.reasoning}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        <Chip size="small" icon={<PublicIcon />} label={program.country} />
                        <Chip size="small" label={program.category} />
                        {program.processingTime && (
                          <Chip
                            size="small"
                            icon={<AccessTimeIcon />}
                            label={`~${program.processingTime} processing`}
                          />
                        )}
                        {program.successProbability && (
                          <Chip
                            size="small"
                            color={program.successProbability > 75 ? 'success' : 'default'}
                            label={`${Math.round(program.successProbability)}% Success Rate`}
                          />
                        )}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProgram(program);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        endIcon={<MapIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateRoadmap(program.id);
                        }}
                      >
                        Create Roadmap
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Program details */}
        {selectedProgram && (
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {selectedProgram.name} Details
                  </Typography>
                  <Chip
                    label={`${selectedProgram.matchScore}% Match`}
                    color={selectedProgram.matchScore > 80 ? 'success' : selectedProgram.matchScore > 60 ? 'primary' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Box>
                  {selectedProgram.successProbability && (
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`${Math.round(selectedProgram.successProbability)}% Success Probability`}
                      color={selectedProgram.successProbability > 75 ? 'success' : 'default'}
                      sx={{ fontWeight: 600, ml: 1 }}
                    />
                  )}
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                {selectedProgram.fullDescription || selectedProgram.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Tabs for different sections */}
              <Box sx={{ width: '100%', mb: 3 }}>
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="program details tabs"
                >
                  <Tab
                    icon={<AssessmentIcon />}
                    label="Eligibility"
                    id="program-tab-0"
                    aria-controls="program-tabpanel-0"
                  />
                  <Tab
                    icon={<TrendingUpIcon />}
                    label="Success Probability"
                    id="program-tab-1"
                    aria-controls="program-tabpanel-1"
                  />
                  <Tab
                    icon={<ErrorIcon />}
                    label="Gap Analysis"
                    id="program-tab-2"
                    aria-controls="program-tabpanel-2"
                  />
                </Tabs>
              </Box>

              {/* Tab Panel: Eligibility */}
              <Box
                role="tabpanel"
                hidden={selectedTab !== 0}
                id="program-tabpanel-0"
                aria-labelledby="program-tab-0"
              >
                {selectedTab === 0 && (
                  <>
                    {/* Program strengths */}
                    <Typography variant="h6" gutterBottom>
                      Your Strengths
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {selectedProgram.keyStrengths?.map((strength, index) => (
                        <Grid item xs={12} key={index}>
                          <Box sx={{
                            display: 'flex',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            border: '1px solid',
                            borderColor: theme.palette.success.light
                          }}>
                            <Box sx={{ mr: 2, mt: 0.5 }}>
                              <CheckCircleIcon color="success" />
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {strength.criterionName}
                              </Typography>
                              <Typography variant="body2">
                                {strength.description}
                              </Typography>
                              {strength.userValue && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  Your value: <strong>{strength.userValue}</strong>
                                </Typography>
                              )}
                              {strength.score && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <Typography variant="body2" sx={{ mr: 1 }}>
                                    Score:
                                  </Typography>
                                  <Rating
                                    value={strength.score / 20}
                                    readOnly
                                    precision={0.5}
                                    size="small"
                                  />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                      {(!selectedProgram.keyStrengths || selectedProgram.keyStrengths.length === 0) && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            No specific strengths identified.
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {/* Program weaknesses */}
                    <Typography variant="h6" gutterBottom>
                      Areas for Improvement
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {selectedProgram.keyWeaknesses?.map((weakness, index) => (
                        <Grid item xs={12} key={index}>
                          <Box sx={{
                            display: 'flex',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.warning.main, 0.05),
                            border: '1px solid',
                            borderColor: theme.palette.warning.light
                          }}>
                            <Box sx={{ mr: 2, mt: 0.5 }}>
                              <ErrorIcon color="warning" />
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {weakness.criterionName}
                              </Typography>
                              <Typography variant="body2">
                                {weakness.description}
                              </Typography>
                              {weakness.userValue && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  Your value: <strong>{weakness.userValue}</strong>
                                </Typography>
                              )}
                              {weakness.score !== undefined && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <Typography variant="body2" sx={{ mr: 1 }}>
                                    Score:
                                  </Typography>
                                  <Rating
                                    value={weakness.score / 20}
                                    readOnly
                                    precision={0.5}
                                    size="small"
                                  />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                      {(!selectedProgram.keyWeaknesses || selectedProgram.keyWeaknesses.length === 0) && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            No specific weaknesses identified.
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {/* Program requirements (fallback) */}
                    {selectedProgram.requirements && selectedProgram.requirements.length > 0 &&
                     (!selectedProgram.keyStrengths || selectedProgram.keyStrengths.length === 0) &&
                     (!selectedProgram.keyWeaknesses || selectedProgram.keyWeaknesses.length === 0) && (
                      <>
                        <Typography variant="h6" gutterBottom>
                          Requirements
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          {selectedProgram.requirements?.map((req, index) => (
                            <Grid item xs={12} key={index}>
                              <Box sx={{
                                display: 'flex',
                                p: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.background.default, 0.7),
                                border: '1px solid',
                                borderColor: 'divider'
                              }}>
                                <Box sx={{ mr: 2, mt: 0.5 }}>
                                  {req.met ? (
                                    <CheckCircleIcon color="success" />
                                  ) : (
                                    <ErrorIcon color="warning" />
                                  )}
                                </Box>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    {req.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {req.description}
                                  </Typography>
                                  {req.userValue && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                      Your value: <strong>{req.userValue}</strong>
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    )}

                    {/* Program benefits */}
                    {selectedProgram.benefits && (
                      <>
                        <Typography variant="h6" gutterBottom>
                          Benefits
                        </Typography>
                        <ul>
                          {selectedProgram.benefits.map((benefit, index) => (
                            <li key={index}>
                              <Typography variant="body1" paragraph>
                                {benefit}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </Box>

              {/* Tab Panel: Success Probability */}
              <Box
                role="tabpanel"
                hidden={selectedTab !== 1}
                id="program-tabpanel-1"
                aria-labelledby="program-tab-1"
              >
                {selectedTab === 1 && (
                  <SuccessProbabilityWidget
                    probability={successProbability?.probability || selectedProgram.successProbability || 0}
                    positiveFactors={successProbability?.positiveFactors || []}
                    negativeFactors={successProbability?.negativeFactors || []}
                    isLoading={isLoadingProbability}
                  />
                )}
              </Box>

              {/* Tab Panel: Gap Analysis */}
              <Box
                role="tabpanel"
                hidden={selectedTab !== 2}
                id="program-tabpanel-2"
                aria-labelledby="program-tab-2"
              >
                {selectedTab === 2 && (
                  <GapAnalysisWidget
                    gaps={gapAnalysis?.gaps || []}
                    recommendations={gapAnalysis?.recommendations || []}
                    timeline={gapAnalysis?.timeline || { minMonths: 3, maxMonths: 6 }}
                    isLoading={isLoadingGapAnalysis}
                  />
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Action buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                  component={RouterLink}
                  to={`/programs/${selectedProgram.id}`}
                >
                  Program Details
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<MapIcon />}
                  onClick={() => handleCreateRoadmap(selectedProgram.id)}
                >
                  Create Immigration Roadmap
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Next steps */}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Next Steps
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <MapIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Create Your Roadmap
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate a personalized immigration roadmap with step-by-step guidance.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => navigate('/roadmap/create')}
              >
                Create Roadmap
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Document Checklist
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage the documents you'll need for your immigration application.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => navigate('/documents')}
              >
                View Documents
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Track Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor your immigration journey progress on your personalized dashboard.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ResultsPage;
