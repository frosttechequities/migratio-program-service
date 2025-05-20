import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  Button,
  Divider,
  Collapse,
  IconButton,
  Tooltip,
  Link,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * ActionRecommendations component
 * Displays recommended actions to improve immigration success probability
 *
 * @param {Object} props - Component props
 * @param {Array} props.recommendations - Array of recommendation objects
 * @param {Function} props.onActionComplete - Callback for marking action as complete
 * @param {Function} props.onAddToRoadmap - Callback for adding action to roadmap
 * @param {boolean} props.isLoading - Loading state
 * @returns {React.ReactElement} ActionRecommendations component
 */
const ActionRecommendations = ({
  recommendations = [],
  onActionComplete = () => {},
  onAddToRoadmap = () => {},
  isLoading = false
}) => {
  const theme = useTheme();
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Group recommendations by category
  const groupedRecommendations = recommendations.reduce((acc, recommendation) => {
    const category = recommendation.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recommendation);
    return acc;
  }, {});

  // Sort categories by priority
  const categoryPriority = {
    'Critical': 1,
    'High': 2,
    'Medium': 3,
    'Low': 4,
    'General': 5
  };

  const sortedCategories = Object.keys(groupedRecommendations).sort((a, b) => {
    return (categoryPriority[a] || 999) - (categoryPriority[b] || 999);
  });

  // Handle category expansion toggle
  const handleCategoryToggle = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Get icon for recommendation type
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'document':
        return <DescriptionIcon color="primary" />;
      case 'education':
        return <SchoolIcon color="primary" />;
      case 'language':
        return <LanguageIcon color="primary" />;
      case 'work':
        return <WorkIcon color="primary" />;
      case 'financial':
        return <AttachMoneyIcon color="primary" />;
      case 'timeline':
        return <ScheduleIcon color="primary" />;
      default:
        return <AssignmentIcon color="primary" />;
    }
  };

  // Get color for priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'error';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'primary';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Get color for impact
  const getImpactColor = (impact) => {
    if (impact >= 20) return theme.palette.success.main;
    if (impact >= 10) return theme.palette.primary.main;
    if (impact >= 5) return theme.palette.warning.main;
    return theme.palette.grey[500];
  };

  // Format estimated time
  const formatEstimatedTime = (days) => {
    if (!days && days !== 0) return 'Varies';

    if (days < 1) {
      const hours = Math.round(days * 24);
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }

    const months = Math.round(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Recommended Actions
        </Typography>
        <Tooltip title="Actions that can improve your immigration success probability">
          <InfoOutlinedIcon color="action" sx={{ cursor: 'pointer' }} />
        </Tooltip>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress size={40} />
        </Box>
      ) : recommendations.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary" gutterBottom>
            No specific actions recommended at this time.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your profile is already well-optimized for this immigration pathway.
          </Typography>
        </Box>
      ) : (
        <List sx={{
          width: '100%',
          bgcolor: 'background.paper',
          '& .MuiListItemButton-root': {
            borderRadius: 1,
            mb: 0.5
          }
        }}>
          {sortedCategories.map((category) => (
            <React.Fragment key={category}>
              <ListItemButton
                onClick={() => handleCategoryToggle(category)}
                sx={{
                  bgcolor: theme.palette.grey[50],
                  borderLeft: '4px solid',
                  borderColor: theme.palette[getPriorityColor(category)].main
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1">
                        {category} Actions
                      </Typography>
                      <Chip
                        label={groupedRecommendations[category].length}
                        size="small"
                        color={getPriorityColor(category)}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                />
                {expandedCategory === category ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>

              <Collapse in={expandedCategory === category} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {groupedRecommendations[category].map((recommendation, index) => (
                    <ListItem
                      key={recommendation._id || index}
                      alignItems="flex-start"
                      sx={{
                        pl: 4,
                        pr: 2,
                        py: 1,
                        borderBottom: index < groupedRecommendations[category].length - 1 ?
                          `1px solid ${theme.palette.divider}` : 'none'
                      }}
                      secondaryAction={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                          {recommendation.estimatedImpact && (
                            <Tooltip title="Estimated impact on success probability">
                              <Chip
                                label={`+${recommendation.estimatedImpact}%`}
                                size="small"
                                sx={{
                                  bgcolor: getImpactColor(recommendation.estimatedImpact),
                                  color: 'white',
                                  fontWeight: 'bold'
                                }}
                              />
                            </Tooltip>
                          )}
                          <Tooltip title="Add to Roadmap">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => onAddToRoadmap(recommendation._id || index)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        {getRecommendationIcon(recommendation.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ pr: 8 }}>
                            <Typography variant="body1" fontWeight="medium">
                              {recommendation.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 0.5 }}>
                              {recommendation.description}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {recommendation.estimatedTime && (
                                <Chip
                                  icon={<ScheduleIcon fontSize="small" />}
                                  label={formatEstimatedTime(recommendation.estimatedTime)}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              {recommendation.difficulty && (
                                <Chip
                                  label={`Difficulty: ${recommendation.difficulty}`}
                                  size="small"
                                  variant="outlined"
                                  color={
                                    recommendation.difficulty === 'Easy' ? 'success' :
                                    recommendation.difficulty === 'Medium' ? 'primary' :
                                    'warning'
                                  }
                                />
                              )}
                              {recommendation.type && (
                                <Chip
                                  label={recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                            {recommendation.resourceUrl && (
                              <Box sx={{ mt: 1 }}>
                                <Link
                                  href={recommendation.resourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  underline="hover"
                                  sx={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}
                                >
                                  Learn more
                                  <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                                </Link>
                              </Box>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          component={RouterLink}
          to="/roadmap"
          variant="outlined"
          startIcon={<AssignmentIcon />}
        >
          View Roadmap
        </Button>
        <Button
          variant="contained"
          onClick={() => onAddToRoadmap('all')}
          startIcon={<AddIcon />}
        >
          Add All to Roadmap
        </Button>
      </Box>
    </Paper>
  );
};

ActionRecommendations.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      category: PropTypes.string,
      priority: PropTypes.string,
      type: PropTypes.string,
      estimatedImpact: PropTypes.number,
      estimatedTime: PropTypes.number,
      difficulty: PropTypes.string,
      resourceUrl: PropTypes.string,
      isCompleted: PropTypes.bool
    })
  ),
  onActionComplete: PropTypes.func,
  onAddToRoadmap: PropTypes.func,
  isLoading: PropTypes.bool
};

export default ActionRecommendations;
