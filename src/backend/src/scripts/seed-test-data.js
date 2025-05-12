/**
 * Script to seed test data for the quiz engine
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../models/user.model');
const { Profile } = require('../models/profile.model');
const { Question } = require('../models/question.model');
const { QuizSession } = require('../models/quiz-session.model');
const { Response } = require('../models/response.model');
const { logger } = require('../utils/logger');
const config = require('../config');
const MockFactory = require('../tests/utils/mock-factory');

/**
 * Connect to the database
 */
async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongoURI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

/**
 * Seed test users
 * @returns {Promise<Object[]>} Created test users
 */
async function seedTestUsers() {
  try {
    logger.info('Seeding test users...');
    
    // Clear existing test users
    await User.deleteMany({ email: /test-.*@example.com/ });
    
    // Create test users
    const users = [
      MockFactory.createUser({ email: 'test-user1@example.com' }),
      MockFactory.createUser({ email: 'test-user2@example.com' }),
      MockFactory.createUser({ email: 'test-user3@example.com' })
    ];
    
    await User.insertMany(users);
    logger.info(`Created ${users.length} test users`);
    
    return users;
  } catch (error) {
    logger.error('Failed to seed test users', error);
    throw error;
  }
}

/**
 * Seed test profiles
 * @param {Object[]} users - Test users
 * @returns {Promise<Object[]>} Created test profiles
 */
async function seedTestProfiles(users) {
  try {
    logger.info('Seeding test profiles...');
    
    // Clear existing test profiles
    await Profile.deleteMany({ userId: { $in: users.map(user => user._id) } });
    
    // Create test profiles
    const profiles = users.map(user => MockFactory.createProfile({ userId: user._id }));
    
    await Profile.insertMany(profiles);
    logger.info(`Created ${profiles.length} test profiles`);
    
    return profiles;
  } catch (error) {
    logger.error('Failed to seed test profiles', error);
    throw error;
  }
}

/**
 * Seed test questions
 * @returns {Promise<Object[]>} Created test questions
 */
async function seedTestQuestions() {
  try {
    logger.info('Seeding test questions...');
    
    // Clear existing questions
    await Question.deleteMany({});
    
    // Create test questions for each section
    const personalQuestions = [
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
      },
      {
        questionId: 'personal_marital_status',
        text: 'What is your marital status?',
        section: 'personal',
        type: 'single_choice',
        options: [
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married' },
          { value: 'common-law', label: 'Common Law' },
          { value: 'separated', label: 'Separated' },
          { value: 'divorced', label: 'Divorced' },
          { value: 'widowed', label: 'Widowed' }
        ],
        order: 3,
        isActive: true
      },
      {
        questionId: 'personal_nationality',
        text: 'What is your nationality?',
        section: 'personal',
        type: 'single_choice',
        options: [
          { value: 'US', label: 'United States' },
          { value: 'CA', label: 'Canada' },
          { value: 'UK', label: 'United Kingdom' },
          { value: 'AU', label: 'Australia' },
          { value: 'IN', label: 'India' },
          { value: 'CN', label: 'China' }
        ],
        order: 4,
        isActive: true
      }
    ];
    
    const educationQuestions = [
      {
        questionId: 'education_1_level',
        text: 'What is your highest level of education?',
        section: 'education',
        type: 'single_choice',
        options: [
          { value: 'high-school', label: 'High School' },
          { value: 'certificate', label: 'Certificate' },
          { value: 'diploma', label: 'Diploma' },
          { value: 'associate', label: 'Associate Degree' },
          { value: 'bachelor', label: 'Bachelor\'s Degree' },
          { value: 'master', label: 'Master\'s Degree' },
          { value: 'doctorate', label: 'Doctorate' }
        ],
        order: 1,
        isActive: true
      },
      {
        questionId: 'education_1_field',
        text: 'What is your field of study?',
        section: 'education',
        type: 'text',
        order: 2,
        isActive: true
      },
      {
        questionId: 'education_1_institution',
        text: 'What institution did you attend?',
        section: 'education',
        type: 'text',
        order: 3,
        isActive: true
      }
    ];
    
    const workQuestions = [
      {
        questionId: 'work_1_job_title',
        text: 'What is your current job title?',
        section: 'work',
        type: 'text',
        order: 1,
        isActive: true
      },
      {
        questionId: 'work_1_employer',
        text: 'Who is your current employer?',
        section: 'work',
        type: 'text',
        order: 2,
        isActive: true
      },
      {
        questionId: 'work_1_industry',
        text: 'What industry do you work in?',
        section: 'work',
        type: 'single_choice',
        options: [
          { value: 'technology', label: 'Technology' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'finance', label: 'Finance' },
          { value: 'education', label: 'Education' },
          { value: 'manufacturing', label: 'Manufacturing' },
          { value: 'retail', label: 'Retail' },
          { value: 'other', label: 'Other' }
        ],
        order: 3,
        isActive: true
      }
    ];
    
    const languageQuestions = [
      {
        questionId: 'language_english_speaking',
        text: 'Rate your English speaking ability',
        section: 'language',
        type: 'slider',
        validation: {
          min: 0,
          max: 10,
          step: 1
        },
        order: 1,
        isActive: true
      },
      {
        questionId: 'language_english_listening',
        text: 'Rate your English listening ability',
        section: 'language',
        type: 'slider',
        validation: {
          min: 0,
          max: 10,
          step: 1
        },
        order: 2,
        isActive: true
      },
      {
        questionId: 'language_english_reading',
        text: 'Rate your English reading ability',
        section: 'language',
        type: 'slider',
        validation: {
          min: 0,
          max: 10,
          step: 1
        },
        order: 3,
        isActive: true
      },
      {
        questionId: 'language_english_writing',
        text: 'Rate your English writing ability',
        section: 'language',
        type: 'slider',
        validation: {
          min: 0,
          max: 10,
          step: 1
        },
        order: 4,
        isActive: true
      }
    ];
    
    const financialQuestions = [
      {
        questionId: 'financial_currency',
        text: 'What is your primary currency?',
        section: 'financial',
        type: 'single_choice',
        options: [
          { value: 'USD', label: 'US Dollar (USD)' },
          { value: 'CAD', label: 'Canadian Dollar (CAD)' },
          { value: 'GBP', label: 'British Pound (GBP)' },
          { value: 'EUR', label: 'Euro (EUR)' },
          { value: 'AUD', label: 'Australian Dollar (AUD)' },
          { value: 'INR', label: 'Indian Rupee (INR)' },
          { value: 'CNY', label: 'Chinese Yuan (CNY)' }
        ],
        order: 1,
        isActive: true
      },
      {
        questionId: 'financial_liquid_assets',
        text: 'What is the value of your liquid assets?',
        section: 'financial',
        type: 'number',
        order: 2,
        isActive: true
      },
      {
        questionId: 'financial_annual_income',
        text: 'What is your annual income?',
        section: 'financial',
        type: 'number',
        order: 3,
        isActive: true
      }
    ];
    
    const immigrationQuestions = [
      {
        questionId: 'immigration_previous_attempts',
        text: 'Have you previously applied for immigration to any country?',
        section: 'immigration',
        type: 'single_choice',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        order: 1,
        isActive: true
      },
      {
        questionId: 'immigration_previous_visits',
        text: 'Have you previously visited the country you want to immigrate to?',
        section: 'immigration',
        type: 'single_choice',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        order: 2,
        isActive: true
      }
    ];
    
    const preferenceQuestions = [
      {
        questionId: 'preferences_destination_countries',
        text: 'Which countries are you interested in immigrating to?',
        section: 'preferences',
        type: 'multiple_choice',
        options: [
          { value: 'CA', label: 'Canada' },
          { value: 'US', label: 'United States' },
          { value: 'UK', label: 'United Kingdom' },
          { value: 'AU', label: 'Australia' },
          { value: 'NZ', label: 'New Zealand' },
          { value: 'DE', label: 'Germany' },
          { value: 'FR', label: 'France' }
        ],
        order: 1,
        isActive: true
      },
      {
        questionId: 'preferences_pathway_types',
        text: 'Which immigration pathways are you interested in?',
        section: 'preferences',
        type: 'multiple_choice',
        options: [
          { value: 'work', label: 'Work Visa' },
          { value: 'study', label: 'Study Visa' },
          { value: 'family', label: 'Family Sponsorship' },
          { value: 'investment', label: 'Investment Visa' },
          { value: 'entrepreneur', label: 'Entrepreneur Visa' },
          { value: 'skilled', label: 'Skilled Worker' },
          { value: 'refugee', label: 'Refugee/Asylum' }
        ],
        order: 2,
        isActive: true
      },
      {
        questionId: 'preferences_timeframe',
        text: 'What is your desired timeframe for immigration?',
        section: 'preferences',
        type: 'single_choice',
        options: [
          { value: 'within-6-months', label: 'Within 6 months' },
          { value: 'within-1-year', label: 'Within 1 year' },
          { value: 'within-2-years', label: 'Within 2 years' },
          { value: 'within-5-years', label: 'Within 5 years' },
          { value: 'no-timeline', label: 'No specific timeline' }
        ],
        order: 3,
        isActive: true
      }
    ];
    
    // Combine all questions
    const allQuestions = [
      ...personalQuestions,
      ...educationQuestions,
      ...workQuestions,
      ...languageQuestions,
      ...financialQuestions,
      ...immigrationQuestions,
      ...preferenceQuestions
    ];
    
    // Insert questions
    await Question.insertMany(allQuestions);
    logger.info(`Created ${allQuestions.length} test questions`);
    
    return allQuestions;
  } catch (error) {
    logger.error('Failed to seed test questions', error);
    throw error;
  }
}

/**
 * Seed test quiz sessions
 * @param {Object[]} users - Test users
 * @returns {Promise<Object[]>} Created test quiz sessions
 */
async function seedTestQuizSessions(users) {
  try {
    logger.info('Seeding test quiz sessions...');
    
    // Clear existing quiz sessions
    await QuizSession.deleteMany({ userId: { $in: users.map(user => user._id) } });
    
    // Create test quiz sessions
    const sessions = users.map(user => ({
      userId: user._id,
      sessionId: `test-session-${Math.random().toString(36).substring(2, 9)}`,
      isAnonymous: false,
      status: 'in_progress',
      startedAt: new Date(),
      lastActivityAt: new Date(),
      currentSection: 'personal',
      currentQuestionId: 'personal_dob',
      completedSections: [],
      progress: 0,
      responseCount: 0
    }));
    
    await QuizSession.insertMany(sessions);
    logger.info(`Created ${sessions.length} test quiz sessions`);
    
    return sessions;
  } catch (error) {
    logger.error('Failed to seed test quiz sessions', error);
    throw error;
  }
}

/**
 * Seed test responses
 * @param {Object[]} sessions - Test quiz sessions
 * @returns {Promise<Object[]>} Created test responses
 */
async function seedTestResponses(sessions) {
  try {
    logger.info('Seeding test responses...');
    
    // Clear existing responses
    await Response.deleteMany({ sessionId: { $in: sessions.map(session => session.sessionId) } });
    
    // Create test responses
    const responses = [];
    
    for (const session of sessions) {
      // Add some responses for each session
      responses.push({
        userId: session.userId,
        sessionId: session.sessionId,
        questionId: 'personal_dob',
        questionText: 'What is your date of birth?',
        questionType: 'date',
        section: 'personal',
        responseValue: '1990-01-01',
        dateResponse: new Date('1990-01-01'),
        answeredAt: new Date()
      });
      
      responses.push({
        userId: session.userId,
        sessionId: session.sessionId,
        questionId: 'personal_gender',
        questionText: 'What is your gender?',
        questionType: 'single_choice',
        section: 'personal',
        responseValue: 'male',
        selectedOptions: [{ value: 'male', label: 'Male' }],
        answeredAt: new Date()
      });
    }
    
    await Response.insertMany(responses);
    logger.info(`Created ${responses.length} test responses`);
    
    return responses;
  } catch (error) {
    logger.error('Failed to seed test responses', error);
    throw error;
  }
}

/**
 * Seed all test data
 */
async function seedAllTestData() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Seed test data
    const users = await seedTestUsers();
    await seedTestProfiles(users);
    await seedTestQuestions();
    const sessions = await seedTestQuizSessions(users);
    await seedTestResponses(sessions);
    
    logger.info('All test data seeded successfully!');
    
    // Disconnect from database
    await mongoose.disconnect();
    logger.info('Disconnected from database');
    
    process.exit(0);
  } catch (error) {
    logger.error('Failed to seed test data', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedAllTestData();
}

module.exports = {
  seedTestUsers,
  seedTestProfiles,
  seedTestQuestions,
  seedTestQuizSessions,
  seedTestResponses,
  seedAllTestData
};
