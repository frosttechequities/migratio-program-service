/**
 * Test Recommendation Engine Script
 *
 * This script tests the recommendation engine with real immigration data.
 *
 * Usage: node test-recommendation-engine.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const RecommendationEngineService = require('../services/recommendation-engine');
const { Profile } = require('../models/profile.model');
const { User } = require('../models/user.model');
const { QuizSession } = require('../models/quiz-session.model');
const ImmigrationDataService = require('../data/immigration');

// Sample user data
const sampleUser = {
  email: 'test@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  status: 'active',
  emailVerified: true
};

// Sample profile data
const sampleProfile = {
  personalInfo: {
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male',
    maritalStatus: 'single',
    nationality: [
      { country: 'in', isPrimary: true }
    ],
    currentResidence: {
      country: 'in',
      region: 'Maharashtra',
      city: 'Mumbai',
      since: new Date('2015-01-01')
    },
    phone: '+91123456789'
  },
  education: [
    {
      level: 'bachelor',
      field: 'Computer Science',
      institution: 'University of Mumbai',
      country: 'in',
      startDate: new Date('2008-08-01'),
      endDate: new Date('2012-05-31'),
      completed: true
    },
    {
      level: 'master',
      field: 'Information Technology',
      institution: 'University of Delhi',
      country: 'in',
      startDate: new Date('2012-08-01'),
      endDate: new Date('2014-05-31'),
      completed: true
    }
  ],
  workExperience: [
    {
      jobTitle: 'Software Engineer',
      employer: 'Tech Solutions Ltd',
      country: 'in',
      industry: 'Information Technology',
      startDate: new Date('2014-06-01'),
      endDate: new Date('2018-12-31'),
      isCurrentJob: false,
      description: 'Developed web applications using JavaScript and Node.js',
      skills: ['JavaScript', 'Node.js', 'React', 'MongoDB']
    },
    {
      jobTitle: 'Senior Software Engineer',
      employer: 'Global IT Services',
      country: 'in',
      industry: 'Information Technology',
      startDate: new Date('2019-01-01'),
      isCurrentJob: true,
      description: 'Leading development team for enterprise applications',
      skills: ['JavaScript', 'TypeScript', 'AWS', 'Docker', 'Kubernetes']
    }
  ],
  languageProficiency: [
    {
      language: 'english',
      reading: 8,
      writing: 7,
      speaking: 7,
      listening: 8,
      overallScore: 7.5,
      testType: 'ielts',
      testDate: new Date('2022-06-15')
    },
    {
      language: 'hindi',
      reading: 10,
      writing: 10,
      speaking: 10,
      listening: 10,
      overallScore: 10,
      testType: 'self-assessment'
    }
  ],
  financialInfo: {
    currency: 'USD',
    liquidAssets: 50000,
    netWorth: 100000,
    annualIncome: 60000
  },
  immigrationPreferences: {
    destinationCountries: [
      { country: 'ca', priority: 1 },
      { country: 'au', priority: 2 },
      { country: 'uk', priority: 3 }
    ],
    pathwayTypes: [
      { type: 'work', priority: 1 },
      { type: 'study', priority: 2 }
    ],
    timeframe: 'within-1-year',
    budgetRange: {
      min: 5000,
      max: 15000,
      currency: 'USD'
    },
    priorityFactors: ['permanence', 'processing-time', 'cost']
  }
};

// Sample quiz session
const sampleQuizSession = {
  sessionId: 'test_session_123',
  isAnonymous: false,
  status: 'completed',
  startedAt: new Date(),
  completedAt: new Date(),
  currentSection: 'preferences',
  completedSections: ['personal', 'education', 'work', 'language', 'financial', 'immigration', 'preferences'],
  progress: 100,
  responseCount: 35
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    logger.info('Connected to MongoDB');

    try {
      // Initialize services
      const recommendationEngine = new RecommendationEngineService();
      await recommendationEngine.initialize();

      const immigrationDataService = new ImmigrationDataService();
      await immigrationDataService.initialize();

      // Create or update test user
      let user = await User.findOne({ email: sampleUser.email });

      if (!user) {
        user = new User(sampleUser);
        await user.save();
        logger.info('Created test user');
      } else {
        logger.info('Test user already exists');
      }

      // Create or update test profile
      let profile = await Profile.findOne({ userId: user._id });

      if (!profile) {
        profile = new Profile({
          userId: user._id,
          ...sampleProfile
        });
        await profile.save();
        logger.info('Created test profile');
      } else {
        // Update profile with sample data
        Object.assign(profile, sampleProfile);
        await profile.save();
        logger.info('Updated test profile');
      }

      // Create or update test quiz session
      let quizSession = await QuizSession.findOne({ sessionId: sampleQuizSession.sessionId });

      if (!quizSession) {
        quizSession = new QuizSession({
          userId: user._id,
          ...sampleQuizSession
        });
        await quizSession.save();
        logger.info('Created test quiz session');
      } else {
        // Update quiz session with sample data
        Object.assign(quizSession, {
          userId: user._id,
          ...sampleQuizSession
        });
        await quizSession.save();
        logger.info('Updated test quiz session');
      }

      // Generate recommendations
      logger.info('Generating recommendations...');
      const recommendations = await recommendationEngine.generateRecommendations(
        user._id,
        quizSession.sessionId,
        {
          preferences: {
            countries: ['ca', 'au', 'uk'],
            pathwayTypes: ['Skilled Worker', 'Provincial Nomination', 'Study'],
            timeframe: 'within-1-year',
            priorityFactors: ['processing_time', 'success_rate']
          },
          maxResults: 5,
          includeGapAnalysis: true,
          includeAlternativePrograms: true
        }
      );

      // Display recommendations
      logger.info(`Generated ${recommendations.recommendationResults.length} recommendations`);
      logger.info(`Processing time: ${recommendations.processingTime}ms`);

      console.log('\n=== RECOMMENDATION RESULTS ===\n');

      recommendations.recommendationResults.forEach((rec, index) => {
        console.log(`\n#${index + 1}: ${rec.programName} (${rec.countryId})`);
        console.log(`Match Score: ${rec.matchScore}%`);
        console.log(`Composite Score: ${rec.compositeScore}`);
        console.log(`Category: ${rec.category}`);
        console.log(`Processing Time: ${rec.processingTime?.min || 'N/A'}-${rec.processingTime?.max || 'N/A'} ${rec.processingTime?.unit || 'months'}`);

        if (rec.keyStrengths && rec.keyStrengths.length > 0) {
          console.log('\nKey Strengths:');
          rec.keyStrengths.forEach(strength => {
            console.log(`- ${strength.criterionName}: ${strength.description}`);
          });
        }

        if (rec.keyWeaknesses && rec.keyWeaknesses.length > 0) {
          console.log('\nKey Weaknesses:');
          rec.keyWeaknesses.forEach(weakness => {
            console.log(`- ${weakness.criterionName}: ${weakness.description}`);
          });
        }

        if (rec.gapAnalysis && rec.gapAnalysis.improvementPlan.length > 0) {
          console.log('\nImprovement Plan:');
          rec.gapAnalysis.improvementPlan.forEach(step => {
            console.log(`- ${step.area}: ${step.action} (${step.timeframe})`);
          });
        }

        console.log('\n---');
      });

      // Disconnect from MongoDB
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB');
      process.exit(0);
    } catch (error) {
      logger.error(`Error testing recommendation engine: ${error.message}`);
      await mongoose.disconnect();
      process.exit(1);
    }
  })
  .catch((error) => {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  });
