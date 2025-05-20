import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Button,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
  LinearProgress
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

/**
 * GapAnalysisWidget component
 * Displays qualification gaps and recommendations for closing them
 *
 * @param {Object} props - Component props
 * @param {Array} props.gaps - Array of qualification gaps
 * @param {Array} props.recommendations - Array of recommendations for closing gaps
 * @param {Object} props.timeline - Timeline for closing all gaps
 * @param {boolean} props.isLoading - Loading state
 * @returns {React.ReactElement} GapAnalysisWidget component
 */
const GapAnalysisWidget = ({
  gaps = [],
  recommendations = [],
  timeline = { minMonths: 3, maxMonths: 6 },
  isLoading = false
}) => {
  // Ensure gaps and recommendations are arrays
  const safeGaps = Array.isArray(gaps) ? gaps : [];
  const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];
  const theme = useTheme();

  // Get icon for gap category
  const getGapIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'education':
        return <SchoolIcon fontSize="small" />;
      case 'work experience':
        return <WorkIcon fontSize="small" />;
      case 'language':
        return <LanguageIcon fontSize="small" />;
      case 'financial':
        return <AttachMoneyIcon fontSize="small" />;
      case 'time':
        return <AccessTimeIcon fontSize="small" />;
      default:
        return <WarningIcon fontSize="small" />;
    }
  };

  // Get color for gap severity
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return theme.palette.error.main;
      case 'major':
        return theme.palette.warning.main;
      case 'moderate':
        return theme.palette.info.main;
      case 'minor':
        return theme.palette.success.main;
      default:
        return theme.palette.warning.main;
    }
  };

  // Get background color for gap severity
  const getSeverityBgColor = (severity) => {
    const color = getSeverityColor(severity);
    return alpha(color, 0.1);
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Qualification Gap Analysis
        </Typography>
        <Tooltip title="This analysis identifies gaps between your qualifications and program requirements, with recommendations to improve your eligibility">
          <InfoOutlinedIcon
            color="action"
            sx={{ cursor: 'pointer' }}
            aria-label="This analysis identifies gaps between your qualifications and program requirements, with recommendations to improve your eligibility"
            role="img"
          />
        </Tooltip>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress
            size={60}
            thickness={5}
            aria-label="Loading gap analysis data"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </Box>
      ) : (
        <>
          {/* Timeline Estimation */}
          <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
            <Typography variant="subtitle1" component="h3" fontWeight="medium" sx={{ mb: 1 }}>
              <AccessTimeIcon
                sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main }}
                aria-hidden="true"
              />
              Estimated Timeline to Eligibility
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Based on identified gaps, you could become eligible for this program in:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color="primary.main"
                aria-label={`${timeline?.minMonths || 0} to ${timeline?.maxMonths || 0} months estimated timeline to eligibility`}
              >
                {timeline?.minMonths || 0}-{timeline?.maxMonths || 0} months
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Qualification Gaps */}
          <Typography variant="subtitle1" component="h3" fontWeight="medium" sx={{ mb: 1 }}>
            <WarningIcon
              sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.warning.main }}
              aria-hidden="true"
            />
            Qualification Gaps
          </Typography>

          {safeGaps.length > 0 ? (
            <List sx={{ mb: 3 }}>
              {safeGaps.map((gap, index) => (
                <ListItem key={index} sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: getSeverityBgColor(gap.severity),
                  border: '1px solid',
                  borderColor: getSeverityColor(gap.severity)
                }}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {getGapIcon(gap.category)}
                        </ListItemIcon>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {gap.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={gap.severity || 'Moderate'}
                        size="small"
                        sx={{
                          bgcolor: getSeverityColor(gap.severity),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ ml: 5, mb: 1 }}>
                      {gap.description}
                    </Typography>

                    <Box sx={{ ml: 5, mt: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '45%' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          Current:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {gap.currentValue}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '45%' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          Required:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {gap.requiredValue}
                        </Typography>
                      </Box>
                    </Box>

                    {gap.timeToClose && (
                      <Box sx={{ ml: 5, mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Estimated time to close gap:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={100}
                            sx={{
                              flexGrow: 1,
                              height: 8,
                              borderRadius: 1,
                              bgcolor: alpha(theme.palette.primary.main, 0.2)
                            }}
                          />
                          <Typography variant="body2" fontWeight="medium">
                            {gap.timeToClose}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mb: 3 }}>
              No significant qualification gaps identified.
            </Typography>
          )}

          {/* Action Recommendations */}
          <Typography variant="subtitle1" component="h3" fontWeight="medium" sx={{ mb: 1 }}>
            <AssignmentIcon
              sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main }}
              aria-hidden="true"
            />
            Recommended Actions
          </Typography>

          {safeRecommendations.length > 0 ? (
            <List>
              {safeRecommendations.map((recommendation, index) => (
                <ListItem key={index} sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.2)
                }}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
                      {recommendation.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {recommendation.description}
                    </Typography>

                    {recommendation.steps && recommendation.steps.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                          Steps:
                        </Typography>
                        <List dense disablePadding>
                          {recommendation.steps.map((step, stepIndex) => (
                            <ListItem key={stepIndex} sx={{ py: 0.5 }}>
                              <Typography variant="body2">
                                {stepIndex + 1}. {step}
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {recommendation.timeframe && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary">
                          Timeframe: {recommendation.timeframe}
                        </Typography>
                      </Box>
                    )}

                    {recommendation.difficulty && (
                      <Chip
                        label={`Difficulty: ${recommendation.difficulty}`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    )}

                    {recommendation.impact && (
                      <Chip
                        label={`Impact: ${recommendation.impact}`}
                        size="small"
                        color="primary"
                      />
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              No specific recommendations available.
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
};

export default GapAnalysisWidget;
