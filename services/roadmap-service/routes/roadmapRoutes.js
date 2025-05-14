const express = require('express');
const roadmapController = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all roadmap routes below
router.use(protect);

// POST /api/roadmaps - Create a new roadmap for the authenticated user
router.post('/', roadmapController.createRoadmap);

// GET /api/roadmaps - Get all roadmaps for the authenticated user
router.get('/', roadmapController.getAllRoadmaps);

// GET /api/roadmaps/:id - Get a specific roadmap
router.get('/:id', roadmapController.getRoadmap);

// PATCH /api/roadmaps/:id - Update a specific roadmap (e.g., task status)
router.patch('/:id', roadmapController.updateRoadmap); // Placeholder controller

// DELETE /api/roadmaps/:id - Delete a specific roadmap
router.delete('/:id', roadmapController.deleteRoadmap); // Placeholder controller


// --- Task/Milestone specific routes ---

// PATCH /api/roadmaps/:roadmapId/phases/:phaseId/tasks/:taskId - Update a specific task (e.g., status)
router.patch('/:roadmapId/phases/:phaseId/tasks/:taskId', roadmapController.updateRoadmapTaskStatus);

// PATCH /api/roadmaps/:roadmapId/phases/:phaseId/documents/:docStatusId - Update a specific document requirement status
router.patch('/:roadmapId/phases/:phaseId/documents/:docStatusId', roadmapController.updateRoadmapDocumentStatus); // To be implemented


// Add other potential routes (e.g., routes for managing tasks/milestones within a roadmap)

module.exports = router;
