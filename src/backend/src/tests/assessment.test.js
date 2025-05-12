/**
 * Assessment API Tests
 * 
 * Tests for the assessment quiz API endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const { User } = require('../models/user.model');
const { Question } = require('../models/question.model');
const { QuizSession } = require('../models/quiz-session.model');
const { QuizResponse } = require('../models/quiz-response.model');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let token;
let userId;
let sessionId;

// Sample questions for testing
const testQuestions = [
  {
    questionId: 'test_001',
    text: 'Test Question 1',
    helpText: 'This is a test question',
    section: 'personal',
    type: 'single_choice',
    required: true,
    order: 1,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ],
    relevanceScore: 10,
    isActive: true
  },
  {
    questionId: 'test_002',
    text: 'Test Question 2',
    helpText: 'This is another test question',
    section: 'personal',
    type: 'text',
    required: true,
    order: 2,
    relevanceScore: 8,
    isActive: true
  },
  {
    questionId: 'test_003',
    text: 'Test Question 3',
    helpText: 'This is a third test question',
    section: 'education',
    type: 'single_choice',
    required: false,
    order: 1,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ],
    relevanceScore: 7,
    isActive: true
  }
];

// Setup before tests
beforeAll(async () => {
  // Create in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  // Create test user
  const testUser = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });
  
  userId = testUser._id;
  
  // Login to get token
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });
  
  token = loginResponse.body.token;
  
  // Insert test questions
  await Question.insertMany(testQuestions);
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear test data between tests
afterEach(async () => {
  await QuizSession.deleteMany({});
  await QuizResponse.deleteMany({});
});

describe('Assessment API', () => {
  describe('POST /api/assessment/start', () => {
    it('should create a new assessment session', async () => {
      const response = await request(app)
        .post('/api/assessment/start')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('session');
      expect(response.body.data).toHaveProperty('initialQuestion');
      expect(response.body.data.session.status).toBe('in_progress');
      
      // Save session ID for later tests
      sessionId = response.body.data.session.id;
    });
    
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/assessment/start')
        .send({});
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('POST /api/assessment/submit', () => {
    beforeEach(async () => {
      // Create a session for testing
      const session = await QuizSession.create({
        userId,
        status: 'in_progress',
        startedAt: new Date(),
        currentSection: 'personal',
        progress: {
          personal: 0,
          education: 0,
          work: 0,
          language: 0,
          financial: 0,
          immigration: 0,
          preferences: 0
        }
      });
      
      sessionId = session._id;
    });
    
    it('should submit an answer and return the next question', async () => {
      const response = await request(app)
        .post('/api/assessment/submit')
        .set('Authorization', `Bearer ${token}`)
        .send({
          sessionId,
          questionId: 'test_001',
          answer: 'option1'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('response');
      expect(response.body.data).toHaveProperty('nextQuestion');
      expect(response.body.data.nextQuestion.questionId).toBe('test_002');
    });
    
    it('should return 400 if sessionId or questionId is missing', async () => {
      const response = await request(app)
        .post('/api/assessment/submit')
        .set('Authorization', `Bearer ${token}`)
        .send({
          sessionId
          // Missing questionId
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 403 if session does not belong to user', async () => {
      // Create another user
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123'
      });
      
      // Create a session for the other user
      const otherSession = await QuizSession.create({
        userId: anotherUser._id,
        status: 'in_progress',
        startedAt: new Date(),
        currentSection: 'personal'
      });
      
      const response = await request(app)
        .post('/api/assessment/submit')
        .set('Authorization', `Bearer ${token}`)
        .send({
          sessionId: otherSession._id,
          questionId: 'test_001',
          answer: 'option1'
        });
      
      expect(response.status).toBe(403);
    });
  });
  
  describe('GET /api/assessment/:sessionId/results', () => {
    beforeEach(async () => {
      // Create a completed session for testing
      const session = await QuizSession.create({
        userId,
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        currentSection: 'preferences',
        progress: {
          personal: 100,
          education: 100,
          work: 100,
          language: 100,
          financial: 100,
          immigration: 100,
          preferences: 100
        }
      });
      
      sessionId = session._id;
      
      // Add some responses
      await QuizResponse.create({
        sessionId,
        questionId: 'test_001',
        answer: 'option1',
        answeredAt: new Date()
      });
      
      await QuizResponse.create({
        sessionId,
        questionId: 'test_002',
        answer: 'Test answer',
        answeredAt: new Date()
      });
    });
    
    it('should return assessment results', async () => {
      const response = await request(app)
        .get(`/api/assessment/${sessionId}/results`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('sessionId');
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('completedAt');
    });
    
    it('should return 403 if session does not belong to user', async () => {
      // Create another user
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another2@example.com',
        password: 'password123'
      });
      
      // Create a session for the other user
      const otherSession = await QuizSession.create({
        userId: anotherUser._id,
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        currentSection: 'preferences'
      });
      
      const response = await request(app)
        .get(`/api/assessment/${otherSession._id}/results`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(403);
    });
    
    it('should return 400 if session is not completed', async () => {
      // Create an in-progress session
      const inProgressSession = await QuizSession.create({
        userId,
        status: 'in_progress',
        startedAt: new Date(),
        currentSection: 'personal'
      });
      
      const response = await request(app)
        .get(`/api/assessment/${inProgressSession._id}/results`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('GET /api/assessment/sessions', () => {
    beforeEach(async () => {
      // Create multiple sessions for the user
      await QuizSession.create({
        userId,
        status: 'in_progress',
        startedAt: new Date(),
        currentSection: 'personal'
      });
      
      await QuizSession.create({
        userId,
        status: 'completed',
        startedAt: new Date(Date.now() - 86400000), // 1 day ago
        completedAt: new Date(),
        currentSection: 'preferences'
      });
    });
    
    it('should return all sessions for the user', async () => {
      const response = await request(app)
        .get('/api/assessment/sessions')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('status');
    });
    
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/assessment/sessions');
      
      expect(response.status).toBe(401);
    });
  });
});
