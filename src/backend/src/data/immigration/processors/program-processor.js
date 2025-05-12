/**
 * Immigration Program Data Processor
 * 
 * Processes and standardizes immigration program data from different sources.
 */

const { logger } = require('../../../utils/logger');

class ImmigrationProgramProcessor {
  /**
   * Process immigration program data
   * @param {Object} rawData - Raw immigration data
   * @returns {Object} - Processed immigration data
   */
  process(rawData) {
    try {
      logger.info(`Processing immigration data for ${rawData.country}`);
      
      const processedPrograms = rawData.programs.map(program => this.processProgram(program));
      
      return {
        country: rawData.country,
        programs: processedPrograms,
        lastUpdated: rawData.lastUpdated
      };
    } catch (error) {
      logger.error(`Error processing immigration data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process a single immigration program
   * @param {Object} program - Raw program data
   * @returns {Object} - Processed program data
   */
  processProgram(program) {
    try {
      // Create standardized program object
      const processedProgram = {
        programId: program.id,
        name: program.name,
        country: program.country,
        category: program.category,
        description: program.description,
        officialUrl: program.officialUrl,
        streams: program.streams || [],
        eligibilitySummary: program.eligibilitySummary,
        eligibilityCriteria: this.processEligibilityCriteria(program.eligibilityCriteria || []),
        processingTime: this.processProcessingTime(program.processingTime),
        fees: this.processFees(program.fees),
        successRate: program.successRate || null,
        lastUpdated: program.lastUpdated
      };
      
      return processedProgram;
    } catch (error) {
      logger.error(`Error processing program ${program.id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process eligibility criteria
   * @param {Array} criteria - Raw eligibility criteria
   * @returns {Array} - Processed eligibility criteria
   */
  processEligibilityCriteria(criteria) {
    return criteria.map(criterion => {
      // Create standardized criterion object
      const processedCriterion = {
        criterionId: criterion.id,
        name: criterion.name,
        description: criterion.description,
        type: criterion.type,
        required: criterion.required || false,
        points: criterion.points || 0
      };
      
      // Add type-specific properties
      switch (criterion.type) {
        case 'range':
          processedCriterion.min = criterion.min;
          processedCriterion.max = criterion.max;
          processedCriterion.idealMin = criterion.idealMin;
          processedCriterion.idealMax = criterion.idealMax;
          processedCriterion.unit = criterion.unit;
          break;
          
        case 'level':
          processedCriterion.levels = criterion.levels;
          break;
          
        case 'language':
          processedCriterion.languages = criterion.languages;
          processedCriterion.skills = criterion.skills;
          processedCriterion.minLevel = criterion.minLevel;
          processedCriterion.maxLevel = criterion.maxLevel;
          break;
          
        case 'boolean':
          // No additional properties needed
          break;
          
        case 'composite':
          processedCriterion.factors = criterion.factors;
          break;
          
        case 'money':
          processedCriterion.amounts = criterion.amounts;
          processedCriterion.currency = criterion.currency;
          break;
      }
      
      return processedCriterion;
    });
  }

  /**
   * Process processing time
   * @param {Object} processingTime - Raw processing time
   * @returns {Object} - Processed processing time
   */
  processProcessingTime(processingTime) {
    if (!processingTime) {
      return null;
    }
    
    // If it's a string (e.g., "6-8 months"), parse it
    if (typeof processingTime === 'string') {
      const match = processingTime.match(/(\d+)-(\d+)\s+(\w+)/);
      if (match) {
        return {
          min: parseInt(match[1]),
          max: parseInt(match[2]),
          unit: match[3],
          formatted: processingTime
        };
      }
      
      return {
        formatted: processingTime
      };
    }
    
    // If it's already an object, return it as is
    return processingTime;
  }

  /**
   * Process fees
   * @param {Object} fees - Raw fees
   * @returns {Object} - Processed fees
   */
  processFees(fees) {
    if (!fees) {
      return null;
    }
    
    // If it's already an object, return it as is
    return fees;
  }
}

module.exports = ImmigrationProgramProcessor;
