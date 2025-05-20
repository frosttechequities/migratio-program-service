import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Collapse,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

import { selectContext, sendMessage } from '../chatbotSlice';

/**
 * ContextualHelp component
 * Provides context-aware suggestions based on the current page and user activity
 *
 * @returns {React.ReactElement} ContextualHelp component
 */
const ContextualHelp = () => {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get context from Redux
  const context = useSelector(selectContext) || {};

  // Component state
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Toggle expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Generate contextual suggestions based on current page and context
  useEffect(() => {
    const currentPath = location.pathname || '';
    const contextualSuggestions = [];

    // Add page-specific suggestions - match exactly what the tests expect
    if (currentPath.includes('/dashboard')) {
      contextualSuggestions.push(
        'How do I interpret my success probability?',
        'What do the different widgets on my dashboard show?',
        'How can I customize my dashboard?'
      );
    } else if (currentPath.includes('/assessment')) {
      contextualSuggestions.push(
        'How does the assessment affect my recommendations?',
        'Can I retake the assessment?',
        'What information do I need for the assessment?'
      );
    } else if (currentPath.includes('/roadmap')) {
      contextualSuggestions.push(
        'How do I track my progress on the roadmap?',
        'What happens when I complete a task?',
        'Can I customize my roadmap?'
      );
    } else if (currentPath.includes('/documents')) {
      contextualSuggestions.push(
        'What documents do I need to upload?',
        'How secure is my document storage?',
        'Can I share documents with my immigration consultant?'
      );
    } else if (currentPath.includes('/programs')) {
      contextualSuggestions.push(
        'How are programs matched to my profile?',
        'What factors affect my success probability?',
        'How can I improve my eligibility for this program?'
      );
    } else if (currentPath.includes('/recommendations')) {
      contextualSuggestions.push(
        'How are these recommendations generated?',
        'Can I compare different immigration programs?',
        'What actions will improve my chances the most?'
      );
    }

    // Add context-specific suggestions
    if (context?.selectedProgram?.programName) {
      contextualSuggestions.push(
        `Tell me more about the ${context.selectedProgram.programName} program`,
        `What documents do I need for ${context.selectedProgram.programName}?`,
        `What are the processing times for ${context.selectedProgram.programName}?`
      );
    }

    // Add recent activity suggestions
    if (context?.recentActivity && Array.isArray(context.recentActivity) && context.recentActivity.length > 0) {
      const recentActivity = context.recentActivity[0];
      if (recentActivity?.type === 'document_upload') {
        contextualSuggestions.push(
          'What other documents should I prepare?',
          'How do I know if my documents are sufficient?'
        );
      } else if (recentActivity?.type === 'task_complete') {
        contextualSuggestions.push(
          'What\'s my next step in the process?',
          'How am I progressing overall?'
        );
      }
    }

    // Limit to 5 suggestions
    // Make sure we don't have more than 5 suggestions
    const uniqueSuggestions = Array.from(new Set(contextualSuggestions));
    setSuggestions(uniqueSuggestions.slice(0, 5));
  }, [location.pathname, context]);

  // If no suggestions, return null
  if (suggestions.length === 0) return null;

  return (
    <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
          cursor: 'pointer'
        }}
        onClick={toggleExpand}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LightbulbIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight="medium">
            Contextual Suggestions
          </Typography>
        </Box>
        <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
          <IconButton size="small">
            {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ p: 1, pt: 0 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                size="small"
                onClick={() => {
                  // Handle suggestion click by dispatching the message
                  dispatch(sendMessage({ text: suggestion, isUser: true }));
                  // Close the suggestions panel after clicking
                  setIsExpanded(false);
                }}
                sx={{ mb: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ContextualHelp;
