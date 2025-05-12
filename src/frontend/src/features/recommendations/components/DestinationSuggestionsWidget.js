import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Tooltip,
  Chip
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public'; // Example icon for country
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { suggestDestinationCountries, selectDestinationSuggestions, selectRecommendationsLoading, selectRecommendationsError } from '../recommendationSlice';

const DestinationSuggestionsWidget = () => {
  const dispatch = useDispatch();
  const suggestions = useSelector(selectDestinationSuggestions);
  const isLoading = useSelector(selectRecommendationsLoading); // Use combined loading state for now
  const error = useSelector(selectRecommendationsError);

  useEffect(() => {
    // Fetch suggestions if not already loaded or loading
    if (!isLoading && suggestions.length === 0 && !error) {
      dispatch(suggestDestinationCountries());
    }
  }, [dispatch, suggestions.length, isLoading, error]);

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Potential Destinations
      </Typography>
      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>}
      {error && <Alert severity="warning" sx={{ mt: 1 }}>Could not load suggestions: {error}</Alert>}
      {!isLoading && !error && suggestions.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          No specific destination suggestions available yet. Complete your profile for better results.
        </Typography>
      )}
      {!isLoading && !error && suggestions.length > 0 && (
        <List dense>
          {suggestions.slice(0, 5).map((suggestion) => ( // Show top 5 suggestions
            <ListItem key={suggestion.countryCode} disablePadding>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                <PublicIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={suggestion.countryName}
                secondary={
                  <Tooltip title={suggestion.reasons?.join(' ') || 'Based on profile match.'} arrow>
                    <span>{`Match Score: ${suggestion.matchScore.toFixed(1)}`} <InfoOutlinedIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle' }} /></span>
                  </Tooltip>
                }
              />
              {/* Optionally add a button/link to explore programs for that country */}
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default DestinationSuggestionsWidget;
