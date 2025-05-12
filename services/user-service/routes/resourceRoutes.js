const express = require('express');
const resourceController = require('../controllers/resourceController');
const authController = require('../controllers/authController'); // Assuming protect/restrictTo middleware

const router = express.Router();

// Public route to get all active resources (can add filtering later)
router.get('/', resourceController.getAllResources);

// Public route to get a single active resource
router.get('/:id', resourceController.getResource);

// --- Admin Routes ---
// Apply admin protection middleware below this point
// router.use(authController.protect, authController.restrictTo('admin')); // Example

router.post(
    '/',
    // authController.protect, authController.restrictTo('admin'), // Protect this route
    resourceController.createResource
);

router.patch(
    '/:id',
     // authController.protect, authController.restrictTo('admin'), // Protect this route
    resourceController.updateResource
);

router.delete(
    '/:id',
     // authController.protect, authController.restrictTo('admin'), // Protect this route
    resourceController.deleteResource // Soft delete (sets isActive=false)
);


module.exports = router;
