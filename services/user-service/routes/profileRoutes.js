const express = require('express');
const profileController = require('../controllers/profileController');
const authController = require('../controllers/authController'); // Assuming protect middleware is here

const router = express.Router();

// All routes below this point require authentication
router.use(authController.protect); // Apply protect middleware to all subsequent routes in this file

// Route to get the current user's profile
router.get('/me', profileController.getMe, profileController.getProfile);

// Route to update the current user's profile
router.patch('/me', profileController.updateProfile);

// Route to update a specific readiness checklist item for the current user
router.patch('/me/readiness-checklist/:itemId', profileController.updateReadinessChecklistItem);

// --- Admin Routes (Example) ---
// These might require additional role checks (e.g., restrictTo('admin'))

// Route to get a specific user's profile by ID (Admin only)
// Note: authController.protect is already applied globally above.
// Add role restriction if needed.
router.get('/:userId',
    // authController.restrictTo('admin'), // Needs implementation
    profileController.getProfile
);

// TODO: Add routes for managing specific profile sections (e.g., POST /me/education, DELETE /me/workExperience/:id)

module.exports = router;
