const MatchingAlgorithmService = require('../services/matching-algorithm.service');

describe('MatchingAlgorithmService', () => {
  let matchingAlgorithm;

  beforeEach(() => {
    matchingAlgorithm = new MatchingAlgorithmService();
  });

  describe('_scoreMinimumCriterion', () => {
    it('should return 100 when user value meets or exceeds required value', () => {
      expect(matchingAlgorithm._scoreMinimumCriterion(10, 5)).toBe(100);
      expect(matchingAlgorithm._scoreMinimumCriterion(5, 5)).toBe(100);
    });

    it('should return a partial score when user value is less than required value', () => {
      expect(matchingAlgorithm._scoreMinimumCriterion(4, 5)).toBe(80);
      expect(matchingAlgorithm._scoreMinimumCriterion(2.5, 5)).toBe(50);
    });
  });

  describe('_scoreMaximumCriterion', () => {
    it('should return 0 when user value exceeds maximum', () => {
      expect(matchingAlgorithm._scoreMaximumCriterion(11, 10)).toBe(0);
    });

    it('should return a score when user value is within maximum', () => {
      expect(matchingAlgorithm._scoreMaximumCriterion(5, 10)).toBe(90);
      expect(matchingAlgorithm._scoreMaximumCriterion(10, 10)).toBe(100);
    });
  });

  describe('_scoreRangeCriterion', () => {
    it('should return a partial score when user value is below minimum', () => {
      expect(matchingAlgorithm._scoreRangeCriterion(4, { min: 5, max: 10 })).toBe(80);
    });

    it('should return 0 when user value is above maximum', () => {
      expect(matchingAlgorithm._scoreRangeCriterion(11, { min: 5, max: 10 })).toBe(0);
    });

    it('should return a score when user value is within range', () => {
      expect(matchingAlgorithm._scoreRangeCriterion(7.5, { min: 5, max: 10 })).toBe(100);
      expect(matchingAlgorithm._scoreRangeCriterion(6, { min: 5, max: 10 })).toBe(88);
    });
  });

  describe('_calculateCompositeScore', () => {
    it('should calculate weighted average of category scores', () => {
      const categoryScores = [
        { category: 'age', score: 80, weight: 2 },
        { category: 'education', score: 100, weight: 3 },
        { category: 'language', score: 60, weight: 1 }
      ];

      // Expected: (80*2 + 100*3 + 60*1) / (2+3+1) = 420 / 6 = 70
      expect(matchingAlgorithm._calculateCompositeScore(categoryScores)).toBe(86.66666666666667);
    });

    it('should return 0 if no category scores', () => {
      expect(matchingAlgorithm._calculateCompositeScore([])).toBe(0);
    });
  });

  describe('_determineImpact', () => {
    it('should return negative for mandatory criteria with low scores', () => {
      expect(matchingAlgorithm._determineImpact(30, { isMandatory: true })).toBe('negative');
    });

    it('should return positive for high scores', () => {
      expect(matchingAlgorithm._determineImpact(90, { isMandatory: false })).toBe('positive');
    });

    it('should return neutral for moderate scores', () => {
      expect(matchingAlgorithm._determineImpact(70, { isMandatory: false })).toBe('neutral');
    });
  });
});
