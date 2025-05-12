const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const RoadmapService = require('../services/roadmap.service');
const { Roadmap } = require('../models/roadmap.model');
const { Recommendation } = require('../models/recommendation.model');
const { Program } = require('../models/program.model');

let mongoServer;
const roadmapService = new RoadmapService();

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

// Connect to the in-memory database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Clear all test data after each test
afterEach(async () => {
  await Roadmap.deleteMany({});
  await Recommendation.deleteMany({});
  await Program.deleteMany({});
});

// Disconnect and close the db connection
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('RoadmapService', () => {
  describe('generateRoadmap', () => {
    it('should generate a roadmap based on a recommendation', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate roadmap
      const roadmap = await roadmapService.generateRoadmap(mockUserId.toString(), mockRecommendationId.toString());

      // Assertions
      expect(roadmap).toBeDefined();
      expect(roadmap.userId.toString()).toBe(mockUserId.toString());
      expect(roadmap.programId).toBe(mockProgramId);
      expect(roadmap.recommendationId.toString()).toBe(mockRecommendationId.toString());
      expect(roadmap.title).toContain('Express Entry');
      expect(roadmap.status).toBe('draft');
      expect(roadmap.phases).toHaveLength(4); // Default phases
      expect(roadmap.completionPercentage).toBe(0);
      expect(roadmap.estimatedCost.total).toBe(2000);
      expect(roadmap.estimatedCost.currency).toBe('CAD');
    });

    it('should throw an error if recommendation not found', async () => {
      await expect(
        roadmapService.generateRoadmap(mockUserId.toString(), mockRecommendationId.toString())
      ).rejects.toThrow('Recommendation not found');
    });

    it('should throw an error if program not found', async () => {
      // Create mock recommendation but no program
      await Recommendation.create(mockRecommendation);

      await expect(
        roadmapService.generateRoadmap(mockUserId.toString(), mockRecommendationId.toString())
      ).rejects.toThrow('Program not found');
    });

    it('should generate a roadmap with custom options', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      const customOptions = {
        title: 'My Custom Roadmap',
        description: 'Custom description',
        startDate: new Date('2023-01-01'),
        visibility: 'private'
      };

      // Generate roadmap with custom options
      const roadmap = await roadmapService.generateRoadmap(
        mockUserId.toString(),
        mockRecommendationId.toString(),
        customOptions
      );

      // Assertions
      expect(roadmap).toBeDefined();
      expect(roadmap.title).toBe('My Custom Roadmap');
      expect(roadmap.description).toBe('Custom description');
      expect(roadmap.startDate.toISOString().split('T')[0]).toBe('2023-01-01');
      expect(roadmap.visibility).toBe('private');
    });
  });

  describe('getRoadmaps', () => {
    it('should get roadmaps for a user', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      await roadmapService.generateRoadmap(mockUserId.toString(), mockRecommendationId.toString());

      // Get roadmaps
      const roadmaps = await roadmapService.getRoadmaps(mockUserId.toString());

      // Assertions
      expect(roadmaps).toBeDefined();
      expect(roadmaps).toHaveLength(1);
      expect(roadmaps[0].userId.toString()).toBe(mockUserId.toString());
      expect(roadmaps[0].programId).toBe(mockProgramId);
    });

    it('should return empty array if no roadmaps found', async () => {
      // Get roadmaps for a user with no roadmaps
      const roadmaps = await roadmapService.getRoadmaps(mockUserId.toString());

      // Assertions
      expect(roadmaps).toBeDefined();
      expect(roadmaps).toHaveLength(0);
    });

    it('should filter roadmaps by status', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      const roadmap = await roadmapService.generateRoadmap(mockUserId.toString(), mockRecommendationId.toString());

      // Update roadmap status to active
      roadmap.status = 'active';
      await roadmap.save();

      // Get roadmaps with status filter
      const roadmaps = await roadmapService.getRoadmaps(mockUserId.toString(), { status: 'active' });

      // Assertions
      expect(roadmaps).toBeDefined();
      expect(roadmaps).toHaveLength(1);
      expect(roadmaps[0].status).toBe('active');

      // Get roadmaps with different status filter
      const noRoadmaps = await roadmapService.getRoadmaps(mockUserId.toString(), { status: 'completed' });

      // Assertions
      expect(noRoadmaps).toBeDefined();
      expect(noRoadmaps).toHaveLength(0);
    });
  });

  describe('getRoadmap', () => {
    it('should get a roadmap by ID', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      const createdRoadmap = await roadmapService.generateRoadmap(mockUserId.toString(), mockRecommendationId.toString());

      // Get roadmap by ID
      const roadmap = await roadmapService.getRoadmap(createdRoadmap._id.toString(), mockUserId.toString());

      // Assertions
      expect(roadmap).toBeDefined();
      expect(roadmap._id.toString()).toBe(createdRoadmap._id.toString());
      expect(roadmap.userId.toString()).toBe(mockUserId.toString());
      expect(roadmap.programId).toBe(mockProgramId);
    });

    it('should throw an error if roadmap not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(
        roadmapService.getRoadmap(nonExistentId.toString(), mockUserId.toString())
      ).rejects.toThrow('Roadmap not found or access denied');
    });

    it('should throw an error if user does not have access', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      const createdRoadmap = await roadmapService.generateRoadmap(mockUserId.toString(), mockRecommendationId.toString());

      // Try to get roadmap with different user ID
      const differentUserId = new mongoose.Types.ObjectId();

      await expect(
        roadmapService.getRoadmap(createdRoadmap._id.toString(), differentUserId.toString())
      ).rejects.toThrow('Roadmap not found or access denied');
    });

    it('should allow access to shared roadmaps', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      const createdRoadmap = await roadmapService.generateRoadmap(mockUserId.toString(), mockRecommendationId.toString());

      // Add shared user
      const sharedUserId = new mongoose.Types.ObjectId();
      createdRoadmap.sharedWith = [{ userId: sharedUserId, role: 'viewer' }];
      await createdRoadmap.save();

      // Get roadmap with shared user ID
      const roadmap = await roadmapService.getRoadmap(createdRoadmap._id.toString(), sharedUserId.toString());

      // Assertions
      expect(roadmap).toBeDefined();
      expect(roadmap._id.toString()).toBe(createdRoadmap._id.toString());
    });

    it('should allow access to public roadmaps', async () => {
      // Create mock recommendation and program in the database
      await Recommendation.create(mockRecommendation);
      await Program.create(mockProgram);

      // Generate a roadmap
      const createdRoadmap = await roadmapService.generateRoadmap(mockUserId.toString(), mockRecommendationId.toString());

      // Make roadmap public
      createdRoadmap.visibility = 'public';
      await createdRoadmap.save();

      // Get roadmap with different user ID
      const differentUserId = new mongoose.Types.ObjectId();
      const roadmap = await roadmapService.getRoadmap(createdRoadmap._id.toString(), differentUserId.toString());

      // Assertions
      expect(roadmap).toBeDefined();
      expect(roadmap._id.toString()).toBe(createdRoadmap._id.toString());
    });
  });
});
