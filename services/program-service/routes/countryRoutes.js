const express = require('express');
const countryController = require('../controllers/countryController');
// const authController = require('../controllers/authController'); // Assuming shared auth logic

const router = express.Router();

// Public routes
router.get('/', countryController.getAllCountries);
router.get('/:idOrCode', countryController.getCountry); // Get by DB ID or countryCode

// --- Admin Routes ---
// Apply admin protection middleware below this point
// router.use(authController.protect, authController.restrictTo('admin')); // Example

router.post(
    '/',
    // authController.protect, authController.restrictTo('admin'), // Protect this route
    countryController.createCountry
);

router.patch(
    '/:idOrCode',
     // authController.protect, authController.restrictTo('admin'), // Protect this route
    countryController.updateCountry
);

router.delete(
    '/:idOrCode',
     // authController.protect, authController.restrictTo('admin'), // Protect this route
    countryController.deleteCountry
);


module.exports = router;
