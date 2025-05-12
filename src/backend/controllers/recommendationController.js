const recommendationService = require('../services/recommendationService');
const assessmentService = require('../services/assessmentService');

/**
 * Recommendation Controller
 * Handles API requests related to recommendations
 */
class RecommendationController {
  /**
   * Generate recommendations based on assessment results
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async generateRecommendations(req, res) {
    try {
      const { assessmentId } = req.body;
      const userId = req.user.id;
      
      if (!assessmentId) {
        return res.status(400).json({ message: 'Assessment ID is required' });
      }
      
      const recommendations = await recommendationService.generateRecommendations(assessmentId, userId);
      
      return res.status(200).json(recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return res.status(500).json({ message: error.message || 'Failed to generate recommendations' });
    }
  }
  
  /**
   * Get recommendation by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getRecommendation(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const recommendation = await recommendationService.getRecommendation(id, userId);
      
      return res.status(200).json(recommendation);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      return res.status(500).json({ message: error.message || 'Failed to get recommendation' });
    }
  }
  
  /**
   * Get latest recommendation for the current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getLatestRecommendation(req, res) {
    try {
      const userId = req.user.id;
      
      const recommendation = await recommendationService.getLatestRecommendation(userId);
      
      if (!recommendation) {
        return res.status(404).json({ message: 'No recommendations found for this user' });
      }
      
      return res.status(200).json(recommendation);
    } catch (error) {
      console.error('Error getting latest recommendation:', error);
      return res.status(500).json({ message: error.message || 'Failed to get latest recommendation' });
    }
  }
  
  /**
   * Get recommendations based on latest assessment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  async getRecommendationsFromLatestAssessment(req, res) {
    try {
      const userId = req.user.id;
      
      // Get latest completed assessment
      const assessment = await assessmentService.getLatestCompletedAssessment(userId);
      
      if (!assessment) {
        return res.status(404).json({ message: 'No completed assessments found for this user' });
      }
      
      // Check if recommendation already exists for this assessment
      let recommendation = await recommendationService.getLatestRecommendation(userId);
      
      // If no recommendation exists or it's for a different assessment, generate a new one
      if (!recommendation || recommendation.assessmentId.toString() !== assessment._id.toString()) {
        recommendation = await recommendationService.generateRecommendations(assessment._id, userId);
      }
      
      return res.status(200).json(recommendation);
    } catch (error) {
      console.error('Error getting recommendations from latest assessment:', error);
      return res.status(500).json({ message: error.message || 'Failed to get recommendations' });
    }
  }
}

module.exports = new RecommendationController();
