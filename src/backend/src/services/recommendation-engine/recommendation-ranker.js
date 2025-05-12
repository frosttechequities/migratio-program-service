/**
 * Recommendation Ranker
 * 
 * Ranks immigration program recommendations based on match scores and user preferences.
 */

const { logger } = require('../../utils/logger');

class RecommendationRanker {
  /**
   * Rank recommendations based on match scores and user preferences
   * @param {Array} matchedPrograms - Programs matched to the user
   * @param {Object} preferences - User preferences
   * @returns {Promise<Array>} - Ranked recommendations
   */
  async rankRecommendations(matchedPrograms, preferences = {}) {
    try {
      logger.info(`Ranking ${matchedPrograms.length} recommendations`);
      
      // Calculate composite scores
      const programsWithScores = matchedPrograms.map(program => {
        try {
          return this.calculateCompositeScore(program, preferences);
        } catch (error) {
          logger.error(`Error calculating composite score for program ${program.programId}: ${error.message}`);
          return program;
        }
      });
      
      // Sort by composite score (descending)
      programsWithScores.sort((a, b) => b.compositeScore - a.compositeScore);
      
      logger.info(`Ranked ${programsWithScores.length} recommendations`);
      return programsWithScores;
    } catch (error) {
      logger.error(`Error ranking recommendations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate composite score for a program
   * @param {Object} program - Matched program
   * @param {Object} preferences - User preferences
   * @returns {Object} - Program with composite score
   */
  calculateCompositeScore(program, preferences) {
    // Create a copy of the program
    const programWithScore = { ...program };
    
    // Get base score from match score
    const matchScore = program.matchScore || 0;
    
    // Calculate preference alignment score
    const preferenceScore = this.calculatePreferenceScore(program, preferences);
    
    // Calculate processing time score (higher for faster processing)
    const processingTimeScore = this.calculateProcessingTimeScore(program);
    
    // Calculate cost score (higher for lower cost)
    const costScore = this.calculateCostScore(program);
    
    // Calculate success probability score
    const successScore = this.calculateSuccessScore(program);
    
    // Determine weights based on user priorities
    const weights = this.determineWeights(preferences);
    
    // Calculate composite score
    const compositeScore = (
      (matchScore * weights.match) +
      (preferenceScore * weights.preference) +
      (processingTimeScore * weights.processingTime) +
      (costScore * weights.cost) +
      (successScore * weights.success)
    ) / (
      weights.match +
      weights.preference +
      weights.processingTime +
      weights.cost +
      weights.success
    );
    
    // Add scores to program
    programWithScore.compositeScore = Math.round(compositeScore);
    programWithScore.scoreComponents = {
      matchScore,
      preferenceScore,
      processingTimeScore,
      costScore,
      successScore
    };
    
    return programWithScore;
  }

  /**
   * Calculate preference alignment score
   * @param {Object} program - Matched program
   * @param {Object} preferences - User preferences
   * @returns {number} - Preference alignment score
   */
  calculatePreferenceScore(program, preferences) {
    let score = 50; // Start with neutral score
    
    // Check country preference
    if (preferences.countries && preferences.countries.length > 0) {
      if (preferences.countries.includes(program.countryId)) {
        score += 20;
      } else {
        score -= 20;
      }
    }
    
    // Check pathway type preference
    if (preferences.pathwayTypes && preferences.pathwayTypes.length > 0) {
      if (preferences.pathwayTypes.includes(program.category)) {
        score += 20;
      } else {
        score -= 10;
      }
    }
    
    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate processing time score
   * @param {Object} program - Matched program
   * @returns {number} - Processing time score
   */
  calculateProcessingTimeScore(program) {
    if (!program.processingTime || !program.processingTime.max) {
      return 50; // Neutral score if no data
    }
    
    const maxMonths = program.processingTime.max;
    
    // Higher score for faster processing
    if (maxMonths <= 3) {
      return 100;
    } else if (maxMonths <= 6) {
      return 90;
    } else if (maxMonths <= 9) {
      return 80;
    } else if (maxMonths <= 12) {
      return 70;
    } else if (maxMonths <= 18) {
      return 50;
    } else if (maxMonths <= 24) {
      return 30;
    } else {
      return 10;
    }
  }

  /**
   * Calculate cost score
   * @param {Object} program - Matched program
   * @returns {number} - Cost score
   */
  calculateCostScore(program) {
    if (!program.fees || !program.fees.total) {
      return 50; // Neutral score if no data
    }
    
    const totalCost = program.fees.total;
    
    // Higher score for lower cost
    if (totalCost <= 500) {
      return 100;
    } else if (totalCost <= 1000) {
      return 90;
    } else if (totalCost <= 1500) {
      return 80;
    } else if (totalCost <= 2000) {
      return 70;
    } else if (totalCost <= 3000) {
      return 60;
    } else if (totalCost <= 5000) {
      return 50;
    } else if (totalCost <= 10000) {
      return 30;
    } else {
      return 10;
    }
  }

  /**
   * Calculate success probability score
   * @param {Object} program - Matched program
   * @returns {number} - Success probability score
   */
  calculateSuccessScore(program) {
    if (!program.successProbability) {
      return 50; // Neutral score if no data
    }
    
    // Convert probability (0-1) to score (0-100)
    return program.successProbability * 100;
  }

  /**
   * Determine weights based on user priorities
   * @param {Object} preferences - User preferences
   * @returns {Object} - Weights for different factors
   */
  determineWeights(preferences) {
    // Default weights
    const weights = {
      match: 40,
      preference: 20,
      processingTime: 15,
      cost: 15,
      success: 10
    };
    
    // Adjust weights based on priority factors
    if (preferences.priorityFactors) {
      if (preferences.priorityFactors.includes('processing_time')) {
        weights.processingTime += 15;
        weights.match -= 5;
        weights.preference -= 5;
        weights.cost -= 5;
      }
      
      if (preferences.priorityFactors.includes('cost')) {
        weights.cost += 15;
        weights.match -= 5;
        weights.preference -= 5;
        weights.processingTime -= 5;
      }
      
      if (preferences.priorityFactors.includes('success_rate')) {
        weights.success += 15;
        weights.match -= 5;
        weights.preference -= 5;
        weights.processingTime -= 5;
      }
    }
    
    // Adjust weights based on sort preference
    if (preferences.sortBy) {
      switch (preferences.sortBy) {
        case 'processingTime':
          weights.processingTime += 20;
          weights.match -= 10;
          weights.preference -= 10;
          break;
          
        case 'cost':
          weights.cost += 20;
          weights.match -= 10;
          weights.preference -= 10;
          break;
          
        case 'successProbability':
          weights.success += 20;
          weights.match -= 10;
          weights.preference -= 10;
          break;
      }
    }
    
    return weights;
  }
}

module.exports = RecommendationRanker;
