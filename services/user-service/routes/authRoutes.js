const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// --- Authentication Routes ---

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

// --- Password Management Routes ---
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// --- Protected Routes ---
// Apply protect middleware to all routes below this line
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
// router.post('/logout', authController.logout); // TODO: Implement logout controller


module.exports = router;
