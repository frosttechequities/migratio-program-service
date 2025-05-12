const { Recommendation } = require('../models/recommendation.model');
const { Match } = require('../models/match.model');
const { Program } = require('../models/program.model');
const { Profile } = require('../models/profile.model');
const MatchingAlgorithmService = require('./matching-algorithm.service');
const GapAnalysisService = require('./gap-analysis.service');
const { logger } = require('../utils/logger');

/**
 * Recommendation Engine Service
 * Generates and manages program recommendations for users
 */
class RecommendationEngineService {
  constructor() {
    this.matchingAlgorithm = new MatchingAlgorithmService();
    this.gapAnalysis = new GapAnalysisService();
  }

  /**
   * Generate recommendations for a user
   * @param {string} userId - User ID
   * @param {string} sessionId - Session ID
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} - Generated recommendations
   */
  async generateRecommendations(userId, sessionId, options = {}) {
    try {
      const startTime = Date.now();

      // Create recommendation record
      const recommendation = new Recommendation({
        userId,
        sessionId,
        status: 'processing',
        userPreferences: options.preferences || {},
        algorithmVersion: '1.0'
      });

      await recommendation.save();

      // Get user profile
      const userProfile = await Profile.findOne({ userId });

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Get all active programs
      const programs = await Program.findActive();

      if (!programs || programs.length === 0) {
        throw new Error('No active programs found');
      }

      // Calculate match scores for all programs
      const matchResults = [];

      for (const program of programs) {
        // Calculate match score
        const matchResult = this.matchingAlgorithm.calculateMatchScore(
          userProfile,
          program,
          { applyPreferenceAdjustments: true }
        );

        // Add recommendation ID to match result
        matchResult.recommendationId = recommendation._id;

        // Save match result
        const match = new Match(matchResult);
        await match.save();

        // Add to match results
        matchResults.push({
          match,
          program
        });
      }

      // Sort match results by score
      matchResults.sort((a, b) => b.match.overallScore - a.match.overallScore);

      // Perform gap analysis for top matches
      const topMatches = matchResults.slice(0, options.maxResults || 10);

      for (const { match, program } of topMatches) {
        // Perform gap analysis
        const gapAnalysisResult = await this.gapAnalysis.performGapAnalysis(
          userProfile,
          program,
          match
        );

        // Find alternative programs for this match
        const alternativePrograms = await this.gapAnalysis.findAlternativePrograms(
          userProfile,
          programs,
          program,
          match
        );

        // Update gap analysis with alternative programs
        gapAnalysisResult.alternativePrograms = alternativePrograms.slice(0, 3);
        await gapAnalysisResult.save();
      }

      // Format recommendation results
      const recommendationResults = topMatches.map(({ match, program }, index) => {
        // Determine match category
        let matchCategory;
        if (match.overallScore >= 80) {
          matchCategory = 'excellent';
        } else if (match.overallScore >= 60) {
          matchCategory = 'good';
        } else if (match.overallScore >= 40) {
          matchCategory = 'moderate';
        } else {
          matchCategory = 'low';
        }

        // Get top strengths
        const keyStrengths = match.criterionScores
          .filter(cs => cs.impact === 'positive')
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(cs => ({
            criterionId: cs.criterionId,
            criterionName: cs.criterionName,
            score: cs.score,
            description: cs.description
          }));

        // Get key weaknesses
        const keyWeaknesses = match.criterionScores
          .filter(cs => cs.impact === 'negative')
          .sort((a, b) => a.score - b.score)
          .slice(0, 3)
          .map(cs => ({
            criterionId: cs.criterionId,
            criterionName: cs.criterionName,
            score: cs.score,
            description: cs.description
          }));

        return {
          programId: program.programId,
          countryId: program.countryId,
          matchScore: match.overallScore,
          rank: index + 1,
          matchCategory,
          keyStrengths,
          keyWeaknesses,
          gapAnalysisId: match.gapAnalysisId,
          matchDetails: match._id,
          estimatedProcessingTime: program.details ? program.details.processingTime : undefined,
          estimatedCost: program.details ? program.details.totalCost : undefined,
          successProbability: this._calculateSuccessProbability(match, program),
          notes: this._generateRecommendationNotes(match, program)
        };
      });

      // Update recommendation with results
      recommendation.recommendationResults = recommendationResults;
      recommendation.status = 'completed';
      recommendation.completedAt = new Date();
      recommendation.processingTime = Date.now() - startTime;

      await recommendation.save();

      return recommendation;
    } catch (error) {
      logger.error('Error generating recommendations:', error);

      // Update recommendation status to failed
      if (arguments[0] && arguments[1]) {
        await Recommendation.findOneAndUpdate(
          { userId: arguments[0], sessionId: arguments[1] },
          {
            status: 'failed',
            error: {
              message: error.message,
              stack: error.stack
            }
          }
        );
      }

      throw error;
    }
  }

  /**
   * Get recommendations for a user
   * @param {string} userId - User ID
   * @param {Object} options - Retrieval options
   * @returns {Promise<Array>} - User recommendations
   */
  async getRecommendations(userId, options = {}) {
    try {
      // Build query
      const query = { userId };

      // Add session ID if provided
      if (options.sessionId) {
        query.sessionId = options.sessionId;
      }

      // Add status if provided
      if (options.status) {
        query.status = options.status;
      } else {
        query.status = 'completed'; // Default to completed
      }

      // Add archived filter
      if (options.includeArchived !== true) {
        query.isArchived = { $ne: true };
      }

      // Get recommendations
      let recommendations = await Recommendation.find(query)
        .sort({ createdAt: -1 })
        .limit(options.limit || 10);

      // Apply filtering if specified
      if (options.filters && recommendations.length > 0) {
        recommendations = recommendations.map(rec => {
          // Apply country filter
          if (options.filters.countries && options.filters.countries.length > 0) {
            rec.recommendationResults = rec.recommendationResults.filter(result =>
              options.filters.countries.includes(result.countryId)
            );
          }

          // Apply category filter
          if (options.filters.categories && options.filters.categories.length > 0) {
            // This would require joining with the Program model to filter by category
            // For simplicity, we'll skip this filter in this implementation
          }

          // Apply match score filter
          if (options.filters.minMatchScore) {
            rec.recommendationResults = rec.recommendationResults.filter(result =>
              result.matchScore >= options.filters.minMatchScore
            );
          }

          // Apply processing time filter
          if (options.filters.maxProcessingTime) {
            rec.recommendationResults = rec.recommendationResults.filter(result =>
              result.estimatedProcessingTime &&
              result.estimatedProcessingTime.average <= options.filters.maxProcessingTime
            );
          }

          // Apply cost filter
          if (options.filters.maxCost) {
            rec.recommendationResults = rec.recommendationResults.filter(result =>
              result.estimatedCost &&
              (result.estimatedCost.max || result.estimatedCost.min) <= options.filters.maxCost
            );
          }

          return rec;
        });
      }

      // Apply sorting if specified
      if (options.sortBy && recommendations.length > 0) {
        recommendations = recommendations.map(rec => {
          // Sort recommendation results
          rec.recommendationResults.sort((a, b) => {
            let aValue, bValue;

            switch (options.sortBy) {
              case 'matchScore':
                aValue = a.matchScore;
                bValue = b.matchScore;
                break;

              case 'processingTime':
                aValue = a.estimatedProcessingTime ? a.estimatedProcessingTime.average : Infinity;
                bValue = b.estimatedProcessingTime ? b.estimatedProcessingTime.average : Infinity;
                break;

              case 'cost':
                aValue = a.estimatedCost ? (a.estimatedCost.min + a.estimatedCost.max) / 2 : Infinity;
                bValue = b.estimatedCost ? (b.estimatedCost.min + b.estimatedCost.max) / 2 : Infinity;
                break;

              case 'successProbability':
                aValue = a.successProbability;
                bValue = b.successProbability;
                break;

              default:
                aValue = a.matchScore;
                bValue = b.matchScore;
            }

            // Apply sort direction
            return options.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
          });

          // Update ranks
          rec.recommendationResults.forEach((result, index) => {
            result.rank = index + 1;
          });

          return rec;
        });
      }

      return recommendations;
    } catch (error) {
      logger.error('Error getting recommendations:', error);
      throw error;
    }
  }

  /**
   * Get recommendation details
   * @param {string} recommendationId - Recommendation ID
   * @returns {Promise<Object>} - Recommendation details
   */
  async getRecommendationDetails(recommendationId) {
    try {
      // Get recommendation
      const recommendation = await Recommendation.findById(recommendationId);

      if (!recommendation) {
        throw new Error('Recommendation not found');
      }

      // Get program details for each result
      const enrichedResults = [];

      for (const result of recommendation.recommendationResults) {
        // Get program details
        const program = await Program.getDetails(result.programId);

        if (!program) {
          continue;
        }

        // Get match details
        const match = await Match.findById(result.matchDetails);

        // Enrich result with program and match details
        enrichedResults.push({
          ...result.toObject(),
          program: {
            name: program.name,
            description: program.shortDescription || program.description,
            category: program.category,
            subcategory: program.subcategory,
            officialName: program.officialName,
            officialWebsite: program.officialWebsite
          },
          matchDetails: match ? {
            categoryScores: match.categoryScores,
            criterionScores: match.criterionScores
          } : undefined
        });
      }

      // Return enriched recommendation
      return {
        ...recommendation.toObject(),
        recommendationResults: enrichedResults
      };
    } catch (error) {
      logger.error('Error getting recommendation details:', error);
      throw error;
    }
  }

  /**
   * Archive a recommendation
   * @param {string} recommendationId - Recommendation ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Updated recommendation
   */
  async archiveRecommendation(recommendationId, userId) {
    try {
      // Find and update recommendation
      const recommendation = await Recommendation.findOneAndUpdate(
        { _id: recommendationId, userId },
        { isArchived: true },
        { new: true }
      );

      if (!recommendation) {
        throw new Error('Recommendation not found or not owned by user');
      }

      return recommendation;
    } catch (error) {
      logger.error('Error archiving recommendation:', error);
      throw error;
    }
  }

  /**
   * Add feedback to a recommendation
   * @param {string} recommendationId - Recommendation ID
   * @param {string} programId - Program ID
   * @param {Object} feedback - User feedback
   * @returns {Promise<Object>} - Updated recommendation
   */
  async addFeedback(recommendationId, programId, feedback) {
    try {
      // Get recommendation
      const recommendation = await Recommendation.findById(recommendationId);

      if (!recommendation) {
        throw new Error('Recommendation not found');
      }

      // Add feedback
      await recommendation.addFeedback(
        programId,
        feedback.relevanceRating,
        feedback.comments
      );

      return recommendation;
    } catch (error) {
      logger.error('Error adding feedback:', error);
      throw error;
    }
  }

  /**
   * Calculate success probability
   * @param {Object} match - Match result
   * @param {Object} program - Program
   * @returns {number} - Success probability (0-100)
   * @private
   */
  _calculateSuccessProbability(match, program) {
    // Base probability on match score
    let probability = match.overallScore;

    // Adjust based on program success rate if available
    if (program.details && program.details.successRate && program.details.successRate.value) {
      probability = (probability + program.details.successRate.value) / 2;
    }

    // Adjust based on critical criteria
    const criticalCriteria = match.criterionScores.filter(cs =>
      cs.impact === 'negative' && cs.score < 30
    );

    // Reduce probability for each critical criterion not met
    probability -= criticalCriteria.length * 10;

    // Ensure probability is within 0-100 range
    return Math.max(0, Math.min(100, probability));
  }

  /**
   * Generate recommendation notes
   * @param {Object} match - Match result
   * @param {Object} program - Program
   * @returns {string} - Recommendation notes
   * @private
   */
  _generateRecommendationNotes(match, program) {
    // Generate notes based on match result
    let notes = '';

    // Add note about overall match
    if (match.overallScore >= 80) {
      notes += 'This program is an excellent match for your profile. ';
    } else if (match.overallScore >= 60) {
      notes += 'This program is a good match for your profile. ';
    } else if (match.overallScore >= 40) {
      notes += 'This program is a moderate match for your profile. Some improvements may be needed. ';
    } else {
      notes += 'This program is a low match for your profile. Significant improvements would be needed. ';
    }

    // Add note about critical criteria
    const criticalCriteria = match.criterionScores.filter(cs =>
      cs.impact === 'negative' && cs.score < 30
    );

    if (criticalCriteria.length > 0) {
      notes += `There are ${criticalCriteria.length} critical criteria that need attention. `;
    }

    // Add note about program details
    if (program.details) {
      if (program.details.processingTime) {
        const avgTime = program.details.processingTime.average ||
          ((program.details.processingTime.min || 0) + (program.details.processingTime.max || 0)) / 2;

        notes += `Average processing time is approximately ${avgTime} months. `;
      }

      if (program.details.pathToPermanentResidence && program.details.pathToPermanentResidence.hasPathway) {
        notes += `This program offers a pathway to permanent residence after approximately ${program.details.pathToPermanentResidence.timeToEligibility} months. `;
      }
    }

    return notes;
  }

  /**
   * Get match details
   * @param {string} matchId - Match ID
   * @returns {Promise<Object>} - Match details
   */
  async getMatchDetails(matchId) {
    try {
      // Get match
      const match = await Match.findById(matchId);

      if (!match) {
        throw new Error('Match not found');
      }

      return match;
    } catch (error) {
      logger.error('Error getting match details:', error);
      throw error;
    }
  }

  /**
   * Get gap analysis
   * @param {string} gapAnalysisId - Gap Analysis ID
   * @returns {Promise<Object>} - Gap analysis
   */
  async getGapAnalysis(gapAnalysisId) {
    try {
      // Get gap analysis
      const gapAnalysis = await GapAnalysis.findById(gapAnalysisId);

      if (!gapAnalysis) {
        throw new Error('Gap analysis not found');
      }

      return gapAnalysis;
    } catch (error) {
      logger.error('Error getting gap analysis:', error);
      throw error;
    }
  }
}

module.exports = RecommendationEngineService;
