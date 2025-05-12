const mongoose = require('mongoose');

/**
 * Creates mock quiz-related objects for testing
 */
class MockFactory {
  /**
   * Create a mock user
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Mock user object
   */
  static createUser(overrides = {}) {
    return {
      _id: new mongoose.Types.ObjectId(),
      email: `test-${Math.random().toString(36).substring(2, 9)}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      ...overrides
    };
  }
  
  /**
   * Create a mock profile
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Mock profile object
   */
  static createProfile(overrides = {}) {
    const userId = overrides.userId || new mongoose.Types.ObjectId();
    
    return {
      userId,
      personalInfo: {},
      education: [],
      workExperience: [],
      languageProficiency: [],
      financialInfo: {},
      immigrationPreferences: {},
      completionStatus: {
        personalInfo: 0,
        education: 0,
        workExperience: 0,
        languageProficiency: 0,
        financialInfo: 0,
        immigrationPreferences: 0,
        overall: 0
      },
      ...overrides
    };
  }
  
  /**
   * Create a mock question
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Mock question object
   */
  static createQuestion(overrides = {}) {
    return {
      questionId: `question_${Math.random().toString(36).substring(2, 9)}`,
      text: 'Test question',
      section: 'personal',
      type: 'single_choice',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ],
      order: 1,
      isActive: true,
      ...overrides
    };
  }
  
  /**
   * Create a mock quiz session
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Mock quiz session object
   */
  static createQuizSession(overrides = {}) {
    const userId = overrides.userId || new mongoose.Types.ObjectId();
    
    return {
      userId,
      sessionId: `session_${Math.random().toString(36).substring(2, 9)}`,
      isAnonymous: false,
      status: 'in_progress',
      startedAt: new Date(),
      lastActivityAt: new Date(),
      currentSection: 'personal',
      currentQuestionId: 'personal_dob',
      completedSections: [],
      progress: 0,
      responseCount: 0,
      ...overrides
    };
  }
  
  /**
   * Create a mock response
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Mock response object
   */
  static createResponse(overrides = {}) {
    const userId = overrides.userId || new mongoose.Types.ObjectId();
    const sessionId = overrides.sessionId || `session_${Math.random().toString(36).substring(2, 9)}`;
    const questionId = overrides.questionId || `question_${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      userId,
      sessionId,
      questionId,
      questionText: 'Test question',
      questionType: 'single_choice',
      section: 'personal',
      responseValue: 'option1',
      selectedOptions: [{ value: 'option1', label: 'Option 1' }],
      answeredAt: new Date(),
      ...overrides
    };
  }
  
  /**
   * Create multiple mock questions for different sections
   * @returns {Object[]} Array of mock questions
   */
  static createMockQuestions() {
    return [
      // Personal section
      this.createQuestion({
        questionId: 'personal_dob',
        text: 'What is your date of birth?',
        section: 'personal',
        type: 'date',
        order: 1
      }),
      this.createQuestion({
        questionId: 'personal_gender',
        text: 'What is your gender?',
        section: 'personal',
        type: 'single_choice',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'non-binary', label: 'Non-binary' },
          { value: 'prefer-not-to-say', label: 'Prefer not to say' }
        ],
        order: 2
      }),
      
      // Education section
      this.createQuestion({
        questionId: 'education_1_level',
        text: 'What is your highest level of education?',
        section: 'education',
        type: 'single_choice',
        options: [
          { value: 'high-school', label: 'High School' },
          { value: 'bachelor', label: 'Bachelor\'s Degree' },
          { value: 'master', label: 'Master\'s Degree' },
          { value: 'doctorate', label: 'Doctorate' }
        ],
        order: 1
      }),
      
      // Work section
      this.createQuestion({
        questionId: 'work_1_job_title',
        text: 'What is your current job title?',
        section: 'work',
        type: 'text',
        order: 1
      })
    ];
  }
  
  /**
   * Create a complete test dataset for quiz testing
   * @param {Object} options - Options for creating the dataset
   * @returns {Promise<Object>} Created test objects
   */
  static async createTestDataset(options = {}) {
    const { User } = require('../../models/user.model');
    const { Profile } = require('../../models/profile.model');
    const { Question } = require('../../models/question.model');
    
    // Create user
    const user = this.createUser(options.user || {});
    await User.create(user);
    
    // Create profile
    const profile = this.createProfile({ userId: user._id, ...(options.profile || {}) });
    await Profile.create(profile);
    
    // Create questions
    const questions = options.questions || this.createMockQuestions();
    await Question.insertMany(questions);
    
    return {
      user,
      profile,
      questions
    };
  }
}

module.exports = MockFactory;
