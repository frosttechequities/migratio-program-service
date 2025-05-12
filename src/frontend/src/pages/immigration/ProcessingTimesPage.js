import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  useTheme,
  alpha,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import ResearchBreadcrumbs from '../../components/immigration/ResearchBreadcrumbs';

/**
 * Processing Times page component
 * Displays immigration processing times data for different countries and programs
 * 
 * @returns {React.ReactElement} Processing Times page component
 */
const ProcessingTimesPage = () => {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    country: '',
    programType: ''
  });

  // Sample countries based on research data
  const countries = [
    'All Countries',
    'Australia',
    'Canada',
    'Germany',
    'New Zealand',
    'United Kingdom',
    'United States'
  ];

  // Sample program types based on research data
  const programTypes = [
    'All Programs',
    'Skilled Worker',
    'Family Sponsorship',
    'Business/Investor',
    'Student',
    'Temporary Work'
  ];

  // Processing times data from research
  const processingTimesData = [
    {
      id: 1,
      country: 'Canada',
      program: 'Express Entry (CEC)',
      programType: 'Skilled Worker',
      processingTime: '6-8 months',
      successRate: 87,
      lastUpdated: 'April 2025',
      notes: 'Processing times have improved by 15% since January 2025 due to increased staffing.'
    },
    {
      id: 2,
      country: 'Canada',
      program: 'Express Entry (FSW)',
      programType: 'Skilled Worker',
      processingTime: '8-12 months',
      successRate: 82,
      lastUpdated: 'April 2025',
      notes: 'International applicants face longer processing times due to additional verification steps.'
    },
    {
      id: 3,
      country: 'Canada',
      program: 'Provincial Nominee Program',
      programType: 'Skilled Worker',
      processingTime: '15-19 months',
      successRate: 89,
      lastUpdated: 'March 2025',
      notes: 'Processing times vary significantly by province. BC and Ontario are fastest.'
    },
    {
      id: 4,
      country: 'Canada',
      program: 'Family Sponsorship (Spouse)',
      programType: 'Family Sponsorship',
      processingTime: '12-16 months',
      successRate: 92,
      lastUpdated: 'April 2025',
      notes: 'Inland applications are processed faster than outland applications.'
    },
    {
      id: 5,
      country: 'United States',
      program: 'Employment-Based (EB-2)',
      programType: 'Skilled Worker',
      processingTime: '18-24 months',
      successRate: 76,
      lastUpdated: 'March 2025',
      notes: 'Significant backlog for applicants from India and China due to country caps.'
    },
    {
      id: 6,
      country: 'United States',
      program: 'Family-Based (IR-1/CR-1)',
      programType: 'Family Sponsorship',
      processingTime: '12-18 months',
      successRate: 88,
      lastUpdated: 'April 2025',
      notes: 'Processing times have increased by 2 months since December 2024.'
    },
    {
      id: 7,
      country: 'United States',
      program: 'EB-5 Investor Visa',
      programType: 'Business/Investor',
      processingTime: '24-36 months',
      successRate: 82,
      lastUpdated: 'February 2025',
      notes: 'New regulations have streamlined the process for certain investment categories.'
    },
    {
      id: 8,
      country: 'Australia',
      program: 'Skilled Independent Visa (189)',
      programType: 'Skilled Worker',
      processingTime: '9-12 months',
      successRate: 85,
      lastUpdated: 'April 2025',
      notes: '75% of applications are processed within 9 months.'
    },
    {
      id: 9,
      country: 'Australia',
      program: 'Employer Nomination Scheme (186)',
      programType: 'Skilled Worker',
      processingTime: '12-18 months',
      successRate: 91,
      lastUpdated: 'March 2025',
      notes: 'Direct Entry stream has longer processing times than Temporary Residence Transition stream.'
    },
    {
      id: 10,
      country: 'Australia',
      program: 'Partner Visa (820/801)',
      programType: 'Family Sponsorship',
      processingTime: '20-24 months',
      successRate: 86,
      lastUpdated: 'April 2025',
      notes: 'Initial processing for temporary component (820) is typically 12-15 months.'
    },
    {
      id: 11,
      country: 'United Kingdom',
      program: 'Skilled Worker Visa',
      programType: 'Skilled Worker',
      processingTime: '3-4 weeks',
      successRate: 94,
      lastUpdated: 'April 2025',
      notes: 'Priority service reduces processing time to 5 working days for an additional fee.'
    },
    {
      id: 12,
      country: 'United Kingdom',
      program: 'Family Visa (Spouse/Partner)',
      programType: 'Family Sponsorship',
      processingTime: '6-8 months',
      successRate: 82,
      lastUpdated: 'March 2025',
      notes: 'Financial requirement is the most common reason for refusal.'
    },
    {
      id: 13,
      country: 'United Kingdom',
      program: 'Innovator Founder Visa',
      programType: 'Business/Investor',
      processingTime: '3-6 weeks',
      successRate: 78,
      lastUpdated: 'April 2025',
      notes: 'Endorsement from an approved body is the most challenging requirement.'
    },
    {
      id: 14,
      country: 'New Zealand',
      program: 'Skilled Migrant Category',
      programType: 'Skilled Worker',
      processingTime: '12-18 months',
      successRate: 83,
      lastUpdated: 'March 2025',
      notes: 'EOI selection has resumed after pandemic pause with new point thresholds.'
    },
    {
      id: 15,
      country: 'New Zealand',
      program: 'Work to Residence',
      programType: 'Skilled Worker',
      processingTime: '4-6 months',
      successRate: 89,
      lastUpdated: 'April 2025',
      notes: 'Accredited employer pathway has faster processing times.'
    },
    {
      id: 16,
      country: 'Germany',
      program: 'EU Blue Card',
      programType: 'Skilled Worker',
      processingTime: '1-3 months',
      successRate: 92,
      lastUpdated: 'April 2025',
      notes: 'Processing is faster for shortage occupations in STEM fields.'
    },
    {
      id: 17,
      country: 'Germany',
      program: 'Family Reunification Visa',
      programType: 'Family Sponsorship',
      processingTime: '3-6 months',
      successRate: 87,
      lastUpdated: 'March 2025',
      notes: 'Basic German language requirement may be waived in certain circumstances.'
    },
    {
      id: 18,
      country: 'Germany',
      program: 'Job Seeker Visa',
      programType: 'Skilled Worker',
      processingTime: '2-3 months',
      successRate: 76,
      lastUpdated: 'February 2025',
      notes: 'Proof of sufficient funds is critical for approval.'
    }
  ];

  // Handle filter change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter processing times data based on selected filters
  const filteredData = processingTimesData.filter(item => {
    if (filters.country && filters.country !== 'All Countries' && item.country !== filters.country) {
      return false;
    }
    if (filters.programType && filters.programType !== 'All Programs' && item.programType !== filters.programType) {
      return false;
    }
    return true;
  });

  // Function to render success rate with color-coded chip
  const renderSuccessRate = (rate) => {
    let color = 'success';
    if (rate < 80) color = 'warning';
    if (rate < 70) color = 'error';
    
    return (
      <Chip 
        label={`${rate}%`} 
        color={color} 
        size="small" 
        variant={color === 'success' ? 'filled' : 'outlined'}
        sx={{ fontWeight: 500 }}
      />
    );
  };

  // Function to render processing time progress bar
  const renderProcessingTimeBar = (time) => {
    // Extract the maximum number of months from the time range
    const maxMonths = parseInt(time.split('-')[1] || time.split(' ')[0]);
    
    // Calculate progress percentage (capped at 100%)
    // Using 36 months (3 years) as the maximum for the scale
    const progressPercent = Math.min((maxMonths / 36) * 100, 100);
    
    // Determine color based on processing time
    let color = theme.palette.success.main;
    if (maxMonths > 12) color = theme.palette.warning.main;
    if (maxMonths > 24) color = theme.palette.error.main;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ width: '70%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(color, 0.2),
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
                borderRadius: 4
              }
            }}
          />
        </Box>
        <Box sx={{ minWidth: 80 }}>
          <Typography variant="body2" color="text.secondary">
            {time}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <ResearchBreadcrumbs
        currentPage="Processing Times"
        icon={<AccessTimeIcon fontSize="small" />}
      />

      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Immigration Processing Times
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Compare current processing times and success rates for immigration programs across different countries based on our latest research data
      </Typography>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="country-filter-label">Country</InputLabel>
              <Select
                labelId="country-filter-label"
                id="country-filter"
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                label="Country"
              >
                <MenuItem value="">All Countries</MenuItem>
                {countries.filter(c => c !== 'All Countries').map(country => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="program-type-filter-label">Program Type</InputLabel>
              <Select
                labelId="program-type-filter-label"
                id="program-type-filter"
                name="programType"
                value={filters.programType}
                onChange={handleFilterChange}
                label="Program Type"
              >
                <MenuItem value="">All Programs</MenuItem>
                {programTypes.filter(p => p !== 'All Programs').map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredData.length} of {processingTimesData.length} programs
        </Typography>
      </Box>

      {/* Processing times table */}
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          mb: 4,
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Country</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Program</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Processing Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Success Rate</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.country}
                </TableCell>
                <TableCell>{row.program}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.programType} 
                    size="small" 
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 500
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ width: '20%' }}>
                  {renderProcessingTimeBar(row.processingTime)}
                </TableCell>
                <TableCell>{renderSuccessRate(row.successRate)}</TableCell>
                <TableCell>{row.lastUpdated}</TableCell>
                <TableCell>
                  <Tooltip title={row.notes} placement="top">
                    <InfoIcon fontSize="small" color="action" sx={{ cursor: 'pointer' }} />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* No results message */}
      {filteredData.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" gutterBottom>
            No processing times data found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or check back later for updated information
          </Typography>
        </Paper>
      )}

      {/* Processing times insights */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.info.main, 0.05)
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Processing Times Insights
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    Fastest Processing
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  The UK Skilled Worker Visa currently has the fastest processing time at 3-4 weeks, with a 94% success rate.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Priority processing can reduce this to just 5 working days.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CancelIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    Longest Processing
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  The US EB-5 Investor Visa has the longest processing time at 24-36 months, though it maintains an 82% success rate.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recent regulatory changes aim to streamline this process.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    Recent Trends
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Canada's Express Entry processing times have improved by 15% since January 2025 due to increased staffing and system improvements.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Most countries are showing gradual improvements in processing efficiency.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProcessingTimesPage;
