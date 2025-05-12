const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmap.controller');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

/**
 * @route POST /api/roadmaps
 * @desc Generate a new roadmap
 * @access Private
 */
router.post(
  '/',
  authenticate,
  [
    body('recommendationId')
      .notEmpty()
      .withMessage('Recommendation ID is required'),
    body('programId')
      .optional()
      .isString()
      .withMessage('Program ID must be a string'),
    body('title')
      .optional()
      .isString()
      .withMessage('Title must be a string'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    body('visibility')
      .optional()
      .isIn(['private', 'shared', 'public'])
      .withMessage('Visibility must be private, shared, or public'),
    validate
  ],
  roadmapController.generateRoadmap
);

/**
 * @route GET /api/roadmaps
 * @desc Get all roadmaps for the authenticated user
 * @access Private
 */
router.get('/', authenticate, roadmapController.getRoadmaps);

/**
 * @route GET /api/roadmaps/:roadmapId
 * @desc Get a roadmap by ID
 * @access Private
 */
router.get('/:roadmapId', authenticate, roadmapController.getRoadmap);

/**
 * @route PUT /api/roadmaps/:roadmapId
 * @desc Update a roadmap
 * @access Private
 */
router.put(
  '/:roadmapId',
  authenticate,
  [
    body('title')
      .optional()
      .isString()
      .withMessage('Title must be a string'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body('status')
      .optional()
      .isIn(['draft', 'active', 'completed', 'archived'])
      .withMessage('Status must be draft, active, completed, or archived'),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    body('targetCompletionDate')
      .optional()
      .isISO8601()
      .withMessage('Target completion date must be a valid date'),
    body('notes')
      .optional()
      .isString()
      .withMessage('Notes must be a string'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('visibility')
      .optional()
      .isIn(['private', 'shared', 'public'])
      .withMessage('Visibility must be private, shared, or public'),
    validate
  ],
  roadmapController.updateRoadmap
);

/**
 * @route DELETE /api/roadmaps/:roadmapId
 * @desc Delete a roadmap
 * @access Private
 */
router.delete('/:roadmapId', authenticate, roadmapController.deleteRoadmap);

/**
 * @route PUT /api/roadmaps/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/status
 * @desc Update milestone status
 * @access Private
 */
router.put(
  '/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/status',
  authenticate,
  [
    body('status')
      .notEmpty()
      .isIn(['not_started', 'in_progress', 'completed', 'delayed', 'blocked'])
      .withMessage('Status must be not_started, in_progress, completed, delayed, or blocked'),
    validate
  ],
  roadmapController.updateMilestoneStatus
);

/**
 * @route PUT /api/roadmaps/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/tasks/:taskIndex/status
 * @desc Update task status
 * @access Private
 */
router.put(
  '/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/tasks/:taskIndex/status',
  authenticate,
  [
    body('status')
      .notEmpty()
      .isIn(['not_started', 'in_progress', 'completed', 'blocked'])
      .withMessage('Status must be not_started, in_progress, completed, or blocked'),
    validate
  ],
  roadmapController.updateTaskStatus
);

/**
 * @route GET /api/roadmaps/:roadmapId/pdf
 * @desc Generate PDF for roadmap
 * @access Private
 * @query {boolean} download - Whether to download the PDF directly
 * @query {boolean} includeNotes - Whether to include notes in the PDF
 * @query {boolean} includeDocuments - Whether to include documents in the PDF
 */
router.get('/:roadmapId/pdf', authenticate, roadmapController.generateRoadmapPDF);

/**
 * @route POST /api/roadmaps/:roadmapId/share
 * @desc Share roadmap with other users
 * @access Private
 */
router.post(
  '/:roadmapId/share',
  authenticate,
  [
    body('shareWith')
      .notEmpty()
      .withMessage('User to share with is required'),
    body('role')
      .notEmpty()
      .isIn(['viewer', 'editor'])
      .withMessage('Role must be viewer or editor'),
    validate
  ],
  roadmapController.shareRoadmap
);

/**
 * @route GET /api/roadmaps/templates
 * @desc Get all templates
 * @access Private
 */
router.get('/templates', authenticate, roadmapController.getTemplates);

/**
 * @route GET /api/roadmaps/templates/:templateId
 * @desc Get a template by ID
 * @access Private
 */
router.get('/templates/:templateId', authenticate, roadmapController.getTemplate);

/**
 * @route POST /api/roadmaps/templates
 * @desc Create a new template
 * @access Private
 */
router.post(
  '/templates',
  authenticate,
  [
    body('programId')
      .optional()
      .isString()
      .withMessage('Program ID must be a string'),
    body('roadmapId')
      .optional()
      .isString()
      .withMessage('Roadmap ID must be a string'),
    body('templateName')
      .optional()
      .isString()
      .withMessage('Template name must be a string'),
    body('templateCategory')
      .optional()
      .isString()
      .withMessage('Template category must be a string'),
    body('title')
      .optional()
      .isString()
      .withMessage('Title must be a string'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('Is public must be a boolean'),
    validate
  ],
  roadmapController.createTemplate
);

/**
 * @route PUT /api/roadmaps/templates/:templateId
 * @desc Update a template
 * @access Private
 */
router.put(
  '/templates/:templateId',
  authenticate,
  [
    body('templateName')
      .optional()
      .isString()
      .withMessage('Template name must be a string'),
    body('templateCategory')
      .optional()
      .isString()
      .withMessage('Template category must be a string'),
    body('title')
      .optional()
      .isString()
      .withMessage('Title must be a string'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('Is public must be a boolean'),
    body('phases')
      .optional()
      .isArray()
      .withMessage('Phases must be an array'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    validate
  ],
  roadmapController.updateTemplate
);

/**
 * @route DELETE /api/roadmaps/templates/:templateId
 * @desc Delete a template
 * @access Private
 */
router.delete('/templates/:templateId', authenticate, roadmapController.deleteTemplate);

/**
 * @route POST /api/roadmaps/templates/:templateId/create
 * @desc Create a roadmap from a template
 * @access Private
 */
router.post(
  '/templates/:templateId/create',
  authenticate,
  [
    body('title')
      .optional()
      .isString()
      .withMessage('Title must be a string'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    body('visibility')
      .optional()
      .isIn(['private', 'shared', 'public'])
      .withMessage('Visibility must be private, shared, or public'),
    validate
  ],
  roadmapController.createRoadmapFromTemplate
);

/**
 * @route PUT /api/roadmaps/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/documents
 * @desc Assign documents to a milestone
 * @access Private
 */
router.put(
  '/:roadmapId/phases/:phaseIndex/milestones/:milestoneIndex/documents',
  authenticate,
  [
    body('documents')
      .isArray()
      .withMessage('Documents must be an array'),
    body('documents.*.documentId')
      .notEmpty()
      .withMessage('Document ID is required'),
    body('documents.*.status')
      .isIn(['pending', 'approved', 'rejected'])
      .withMessage('Status must be pending, approved, or rejected'),
    validate
  ],
  roadmapController.assignDocumentsToMilestone
);

/**
 * @route PUT /api/roadmaps/:roadmapId/documents/:documentId/status
 * @desc Update document status in a milestone
 * @access Private
 */
router.put(
  '/:roadmapId/documents/:documentId/status',
  authenticate,
  [
    body('status')
      .notEmpty()
      .isIn(['pending', 'approved', 'rejected'])
      .withMessage('Status must be pending, approved, or rejected'),
    validate
  ],
  roadmapController.updateDocumentStatus
);

module.exports = router;
