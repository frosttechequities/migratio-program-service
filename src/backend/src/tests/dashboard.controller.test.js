// Import the setup file to handle MongoDB connection
require('./setup');

const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { User } = require('../models/user.model');
const { Profile } = require('../models/profile.model');
const { Recommendation } = require('../models/recommendation.model');
const { Roadmap } = require('../models/roadmap.model');
const { Document } = require('../models/document.model');
const { Response } = require('../models/response.model');
const { QuizSession } = require('../models/quiz-session.model');
const config = require('../config');
const MockFactory = require('./utils/mock-factory');

describe('Dashboard Controller', () => {
  let authToken;
  let user;
  let profile;
  let recommendations;
  let roadmaps;
  let documents;
  let responses;
  let quizSession;
  
  beforeAll(async () => {
    // Create test user
    user = MockFactory.createUser({
      email: 'test-dashboard@example.com',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    });
    await User.create(user);
    
    // Create user profile
    profile = MockFactory.createProfile({
      userId: user._id,
      completionStatus: {
        personalInfo: 75,
        education: 50,
        workExperience: 25,
        languageProficiency: 100,
        financialInfo: 0,
        immigrationPreferences: 50,
        overall: 50
      }
    });
    await Profile.create(profile);
    
    // Create recommendations
    recommendations = [
      {
        userId: user._id,
        programId: new mongoose.Types.ObjectId(),
        programName: 'Express Entry',
        countryName: 'Canada',
        countryFlagUrl: 'https://example.com/flags/ca.png',
        matchPercentage: 85,
        keyPoints: [
          'Strong language skills',
          'Relevant work experience',
          'Education matches requirements'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: user._id,
        programId: new mongoose.Types.ObjectId(),
        programName: 'Skilled Worker Program',
        countryName: 'Australia',
        countryFlagUrl: 'https://example.com/flags/au.png',
        matchPercentage: 75,
        keyPoints: [
          'Education is a good match',
          'Age is within preferred range',
          'Language skills need improvement'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await Recommendation.insertMany(recommendations);
    
    // Create roadmaps
    roadmaps = [
      {
        userId: user._id,
        title: 'Canada Immigration Roadmap',
        description: 'Step-by-step guide for Express Entry',
        status: 'active',
        completionPercentage: 30,
        phases: [
          {
            title: 'Preparation Phase',
            description: 'Get your documents ready',
            status: 'in_progress',
            order: 1,
            milestones: [
              {
                title: 'Language Test',
                description: 'Take IELTS or CELPIP',
                status: 'completed',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                tasks: [
                  {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'Register for IELTS',
                    status: 'completed',
                    dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
                  },
                  {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'Study for IELTS',
                    status: 'completed',
                    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
                  }
                ],
                documents: [
                  {
                    documentId: new mongoose.Types.ObjectId(),
                    title: 'IELTS Results',
                    required: true,
                    status: 'uploaded'
                  }
                ]
              },
              {
                title: 'Education Assessment',
                description: 'Get your education credentials assessed',
                status: 'in_progress',
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                tasks: [
                  {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'Submit application to WES',
                    status: 'in_progress',
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
                  }
                ],
                documents: [
                  {
                    documentId: new mongoose.Types.ObjectId(),
                    title: 'Degree Certificate',
                    required: true,
                    status: 'pending'
                  },
                  {
                    documentId: new mongoose.Types.ObjectId(),
                    title: 'Transcripts',
                    required: true,
                    status: 'missing'
                  }
                ]
              }
            ]
          },
          {
            title: 'Application Phase',
            description: 'Submit your application',
            status: 'not_started',
            order: 2,
            milestones: [
              {
                title: 'Create Express Entry Profile',
                description: 'Create your profile in the Express Entry system',
                status: 'not_started',
                dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
                tasks: [
                  {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'Gather required information',
                    status: 'not_started',
                    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days from now
                  }
                ],
                documents: []
              }
            ]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await Roadmap.insertMany(roadmaps);
    
    // Create documents
    documents = [
      {
        userId: user._id,
        originalName: 'passport.pdf',
        documentType: 'Passport',
        category: 'Identity',
        status: 'verified',
        fileUrl: 'https://example.com/documents/passport.pdf',
        fileSize: 1024 * 1024, // 1MB
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: user._id,
        originalName: 'ielts_results.pdf',
        documentType: 'Language Test Results',
        category: 'Education',
        status: 'uploaded',
        fileUrl: 'https://example.com/documents/ielts_results.pdf',
        fileSize: 512 * 1024, // 512KB
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: user._id,
        originalName: 'degree.pdf',
        documentType: 'Degree Certificate',
        category: 'Education',
        status: 'pending',
        fileUrl: 'https://example.com/documents/degree.pdf',
        fileSize: 768 * 1024, // 768KB
        mimeType: 'application/pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await Document.insertMany(documents);
    
    // Create responses
    responses = Array.from({ length: 20 }, (_, i) => ({
      userId: user._id,
      sessionId: 'test-session-123',
      questionId: `question_${i + 1}`,
      questionText: `Test Question ${i + 1}`,
      questionType: 'single_choice',
      section: i < 10 ? 'personal' : 'education',
      responseValue: `answer_${i + 1}`,
      answeredAt: new Date()
    }));
    await Response.insertMany(responses);
    
    // Create quiz session
    quizSession = {
      userId: user._id,
      sessionId: 'test-session-123',
      status: 'in_progress',
      currentSection: 'education',
      currentQuestionId: 'education_1',
      startedAt: new Date(),
      lastActivityAt: new Date(),
      completedSections: ['personal'],
      progress: 40,
      responseCount: 20
    };
    await QuizSession.create(quizSession);
    
    // Generate auth token
    authToken = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
  });
  
  afterAll(async () => {
    // Clean up
    await User.deleteMany({ email: 'test-dashboard@example.com' });
    await Profile.deleteMany({ userId: user._id });
    await Recommendation.deleteMany({ userId: user._id });
    await Roadmap.deleteMany({ userId: user._id });
    await Document.deleteMany({ userId: user._id });
    await Response.deleteMany({ userId: user._id });
    await QuizSession.deleteMany({ userId: user._id });
  });
  
  describe('GET /api/dashboard', () => {
    it('should return dashboard data', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .send();
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Check overview data
      expect(response.body.data.overview).toBeDefined();
      expect(response.body.data.overview.profileCompletion).toBe(50);
      expect(response.body.data.overview.assessmentCompletion).toBe(40);
      expect(response.body.data.overview.roadmapProgress).toBe(30);
      expect(response.body.data.overview.documentsUploaded).toBe(3);
      expect(response.body.data.overview.documentsRequired).toBe(3);
      expect(response.body.data.overview.daysActive).toBe(30);
      
      // Check recommendations
      expect(response.body.data.recommendations).toBeDefined();
      expect(response.body.data.recommendations.length).toBe(2);
      expect(response.body.data.recommendations[0].programName).toBe('Express Entry');
      expect(response.body.data.recommendations[0].matchPercentage).toBe(85);
      
      // Check roadmaps
      expect(response.body.data.roadmaps).toBeDefined();
      expect(response.body.data.roadmaps.length).toBe(1);
      expect(response.body.data.roadmaps[0].title).toBe('Canada Immigration Roadmap');
      expect(response.body.data.roadmaps[0].completionPercentage).toBe(30);
      
      // Check documents
      expect(response.body.data.documents).toBeDefined();
      expect(response.body.data.documents.length).toBe(3);
      
      // Check tasks
      expect(response.body.data.tasks).toBeDefined();
      expect(response.body.data.tasks.length).toBeGreaterThan(0);
    });
    
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .send();
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/dashboard/overview', () => {
    it('should return dashboard overview data', async () => {
      const response = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${authToken}`)
        .send();
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.profileCompletion).toBe(50);
      expect(response.body.data.assessmentCompletion).toBe(40);
      expect(response.body.data.roadmapProgress).toBe(30);
      expect(response.body.data.documentsUploaded).toBe(3);
      expect(response.body.data.documentsRequired).toBe(3);
      expect(response.body.data.daysActive).toBe(30);
    });
    
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/dashboard/overview')
        .send();
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('PUT /api/dashboard/preferences', () => {
    it('should update dashboard preferences', async () => {
      const preferences = {
        layout: 'compact',
        visibleWidgets: ['overview', 'roadmap', 'document'],
        widgetOrder: ['overview', 'document', 'roadmap']
      };
      
      const response = await request(app)
        .put('/api/dashboard/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preferences);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.layout).toBe('compact');
      expect(response.body.data.visibleWidgets).toEqual(['overview', 'roadmap', 'document']);
      expect(response.body.data.widgetOrder).toEqual(['overview', 'document', 'roadmap']);
    });
    
    it('should return 400 if validation fails', async () => {
      const preferences = {
        layout: 123, // Should be a string
        visibleWidgets: 'invalid' // Should be an array
      };
      
      const response = await request(app)
        .put('/api/dashboard/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preferences);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
    
    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .put('/api/dashboard/preferences')
        .send({});
      
      expect(response.status).toBe(401);
    });
  });
});
