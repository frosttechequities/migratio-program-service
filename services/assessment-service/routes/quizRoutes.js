const express = require('express');
const quizController = require('../controllers/quizController');
// Placeholder for auth middleware - assumes middleware is available
// const { protect } = require('../middleware/authMiddleware'); // Adjust path as needed

const router = express.Router();

// --- Quiz Routes ---

// POST /api/quiz/start - Start or resume a quiz session for the authenticated user
// router.post('/start', protect, quizController.startQuiz);
router.post('/start', quizController.startQuiz); // Unprotected for now

// POST /api/quiz/answer - Submit an answer for the current question in a session
// router.post('/answer', protect, quizController.submitAnswer);
router.post('/answer', quizController.submitAnswer); // Unprotected for now

// Add other potential routes (e.g., GET /quiz/status) later

module.exports = router;
