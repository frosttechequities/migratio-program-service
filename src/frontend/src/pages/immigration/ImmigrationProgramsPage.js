import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Public as PublicIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import ResearchBreadcrumbs from '../../components/immigration/ResearchBreadcrumbs';

/**
 * Immigration programs page component
 * @returns {React.ReactNode} Immigration programs page component
 */
const ImmigrationProgramsPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    type: '',
    permanentResidency: ''
  });

  // Program types based on research data
  const programTypes = [
    'Skilled Worker',
    'Business Immigration',
    'Family Sponsorship',
    'Provincial/Regional',
    'Student Pathway',
    'Humanitarian',
    'Work Permit',
    'Investor'
  ];

  // Top immigration countries based on research data
  const countries = [
    'United States',
    'Germany',
    'Saudi Arabia',
    'Russian Federation',
    'United Kingdom',
    'United Arab Emirates',
    'France',
    'Canada',
    'Australia',
    'Spain'
  ];

  // Immigration programs data from research
  const programs = [
    {
      id: 'prog1',
      name: 'Express Entry System',
      country: 'Canada',
      type: 'Skilled Worker',
      permanentResidency: true,
      overview: 'A points-based immigration system that manages applications for three federal economic immigration programs: Federal Skilled Worker Program, Canadian Experience Class, and Federal Skilled Trades Program.',
      processingTime: '6-12 months',
      eligibility: 'Candidates are assigned points based on factors like age, education, work experience, language proficiency, adaptability'
    },
    {
      id: 'prog2',
      name: 'Provincial Nominee Program (PNP)',
      country: 'Canada',
      type: 'Provincial/Regional',
      permanentResidency: true,
      overview: 'Each province and territory has its own PNP streams and criteria for selecting candidates that meet their specific economic needs.',
      processingTime: '6-18 months',
      eligibility: 'Vary by province but generally include skills, education, work experience, language ability, and intention to settle in the province'
    },
    {
      id: 'prog3',
      name: 'EB-5 Immigrant Investor Program',
      country: 'United States',
      type: 'Investor',
      permanentResidency: true,
      overview: 'For investors who make a qualifying investment in a U.S. commercial enterprise and plan to create or preserve 10 permanent full-time jobs for qualified U.S. workers.',
      processingTime: '24-36 months',
      eligibility: 'Investors willing to invest at least $800,000 in a US business and create 10 full-time jobs'
    },
    {
      id: 'prog4',
      name: 'H-1B Visa',
      country: 'United States',
      type: 'Work Permit',
      permanentResidency: false,
      overview: 'Allows U.S. employers to temporarily employ foreign workers in specialty occupations requiring theoretical or technical expertise.',
      processingTime: '3-6 months',
      eligibility: 'Bachelor\'s degree or higher in specific specialty, job offer from U.S. employer in related field'
    },
    {
      id: 'prog5',
      name: 'Global Talent Visa',
      country: 'United Kingdom',
      type: 'Skilled Worker',
      permanentResidency: false,
      overview: 'For talented and promising individuals in specific sectors wishing to work in the UK.',
      processingTime: '3-8 weeks',
      eligibility: 'Endorsement from approved body in fields of academia/research, arts/culture, or digital technology'
    },
    {
      id: 'prog6',
      name: 'Skilled Independent Visa (Subclass 189)',
      country: 'Australia',
      type: 'Skilled Worker',
      permanentResidency: true,
      overview: 'Points-based visa for skilled workers who are not sponsored by an employer or family member or nominated by a state or territory government.',
      processingTime: '8-12 months',
      eligibility: 'Points-based assessment including age, English language ability, skilled employment, education'
    },
    {
      id: 'prog7',
      name: 'EU Blue Card',
      country: 'Germany',
      type: 'Skilled Worker',
      permanentResidency: false,
      overview: 'Work permit for highly-qualified non-EU citizens with a job offer in Germany.',
      processingTime: '1-3 months',
      eligibility: 'University degree, job offer with salary at least 1.5 times the average German salary'
    },
    {
      id: 'prog8',
      name: 'Start-up Visa Program',
      country: 'Canada',
      type: 'Business Immigration',
      permanentResidency: true,
      overview: 'Provides permanent residence to innovative entrepreneurs who have a qualifying business and support from a designated organization.',
      processingTime: '12-16 months',
      eligibility: 'Letter of support from designated organization, language proficiency, sufficient settlement funds'
    },
    {
      id: 'prog9',
      name: 'Family Sponsorship Programs',
      country: 'Canada',
      type: 'Family Sponsorship',
      permanentResidency: true,
      overview: 'Citizens and PRs can sponsor spouses, partners, children, parents, grandparents, and other eligible relatives.',
      processingTime: '12-24 months',
      eligibility: 'Sponsor must meet income requirements and sign an undertaking to support the sponsored relative'
    },
    {
      id: 'prog10',
      name: 'Atlantic Immigration Program',
      country: 'Canada',
      type: 'Provincial/Regional',
      permanentResidency: true,
      overview: 'Employer-driven program that helps employers in Atlantic Canada hire qualified candidates for jobs they haven\'t been able to fill locally.',
      processingTime: '6-12 months',
      eligibility: 'Job offer from designated employer, education/experience requirements, settlement plan'
    },
    {
      id: 'prog11',
      name: 'Talent Passport',
      country: 'France',
      type: 'Skilled Worker',
      permanentResidency: false,
      overview: 'Multi-year residence permit for highly skilled non-EU professionals, entrepreneurs, investors, and their families.',
      processingTime: '2-3 months',
      eligibility: 'Varies by category: highly qualified workers, researchers, entrepreneurs, investors, etc.'
    },
    {
      id: 'prog12',
      name: 'Golden Visa',
      country: 'Spain',
      type: 'Investor',
      permanentResidency: true,
      overview: 'Residence permit for non-EU nationals who make a significant investment in Spanish real estate, public debt, or business projects.',
      processingTime: '2-6 months',
      eligibility: 'Investment of €500,000 in real estate, €1 million in Spanish company shares or bank deposits, or €2 million in government bonds'
    }
  ];

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter programs based on search and filters
  const filteredPrograms = programs.filter(program => {
    // Search term filter
    if (searchTerm && !program.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !program.country.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !program.overview.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Country filter
    if (filters.country && program.country !== filters.country) {
      return false;
    }

    // Type filter
    if (filters.type && program.type !== filters.type) {
      return false;
    }

    // Permanent Residency filter
    if (filters.permanentResidency !== '') {
      const isPR = filters.permanentResidency === 'true';
      if (program.permanentResidency !== isPR) {
        return false;
      }
    }

    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <ResearchBreadcrumbs
        currentPage="Immigration Programs"
        icon={<PublicIcon fontSize="small" />}
      />

      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Immigration Programs
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Explore immigration programs from around the world and find the right pathway for your journey
      </Typography>

      {/* Search and filters */}
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Programs"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
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
                {countries.map(country => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="type-filter-label">Program Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Program Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {programTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="pr-filter-label">Permanent Residency</InputLabel>
              <Select
                labelId="pr-filter-label"
                id="pr-filter"
                name="permanentResidency"
                value={filters.permanentResidency}
                onChange={handleFilterChange}
                label="Permanent Residency"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredPrograms.length} of {programs.length} programs
        </Typography>
      </Box>

      {/* Programs grid */}
      <Grid container spacing={3}>
        {filteredPrograms.map(program => (
          <Grid item xs={12} sm={6} md={4} key={program.id}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.1)}`
                }
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={`/programs/${program.id}`}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {program.country}
                  </Typography>
                  <Chip
                    label={program.type}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {program.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {program.overview}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Processing Time
                      </Typography>
                      <Typography variant="body2">
                        {program.processingTime}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Permanent Residency
                      </Typography>
                      <Typography variant="body2">
                        {program.permanentResidency ? 'Yes' : 'No'}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: theme.palette.primary.main }}>
                    <Typography variant="button" fontWeight={600} sx={{ mr: 1 }}>
                      View Details
                    </Typography>
                    <ArrowForwardIcon fontSize="small" />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No results message */}
      {filteredPrograms.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 2,
            textAlign: 'center',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" gutterBottom>
            No programs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search criteria
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default ImmigrationProgramsPage;
