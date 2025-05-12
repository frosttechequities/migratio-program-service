// Import the setup file to handle MongoDB connection
require('./setup');

const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { User } = require('../models/user.model');
const { QuizSession } = require('../models/quiz-session.model');
const { Question } = require('../models/question.model');
const { Response } = require('../models/response.model');
const { Profile } = require('../models/profile.model');
const config = require('../config');

// Mock data
const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  email: 'test-quiz@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  role: 'user'
};

// Mock questions
const mockQuestions = [
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
];

describe('Assessment Controller', () => {
  let authToken;
  
  beforeAll(async () => {
    // Create test user
    await User.create(mockUser);
    
    // Create user profile
    await Profile.create({
      userId: mockUser._id,
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
      }
    });
    
    // Create test questions
    await Question.insertMany(mockQuestions);
    
    // Generate auth token
    authToken = jwt.sign(
      { userId: mockUser._id, email: mockUser.email },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
  });
  
  afterAll(async () => {
    // Clean up
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Question.deleteMany({});
    await QuizSession.deleteMany({});
    await Response.deleteMany({});
  });
  
  describe('POST /api/assessment/initialize', () => {
    it('should initialize a new quiz session', async () => {
      const response = await request(app)
        .post('/api/assessment/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sessionId');
      expect(response.body).toHaveProperty('initialQuestion');
      expect(response.body.initialQuestion.questionId).toBe('personal_dob');
    });
    
    it('should return existing session if one exists', async () => {
      // First request to create a session
      const firstResponse = await request(app)
        .post('/api/assessment/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      // Second request should return the same session
      const secondResponse = await request(app)
        .post('/api/assessment/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body.sessionId).toBe(firstResponse.body.sessionId);
    });
    
    it('should handle custom options', async () => {
      // First, complete the existing session to allow creating a new one
      const existingSession = await QuizSession.findOne({ userId: mockUser._id });
      existingSession.status = 'completed';
      await existingSession.save();
      
      const response = await request(app)
        .post('/api/assessment/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          isAnonymous: true,
          startSection: 'personal',
          language: 'fr'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.session.isAnonymous).toBe(true);
      expect(response.body.session.language).toBe('fr');
    });
  });
  
  describe('POST /api/assessment/answer', () => {
    let sessionId;
    
    beforeEach(async () => {
      // Complete any existing sessions
      await QuizSession.updateMany(
        { userId: mockUser._id, status: 'in_progress' },
        { $set: { status: 'completed' } }
      );
      
      // Create a new session
      const response = await request(app)
        .post('/api/assessment/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      sessionId = response.body.sessionId;
    });
    
    it('should process an answer and return the next question', async () => {
      const response = await request(app)
        .post('/api/assessment/answer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          questionId: 'personal_dob',
          answer: '1990-01-01'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nextQuestion');
      expect(response.body.nextQuestion.questionId).toBe('personal_gender');
      expect(response.body.progress).toBeGreaterThan(0);
    });
    
    it('should return 404 if session not found', async () => {
      const response = await request(app)
        .post('/api/assessment/answer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId: 'non-existent-session',
          questionId: 'personal_dob',
          answer: '1990-01-01'
        });
      
      expect(response.status).toBe(404);
    });
    
    it('should return 404 if question not found', async () => {
      const response = await request(app)
        .post('/api/assessment/answer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          questionId: 'non-existent-question',
          answer: '1990-01-01'
        });
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('GET /api/assessment/resume', () => {
    let sessionId;
    
    beforeEach(async () => {
      // Complete any existing sessions
      await QuizSession.updateMany(
        { userId: mockUser._id, status: 'in_progress' },
        { $set: { status: 'completed' } }
      );
      
      // Create a new session
      const response = await request(app)
        .post('/api/assessment/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      sessionId = response.body.sessionId;
      
      // Submit an answer
      await request(app)
        .post('/api/assessment/answer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          questionId: 'personal_dob',
          answer: '1990-01-01'
        });
    });
    
    it('should resume an existing session', async () => {
      const response = await request(app)
        .get('/api/assessment/resume')
        .set('Authorization', `Bearer ${authToken}`)
        .send();
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('session');
      expect(response.body).toHaveProperty('currentQuestion');
      expect(response.body).toHaveProperty('responses');
      expect(response.body.session.sessionId).toBe(sessionId);
      expect(response.body.currentQuestion.questionId).toBe('personal_gender');
      expect(response.body.responses).toHaveProperty('personal_dob');
    });
    
    it('should return 404 if no active session exists', async () => {
      // Complete the session
      await QuizSession.updateMany(
        { userId: mockUser._id, status: 'in_progress' },
        { $set: { status: 'completed' } }
      );
      
      const response = await request(app)
        .get('/api/assessment/resume')
        .set('Authorization', `Bearer ${authToken}`)
        .send();
      
      expect(response.status).toBe(404);
    });
  });
});
