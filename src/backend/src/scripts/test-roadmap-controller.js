/**
 * Test Roadmap Controller
 * 
 * This script tests the roadmap controller functionality.
 */

require('dotenv').config();
const { ObjectId } = require('mongoose').Types;
const roadmapController = require('../controllers/roadmap.controller');
const { logger } = require('../utils/logger');

// Skip MongoDB connection for testing
console.log('Running in test mode without MongoDB connection');

// Mock Express request and response objects
const mockRequest = (params = {}, body = {}, user = {}) => {
  return {
    params,
    body,
    user
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock user data
const mockUser = {
  _id: new ObjectId(),
  name: 'Test User',
  email: 'test@example.com'
};

// Mock recommendation data
const mockRecommendation = {
  _id: new ObjectId(),
  userId: mockUser._id,
  status: 'completed',
  programId: 'ca_express_entry',
  matchScore: 85,
  matchCategory: 'excellent'
};

/**
 * Test creating a roadmap
 */
async function testCreateRoadmap() {
  try {
    console.log('Testing roadmap creation...');
    
    // Mock request and response
    const req = mockRequest({}, { recommendationId: mockRecommendation._id }, mockUser);
    const res = mockResponse();
    
    // Mock the Recommendation model
    const Recommendation = {
      findOne: jest.fn().mockResolvedValue(mockRecommendation)
    };
    
    // Mock the Roadmap model
    const Roadmap = {
      findOne: jest.fn().mockResolvedValue(null),
      prototype: {
        save: jest.fn().mockResolvedValue({
          _id: new ObjectId(),
          title: 'Express Entry Immigration Roadmap',
          programId: 'ca_express_entry',
          programName: 'Express Entry',
          country: 'Canada',
          status: 'draft',
          completionPercentage: 0,
          phases: 6,
          createdAt: new Date()
        })
      }
    };
    
    // Mock the RoadmapGenerator
    const RoadmapGenerator = jest.fn().mockImplementation(() => {
      return {
        generateRoadmap: jest.fn().mockResolvedValue({
          _id: new ObjectId(),
          title: 'Express Entry Immigration Roadmap',
          programId: 'ca_express_entry',
          programName: 'Express Entry',
          country: 'Canada',
          status: 'draft',
          completionPercentage: 0,
          phases: 6,
          createdAt: new Date()
        }),
        createDocumentRecords: jest.fn().mockResolvedValue([])
      };
    });
    
    // Replace the actual models and services with mocks
    const originalRecommendation = require('../models/recommendation.model').Recommendation;
    const originalRoadmap = require('../models/roadmap.model').Roadmap;
    const originalRoadmapGenerator = require('../services/roadmap-generator');
    
    require('../models/recommendation.model').Recommendation = Recommendation;
    require('../models/roadmap.model').Roadmap = Roadmap;
    require('../services/roadmap-generator') = RoadmapGenerator;
    
    // Call the controller method
    await roadmapController.createRoadmap(req, res);
    
    // Restore the original models and services
    require('../models/recommendation.model').Recommendation = originalRecommendation;
    require('../models/roadmap.model').Roadmap = originalRoadmap;
    require('../services/roadmap-generator') = originalRoadmapGenerator;
    
    // Check the response
    console.log('Response status:', res.status.mock.calls[0][0]);
    console.log('Response body:', res.json.mock.calls[0][0]);
    
    console.log('Roadmap creation test completed successfully.');
  } catch (error) {
    console.error('Error testing roadmap creation:', error);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    // Test creating a roadmap
    await testCreateRoadmap();
    
    console.log('\nAll tests completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('\nTests failed:', error);
    process.exit(1);
  }
}

runTests();
