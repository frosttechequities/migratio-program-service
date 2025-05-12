import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  LinearProgress,
  useTheme,
  alpha,
  Collapse
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  ArrowForward as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  AccountBalance as AccountBalanceIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Personalized recommendations widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Array} props.data - Recommendations data
 * @returns {React.ReactNode} Personalized recommendations widget component
 */
const PersonalizedRecommendations = ({ data }) => {
  const theme = useTheme();
  const [expandedId, setExpandedId] = useState(null);

  // If no data is provided, use mock data
  const recommendations = data || [
    {
      id: 'rec1',
      title: 'Complete your profile',
      description: 'Fill in all sections of your profile to get more accurate recommendations',
      priority: 'high',
      type: 'action',
      category: 'profile',
      details: 'Your profile is currently 65% complete. Adding more information about your education, work experience, and language skills will help us provide more accurate program recommendations.',
      actionUrl: '/profile',
      actionText: 'Update Profile'
    },
    {
      id: 'rec2',
      title: 'Express Entry Program',
      description: 'Based on your profile, you may be eligible for the Express Entry program',
      priority: 'medium',
      type: 'program',
      category: 'immigration',
      match: 85,
      details: 'The Express Entry system manages applications for three federal immigration programs: Federal Skilled Worker Program, Federal Skilled Trades Program, and Canadian Experience Class. With your education and work experience, you have a strong chance of qualifying.',
      actionUrl: '/programs/express-entry',
      actionText: 'Learn More'
    },
    {
      id: 'rec3',
      title: 'Upload your language test results',
      description: 'Your language test results are required for most immigration programs',
      priority: 'high',
      type: 'document',
      category: 'documents',
      details: 'Language proficiency is a key factor in most immigration programs. Upload your IELTS, CELPIP, or TEF results to strengthen your application and receive more accurate program recommendations.',
      actionUrl: '/documents/upload',
      actionText: 'Upload Document'
    },
    {
      id: 'rec4',
      title: 'Provincial Nominee Program',
      description: 'You may qualify for provincial nomination based on your skills',
      priority: 'medium',
      type: 'program',
      category: 'immigration',
      match: 72,
      details: 'Provincial Nominee Programs allow provinces and territories to nominate individuals who wish to immigrate to Canada and who are interested in settling in a particular province. Based on your occupation and experience, you may be eligible for nomination.',
      actionUrl: '/programs/pnp',
      actionText: 'Explore PNP Options'
    },
    {
      id: 'rec5',
      title: 'Improve your language scores',
      description: 'Higher language scores can significantly improve your eligibility',
      priority: 'medium',
      type: 'action',
      category: 'language',
      details: 'Language proficiency is heavily weighted in most immigration programs. Improving your scores, particularly in speaking and writing, could increase your chances of qualifying for Express Entry and other programs.',
      actionUrl: '/resources/language',
      actionText: 'Language Resources'
    }
  ];

  // Toggle expanded state
  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Get icon based on recommendation type
  const getRecommendationIcon = (type, category) => {
    if (type === 'program') return <AccountBalanceIcon />;
    if (type === 'document') return <DescriptionIcon />;

    // For action type, use category to determine icon
    switch (category) {
      case 'profile':
        return <AccountBalanceIcon />;
      case 'education':
        return <SchoolIcon />;
      case 'work':
        return <WorkIcon />;
      case 'language':
        return <LanguageIcon />;
      default:
        return <LightbulbIcon />;
    }
  };

  // Get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Render match score stars
  const renderMatchStars = (match) => {
    const fullStars = Math.floor(match / 20);
    const hasHalfStar = match % 20 >= 10;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const iconSize = window.innerWidth < 600 ? 'small' : 'small';

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon
            key={`full-${i}`}
            fontSize={iconSize}
            sx={{
              color: theme.palette.warning.main,
              fontSize: { xs: '0.9rem', sm: '1.1rem' }
            }}
          />
        ))}
        {hasHalfStar && (
          <StarHalfIcon
            fontSize={iconSize}
            sx={{
              color: theme.palette.warning.main,
              fontSize: { xs: '0.9rem', sm: '1.1rem' }
            }}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarBorderIcon
            key={`empty-${i}`}
            fontSize={iconSize}
            sx={{
              color: theme.palette.warning.main,
              fontSize: { xs: '0.9rem', sm: '1.1rem' }
            }}
          />
        ))}
        <Typography
          variant="body2"
          sx={{
            ml: 1,
            fontWeight: 'bold',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          {match}% Match
        </Typography>
      </>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: alpha(theme.palette.secondary.main, 0.05)
        }}
      >
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightbulbIcon color="secondary" />
          Personalized Recommendations
        </Typography>
      </Box>

      {/* Recommendations */}
      <Box sx={{ p: 2 }}>
        {recommendations.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No recommendations available
            </Typography>
            <Button
              component={RouterLink}
              to="/profile"
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
            >
              Complete Your Profile
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {recommendations.map((recommendation) => (
              <Grid item xs={12} key={recommendation.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'visible',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    {/* Header */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'flex-start' },
                      gap: { xs: 2, sm: 0 }
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        width: '100%'
                      }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            borderRadius: '50%',
                            backgroundColor: alpha(
                              recommendation.type === 'program'
                                ? theme.palette.primary.main
                                : recommendation.type === 'document'
                                  ? theme.palette.info.main
                                  : theme.palette.secondary.main,
                              0.1
                            ),
                            color: recommendation.type === 'program'
                              ? theme.palette.primary.main
                              : recommendation.type === 'document'
                                ? theme.palette.info.main
                                : theme.palette.secondary.main,
                            flexShrink: 0,
                            mt: { xs: 0.5, sm: 0 }
                          }}
                        >
                          {getRecommendationIcon(recommendation.type, recommendation.category)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                          }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                            >
                              {recommendation.title}
                            </Typography>
                            <Chip
                              label={recommendation.priority.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: alpha(getPriorityColor(recommendation.priority), 0.1),
                                color: getPriorityColor(recommendation.priority),
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                                height: { xs: 20, sm: 24 },
                                ml: 1
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              mt: 0.5
                            }}
                          >
                            {recommendation.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Match score for program recommendations */}
                    {recommendation.type === 'program' && recommendation.match && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: { xs: 0.5, sm: 1 }
                        }}>
                          {renderMatchStars(recommendation.match)}
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={recommendation.match}
                          sx={{
                            height: { xs: 4, sm: 6 },
                            borderRadius: 3,
                            mt: 1,
                            backgroundColor: alpha(theme.palette.warning.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.warning.main
                            }
                          }}
                        />
                      </Box>
                    )}

                    {/* Expandable details */}
                    <Box sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        onClick={() => handleToggleExpand(recommendation.id)}
                        endIcon={expandedId === recommendation.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{ p: 0 }}
                      >
                        {expandedId === recommendation.id ? 'Show Less' : 'Show More'}
                      </Button>
                      <Collapse in={expandedId === recommendation.id}>
                        <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.background.default, 0.5), borderRadius: 1 }}>
                          <Typography variant="body2">
                            {recommendation.details}
                          </Typography>
                          <Button
                            component={RouterLink}
                            to={recommendation.actionUrl}
                            variant="contained"
                            color={
                              recommendation.type === 'program'
                                ? 'primary'
                                : recommendation.type === 'document'
                                  ? 'info'
                                  : 'secondary'
                            }
                            size="small"
                            endIcon={<ArrowForwardIcon />}
                            sx={{ mt: 2 }}
                          >
                            {recommendation.actionText}
                          </Button>
                        </Box>
                      </Collapse>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Footer */}
      {recommendations.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Button
            component={RouterLink}
            to="/profile"
            size="small"
          >
            Update Profile
          </Button>
          <Button
            component={RouterLink}
            to="/recommendations"
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            View All
          </Button>
        </Box>
      )}
    </Paper>
  );
};

PersonalizedRecommendations.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      category: PropTypes.string,
      details: PropTypes.string,
      match: PropTypes.number,
      actionUrl: PropTypes.string,
      actionText: PropTypes.string
    })
  )
};

export default PersonalizedRecommendations;
