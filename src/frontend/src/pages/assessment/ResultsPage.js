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
  Rating
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
import { getQuizResults } from '../../features/assessment/assessmentSlice';

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
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Format recommendations for display
  const formattedRecommendations = React.useMemo(() => {
    if (!recommendations || !recommendations.recommendationResults) {
      return [];
    }

    return recommendations.recommendationResults.map(rec => ({
      id: rec.programId,
      name: rec.programName || `Program ${rec.programId}`,
      country: rec.countryId,
      matchScore: Math.round(rec.matchScore),
      matchCategory: rec.matchCategory,
      description: rec.description || 'Immigration program',
      processingTime: rec.estimatedProcessingTime,
      successProbability: rec.successProbability,
      estimatedCost: rec.estimatedCost,
      keyStrengths: rec.keyStrengths || [],
      keyWeaknesses: rec.keyWeaknesses || [],
      requirements: [
        ...(rec.keyStrengths || []).map(strength => ({
          name: strength.criterionName,
          description: strength.description,
          met: true,
          userValue: strength.userValue
        })),
        ...(rec.keyWeaknesses || []).map(weakness => ({
          name: weakness.criterionName,
          description: weakness.description,
          met: false,
          userValue: weakness.userValue
        }))
      ],
      category: rec.category || 'Immigration'
    }));
  }, [recommendations]);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/assessment/results' } });
    }
  }, [user, navigate]);

  // Fetch results if not available
  useEffect(() => {
    if (!results && !isLoading) {
      dispatch(getQuizResults());
    }
  }, [dispatch, results, isLoading]);

  // Handle program selection
  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
  };

  // Handle create roadmap
  const handleCreateRoadmap = (programId) => {
    navigate(`/roadmap/create?programId=${programId}`);
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

  // If no results, show message
  if (!results) {
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

  // If no recommended programs, show message
  if ((!formattedRecommendations || formattedRecommendations.length === 0) &&
      (!results.recommendedPrograms || results.recommendedPrograms.length === 0)) {
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

  // Use formatted recommendations if available, otherwise use the old format
  const programsToDisplay = formattedRecommendations.length > 0
    ? formattedRecommendations
    : results.recommendedPrograms || [];

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
                          {program.name}
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
              <Typography variant="h5" gutterBottom>
                {selectedProgram.name} Details
              </Typography>
              <Chip
                label={`${selectedProgram.matchScore}% Match`}
                color={selectedProgram.matchScore > 80 ? 'success' : selectedProgram.matchScore > 60 ? 'primary' : 'default'}
                sx={{ mb: 2, fontWeight: 600 }}
              />

              <Typography variant="body1" paragraph>
                {selectedProgram.fullDescription || selectedProgram.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

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
