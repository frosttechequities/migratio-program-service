const EnhancedAdaptiveQuizEngine = require('../engine/QuizEngine');
// Assuming QuizEngine is instantiated per request or managed appropriately
// Add error handling utilities

exports.startQuiz = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID comes from auth middleware
    if (!userId) {
        return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }

    // TODO: Instantiate QuizEngine with real dependencies (QuestionBank, Services, Repo)
    const quizEngine = new EnhancedAdaptiveQuizEngine();
    const { session, currentQuestion } = await quizEngine.initializeSession(userId);

    if (!currentQuestion) {
         return res.status(200).json({
            status: 'success',
            message: 'Quiz already completed or no questions available.',
            sessionId: session.id,
            progress: 100,
            nextQuestion: null,
            isComplete: true
        });
    }

    res.status(200).json({
      status: 'success',
      sessionId: session.id, // Send session ID back to client
      progress: session.progress,
      nextQuestion: currentQuestion, // Send the first question
      isComplete: false
    });
  } catch (err) {
    console.error("START QUIZ ERROR:", err);
    res.status(500).json({ status: 'error', message: 'Error starting quiz session' });
  }
};

exports.submitAnswer = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID comes from auth middleware
     if (!userId) {
        return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }

    const { sessionId, questionId, answer } = req.body;

    // Basic validation
    if (!sessionId || !questionId || answer === undefined) {
        return res.status(400).json({ status: 'fail', message: 'Missing sessionId, questionId, or answer in request body.' });
    }

    // TODO: Instantiate QuizEngine with real dependencies
    const quizEngine = new EnhancedAdaptiveQuizEngine();

    // Process the answer using the engine
    // Note: The engine needs access to the correct session state (e.g., load from DB using sessionId/userId)
    // The current implementation uses an in-memory store keyed by userId, which needs refinement.
    const result = await quizEngine.processAnswer(userId, questionId, answer);

    res.status(200).json({
      status: 'success',
      sessionId: sessionId, // Echo back session ID
      progress: result.progress,
      nextQuestion: result.nextQuestion, // Send the next question or null if complete
      isComplete: result.isComplete,
      recommendations: result.recommendations // Send final recommendations if complete
    });

  } catch (err) {
    console.error("SUBMIT ANSWER ERROR:", err);
    // Handle specific errors like 'Invalid session state' from the engine
    if (err.message.includes("Invalid session state")) {
        return res.status(400).json({ status: 'fail', message: err.message });
    }
    res.status(500).json({ status: 'error', message: 'Error processing answer' });
  }
};

// Add other potential controller functions (e.g., getQuizStatus, saveProgress explicitly)
