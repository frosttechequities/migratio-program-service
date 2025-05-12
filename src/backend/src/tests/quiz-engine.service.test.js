// Import the setup file to handle MongoDB connection
require('./setup');

const mongoose = require('mongoose');
const QuizEngineService = require('../services/quiz-engine.service');
const { Question } = require('../models/question.model');
const { QuizSession } = require('../models/quiz-session.model');
const { Response } = require('../models/response.model');
const { Profile } = require('../models/profile.model');

// Mock data
const mockUserId = new mongoose.Types.ObjectId();
const mockSessionId = 'test-session-123';

// Mock questions
const mockQuestions = {
  personal: [
    {
      questionId: 'personal_dob',
      text: 'What is your date of birth?',
      section: 'personal',
      type: 'date',
      order: 1,
      isActive: true
    },
    {
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
      order: 2,
      isActive: true
    }
  ],
  education: [
    {
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
      order: 1,
      isActive: true
    }
  ]
};

// Mock profile
const mockProfile = {
  userId: mockUserId,
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
  calculateCompletion: jest.fn()
};

describe('QuizEngineService', () => {
  let quizEngine;

  beforeEach(async () => {
    // Clear collections
    await QuizSession.deleteMany({});
    await Question.deleteMany({});
    await Response.deleteMany({});
    await Profile.deleteMany({});

    // Create mock questions
    await Question.insertMany([
      ...mockQuestions.personal,
      ...mockQuestions.education
    ]);

    // Create mock profile
    await Profile.create(mockProfile);

    // Initialize quiz engine
    quizEngine = new QuizEngineService();

    // Mock static methods
    QuizSession.generateSessionId = jest.fn().mockReturnValue(mockSessionId);
    QuizSession.findActiveForUser = jest.fn().mockResolvedValue(null);
    Question.getInitialQuestions = jest.fn().mockImplementation(async (section) => {
      return mockQuestions[section] ? [mockQuestions[section][0]] : [];
    });
    Question.getNextQuestion = jest.fn().mockImplementation(async (section, responses) => {
      const questions = mockQuestions[section] || [];
      if (questions.length <= 1) return null;

      // Find the current question index based on responses
      const answeredQuestionIds = Object.keys(responses);
      const lastAnsweredQuestion = questions.find(q => q.questionId === answeredQuestionIds[answeredQuestionIds.length - 1]);
      const lastIndex = lastAnsweredQuestion ? questions.indexOf(lastAnsweredQuestion) : -1;

      // Return the next question if available
      return lastIndex < questions.length - 1 ? questions[lastIndex + 1] : null;
    });
    Response.getSessionResponses = jest.fn().mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a new quiz session', async () => {
      const result = await quizEngine.createSession(mockUserId.toString());

      expect(result).toBeDefined();
      expect(result.session).toBeDefined();
      expect(result.initialQuestion).toBeDefined();
      expect(result.session.userId.toString()).toBe(mockUserId.toString());
      expect(result.session.sessionId).toBe(mockSessionId);
      expect(result.session.currentSection).toBe('personal');
      expect(result.initialQuestion.questionId).toBe('personal_dob');
    });

    it('should return existing session if one exists', async () => {
      // Create an existing session
      const existingSession = new QuizSession({
        userId: mockUserId,
        sessionId: 'existing-session',
        currentSection: 'education',
        currentQuestionId: 'education_1_level'
      });
      await existingSession.save();

      // Mock findActiveForUser to return the existing session
      QuizSession.findActiveForUser = jest.fn().mockResolvedValue(existingSession);

      const result = await quizEngine.createSession(mockUserId.toString());

      expect(result).toBe(existingSession);
      expect(QuizSession.generateSessionId).not.toHaveBeenCalled();
    });

    it('should handle custom options', async () => {
      const options = {
        isAnonymous: true,
        startSection: 'education',
        language: 'fr',
        deviceInfo: { browser: 'Chrome' },
        referrer: 'google.com',
        quizVersion: '2.0'
      };

      const result = await quizEngine.createSession(mockUserId.toString(), options);

      expect(result.session.isAnonymous).toBe(true);
      expect(result.session.currentSection).toBe('education');
      expect(result.session.language).toBe('fr');
      expect(result.session.deviceInfo).toEqual({ browser: 'Chrome' });
      expect(result.session.referrer).toBe('google.com');
      expect(result.session.quizVersion).toBe('2.0');
      expect(result.initialQuestion.questionId).toBe('education_1_level');
    });
  });

  describe('resumeSession', () => {
    it('should resume an existing session', async () => {
      // Create a session
      const session = new QuizSession({
        userId: mockUserId,
        sessionId: mockSessionId,
        currentSection: 'personal',
        currentQuestionId: 'personal_gender'
      });
      await session.save();

      // Create some responses
      const responses = [
        new Response({
          userId: mockUserId,
          sessionId: mockSessionId,
          questionId: 'personal_dob',
          questionText: 'What is your date of birth?',
          questionType: 'date',
          section: 'personal',
          responseValue: '1990-01-01',
          dateResponse: new Date('1990-01-01')
        })
      ];
      await Response.insertMany(responses);

      // Mock findActiveForUser and getSessionResponses
      QuizSession.findActiveForUser = jest.fn().mockResolvedValue(session);
      Response.getSessionResponses = jest.fn().mockResolvedValue(responses);
      Question.findOne = jest.fn().mockResolvedValue(mockQuestions.personal[1]);

      const result = await quizEngine.resumeSession(mockUserId.toString());

      expect(result).toBeDefined();
      expect(result.session).toBe(session);
      expect(result.currentQuestion).toBe(mockQuestions.personal[1]);
      expect(result.responses).toEqual({ 'personal_dob': '1990-01-01' });
    });

    it('should return null if no active session exists', async () => {
      QuizSession.findActiveForUser = jest.fn().mockResolvedValue(null);

      const result = await quizEngine.resumeSession(mockUserId.toString());

      expect(result).toBeNull();
    });
  });

  describe('processAnswer', () => {
    let session;

    beforeEach(async () => {
      // Create a session
      session = new QuizSession({
        userId: mockUserId,
        sessionId: mockSessionId,
        currentSection: 'personal',
        currentQuestionId: 'personal_dob',
        updateActivity: jest.fn(),
        updateProgress: jest.fn(),
        completeSection: jest.fn(),
        complete: jest.fn()
      });
      await session.save();

      // Mock methods
      QuizSession.findOne = jest.fn().mockResolvedValue(session);
      Question.findOne = jest.fn().mockResolvedValue(mockQuestions.personal[0]);
      quizEngine.saveResponse = jest.fn().mockResolvedValue({});
      quizEngine.getTotalQuestionCount = jest.fn().mockResolvedValue(10);
      quizEngine.updateUserProfile = jest.fn().mockResolvedValue({});
    });

    it('should process an answer and return the next question', async () => {
      // Mock getNextQuestion to return the next question
      Question.getNextQuestion = jest.fn().mockResolvedValue(mockQuestions.personal[1]);

      const result = await quizEngine.processAnswer(mockSessionId, 'personal_dob', '1990-01-01');

      expect(result).toBeDefined();
      expect(result.session).toBe(session);
      expect(result.nextQuestion).toBe(mockQuestions.personal[1]);
      expect(result.isComplete).toBe(false);
      expect(session.responseCount).toBe(1);
      expect(session.updateActivity).toHaveBeenCalled();
      expect(session.updateProgress).toHaveBeenCalledWith(10);
      expect(session.currentQuestionId).toBe('personal_gender');
      expect(quizEngine.saveResponse).toHaveBeenCalled();
    });

    it('should move to the next section when no more questions in current section', async () => {
      // Mock getNextQuestion to return null (no more questions)
      Question.getNextQuestion = jest.fn().mockResolvedValue(null);

      // Mock getInitialQuestion for the next section
      quizEngine.getInitialQuestion = jest.fn().mockResolvedValue(mockQuestions.education[0]);

      // Mock getNextSection
      quizEngine.getNextSection = jest.fn().mockReturnValue('education');

      const result = await quizEngine.processAnswer(mockSessionId, 'personal_dob', '1990-01-01');

      expect(result).toBeDefined();
      expect(result.session).toBe(session);
      expect(result.nextQuestion).toBe(mockQuestions.education[0]);
      expect(result.isComplete).toBe(false);
      expect(session.completeSection).toHaveBeenCalledWith('personal');
      expect(session.currentSection).toBe('education');
      expect(session.currentQuestionId).toBe('education_1_level');
    });

    it('should complete the quiz when no more sections', async () => {
      // Mock getNextQuestion to return null (no more questions)
      Question.getNextQuestion = jest.fn().mockResolvedValue(null);

      // Mock getNextSection to return null (no more sections)
      quizEngine.getNextSection = jest.fn().mockReturnValue(null);

      // Mock responses
      const responses = [
        {
          userId: mockUserId,
          sessionId: mockSessionId,
          questionId: 'personal_dob',
          section: 'personal',
          responseValue: '1990-01-01'
        }
      ];
      Response.getSessionResponses = jest.fn().mockResolvedValue(responses);

      const result = await quizEngine.processAnswer(mockSessionId, 'personal_dob', '1990-01-01');

      expect(result).toBeDefined();
      expect(result.session).toBe(session);
      expect(result.nextQuestion).toBeNull();
      expect(result.isComplete).toBe(true);
      expect(session.complete).toHaveBeenCalled();
      expect(quizEngine.updateUserProfile).toHaveBeenCalledWith(mockUserId.toString(), responses);
    });

    it('should throw an error if session not found', async () => {
      QuizSession.findOne = jest.fn().mockResolvedValue(null);

      await expect(quizEngine.processAnswer(mockSessionId, 'personal_dob', '1990-01-01'))
        .rejects.toThrow('Session not found');
    });

    it('should throw an error if question not found', async () => {
      Question.findOne = jest.fn().mockResolvedValue(null);

      await expect(quizEngine.processAnswer(mockSessionId, 'personal_dob', '1990-01-01'))
        .rejects.toThrow('Question not found');
    });

    // Edge case tests
    it('should handle empty answer values', async () => {
      // Mock getNextQuestion to return the next question
      Question.getNextQuestion = jest.fn().mockResolvedValue(mockQuestions.personal[1]);

      const result = await quizEngine.processAnswer(mockSessionId, 'personal_dob', '');

      expect(result).toBeDefined();
      expect(quizEngine.saveResponse).toHaveBeenCalledWith(
        session,
        mockQuestions.personal[0],
        ''
      );
    });

    it('should handle null answer values', async () => {
      // Mock getNextQuestion to return the next question
      Question.getNextQuestion = jest.fn().mockResolvedValue(mockQuestions.personal[1]);

      const result = await quizEngine.processAnswer(mockSessionId, 'personal_dob', null);

      expect(result).toBeDefined();
      expect(quizEngine.saveResponse).toHaveBeenCalledWith(
        session,
        mockQuestions.personal[0],
        null
      );
    });

    it('should handle very long text answers', async () => {
      // Create a very long string
      const longAnswer = 'a'.repeat(10000);

      // Mock question as text type
      Question.findOne = jest.fn().mockResolvedValue({
        ...mockQuestions.personal[0],
        type: 'text'
      });

      // Mock getNextQuestion to return the next question
      Question.getNextQuestion = jest.fn().mockResolvedValue(mockQuestions.personal[1]);

      const result = await quizEngine.processAnswer(mockSessionId, 'personal_dob', longAnswer);

      expect(result).toBeDefined();
      expect(quizEngine.saveResponse).toHaveBeenCalledWith(
        session,
        expect.objectContaining({ type: 'text' }),
        longAnswer
      );
    });
  });

  describe('saveResponse', () => {
    let session, question;

    beforeEach(() => {
      session = {
        userId: mockUserId,
        sessionId: mockSessionId
      };

      question = mockQuestions.personal[0];

      Response.findOne = jest.fn().mockResolvedValue(null);
    });

    it('should create a new response if one does not exist', async () => {
      const mockResponse = {
        save: jest.fn()
      };

      // Mock Response constructor
      jest.spyOn(Response.prototype, 'constructor').mockImplementation(() => {});
      Response.prototype.save = jest.fn();

      // Mock formatResponse
      quizEngine.formatResponse = jest.fn().mockReturnValue({
        responseValue: '1990-01-01',
        dateResponse: new Date('1990-01-01')
      });

      await quizEngine.saveResponse(session, question, '1990-01-01');

      expect(quizEngine.formatResponse).toHaveBeenCalledWith(question, '1990-01-01');
      expect(Response.findOne).toHaveBeenCalledWith({
        sessionId: mockSessionId,
        questionId: 'personal_dob'
      });
    });

    it('should update an existing response', async () => {
      const existingResponse = {
        responseValue: '1989-01-01',
        dateResponse: new Date('1989-01-01'),
        isEdited: false,
        editHistory: [],
        save: jest.fn()
      };

      Response.findOne = jest.fn().mockResolvedValue(existingResponse);

      // Mock formatResponse
      quizEngine.formatResponse = jest.fn().mockReturnValue({
        responseValue: '1990-01-01',
        dateResponse: new Date('1990-01-01')
      });

      await quizEngine.saveResponse(session, question, '1990-01-01');

      expect(existingResponse.responseValue).toBe('1990-01-01');
      expect(existingResponse.isEdited).toBe(true);
      expect(existingResponse.editHistory.length).toBe(1);
      expect(existingResponse.editHistory[0].previousValue).toBe('1989-01-01');
      expect(existingResponse.save).toHaveBeenCalled();
    });
  });

  describe('formatResponse', () => {
    it('should format a date response', () => {
      const question = mockQuestions.personal[0]; // date question
      const answer = '1990-01-01';

      const result = quizEngine.formatResponse(question, answer);

      expect(result.responseValue).toBe(answer);
      expect(result.dateResponse).toBeInstanceOf(Date);
      expect(result.dateResponse.toISOString().split('T')[0]).toBe(answer);
    });

    it('should format a single choice response', () => {
      const question = mockQuestions.personal[1]; // single_choice question
      const answer = 'male';

      const result = quizEngine.formatResponse(question, answer);

      expect(result.responseValue).toBe(answer);
      expect(result.selectedOptions).toEqual([{ value: 'male', label: 'Male' }]);
    });

    it('should format a multiple choice response', () => {
      const question = {
        ...mockQuestions.personal[1],
        type: 'multiple_choice'
      };
      const answer = ['male', 'female'];

      const result = quizEngine.formatResponse(question, answer);

      expect(result.responseValue).toEqual(answer);
      expect(result.selectedOptions).toEqual([
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]);
    });

    it('should format a text response', () => {
      const question = {
        ...mockQuestions.personal[0],
        type: 'text'
      };
      const answer = 'Some text answer';

      const result = quizEngine.formatResponse(question, answer);

      expect(result.responseValue).toBe(answer);
      expect(result.textResponse).toBe(answer);
    });

    it('should format a numeric response', () => {
      const question = {
        ...mockQuestions.personal[0],
        type: 'number'
      };
      const answer = 42;

      const result = quizEngine.formatResponse(question, answer);

      expect(result.responseValue).toBe(answer);
      expect(result.numericResponse).toBe(answer);
    });
  });

  describe('getNextSection', () => {
    it('should return the next section', () => {
      const currentSection = 'personal';
      const completedSections = [];

      const result = quizEngine.getNextSection(currentSection, completedSections);

      expect(result).toBe('education');
    });

    it('should skip completed sections', () => {
      const currentSection = 'personal';
      const completedSections = ['education'];

      const result = quizEngine.getNextSection(currentSection, completedSections);

      expect(result).toBe('work');
    });

    it('should return null if all sections are completed', () => {
      const currentSection = 'preferences';
      const completedSections = ['personal', 'education', 'work', 'language', 'financial', 'immigration'];

      const result = quizEngine.getNextSection(currentSection, completedSections);

      expect(result).toBeNull();
    });
  });

  describe('getTotalQuestionCount', () => {
    it('should return the total number of active questions', async () => {
      Question.countDocuments = jest.fn().mockResolvedValue(10);

      const result = await quizEngine.getTotalQuestionCount();

      expect(result).toBe(10);
      expect(Question.countDocuments).toHaveBeenCalledWith({ isActive: true });
    });
  });

  describe('updateUserProfile', () => {
    let profile, responses;

    beforeEach(() => {
      profile = {
        ...mockProfile,
        save: jest.fn()
      };

      responses = [
        {
          questionId: 'personal_dob',
          section: 'personal',
          responseValue: '1990-01-01',
          dateResponse: new Date('1990-01-01')
        },
        {
          questionId: 'personal_gender',
          section: 'personal',
          responseValue: 'male'
        },
        {
          questionId: 'education_1_level',
          section: 'education',
          responseValue: 'bachelor'
        }
      ];

      Profile.findOne = jest.fn().mockResolvedValue(profile);

      // Mock section update methods
      quizEngine.updatePersonalInfo = jest.fn();
      quizEngine.updateEducation = jest.fn();
      quizEngine.updateWorkExperience = jest.fn();
      quizEngine.updateLanguageProficiency = jest.fn();
      quizEngine.updateFinancialInfo = jest.fn();
      quizEngine.updateImmigrationPreferences = jest.fn();
    });

    it('should update the user profile with quiz responses', async () => {
      await quizEngine.updateUserProfile(mockUserId.toString(), responses);

      expect(Profile.findOne).toHaveBeenCalledWith({ userId: mockUserId.toString() });
      expect(quizEngine.updatePersonalInfo).toHaveBeenCalledWith(profile, [responses[0], responses[1]]);
      expect(quizEngine.updateEducation).toHaveBeenCalledWith(profile, [responses[2]]);
      expect(profile.calculateCompletion).toHaveBeenCalled();
      expect(profile.save).toHaveBeenCalled();
    });

    it('should throw an error if profile not found', async () => {
      Profile.findOne = jest.fn().mockResolvedValue(null);

      await expect(quizEngine.updateUserProfile(mockUserId.toString(), responses))
        .rejects.toThrow('Profile not found');
    });
  });

  describe('section update methods', () => {
    let profile;

    beforeEach(() => {
      profile = {
        personalInfo: {},
        education: [],
        workExperience: [],
        languageProficiency: [],
        financialInfo: {},
        immigrationPreferences: {}
      };
    });

    describe('updatePersonalInfo', () => {
      it('should update personal info fields', () => {
        const responses = [
          {
            questionId: 'personal_dob',
            dateResponse: new Date('1990-01-01'),
            responseValue: '1990-01-01'
          },
          {
            questionId: 'personal_gender',
            responseValue: 'male'
          },
          {
            questionId: 'personal_marital_status',
            responseValue: 'single'
          },
          {
            questionId: 'personal_nationality',
            responseValue: 'US'
          }
        ];

        quizEngine.updatePersonalInfo(profile, responses);

        expect(profile.personalInfo.dateOfBirth).toEqual(new Date('1990-01-01'));
        expect(profile.personalInfo.gender).toBe('male');
        expect(profile.personalInfo.maritalStatus).toBe('single');
        expect(profile.personalInfo.nationality).toEqual([{ country: 'US', isPrimary: true }]);
      });
    });

    describe('updateEducation', () => {
      it('should update education fields', () => {
        const responses = [
          {
            questionId: 'education_1_level',
            responseValue: 'bachelor'
          },
          {
            questionId: 'education_1_field',
            responseValue: 'Computer Science'
          },
          {
            questionId: 'education_1_institution',
            responseValue: 'MIT'
          },
          {
            questionId: 'education_1_country',
            responseValue: 'US'
          },
          {
            questionId: 'education_1_start_date',
            responseValue: '2010-09-01'
          },
          {
            questionId: 'education_1_end_date',
            responseValue: '2014-06-01'
          },
          {
            questionId: 'education_1_completed',
            responseValue: 'yes'
          }
        ];

        quizEngine.updateEducation(profile, responses);

        expect(profile.education).toHaveLength(1);
        expect(profile.education[0].level).toBe('bachelor');
        expect(profile.education[0].field).toBe('Computer Science');
        expect(profile.education[0].institution).toBe('MIT');
        expect(profile.education[0].country).toBe('US');
        expect(profile.education[0].startDate).toEqual(new Date('2010-09-01'));
        expect(profile.education[0].endDate).toEqual(new Date('2014-06-01'));
        expect(profile.education[0].completed).toBe(true);
      });
    });
  });

  describe('Performance', () => {
    it('should process answers efficiently', async () => {
      // Create a session
      const session = new QuizSession({
        userId: mockUserId,
        sessionId: mockSessionId,
        currentSection: 'personal',
        currentQuestionId: 'personal_dob',
        updateActivity: jest.fn(),
        updateProgress: jest.fn(),
        completeSection: jest.fn(),
        complete: jest.fn(),
        save: jest.fn().mockResolvedValue({})
      });

      // Mock methods
      QuizSession.findOne = jest.fn().mockResolvedValue(session);
      Question.findOne = jest.fn().mockResolvedValue(mockQuestions.personal[0]);
      quizEngine.saveResponse = jest.fn().mockResolvedValue({});
      quizEngine.getTotalQuestionCount = jest.fn().mockResolvedValue(10);
      Question.getNextQuestion = jest.fn().mockResolvedValue(mockQuestions.personal[1]);
      Response.getSessionResponses = jest.fn().mockResolvedValue([]);

      // Measure performance
      const startTime = Date.now();

      // Process 10 answers in sequence
      for (let i = 0; i < 10; i++) {
        await quizEngine.processAnswer(mockSessionId, 'personal_dob', '1990-01-01');
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Each answer should be processed in less than 50ms on average
      // (500ms total for 10 answers)
      expect(duration).toBeLessThan(500);
      console.log(`Processed 10 answers in ${duration}ms (${duration/10}ms per answer)`);
    });

    it('should handle a large number of responses efficiently', async () => {
      // Create a large array of responses
      const responses = Array.from({ length: 100 }, (_, i) => ({
        userId: mockUserId,
        sessionId: mockSessionId,
        questionId: `question_${i}`,
        section: i < 50 ? 'personal' : 'education',
        responseValue: `answer_${i}`
      }));

      // Mock methods
      Response.getSessionResponses = jest.fn().mockResolvedValue(responses);

      // Measure performance
      const startTime = Date.now();

      // Format responses as key-value pairs
      const formattedResponses = {};
      responses.forEach(response => {
        formattedResponses[response.questionId] = response.responseValue;
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Formatting 100 responses should be quick
      expect(duration).toBeLessThan(50);
      console.log(`Formatted 100 responses in ${duration}ms`);
    });
  });
});
