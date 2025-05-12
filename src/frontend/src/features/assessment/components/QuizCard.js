import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Debug logger function - removed in favor of direct console.log calls

/**
 * QuizCard component
 * A card component for displaying quiz questions
 *
 * @param {Object} props - Component props
 * @param {Object} props.question - Question object
 * @param {number} props.progress - Quiz progress (0-100)
 * @param {Function} props.onNext - Function to call when next button is clicked
 * @param {Function} props.onBack - Function to call when back button is clicked
 * @param {Function} props.onSkip - Function to call when skip button is clicked
 * @param {React.ReactNode} props.children - Child components (question content)
 * @returns {React.ReactElement} QuizCard component
 */
const QuizCard = ({
  question,
  progress = 0,
  onNext,
  onBack,
  onSkip,
  children
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!question) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #0066FF 0%, #5271FF 100%)',
          },
        }}
      />

      {/* Question header */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={question.section ? question.section.charAt(0).toUpperCase() + question.section.slice(1) : 'Question'}
            color="primary"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              mt: 1,
              pr: 2,
              flex: 1,
            }}
          >
            {question.text}
          </Typography>
          {question.helpText && (
            <Tooltip title={question.helpText} arrow placement="top">
              <IconButton size="small" color="primary" sx={{ mt: 1 }}>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Question content */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          backgroundColor: 'background.default',
          minHeight: 200,
        }}
      >
        {children}
      </Box>

      {/* Question footer */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          disabled={!onBack}
          variant="outlined"
          color="secondary"
          sx={{ order: { xs: 2, sm: 1 } }}
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 2, order: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
          {onSkip && (
            <Button
              onClick={() => {
                console.log('QuizCard: Skip button clicked', {
                  questionId: question.questionId,
                  questionType: question.type,
                  questionText: question.text
                });
                if (onSkip) {
                  try {
                    onSkip();
                  } catch (skipError) {
                    console.error('QuizCard: Error in skip button handler', skipError);
                  }
                }
              }}
              variant="text"
              color="inherit"
              sx={{ color: 'text.secondary' }}
            >
              Skip
            </Button>
          )}
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              console.log('QuizCard: Next button clicked', {
                questionId: question.questionId,
                questionType: question.type,
                questionText: question.text
              });
              if (onNext) {
                try {
                  onNext();
                } catch (nextError) {
                  console.error('QuizCard: Error in next button handler', nextError);
                }
              } else {
                console.error('QuizCard: onNext handler is not defined');
              }
            }}
            variant="contained"
            color="primary"
            sx={{
              minWidth: isMobile ? '100%' : 120,
              flex: isMobile ? 1 : 'none'
            }}
          >
            {question.isLastQuestion ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default QuizCard;
