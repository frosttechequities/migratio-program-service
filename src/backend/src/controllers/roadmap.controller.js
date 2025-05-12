const RoadmapService = require('../services/roadmap.service');
const RoadmapTemplateService = require('../services/roadmap-template.service');
const PDFGenerationService = require('../services/pdf-generation.service');
const { logger } = require('../utils/logger');
const { validationResult } = require('express-validator');

// Initialize services
const roadmapService = new RoadmapService();
const roadmapTemplateService = new RoadmapTemplateService();
const pdfGenerationService = new PDFGenerationService();

/**
 * Generate a new roadmap
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.generateRoadmap = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { recommendationId, programId, title, description, startDate, visibility } = req.body;

    // Validate required fields
    if (!recommendationId) {
      return res.status(400).json({
        success: false,
        message: 'Recommendation ID is required'
      });
    }

    // Generate roadmap
    const roadmap = await roadmapService.generateRoadmap(
      userId,
      recommendationId,
      {
        programId,
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        visibility
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Roadmap generated successfully',
      data: roadmap
    });
  } catch (error) {
    logger.error(`Error generating roadmap: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap',
      error: error.message
    });
  }
};

/**
 * Get all roadmaps for the authenticated user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getRoadmaps = async (req, res) => {
  try {
    const userId = req.user._id;
    const options = {
      status: req.query.status,
      includeArchived: req.query.includeArchived === 'true',
      limit: parseInt(req.query.limit) || 10
    };

    // Get roadmaps
    const roadmaps = await roadmapService.getRoadmaps(userId, options);

    return res.status(200).json({
      success: true,
      message: 'Roadmaps retrieved successfully',
      data: roadmaps
    });
  } catch (error) {
    logger.error(`Error getting roadmaps: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve roadmaps',
      error: error.message
    });
  }
};

/**
 * Get a roadmap by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getRoadmap = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roadmapId } = req.params;

    // Validate required fields
    if (!roadmapId) {
      return res.status(400).json({
        success: false,
        message: 'Roadmap ID is required'
      });
    }

    // Get roadmap
    const roadmap = await roadmapService.getRoadmap(roadmapId, userId);

    return res.status(200).json({
      success: true,
      message: 'Roadmap retrieved successfully',
      data: roadmap
    });
  } catch (error) {
    logger.error(`Error getting roadmap: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve roadmap',
      error: error.message
    });
  }
};

/**
 * Update a roadmap
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateRoadmap = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { roadmapId } = req.params;
    const updateData = req.body;

    // Validate required fields
    if (!roadmapId) {
      return res.status(400).json({
        success: false,
        message: 'Roadmap ID is required'
      });
    }

    // Get roadmap
    const roadmap = await roadmapService.getRoadmap(roadmapId, userId);

    // Check if user is the owner
    if (roadmap.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this roadmap'
      });
    }

    // Update allowed fields
    if (updateData.title) roadmap.title = updateData.title;
    if (updateData.description) roadmap.description = updateData.description;
    if (updateData.status) roadmap.status = updateData.status;
    if (updateData.startDate) roadmap.startDate = new Date(updateData.startDate);
    if (updateData.targetCompletionDate) roadmap.targetCompletionDate = new Date(updateData.targetCompletionDate);
    if (updateData.notes) roadmap.notes = updateData.notes;
    if (updateData.tags) roadmap.tags = updateData.tags;
    if (updateData.visibility) roadmap.visibility = updateData.visibility;

    // Update timestamp
    roadmap.updatedAt = new Date();

    // Save updated roadmap
    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: 'Roadmap updated successfully',
      data: roadmap
    });
  } catch (error) {
    logger.error(`Error updating roadmap: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to update roadmap',
      error: error.message
    });
  }
};

/**
 * Delete a roadmap
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deleteRoadmap = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roadmapId } = req.params;

    // Validate required fields
    if (!roadmapId) {
      return res.status(400).json({
        success: false,
        message: 'Roadmap ID is required'
      });
    }

    // Get roadmap
    const roadmap = await roadmapService.getRoadmap(roadmapId, userId);

    // Check if user is the owner
    if (roadmap.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this roadmap'
      });
    }

    // Delete roadmap
    await roadmap.remove();

    return res.status(200).json({
      success: true,
      message: 'Roadmap deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting roadmap: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to delete roadmap',
      error: error.message
    });
  }
};

/**
 * Update milestone status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateMilestoneStatus = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { roadmapId, phaseIndex, milestoneIndex } = req.params;
    const { status } = req.body;

    // Validate required fields
    if (!roadmapId || phaseIndex === undefined || milestoneIndex === undefined || !status) {
      return res.status(400).json({
        success: false,
        message: 'Roadmap ID, phase index, milestone index, and status are required'
      });
    }

    // Get roadmap
    const roadmap = await roadmapService.getRoadmap(roadmapId, userId);

    // Check if user is the owner
    if (roadmap.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this roadmap'
      });
    }

    // Update milestone status
    roadmap.updateMilestoneStatus(parseInt(phaseIndex), parseInt(milestoneIndex), status);

    // Save updated roadmap
    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: 'Milestone status updated successfully',
      data: roadmap
    });
  } catch (error) {
    logger.error(`Error updating milestone status: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to update milestone status',
      error: error.message
    });
  }
};

/**
 * Update task status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateTaskStatus = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { roadmapId, phaseIndex, milestoneIndex, taskIndex } = req.params;
    const { status } = req.body;

    // Validate required fields
    if (!roadmapId || phaseIndex === undefined || milestoneIndex === undefined ||
        taskIndex === undefined || !status) {
      return res.status(400).json({
        success: false,
        message: 'Roadmap ID, phase index, milestone index, task index, and status are required'
      });
    }

    // Get roadmap
    const roadmap = await roadmapService.getRoadmap(roadmapId, userId);

    // Check if user is the owner
    if (roadmap.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this roadmap'
      });
    }

    // Update task status
    roadmap.updateTaskStatus(
      parseInt(phaseIndex),
      parseInt(milestoneIndex),
      parseInt(taskIndex),
      status
    );

    // Save updated roadmap
    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: roadmap
    });
  } catch (error) {
    logger.error(`Error updating task status: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to update task status',
      error: error.message
    });
  }
};

/**
 * Generate PDF for roadmap
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.generateRoadmapPDF = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roadmapId } = req.params;

    // Validate required fields
    if (!roadmapId) {
      return res.status(400).json({
        success: false,
        message: 'Roadmap ID is required'
      });
    }

    // Get roadmap
    const roadmap = await roadmapService.getRoadmap(roadmapId, userId);

    // Check if user is the owner or has view access
    const isOwner = roadmap.userId.toString() === userId.toString();
    const hasViewAccess = roadmap.sharedWith && roadmap.sharedWith.some(
      share => share.userId.toString() === userId.toString() && ['viewer', 'editor'].includes(share.role)
    );

    if (!isOwner && !hasViewAccess && roadmap.visibility !== 'public') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this roadmap'
      });
    }

    // Generate PDF
    const pdfInfo = await pdfGenerationService.generateRoadmapPDF(roadmap, {
      includeNotes: req.query.includeNotes === 'true',
      includeDocuments: req.query.includeDocuments === 'true'
    });

    // Check if download is requested
    if (req.query.download === 'true') {
      return res.download(pdfInfo.filePath, pdfInfo.filename, (err) => {
        if (err) {
          logger.error(`Error downloading PDF: ${err.message}`, { err });

          return res.status(500).json({
            success: false,
            message: 'Failed to download PDF',
            error: err.message
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'PDF generated successfully',
      data: {
        roadmapId,
        pdfUrl: pdfInfo.url,
        filename: pdfInfo.filename,
        contentType: pdfInfo.contentType,
        size: pdfInfo.size
      }
    });
  } catch (error) {
    logger.error(`Error generating roadmap PDF: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap PDF',
      error: error.message
    });
  }
};

/**
 * Share roadmap with other users
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.shareRoadmap = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { roadmapId } = req.params;
    const { shareWith, role } = req.body;

    // Validate required fields
    if (!roadmapId || !shareWith || !role) {
      return res.status(400).json({
        success: false,
        message: 'Roadmap ID, user to share with, and role are required'
      });
    }

    // Get roadmap
    const roadmap = await roadmapService.getRoadmap(roadmapId, userId);

    // Check if user is the owner
    if (roadmap.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to share this roadmap'
      });
    }

    // Check if already shared with this user
    const alreadyShared = roadmap.sharedWith && roadmap.sharedWith.some(
      share => share.userId.toString() === shareWith.toString()
    );

    if (alreadyShared) {
      // Update existing share
      roadmap.sharedWith = roadmap.sharedWith.map(share => {
        if (share.userId.toString() === shareWith.toString()) {
          return { ...share, role };
        }
        return share;
      });
    } else {
      // Add new share
      if (!roadmap.sharedWith) {
        roadmap.sharedWith = [];
      }

      roadmap.sharedWith.push({
        userId: shareWith,
        role
      });
    }

    // Save updated roadmap
    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: 'Roadmap shared successfully',
      data: roadmap
    });
  } catch (error) {
    logger.error(`Error sharing roadmap: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to share roadmap',
      error: error.message
    });
  }
};

/**
 * Get templates
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getTemplates = async (req, res) => {
  try {
    const userId = req.user._id;
    const options = {
      category: req.query.category,
      publicOnly: req.query.publicOnly === 'true',
      userId,
      limit: parseInt(req.query.limit) || 100
    };

    // Get templates
    const templates = await roadmapTemplateService.getTemplates(options);

    return res.status(200).json({
      success: true,
      message: 'Templates retrieved successfully',
      data: templates
    });
  } catch (error) {
    logger.error(`Error getting templates: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve templates',
      error: error.message
    });
  }
};

/**
 * Get a template by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getTemplate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { templateId } = req.params;

    // Validate required fields
    if (!templateId) {
      return res.status(400).json({
        success: false,
        message: 'Template ID is required'
      });
    }

    // Get template
    const template = await roadmapTemplateService.getTemplate(templateId, userId);

    return res.status(200).json({
      success: true,
      message: 'Template retrieved successfully',
      data: template
    });
  } catch (error) {
    logger.error(`Error getting template: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve template',
      error: error.message
    });
  }
};

/**
 * Create a template
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createTemplate = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const templateData = req.body;

    // Create template
    const template = await roadmapTemplateService.createTemplate(userId, templateData);

    return res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template
    });
  } catch (error) {
    logger.error(`Error creating template: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to create template',
      error: error.message
    });
  }
};

/**
 * Update a template
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateTemplate = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { templateId } = req.params;
    const updateData = req.body;

    // Validate required fields
    if (!templateId) {
      return res.status(400).json({
        success: false,
        message: 'Template ID is required'
      });
    }

    // Update template
    const template = await roadmapTemplateService.updateTemplate(templateId, userId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: template
    });
  } catch (error) {
    logger.error(`Error updating template: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to update template',
      error: error.message
    });
  }
};

/**
 * Delete a template
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deleteTemplate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { templateId } = req.params;

    // Validate required fields
    if (!templateId) {
      return res.status(400).json({
        success: false,
        message: 'Template ID is required'
      });
    }

    // Delete template
    await roadmapTemplateService.deleteTemplate(templateId, userId);

    return res.status(200).json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting template: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to delete template',
      error: error.message
    });
  }
};

/**
 * Create roadmap from template
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createRoadmapFromTemplate = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { templateId } = req.params;
    const options = req.body;

    // Validate required fields
    if (!templateId) {
      return res.status(400).json({
        success: false,
        message: 'Template ID is required'
      });
    }

    // Create roadmap from template
    const roadmap = await roadmapTemplateService.createRoadmapFromTemplate(
      userId,
      templateId,
      {
        title: options.title,
        description: options.description,
        startDate: options.startDate ? new Date(options.startDate) : undefined,
        visibility: options.visibility
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Roadmap created from template successfully',
      data: roadmap
    });
  } catch (error) {
    logger.error(`Error creating roadmap from template: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to create roadmap from template',
      error: error.message
    });
  }
};

/**
 * Assign documents to a milestone
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.assignDocumentsToMilestone = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { roadmapId, phaseIndex, milestoneIndex } = req.params;
    const { documents } = req.body;

    // Validate required fields
    if (!roadmapId || phaseIndex === undefined || milestoneIndex === undefined || !documents) {
      return res.status(400).json({
        success: false,
        message: 'Roadmap ID, phase index, milestone index, and documents are required'
      });
    }

    // Get roadmap
    const roadmap = await roadmapService.getRoadmap(roadmapId, userId);

    // Check if user is the owner
    if (roadmap.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this roadmap'
      });
    }

    // Validate phase and milestone indices
    if (!roadmap.phases || !roadmap.phases[phaseIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Phase not found'
      });
    }

    if (!roadmap.phases[phaseIndex].milestones || !roadmap.phases[phaseIndex].milestones[milestoneIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    // Update milestone with documents
    roadmap.phases[phaseIndex].milestones[milestoneIndex].documents = documents;

    // Update timestamp
    roadmap.updatedAt = new Date();

    // Save updated roadmap
    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: 'Documents assigned to milestone successfully',
      data: roadmap
    });
  } catch (error) {
    logger.error(`Error assigning documents to milestone: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to assign documents to milestone',
      error: error.message
    });
  }
};

/**
 * Update document status in a milestone
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateDocumentStatus = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const userId = req.user._id;
    const { roadmapId, documentId } = req.params;
    const { status } = req.body;

    // Validate required fields
    if (!roadmapId || !documentId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Roadmap ID, document ID, and status are required'
      });
    }

    // Get roadmap
    const roadmap = await roadmapService.getRoadmap(roadmapId, userId);

    // Check if user is the owner
    if (roadmap.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this roadmap'
      });
    }

    // Find the document in any milestone
    let documentFound = false;

    for (let i = 0; i < roadmap.phases.length; i++) {
      const phase = roadmap.phases[i];

      for (let j = 0; j < phase.milestones.length; j++) {
        const milestone = phase.milestones[j];

        if (milestone.documents) {
          for (let k = 0; k < milestone.documents.length; k++) {
            if (milestone.documents[k].documentId === documentId) {
              // Update the document status
              milestone.documents[k].status = status;
              documentFound = true;
              break;
            }
          }
        }

        if (documentFound) break;
      }

      if (documentFound) break;
    }

    if (!documentFound) {
      return res.status(404).json({
        success: false,
        message: 'Document not found in roadmap'
      });
    }

    // Update timestamp
    roadmap.updatedAt = new Date();

    // Save updated roadmap
    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: 'Document status updated successfully',
      data: roadmap
    });
  } catch (error) {
    logger.error(`Error updating document status: ${error.message}`, { error });

    return res.status(500).json({
      success: false,
      message: 'Failed to update document status',
      error: error.message
    });
  }
};