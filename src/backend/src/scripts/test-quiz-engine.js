/**
 * Test script for the Quiz Engine Service
 * 
 * This script tests the functionality of the quiz engine service by:
 * 1. Creating a new quiz session
 * 2. Submitting answers to questions
 * 3. Getting the results summary
 * 
 * Usage: node test-quiz-engine.js
 */

const mongoose = require('mongoose');
const QuizEngineService = require('../services/quiz-engine.service');
const { User } = require('../models/user.model');
require('dotenv').config();

// Create a test user ID (this would normally be a MongoDB ObjectId)
const testUserId = new mongoose.Types.ObjectId();

// Initialize quiz engine service
const quizEngineService = new QuizEngineService();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Create a test user if it doesn't exist
      let testUser = await User.findById(testUserId);
      
      if (!testUser) {
        testUser = await User.create({
          _id: testUserId,
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
        console.log('Created test user:', testUser._id);
      }
      
      // Step 1: Create a new quiz session
      console.log('\n--- Step 1: Creating a new quiz session ---');
      const sessionResult = await quizEngineService.createSession(testUser._id);
      console.log('Session created:', sessionResult.session._id);
      console.log('Initial question:', sessionResult.initialQuestion.questionId);
      
      // Store session and current question
      let session = sessionResult.session;
      let currentQuestion = sessionResult.initialQuestion;
      
      // Step 2: Submit answers to questions
      console.log('\n--- Step 2: Submitting answers to questions ---');
      
      // Answer the first question (personal_001 - country of residence)
      console.log(`\nAnswering question: ${currentQuestion.questionId} - ${currentQuestion.text}`);
      let answerResult = await quizEngineService.submitAnswer(
        session._id,
        currentQuestion.questionId,
        'us' // United States
      );
      
      console.log('Answer submitted. Next question:', answerResult.nextQuestion?.questionId);
      currentQuestion = answerResult.nextQuestion;
      
      // Answer the second question (personal_002 - citizenship)
      if (currentQuestion) {
        console.log(`\nAnswering question: ${currentQuestion.questionId} - ${currentQuestion.text}`);
        answerResult = await quizEngineService.submitAnswer(
          session._id,
          currentQuestion.questionId,
          ['us'] // United States citizenship
        );
        
        console.log('Answer submitted. Next question:', answerResult.nextQuestion?.questionId);
        currentQuestion = answerResult.nextQuestion;
      }
      
      // Answer the third question (personal_003 - date of birth)
      if (currentQuestion) {
        console.log(`\nAnswering question: ${currentQuestion.questionId} - ${currentQuestion.text}`);
        answerResult = await quizEngineService.submitAnswer(
          session._id,
          currentQuestion.questionId,
          '1990-01-01' // Date of birth
        );
        
        console.log('Answer submitted. Next question:', answerResult.nextQuestion?.questionId);
        currentQuestion = answerResult.nextQuestion;
      }
      
      // Answer a few more questions
      const sampleAnswers = {
        'personal_004': 'single', // Marital status
        'personal_005': 'no', // Dependent children
        'personal_008': 'no', // Visa refusals
        'personal_010': 'no', // Criminal convictions
        'personal_012': 'no', // Medical conditions
        'personal_014': ['ca', 'au'], // Destination countries
        'personal_015': 'work' // Primary motivation
      };
      
      // Submit sample answers
      for (const [questionId, answer] of Object.entries(sampleAnswers)) {
        if (currentQuestion && currentQuestion.questionId === questionId) {
          console.log(`\nAnswering question: ${currentQuestion.questionId} - ${currentQuestion.text}`);
          answerResult = await quizEngineService.submitAnswer(
            session._id,
            currentQuestion.questionId,
            answer
          );
          
          console.log('Answer submitted. Next question:', answerResult.nextQuestion?.questionId);
          currentQuestion = answerResult.nextQuestion;
        }
      }
      
      // Get updated session
      session = await quizEngineService.getSession(session._id);
      console.log('\nCurrent session status:', session.status);
      console.log('Current section:', session.currentSection);
      console.log('Progress:', session.progress);
      
      // Get session responses
      const responses = await quizEngineService.getSessionResponses(session._id);
      console.log(`\nTotal responses: ${responses.length}`);
      
      // If the session is completed, get results summary
      if (session.status === 'completed') {
        console.log('\n--- Step 3: Getting results summary ---');
        const resultsSummary = await quizEngineService.getResultsSummary(session._id);
        console.log('Results summary:', JSON.stringify(resultsSummary, null, 2));
      } else {
        console.log('\nSession is not completed yet. Continue answering questions to get results.');
      }
      
      // Disconnect from MongoDB
      await mongoose.disconnect();
      console.log('\nDisconnected from MongoDB');
    } catch (error) {
      console.error('Error testing quiz engine:', error);
      await mongoose.disconnect();
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
