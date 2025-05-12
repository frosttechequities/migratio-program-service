const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/recommendations
 * @desc    Generate recommendations based on assessment results
 * @access  Private
 */
router.post('/', authenticate, recommendationController.generateRecommendations);

/**
 * @route   GET /api/recommendations/latest
 * @desc    Get latest recommendation for the current user
 * @access  Private
 */
router.get('/latest', authenticate, recommendationController.getLatestRecommendation);

/**
 * @route   GET /api/recommendations/from-assessment
 * @desc    Get recommendations based on latest assessment
 * @access  Private
 */
router.get('/from-assessment', authenticate, recommendationController.getRecommendationsFromLatestAssessment);

/**
 * @route   GET /api/recommendations/:id
 * @desc    Get recommendation by ID
 * @access  Private
 */
router.get('/:id', authenticate, recommendationController.getRecommendation);

module.exports = router;
