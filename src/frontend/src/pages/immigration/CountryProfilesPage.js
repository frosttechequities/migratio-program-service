import React, { useState } from 'react';
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
  alpha,
  CardMedia
} from '@mui/material';
import {
  Public as PublicIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowForward as ArrowForwardIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import ResearchBreadcrumbs from '../../components/immigration/ResearchBreadcrumbs';

/**
 * Country profiles page component with real research data
 * @returns {React.ReactNode} Country profiles page component
 */
const CountryProfilesPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    region: ''
  });

  // Regions based on research data
  const regions = [
    'North America',
    'Europe',
    'Asia',
    'Middle East',
    'Oceania',
    'South America',
    'Africa'
  ];

  // Country profiles data from research
  const countries = [
    {
      id: 'country1',
      name: 'Canada',
      region: 'North America',
      globalRanking: 8,
      immigrantPopulation: '8 million (21.3% of population)',
      systemType: 'Points-based with various pathways',
      keyFeatures: 'Express Entry system, Provincial Nominee Programs, strong emphasis on skilled workers',
      citizenshipTimeline: '3 years after permanent residence',
      officialWebsite: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
      flagImage: 'https://flagcdn.com/w320/ca.png',
      keyPrograms: [
        'Express Entry System',
        'Provincial Nominee Program (PNP)',
        'Atlantic Immigration Program',
        'Start-up Visa Program',
        'Family Sponsorship Programs'
      ]
    },
    {
      id: 'country2',
      name: 'United States',
      region: 'North America',
      globalRanking: 1,
      immigrantPopulation: '50.6 million (15.3% of population)',
      systemType: 'Family-based and employment-based categories with annual caps',
      keyFeatures: 'Green Card lottery, strong family reunification focus, specialized work visas',
      citizenshipTimeline: '5 years after permanent residence (3 years for spouses of citizens)',
      officialWebsite: 'https://www.uscis.gov/',
      flagImage: 'https://flagcdn.com/w320/us.png',
      keyPrograms: [
        'Family-Based Immigration',
        'Employment-Based Immigration',
        'Diversity Visa Program',
        'H-1B Visa',
        'EB-5 Immigrant Investor Program'
      ]
    },
    {
      id: 'country3',
      name: 'Australia',
      region: 'Oceania',
      globalRanking: 9,
      immigrantPopulation: '7.7 million (30.1% of population)',
      systemType: 'Points-based system with SkillSelect platform',
      keyFeatures: 'Expression of Interest system, state/territory nomination, strong skills focus',
      citizenshipTimeline: '4 years of residence including 1 year as permanent resident',
      officialWebsite: 'https://immi.homeaffairs.gov.au/',
      flagImage: 'https://flagcdn.com/w320/au.png',
      keyPrograms: [
        'Skilled Independent Visa (Subclass 189)',
        'Skilled Nominated Visa (Subclass 190)',
        'Employer Nomination Scheme',
        'Business Innovation and Investment Program',
        'Global Talent Visa'
      ]
    },
    {
      id: 'country4',
      name: 'United Kingdom',
      region: 'Europe',
      globalRanking: 5,
      immigrantPopulation: '9.4 million',
      systemType: 'Points-based system with multiple tiers',
      keyFeatures: 'Post-Brexit immigration system, emphasis on high-skilled workers, new routes for global talent',
      citizenshipTimeline: '5 years of residence plus 1 year with settled status',
      officialWebsite: 'https://www.gov.uk/browse/visas-immigration',
      flagImage: 'https://flagcdn.com/w320/gb.png',
      keyPrograms: [
        'Skilled Worker Visa',
        'Global Talent Visa',
        'Innovator Visa',
        'Start-up Visa',
        'Family Visa'
      ]
    },
    {
      id: 'country5',
      name: 'Germany',
      region: 'Europe',
      globalRanking: 2,
      immigrantPopulation: '15.8 million (18.8% of population)',
      systemType: 'Employment-focused with EU free movement',
      keyFeatures: 'EU Blue Card, Skilled Workers Immigration Act, job-seeker visas',
      citizenshipTimeline: '8 years of legal residence (6 years in special cases)',
      officialWebsite: 'https://www.bamf.de/EN/Startseite/startseite_node.html',
      flagImage: 'https://flagcdn.com/w320/de.png',
      keyPrograms: [
        'EU Blue Card',
        'Skilled Workers Visa',
        'Job Seeker Visa',
        'Self-Employment Visa',
        'Family Reunion Visa'
      ]
    },
    {
      id: 'country6',
      name: 'New Zealand',
      region: 'Oceania',
      globalRanking: 45,
      immigrantPopulation: 'Approximately 1.1 million (22% of population)',
      systemType: 'Points-based system with Expression of Interest',
      keyFeatures: 'Skilled Migrant Category, regional focus, work to residence pathways',
      citizenshipTimeline: '5 years of residence',
      officialWebsite: 'https://www.immigration.govt.nz/',
      flagImage: 'https://flagcdn.com/w320/nz.png',
      keyPrograms: [
        'Skilled Migrant Category',
        'Work to Residence',
        'Investor Visa',
        'Essential Skills Work Visa',
        'Partner of a New Zealander Resident Visa'
      ]
    },
    {
      id: 'country7',
      name: 'France',
      region: 'Europe',
      globalRanking: 7,
      immigrantPopulation: '8.5 million (13.1% of population)',
      systemType: 'Work permit system with talent passport',
      keyFeatures: 'Talent Passport for skilled workers, EU free movement, strong family reunification',
      citizenshipTimeline: '5 years of residence (2 years for graduates of French universities)',
      officialWebsite: 'https://france-visas.gouv.fr/',
      flagImage: 'https://flagcdn.com/w320/fr.png',
      keyPrograms: [
        'Talent Passport',
        'Employee Visa',
        'European Blue Card',
        'Family Reunification',
        'Student Visa'
      ]
    },
    {
      id: 'country8',
      name: 'Singapore',
      region: 'Asia',
      globalRanking: 32,
      immigrantPopulation: 'Approximately 2.2 million (38% of population)',
      systemType: 'Employment Pass system with tiered structure',
      keyFeatures: 'Strict qualification criteria, salary thresholds, quota systems',
      citizenshipTimeline: '2 years as Permanent Resident after 2-6 years on passes',
      officialWebsite: 'https://www.mom.gov.sg/',
      flagImage: 'https://flagcdn.com/w320/sg.png',
      keyPrograms: [
        'Employment Pass',
        'S Pass',
        'Tech.Pass',
        'EntrePass',
        'Global Investor Programme'
      ]
    },
    {
      id: 'country9',
      name: 'United Arab Emirates',
      region: 'Middle East',
      globalRanking: 6,
      immigrantPopulation: '8.7 million (88.1% of population)',
      systemType: 'Employer-sponsored work permits with new long-term visas',
      keyFeatures: 'Golden Visa, Green Visa, employer-sponsored system, no path to citizenship',
      citizenshipTimeline: 'No standard path to citizenship',
      officialWebsite: 'https://u.ae/en/information-and-services/visa-and-emirates-id',
      flagImage: 'https://flagcdn.com/w320/ae.png',
      keyPrograms: [
        'Golden Visa',
        'Green Visa',
        'Employment Visa',
        'Investor Visa',
        'Retirement Visa'
      ]
    },
    {
      id: 'country10',
      name: 'Spain',
      region: 'Europe',
      globalRanking: 10,
      immigrantPopulation: '6.8 million (14.6% of population)',
      systemType: 'Work permit system with EU free movement and investment options',
      keyFeatures: 'Golden Visa for investors, EU Blue Card, Non-Lucrative Visa',
      citizenshipTimeline: '10 years of residence (2 years for nationals of Latin American countries)',
      officialWebsite: 'http://extranjeros.inclusion.gob.es/',
      flagImage: 'https://flagcdn.com/w320/es.png',
      keyPrograms: [
        'Golden Visa',
        'Non-Lucrative Visa',
        'EU Blue Card',
        'Entrepreneur Visa',
        'Family Reunification'
      ]
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

  // Filter countries based on search and filters
  const filteredCountries = countries.filter(country => {
    // Search term filter
    if (searchTerm && !country.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !country.region.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Region filter
    if (filters.region && country.region !== filters.region) {
      return false;
    }

    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <ResearchBreadcrumbs
        currentPage="Country Profiles"
        icon={<PublicIcon fontSize="small" />}
      />

      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Country Profiles
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Explore immigration systems and requirements for countries around the world based on our latest research data
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
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search Countries"
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="region-filter-label">Region</InputLabel>
              <Select
                labelId="region-filter-label"
                id="region-filter"
                name="region"
                value={filters.region}
                onChange={handleFilterChange}
                label="Region"
              >
                <MenuItem value="">All Regions</MenuItem>
                {regions.map(region => (
                  <MenuItem key={region} value={region}>{region}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredCountries.length} of {countries.length} countries
        </Typography>
      </Box>

      {/* Countries grid */}
      <Grid container spacing={3}>
        {filteredCountries.map(country => (
          <Grid item xs={12} md={6} key={country.id}>
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
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box
                    component="img"
                    src={country.flagImage}
                    alt={`${country.name} flag`}
                    sx={{
                      width: 48,
                      height: 32,
                      mr: 2,
                      objectFit: 'cover',
                      borderRadius: 1,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Typography variant="h6" component="h3">
                    {country.name}
                  </Typography>
                  <Chip
                    label={`Rank #${country.globalRanking}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Region:</strong> {country.region}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Immigrant Population:</strong> {country.immigrantPopulation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Immigration System:</strong> {country.systemType}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Citizenship Timeline:</strong> {country.citizenshipTimeline}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Key Immigration Programs:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {country.keyPrograms.slice(0, 3).map((program, index) => (
                          <Chip
                            key={index}
                            label={program}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 500
                            }}
                          />
                        ))}
                        {country.keyPrograms.length > 3 && (
                          <Chip
                            label={`+${country.keyPrograms.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
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
      {filteredCountries.length === 0 && (
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
            No countries found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search criteria
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default CountryProfilesPage;
