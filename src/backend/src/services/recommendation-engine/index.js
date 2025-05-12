/**
 * Recommendation Engine Service
 * 
 * This is the main entry point for the recommendation engine.
 * It coordinates the different components of the recommendation system.
 */

const { logger } = require('../../utils/logger');
const ProfileAnalyzer = require('./profile-analyzer');
const ProgramMatcher = require('./program-matcher');
const GapAnalyzer = require('./gap-analyzer');
const RecommendationRanker = require('./recommendation-ranker');
const ImmigrationDataService = require('../../data/immigration');

class RecommendationEngineService {
  constructor() {
    this.profileAnalyzer = new ProfileAnalyzer();
    this.programMatcher = new ProgramMatcher();
    this.gapAnalyzer = new GapAnalyzer();
    this.recommendationRanker = new RecommendationRanker();
    this.immigrationDataService = new ImmigrationDataService();
  }

  /**
   * Initialize the recommendation engine
   */
  async initialize() {
    logger.info('Initializing recommendation engine');
    await this.immigrationDataService.initialize();
    logger.info('Recommendation engine initialized');
  }

  /**
   * Generate recommendations for a user
   * @param {string} userId - User ID
   * @param {string} sessionId - Assessment session ID (optional)
   * @param {Object} options - Options for recommendation generation
   * @returns {Promise<Object>} - Recommendations
   */
  async generateRecommendations(userId, sessionId = null, options = {}) {
    try {
      logger.info(`Generating recommendations for user ${userId}`);
      const startTime = Date.now();

      // Set default options
      const defaultOptions = {
        maxResults: 10,
        includeGapAnalysis: true,
        includeAlternativePrograms: true,
        preferences: {}
      };
      
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Step 1: Analyze user profile
      const profileAnalysis = await this.profileAnalyzer.analyzeProfile(userId, sessionId);
      logger.info(`Profile analysis completed for user ${userId}`);
      
      // Step 2: Get all eligible programs
      const allPrograms = await this.immigrationDataService.getAllPrograms();
      logger.info(`Retrieved ${allPrograms.length} immigration programs`);
      
      // Step 3: Match programs to user profile
      const matchedPrograms = await this.programMatcher.matchPrograms(
        profileAnalysis, 
        allPrograms,
        mergedOptions.preferences
      );
      logger.info(`Matched ${matchedPrograms.length} programs for user ${userId}`);
      
      // Step 4: Analyze gaps for each matched program
      let programsWithGaps = matchedPrograms;
      if (mergedOptions.includeGapAnalysis) {
        programsWithGaps = await this.gapAnalyzer.analyzeGaps(
          profileAnalysis, 
          matchedPrograms
        );
        logger.info(`Gap analysis completed for ${programsWithGaps.length} programs`);
      }
      
      // Step 5: Rank recommendations
      const rankedRecommendations = await this.recommendationRanker.rankRecommendations(
        programsWithGaps,
        mergedOptions.preferences
      );
      logger.info(`Ranked ${rankedRecommendations.length} recommendations`);
      
      // Step 6: Find alternative programs if requested
      let alternativePrograms = [];
      if (mergedOptions.includeAlternativePrograms && rankedRecommendations.length < mergedOptions.maxResults) {
        alternativePrograms = await this.findAlternativePrograms(
          profileAnalysis,
          rankedRecommendations,
          allPrograms,
          mergedOptions.maxResults - rankedRecommendations.length
        );
        logger.info(`Found ${alternativePrograms.length} alternative programs`);
      }
      
      // Step 7: Prepare final recommendations
      const finalRecommendations = this.prepareFinalRecommendations(
        rankedRecommendations,
        alternativePrograms,
        mergedOptions.maxResults
      );
      
      const processingTime = Date.now() - startTime;
      logger.info(`Generated ${finalRecommendations.recommendationResults.length} recommendations in ${processingTime}ms`);
      
      return {
        ...finalRecommendations,
        processingTime
      };
    } catch (error) {
      logger.error(`Error generating recommendations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find alternative programs when primary recommendations are insufficient
   * @param {Object} profileAnalysis - User profile analysis
   * @param {Array} primaryRecommendations - Primary recommendations
   * @param {Array} allPrograms - All available programs
   * @param {number} limit - Maximum number of alternative programs to find
   * @returns {Promise<Array>} - Alternative programs
   */
  async findAlternativePrograms(profileAnalysis, primaryRecommendations, allPrograms, limit) {
    try {
      // Get IDs of primary recommendations
      const primaryProgramIds = primaryRecommendations.map(rec => rec.programId);
      
      // Filter out programs already in primary recommendations
      const remainingPrograms = allPrograms.filter(program => 
        !primaryProgramIds.includes(program.programId)
      );
      
      // Use a more relaxed matching algorithm
      const relaxedMatches = await this.programMatcher.matchProgramsRelaxed(
        profileAnalysis,
        remainingPrograms
      );
      
      // Limit the number of alternative programs
      return relaxedMatches.slice(0, limit);
    } catch (error) {
      logger.error(`Error finding alternative programs: ${error.message}`);
      return [];
    }
  }

  /**
   * Prepare final recommendations
   * @param {Array} primaryRecommendations - Primary recommendations
   * @param {Array} alternativePrograms - Alternative programs
   * @param {number} maxResults - Maximum number of results
   * @returns {Object} - Final recommendations
   */
  prepareFinalRecommendations(primaryRecommendations, alternativePrograms, maxResults) {
    // Combine primary and alternative recommendations
    const allRecommendations = [
      ...primaryRecommendations.map(rec => ({
        ...rec,
        isAlternative: false
      })),
      ...alternativePrograms.map(rec => ({
        ...rec,
        isAlternative: true
      }))
    ];
    
    // Limit to maxResults
    const limitedRecommendations = allRecommendations.slice(0, maxResults);
    
    // Group recommendations by country
    const recommendationsByCountry = {};
    limitedRecommendations.forEach(rec => {
      if (!recommendationsByCountry[rec.countryId]) {
        recommendationsByCountry[rec.countryId] = [];
      }
      recommendationsByCountry[rec.countryId].push(rec);
    });
    
    return {
      recommendationResults: limitedRecommendations,
      recommendationsByCountry,
      totalCount: limitedRecommendations.length,
      primaryCount: primaryRecommendations.length,
      alternativeCount: Math.min(alternativePrograms.length, maxResults - primaryRecommendations.length)
    };
  }
}

module.exports = RecommendationEngineService;
