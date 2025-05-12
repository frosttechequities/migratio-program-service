const mongoose = require('mongoose');
const Assessment = require('../models/Assessment');
const Program = require('../models/Program');
const User = require('../models/User');
const Recommendation = require('../models/Recommendation');

/**
 * Recommendation Service
 * Handles the generation of immigration program recommendations based on assessment results
 */
class RecommendationService {
  /**
   * Generate recommendations based on assessment results
   * @param {string} assessmentId - The ID of the completed assessment
   * @param {string} userId - The ID of the user
   * @returns {Promise<Object>} The recommendation results
   */
  async generateRecommendations(assessmentId, userId) {
    try {
      // Validate inputs
      if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
        throw new Error('Invalid assessment ID');
      }
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
      }
      
      // Get assessment data
      const assessment = await Assessment.findById(assessmentId)
        .populate('responses.question')
        .exec();
      
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      
      if (assessment.userId.toString() !== userId) {
        throw new Error('Assessment does not belong to this user');
      }
      
      if (!assessment.isCompleted) {
        throw new Error('Assessment is not completed');
      }
      
      // Get all available immigration programs
      const programs = await Program.find({ isActive: true }).exec();
      
      if (!programs || programs.length === 0) {
        throw new Error('No active immigration programs found');
      }
      
      // Get user profile data
      const user = await User.findById(userId).exec();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Process assessment responses
      const processedResponses = this._processAssessmentResponses(assessment);
      
      // Calculate match scores for each program
      const programMatches = this._calculateProgramMatches(programs, processedResponses, user);
      
      // Sort programs by match score (descending)
      const sortedPrograms = programMatches.sort((a, b) => b.matchScore - a.matchScore);
      
      // Create recommendation record
      const recommendation = new Recommendation({
        userId,
        assessmentId,
        recommendedPrograms: sortedPrograms.map(program => ({
          programId: program.id,
          matchScore: program.matchScore,
          requirements: program.requirements
        })),
        createdAt: new Date()
      });
      
      await recommendation.save();
      
      // Return recommendation results
      return {
        recommendationId: recommendation._id,
        recommendedPrograms: sortedPrograms.map(program => ({
          id: program.id,
          name: program.name,
          description: program.description,
          country: program.country,
          category: program.category,
          processingTime: program.processingTime,
          matchScore: program.matchScore,
          requirements: program.requirements,
          benefits: program.benefits,
          fullDescription: program.fullDescription
        })),
        assessmentId: assessment._id,
        createdAt: recommendation.createdAt
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Process assessment responses into a structured format
   * @param {Object} assessment - The assessment document
   * @returns {Object} Processed assessment responses
   * @private
   */
  _processAssessmentResponses(assessment) {
    const processedResponses = {
      personalInfo: {},
      education: {},
      workExperience: {},
      language: {},
      adaptability: {},
      financialStatus: {},
      preferences: {}
    };
    
    // Process each response based on question category
    assessment.responses.forEach(response => {
      const question = response.question;
      
      if (!question) return;
      
      const category = question.category || 'other';
      const key = question.key || question._id.toString();
      const value = response.answer;
      
      // Skip if no answer provided
      if (value === null || value === undefined) return;
      
      // Add to appropriate category
      switch (category) {
        case 'personal_info':
          processedResponses.personalInfo[key] = value;
          break;
        case 'education':
          processedResponses.education[key] = value;
          break;
        case 'work_experience':
          processedResponses.workExperience[key] = value;
          break;
        case 'language':
          processedResponses.language[key] = value;
          break;
        case 'adaptability':
          processedResponses.adaptability[key] = value;
          break;
        case 'financial':
          processedResponses.financialStatus[key] = value;
          break;
        case 'preferences':
          processedResponses.preferences[key] = value;
          break;
        default:
          // For any other categories
          if (!processedResponses[category]) {
            processedResponses[category] = {};
          }
          processedResponses[category][key] = value;
      }
    });
    
    return processedResponses;
  }
  
  /**
   * Calculate match scores for each program
   * @param {Array} programs - List of immigration programs
   * @param {Object} responses - Processed assessment responses
   * @param {Object} user - User profile data
   * @returns {Array} Programs with match scores
   * @private
   */
  _calculateProgramMatches(programs, responses, user) {
    return programs.map(program => {
      // Clone program object to avoid modifying the original
      const programData = {
        id: program._id,
        name: program.name,
        description: program.description,
        country: program.country,
        category: program.category,
        processingTime: program.processingTime,
        requirements: [],
        benefits: program.benefits,
        fullDescription: program.fullDescription
      };
      
      // Calculate match score based on program criteria
      let totalPoints = 0;
      let maxPoints = 0;
      
      // Process each criterion in the program
      program.criteria.forEach(criterion => {
        const { category, key, weight, minValue, maxValue, options } = criterion;
        
        // Get user's response for this criterion
        let userValue = null;
        
        // Check in responses first
        if (responses[category] && responses[category][key] !== undefined) {
          userValue = responses[category][key];
        } 
        // Check in user profile if not found in responses
        else if (user[category] && user[category][key] !== undefined) {
          userValue = user[category][key];
        }
        
        // Skip if no user value found
        if (userValue === null || userValue === undefined) {
          return;
        }
        
        // Calculate points based on criterion type
        let points = 0;
        let requirementMet = false;
        let requirementDescription = criterion.description || `${key} requirement`;
        
        if (options) {
          // For options-based criteria (e.g., education level)
          const option = options.find(opt => opt.value === userValue);
          if (option) {
            points = option.points * weight;
            requirementMet = option.points > 0;
          }
        } else if (minValue !== undefined && maxValue !== undefined) {
          // For range-based criteria (e.g., age, years of experience)
          if (userValue >= minValue && userValue <= maxValue) {
            // Calculate points proportionally within the range
            const range = maxValue - minValue;
            const position = userValue - minValue;
            const percentage = range > 0 ? position / range : 1;
            points = percentage * weight;
            requirementMet = true;
          }
        } else if (minValue !== undefined) {
          // For minimum value criteria (e.g., minimum language score)
          if (userValue >= minValue) {
            points = weight;
            requirementMet = true;
          }
        } else if (maxValue !== undefined) {
          // For maximum value criteria (e.g., maximum age)
          if (userValue <= maxValue) {
            points = weight;
            requirementMet = true;
          }
        } else {
          // For boolean criteria (e.g., has job offer)
          if (userValue === true || userValue === 'yes' || userValue === 1) {
            points = weight;
            requirementMet = true;
          }
        }
        
        // Add to total points
        totalPoints += points;
        maxPoints += weight;
        
        // Add to requirements list
        programData.requirements.push({
          name: criterion.name || key,
          description: requirementDescription,
          met: requirementMet,
          userValue: userValue
        });
      });
      
      // Calculate final match score (percentage)
      const matchScore = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
      
      // Add match score to program data
      programData.matchScore = matchScore;
      
      return programData;
    });
  }
  
  /**
   * Get recommendation by ID
   * @param {string} recommendationId - The ID of the recommendation
   * @param {string} userId - The ID of the user
   * @returns {Promise<Object>} The recommendation results
   */
  async getRecommendation(recommendationId, userId) {
    try {
      // Validate inputs
      if (!mongoose.Types.ObjectId.isValid(recommendationId)) {
        throw new Error('Invalid recommendation ID');
      }
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
      }
      
      // Get recommendation
      const recommendation = await Recommendation.findById(recommendationId).exec();
      
      if (!recommendation) {
        throw new Error('Recommendation not found');
      }
      
      if (recommendation.userId.toString() !== userId) {
        throw new Error('Recommendation does not belong to this user');
      }
      
      // Get program details for each recommended program
      const programIds = recommendation.recommendedPrograms.map(p => p.programId);
      const programs = await Program.find({ _id: { $in: programIds } }).exec();
      
      // Map program details to recommendation results
      const recommendedPrograms = recommendation.recommendedPrograms.map(recProgram => {
        const program = programs.find(p => p._id.toString() === recProgram.programId.toString());
        
        if (!program) return null;
        
        return {
          id: program._id,
          name: program.name,
          description: program.description,
          country: program.country,
          category: program.category,
          processingTime: program.processingTime,
          matchScore: recProgram.matchScore,
          requirements: recProgram.requirements,
          benefits: program.benefits,
          fullDescription: program.fullDescription
        };
      }).filter(Boolean);
      
      // Return recommendation results
      return {
        recommendationId: recommendation._id,
        recommendedPrograms,
        assessmentId: recommendation.assessmentId,
        createdAt: recommendation.createdAt
      };
    } catch (error) {
      console.error('Error getting recommendation:', error);
      throw error;
    }
  }
  
  /**
   * Get latest recommendation for a user
   * @param {string} userId - The ID of the user
   * @returns {Promise<Object>} The recommendation results
   */
  async getLatestRecommendation(userId) {
    try {
      // Validate input
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
      }
      
      // Get latest recommendation
      const recommendation = await Recommendation.findOne({ userId })
        .sort({ createdAt: -1 })
        .exec();
      
      if (!recommendation) {
        return null;
      }
      
      // Return recommendation
      return this.getRecommendation(recommendation._id, userId);
    } catch (error) {
      console.error('Error getting latest recommendation:', error);
      throw error;
    }
  }
}

module.exports = new RecommendationService();
