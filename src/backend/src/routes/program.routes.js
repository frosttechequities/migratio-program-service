const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// This is a placeholder for program routes
// We'll implement this in a future step

// Get all programs
router.get('/', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Program routes not yet implemented',
    data: []
  });
});

module.exports = router;
