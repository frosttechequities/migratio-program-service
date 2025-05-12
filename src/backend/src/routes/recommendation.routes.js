const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @route POST /api/recommendations
 * @desc Generate recommendations
 * @access Private
 */
router.post('/', authenticate, recommendationController.generateRecommendations);

/**
 * @route GET /api/recommendations
 * @desc Get recommendations
 * @access Private
 */
router.get('/', authenticate, recommendationController.getRecommendations);

/**
 * @route GET /api/recommendations/:recommendationId
 * @desc Get recommendation details
 * @access Private
 */
router.get('/:recommendationId', authenticate, recommendationController.getRecommendationDetails);

/**
 * @route PUT /api/recommendations/:recommendationId/archive
 * @desc Archive recommendation
 * @access Private
 */
router.put('/:recommendationId/archive', authenticate, recommendationController.archiveRecommendation);

/**
 * @route POST /api/recommendations/:recommendationId/programs/:programId/feedback
 * @desc Add feedback to recommendation
 * @access Private
 */
router.post(
  '/:recommendationId/programs/:programId/feedback',
  authenticate,
  recommendationController.addFeedback
);

/**
 * @route GET /api/recommendations/matches/:matchId
 * @desc Get match details
 * @access Private
 */
router.get('/matches/:matchId', authenticate, recommendationController.getMatchDetails);

/**
 * @route GET /api/recommendations/gaps/:gapAnalysisId
 * @desc Get gap analysis
 * @access Private
 */
router.get('/gaps/:gapAnalysisId', authenticate, recommendationController.getGapAnalysis);

module.exports = router;
