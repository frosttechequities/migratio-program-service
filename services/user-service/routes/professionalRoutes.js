const express = require('express');
const professionalController = require('../controllers/professionalController');
// const authController = require('../controllers/authController'); // Assuming protect/restrictTo middleware

const router = express.Router();

// --- Public Marketplace Routes ---
// GET /api/professionals - Get list of active professionals (directory)
router.get('/', professionalController.getAllProfessionals);

// GET /api/professionals/:id - Get details of a specific active professional
router.get('/:id', professionalController.getProfessional);

// --- Review Routes ---
// POST /api/professionals/:professionalId/reviews - Add a review (requires user auth)
router.post(
    '/:professionalId/reviews',
    // authController.protect, // Protect: User must be logged in
    professionalController.addReview // To be implemented
);
// TODO: Add routes for updating/deleting own review?


// --- Admin Routes ---
// Apply admin protection middleware below this point
// router.use(authController.protect, authController.restrictTo('admin')); // Example

router.post(
    '/',
    // authController.protect, authController.restrictTo('admin'), // Protect this route
    professionalController.createProfessional
);

router.patch(
    '/:id',
     // authController.protect, authController.restrictTo('admin'), // Protect this route
    professionalController.updateProfessional
);

router.delete(
    '/:id',
     // authController.protect, authController.restrictTo('admin'), // Protect this route
    professionalController.deleteProfessional // Soft delete (sets isActive=false)
);


module.exports = router;
