/**
 * Assessment Recommendation Integration Service
 * 
 * This service connects the assessment quiz results to the recommendation engine.
 * It processes quiz responses and transforms them into a format that can be used
 * by the recommendation engine to generate personalized immigration recommendations.
 */

const { QuizSession } = require('../models/quiz-session.model');
const { Response } = require('../models/response.model');
const { Profile } = require('../models/profile.model');
const RecommendationEngineService = require('./recommendation-engine.service');
const { logger } = require('../utils/logger');

class AssessmentRecommendationIntegrationService {
  constructor() {
    this.recommendationEngine = new RecommendationEngineService();
  }

  /**
   * Generate recommendations based on assessment quiz results
   * @param {string} userId - User ID
   * @param {string} sessionId - Quiz session ID
   * @returns {Promise<Object>} - Generated recommendations
   */
  async generateRecommendationsFromAssessment(userId, sessionId) {
    try {
      logger.info(`Generating recommendations for user ${userId} from assessment ${sessionId}`);
      const startTime = Date.now();

      // Get quiz session
      const session = await QuizSession.findOne({ sessionId });
      if (!session) {
        throw new Error('Quiz session not found');
      }

      // Check if session is completed
      if (session.status !== 'completed') {
        throw new Error('Quiz session is not completed');
      }

      // Get all responses for this session
      const responses = await Response.getSessionResponses(sessionId);
      if (!responses || responses.length === 0) {
        throw new Error('No responses found for this session');
      }

      // Get user profile
      const userProfile = await Profile.findOne({ userId });
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Extract user preferences from responses
      const userPreferences = this._extractUserPreferences(responses);

      // Generate recommendations using the recommendation engine
      const recommendations = await this.recommendationEngine.generateRecommendations(
        userId,
        sessionId,
        {
          preferences: userPreferences,
          maxResults: 10,
          includeGapAnalysis: true,
          includeAlternativePrograms: true
        }
      );

      // Calculate processing time
      const processingTime = Date.now() - startTime;
      logger.info(`Recommendations generated in ${processingTime}ms`);

      return {
        recommendations,
        processingTime
      };
    } catch (error) {
      logger.error('Error generating recommendations from assessment:', error);
      throw error;
    }
  }

  /**
   * Extract user preferences from quiz responses
   * @param {Array} responses - Quiz responses
   * @returns {Object} - User preferences
   * @private
   */
  _extractUserPreferences(responses) {
    try {
      const preferences = {
        countries: [],
        pathwayTypes: [],
        timeframe: null,
        budgetRange: null,
        priorityFactors: [],
        sortBy: 'matchScore',
        filters: {}
      };

      // Process responses to extract preferences
      responses.forEach(response => {
        const questionId = response.questionId;
        const value = response.responseValue;

        // Skip if no value
        if (value === null || value === undefined) {
          return;
        }

        // Extract destination countries
        if (questionId === 'personal_014' || questionId === 'preferences_destination_countries') {
          if (Array.isArray(value)) {
            preferences.countries = value;
          } else if (typeof value === 'string') {
            preferences.countries = [value];
          }
        }

        // Extract pathway types
        if (questionId === 'immigration_015' || questionId === 'preferences_pathway_types') {
          if (Array.isArray(value)) {
            preferences.pathwayTypes = value;
          } else if (typeof value === 'string') {
            preferences.pathwayTypes = [value];
          }
        }

        // Extract timeframe
        if (questionId === 'immigration_009' || questionId === 'preferences_timeframe') {
          preferences.timeframe = value;
        }

        // Extract budget range
        if (questionId === 'preferences_budget_range' || questionId === 'financial_budget') {
          preferences.budgetRange = value;
        }

        // Extract priority factors
        if (questionId === 'preferences_001' || questionId === 'preferences_priority_factors') {
          if (Array.isArray(value)) {
            preferences.priorityFactors = value;
          } else if (typeof value === 'string') {
            preferences.priorityFactors = [value];
          }
        }
      });

      // Set sorting preference based on priority factors
      if (preferences.priorityFactors.includes('processing_time')) {
        preferences.sortBy = 'processingTime';
      } else if (preferences.priorityFactors.includes('cost')) {
        preferences.sortBy = 'cost';
      } else if (preferences.priorityFactors.includes('success_rate')) {
        preferences.sortBy = 'successProbability';
      }

      // Set filters based on preferences
      if (preferences.countries.length > 0) {
        preferences.filters.countries = preferences.countries;
      }

      if (preferences.pathwayTypes.length > 0) {
        preferences.filters.categories = preferences.pathwayTypes;
      }

      // Set minimum match score filter
      preferences.filters.minMatchScore = 50; // Default minimum match score

      // Set maximum processing time filter based on timeframe
      if (preferences.timeframe) {
        switch (preferences.timeframe) {
          case 'immediate':
            preferences.filters.maxProcessingTime = 3; // 3 months
            break;
          case 'within-6-months':
            preferences.filters.maxProcessingTime = 6; // 6 months
            break;
          case 'within-1-year':
            preferences.filters.maxProcessingTime = 12; // 12 months
            break;
          case 'within-2-years':
            preferences.filters.maxProcessingTime = 24; // 24 months
            break;
          // No filter for 'flexible' timeframe
        }
      }

      // Set maximum cost filter based on budget range
      if (preferences.budgetRange && preferences.budgetRange.max) {
        preferences.filters.maxCost = preferences.budgetRange.max;
      }

      return preferences;
    } catch (error) {
      logger.error('Error extracting user preferences:', error);
      return {};
    }
  }

  /**
   * Update user profile with assessment results
   * @param {string} userId - User ID
   * @param {string} sessionId - Quiz session ID
   * @returns {Promise<Object>} - Updated profile
   */
  async updateProfileWithAssessmentResults(userId, sessionId) {
    try {
      // Get quiz session
      const session = await QuizSession.findOne({ sessionId });
      if (!session) {
        throw new Error('Quiz session not found');
      }

      // Get all responses for this session
      const responses = await Response.getSessionResponses(sessionId);
      if (!responses || responses.length === 0) {
        throw new Error('No responses found for this session');
      }

      // Get user profile
      let profile = await Profile.findOne({ userId });
      if (!profile) {
        // Create new profile if not exists
        profile = new Profile({ userId });
      }

      // Group responses by section
      const sectionResponses = {};
      responses.forEach(response => {
        if (!sectionResponses[response.section]) {
          sectionResponses[response.section] = [];
        }
        sectionResponses[response.section].push(response);
      });

      // Update profile sections
      if (sectionResponses.personal) {
        this._updatePersonalInfo(profile, sectionResponses.personal);
      }

      if (sectionResponses.education) {
        this._updateEducation(profile, sectionResponses.education);
      }

      if (sectionResponses.work) {
        this._updateWorkExperience(profile, sectionResponses.work);
      }

      if (sectionResponses.language) {
        this._updateLanguageProficiency(profile, sectionResponses.language);
      }

      if (sectionResponses.financial) {
        this._updateFinancialInfo(profile, sectionResponses.financial);
      }

      if (sectionResponses.immigration || sectionResponses.preferences) {
        this._updateImmigrationPreferences(profile, [
          ...(sectionResponses.immigration || []),
          ...(sectionResponses.preferences || [])
        ]);
      }

      // Calculate profile completion
      profile.calculateCompletion();

      // Save profile
      await profile.save();

      return profile;
    } catch (error) {
      logger.error('Error updating profile with assessment results:', error);
      throw error;
    }
  }

  /**
   * Update personal info section
   * @param {Object} profile - User profile
   * @param {Array} responses - Section responses
   * @private
   */
  _updatePersonalInfo(profile, responses) {
    // Initialize personal info if not exists
    if (!profile.personalInfo) {
      profile.personalInfo = {};
    }

    // Map responses to profile fields
    responses.forEach(response => {
      const questionId = response.questionId;
      const value = response.responseValue;

      switch (questionId) {
        case 'personal_003': // Date of birth
          profile.personalInfo.dateOfBirth = value ? new Date(value) : undefined;
          break;
        case 'personal_004': // Marital status
          profile.personalInfo.maritalStatus = value;
          break;
        case 'personal_001': // Country of residence
          if (!profile.personalInfo.currentResidence) {
            profile.personalInfo.currentResidence = {};
          }
          profile.personalInfo.currentResidence.country = value;
          break;
        case 'personal_002': // Citizenship
          profile.personalInfo.nationality = Array.isArray(value) 
            ? value.map(country => ({ country, isPrimary: true }))
            : [{ country: value, isPrimary: true }];
          break;
        case 'personal_005': // Has children
          profile.personalInfo.hasChildren = value === 'yes';
          break;
        case 'personal_006': // Number of children
          if (profile.personalInfo.hasChildren) {
            profile.personalInfo.numberOfChildren = Number(value);
          }
          break;
      }
    });
  }

  /**
   * Update education section
   * @param {Object} profile - User profile
   * @param {Array} responses - Section responses
   * @private
   */
  _updateEducation(profile, responses) {
    // Initialize education array if not exists
    if (!profile.education) {
      profile.education = [];
    }

    // Create a new education entry
    const education = {
      level: null,
      field: null,
      institution: null,
      country: null,
      completed: true
    };

    // Map responses to education fields
    responses.forEach(response => {
      const questionId = response.questionId;
      const value = response.responseValue;

      switch (questionId) {
        case 'education_001': // Highest education
          education.level = value;
          break;
        case 'education_002': // Field of study
          education.field = value;
          break;
        case 'education_003': // Education country
          education.country = value;
          break;
      }
    });

    // Add education entry if it has at least a level
    if (education.level) {
      profile.education.push(education);
    }
  }

  /**
   * Update work experience section
   * @param {Object} profile - User profile
   * @param {Array} responses - Section responses
   * @private
   */
  _updateWorkExperience(profile, responses) {
    // Initialize work experience array if not exists
    if (!profile.workExperience) {
      profile.workExperience = [];
    }

    // Create a new work experience entry
    const workExperience = {
      jobTitle: null,
      employer: null,
      industry: null,
      country: null,
      isCurrentJob: true
    };

    // Map responses to work experience fields
    responses.forEach(response => {
      const questionId = response.questionId;
      const value = response.responseValue;

      switch (questionId) {
        case 'work_002': // Current occupation
          workExperience.jobTitle = value;
          break;
        case 'work_003': // Occupational category
          workExperience.industry = value;
          break;
      }
    });

    // Add work experience entry if it has at least a job title
    if (workExperience.jobTitle) {
      profile.workExperience.push(workExperience);
    }
  }

  /**
   * Update language proficiency section
   * @param {Object} profile - User profile
   * @param {Array} responses - Section responses
   * @private
   */
  _updateLanguageProficiency(profile, responses) {
    // Initialize language proficiency array if not exists
    if (!profile.languageProficiency) {
      profile.languageProficiency = [];
    }

    // Create language proficiency entries for English and French
    const english = {
      language: 'english',
      reading: null,
      writing: null,
      speaking: null,
      listening: null,
      overallScore: null,
      testType: null,
      testDate: null
    };

    const french = {
      language: 'french',
      reading: null,
      writing: null,
      speaking: null,
      listening: null,
      overallScore: null,
      testType: null,
      testDate: null
    };

    // Map responses to language proficiency fields
    responses.forEach(response => {
      const questionId = response.questionId;
      const value = response.responseValue;

      // English proficiency
      if (questionId === 'language_002') { // English self-assessment
        english.overallScore = this._convertSelfAssessmentToScore(value);
      } else if (questionId === 'language_004') { // English test type
        english.testType = value;
      } else if (questionId === 'language_005' || questionId === 'language_007') { // English test score
        english.overallScore = this._convertTestScoreToNumeric(value);
      }

      // French proficiency
      if (questionId === 'language_011') { // French self-assessment
        french.overallScore = this._convertSelfAssessmentToScore(value);
      } else if (questionId === 'language_013') { // French test type
        french.testType = value;
      } else if (questionId === 'language_014' || questionId === 'language_016') { // French test score
        french.overallScore = this._convertTestScoreToNumeric(value);
      }
    });

    // Add language proficiency entries if they have at least an overall score
    if (english.overallScore !== null) {
      profile.languageProficiency.push(english);
    }

    if (french.overallScore !== null) {
      profile.languageProficiency.push(french);
    }
  }

  /**
   * Convert self-assessment to numeric score
   * @param {string} selfAssessment - Self-assessment value
   * @returns {number|null} - Numeric score
   * @private
   */
  _convertSelfAssessmentToScore(selfAssessment) {
    const mapping = {
      'native': 10,
      'fluent': 9,
      'advanced': 8,
      'intermediate': 6,
      'basic': 4,
      'beginner': 2,
      'none': 0
    };

    return mapping[selfAssessment] !== undefined ? mapping[selfAssessment] : null;
  }

  /**
   * Convert test score to numeric value
   * @param {string} testScore - Test score value
   * @returns {number|null} - Numeric score
   * @private
   */
  _convertTestScoreToNumeric(testScore) {
    // If already a number, return it
    if (!isNaN(Number(testScore))) {
      return Number(testScore);
    }

    // If a string representing a range (e.g., "7-8"), take the average
    if (typeof testScore === 'string' && testScore.includes('-')) {
      const [min, max] = testScore.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        return (min + max) / 2;
      }
    }

    return null;
  }

  /**
   * Update financial info section
   * @param {Object} profile - User profile
   * @param {Array} responses - Section responses
   * @private
   */
  _updateFinancialInfo(profile, responses) {
    // Initialize financial info if not exists
    if (!profile.financialInfo) {
      profile.financialInfo = {};
    }

    // Map responses to financial info fields
    responses.forEach(response => {
      const questionId = response.questionId;
      const value = response.responseValue;

      switch (questionId) {
        case 'financial_001': // Net worth
          profile.financialInfo.netWorth = this._extractNumericValue(value);
          break;
        case 'financial_002': // Liquid assets
          profile.financialInfo.liquidAssets = this._extractNumericValue(value);
          break;
        case 'financial_003': // Annual income
          profile.financialInfo.annualIncome = this._extractNumericValue(value);
          break;
        case 'financial_004': // Owns real estate
          profile.financialInfo.ownsRealEstate = value === 'yes';
          break;
      }
    });
  }

  /**
   * Extract numeric value from string
   * @param {string} value - String value
   * @returns {number|null} - Numeric value
   * @private
   */
  _extractNumericValue(value) {
    if (!value) return null;

    // If already a number, return it
    if (!isNaN(Number(value))) {
      return Number(value);
    }

    // If a string representing a range (e.g., "$50,000-$100,000"), take the average
    if (typeof value === 'string') {
      // Remove currency symbols and commas
      const cleanValue = value.replace(/[$,]/g, '');

      // Check if it's a range
      if (cleanValue.includes('-')) {
        const [min, max] = cleanValue.split('-').map(v => parseFloat(v));
        if (!isNaN(min) && !isNaN(max)) {
          return (min + max) / 2;
        }
      }

      // Try to parse as a number
      const numValue = parseFloat(cleanValue);
      if (!isNaN(numValue)) {
        return numValue;
      }
    }

    return null;
  }

  /**
   * Update immigration preferences section
   * @param {Object} profile - User profile
   * @param {Array} responses - Section responses
   * @private
   */
  _updateImmigrationPreferences(profile, responses) {
    // Initialize immigration preferences if not exists
    if (!profile.immigrationPreferences) {
      profile.immigrationPreferences = {};
    }

    // Map responses to immigration preferences fields
    responses.forEach(response => {
      const questionId = response.questionId;
      const value = response.responseValue;

      switch (questionId) {
        case 'personal_014':
        case 'preferences_destination_countries': // Destination countries
          if (Array.isArray(value)) {
            profile.immigrationPreferences.destinationCountries = value.map(country => ({
              country,
              priority: 1
            }));
          } else if (typeof value === 'string') {
            profile.immigrationPreferences.destinationCountries = [{
              country: value,
              priority: 1
            }];
          }
          break;

        case 'immigration_015':
        case 'preferences_pathway_types': // Pathway types
          if (Array.isArray(value)) {
            profile.immigrationPreferences.pathwayTypes = value.map(type => ({
              type,
              priority: 1
            }));
          } else if (typeof value === 'string') {
            profile.immigrationPreferences.pathwayTypes = [{
              type: value,
              priority: 1
            }];
          }
          break;

        case 'immigration_009':
        case 'preferences_timeframe': // Timeframe
          profile.immigrationPreferences.timeframe = value;
          break;

        case 'preferences_budget_range': // Budget range
          if (typeof value === 'object' && value !== null) {
            profile.immigrationPreferences.budgetRange = value;
          } else if (typeof value === 'string') {
            // Parse budget range from string (e.g., "$10,000-$20,000")
            const matches = value.match(/(\d+[,\d]*)-(\d+[,\d]*)/);
            if (matches) {
              const min = parseInt(matches[1].replace(/,/g, ''));
              const max = parseInt(matches[2].replace(/,/g, ''));
              profile.immigrationPreferences.budgetRange = {
                min,
                max,
                currency: 'USD'
              };
            }
          }
          break;

        case 'preferences_001':
        case 'preferences_priority_factors': // Priority factors
          profile.immigrationPreferences.priorityFactors = Array.isArray(value) ? value : [value];
          break;
      }
    });
  }
}

module.exports = AssessmentRecommendationIntegrationService;
