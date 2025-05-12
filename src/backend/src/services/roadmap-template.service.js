const { Roadmap } = require('../models/roadmap.model');
const { Program } = require('../models/program.model');
const { logger } = require('../utils/logger');

/**
 * Roadmap Template Service
 * Handles roadmap template management
 */
class RoadmapTemplateService {
  /**
   * Create a new roadmap template
   * @param {string} userId - User ID
   * @param {Object} templateData - Template data
   * @returns {Promise<Object>} - Created template
   */
  async createTemplate(userId, templateData) {
    try {
      logger.info(`Creating roadmap template for user ${userId}`);
      
      // Check if based on existing roadmap
      if (templateData.roadmapId) {
        // Get existing roadmap
        const existingRoadmap = await Roadmap.findOne({
          _id: templateData.roadmapId,
          userId
        });
        
        if (!existingRoadmap) {
          throw new Error('Roadmap not found or access denied');
        }
        
        // Create template from existing roadmap
        const template = new Roadmap({
          ...existingRoadmap.toObject(),
          _id: undefined, // Create new ID
          userId,
          isTemplate: true,
          templateName: templateData.templateName || `${existingRoadmap.title} Template`,
          templateCategory: templateData.templateCategory || 'custom',
          isPublic: templateData.isPublic || false,
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Save template
        await template.save();
        
        logger.info(`Roadmap template created successfully for user ${userId}`);
        
        return template;
      } else {
        // Create new template from scratch
        const programId = templateData.programId;
        
        if (!programId) {
          throw new Error('Program ID is required for template creation');
        }
        
        const program = await Program.findOne({ programId });
        
        if (!program) {
          throw new Error('Program not found');
        }
        
        // Create template
        const template = new Roadmap({
          userId,
          programId,
          title: templateData.title || `${program.name} Template`,
          description: templateData.description || `Template for ${program.name} immigration pathway.`,
          status: 'draft',
          startDate: new Date(),
          targetCompletionDate: this._calculateTargetDate(new Date(), program.processingTime?.max || 6, program.processingTime?.unit || 'months'),
          phases: templateData.phases || this._generateDefaultPhases(program),
          completionPercentage: 0,
          estimatedCost: {
            total: program.estimatedCost?.total || 0,
            currency: program.estimatedCost?.currency || 'USD',
            breakdown: program.estimatedCost?.breakdown || []
          },
          tags: [program.country, program.category, 'template'],
          isTemplate: true,
          templateName: templateData.templateName || `${program.name} Template`,
          templateCategory: templateData.templateCategory || program.category,
          isPublic: templateData.isPublic || false,
          visibility: 'private'
        });
        
        // Calculate completion percentage
        template.calculateCompletionPercentage();
        
        // Save template
        await template.save();
        
        logger.info(`Roadmap template created successfully for user ${userId}`);
        
        return template;
      }
    } catch (error) {
      logger.error(`Error creating roadmap template: ${error.message}`, { userId, error });
      throw error;
    }
  }

  /**
   * Get templates
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Templates
   */
  async getTemplates(options = {}) {
    try {
      // Build query
      const query = { isTemplate: true };
      
      // Add category filter if provided
      if (options.category) {
        query.templateCategory = options.category;
      }
      
      // Add public filter
      if (options.publicOnly) {
        query.isPublic = true;
      } else if (options.userId) {
        // If not public only, include user's private templates
        query.$or = [
          { isPublic: true },
          { userId: options.userId }
        ];
      }
      
      // Get templates
      let templates = await Roadmap.find(query)
        .sort({ templateName: 1 })
        .limit(options.limit || 100);
      
      return templates;
    } catch (error) {
      logger.error(`Error getting roadmap templates: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * Get a template by ID
   * @param {string} templateId - Template ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Template
   */
  async getTemplate(templateId, userId) {
    try {
      const template = await Roadmap.findOne({
        _id: templateId,
        isTemplate: true,
        $or: [
          { userId },
          { isPublic: true }
        ]
      });
      
      if (!template) {
        throw new Error('Template not found or access denied');
      }
      
      return template;
    } catch (error) {
      logger.error(`Error getting roadmap template: ${error.message}`, { templateId, userId, error });
      throw error;
    }
  }

  /**
   * Create roadmap from template
   * @param {string} userId - User ID
   * @param {string} templateId - Template ID
   * @param {Object} options - Creation options
   * @returns {Promise<Object>} - Created roadmap
   */
  async createRoadmapFromTemplate(userId, templateId, options = {}) {
    try {
      logger.info(`Creating roadmap from template ${templateId} for user ${userId}`);
      
      // Get template
      const template = await this.getTemplate(templateId, userId);
      
      // Create roadmap from template
      const roadmap = new Roadmap({
        ...template.toObject(),
        _id: undefined, // Create new ID
        userId,
        isTemplate: false,
        templateId: template._id,
        title: options.title || template.title.replace(' Template', ''),
        description: options.description || template.description,
        status: 'draft',
        startDate: options.startDate || new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        visibility: options.visibility || 'private'
      });
      
      // Recalculate dates based on start date
      this._recalculateDates(roadmap, options.startDate || new Date());
      
      // Save roadmap
      await roadmap.save();
      
      logger.info(`Roadmap created from template successfully for user ${userId}`);
      
      return roadmap;
    } catch (error) {
      logger.error(`Error creating roadmap from template: ${error.message}`, { templateId, userId, error });
      throw error;
    }
  }

  /**
   * Update a template
   * @param {string} templateId - Template ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} - Updated template
   */
  async updateTemplate(templateId, userId, updateData) {
    try {
      // Get template
      const template = await Roadmap.findOne({
        _id: templateId,
        isTemplate: true,
        userId
      });
      
      if (!template) {
        throw new Error('Template not found or access denied');
      }
      
      // Update allowed fields
      if (updateData.templateName) template.templateName = updateData.templateName;
      if (updateData.templateCategory) template.templateCategory = updateData.templateCategory;
      if (updateData.title) template.title = updateData.title;
      if (updateData.description) template.description = updateData.description;
      if (updateData.isPublic !== undefined) template.isPublic = updateData.isPublic;
      if (updateData.phases) template.phases = updateData.phases;
      if (updateData.tags) template.tags = updateData.tags;
      
      // Update timestamp
      template.updatedAt = new Date();
      
      // Save updated template
      await template.save();
      
      return template;
    } catch (error) {
      logger.error(`Error updating roadmap template: ${error.message}`, { templateId, userId, error });
      throw error;
    }
  }

  /**
   * Delete a template
   * @param {string} templateId - Template ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteTemplate(templateId, userId) {
    try {
      // Get template
      const template = await Roadmap.findOne({
        _id: templateId,
        isTemplate: true,
        userId
      });
      
      if (!template) {
        throw new Error('Template not found or access denied');
      }
      
      // Delete template
      await template.remove();
      
      return true;
    } catch (error) {
      logger.error(`Error deleting roadmap template: ${error.message}`, { templateId, userId, error });
      throw error;
    }
  }

  /**
   * Calculate target date based on start date and duration
   * @param {Date} startDate - Start date
   * @param {number} duration - Duration value
   * @param {string} unit - Duration unit (days, weeks, months)
   * @returns {Date} - Target date
   * @private
   */
  _calculateTargetDate(startDate, duration, unit) {
    const targetDate = new Date(startDate);
    
    switch (unit) {
      case 'days':
        targetDate.setDate(targetDate.getDate() + duration);
        break;
      case 'weeks':
        targetDate.setDate(targetDate.getDate() + (duration * 7));
        break;
      case 'months':
        targetDate.setMonth(targetDate.getMonth() + duration);
        break;
      case 'years':
        targetDate.setFullYear(targetDate.getFullYear() + duration);
        break;
      default:
        targetDate.setMonth(targetDate.getMonth() + duration);
    }
    
    return targetDate;
  }

  /**
   * Recalculate dates for a roadmap based on new start date
   * @param {Object} roadmap - Roadmap object
   * @param {Date} startDate - New start date
   * @private
   */
  _recalculateDates(roadmap, startDate) {
    // Set new start date
    roadmap.startDate = startDate;
    
    // Calculate new target completion date
    const originalDuration = this._calculateDurationInDays(
      roadmap.startDate,
      roadmap.targetCompletionDate
    );
    
    roadmap.targetCompletionDate = this._calculateTargetDate(
      startDate,
      originalDuration,
      'days'
    );
    
    // Recalculate phase dates
    let currentDate = new Date(startDate);
    
    roadmap.phases.forEach((phase, index) => {
      // Set phase start date
      phase.startDate = new Date(currentDate);
      
      // Calculate phase duration
      let phaseDuration = 0;
      
      if (index < roadmap.phases.length - 1) {
        // For all phases except the last one
        const originalPhaseStart = new Date(phase.startDate);
        const originalPhaseEnd = new Date(phase.endDate);
        phaseDuration = this._calculateDurationInDays(originalPhaseStart, originalPhaseEnd);
      } else {
        // For the last phase, use the remaining time until target completion
        phaseDuration = this._calculateDurationInDays(currentDate, roadmap.targetCompletionDate);
      }
      
      // Set phase end date
      phase.endDate = this._calculateTargetDate(currentDate, phaseDuration, 'days');
      
      // Update current date for next phase
      currentDate = new Date(phase.endDate);
    });
  }

  /**
   * Calculate duration in days between two dates
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {number} - Duration in days
   * @private
   */
  _calculateDurationInDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate difference in milliseconds
    const diffMs = end - start;
    
    // Convert to days
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Generate default phases for a template
   * @param {Object} program - Program details
   * @returns {Array} - Default phases
   * @private
   */
  _generateDefaultPhases(program) {
    const startDate = new Date();
    const processingTime = program.processingTime || { min: 3, max: 6, unit: 'months' };
    const targetCompletionDate = this._calculateTargetDate(startDate, processingTime.max, processingTime.unit);
    
    return [
      {
        title: 'Preparation',
        description: 'Gather documents and prepare for application',
        order: 1,
        status: 'not_started',
        startDate,
        endDate: this._calculateTargetDate(startDate, 1, 'months'),
        milestones: this._generateDefaultPreparationMilestones(program)
      },
      {
        title: 'Application',
        description: 'Submit application and supporting documents',
        order: 2,
        status: 'not_started',
        startDate: this._calculateTargetDate(startDate, 1, 'months'),
        endDate: this._calculateTargetDate(startDate, 2, 'months'),
        milestones: this._generateDefaultApplicationMilestones(program)
      },
      {
        title: 'Processing',
        description: 'Application processing and review',
        order: 3,
        status: 'not_started',
        startDate: this._calculateTargetDate(startDate, 2, 'months'),
        endDate: this._calculateTargetDate(startDate, 5, 'months'),
        milestones: this._generateDefaultProcessingMilestones(program)
      },
      {
        title: 'Decision',
        description: 'Receive decision and next steps',
        order: 4,
        status: 'not_started',
        startDate: this._calculateTargetDate(startDate, 5, 'months'),
        endDate: targetCompletionDate,
        milestones: this._generateDefaultDecisionMilestones(program)
      }
    ];
  }

  /**
   * Generate default preparation milestones
   * @param {Object} program - Program details
   * @returns {Array} - Default preparation milestones
   * @private
   */
  _generateDefaultPreparationMilestones(program) {
    return [
      {
        title: 'Document Checklist Review',
        description: 'Review required documents for your application',
        category: 'preparation',
        status: 'not_started',
        priority: 'high',
        tasks: [
          {
            title: 'Review document requirements',
            description: 'Carefully review all required documents for your application',
            status: 'not_started'
          },
          {
            title: 'Create document checklist',
            description: 'Create a checklist of all required documents',
            status: 'not_started'
          }
        ]
      },
      {
        title: 'Document Gathering',
        description: 'Gather all required documents for your application',
        category: 'document',
        status: 'not_started',
        priority: 'high',
        tasks: [
          {
            title: 'Collect identification documents',
            description: 'Gather passport, birth certificate, and other ID documents',
            status: 'not_started'
          },
          {
            title: 'Collect education documents',
            description: 'Gather diplomas, degrees, and transcripts',
            status: 'not_started'
          },
          {
            title: 'Collect employment documents',
            description: 'Gather employment letters, contracts, and pay stubs',
            status: 'not_started'
          }
        ]
      }
    ];
  }

  /**
   * Generate default application milestones
   * @param {Object} program - Program details
   * @returns {Array} - Default application milestones
   * @private
   */
  _generateDefaultApplicationMilestones(program) {
    return [
      {
        title: 'Application Form Completion',
        description: 'Complete all required application forms',
        category: 'application',
        status: 'not_started',
        priority: 'high',
        tasks: [
          {
            title: 'Download application forms',
            description: 'Download all required application forms from official website',
            status: 'not_started'
          },
          {
            title: 'Complete application forms',
            description: 'Fill out all application forms accurately and completely',
            status: 'not_started'
          },
          {
            title: 'Review application forms',
            description: 'Review all forms for accuracy and completeness',
            status: 'not_started'
          }
        ]
      },
      {
        title: 'Application Submission',
        description: 'Submit your application and supporting documents',
        category: 'application',
        status: 'not_started',
        priority: 'high',
        tasks: [
          {
            title: 'Pay application fees',
            description: 'Pay all required application fees',
            status: 'not_started'
          },
          {
            title: 'Submit application package',
            description: 'Submit your complete application package',
            status: 'not_started'
          },
          {
            title: 'Receive confirmation of receipt',
            description: 'Receive confirmation that your application has been received',
            status: 'not_started'
          }
        ]
      }
    ];
  }

  /**
   * Generate default processing milestones
   * @param {Object} program - Program details
   * @returns {Array} - Default processing milestones
   * @private
   */
  _generateDefaultProcessingMilestones(program) {
    return [
      {
        title: 'Application Processing',
        description: 'Your application is being processed',
        category: 'processing',
        status: 'not_started',
        priority: 'medium',
        tasks: [
          {
            title: 'Check application status',
            description: 'Regularly check the status of your application',
            status: 'not_started'
          },
          {
            title: 'Respond to requests for additional information',
            description: 'Promptly respond to any requests for additional information',
            status: 'not_started'
          }
        ]
      },
      {
        title: 'Biometrics Appointment',
        description: 'Attend biometrics appointment if required',
        category: 'processing',
        status: 'not_started',
        priority: 'high',
        tasks: [
          {
            title: 'Schedule biometrics appointment',
            description: 'Schedule your biometrics appointment when instructed',
            status: 'not_started'
          },
          {
            title: 'Attend biometrics appointment',
            description: 'Attend your biometrics appointment as scheduled',
            status: 'not_started'
          }
        ]
      }
    ];
  }

  /**
   * Generate default decision milestones
   * @param {Object} program - Program details
   * @returns {Array} - Default decision milestones
   * @private
   */
  _generateDefaultDecisionMilestones(program) {
    return [
      {
        title: 'Application Decision',
        description: 'Receive decision on your application',
        category: 'decision',
        status: 'not_started',
        priority: 'high',
        tasks: [
          {
            title: 'Receive decision notification',
            description: 'Receive notification of decision on your application',
            status: 'not_started'
          },
          {
            title: 'Review decision details',
            description: 'Carefully review all details of the decision',
            status: 'not_started'
          }
        ]
      },
      {
        title: 'Post-Approval Steps',
        description: 'Complete required steps after approval',
        category: 'other',
        status: 'not_started',
        priority: 'high',
        tasks: [
          {
            title: 'Pay right of permanent residence fee (if applicable)',
            description: 'Pay the right of permanent residence fee if required',
            status: 'not_started'
          },
          {
            title: 'Complete medical examination (if required)',
            description: 'Complete medical examination if required',
            status: 'not_started'
          }
        ]
      }
    ];
  }
}

module.exports = RoadmapTemplateService;
