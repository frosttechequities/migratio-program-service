import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Chip,
  Button,
  IconButton,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Tooltip,
  Link,
  Grid,
  Tab,
  Tabs,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Language as LanguageIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  AttachMoney as AttachMoneyIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  Link as LinkIcon,
  CompareArrows as CompareArrowsIcon,
  OpenInNew as OpenInNewIcon,
  Info as InfoIcon,
  BarChart as BarChartIcon,
  Compare as CompareIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

// Import new explanation components
import RecommendationExplanation from './RecommendationExplanation';
import VisualExplanation from './VisualExplanation';
import ComparisonExplanation from './ComparisonExplanation';

// Styled expand button with rotation animation
const ExpandButton = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

/**
 * ProgramInfoCard component
 * Displays detailed information about an immigration program
 *
 * @param {Object} props - Component props
 * @param {Object} props.program - Program data
 * @param {Function} props.onSaveProgram - Callback for saving a program
 * @param {Function} props.onAddToComparison - Callback for adding program to comparison
 * @param {boolean} props.isInComparison - Whether program is already in comparison
 * @param {boolean} props.isDetailed - Whether to show detailed view
 * @returns {React.ReactElement} ProgramInfoCard component
 */
const ProgramInfoCard = ({
  program = {},
  profile = {},
  onSaveProgram = () => {},
  onAddToComparison = () => {},
  isInComparison = false,
  isDetailed = false,
  comparisonPrograms = []
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(isDetailed);
  const [activeTab, setActiveTab] = useState(0);

  // Handle expand click
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle save program
  const handleSaveProgram = () => {
    onSaveProgram(program._id, !program.isSaved);
  };

  // Handle add to comparison
  const handleAddToComparison = () => {
    onAddToComparison(program._id);
  };

  // Format processing time
  const formatProcessingTime = (time) => {
    if (!time) return 'Unknown';

    if (time.average) {
      return `${time.average} months`;
    }

    if (time.min && time.max) {
      return `${time.min}-${time.max} months`;
    }

    return 'Varies';
  };

  // Format cost
  const formatCost = (cost) => {
    if (!cost) return 'Unknown';

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cost.currency || 'USD',
      maximumFractionDigits: 0
    });

    if (cost.min && cost.max) {
      return `${formatter.format(cost.min)} - ${formatter.format(cost.max)}`;
    }

    if (cost.average) {
      return formatter.format(cost.average);
    }

    return formatter.format(cost);
  };

  // Get color for success probability
  const getProbabilityColor = (probability) => {
    if (probability >= 80) return theme.palette.success.main;
    if (probability >= 60) return theme.palette.success.light;
    if (probability >= 40) return theme.palette.primary.main;
    if (probability >= 20) return theme.palette.warning.main;
    return theme.palette.error.light;
  };

  // Get rating value from success probability
  const getRatingFromProbability = (probability) => {
    return Math.round((probability / 100) * 5);
  };

  // Render eligibility status
  const renderEligibilityStatus = (isEligible) => {
    if (isEligible === true) {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Eligible"
          color="success"
          size="small"
          variant="outlined"
        />
      );
    }

    if (isEligible === false) {
      return (
        <Chip
          icon={<CancelIcon />}
          label="Not Eligible"
          color="error"
          size="small"
          variant="outlined"
        />
      );
    }

    return (
      <Chip
        label="Eligibility Unknown"
        color="default"
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <Card
      raised={isDetailed}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: isDetailed ? 8 : 3
        }
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              {program.programName}
            </Typography>
            {program.isSaved && (
              <StarIcon sx={{ ml: 1, color: theme.palette.warning.main }} />
            )}
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            {program.countryFlagUrl && (
              <Box
                component="img"
                src={program.countryFlagUrl}
                alt={program.countryName}
                sx={{ width: 24, height: 16, mr: 1, border: '1px solid', borderColor: 'divider' }}
              />
            )}
            <Typography variant="body2" color="text.secondary">
              {program.countryName}
            </Typography>
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {renderEligibilityStatus(program.isEligible)}
          </Box>
        }
      />

      <CardContent sx={{ pt: 0, pb: 1, flexGrow: 1 }}>
        {/* Success Probability */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Success Probability:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
              value={getRatingFromProbability(program.successProbability)}
              readOnly
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={`${program.successProbability}%`}
              size="small"
              sx={{
                bgcolor: getProbabilityColor(program.successProbability),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Box>

        {/* Key Information */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
              <Typography variant="body2">
                {formatProcessingTime(program.estimatedProcessingTime)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
              <Typography variant="body2">
                {formatCost(program.estimatedCost)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Program Type */}
        <Box sx={{ mb: 1 }}>
          <Chip
            label={program.programType || 'General Immigration'}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mr: 0.5, mb: 0.5 }}
          />
          {program.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>

        {/* Short Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {program.shortDescription || program.description?.substring(0, 120) + '...' || 'No description available.'}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <Tooltip title={program.isSaved ? "Remove from Saved" : "Save Program"}>
          <IconButton onClick={handleSaveProgram} aria-label="save program">
            {program.isSaved ? (
              <StarIcon sx={{ color: theme.palette.warning.main }} />
            ) : (
              <StarBorderIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title={isInComparison ? "Already in Comparison" : "Add to Comparison"}>
          <span>
            <IconButton
              onClick={handleAddToComparison}
              disabled={isInComparison}
              aria-label="add to comparison"
            >
              <CompareArrowsIcon />
            </IconButton>
          </span>
        </Tooltip>

        {!isDetailed && (
          <Button
            component={RouterLink}
            to={`/recommendations/${program._id}`}
            size="small"
            sx={{ ml: 'auto' }}
          >
            View Details
          </Button>
        )}

        <ExpandButton
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ ml: isDetailed ? 'auto' : 0 }}
        >
          <ExpandMoreIcon />
        </ExpandButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Tabs for different sections */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<InfoIcon />} label="Details" />
            <Tab icon={<BarChartIcon />} label="Explanation" />
            {comparisonPrograms.length > 0 && <Tab icon={<CompareIcon />} label="Comparison" />}
          </Tabs>

          {/* Details Tab */}
          {activeTab === 0 && (
            <>
              {/* Full Description */}
              {program.description && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Program Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {program.description}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Requirements */}
              <Typography variant="subtitle2" gutterBottom>
                Program Requirements
              </Typography>
              <List dense disablePadding>
                {/* Language Requirement */}
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LanguageIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Language Requirement"
                    secondary={program.requirements?.language || 'None specified'}
                  />
                </ListItem>

                {/* Education Requirement */}
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <SchoolIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Education Requirement"
                    secondary={program.requirements?.education || 'None specified'}
                  />
                </ListItem>

                {/* Work Experience */}
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <WorkIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Work Experience"
                    secondary={program.requirements?.workExperience || 'None specified'}
                  />
                </ListItem>

                {/* Investment Required */}
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AttachMoneyIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Investment Required"
                    secondary={
                      program.requirements?.investmentRequired ?
                      `Yes${program.requirements?.investmentAmount ? ` (${formatCost(program.requirements.investmentAmount)})` : ''}` :
                      'No'
                    }
                  />
                </ListItem>
              </List>

              {/* Additional Requirements */}
              {program.requirements?.additional && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    Additional Requirements:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {program.requirements.additional}
                  </Typography>
                </Box>
              )}

              {/* Official Links */}
              {program.officialLinks && program.officialLinks.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Official Resources
                  </Typography>
                  <List dense disablePadding>
                    {program.officialLinks.map((link, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {link.type === 'document' ? (
                            <DescriptionIcon fontSize="small" color="primary" />
                          ) : (
                            <LinkIcon fontSize="small" color="primary" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Link
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              {link.title}
                              <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
                            </Link>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          )}

          {/* Explanation Tab */}
          {activeTab === 1 && (
            <Box>
              {/* Detailed Explanation */}
              <RecommendationExplanation
                program={program}
                profile={profile}
                matchFactors={program.matchFactors || [
                  { name: 'Education', type: 'education', contribution: 25, explanation: 'Your education level meets the program requirements.' },
                  { name: 'Work Experience', type: 'work', contribution: 15, explanation: 'You have relevant work experience in the required field.' },
                  { name: 'Language Proficiency', type: 'language', contribution: 20, explanation: 'Your language skills meet the minimum requirements.' },
                  { name: 'Age', type: 'personal', contribution: -5, explanation: 'Your age is slightly outside the preferred range.' }
                ]}
                successFactors={program.successFactors || [
                  { name: 'Education Level', type: 'education', impact: 20, description: 'Your education level meets the requirements for most programs.' },
                  { name: 'Language Proficiency', type: 'language', impact: 15, description: 'Your language skills are sufficient for many immigration pathways.' },
                  { name: 'Work Experience', type: 'work', impact: -10, description: 'Additional work experience would improve your eligibility for skilled worker programs.' }
                ]}
                isDetailed={true}
              />

              {/* Visual Explanation */}
              <Box sx={{ mt: 3 }}>
                <VisualExplanation
                  program={program}
                  matchFactors={program.matchFactors || [
                    { name: 'Education', type: 'education', contribution: 25 },
                    { name: 'Work Experience', type: 'work', contribution: 15 },
                    { name: 'Language Proficiency', type: 'language', contribution: 20 },
                    { name: 'Age', type: 'personal', contribution: -5 },
                    { name: 'Financial', type: 'financial', contribution: 10 }
                  ]}
                  successFactors={program.successFactors || [
                    { name: 'Education Level', type: 'education', impact: 20 },
                    { name: 'Language Proficiency', type: 'language', impact: 15 },
                    { name: 'Work Experience', type: 'work', impact: -10 },
                    { name: 'Financial Status', type: 'financial', impact: 5 },
                    { name: 'Age Factor', type: 'personal', impact: -5 }
                  ]}
                  comparisonPrograms={comparisonPrograms}
                  chartType="radar"
                />
              </Box>
            </Box>
          )}

          {/* Comparison Tab */}
          {activeTab === 2 && comparisonPrograms.length > 0 && (
            <ComparisonExplanation
              programs={[program, ...comparisonPrograms]}
              profile={profile}
              isDetailed={true}
            />
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

ProgramInfoCard.propTypes = {
  program: PropTypes.shape({
    _id: PropTypes.string,
    programName: PropTypes.string,
    countryName: PropTypes.string,
    countryFlagUrl: PropTypes.string,
    programType: PropTypes.string,
    tags: PropTypes.array,
    successProbability: PropTypes.number,
    matchScore: PropTypes.number,
    estimatedProcessingTime: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
        average: PropTypes.number
      })
    ]),
    estimatedCost: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
        average: PropTypes.number,
        currency: PropTypes.string
      })
    ]),
    shortDescription: PropTypes.string,
    description: PropTypes.string,
    requirements: PropTypes.shape({
      language: PropTypes.string,
      education: PropTypes.string,
      workExperience: PropTypes.string,
      investmentRequired: PropTypes.bool,
      investmentAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
      additional: PropTypes.string
    }),
    officialLinks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
        type: PropTypes.string
      })
    ),
    matchFactors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        contribution: PropTypes.number,
        explanation: PropTypes.string
      })
    ),
    successFactors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        impact: PropTypes.number,
        description: PropTypes.string
      })
    ),
    isEligible: PropTypes.bool,
    isSaved: PropTypes.bool
  }),
  profile: PropTypes.object,
  onSaveProgram: PropTypes.func,
  onAddToComparison: PropTypes.func,
  isInComparison: PropTypes.bool,
  isDetailed: PropTypes.bool,
  comparisonPrograms: PropTypes.array
};

export default ProgramInfoCard;
