const { Question } = require('../models/question.model');
const { QuizSession } = require('../models/quiz-session.model');
const { Response } = require('../models/response.model');
const { Profile } = require('../models/profile.model');
const { logger } = require('../utils/logger');

/**
 * Quiz Engine Service
 * Handles quiz session management, question sequencing, and response processing
 */
class QuizEngineService {
  /**
   * Create a new quiz session
   * @param {string} userId - User ID
   * @param {Object} options - Session options
   * @returns {Promise<Object>} - New quiz session
   */
  async createSession(userId, options = {}) {
    try {
      // Check if user already has an active session
      const existingSession = await QuizSession.findActiveForUser(userId);
      
      if (existingSession) {
        return existingSession;
      }
      
      // Generate session ID
      const sessionId = QuizSession.generateSessionId();
      
      // Create new session
      const session = new QuizSession({
        userId,
        sessionId,
        isAnonymous: options.isAnonymous || false,
        currentSection: options.startSection || 'personal',
        language: options.language || 'en',
        deviceInfo: options.deviceInfo || {},
        referrer: options.referrer || '',
        quizVersion: options.quizVersion || '1.0'
      });
      
      // Save session
      await session.save();
      
      // Get initial question
      const initialQuestion = await this.getInitialQuestion(session);
      
      // Update session with initial question
      session.currentQuestionId = initialQuestion ? initialQuestion.questionId : null;
      await session.save();
      
      return {
        session,
        initialQuestion
      };
    } catch (error) {
      logger.error('Error creating quiz session:', error);
      throw error;
    }
  }
  
  /**
   * Resume an existing quiz session
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Resumed quiz session
   */
  async resumeSession(userId) {
    try {
      // Find active session
      const session = await QuizSession.findActiveForUser(userId);
      
      if (!session) {
        return null;
      }
      
      // Get current question
      const currentQuestion = await Question.findOne({ questionId: session.currentQuestionId });
      
      // Get all responses for this session
      const responses = await Response.getSessionResponses(session.sessionId);
      
      // Format responses as key-value pairs
      const formattedResponses = {};
      responses.forEach(response => {
        formattedResponses[response.questionId] = response.responseValue;
      });
      
      return {
        session,
        currentQuestion,
        responses: formattedResponses
      };
    } catch (error) {
      logger.error('Error resuming quiz session:', error);
      throw error;
    }
  }
  
  /**
   * Get initial question for a session
   * @param {Object} session - Quiz session
   * @returns {Promise<Object>} - Initial question
   */
  async getInitialQuestion(session) {
    try {
      const initialQuestions = await Question.getInitialQuestions(session.currentSection);
      return initialQuestions.length > 0 ? initialQuestions[0] : null;
    } catch (error) {
      logger.error('Error getting initial question:', error);
      throw error;
    }
  }
  
  /**
   * Process an answer and get the next question
   * @param {string} sessionId - Session ID
   * @param {string} questionId - Question ID
   * @param {*} answer - User's answer
   * @returns {Promise<Object>} - Next question and updated session
   */
  async processAnswer(sessionId, questionId, answer) {
    try {
      // Find session
      const session = await QuizSession.findOne({ sessionId });
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      // Find question
      const question = await Question.findOne({ questionId });
      
      if (!question) {
        throw new Error('Question not found');
      }
      
      // Create or update response
      await this.saveResponse(session, question, answer);
      
      // Update session
      session.responseCount += 1;
      session.updateActivity();
      
      // Get all responses for this session
      const responses = await Response.getSessionResponses(session.sessionId);
      
      // Format responses as key-value pairs
      const formattedResponses = {};
      responses.forEach(response => {
        formattedResponses[response.questionId] = response.responseValue;
      });
      
      // Get next question
      const nextQuestion = await Question.getNextQuestion(session.currentSection, formattedResponses);
      
      // If no more questions in current section, move to next section
      if (!nextQuestion) {
        // Mark current section as completed
        session.completeSection(session.currentSection);
        
        // Determine next section
        const nextSection = this.getNextSection(session.currentSection, session.completedSections);
        
        // If no more sections, complete quiz
        if (!nextSection) {
          session.complete();
          await session.save();
          
          // Update user profile with quiz responses
          await this.updateUserProfile(session.userId, responses);
          
          return {
            session,
            nextQuestion: null,
            isComplete: true
          };
        }
        
        // Update session with new section
        session.currentSection = nextSection;
        
        // Get initial question for new section
        const initialQuestion = await this.getInitialQuestion(session);
        
        // Update session with initial question
        session.currentQuestionId = initialQuestion ? initialQuestion.questionId : null;
        await session.save();
        
        return {
          session,
          nextQuestion: initialQuestion,
          isComplete: false
        };
      }
      
      // Update session with next question
      session.currentQuestionId = nextQuestion.questionId;
      
      // Calculate progress
      const totalQuestions = await this.getTotalQuestionCount();
      session.updateProgress(totalQuestions);
      
      await session.save();
      
      return {
        session,
        nextQuestion,
        isComplete: false
      };
    } catch (error) {
      logger.error('Error processing answer:', error);
      throw error;
    }
  }
  
  /**
   * Save a response
   * @param {Object} session - Quiz session
   * @param {Object} question - Question
   * @param {*} answer - User's answer
   * @returns {Promise<Object>} - Saved response
   */
  async saveResponse(session, question, answer) {
    try {
      // Check if response already exists
      let response = await Response.findOne({
        sessionId: session.sessionId,
        questionId: question.questionId
      });
      
      // Format response based on question type
      const formattedResponse = this.formatResponse(question, answer);
      
      if (response) {
        // If response exists, update it
        response.responseValue = formattedResponse.responseValue;
        response.selectedOptions = formattedResponse.selectedOptions;
        response.textResponse = formattedResponse.textResponse;
        response.numericResponse = formattedResponse.numericResponse;
        response.dateResponse = formattedResponse.dateResponse;
        response.fileResponses = formattedResponse.fileResponses;
        response.isEdited = true;
        response.editHistory.push({
          previousValue: response.responseValue,
          editedAt: new Date()
        });
        
        await response.save();
      } else {
        // If response doesn't exist, create it
        response = new Response({
          userId: session.userId,
          sessionId: session.sessionId,
          questionId: question.questionId,
          questionText: question.text,
          questionType: question.type,
          section: question.section,
          ...formattedResponse
        });
        
        await response.save();
      }
      
      return response;
    } catch (error) {
      logger.error('Error saving response:', error);
      throw error;
    }
  }
  
  /**
   * Format response based on question type
   * @param {Object} question - Question
   * @param {*} answer - User's answer
   * @returns {Object} - Formatted response
   */
  formatResponse(question, answer) {
    const response = {
      responseValue: answer,
      selectedOptions: [],
      textResponse: null,
      numericResponse: null,
      dateResponse: null,
      fileResponses: []
    };
    
    switch (question.type) {
      case 'single_choice':
        // Find selected option
        const selectedOption = question.options.find(option => option.value === answer);
        if (selectedOption) {
          response.selectedOptions = [{ value: selectedOption.value, label: selectedOption.label }];
        }
        break;
        
      case 'multiple_choice':
        // Find selected options
        if (Array.isArray(answer)) {
          response.selectedOptions = answer.map(value => {
            const option = question.options.find(opt => opt.value === value);
            return option ? { value: option.value, label: option.label } : { value, label: value };
          });
        }
        break;
        
      case 'text':
        response.textResponse = String(answer);
        break;
        
      case 'number':
      case 'slider':
        response.numericResponse = Number(answer);
        break;
        
      case 'date':
        response.dateResponse = new Date(answer);
        break;
        
      case 'file_upload':
        if (Array.isArray(answer)) {
          response.fileResponses = answer;
        }
        break;
    }
    
    return response;
  }
  
  /**
   * Get next section
   * @param {string} currentSection - Current section
   * @param {string[]} completedSections - Completed sections
   * @returns {string|null} - Next section or null if all sections completed
   */
  getNextSection(currentSection, completedSections) {
    const sections = [
      'personal',
      'education',
      'work',
      'language',
      'financial',
      'immigration',
      'preferences'
    ];
    
    const currentIndex = sections.indexOf(currentSection);
    
    // Find next section that hasn't been completed
    for (let i = currentIndex + 1; i < sections.length; i++) {
      if (!completedSections.includes(sections[i])) {
        return sections[i];
      }
    }
    
    return null;
  }
  
  /**
   * Get total question count
   * @returns {Promise<number>} - Total number of questions
   */
  async getTotalQuestionCount() {
    try {
      return await Question.countDocuments({ isActive: true });
    } catch (error) {
      logger.error('Error getting total question count:', error);
      throw error;
    }
  }
  
  /**
   * Update user profile with quiz responses
   * @param {string} userId - User ID
   * @param {Object[]} responses - Quiz responses
   * @returns {Promise<Object>} - Updated profile
   */
  async updateUserProfile(userId, responses) {
    try {
      // Find user profile
      const profile = await Profile.findOne({ userId });
      
      if (!profile) {
        throw new Error('Profile not found');
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
        this.updatePersonalInfo(profile, sectionResponses.personal);
      }
      
      if (sectionResponses.education) {
        this.updateEducation(profile, sectionResponses.education);
      }
      
      if (sectionResponses.work) {
        this.updateWorkExperience(profile, sectionResponses.work);
      }
      
      if (sectionResponses.language) {
        this.updateLanguageProficiency(profile, sectionResponses.language);
      }
      
      if (sectionResponses.financial) {
        this.updateFinancialInfo(profile, sectionResponses.financial);
      }
      
      if (sectionResponses.immigration || sectionResponses.preferences) {
        this.updateImmigrationPreferences(profile, [
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
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }
  
  /**
   * Update personal info section
   * @param {Object} profile - User profile
   * @param {Object[]} responses - Section responses
   */
  updatePersonalInfo(profile, responses) {
    // Map responses to profile fields
    responses.forEach(response => {
      switch (response.questionId) {
        case 'personal_dob':
          profile.personalInfo.dateOfBirth = response.dateResponse;
          break;
        case 'personal_gender':
          profile.personalInfo.gender = response.responseValue;
          break;
        case 'personal_marital_status':
          profile.personalInfo.maritalStatus = response.responseValue;
          break;
        case 'personal_nationality':
          profile.personalInfo.nationality = [
            { country: response.responseValue, isPrimary: true }
          ];
          break;
        case 'personal_dual_nationality':
          if (response.responseValue && response.responseValue !== profile.personalInfo.nationality[0].country) {
            profile.personalInfo.nationality.push({
              country: response.responseValue,
              isPrimary: false
            });
          }
          break;
        case 'personal_residence_country':
          if (!profile.personalInfo.currentResidence) {
            profile.personalInfo.currentResidence = {};
          }
          profile.personalInfo.currentResidence.country = response.responseValue;
          break;
        case 'personal_residence_region':
          if (!profile.personalInfo.currentResidence) {
            profile.personalInfo.currentResidence = {};
          }
          profile.personalInfo.currentResidence.region = response.responseValue;
          break;
        case 'personal_residence_city':
          if (!profile.personalInfo.currentResidence) {
            profile.personalInfo.currentResidence = {};
          }
          profile.personalInfo.currentResidence.city = response.responseValue;
          break;
        case 'personal_residence_since':
          if (!profile.personalInfo.currentResidence) {
            profile.personalInfo.currentResidence = {};
          }
          profile.personalInfo.currentResidence.since = response.dateResponse;
          break;
        case 'personal_phone':
          profile.personalInfo.phone = response.responseValue;
          break;
      }
    });
  }
  
  /**
   * Update education section
   * @param {Object} profile - User profile
   * @param {Object[]} responses - Section responses
   */
  updateEducation(profile, responses) {
    // Group responses by education entry
    const educationEntries = {};
    
    responses.forEach(response => {
      const match = response.questionId.match(/^education_(\d+)_(.+)$/);
      if (match) {
        const [, index, field] = match;
        if (!educationEntries[index]) {
          educationEntries[index] = {};
        }
        educationEntries[index][field] = response.responseValue;
      }
    });
    
    // Convert to array and update profile
    profile.education = Object.values(educationEntries).map(entry => ({
      level: entry.level,
      field: entry.field,
      institution: entry.institution,
      country: entry.country,
      startDate: entry.start_date ? new Date(entry.start_date) : undefined,
      endDate: entry.end_date ? new Date(entry.end_date) : undefined,
      completed: entry.completed === 'yes'
    }));
  }
  
  /**
   * Update work experience section
   * @param {Object} profile - User profile
   * @param {Object[]} responses - Section responses
   */
  updateWorkExperience(profile, responses) {
    // Group responses by work experience entry
    const workEntries = {};
    
    responses.forEach(response => {
      const match = response.questionId.match(/^work_(\d+)_(.+)$/);
      if (match) {
        const [, index, field] = match;
        if (!workEntries[index]) {
          workEntries[index] = {};
        }
        workEntries[index][field] = response.responseValue;
      }
    });
    
    // Convert to array and update profile
    profile.workExperience = Object.values(workEntries).map(entry => ({
      jobTitle: entry.job_title,
      employer: entry.employer,
      country: entry.country,
      industry: entry.industry,
      startDate: entry.start_date ? new Date(entry.start_date) : undefined,
      endDate: entry.end_date ? new Date(entry.end_date) : undefined,
      isCurrentJob: entry.is_current === 'yes',
      description: entry.description,
      skills: entry.skills ? entry.skills.split(',').map(s => s.trim()) : []
    }));
  }
  
  /**
   * Update language proficiency section
   * @param {Object} profile - User profile
   * @param {Object[]} responses - Section responses
   */
  updateLanguageProficiency(profile, responses) {
    // Group responses by language
    const languageEntries = {};
    
    responses.forEach(response => {
      const match = response.questionId.match(/^language_(\w+)_(.+)$/);
      if (match) {
        const [, language, field] = match;
        if (!languageEntries[language]) {
          languageEntries[language] = { language };
        }
        languageEntries[language][field] = response.responseValue;
      }
    });
    
    // Convert to array and update profile
    profile.languageProficiency = Object.values(languageEntries).map(entry => ({
      language: entry.language,
      reading: entry.reading ? Number(entry.reading) : undefined,
      writing: entry.writing ? Number(entry.writing) : undefined,
      speaking: entry.speaking ? Number(entry.speaking) : undefined,
      listening: entry.listening ? Number(entry.listening) : undefined,
      overallScore: entry.overall ? Number(entry.overall) : undefined,
      testType: entry.test_type,
      testDate: entry.test_date ? new Date(entry.test_date) : undefined
    }));
  }
  
  /**
   * Update financial info section
   * @param {Object} profile - User profile
   * @param {Object[]} responses - Section responses
   */
  updateFinancialInfo(profile, responses) {
    // Initialize financial info if not exists
    if (!profile.financialInfo) {
      profile.financialInfo = {};
    }
    
    // Map responses to profile fields
    responses.forEach(response => {
      switch (response.questionId) {
        case 'financial_currency':
          profile.financialInfo.currency = response.responseValue;
          break;
        case 'financial_liquid_assets':
          profile.financialInfo.liquidAssets = Number(response.responseValue);
          break;
        case 'financial_net_worth':
          profile.financialInfo.netWorth = Number(response.responseValue);
          break;
        case 'financial_annual_income':
          profile.financialInfo.annualIncome = Number(response.responseValue);
          break;
      }
    });
  }
  
  /**
   * Update immigration preferences section
   * @param {Object} profile - User profile
   * @param {Object[]} responses - Section responses
   */
  updateImmigrationPreferences(profile, responses) {
    // Initialize immigration preferences if not exists
    if (!profile.immigrationPreferences) {
      profile.immigrationPreferences = {};
    }
    
    // Map responses to profile fields
    responses.forEach(response => {
      switch (response.questionId) {
        case 'preferences_destination_countries':
          profile.immigrationPreferences.destinationCountries = Array.isArray(response.responseValue) 
            ? response.responseValue 
            : [response.responseValue];
          break;
        case 'preferences_pathway_types':
          profile.immigrationPreferences.pathwayTypes = Array.isArray(response.responseValue) 
            ? response.responseValue 
            : [response.responseValue];
          break;
        case 'preferences_timeframe':
          profile.immigrationPreferences.timeframe = response.responseValue;
          break;
        case 'preferences_budget_range':
          profile.immigrationPreferences.budgetRange = response.responseValue;
          break;
        case 'preferences_priority_factors':
          profile.immigrationPreferences.priorityFactors = Array.isArray(response.responseValue) 
            ? response.responseValue 
            : [response.responseValue];
          break;
      }
    });
  }
}

module.exports = QuizEngineService;
