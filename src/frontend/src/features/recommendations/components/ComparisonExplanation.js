import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FilterList as FilterListIcon,
  CompareArrows as CompareArrowsIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';

/**
 * ComparisonExplanation component
 * Provides detailed explanations for comparing multiple programs
 * 
 * @param {Object} props - Component props
 * @param {Array} props.programs - Array of programs to compare
 * @param {Object} props.profile - User profile data
 * @param {boolean} props.isDetailed - Whether to show detailed view
 * @returns {React.ReactElement} ComparisonExplanation component
 */
const ComparisonExplanation = ({
  programs = [],
  profile = {},
  isDetailed = false
}) => {
  const theme = useTheme();
  const [sortConfig, setSortConfig] = useState({ key: 'matchScore', direction: 'desc' });
  const [expanded, setExpanded] = useState(false);

  // Ensure programs is an array
  const safePrograms = Array.isArray(programs) ? programs : [];

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted programs
  const getSortedPrograms = () => {
    const sortablePrograms = [...safePrograms];
    
    sortablePrograms.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sortablePrograms;
  };

  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.success.light;
    if (score >= 40) return theme.palette.warning.main;
    if (score >= 20) return theme.palette.warning.light;
    return theme.palette.error.light;
  };

  // Get requirement status icon
  const getRequirementStatusIcon = (met) => {
    if (met === true) {
      return <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.success.main }} />;
    }
    if (met === false) {
      return <CancelIcon fontSize="small" sx={{ color: theme.palette.error.main }} />;
    }
    return <HelpOutlineIcon fontSize="small" sx={{ color: theme.palette.grey[500] }} />;
  };

  // Generate comparison explanation text
  const generateComparisonExplanation = () => {
    if (safePrograms.length < 2) {
      return "Select multiple programs to see a detailed comparison explanation.";
    }

    const sortedPrograms = getSortedPrograms();
    const topProgram = sortedPrograms[0];
    const secondProgram = sortedPrograms[1];

    const matchDiff = topProgram.matchScore - secondProgram.matchScore;
    const successDiff = topProgram.successProbability - secondProgram.successProbability;

    return `
      Based on your profile, ${topProgram.programName} (${topProgram.countryName}) is your top recommendation with a ${topProgram.matchScore}% match score and ${topProgram.successProbability}% success probability.
      
      Compared to ${secondProgram.programName} (${secondProgram.countryName}), it has a ${Math.abs(matchDiff).toFixed(1)}% ${matchDiff > 0 ? 'higher' : 'lower'} match score and ${Math.abs(successDiff).toFixed(1)}% ${successDiff > 0 ? 'higher' : 'lower'} success probability.
      
      The key differences are in ${getKeyDifferences(topProgram, secondProgram).join(', ')}.
    `;
  };

  // Get key differences between programs
  const getKeyDifferences = (program1, program2) => {
    const differences = [];

    // Compare processing time
    if (program1.processingTime !== program2.processingTime) {
      differences.push('processing time');
    }

    // Compare estimated cost
    if (program1.estimatedCost !== program2.estimatedCost) {
      differences.push('cost');
    }

    // Compare language requirements
    if (program1.languageRequirement !== program2.languageRequirement) {
      differences.push('language requirements');
    }

    // Compare education requirements
    if (program1.educationRequirement !== program2.educationRequirement) {
      differences.push('education requirements');
    }

    // Compare work experience requirements
    if (program1.workExperience !== program2.workExperience) {
      differences.push('work experience requirements');
    }

    return differences.length > 0 ? differences : ['overall eligibility criteria'];
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Program Comparison Explanation
        </Typography>
        
        <Typography variant="body1" paragraph>
          {generateComparisonExplanation()}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Side-by-Side Comparison
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Program
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => requestSort('matchScore')}
                  >
                    Match Score
                    {sortConfig.key === 'matchScore' && (
                      sortConfig.direction === 'asc' ? 
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => requestSort('successProbability')}
                  >
                    Success Probability
                    {sortConfig.key === 'successProbability' && (
                      sortConfig.direction === 'asc' ? 
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">Key Requirements</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getSortedPrograms().map((program, index) => (
                <TableRow key={program.id || `program-${index}`} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {program.programName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {program.countryName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={`${program.matchScore}%`}
                      size="small"
                      sx={{ 
                        bgcolor: getScoreColor(program.matchScore),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={`${program.successProbability}%`}
                      size="small"
                      sx={{ 
                        bgcolor: getScoreColor(program.successProbability),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {program.requirements?.map((req, idx) => (
                        <Tooltip key={idx} title={req.description || req.name}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getRequirementStatusIcon(req.met)}
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                              {req.name}
                            </Typography>
                          </Box>
                        </Tooltip>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {isDetailed && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<CompareArrowsIcon />}
              onClick={() => {}}
            >
              View Full Comparison
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

ComparisonExplanation.propTypes = {
  programs: PropTypes.array,
  profile: PropTypes.object,
  isDetailed: PropTypes.bool
};

export default ComparisonExplanation;
