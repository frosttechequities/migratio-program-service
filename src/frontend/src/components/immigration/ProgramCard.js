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
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  Work as WorkIcon,
  Public as PublicIcon
} from '@mui/icons-material';

/**
 * Immigration program card component
 * @param {Object} props - Component props
 * @param {Object} props.program - Immigration program data
 * @returns {React.ReactNode} Immigration program card component
 */
const ProgramCard = ({ program }) => {
  const theme = useTheme();
  
  // Get program type color
  const getTypeColor = () => {
    switch (program.type) {
      case 'Skilled Worker':
        return theme.palette.primary.main;
      case 'Business/Investor':
        return theme.palette.success.main;
      case 'Family Sponsorship':
        return theme.palette.secondary.main;
      case 'Provincial/Regional':
        return theme.palette.info.main;
      case 'Humanitarian':
        return theme.palette.warning.main;
      case 'Student':
        return theme.palette.purple.main;
      case 'Temporary Worker':
        return theme.palette.grey[700];
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Format processing time
  const formatProcessingTime = () => {
    if (!program.processingInfo || !program.processingInfo.standardProcessing) {
      return 'Processing time not available';
    }
    
    const { duration } = program.processingInfo.standardProcessing;
    
    if (duration && duration.min && duration.max && duration.unit) {
      return `${duration.min}-${duration.max} ${duration.unit}`;
    } else if (program.processingInfo.standardProcessing.description) {
      return program.processingInfo.standardProcessing.description;
    } else {
      return 'Processing time not available';
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
          backgroundColor: alpha(getTypeColor(), 0.1),
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h3" gutterBottom>
            {program.name}
          </Typography>
          <Chip 
            label={program.type} 
            size="small"
            sx={{ 
              backgroundColor: alpha(getTypeColor(), 0.1),
              color: getTypeColor(),
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PublicIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {program.country}
          </Typography>
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          {program.overview ? 
            (program.overview.length > 150 ? 
              `${program.overview.substring(0, 150)}...` : 
              program.overview) : 
            'No overview available'}
        </Typography>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Key Requirements
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {program.eligibilityCriteria && program.eligibilityCriteria.ageRequirements && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FlagIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Age: {program.eligibilityCriteria.ageRequirements.minAge}-
                  {program.eligibilityCriteria.ageRequirements.maxAge} years
                </Typography>
              </Box>
            )}
            
            {program.eligibilityCriteria && program.eligibilityCriteria.educationRequirements && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Education: Required
                </Typography>
              </Box>
            )}
            
            {program.eligibilityCriteria && program.eligibilityCriteria.languageRequirements && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Language: Required
                </Typography>
              </Box>
            )}
            
            {program.eligibilityCriteria && program.eligibilityCriteria.workExperienceRequirements && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Work Experience: Required
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                Processing: {formatProcessingTime()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          component={RouterLink}
          to={`/immigration/programs/${program._id}`}
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

ProgramCard.propTypes = {
  program: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    type: PropTypes.string,
    overview: PropTypes.string,
    eligibilityCriteria: PropTypes.object,
    processingInfo: PropTypes.object
  }).isRequired
};

export default ProgramCard;
