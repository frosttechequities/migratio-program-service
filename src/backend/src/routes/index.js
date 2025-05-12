const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const profileRoutes = require('./profile.routes');
const assessmentRoutes = require('./assessment.routes');
const documentRoutes = require('./document.routes');
const programRoutes = require('./program.routes');
const roadmapRoutes = require('./roadmap.routes');
const recommendationRoutes = require('./recommendation.routes');
const uploadRoutes = require('./upload.routes');
const dashboardRoutes = require('./dashboard.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/documents', documentRoutes);
router.use('/programs', programRoutes);
router.use('/roadmaps', roadmapRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/uploads', uploadRoutes);
router.use('/dashboard', dashboardRoutes);

// API information route
router.get('/', (req, res) => {
  res.json({
    name: 'Migratio API',
    version: '0.1.0',
    description: 'API for the Migratio immigration platform',
    documentation: '/api/docs'
  });
});

module.exports = router;
