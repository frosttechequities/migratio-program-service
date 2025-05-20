import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography, Alert, Button, FormHelperText, Paper } from '@mui/material';
import QuestionRenderer from './QuestionRenderer';
// Import Redux slice actions and selector
import {
  startQuizSession,
  submitQuizAnswer,
  selectQuizState,
  resetAssessment,
  analyzeTextWithNlp,
  setPreviousQuestion
} from '../assessmentSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const QuizInterface = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For redirecting after completion

  // Select state from Redux store
  const {
      currentQuestion,
      currentQuestionIndex,
      sessionId,
      isLoading,
      error,
      progress,
      isComplete,
      // questions, // Commented out as it's not used directly
      // NLP related state
      isProcessingNlp,
      nlpResults,
      nlpError
  } = useSelector(selectQuizState);

  // Calculate total questions (used for debugging)
  // const totalQuestions = questions?.length || 0;

  // Local state ONLY for the current answer being typed/selected and validation
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [validationError, setValidationError] = useState(''); // State for validation error message
  const [questionHistory, setQuestionHistory] = useState([]); // Track question history for back navigation
  const [answerHistory, setAnswerHistory] = useState({}); // Track answers for back navigation

  // Reset answer and validation state when the question changes
  useEffect(() => {
    if (currentQuestion) {
      if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'multi-select') {
        setCurrentAnswer([]); // Use empty array for multi-select
      } else {
        setCurrentAnswer(''); // Default to empty string for others
      }
    } else {
      setCurrentAnswer(null); // Reset if no question
    }
    setValidationError(''); // Clear validation error on question change
  }, [currentQuestion]);

  // Handle NLP request for text questions
  const handleNlpRequest = useCallback((text) => {
    if (currentQuestion && (currentQuestion.type === 'free-text-nlp' || currentQuestion.requiresNlp) && text.length > 20) {
      dispatch(analyzeTextWithNlp({ text, questionId: currentQuestion.id }));
    }
  }, [dispatch, currentQuestion]);

  // Fetch the first question or resume session on mount
  useEffect(() => {
    // Dispatch the thunk to start/resume the session
    dispatch(startQuizSession());

    // Optional: Reset assessment state when component unmounts
    // return () => {
    //   dispatch(resetAssessment());
    // };
  }, [dispatch]); // Run only on mount

  const handleAnswerSubmit = () => { // Removed async as thunk handles it
     if (!currentQuestion || !sessionId || isLoading) return;

     // --- Client-side Validation ---
     setValidationError(''); // Clear previous error
     let isValid = true;
     if (currentQuestion?.required && (currentAnswer === null || currentAnswer === '' || (Array.isArray(currentAnswer) && currentAnswer.length === 0))) {
         isValid = false;
         setValidationError('This field is required.');
     }
     // TODO: Add more specific validation based on question.type and question.validation
     // Example: Number range check
     if (isValid && currentQuestion?.type === 'number' && currentQuestion?.validation) {
         const numValue = parseFloat(currentAnswer);
         if (isNaN(numValue)) {
              isValid = false;
              setValidationError('Please enter a valid number.');
         } else {
             if (currentQuestion.validation.min !== undefined && numValue < currentQuestion.validation.min) {
                 isValid = false;
                 setValidationError(`Value must be ${currentQuestion.validation.min} or greater.`);
             }
             if (isValid && currentQuestion.validation.max !== undefined && numValue > currentQuestion.validation.max) {
                  isValid = false;
                  setValidationError(`Value must be ${currentQuestion.validation.max} or less.`);
             }
         }
     }
     // Add checks for date ranges, patterns, file types/size etc.

     if (!isValid) {
         return; // Stop submission if validation fails
     }
     // --- End Validation ---

     // Add current question to history before moving to next
     setQuestionHistory(prev => [...prev, currentQuestion]);

     // Save the current answer in history
     setAnswerHistory(prev => ({
       ...prev,
       [currentQuestion.id]: currentAnswer
     }));

     // Dispatch the thunk to submit the answer
     dispatch(submitQuizAnswer({ sessionId, questionId: currentQuestion.id, answer: currentAnswer }));
     // State updates (isLoading, nextQuestion, progress, isComplete, error) are handled by the slice reducers
  };

  // Handle going back to the previous question
  const handleGoBack = () => {
    if (questionHistory.length === 0) return;

    // Get the previous question from history
    const prevQuestion = questionHistory[questionHistory.length - 1];

    // Update the current question in the Redux store
    dispatch(setPreviousQuestion({
      question: prevQuestion,
      index: currentQuestionIndex - 1
    }));

    // Restore the previous answer
    if (answerHistory[prevQuestion.id] !== undefined) {
      setCurrentAnswer(answerHistory[prevQuestion.id]);
    }

    // Remove the last question from history
    setQuestionHistory(prev => prev.slice(0, -1));
  };

  // Effect to handle quiz completion navigation
  useEffect(() => {
      if (isComplete) {
          // Navigate to results page after a short delay
          console.log("Quiz complete, navigating to results page soon...");
          const timer = setTimeout(() => {
              navigate('/assessment/results'); // Navigate to the correct results page
          }, 1500); // Delay for user to see completion message
          return () => clearTimeout(timer);
      }
  }, [isComplete, navigate]);


  // Initial loading state (before first question arrives from startQuizSession.fulfilled)
  if (isLoading && !currentQuestion && !error && !isComplete) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  // Display error message from Redux state
  if (error) {
    // Allow user to retry starting the quiz?
    return <Alert severity="error" sx={{ m: 2 }}>{error || 'An unknown error occurred.'}</Alert>;
  }

  // Display completion message
  if (isComplete) {
     return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Assessment Complete!</Typography>
            <Typography>Thank you for completing the assessment. Redirecting to your recommendations...</Typography>
            <CircularProgress sx={{ mt: 2 }} />
        </Box>
     );
  }

  // Display message if no question is available (and not loading/error/complete)
  // This might indicate an issue with the quiz flow logic or question bank
  if (!currentQuestion) {
     return <Typography sx={{ p: 3, textAlign: 'center' }}>Loading question or quiz session issue.</Typography>;
  }

  // Render the current question and input
  return (
    <Box>
      {/* Display Section Header if available */}
      {currentQuestion.section && (
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            pb: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'primary.main'
          }}
        >
          {currentQuestion.section}
        </Typography>
      )}

      {/* Display Question Text */}
      <Typography
        variant="subtitle1"
        fontWeight="medium"
        gutterBottom
      >
        {currentQuestion.text}
      </Typography>

      {/* Render the question input */}
      <Box sx={{ mb: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <QuestionRenderer
            question={currentQuestion}
            currentAnswer={currentAnswer}
            onChange={setCurrentAnswer}
            disabled={isLoading}
            // NLP related props
            isProcessingNlp={isProcessingNlp}
            nlpResults={nlpResults}
            onNlpRequest={handleNlpRequest}
          />
        </Paper>

        {/* Display Validation Error */}
        {validationError && (
          <FormHelperText error sx={{ mt: 1 }}>
            {validationError}
          </FormHelperText>
        )}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
         {/* Left side buttons */}
         <Box>
           {/* Back button */}
           <Button
             variant="outlined"
             onClick={handleGoBack}
             disabled={isLoading || questionHistory.length === 0}
             sx={{ mr: 1 }}
           >
             Back
           </Button>

           {/* NLP Analysis button - only show for free-text-nlp questions */}
           {currentQuestion?.type === 'free-text-nlp' && currentAnswer && currentAnswer.length > 20 && (
             <Button
               variant="outlined"
               color="secondary"
               onClick={() => handleNlpRequest(currentAnswer)}
               disabled={isProcessingNlp || !currentAnswer}
               startIcon={isProcessingNlp ? <CircularProgress size={16} /> : null}
               sx={{ mr: 1 }}
             >
               {isProcessingNlp ? 'Analyzing...' : 'Analyze Text'}
             </Button>
           )}
         </Box>

         {/* Right side buttons */}
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
           {/* Reset button */}
           <Button
             variant="outlined"
             color="secondary"
             onClick={() => {
               if (window.confirm('Are you sure you want to reset the assessment? All your progress will be lost.')) {
                 // Reset the assessment state
                 dispatch(resetAssessment());
                 // Start a new session with forceNew=true
                 dispatch(startQuizSession(true));
               }
             }}
             sx={{ mr: 1 }}
           >
             Reset
           </Button>

           {/* Next/Submit button */}
           <Button
             variant="contained"
             onClick={handleAnswerSubmit}
             // Disable if loading OR if validation error exists
             disabled={isLoading || !!validationError}
           >
             {isLoading ? <CircularProgress size={24} /> : (isComplete ? 'Finish' : 'Next')}
           </Button>
         </Box>
      </Box>

      {/* Enhanced Progress Indicator */}
      <Box sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Question {currentQuestionIndex + 1} {/* Don't show total as it's dynamic */}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentQuestion.section || 'Assessment'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <Box sx={{ height: 8, backgroundColor: 'grey.300', borderRadius: '4px' }}>
              <Box
                sx={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundImage: 'linear-gradient(90deg, #4caf50, #2196f3)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-in-out'
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {/* Estimate based on progress rather than total questions */}
            Est. time remaining: {Math.ceil((100 - progress) / 7)} min
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {Math.round(progress)}% complete
          </Typography>
        </Box>

        {/* Add indicator for branching questions */}
        {currentQuestion.nextQuestionLogic && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              color: 'primary.main',
              fontStyle: 'italic'
            }}
          >
            Your answer will determine the next questions
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default QuizInterface;
