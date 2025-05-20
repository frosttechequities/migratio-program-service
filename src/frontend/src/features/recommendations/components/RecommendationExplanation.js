import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  LinearProgress,
  Tooltip,
  IconButton,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  CompareArrows as CompareArrowsIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';

/**
 * RecommendationExplanation component
 * Provides detailed explanations for program recommendations with visualizations
 * 
 * @param {Object} props - Component props
 * @param {Object} props.program - Program data
 * @param {Object} props.profile - User profile data
 * @param {Array} props.matchFactors - Factors contributing to match score
 * @param {Array} props.successFactors - Factors contributing to success probability
 * @param {boolean} props.isDetailed - Whether to show detailed view
 * @returns {React.ReactElement} RecommendationExplanation component
 */
const RecommendationExplanation = ({
  program = {},
  profile = {},
  matchFactors = [],
  successFactors = [],
  isDetailed = false
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Ensure factors are arrays
  const safeMatchFactors = Array.isArray(matchFactors) ? matchFactors : [];
  const safeSuccessFactors = Array.isArray(successFactors) ? successFactors : [];

  // Split factors into strengths and weaknesses
  const strengths = safeSuccessFactors.filter(factor => factor.impact > 0);
  const weaknesses = safeSuccessFactors.filter(factor => factor.impact < 0);

  // Get factor icon based on type
  const getFactorIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'education':
        return <SchoolIcon />;
      case 'work':
        return <WorkIcon />;
      case 'language':
        return <LanguageIcon />;
      case 'financial':
        return <AttachMoneyIcon />;
      case 'time':
        return <ScheduleIcon />;
      case 'country':
        return <FlagIcon />;
      default:
        return <InfoIcon />;
    }
  };

  // Get color based on impact value
  const getImpactColor = (impact) => {
    if (impact > 15) return theme.palette.success.main;
    if (impact > 5) return theme.palette.success.light;
    if (impact < -15) return theme.palette.error.main;
    if (impact < -5) return theme.palette.error.light;
    return theme.palette.warning.main;
  };

  // Render match factor explanation
  const renderMatchFactorExplanation = (factor) => {
    return (
      <ListItem key={factor.name} alignItems="flex-start" sx={{ px: 0 }}>
        <ListItemIcon sx={{ minWidth: 40 }}>
          {getFactorIcon(factor.type)}
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">{factor.name}</Typography>
              <Chip 
                label={`${factor.contribution > 0 ? '+' : ''}${factor.contribution}%`}
                size="small"
                sx={{ 
                  bgcolor: factor.contribution > 0 ? theme.palette.success.light : theme.palette.error.light,
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          }
          secondary={
            <Box sx={{ mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {factor.explanation}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.abs(factor.contribution)} 
                sx={{ 
                  mt: 1, 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: factor.contribution > 0 ? theme.palette.success.main : theme.palette.error.main
                  }
                }}
              />
            </Box>
          }
        />
      </ListItem>
    );
  };

  return (
    <Box sx={{ mt: isDetailed ? 0 : 2 }}>
      <Accordion 
        expanded={expanded || isDetailed} 
        onChange={() => setExpanded(!expanded)}
        elevation={isDetailed ? 0 : 1}
        sx={{ 
          '&:before': { display: 'none' },
          borderRadius: isDetailed ? 0 : 1
        }}
      >
        <AccordionSummary
          expandIcon={!isDetailed && <ExpandMoreIcon />}
          sx={{ 
            px: isDetailed ? 0 : 2,
            display: isDetailed ? 'none' : 'flex'
          }}
        >
          <Typography variant="subtitle1">
            Detailed Explanation
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: isDetailed ? 0 : 2 }}>
          {/* Overall Explanation */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              {program.detailedExplanation || 
                `Based on your profile, you have a ${program.matchScore}% match with the ${program.programName} program and a ${program.successProbability}% estimated probability of success if you apply.`
              }
            </Typography>
          </Box>

          {/* Strengths and Weaknesses */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ThumbUpIcon sx={{ mr: 1, color: theme.palette.success.main }} />
              Key Strengths
            </Typography>
            <List dense disablePadding>
              {strengths.map((factor, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getFactorIcon(factor.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={factor.name}
                    secondary={factor.description}
                  />
                  <Chip 
                    label={`+${factor.impact}%`}
                    size="small"
                    sx={{ 
                      bgcolor: getImpactColor(factor.impact),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ThumbDownIcon sx={{ mr: 1, color: theme.palette.error.main }} />
              Areas for Improvement
            </Typography>
            <List dense disablePadding>
              {weaknesses.map((factor, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getFactorIcon(factor.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={factor.name}
                    secondary={factor.description}
                  />
                  <Chip 
                    label={`${factor.impact}%`}
                    size="small"
                    sx={{ 
                      bgcolor: getImpactColor(factor.impact),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Match Factors Analysis */}
          {safeMatchFactors.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Match Factors Analysis
              </Typography>
              <List disablePadding>
                {safeMatchFactors.map(renderMatchFactorExplanation)}
              </List>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

RecommendationExplanation.propTypes = {
  program: PropTypes.object,
  profile: PropTypes.object,
  matchFactors: PropTypes.array,
  successFactors: PropTypes.array,
  isDetailed: PropTypes.bool
};

export default RecommendationExplanation;
