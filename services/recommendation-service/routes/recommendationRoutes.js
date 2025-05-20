const express = require('express');
const { check } = require('express-validator');
const recommendationController = require('../controllers/recommendationController');
const scenarioPlannerController = require('../controllers/scenarioPlannerController');
const probabilityController = require('../controllers/probabilityController');
const gapAnalysisController = require('../controllers/gapAnalysisController');
// Placeholder for auth middleware - assumes middleware is available
// const { protect } = require('../middleware/authMiddleware'); // Adjust path as needed

const router = express.Router();

// --- Recommendation Routes ---

// GET /api/recommendations - Generate recommendations for the authenticated user
// Could also be a POST if complex filtering/profile data needs to be sent in body
// router.get('/', protect, recommendationController.generateRecommendations);
router.get('/', recommendationController.generateRecommendations); // Unprotected for now


// --- Scenario Planner Routes ---
// POST /api/recommendations/scenarios/simulate - Simulate profile changes for "what-if" analysis
// router.post('/scenarios/simulate', protect, scenarioPlannerController.handleSimulateProfileChange);
router.post('/scenarios/simulate', scenarioPlannerController.handleSimulateProfileChange); // Unprotected for now


// --- Destination Matching Route ---
// GET /api/recommendations/destinations - Suggest potential destination countries based on profile
// router.get('/destinations', protect, recommendationController.suggestDestinations);
router.get('/destinations', recommendationController.suggestDestinations); // Unprotected for now, To be implemented


// --- Success Probability Routes ---
// GET /api/recommendations/:programId/probability - Get success probability for a specific program
// router.get('/:programId/probability', protect, probabilityController.getSuccessProbability);
router.get('/:programId/probability',
  [
    check('programId').isString().withMessage('Program ID must be a string')
  ],
  probabilityController.getSuccessProbability
); // Unprotected for now

// --- Gap Analysis Routes ---
// GET /api/recommendations/:programId/gaps - Get gap analysis for a specific program
// router.get('/:programId/gaps', protect, gapAnalysisController.getGapAnalysis);
router.get('/:programId/gaps',
  [
    check('programId').isString().withMessage('Program ID must be a string')
  ],
  gapAnalysisController.getGapAnalysis
); // Unprotected for now

module.exports = router;
