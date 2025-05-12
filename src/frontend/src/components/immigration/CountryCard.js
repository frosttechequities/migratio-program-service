import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Public as PublicIcon,
  EmojiFlags as EmojiFlagsIcon,
  People as PeopleIcon,
  Language as LanguageIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

/**
 * Country profile card component
 * @param {Object} props - Component props
 * @param {Object} props.country - Country profile data
 * @returns {React.ReactNode} Country profile card component
 */
const CountryCard = ({ country }) => {
  const theme = useTheme();
  
  // Get region color
  const getRegionColor = () => {
    switch (country.region) {
      case 'North America':
        return theme.palette.primary.main;
      case 'Europe':
        return theme.palette.info.main;
      case 'Asia':
        return theme.palette.success.main;
      case 'Oceania':
        return theme.palette.purple.main;
      case 'South America':
        return theme.palette.warning.main;
      case 'Africa':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Get system type color
  const getSystemTypeColor = () => {
    if (!country.immigrationSystem || !country.immigrationSystem.systemType) {
      return theme.palette.grey[500];
    }
    
    switch (country.immigrationSystem.systemType) {
      case 'Points-based':
        return theme.palette.primary.main;
      case 'Employer-sponsored':
        return theme.palette.success.main;
      case 'Hybrid':
        return theme.palette.purple.main;
      case 'Quota-based':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: alpha(getRegionColor(), 0.1),
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      >
        <Box>
          <Typography variant="h6" component="h3" gutterBottom>
            {country.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PublicIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {country.region}
            </Typography>
          </Box>
        </Box>
        
        {country.code && (
          <Box 
            sx={{ 
              width: 40, 
              height: 30, 
              backgroundImage: `url(https://flagcdn.com/w40/${country.code.toLowerCase()}.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          />
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {country.immigrationSystem && country.immigrationSystem.systemType && (
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={`${country.immigrationSystem.systemType} Immigration System`}
              size="small"
              sx={{ 
                backgroundColor: alpha(getSystemTypeColor(), 0.1),
                color: getSystemTypeColor(),
                fontWeight: 'medium'
              }}
            />
          </Box>
        )}
        
        {country.immigrationSystem && country.immigrationSystem.keyFeatures && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Key Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {country.immigrationSystem.keyFeatures.map((feature, index) => (
                <Chip 
                  key={index}
                  label={feature}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Immigration Information
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {country.citizenshipInfo && country.citizenshipInfo.residencyRequirement && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmojiFlagsIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Citizenship: {country.citizenshipInfo.residencyRequirement.years} years residency
                </Typography>
              </Box>
            )}
            
            {country.immigrationStatistics && country.immigrationStatistics.totalImmigrants && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Immigrants: {country.immigrationStatistics.totalImmigrants.percentOfPopulation}% of population
                </Typography>
              </Box>
            )}
            
            {country.immigrationSystem && country.immigrationSystem.officialLanguages && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Languages: {country.immigrationSystem.officialLanguages.join(', ')}
                </Typography>
              </Box>
            )}
            
            {country.immigrationSystem && country.immigrationSystem.governingBody && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalanceIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Immigration Authority: {country.immigrationSystem.governingBody.name}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          component={RouterLink}
          to={`/immigration/countries/${country.name}`}
          variant="outlined"
          size="small"
          fullWidth
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

CountryCard.propTypes = {
  country: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string,
    region: PropTypes.string,
    immigrationSystem: PropTypes.object,
    citizenshipInfo: PropTypes.object,
    immigrationStatistics: PropTypes.object
  }).isRequired
};

export default CountryCard;
