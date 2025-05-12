const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const roadmapController = require('../controllers/roadmap.controller');

/**
 * @route POST /api/roadmaps/generate
 * @desc Generate a new roadmap based on a recommendation
 * @access Private
 */
router.post('/generate', auth, roadmapController.createRoadmap);

/**
 * @route GET /api/roadmaps
 * @desc Get all roadmaps for the current user
 * @access Private
 */
router.get('/', auth, roadmapController.getRoadmaps);

/**
 * @route GET /api/roadmaps/:roadmapId
 * @desc Get a roadmap by ID
 * @access Private
 */
router.get('/:roadmapId', auth, roadmapController.getRoadmapById);

/**
 * @route PUT /api/roadmaps/:roadmapId/status
 * @desc Update roadmap status
 * @access Private
 */
router.put('/:roadmapId/status', auth, roadmapController.updateRoadmapStatus);

/**
 * @route DELETE /api/roadmaps/:roadmapId
 * @desc Delete a roadmap
 * @access Private
 */
router.delete('/:roadmapId', auth, roadmapController.deleteRoadmap);

/**
 * @route PUT /api/roadmaps/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/status
 * @desc Update milestone status
 * @access Private
 */
router.put(
  '/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/status',
  auth,
  roadmapController.updateMilestoneStatus
);

/**
 * @route PUT /api/roadmaps/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/tasks/:taskIndex/status
 * @desc Update task status
 * @access Private
 */
router.put(
  '/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/tasks/:taskIndex/status',
  auth,
  roadmapController.updateTaskStatus
);

/**
 * @route GET /api/roadmaps/:roadmapId/documents
 * @desc Get documents for a roadmap
 * @access Private
 */
router.get('/:roadmapId/documents', auth, roadmapController.getRoadmapDocuments);

module.exports = router;
