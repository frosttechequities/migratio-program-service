require('dotenv').config();
const mongoose = require('mongoose');
const RoadmapService = require('../services/roadmap.service');
const RoadmapTemplateService = require('../services/roadmap-template.service');
const { Roadmap } = require('../models/roadmap.model');
const { Recommendation } = require('../models/recommendation.model');
const { Program } = require('../models/program.model');
const { User } = require('../models/user.model');
const { logger } = require('../utils/logger');

// Initialize services
const roadmapService = new RoadmapService();
const roadmapTemplateService = new RoadmapTemplateService();

// Test data
const testUserId = '60d0fe4f5311236168a109ca'; // Example MongoDB ObjectId
const testRecommendationId = '60d0fe4f5311236168a109cb'; // Example MongoDB ObjectId
const testProgramId = 'ca-express-entry';

// Mock program data
const mockProgram = {
  programId: testProgramId,
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

// Mock recommendation data
const mockRecommendation = {
  _id: testRecommendationId,
  userId: testUserId,
  status: 'completed',
  topPrograms: [
    {
      programId: testProgramId,
      matchScore: 85,
      gapAnalysis: []
    }
  ]
};

// Mock user data
const mockUser = {
  _id: testUserId,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'hashedpassword'
};

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

// Setup test data
async function setupTestData() {
  try {
    // Clear existing data
    await Roadmap.deleteMany({});
    await Recommendation.deleteMany({});
    await Program.deleteMany({});
    await User.deleteMany({ email: mockUser.email });

    // Create test user
    await User.create(mockUser);
    logger.info('Created test user');

    // Create test program
    await Program.create(mockProgram);
    logger.info('Created test program');

    // Create test recommendation
    await Recommendation.create(mockRecommendation);
    logger.info('Created test recommendation');
  } catch (error) {
    logger.error('Failed to setup test data', error);
    process.exit(1);
  }
}

// Test roadmap generation
async function testRoadmapGeneration() {
  try {
    logger.info('Testing roadmap generation...');
    
    // Generate roadmap
    const roadmap = await roadmapService.generateRoadmap(
      testUserId,
      testRecommendationId,
      {
        title: 'Test Roadmap',
        description: 'Test description',
        startDate: new Date(),
        visibility: 'private'
      }
    );

    logger.info('Roadmap generated successfully');
    logger.info(`Roadmap ID: ${roadmap._id}`);
    logger.info(`Roadmap Title: ${roadmap.title}`);
    logger.info(`Roadmap Program: ${roadmap.programId}`);
    logger.info(`Roadmap Phases: ${roadmap.phases.length}`);
    logger.info(`Roadmap Status: ${roadmap.status}`);

    return roadmap;
  } catch (error) {
    logger.error('Failed to generate roadmap', error);
    throw error;
  }
}

// Test getting roadmaps
async function testGetRoadmaps(userId) {
  try {
    logger.info('Testing get roadmaps...');
    
    // Get roadmaps
    const roadmaps = await roadmapService.getRoadmaps(userId);

    logger.info(`Retrieved ${roadmaps.length} roadmaps`);
    
    return roadmaps;
  } catch (error) {
    logger.error('Failed to get roadmaps', error);
    throw error;
  }
}

// Test getting a roadmap by ID
async function testGetRoadmap(roadmapId, userId) {
  try {
    logger.info(`Testing get roadmap by ID: ${roadmapId}...`);
    
    // Get roadmap
    const roadmap = await roadmapService.getRoadmap(roadmapId, userId);

    logger.info('Roadmap retrieved successfully');
    logger.info(`Roadmap Title: ${roadmap.title}`);
    
    return roadmap;
  } catch (error) {
    logger.error('Failed to get roadmap', error);
    throw error;
  }
}

// Test template creation
async function testTemplateCreation(userId) {
  try {
    logger.info('Testing template creation...');
    
    // Create template
    const template = await roadmapTemplateService.createTemplate(
      userId,
      {
        programId: testProgramId,
        templateName: 'Test Template',
        templateCategory: 'skilled-worker',
        isPublic: true
      }
    );

    logger.info('Template created successfully');
    logger.info(`Template ID: ${template._id}`);
    logger.info(`Template Name: ${template.templateName}`);
    logger.info(`Template Category: ${template.templateCategory}`);
    logger.info(`Template Is Public: ${template.isPublic}`);
    
    return template;
  } catch (error) {
    logger.error('Failed to create template', error);
    throw error;
  }
}

// Test getting templates
async function testGetTemplates() {
  try {
    logger.info('Testing get templates...');
    
    // Get templates
    const templates = await roadmapTemplateService.getTemplates();

    logger.info(`Retrieved ${templates.length} templates`);
    
    return templates;
  } catch (error) {
    logger.error('Failed to get templates', error);
    throw error;
  }
}

// Test creating a roadmap from a template
async function testCreateRoadmapFromTemplate(templateId, userId) {
  try {
    logger.info(`Testing create roadmap from template: ${templateId}...`);
    
    // Create roadmap from template
    const roadmap = await roadmapTemplateService.createRoadmapFromTemplate(
      userId,
      templateId,
      {
        title: 'Roadmap from Template',
        description: 'Created from a template',
        startDate: new Date(),
        visibility: 'private'
      }
    );

    logger.info('Roadmap created from template successfully');
    logger.info(`Roadmap ID: ${roadmap._id}`);
    logger.info(`Roadmap Title: ${roadmap.title}`);
    logger.info(`Roadmap Template ID: ${roadmap.templateId}`);
    
    return roadmap;
  } catch (error) {
    logger.error('Failed to create roadmap from template', error);
    throw error;
  }
}

// Run all tests
async function runTests() {
  try {
    // Connect to database
    await connectToDatabase();

    // Setup test data
    await setupTestData();

    // Test roadmap generation
    const roadmap = await testRoadmapGeneration();

    // Test getting roadmaps
    await testGetRoadmaps(testUserId);

    // Test getting a roadmap by ID
    await testGetRoadmap(roadmap._id, testUserId);

    // Test template creation
    const template = await testTemplateCreation(testUserId);

    // Test getting templates
    await testGetTemplates();

    // Test creating a roadmap from a template
    await testCreateRoadmapFromTemplate(template._id, testUserId);

    logger.info('All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Tests failed', error);
    process.exit(1);
  }
}

// Run the tests
runTests();
