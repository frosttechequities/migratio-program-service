const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const assessmentController = require('../controllers/assessment.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Initialize quiz
router.post(
  '/initialize',
  authenticate,
  [
    body('resumeSession')
      .optional()
      .isBoolean()
      .withMessage('resumeSession must be a boolean'),
    body('startSection')
      .optional()
      .isIn(['personal', 'education', 'work', 'language', 'financial', 'immigration', 'preferences'])
      .withMessage('Invalid start section'),
    body('language')
      .optional()
      .isString()
      .withMessage('Language must be a string'),
    validate
  ],
  assessmentController.initializeQuiz
);

// Submit answer
router.post(
  '/answer',
  authenticate,
  [
    body('sessionId')
      .notEmpty()
      .withMessage('Session ID is required'),
    body('questionId')
      .notEmpty()
      .withMessage('Question ID is required'),
    body('answer')
      .exists()
      .withMessage('Answer is required'),
    validate
  ],
  assessmentController.submitAnswer
);

// Get quiz progress
router.get(
  '/progress',
  authenticate,
  assessmentController.getQuizProgress
);

// Save quiz progress
router.post(
  '/save-progress',
  authenticate,
  [
    body('sessionId')
      .notEmpty()
      .withMessage('Session ID is required'),
    validate
  ],
  assessmentController.saveQuizProgress
);

// Get quiz results
router.get(
  '/results',
  authenticate,
  assessmentController.getQuizResults
);

// Admin routes for managing questions
router.get(
  '/questions',
  authenticate,
  authorize(['admin']),
  assessmentController.getAllQuestions
);

router.post(
  '/questions',
  authenticate,
  authorize(['admin']),
  [
    body('questionId')
      .notEmpty()
      .withMessage('Question ID is required'),
    body('text')
      .notEmpty()
      .withMessage('Question text is required'),
    body('section')
      .isIn(['personal', 'education', 'work', 'language', 'financial', 'immigration', 'preferences'])
      .withMessage('Invalid section'),
    body('type')
      .isIn(['single_choice', 'multiple_choice', 'slider', 'date', 'text', 'number', 'file_upload'])
      .withMessage('Invalid question type'),
    body('order')
      .isNumeric()
      .withMessage('Order must be a number'),
    validate
  ],
  assessmentController.createQuestion
);

router.put(
  '/questions/:questionId',
  authenticate,
  authorize(['admin']),
  assessmentController.updateQuestion
);

router.delete(
  '/questions/:questionId',
  authenticate,
  authorize(['admin']),
  assessmentController.deleteQuestion
);

module.exports = router;
