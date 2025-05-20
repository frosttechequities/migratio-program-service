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
  IconButton,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  useTheme
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FilterList as FilterListIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  CompareArrows as CompareArrowsIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

/**
 * ProgramComparisonView component
 * Displays a comparison table for multiple immigration programs
 *
 * @param {Object} props - Component props
 * @param {Array} props.programs - Array of program objects to compare
 * @param {Function} props.onSaveProgram - Callback for saving a program
 * @param {Function} props.onRemoveProgram - Callback for removing a program from comparison
 * @param {boolean} props.isLoading - Loading state
 * @returns {React.ReactElement} ProgramComparisonView component
 */
const ProgramComparisonView = ({
  programs = [],
  onSaveProgram = () => {},
  onRemoveProgram = () => {},
  isLoading = false
}) => {
  const theme = useTheme();
  const [sortConfig, setSortConfig] = useState({ key: 'successProbability', direction: 'desc' });
  const [visibleColumns, setVisibleColumns] = useState({
    programName: true,
    countryName: true,
    successProbability: true,
    processingTime: true,
    estimatedCost: true,
    languageRequirement: true,
    educationRequirement: true,
    workExperience: true,
    investmentRequired: true
  });
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted programs with improved error handling
  const getSortedPrograms = () => {
    // Ensure programs is an array
    if (!Array.isArray(programs)) return [];

    try {
      const sortablePrograms = [...programs];
      if (sortConfig && sortConfig.key) {
        sortablePrograms.sort((a, b) => {
          try {
            // Handle nested properties
            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);

            // Handle null/undefined values
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            // Handle different data types
            if (typeof aValue !== typeof bValue) {
              // Convert to strings for comparison if types don't match
              const aString = String(aValue);
              const bString = String(bValue);
              return sortConfig.direction === 'asc'
                ? aString.localeCompare(bString)
                : bString.localeCompare(aString);
            }

            // Normal comparison for same types
            if (aValue < bValue) {
              return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
              return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
          } catch (error) {
            console.error('Error sorting programs:', error);
            return 0; // Keep original order on error
          }
        });
      }
      return sortablePrograms;
    } catch (error) {
      console.error('Error in getSortedPrograms:', error);
      return [];
    }
  };

  // Get nested value from object using dot notation with improved error handling
  const getNestedValue = (obj, path) => {
    if (!obj) return null;
    if (!path) return null;

    try {
      const keys = path.split('.');
      let value = obj;

      for (const key of keys) {
        if (value === null || value === undefined) return null;
        value = value[key];
      }

      return value;
    } catch (error) {
      console.error('Error in getNestedValue:', error);
      return null;
    }
  };

  // Handle column menu open
  const handleColumnMenuOpen = (event) => {
    setColumnMenuAnchor(event.currentTarget);
  };

  // Handle column menu close
  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
  };

  // Handle column visibility toggle
  const handleColumnToggle = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column]
    });
  };

  // Format processing time with improved error handling
  const formatProcessingTime = (time) => {
    if (!time) return 'Unknown';

    try {
      if (typeof time === 'string') {
        return time;
      }

      if (typeof time === 'number') {
        return `${time} months`;
      }

      if (typeof time !== 'object') {
        return 'Varies';
      }

      if (time.average) {
        return `${time.average} months`;
      }

      if (time.min && time.max) {
        return `${time.min}-${time.max} months`;
      }

      return 'Varies';
    } catch (error) {
      console.error('Error formatting processing time:', error);
      return 'Unknown';
    }
  };

  // Format cost with improved error handling
  const formatCost = (cost) => {
    if (!cost) return 'Unknown';

    try {
      // Handle direct number value
      if (typeof cost === 'number') {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        });
        return formatter.format(cost);
      }

      // Handle string value
      if (typeof cost === 'string') {
        return cost;
      }

      // Handle non-object value
      if (typeof cost !== 'object') {
        return 'Unknown';
      }

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

      if (cost.value) {
        return formatter.format(cost.value);
      }

      return 'Varies';
    } catch (error) {
      console.error('Error formatting cost:', error);
      return 'Unknown';
    }
  };

  // Get color for success probability with improved error handling
  const getProbabilityColor = (probability) => {
    try {
      // Handle non-numeric values
      if (typeof probability !== 'number' || isNaN(probability)) {
        return theme.palette.grey[500]; // Default color for invalid values
      }

      // Ensure probability is within valid range
      const validProbability = Math.max(0, Math.min(100, probability));

      if (validProbability >= 80) return theme.palette.success.main;
      if (validProbability >= 60) return theme.palette.success.light;
      if (validProbability >= 40) return theme.palette.primary.main;
      if (validProbability >= 20) return theme.palette.warning.main;
      return theme.palette.error.light;
    } catch (error) {
      console.error('Error getting probability color:', error);
      return theme.palette.grey[500]; // Fallback color
    }
  };

  // Render cell content based on column and value with improved error handling
  const renderCellContent = (program, column) => {
    try {
      if (!program) return 'N/A';
      if (!column) return 'N/A';

      const value = getNestedValue(program, column);

      switch (column) {
        case 'programName':
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" fontWeight="medium">
                {value || 'Unnamed Program'}
              </Typography>
              {program.isSaved && (
                <Tooltip title="Saved Program">
                  <StarIcon fontSize="small" sx={{ ml: 1, color: theme.palette.warning.main }} />
                </Tooltip>
              )}
            </Box>
          );

        case 'countryName':
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {program.countryFlagUrl && (
                <Box
                  component="img"
                  src={program.countryFlagUrl}
                  alt={program.countryName || 'Country Flag'}
                  sx={{ width: 24, height: 16, mr: 1, border: '1px solid', borderColor: 'divider' }}
                  onError={(e) => {
                    console.error('Error loading country flag:', e);
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <Typography variant="body2">{value || 'Unknown Country'}</Typography>
            </Box>
          );

        case 'successProbability':
          return (
            <Chip
              label={value !== null && value !== undefined ? `${value}%` : 'N/A'}
              size="small"
              sx={{
                bgcolor: getProbabilityColor(value),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          );

        case 'processingTime':
          return formatProcessingTime(program.estimatedProcessingTime);

        case 'estimatedCost':
          return formatCost(program.estimatedCost);

        case 'languageRequirement':
          return program.requirements?.language || 'None';

        case 'educationRequirement':
          return program.requirements?.education || 'None';

        case 'workExperience':
          return program.requirements?.workExperience || 'None';

        case 'investmentRequired':
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {program.requirements?.investmentRequired ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
            </Box>
          );

        default:
          return value || 'N/A';
      }
    } catch (error) {
      console.error('Error rendering cell content:', error);
      return 'Error';
    }
  };

  // Get visible columns with improved error handling
  const getVisibleColumns = () => {
    try {
      if (!visibleColumns || typeof visibleColumns !== 'object') {
        return [];
      }

      return Object.entries(visibleColumns)
        .filter(([_, isVisible]) => isVisible)
        .map(([column]) => column);
    } catch (error) {
      console.error('Error getting visible columns:', error);
      return [];
    }
  };

  // Column definitions
  const columns = [
    { id: 'programName', label: 'Program', minWidth: 150 },
    { id: 'countryName', label: 'Country', minWidth: 120 },
    { id: 'successProbability', label: 'Success Probability', minWidth: 100, align: 'center' },
    { id: 'processingTime', label: 'Processing Time', minWidth: 120, align: 'center' },
    { id: 'estimatedCost', label: 'Estimated Cost', minWidth: 120, align: 'right' },
    { id: 'languageRequirement', label: 'Language Requirement', minWidth: 150 },
    { id: 'educationRequirement', label: 'Education Requirement', minWidth: 150 },
    { id: 'workExperience', label: 'Work Experience', minWidth: 150 },
    { id: 'investmentRequired', label: 'Investment Required', minWidth: 100, align: 'center' }
  ];

  // Filter columns based on visibility
  const visibleColumnsList = columns.filter(column => visibleColumns[column.id]);

  // Get sorted programs
  const sortedPrograms = getSortedPrograms();

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" component="h2">
          Program Comparison
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Customize Columns">
            <IconButton size="small" onClick={handleColumnMenuOpen}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={columnMenuAnchor}
            open={Boolean(columnMenuAnchor)}
            onClose={handleColumnMenuClose}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Show/Hide Columns
            </Typography>
            <Divider />
            {columns.map((column) => (
              <MenuItem key={column.id} dense>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visibleColumns[column.id]}
                      onChange={() => handleColumnToggle(column.id)}
                      size="small"
                    />
                  }
                  label={column.label}
                />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="program comparison table" size="small">
          <TableHead>
            <TableRow>
              {visibleColumnsList.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={sortConfig.key === column.id ? sortConfig.direction : false}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: column.align === 'right' ? 'flex-end' : column.align === 'center' ? 'center' : 'flex-start',
                      cursor: 'pointer'
                    }}
                    onClick={() => requestSort(column.id)}
                  >
                    {column.label}
                    {sortConfig.key === column.id ? (
                      <Box component="span" sx={{ display: 'inline-flex', ml: 0.5 }}>
                        {sortConfig.direction === 'asc' ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </Box>
                    ) : null}
                  </Box>
                </TableCell>
              ))}
              <TableCell align="center" style={{ minWidth: 100 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPrograms.map((program, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={program._id || program.programId || `program-${index}`}>
                {visibleColumnsList.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {renderCellContent(program, column.id)}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        component={Link}
                        to={`/recommendations/${program._id || program.programId}`}
                        data-testid={`view-details-${program._id || program.programId || index}`}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={program.isSaved ? "Remove from Saved" : "Save Program"}>
                      <IconButton
                        size="small"
                        onClick={() => onSaveProgram(program._id || program.programId, !program.isSaved)}
                        data-testid={`save-program-${program._id || program.programId || index}`}
                      >
                        {program.isSaved ? (
                          <StarIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
                        ) : (
                          <StarBorderIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from Comparison">
                      <IconButton
                        size="small"
                        onClick={() => onRemoveProgram(program._id || program.programId)}
                        data-testid={`remove-program-${program._id || program.programId || index}`}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {programs.length === 0 && (
              <TableRow>
                <TableCell colSpan={visibleColumnsList.length + 1} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No programs to compare. Add programs to start comparison.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

ProgramComparisonView.propTypes = {
  programs: PropTypes.array,
  onSaveProgram: PropTypes.func,
  onRemoveProgram: PropTypes.func,
  isLoading: PropTypes.bool
};

export default ProgramComparisonView;
