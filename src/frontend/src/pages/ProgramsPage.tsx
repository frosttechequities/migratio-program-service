import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardActions, Button, Chip, CircularProgress, Alert } from '@mui/material';
import { programService } from '../services/programService';
import type { Program, Country } from '../services/programService';

/**
 * Programs Page Component
 * 
 * Displays a list of immigration programs fetched from the Program Service API.
 */
const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch programs and countries on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch programs and countries in parallel
        const [programsData, countriesData] = await Promise.all([
          programService.fetchPrograms(),
          programService.fetchCountries()
        ]);
        
        // Create a map of countries by code for easy lookup
        const countryMap = new Map<string, Country>();
        countriesData.forEach(country => {
          countryMap.set(country.countryCode, country);
        });
        
        // Enhance programs with country data
        const enhancedPrograms = programsData.map(program => {
          if (typeof program.country === 'string') {
            const countryData = countryMap.get(program.countryCode);
            if (countryData) {
              return { ...program, country: countryData };
            }
          }
          return program;
        });
        
        setPrograms(enhancedPrograms);
        setCountries(countriesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading immigration programs...
        </Typography>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading programs: {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  // Render empty state
  if (programs.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          No immigration programs available at the moment.
        </Alert>
      </Container>
    );
  }

  // Render programs
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Immigration Programs
      </Typography>
      
      <Typography variant="body1" paragraph>
        Explore immigration programs from around the world. Each program includes details about eligibility, 
        processing times, required documents, and more.
      </Typography>
      
      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid item xs={12} md={6} key={program.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="h2">
                    {program.name}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {typeof program.country === 'string' 
                      ? program.country 
                      : `${program.country.flagEmoji} ${program.country.name}`}
                  </Typography>
                  <Chip 
                    label={program.category} 
                    size="small" 
                    sx={{ ml: 1 }} 
                  />
                </Box>
                
                <Typography variant="body2" paragraph>
                  {program.description}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  {program.pathwayToResidency && (
                    <Chip 
                      label="Pathway to Residency" 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1, mb: 1 }} 
                    />
                  )}
                  {program.pathwayToCitizenship && (
                    <Chip 
                      label="Pathway to Citizenship" 
                      size="small" 
                      color="secondary" 
                      sx={{ mr: 1, mb: 1 }} 
                    />
                  )}
                </Box>
              </CardContent>
              
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
                {program.officialWebsite && (
                  <Button 
                    size="small" 
                    href={program.officialWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Official Website
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProgramsPage;
