const RecommendationEngineService = require('../services/recommendation-engine.service');
const { logger } = require('../utils/logger');

const recommendationEngine = new RecommendationEngineService();

/**
 * Generate recommendations
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.generateRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sessionId } = req.body;
    const options = req.body.options || {};

    // Validate required fields
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Generate recommendations
    const recommendations = await recommendationEngine.generateRecommendations(
      userId,
      sessionId,
      options
    );

    return res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    logger.error('Error generating recommendations:', error);

    return res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    });
  }
};

/**
 * Get recommendations
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const options = {
      sessionId: req.query.sessionId,
      status: req.query.status,
      includeArchived: req.query.includeArchived === 'true',
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection || 'desc',
      filters: req.query.filters ? JSON.parse(req.query.filters) : undefined
    };

    // Get recommendations
    const recommendations = await recommendationEngine.getRecommendations(
      userId,
      options
    );

    return res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    logger.error('Error getting recommendations:', error);

    return res.status(500).json({
      success: false,
      message: 'Error getting recommendations',
      error: error.message
    });
  }
};

/**
 * Get recommendation details
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getRecommendationDetails = async (req, res) => {
  try {
    const { recommendationId } = req.params;

    // Validate required fields
    if (!recommendationId) {
      return res.status(400).json({
        success: false,
        message: 'Recommendation ID is required'
      });
    }

    // Get recommendation details
    const recommendation = await recommendationEngine.getRecommendationDetails(
      recommendationId
    );

    // Check if recommendation belongs to user
    if (recommendation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to recommendation'
      });
    }

    return res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    logger.error('Error getting recommendation details:', error);

    return res.status(500).json({
      success: false,
      message: 'Error getting recommendation details',
      error: error.message
    });
  }
};

/**
 * Archive recommendation
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.archiveRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const userId = req.user._id;

    // Validate required fields
    if (!recommendationId) {
      return res.status(400).json({
        success: false,
        message: 'Recommendation ID is required'
      });
    }

    // Archive recommendation
    const recommendation = await recommendationEngine.archiveRecommendation(
      recommendationId,
      userId
    );

    return res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    logger.error('Error archiving recommendation:', error);

    return res.status(500).json({
      success: false,
      message: 'Error archiving recommendation',
      error: error.message
    });
  }
};

/**
 * Add feedback to recommendation
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.addFeedback = async (req, res) => {
  try {
    const { recommendationId, programId } = req.params;
    const { relevanceRating, comments } = req.body;

    // Validate required fields
    if (!recommendationId || !programId) {
      return res.status(400).json({
        success: false,
        message: 'Recommendation ID and Program ID are required'
      });
    }

    if (!relevanceRating) {
      return res.status(400).json({
        success: false,
        message: 'Relevance rating is required'
      });
    }

    // Add feedback
    const recommendation = await recommendationEngine.addFeedback(
      recommendationId,
      programId,
      { relevanceRating, comments }
    );

    return res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    logger.error('Error adding feedback:', error);

    return res.status(500).json({
      success: false,
      message: 'Error adding feedback',
      error: error.message
    });
  }
};

/**
 * Get match details
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getMatchDetails = async (req, res) => {
  try {
    const { matchId } = req.params;

    // Validate required fields
    if (!matchId) {
      return res.status(400).json({
        success: false,
        message: 'Match ID is required'
      });
    }

    // Get match details
    const match = await recommendationEngine.getMatchDetails(matchId);

    // Check if match belongs to user
    if (match.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to match details'
      });
    }

    return res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    logger.error('Error getting match details:', error);

    return res.status(500).json({
      success: false,
      message: 'Error getting match details',
      error: error.message
    });
  }
};

/**
 * Get gap analysis
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getGapAnalysis = async (req, res) => {
  try {
    const { gapAnalysisId } = req.params;

    // Validate required fields
    if (!gapAnalysisId) {
      return res.status(400).json({
        success: false,
        message: 'Gap Analysis ID is required'
      });
    }

    // Get gap analysis
    const gapAnalysis = await recommendationEngine.getGapAnalysis(gapAnalysisId);

    // Check if gap analysis belongs to user
    if (gapAnalysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to gap analysis'
      });
    }

    return res.status(200).json({
      success: true,
      data: gapAnalysis
    });
  } catch (error) {
    logger.error('Error getting gap analysis:', error);

    return res.status(500).json({
      success: false,
      message: 'Error getting gap analysis',
      error: error.message
    });
  }
};
