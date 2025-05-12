const QuizEngineService = require('../services/quiz-engine.service');
const AssessmentRecommendationIntegrationService = require('../services/assessment-recommendation-integration.service');
const { Question } = require('../models/question.model');
const { QuizSession } = require('../models/quiz-session.model');
const { Response } = require('../models/response.model');
const { logger } = require('../utils/logger');

// Initialize services
const quizEngine = new QuizEngineService();
const assessmentRecommendationService = new AssessmentRecommendationIntegrationService();

/**
 * Initialize quiz session
 * @route POST /api/assessments/initialize
 * @access Private
 */
const initializeQuiz = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Get options from request
    const { resumeSession, startSection, language } = req.body;

    // Get device info from request
    const deviceInfo = {
      deviceType: req.body.deviceType || 'unknown',
      browser: req.body.browser || 'unknown',
      operatingSystem: req.body.operatingSystem || 'unknown',
      ipAddress: req.ip
    };

    // Create or resume session
    let result;
    if (resumeSession) {
      result = await quizEngine.resumeSession(userId);

      if (!result) {
        // No session found, create new
        result = await quizEngine.createSession(userId, {
          startSection,
          language,
          deviceInfo,
          referrer: req.headers.referer || '',
          quizVersion: '1.0'
        });
      }
    } else {
      // Create new session
      result = await quizEngine.createSession(userId, {
        startSection,
        language,
        deviceInfo,
        referrer: req.headers.referer || '',
        quizVersion: '1.0'
      });
    }

    // Return session and initial question
    res.status(200).json({
      success: true,
      data: {
        sessionId: result.session.sessionId,
        currentQuestion: result.currentQuestion,
        progress: result.session.progress,
        currentSection: result.session.currentSection,
        responses: result.responses || {}
      }
    });
  } catch (error) {
    logger.error('Error initializing quiz:', error);
    next(error);
  }
};

/**
 * Submit answer
 * @route POST /api/assessments/answer
 * @access Private
 */
const submitAnswer = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Get data from request
    const { sessionId, questionId, answer } = req.body;

    // Validate session ownership
    const session = await QuizSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this session'
      });
    }

    // Process answer
    const result = await quizEngine.processAnswer(sessionId, questionId, answer);

    // Return next question
    res.status(200).json({
      success: true,
      data: {
        nextQuestion: result.nextQuestion,
        progress: result.session.progress,
        currentSection: result.session.currentSection,
        isComplete: result.isComplete
      }
    });
  } catch (error) {
    logger.error('Error submitting answer:', error);
    next(error);
  }
};

/**
 * Get quiz progress
 * @route GET /api/assessments/progress
 * @access Private
 */
const getQuizProgress = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Get session ID from query
    const { sessionId } = req.query;

    // Find session
    const session = await QuizSession.findOne({ sessionId });

    // Check if session exists
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user owns session
    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this session'
      });
    }

    // Get responses
    const responses = await Response.getSessionResponses(sessionId);

    // Return progress
    res.status(200).json({
      success: true,
      data: {
        progress: session.progress,
        currentSection: session.currentSection,
        completedSections: session.completedSections,
        responseCount: session.responseCount,
        status: session.status,
        startedAt: session.startedAt,
        lastActivityAt: session.lastActivityAt,
        completedAt: session.completedAt,
        responses: responses.length
      }
    });
  } catch (error) {
    logger.error('Error getting quiz progress:', error);
    next(error);
  }
};

/**
 * Save quiz progress
 * @route POST /api/assessments/save-progress
 * @access Private
 */
const saveQuizProgress = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Get session ID from request
    const { sessionId } = req.body;

    // Find session
    const session = await QuizSession.findOne({ sessionId });

    // Check if session exists
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user owns session
    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this session'
      });
    }

    // Update last activity
    session.updateActivity();
    await session.save();

    // Return success
    res.status(200).json({
      success: true,
      message: 'Progress saved successfully',
      data: {
        savedAt: session.lastActivityAt
      }
    });
  } catch (error) {
    logger.error('Error saving quiz progress:', error);
    next(error);
  }
};

/**
 * Get quiz results
 * @route GET /api/assessments/results
 * @access Private
 */
const getQuizResults = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Get session ID from query
    const { sessionId } = req.query;

    // Find session
    const session = await QuizSession.findOne({ sessionId });

    // Check if session exists
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user owns session
    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this session'
      });
    }

    // Check if quiz is complete
    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Quiz is not complete'
      });
    }

    // Get responses
    const responses = await Response.getSessionResponses(sessionId);

    // Format responses by section
    const responsesBySection = {};
    responses.forEach(response => {
      if (!responsesBySection[response.section]) {
        responsesBySection[response.section] = [];
      }
      responsesBySection[response.section].push({
        questionId: response.questionId,
        questionText: response.questionText,
        responseValue: response.responseValue,
        selectedOptions: response.selectedOptions,
        answeredAt: response.answeredAt
      });
    });

    // Update user profile with assessment results
    await assessmentRecommendationService.updateProfileWithAssessmentResults(userId, sessionId);

    // Generate recommendations based on assessment results
    const recommendationResults = await assessmentRecommendationService.generateRecommendationsFromAssessment(
      userId,
      sessionId
    );

    // Return results with recommendations
    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        responseCount: session.responseCount,
        responsesBySection,
        recommendations: recommendationResults.recommendations,
        processingTime: recommendationResults.processingTime
      }
    });
  } catch (error) {
    logger.error('Error getting quiz results:', error);

    // Return basic results without recommendations if there's an error
    try {
      if (error.message.includes('recommendation')) {
        const session = await QuizSession.findOne({ sessionId: req.query.sessionId });
        const responses = await Response.getSessionResponses(req.query.sessionId);

        // Format responses by section
        const responsesBySection = {};
        responses.forEach(response => {
          if (!responsesBySection[response.section]) {
            responsesBySection[response.section] = [];
          }
          responsesBySection[response.section].push({
            questionId: response.questionId,
            questionText: response.questionText,
            responseValue: response.responseValue,
            selectedOptions: response.selectedOptions,
            answeredAt: response.answeredAt
          });
        });

        return res.status(200).json({
          success: true,
          data: {
            sessionId: session.sessionId,
            startedAt: session.startedAt,
            completedAt: session.completedAt,
            responseCount: session.responseCount,
            responsesBySection,
            recommendationError: error.message
          }
        });
      }
    } catch (fallbackError) {
      logger.error('Error in fallback results handling:', fallbackError);
    }

    next(error);
  }
};

/**
 * Get all questions
 * @route GET /api/assessments/questions
 * @access Private/Admin
 */
const getAllQuestions = async (req, res, next) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const section = req.query.section;
    const isActive = req.query.isActive === 'true';

    // Build query
    const query = {};
    if (section) {
      query.section = section;
    }
    if (req.query.isActive !== undefined) {
      query.isActive = isActive;
    }

    // Get questions
    const questions = await Question.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ section: 1, order: 1 });

    // Get total count
    const total = await Question.countDocuments(query);

    // Return questions
    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error getting all questions:', error);
    next(error);
  }
};

/**
 * Create question
 * @route POST /api/assessments/questions
 * @access Private/Admin
 */
const createQuestion = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Create question
    const question = new Question({
      ...req.body,
      createdBy: userId
    });

    // Save question
    await question.save();

    // Return question
    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });
  } catch (error) {
    logger.error('Error creating question:', error);
    next(error);
  }
};

/**
 * Update question
 * @route PUT /api/assessments/questions/:questionId
 * @access Private/Admin
 */
const updateQuestion = async (req, res, next) => {
  try {
    // Get question ID from params
    const { questionId } = req.params;

    // Find and update question
    const question = await Question.findOneAndUpdate(
      { questionId },
      req.body,
      { new: true, runValidators: true }
    );

    // Check if question exists
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Return updated question
    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });
  } catch (error) {
    logger.error('Error updating question:', error);
    next(error);
  }
};

/**
 * Delete question
 * @route DELETE /api/assessments/questions/:questionId
 * @access Private/Admin
 */
const deleteQuestion = async (req, res, next) => {
  try {
    // Get question ID from params
    const { questionId } = req.params;

    // Find and delete question
    const question = await Question.findOneAndDelete({ questionId });

    // Check if question exists
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Return success
    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting question:', error);
    next(error);
  }
};

module.exports = {
  initializeQuiz,
  submitAnswer,
  getQuizProgress,
  saveQuizProgress,
  getQuizResults,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
