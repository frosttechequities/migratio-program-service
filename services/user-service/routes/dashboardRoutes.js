const express = require('express');
const dashboardController = require('../controllers/dashboardController');
// Placeholder for auth middleware
// const { protect } = require('../middleware/authMiddleware'); // Adjust path as needed

const router = express.Router();

// Apply authentication middleware to dashboard routes
// router.use(protect); // Uncomment when auth middleware is ready

// GET /api/dashboard/data - Fetch aggregated data for the dashboard
router.get('/data', dashboardController.getDashboardData);


module.exports = router;
