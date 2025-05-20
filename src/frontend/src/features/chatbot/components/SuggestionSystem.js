import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Collapse,
  Fade,
  useTheme
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ArrowForward as ArrowForwardIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';

import { sendMessage, addUserMessage, selectContext } from '../chatbotSlice';

/**
 * SuggestionSystem component
 * Provides personalized suggestions based on user profile and activity
 * 
 * @returns {React.ReactElement} SuggestionSystem component
 */
const SuggestionSystem = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  // Get context from Redux
  const context = useSelector(selectContext);
  
  // Component state
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [dismissedSuggestions, setDismissedSuggestions] = useState([]);
  
  // Toggle expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Dismiss suggestion
  const dismissSuggestion = (suggestionId) => {
    setDismissedSuggestions([...dismissedSuggestions, suggestionId]);
    
    // If current suggestion is dismissed, set next suggestion as current
    if (currentSuggestion && currentSuggestion.id === suggestionId) {
      const remainingSuggestions = suggestions.filter(
        (suggestion) => !dismissedSuggestions.includes(suggestion.id) && suggestion.id !== suggestionId
      );
      
      if (remainingSuggestions.length > 0) {
        setCurrentSuggestion(remainingSuggestions[0]);
      } else {
        setCurrentSuggestion(null);
        setIsVisible(false);
      }
    }
  };
  
  // Accept suggestion
  const acceptSuggestion = (suggestion) => {
    if (suggestion.action === 'message') {
      // Send message to chatbot
      dispatch(addUserMessage(suggestion.message));
      dispatch(sendMessage(suggestion.message));
    } else if (suggestion.action === 'navigate') {
      // Navigate to URL
      window.location.href = suggestion.url;
    }
    
    // Dismiss suggestion
    dismissSuggestion(suggestion.id);
  };
  
  // Generate personalized suggestions based on user profile and activity
  useEffect(() => {
    // This would typically come from an API, but for now we'll use some hardcoded suggestions
    const personalizedSuggestions = [
      {
        id: 'suggestion-1',
        type: 'task',
        priority: 'high',
        title: 'Complete your language test',
        description: 'Your profile indicates you haven\'t taken a language test yet. This is required for most immigration programs.',
        action: 'navigate',
        url: '/roadmap',
        icon: 'language'
      },
      {
        id: 'suggestion-2',
        type: 'document',
        priority: 'medium',
        title: 'Upload your education credentials',
        description: 'Adding your education documents will help us provide more accurate recommendations.',
        action: 'navigate',
        url: '/documents',
        icon: 'school'
      },
      {
        id: 'suggestion-3',
        type: 'program',
        priority: 'medium',
        title: 'Explore Provincial Nominee Programs',
        description: 'Based on your profile, you may be eligible for provincial nomination, which can increase your chances.',
        action: 'message',
        message: 'Tell me about Provincial Nominee Programs',
        icon: 'location_city'
      },
      {
        id: 'suggestion-4',
        type: 'assessment',
        priority: 'low',
        title: 'Update your work experience',
        description: 'Your work experience details are incomplete. Updating this information will improve your recommendations.',
        action: 'navigate',
        url: '/profile',
        icon: 'work'
      }
    ];
    
    // Filter out dismissed suggestions
    const filteredSuggestions = personalizedSuggestions.filter(
      (suggestion) => !dismissedSuggestions.includes(suggestion.id)
    );
    
    setSuggestions(filteredSuggestions);
    
    // Set current suggestion
    if (filteredSuggestions.length > 0 && !currentSuggestion) {
      setCurrentSuggestion(filteredSuggestions[0]);
    }
  }, [dismissedSuggestions, context]);
  
  // If no suggestions or all dismissed, return null
  if (!isVisible || suggestions.length === 0) return null;
  
  // Get icon for suggestion
  const getSuggestionIcon = (suggestion) => {
    switch (suggestion.icon) {
      case 'language':
        return '🗣️';
      case 'school':
        return '🎓';
      case 'work':
        return '💼';
      case 'location_city':
        return '🏙️';
      default:
        return '💡';
    }
  };
  
  // Get color for priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  return (
    <Fade in={isVisible}>
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          width: 320,
          overflow: 'hidden',
          borderRadius: 2,
          zIndex: 999
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LightbulbIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              Personalized Suggestions
            </Typography>
          </Box>
          <Box>
            <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
              <IconButton
                size="small"
                color="inherit"
                onClick={toggleExpand}
                sx={{ mr: 0.5 }}
              >
                {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Dismiss">
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setIsVisible(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Current Suggestion */}
        {currentSuggestion && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Avatar
                sx={{
                  bgcolor: getPriorityColor(currentSuggestion.priority),
                  width: 32,
                  height: 32,
                  mr: 1.5,
                  fontSize: '1.2rem'
                }}
              >
                {getSuggestionIcon(currentSuggestion)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {currentSuggestion.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentSuggestion.description}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                size="small"
                color="inherit"
                onClick={() => dismissSuggestion(currentSuggestion.id)}
              >
                Dismiss
              </Button>
              <Button
                variant="contained"
                size="small"
                color="primary"
                endIcon={currentSuggestion.action === 'navigate' ? <ArrowForwardIcon /> : <CheckIcon />}
                onClick={() => acceptSuggestion(currentSuggestion)}
              >
                {currentSuggestion.action === 'navigate' ? 'Go' : 'Ask'}
              </Button>
            </Box>
          </Box>
        )}
        
        {/* All Suggestions */}
        <Collapse in={isExpanded}>
          <Box sx={{ p: 2, pt: 0, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              All Suggestions
            </Typography>
            
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <Box
                  key={suggestion.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: theme.palette.action.hover,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: theme.palette.action.selected
                    }
                  }}
                  onClick={() => setCurrentSuggestion(suggestion)}
                >
                  <Avatar
                    sx={{
                      bgcolor: getPriorityColor(suggestion.priority),
                      width: 24,
                      height: 24,
                      mr: 1,
                      fontSize: '0.8rem'
                    }}
                  >
                    {getSuggestionIcon(suggestion)}
                  </Avatar>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {suggestion.title}
                  </Typography>
                  <Tooltip title="Dismiss">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissSuggestion(suggestion.id);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                No more suggestions available.
              </Typography>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Fade>
  );
};

export default SuggestionSystem;
