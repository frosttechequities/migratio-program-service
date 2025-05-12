const express = require('express');
const programController = require('../controllers/programController');
// Placeholder for auth middleware if needed to protect routes
// const authController = require('../controllers/authController'); // Assuming shared auth logic or client service

const router = express.Router();

// --- Program Routes ---

// GET /api/programs - Get all programs (with potential filtering/sorting)
// POST /api/programs - Create a new program (Admin only?)
router
  .route('/')
  .get(programController.getAllPrograms)
  // .post(authController.protect, authController.restrictTo('admin'), programController.createProgram); // Example protected route
  .post(programController.createProgram); // Unprotected for now

// GET /api/programs/:id - Get a specific program
// PATCH /api/programs/:id - Update a specific program (Admin only?)
// DELETE /api/programs/:id - Delete a specific program (Admin only?)
router
  .route('/:id')
  .get(programController.getProgram)
  // .patch(authController.protect, authController.restrictTo('admin'), programController.updateProgram); // Example protected route
  .patch(programController.updateProgram) // Unprotected for now
  // .delete(authController.protect, authController.restrictTo('admin'), programController.deleteProgram); // Example protected route
  .delete(programController.deleteProgram); // Unprotected for now

// --- Comparison Route ---
// GET /api/programs/compare?ids=id1,id2,id3 - Get specific programs formatted for comparison
router.get('/compare', programController.getProgramsForComparison);


// Add other program-related routes if needed (e.g., search, by country)

module.exports = router;
