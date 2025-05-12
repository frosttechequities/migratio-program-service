const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const bodyParser = require('body-parser');
const roadmapRoutes = require('../routes/roadmap.routes');
const { Roadmap } = require('../models/roadmap.model');
const { Recommendation } = require('../models/recommendation.model');
const { Program } = require('../models/program.model');
const { User } = require('../models/user.model');

let mongoServer;
let app;
let authToken;
let mockUser;

// Mock authentication middleware
jest.mock('../middleware/auth', () => ({
  authenticate: (req, res, next) => {
    if (req.headers.authorization) {
      req.user = { _id: req.headers.authorization };
      next();
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  }
}));

// Mock data
const mockUserId = new mongoose.Types.ObjectId();
const mockRecommendationId = new mongoose.Types.ObjectId();
const mockProgramId = 'ca-express-entry';

// Mock recommendation
const mockRecommendation = {
  _id: mockRecommendationId,
  userId: mockUserId,
  status: 'completed',
  topPrograms: [
    {
      programId: mockProgramId,
      matchScore: 85,
      gapAnalysis: []
    }
  ]
};

// Mock program
const mockProgram = {
  programId: mockProgramId,
  name: 'Express Entry',
  country: 'ca',
  category: 'skilled-worker',
  processingTime: {
    min: 3,
    max: 6,
    unit: 'months'
  },
  estimatedCost: {
    total: 2000,
    currency: 'CAD',
    breakdown: [
      {
        category: 'Application Fee',
        amount: 1500,
        description: 'Government application fee'
      },
      {
        category: 'Biometrics',
        amount: 500,
        description: 'Biometrics fee'
      }
    ]
  }
};

// Mock user
const mockUserData = {
  _id: mockUserId,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'hashedpassword'
};

// Setup express app
beforeAll(async () => {
  // Setup MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Create express app
  app = express();
  app.use(bodyParser.json());
  app.use('/api/roadmaps', roadmapRoutes);

  // Create mock user
  mockUser = await User.create(mockUserData);
  authToken = mockUser._id.toString();
});

// Clear all test data after each test
afterEach(async () => {
  await Roadmap.deleteMany({});
  await Recommendation.deleteMany({});
  await Program.deleteMany({});
});

// Disconnect and close the db connection
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Roadmap Routes', () => {
  describe('POST /api/roadmaps', () => {
    it('should generate a roadmap', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate roadmap
      const response = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', authToken)
        .send({
          recommendationId: mockRecommendationId.toString(),
          title: 'Test Roadmap',
          description: 'Test description',
          startDate: new Date().toISOString(),
          visibility: 'private'
        });

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Roadmap generated successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId.toString()).toBe(mockUserId.toString());
      expect(response.body.data.programId).toBe(mockProgramId);
      expect(response.body.data.title).toBe('Test Roadmap');
      expect(response.body.data.description).toBe('Test description');
      expect(response.body.data.visibility).toBe('private');
    });

    it('should return 400 if recommendation ID is missing', async () => {
      const response = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', authToken)
        .send({
          title: 'Test Roadmap'
        });

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Recommendation ID is required');
    });

    it('should return 500 if recommendation not found', async () => {
      const response = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', authToken)
        .send({
          recommendationId: mockRecommendationId.toString(),
          title: 'Test Roadmap'
        });

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to generate roadmap');
      expect(response.body.error).toBe('Recommendation not found');
    });
  });

  describe('GET /api/roadmaps', () => {
    it('should get roadmaps for the authenticated user', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      await request(app)
        .post('/api/roadmaps')
        .set('Authorization', authToken)
        .send({
          recommendationId: mockRecommendationId.toString(),
          title: 'Test Roadmap'
        });

      // Get roadmaps
      const response = await request(app)
        .get('/api/roadmaps')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Roadmaps retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].userId.toString()).toBe(mockUserId.toString());
      expect(response.body.data[0].title).toBe('Test Roadmap');
    });

    it('should return empty array if no roadmaps found', async () => {
      const response = await request(app)
        .get('/api/roadmaps')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Roadmaps retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveLength(0);
    });

    it('should filter roadmaps by status', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      const createResponse = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', authToken)
        .send({
          recommendationId: mockRecommendationId.toString(),
          title: 'Test Roadmap'
        });

      const roadmapId = createResponse.body.data._id;

      // Update roadmap status to active
      await request(app)
        .put(`/api/roadmaps/${roadmapId}`)
        .set('Authorization', authToken)
        .send({
          status: 'active'
        });

      // Get roadmaps with status filter
      const response = await request(app)
        .get('/api/roadmaps?status=active')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('active');

      // Get roadmaps with different status filter
      const noRoadmapsResponse = await request(app)
        .get('/api/roadmaps?status=completed')
        .set('Authorization', authToken);

      // Assertions
      expect(noRoadmapsResponse.status).toBe(200);
      expect(noRoadmapsResponse.body.success).toBe(true);
      expect(noRoadmapsResponse.body.data).toBeDefined();
      expect(noRoadmapsResponse.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/roadmaps/:roadmapId', () => {
    it('should get a roadmap by ID', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      const createResponse = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', authToken)
        .send({
          recommendationId: mockRecommendationId.toString(),
          title: 'Test Roadmap'
        });

      const roadmapId = createResponse.body.data._id;

      // Get roadmap by ID
      const response = await request(app)
        .get(`/api/roadmaps/${roadmapId}`)
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Roadmap retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data._id).toBe(roadmapId);
      expect(response.body.data.userId.toString()).toBe(mockUserId.toString());
      expect(response.body.data.title).toBe('Test Roadmap');
    });

    it('should return 400 if roadmap ID is missing', async () => {
      const response = await request(app)
        .get('/api/roadmaps/undefined')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Roadmap ID is required');
    });

    it('should return 500 if roadmap not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/roadmaps/${nonExistentId}`)
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to retrieve roadmap');
      expect(response.body.error).toBe('Roadmap not found or access denied');
    });
  });

  describe('PUT /api/roadmaps/:roadmapId', () => {
    it('should update a roadmap', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      const createResponse = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', authToken)
        .send({
          recommendationId: mockRecommendationId.toString(),
          title: 'Original Title'
        });

      const roadmapId = createResponse.body.data._id;

      // Update roadmap
      const response = await request(app)
        .put(`/api/roadmaps/${roadmapId}`)
        .set('Authorization', authToken)
        .send({
          title: 'Updated Title',
          description: 'Updated description',
          status: 'active'
        });

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Roadmap updated successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data._id).toBe(roadmapId);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.description).toBe('Updated description');
      expect(response.body.data.status).toBe('active');
    });

    it('should return 400 if roadmap ID is missing', async () => {
      const response = await request(app)
        .put('/api/roadmaps/undefined')
        .set('Authorization', authToken)
        .send({
          title: 'Updated Title'
        });

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Roadmap ID is required');
    });

    it('should return 500 if roadmap not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/roadmaps/${nonExistentId}`)
        .set('Authorization', authToken)
        .send({
          title: 'Updated Title'
        });

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to update roadmap');
      expect(response.body.error).toBe('Roadmap not found or access denied');
    });
  });

  describe('DELETE /api/roadmaps/:roadmapId', () => {
    it('should delete a roadmap', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      const createResponse = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', authToken)
        .send({
          recommendationId: mockRecommendationId.toString(),
          title: 'Test Roadmap'
        });

      const roadmapId = createResponse.body.data._id;

      // Delete roadmap
      const response = await request(app)
        .delete(`/api/roadmaps/${roadmapId}`)
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Roadmap deleted successfully');

      // Verify roadmap is deleted
      const getRoadmapsResponse = await request(app)
        .get('/api/roadmaps')
        .set('Authorization', authToken);

      expect(getRoadmapsResponse.body.data).toHaveLength(0);
    });

    it('should return 400 if roadmap ID is missing', async () => {
      const response = await request(app)
        .delete('/api/roadmaps/undefined')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Roadmap ID is required');
    });

    it('should return 500 if roadmap not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/roadmaps/${nonExistentId}`)
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to delete roadmap');
      expect(response.body.error).toBe('Roadmap not found or access denied');
    });
  });

  describe('GET /api/roadmaps/templates', () => {
    it('should get templates', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create a template
      const createResponse = await request(app)
        .post('/api/roadmaps/templates')
        .set('Authorization', authToken)
        .send({
          programId: mockProgramId,
          templateName: 'Test Template',
          templateCategory: 'skilled-worker',
          isPublic: true
        });

      // Get templates
      const response = await request(app)
        .get('/api/roadmaps/templates')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Templates retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].templateName).toBe('Test Template');
      expect(response.body.data[0].isTemplate).toBe(true);
    });

    it('should filter templates by category', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create templates
      await request(app)
        .post('/api/roadmaps/templates')
        .set('Authorization', authToken)
        .send({
          programId: mockProgramId,
          templateName: 'Template 1',
          templateCategory: 'skilled-worker',
          isPublic: true
        });

      await request(app)
        .post('/api/roadmaps/templates')
        .set('Authorization', authToken)
        .send({
          programId: mockProgramId,
          templateName: 'Template 2',
          templateCategory: 'family',
          isPublic: true
        });

      // Get templates filtered by category
      const response = await request(app)
        .get('/api/roadmaps/templates?category=skilled-worker')
        .set('Authorization', authToken);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].templateName).toBe('Template 1');
      expect(response.body.data[0].templateCategory).toBe('skilled-worker');
    });
  });

  describe('POST /api/roadmaps/templates/:templateId/create', () => {
    it('should create a roadmap from a template', async () => {
      // Create mock program in the database
      await Program.create(mockProgram);

      // Create a template
      const createTemplateResponse = await request(app)
        .post('/api/roadmaps/templates')
        .set('Authorization', authToken)
        .send({
          programId: mockProgramId,
          templateName: 'Test Template',
          templateCategory: 'skilled-worker',
          isPublic: true
        });

      const templateId = createTemplateResponse.body.data._id;

      // Create roadmap from template
      const response = await request(app)
        .post(`/api/roadmaps/templates/${templateId}/create`)
        .set('Authorization', authToken)
        .send({
          title: 'My Roadmap',
          description: 'My roadmap description',
          startDate: new Date('2023-01-01').toISOString(),
          visibility: 'private'
        });

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Roadmap created from template successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId.toString()).toBe(mockUserId.toString());
      expect(response.body.data.programId).toBe(mockProgramId);
      expect(response.body.data.isTemplate).toBe(false);
      expect(response.body.data.templateId.toString()).toBe(templateId);
      expect(response.body.data.title).toBe('My Roadmap');
      expect(response.body.data.description).toBe('My roadmap description');
      expect(response.body.data.startDate.split('T')[0]).toBe('2023-01-01');
      expect(response.body.data.visibility).toBe('private');
    });

    it('should return 400 if template ID is missing', async () => {
      const response = await request(app)
        .post('/api/roadmaps/templates/undefined/create')
        .set('Authorization', authToken)
        .send({
          title: 'My Roadmap'
        });

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Template ID is required');
    });

    it('should return 500 if template not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post(`/api/roadmaps/templates/${nonExistentId}/create`)
        .set('Authorization', authToken)
        .send({
          title: 'My Roadmap'
        });

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to create roadmap from template');
      expect(response.body.error).toBe('Template not found or access denied');
    });
  });
});
