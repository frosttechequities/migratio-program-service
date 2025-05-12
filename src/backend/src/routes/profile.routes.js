const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Get user profile
router.get(
  '/',
  authenticate,
  profileController.getUserProfile
);

// Get profile completion status
router.get(
  '/completion',
  authenticate,
  profileController.getProfileCompletion
);

// Update profile section
router.put(
  '/:section',
  authenticate,
  [
    // Validation will depend on the section being updated
    // We'll validate in the controller based on the section
    validate
  ],
  profileController.updateProfileSection
);

// Delete education item
router.delete(
  '/education/:itemId',
  authenticate,
  profileController.deleteEducationItem
);

// Delete work experience item
router.delete(
  '/workExperience/:itemId',
  authenticate,
  profileController.deleteWorkExperienceItem
);

// Delete language proficiency item
router.delete(
  '/languageProficiency/:itemId',
  authenticate,
  profileController.deleteLanguageProficiencyItem
);

// Update user preferences
router.put(
  '/preferences',
  authenticate,
  [
    // Add validation for preferences
    body('language')
      .optional()
      .isIn(['en', 'fr', 'es', 'de', 'zh'])
      .withMessage('Invalid language selection'),
    body('notifications.email')
      .optional()
      .isBoolean()
      .withMessage('Email notification preference must be a boolean'),
    body('notifications.marketing')
      .optional()
      .isBoolean()
      .withMessage('Marketing notification preference must be a boolean'),
    body('timezone')
      .optional()
      .isString()
      .withMessage('Timezone must be a string'),
    validate
  ],
  profileController.updateUserPreferences
);

module.exports = router;
