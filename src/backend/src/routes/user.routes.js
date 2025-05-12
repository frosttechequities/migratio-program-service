const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Import controller (we'll create this next)
const userController = require('../controllers/user.controller');

// Get current user
router.get(
  '/me',
  authenticate,
  userController.getCurrentUser
);

// Update user
router.put(
  '/me',
  authenticate,
  [
    body('firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('First name cannot be empty'),
    body('lastName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Last name cannot be empty'),
    validate
  ],
  userController.updateUser
);

// Change password
router.put(
  '/me/password',
  authenticate,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    validate
  ],
  userController.changePassword
);

// Delete account
router.delete(
  '/me',
  authenticate,
  userController.deleteAccount
);

// Admin routes
router.get(
  '/',
  authenticate,
  authorize(['admin']),
  userController.getAllUsers
);

router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  userController.getUserById
);

router.put(
  '/:userId/status',
  authenticate,
  authorize(['admin']),
  [
    body('status')
      .isIn(['pending', 'active', 'suspended'])
      .withMessage('Invalid status'),
    validate
  ],
  userController.updateUserStatus
);

module.exports = router;
