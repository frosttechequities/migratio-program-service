const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

/**
 * @route GET /api/dashboard
 * @desc Get dashboard data
 * @access Private
 */
router.get('/', authenticate, dashboardController.getDashboardData);

/**
 * @route GET /api/dashboard/overview
 * @desc Get dashboard overview
 * @access Private
 */
router.get('/overview', authenticate, dashboardController.getDashboardOverview);

/**
 * @route PUT /api/dashboard/preferences
 * @desc Update dashboard preferences
 * @access Private
 */
router.put(
  '/preferences',
  authenticate,
  [
    body('layout')
      .optional()
      .isString()
      .withMessage('Layout must be a string'),
    body('visibleWidgets')
      .optional()
      .isArray()
      .withMessage('Visible widgets must be an array'),
    body('widgetOrder')
      .optional()
      .isArray()
      .withMessage('Widget order must be an array'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }
      next();
    }
  ],
  dashboardController.updateDashboardPreferences
);

module.exports = router;
