const { Roadmap } = require('../models/roadmap.model');
const { Recommendation } = require('../models/recommendation.model');
const { Program } = require('../models/program.model');
const { logger } = require('../utils/logger');

/**
 * Roadmap Service
 * Handles roadmap generation and management
 */
class RoadmapService {
  /**
   * Generate a new roadmap based on a recommendation
   * @param {string} userId - User ID
   * @param {string} recommendationId - Recommendation ID
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} - Generated roadmap
   */
  async generateRoadmap(userId, recommendationId, options = {}) {
    try {
      logger.info(`Generating roadmap for user ${userId} based on recommendation ${recommendationId}`);
      
      // Get recommendation
      const recommendation = await Recommendation.findOne({
        _id: recommendationId,
        userId
      });

      if (!recommendation) {
        throw new Error('Recommendation not found');
      }

      // Get program details
      const programId = options.programId || recommendation.topPrograms[0]?.programId;
      
      if (!programId) {
        throw new Error('No program specified for roadmap generation');
      }

      const program = await Program.findOne({ programId });
      
      if (!program) {
        throw new Error('Program not found');
      }

      // Create roadmap title
      const title = options.title || `${program.name} Immigration Roadmap`;
      
      // Calculate timeline
      const startDate = options.startDate || new Date();
      const processingTime = program.processingTime || { min: 3, max: 6, unit: 'months' };
      
      // Calculate target completion date (using the max processing time)
      const targetCompletionDate = this._calculateTargetDate(startDate, processingTime.max, processingTime.unit);
      
      // Create phases based on program
      const phases = this._generatePhases(program, startDate, targetCompletionDate);
      
      // Create roadmap
      const roadmap = new Roadmap({
        userId,
        programId,
        recommendationId,
        title,
        description: options.description || `A personalized roadmap for your ${program.name} immigration journey.`,
        status: 'draft',
        startDate,
        targetCompletionDate,
        phases,
        completionPercentage: 0,
        estimatedCost: {
          total: program.estimatedCost?.total || 0,
          currency: program.estimatedCost?.currency || 'USD',
          breakdown: program.estimatedCost?.breakdown || []
        },
        tags: [program.country, program.category, 'immigration'],
        visibility: options.visibility || 'private'
      });

      // Calculate completion percentage
      roadmap.calculateCompletionPercentage();
      
      // Save roadmap
      await roadmap.save();
      
      logger.info(`Roadmap generated successfully for user ${userId}`);
      
      return roadmap;
    } catch (error) {
      logger.error(`Error generating roadmap: ${error.message}`, { userId, recommendationId, error });
      throw error;
    }
  }

  /**
   * Get roadmaps for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - User roadmaps
   */
  async getRoadmaps(userId, options = {}) {
    try {
      // Build query
      const query = { userId };

      // Add status filter if provided
      if (options.status) {
        query.status = options.status;
      }

      // Add archived filter
      if (options.includeArchived !== true) {
        query.status = { $ne: 'archived' };
      }

      // Get roadmaps
      let roadmaps = await Roadmap.find(query)
        .sort({ updatedAt: -1 })
        .limit(options.limit || 10);

      return roadmaps;
    } catch (error) {
      logger.error(`Error getting roadmaps: ${error.message}`, { userId, error });
      throw error;
    }
  }

  /**
   * Get a roadmap by ID
   * @param {string} roadmapId - Roadmap ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Roadmap
   */
  async getRoadmap(roadmapId, userId) {
    try {
      const roadmap = await Roadmap.findOne({
        _id: roadmapId,
        $or: [
          { userId },
          { 'sharedWith.userId': userId },
          { visibility: 'public' }
        ]
      });

      if (!roadmap) {
        throw new Error('Roadmap not found or access denied');
      }

      return roadmap;
    } catch (error) {
      logger.error(`Error getting roadmap: ${error.message}`, { roadmapId, userId, error });
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
   * Generate phases for a roadmap based on program
   * @param {Object} program - Program details
   * @param {Date} startDate - Start date
   * @param {Date} targetCompletionDate - Target completion date
   * @returns {Array} - Phases
   * @private
   */
  _generatePhases(program, startDate, targetCompletionDate) {
    // Default phases if program doesn't have specific phases
    const defaultPhases = [
      {
        title: 'Preparation',
        description: 'Gather documents and prepare for application',
        order: 1,
        status: 'not_started',
        startDate,
        endDate: this._calculateTargetDate(startDate, 1, 'months'),
        milestones: this._generatePreparationMilestones(program)
      },
      {
        title: 'Application',
        description: 'Submit application and supporting documents',
        order: 2,
        status: 'not_started',
        startDate: this._calculateTargetDate(startDate, 1, 'months'),
        endDate: this._calculateTargetDate(startDate, 2, 'months'),
        milestones: this._generateApplicationMilestones(program)
      },
      {
        title: 'Processing',
        description: 'Application processing and review',
        order: 3,
        status: 'not_started',
        startDate: this._calculateTargetDate(startDate, 2, 'months'),
        endDate: this._calculateTargetDate(startDate, 5, 'months'),
        milestones: this._generateProcessingMilestones(program)
      },
      {
        title: 'Decision',
        description: 'Receive decision and next steps',
        order: 4,
        status: 'not_started',
        startDate: this._calculateTargetDate(startDate, 5, 'months'),
        endDate: targetCompletionDate,
        milestones: this._generateDecisionMilestones(program)
      }
    ];
    
    // Use program-specific phases if available, otherwise use default
    return program.phases || defaultPhases;
  }

  /**
   * Generate preparation milestones
   * @param {Object} program - Program details
   * @returns {Array} - Preparation milestones
   * @private
   */
  _generatePreparationMilestones(program) {
    const milestones = [
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
    
    // Add program-specific preparation milestones if available
    if (program.preparationMilestones && program.preparationMilestones.length > 0) {
      return [...milestones, ...program.preparationMilestones];
    }
    
    return milestones;
  }

  /**
   * Generate application milestones
   * @param {Object} program - Program details
   * @returns {Array} - Application milestones
   * @private
   */
  _generateApplicationMilestones(program) {
    const milestones = [
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
    
    // Add program-specific application milestones if available
    if (program.applicationMilestones && program.applicationMilestones.length > 0) {
      return [...milestones, ...program.applicationMilestones];
    }
    
    return milestones;
  }

  /**
   * Generate processing milestones
   * @param {Object} program - Program details
   * @returns {Array} - Processing milestones
   * @private
   */
  _generateProcessingMilestones(program) {
    const milestones = [
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
    
    // Add program-specific processing milestones if available
    if (program.processingMilestones && program.processingMilestones.length > 0) {
      return [...milestones, ...program.processingMilestones];
    }
    
    return milestones;
  }

  /**
   * Generate decision milestones
   * @param {Object} program - Program details
   * @returns {Array} - Decision milestones
   * @private
   */
  _generateDecisionMilestones(program) {
    const milestones = [
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
    
    // Add program-specific decision milestones if available
    if (program.decisionMilestones && program.decisionMilestones.length > 0) {
      return [...milestones, ...program.decisionMilestones];
    }
    
    return milestones;
  }
}

module.exports = RoadmapService;
