/**
 * Controller for immigration programs
 */
const ImmigrationProgram = require('../models/ImmigrationProgram');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all immigration programs
 * @route   GET /api/immigration/programs
 * @access  Public
 */
const getAllPrograms = asyncHandler(async (req, res) => {
  const { 
    country, 
    type, 
    permanentResidency, 
    minAge, 
    maxAge, 
    minPoints,
    limit = 20,
    page = 1
  } = req.query;
  
  // Build query
  const query = { active: true };
  
  if (country) {
    query.country = { $regex: new RegExp(country, 'i') };
  }
  
  if (type) {
    query.type = type;
  }
  
  if (permanentResidency !== undefined) {
    query.permanentResidency = permanentResidency === 'true';
  }
  
  if (minAge) {
    query['eligibilityCriteria.ageRequirements.minAge'] = { $lte: parseInt(minAge, 10) };
  }
  
  if (maxAge) {
    query['eligibilityCriteria.ageRequirements.maxAge'] = { $gte: parseInt(maxAge, 10) };
  }
  
  if (minPoints) {
    query['pointsSystem.minimumPoints'] = { $lte: parseInt(minPoints, 10) };
  }
  
  // Calculate pagination
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  
  // Execute query
  const programs = await ImmigrationProgram.find(query)
    .sort({ country: 1, name: 1 })
    .skip(skip)
    .limit(parseInt(limit, 10));
  
  // Get total count
  const total = await ImmigrationProgram.countDocuments(query);
  
  res.json({
    success: true,
    count: programs.length,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
    data: programs
  });
});

/**
 * @desc    Get immigration programs by country
 * @route   GET /api/immigration/programs/:country
 * @access  Public
 */
const getProgramsByCountry = asyncHandler(async (req, res) => {
  const { country } = req.params;
  const { type, permanentResidency } = req.query;
  
  // Build query
  const query = { 
    country: { $regex: new RegExp(country, 'i') },
    active: true
  };
  
  if (type) {
    query.type = type;
  }
  
  if (permanentResidency !== undefined) {
    query.permanentResidency = permanentResidency === 'true';
  }
  
  // Execute query
  const programs = await ImmigrationProgram.find(query)
    .sort({ name: 1 });
  
  if (programs.length === 0) {
    res.status(404);
    throw new Error(`No immigration programs found for country: ${country}`);
  }
  
  res.json({
    success: true,
    count: programs.length,
    data: programs
  });
});

/**
 * @desc    Get immigration program by ID
 * @route   GET /api/immigration/programs/id/:id
 * @access  Public
 */
const getProgramById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const program = await ImmigrationProgram.findById(id);
  
  if (!program) {
    res.status(404);
    throw new Error(`Immigration program not found with id: ${id}`);
  }
  
  res.json({
    success: true,
    data: program
  });
});

/**
 * @desc    Get immigration program by country and name
 * @route   GET /api/immigration/programs/:country/:name
 * @access  Public
 */
const getProgramByName = asyncHandler(async (req, res) => {
  const { country, name } = req.params;
  
  const program = await ImmigrationProgram.findOne({
    country: { $regex: new RegExp(country, 'i') },
    name: { $regex: new RegExp(name, 'i') },
    active: true
  });
  
  if (!program) {
    res.status(404);
    throw new Error(`Immigration program not found: ${name} in ${country}`);
  }
  
  res.json({
    success: true,
    data: program
  });
});

/**
 * @desc    Get program types
 * @route   GET /api/immigration/programs/types
 * @access  Public
 */
const getProgramTypes = asyncHandler(async (req, res) => {
  const types = await ImmigrationProgram.distinct('type');
  
  res.json({
    success: true,
    count: types.length,
    data: types
  });
});

/**
 * @desc    Get countries with immigration programs
 * @route   GET /api/immigration/programs/countries
 * @access  Public
 */
const getProgramCountries = asyncHandler(async (req, res) => {
  const countries = await ImmigrationProgram.distinct('country');
  
  res.json({
    success: true,
    count: countries.length,
    data: countries
  });
});

/**
 * @desc    Search immigration programs
 * @route   GET /api/immigration/programs/search
 * @access  Public
 */
const searchPrograms = asyncHandler(async (req, res) => {
  const { query, limit = 10 } = req.query;
  
  if (!query) {
    res.status(400);
    throw new Error('Search query is required');
  }
  
  const programs = await ImmigrationProgram.find({
    $or: [
      { name: { $regex: new RegExp(query, 'i') } },
      { country: { $regex: new RegExp(query, 'i') } },
      { overview: { $regex: new RegExp(query, 'i') } },
      { purpose: { $regex: new RegExp(query, 'i') } }
    ],
    active: true
  })
    .limit(parseInt(limit, 10))
    .sort({ country: 1, name: 1 });
  
  res.json({
    success: true,
    count: programs.length,
    data: programs
  });
});

module.exports = {
  getAllPrograms,
  getProgramsByCountry,
  getProgramById,
  getProgramByName,
  getProgramTypes,
  getProgramCountries,
  searchPrograms
};
