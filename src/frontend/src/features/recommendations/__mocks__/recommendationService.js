// Mock implementation of the recommendationService
const recommendationService = {
  getSuccessProbability: jest.fn(),
  getGapAnalysis: jest.fn()
};

module.exports = recommendationService;
