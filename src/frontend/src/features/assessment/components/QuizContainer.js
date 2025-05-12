import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuizCard from './QuizCard';
import { getQuestionComponent } from './questions';
import ResponsiveContainer from '../../../components/layout/ResponsiveContainer';

// Debug logger function - removed in favor of direct console.log calls

/**
 * QuizContainer component
 * A container component for the assessment quiz
 *
 * @param {Object} props - Component props
 * @param {Function} props.onInitialize - Function to initialize the quiz
 * @param {Function} props.onSubmitAnswer - Function to submit an answer
 * @param {Function} props.onComplete - Function to call when quiz is complete
 * @param {Function} props.onSaveProgress - Function to save quiz progress
 * @returns {React.ReactElement} QuizContainer component
 */
const QuizContainer = ({
  onInitialize,
  onSubmitAnswer,
  onComplete,
  onSaveProgress
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizState, setQuizState] = useState({
    sessionId: null,
    currentQuestion: null,
    progress: 0,
    isComplete: false,
    answers: {}
  });
  const [currentAnswer, setCurrentAnswer] = useState(null);

  // Initialize quiz on mount
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        console.log('QuizContainer: Initializing quiz');

        const result = await onInitialize();
        console.log('QuizContainer: Quiz initialization result', result);

        // Handle the data structure returned by the service
        const sessionId = result.session?.id || result.sessionId;
        const currentQuestion = result.currentQuestion;
        const progress = result.progress;
        const responses = result.responses || {};

        if (!sessionId || !currentQuestion) {
          console.error('QuizContainer: Missing required data in quiz initialization result', { sessionId, currentQuestion });
          setError('Failed to initialize quiz: Missing required data');
          setLoading(false);
          return;
        }

        console.log('QuizContainer: Setting quiz state with', { sessionId, currentQuestion, progress });

        // Create a clean state object
        const initialState = {
          sessionId: sessionId,
          currentQuestion: currentQuestion,
          progress: progress,
          isComplete: false,
          answers: responses
        };

        // Set the quiz state
        setQuizState(initialState);

        // Set initial answer if available
        if (currentQuestion && responses && responses[currentQuestion.questionId]) {
          setCurrentAnswer(responses[currentQuestion.questionId]);
        } else {
          setCurrentAnswer(null);
        }

        setLoading(false);
      } catch (err) {
        console.error('QuizContainer: Quiz initialization error', err);
        setError('Failed to initialize quiz. Please try again.');
        setLoading(false);
      }
    };

    initializeQuiz();
  }, [onInitialize]);

  // Handle answer change
  const handleAnswerChange = useCallback((value) => {
    setCurrentAnswer(value);
  }, []);

  // Handle next question
  const handleNext = useCallback(async () => {
    // Add console log for debugging
    console.log('NEXT BUTTON CLICKED - handleNext function called');
    console.log('Current quiz state:', quizState);
    console.log('Current answer:', currentAnswer);

    // Validate required data
    if (!quizState.sessionId || !quizState.currentQuestion) {
      console.error('Missing required data for submitting answer:', {
        sessionId: quizState.sessionId,
        currentQuestion: quizState.currentQuestion
      });
      setError('Missing required data. Please reload the page and try again.');
      return;
    }

    try {
      // Start loading
      setLoading(true);

      // Store current question info before async operation
      const currentQuestionId = quizState.currentQuestion.questionId;
      const currentSessionId = quizState.sessionId;

      console.log('Submitting answer:', {
        sessionId: currentSessionId,
        questionId: currentQuestionId,
        answer: currentAnswer
      });

      // Submit answer - wrap in try/catch for detailed error logging
      let result;
      try {
        result = await onSubmitAnswer(
          currentSessionId,
          currentQuestionId,
          currentAnswer
        );
        console.log('Answer submission successful, result:', result);
      } catch (submitError) {
        console.error('Error during onSubmitAnswer call:', submitError);
        throw submitError;
      }

      console.log('Answer submission result:', result);

      // Validate the result structure
      if (!result) {
        console.error('QuizContainer: Result is null or undefined');
        setError('Invalid response from server. Please try again.');
        setLoading(false);
        return;
      }

      // Handle quiz completion
      if (result.isComplete) {
        console.log('QuizContainer: Quiz is complete', result);

        // Update state to complete
        setQuizState(prevState => ({
          ...prevState,
          isComplete: true,
          progress: { ...prevState.progress, percentage: 100 }
        }));

        // Call onComplete callback
        if (onComplete) {
          try {
            onComplete();
          } catch (completeError) {
            console.error('QuizContainer: Error in onComplete callback', completeError);
          }
        }

        setLoading(false);
        return;
      }

      // Handle next question
      if (!result.nextQuestion) {
        console.error('QuizContainer: Next question is missing', result);
        setError('Failed to get next question. Please try again.');
        setLoading(false);
        return;
      }

      console.log('QuizContainer: Moving to next question', result.nextQuestion);

      // Store the current answer
      const updatedAnswers = {
        ...quizState.answers,
        [currentQuestionId]: currentAnswer
      };

      try {
        // Force a complete state reset with new data
        setQuizState({
          sessionId: currentSessionId,
          currentQuestion: result.nextQuestion,
          progress: result.progress,
          isComplete: false,
          answers: updatedAnswers
        });

        console.log('QuizContainer: State updated with next question');

        // Reset current answer for the new question
        setCurrentAnswer(null);
      } catch (stateError) {
        console.error('QuizContainer: Error updating state', stateError);
        setError('An error occurred while updating the quiz. Please try again.');
      }

      // Finish loading
      setLoading(false);
    } catch (err) {
      console.error('QuizContainer: Answer submission error', err);
      setError('Failed to submit answer. Please try again.');
      setLoading(false);
    }
  }, [quizState, currentAnswer, onSubmitAnswer, onComplete]);

  // Handle back button
  const handleBack = useCallback(() => {
    // This would require backend support for navigating back
    // For now, we'll just show an alert
    alert('Going back is not supported in this version.');
  }, []);

  // Handle skip question
  const handleSkip = useCallback(async () => {
    console.log('SKIP BUTTON CLICKED - handleSkip function called');
    console.log('Current quiz state:', quizState);

    // Validate required data
    if (!quizState.sessionId || !quizState.currentQuestion) {
      console.error('QuizContainer: Missing required data for skipping question', {
        sessionId: quizState.sessionId,
        currentQuestion: quizState.currentQuestion
      });
      setError('Missing required data. Please reload the page and try again.');
      return;
    }

    try {
      // Start loading
      setLoading(true);

      // Store current question info before async operation
      const currentQuestionId = quizState.currentQuestion.questionId;
      const currentSessionId = quizState.sessionId;

      console.log('QuizContainer: Skipping question', {
        sessionId: currentSessionId,
        questionId: currentQuestionId
      });

      // Submit null answer to skip
      let result;
      try {
        result = await onSubmitAnswer(
          currentSessionId,
          currentQuestionId,
          null
        );
        console.log('QuizContainer: Skip submission successful, result:', result);
      } catch (skipError) {
        console.error('QuizContainer: Error during skip submission:', skipError);
        throw skipError;
      }

      // Validate the result structure
      if (!result) {
        console.error('QuizContainer: Skip result is null or undefined');
        setError('Invalid response from server. Please try again.');
        setLoading(false);
        return;
      }

      // Handle quiz completion
      if (result.isComplete) {
        console.log('QuizContainer: Quiz is complete after skip', result);

        // Update state to complete
        setQuizState(prevState => ({
          ...prevState,
          isComplete: true,
          progress: { ...prevState.progress, percentage: 100 }
        }));

        // Call onComplete callback
        if (onComplete) {
          try {
            onComplete();
          } catch (completeError) {
            console.error('QuizContainer: Error in onComplete callback after skip', completeError);
          }
        }

        setLoading(false);
        return;
      }

      // Handle next question
      if (!result.nextQuestion) {
        console.error('QuizContainer: Next question is missing after skip', result);
        setError('Failed to get next question. Please try again.');
        setLoading(false);
        return;
      }

      console.log('QuizContainer: Moving to next question after skip', result.nextQuestion);

      try {
        // Force a complete state reset with new data
        setQuizState({
          sessionId: currentSessionId,
          currentQuestion: result.nextQuestion,
          progress: result.progress,
          isComplete: false,
          answers: quizState.answers
        });

        console.log('QuizContainer: State updated with next question after skip');

        // Reset current answer
        setCurrentAnswer(null);
      } catch (stateError) {
        console.error('QuizContainer: Error updating state after skip', stateError);
        setError('An error occurred while updating the quiz. Please try again.');
      }

      // Finish loading
      setLoading(false);
    } catch (err) {
      console.error('QuizContainer: Skip question error', err);
      setError('Failed to skip question. Please try again.');
      setLoading(false);
    }
  }, [quizState, onSubmitAnswer, onComplete]);

  // Handle save progress
  const handleSaveProgress = useCallback(async () => {
    if (!quizState.sessionId) return;

    try {
      await onSaveProgress(quizState.sessionId);
      alert('Your progress has been saved. You can continue later.');
    } catch (err) {
      setError('Failed to save progress. Please try again.');
      console.error('Save progress error:', err);
    }
  }, [quizState.sessionId, onSaveProgress]);

  // Get the appropriate question component
  const QuestionComponent = useMemo(() => {
    return quizState.currentQuestion
      ? getQuestionComponent(quizState.currentQuestion.type)
      : null;
  }, [quizState.currentQuestion]);

  // Render loading state
  if (loading && !quizState.currentQuestion) {
    return (
      <ResponsiveContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      </ResponsiveContainer>
    );
  }

  // Render error state
  if (error) {
    return (
      <ResponsiveContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error}
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Alert>
        </Box>
      </ResponsiveContainer>
    );
  }

  // Render completion state
  if (quizState.isComplete) {
    return (
      <ResponsiveContainer>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 8 }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: 'success.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 80, color: 'white' }} />
          </Box>
          <Typography variant="h3" gutterBottom>
            Assessment Complete!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mb: 4 }}>
            Thank you for completing the assessment. We're now generating your personalized immigration recommendations.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onComplete}
            sx={{ minWidth: 200 }}
          >
            View Results
          </Button>
        </Box>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer backgroundColor={theme.palette.background.default}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* Quiz header */}
        <Box sx={{ width: '100%', maxWidth: 800, mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Immigration Assessment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Answer the following questions to receive personalized immigration recommendations.
          </Typography>
        </Box>

        {/* Quiz card */}
        {quizState.currentQuestion && (
          <Box sx={{ width: '100%', position: 'relative' }}>
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  borderRadius: 4,
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <QuizCard
              question={quizState.currentQuestion}
              progress={quizState.progress}
              onNext={handleNext}
              onBack={quizState.currentQuestion.allowBack ? handleBack : null}
              onSkip={!quizState.currentQuestion.required ? handleSkip : null}
            >
              {QuestionComponent && (
                <QuestionComponent
                  value={currentAnswer}
                  onChange={handleAnswerChange}
                  options={quizState.currentQuestion.options}
                  validation={quizState.currentQuestion.validation}
                  helperText={quizState.currentQuestion.helpText}
                  placeholder={quizState.currentQuestion.placeholder}
                  multiline={quizState.currentQuestion.multiline}
                  rows={quizState.currentQuestion.rows || 4}
                  min={quizState.currentQuestion.validation?.min}
                  max={quizState.currentQuestion.validation?.max}
                  step={quizState.currentQuestion.validation?.step}
                  minLabel={quizState.currentQuestion.minLabel}
                  maxLabel={quizState.currentQuestion.maxLabel}
                  valueLabel={quizState.currentQuestion.valueLabel}
                  acceptedFileTypes={quizState.currentQuestion.acceptedFileTypes}
                  maxFileSize={quizState.currentQuestion.maxFileSize}
                  maxFiles={quizState.currentQuestion.maxFiles}
                />
              )}
            </QuizCard>
          </Box>
        )}

        {/* Save progress button */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="text"
            color="primary"
            onClick={handleSaveProgress}
            disabled={loading}
          >
            Save Progress & Continue Later
          </Button>
        </Box>
      </Box>
    </ResponsiveContainer>
  );
};

export default QuizContainer;
