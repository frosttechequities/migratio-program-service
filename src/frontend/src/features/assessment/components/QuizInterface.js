import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Removed duplicate import below
import { Box, CircularProgress, Typography, Alert, Button, FormHelperText } from '@mui/material'; // Added FormHelperText
import QuestionRenderer from './QuestionRenderer';
// Removed import for assessmentService as thunks will use it
// import assessmentService from '../assessmentService';
// Import Redux slice actions and selector
import { startQuizSession, submitQuizAnswer, selectQuizState, resetAssessment } from '../assessmentSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const QuizInterface = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For redirecting after completion

  // Select state from Redux store
  const {
      currentQuestion,
      sessionId,
      isLoading,
      error,
      progress,
      isComplete
  } = useSelector(selectQuizState);

  // Local state ONLY for the current answer being typed/selected and validation
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [validationError, setValidationError] = useState(''); // State for validation error message

  // Reset answer and validation state when the question changes
  useEffect(() => {
    if (currentQuestion) {
      if (currentQuestion.type === 'multiple_choice') {
        setCurrentAnswer([]); // Use empty array for multi-select
      } else {
        setCurrentAnswer(''); // Default to empty string for others
      }
    } else {
      setCurrentAnswer(null); // Reset if no question
    }
    setValidationError(''); // Clear validation error on question change
  }, [currentQuestion]);

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


     // Dispatch the thunk to submit the answer
     dispatch(submitQuizAnswer({ sessionId, questionId: currentQuestion.id, answer: currentAnswer }));
     // State updates (isLoading, nextQuestion, progress, isComplete, error) are handled by the slice reducers
  };

  // Effect to handle quiz completion navigation
  useEffect(() => {
      if (isComplete) {
          // Navigate to results/recommendations page after a short delay?
          console.log("Quiz complete, navigating soon...");
          const timer = setTimeout(() => {
              navigate('/recommendations'); // Or '/assessment/results'
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
      {/* Display Question Text */}
      <Typography variant="h6" gutterBottom>
        {currentQuestion.section || 'Question'} {/* Display section if available */}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {currentQuestion.text}
      </Typography>

      {/* Render the question input */}
      <Box sx={{ mb: 2 }}>
        <QuestionRenderer
          question={currentQuestion}
          currentAnswer={currentAnswer}
          onChange={setCurrentAnswer} // Update local answer state
          disabled={isLoading}
        />
         {/* Display Validation Error */}
         {validationError && (
            <FormHelperText error sx={{ mt: 1 }}>
                {validationError}
            </FormHelperText>
         )}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
         {/* TODO: Implement Back button logic - requires storing question history */}
         <Button variant="outlined" disabled={true /* isLoading || !canGoBack */}>
             Back (Placeholder)
         </Button>
        <Button
            variant="contained"
            onClick={handleAnswerSubmit}
            // Disable if loading OR if validation error exists
            disabled={isLoading || !!validationError}
        >
            {isLoading ? <CircularProgress size={24} /> : (isComplete ? 'Finish' : 'Next')}
        </Button>
      </Box>

      {/* Progress Bar */}
       <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="caption" display="block" gutterBottom>Progress: {progress}%</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                   <Box sx={{ height: 8, backgroundColor: 'grey.300', borderRadius: '4px' }}>
                      <Box sx={{ width: `${progress}%`, height: '100%', backgroundColor: 'primary.main', borderRadius: '4px', transition: 'width 0.5s ease-in-out' }} />
                   </Box>
                </Box>
            </Box>
        </Box>
    </Box>
  );
};

export default QuizInterface;
