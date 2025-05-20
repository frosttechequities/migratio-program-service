const { getGapAnalysis } = require('../gapAnalysisController');
const logger = require('../../utils/logger');

// Mock the logger
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

// Mock the express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => true),
    array: jest.fn(() => [])
  }))
}));

describe('gapAnalysisController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        programId: 'program123'
      },
      user: {
        id: 'user123'
      }
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getGapAnalysis', () => {
    test('should return gap analysis data', async () => {
      await getGapAnalysis(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.objectContaining({
            gaps: expect.any(Array),
            recommendations: expect.any(Array),
            timeline: expect.objectContaining({
              minMonths: expect.any(Number),
              maxMonths: expect.any(Number)
            })
          })
        })
      );
      expect(logger.info).toHaveBeenCalled();
    });

    test('should return 400 if program ID is missing', async () => {
      req.params.programId = null;

      await getGapAnalysis(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: 'Program ID is required'
        })
      );
    });

    test('should return 401 if user is not authenticated', async () => {
      req.user = null;

      await getGapAnalysis(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: 'User not authenticated'
        })
      );
    });

    test('should handle errors and return 500', async () => {
      // Mock an error by making getUserProfile throw
      jest.spyOn(global, 'getUserProfile').mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      await getGapAnalysis(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Failed to perform gap analysis'
        })
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
