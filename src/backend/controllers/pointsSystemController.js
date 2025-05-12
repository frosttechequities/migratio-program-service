/**
 * Controller for points systems
 */
const PointsSystem = require('../models/PointsSystem');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all points systems
 * @route   GET /api/immigration/points-systems
 * @access  Public
 */
const getAllPointsSystems = asyncHandler(async (req, res) => {
  const { 
    country, 
    minPoints,
    limit = 20,
    page = 1
  } = req.query;
  
  // Build query
  const query = {};
  
  if (country) {
    query.country = { $regex: new RegExp(country, 'i') };
  }
  
  if (minPoints) {
    query.minimumPoints = { $lte: parseInt(minPoints, 10) };
  }
  
  // Calculate pagination
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  
  // Execute query
  const pointsSystems = await PointsSystem.find(query)
    .sort({ country: 1, name: 1 })
    .skip(skip)
    .limit(parseInt(limit, 10));
  
  // Get total count
  const total = await PointsSystem.countDocuments(query);
  
  res.json({
    success: true,
    count: pointsSystems.length,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
    data: pointsSystems
  });
});

/**
 * @desc    Get points system by ID
 * @route   GET /api/immigration/points-systems/id/:id
 * @access  Public
 */
const getPointsSystemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const pointsSystem = await PointsSystem.findById(id);
  
  if (!pointsSystem) {
    res.status(404);
    throw new Error(`Points system not found with id: ${id}`);
  }
  
  res.json({
    success: true,
    data: pointsSystem
  });
});

/**
 * @desc    Get points systems by country
 * @route   GET /api/immigration/points-systems/country/:country
 * @access  Public
 */
const getPointsSystemsByCountry = asyncHandler(async (req, res) => {
  const { country } = req.params;
  
  const pointsSystems = await PointsSystem.find({
    country: { $regex: new RegExp(country, 'i') }
  }).sort({ name: 1 });
  
  if (pointsSystems.length === 0) {
    res.status(404);
    throw new Error(`No points systems found for country: ${country}`);
  }
  
  res.json({
    success: true,
    count: pointsSystems.length,
    data: pointsSystems
  });
});

/**
 * @desc    Get points system by country and program name
 * @route   GET /api/immigration/points-systems/:country/:program
 * @access  Public
 */
const getPointsSystemByProgram = asyncHandler(async (req, res) => {
  const { country, program } = req.params;
  
  const pointsSystem = await PointsSystem.findOne({
    country: { $regex: new RegExp(country, 'i') },
    programName: { $regex: new RegExp(program, 'i') }
  });
  
  if (!pointsSystem) {
    res.status(404);
    throw new Error(`Points system not found for program: ${program} in ${country}`);
  }
  
  res.json({
    success: true,
    data: pointsSystem
  });
});

/**
 * @desc    Compare points systems
 * @route   GET /api/immigration/points-systems/compare
 * @access  Public
 */
const comparePointsSystems = asyncHandler(async (req, res) => {
  const { systems } = req.query;
  
  if (!systems) {
    res.status(400);
    throw new Error('Systems to compare are required');
  }
  
  const systemIds = systems.split(',');
  
  const pointsSystems = await PointsSystem.find({
    _id: { $in: systemIds }
  });
  
  if (pointsSystems.length === 0) {
    res.status(404);
    throw new Error('No points systems found with the provided IDs');
  }
  
  res.json({
    success: true,
    count: pointsSystems.length,
    data: pointsSystems
  });
});

/**
 * @desc    Calculate points for a user profile
 * @route   POST /api/immigration/points-systems/:id/calculate
 * @access  Public
 */
const calculatePoints = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userProfile = req.body;
  
  if (!userProfile) {
    res.status(400);
    throw new Error('User profile is required');
  }
  
  const pointsSystem = await PointsSystem.findById(id);
  
  if (!pointsSystem) {
    res.status(404);
    throw new Error(`Points system not found with id: ${id}`);
  }
  
  // Calculate points based on user profile
  const result = {
    totalPoints: 0,
    breakdown: [],
    minimumPoints: pointsSystem.minimumPoints,
    competitivePoints: pointsSystem.competitivePoints || pointsSystem.minimumPoints + 10,
    maximumPossiblePoints: pointsSystem.maximumPossiblePoints || 0,
    eligible: false,
    competitive: false
  };
  
  // Process each category
  for (const category of pointsSystem.categories) {
    const categoryResult = {
      name: category.name,
      points: 0,
      maximumPoints: category.maximumPoints || 0,
      factors: []
    };
    
    // Process each factor in the category
    for (const factor of category.factors) {
      const factorResult = {
        name: factor.name,
        points: 0,
        breakdown: factor.name
      };
      
      // Calculate points based on factor type
      if (category.name.toLowerCase().includes('age') && userProfile.age) {
        // Age points
        for (const pointBreakdown of factor.pointsBreakdown) {
          const ageRange = pointBreakdown.criteria.match(/(\d+)[-–](\d+)/);
          if (ageRange) {
            const minAge = parseInt(ageRange[1], 10);
            const maxAge = parseInt(ageRange[2], 10);
            
            if (userProfile.age >= minAge && userProfile.age <= maxAge) {
              factorResult.points = pointBreakdown.points;
              factorResult.breakdown = `Age ${userProfile.age}: ${pointBreakdown.points} points`;
              break;
            }
          }
        }
      } else if (category.name.toLowerCase().includes('education') && userProfile.education) {
        // Education points
        for (const pointBreakdown of factor.pointsBreakdown) {
          if (pointBreakdown.criteria.toLowerCase().includes(userProfile.education.toLowerCase())) {
            factorResult.points = pointBreakdown.points;
            factorResult.breakdown = `${userProfile.education}: ${pointBreakdown.points} points`;
            break;
          }
        }
      } else if (category.name.toLowerCase().includes('language') && userProfile.languageScores) {
        // Language points
        for (const pointBreakdown of factor.pointsBreakdown) {
          if (pointBreakdown.criteria.toLowerCase().includes(userProfile.languageScores.level.toLowerCase())) {
            factorResult.points = pointBreakdown.points;
            factorResult.breakdown = `${userProfile.languageScores.test} (${userProfile.languageScores.level}): ${pointBreakdown.points} points`;
            break;
          }
        }
      } else if (category.name.toLowerCase().includes('experience') && userProfile.workExperience) {
        // Work experience points
        for (const pointBreakdown of factor.pointsBreakdown) {
          const experienceRange = pointBreakdown.criteria.match(/(\d+)[-–]?(\d+)?\s+(\w+)/);
          if (experienceRange) {
            const minExp = parseInt(experienceRange[1], 10);
            const maxExp = experienceRange[2] ? parseInt(experienceRange[2], 10) : 100; // Default high max if not specified
            const unit = experienceRange[3].toLowerCase();
            
            let userExp = userProfile.workExperience.years;
            if (unit.includes('month')) {
              userExp = userProfile.workExperience.years * 12;
            }
            
            if (userExp >= minExp && userExp <= maxExp) {
              factorResult.points = pointBreakdown.points;
              factorResult.breakdown = `${userProfile.workExperience.years} years experience: ${pointBreakdown.points} points`;
              break;
            }
          }
        }
      } else if (category.name.toLowerCase().includes('other') || 
                category.name.toLowerCase().includes('additional')) {
        // Other factors - check if user has claimed any of these
        if (userProfile.additionalFactors && Array.isArray(userProfile.additionalFactors)) {
          for (const pointBreakdown of factor.pointsBreakdown) {
            if (userProfile.additionalFactors.some(f => 
              pointBreakdown.criteria.toLowerCase().includes(f.toLowerCase()))) {
              factorResult.points = pointBreakdown.points;
              factorResult.breakdown = `${pointBreakdown.criteria}: ${pointBreakdown.points} points`;
              break;
            }
          }
        }
      }
      
      categoryResult.factors.push(factorResult);
      categoryResult.points += factorResult.points;
    }
    
    // Cap category points at maximum if specified
    if (categoryResult.maximumPoints > 0 && categoryResult.points > categoryResult.maximumPoints) {
      categoryResult.points = categoryResult.maximumPoints;
    }
    
    result.breakdown.push(categoryResult);
    result.totalPoints += categoryResult.points;
  }
  
  // Determine eligibility
  result.eligible = result.totalPoints >= pointsSystem.minimumPoints;
  result.competitive = result.totalPoints >= result.competitivePoints;
  
  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  getAllPointsSystems,
  getPointsSystemById,
  getPointsSystemsByCountry,
  getPointsSystemByProgram,
  comparePointsSystems,
  calculatePoints
};
