/**
 * Controller for country profiles
 */
const CountryProfile = require('../models/CountryProfile');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all country profiles
 * @route   GET /api/immigration/countries
 * @access  Public
 */
const getAllCountries = asyncHandler(async (req, res) => {
  const { 
    region, 
    limit = 50,
    page = 1,
    sort = 'name'
  } = req.query;
  
  // Build query
  const query = {};
  
  if (region) {
    query.region = { $regex: new RegExp(region, 'i') };
  }
  
  // Calculate pagination
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  
  // Determine sort field and direction
  let sortField = 'name';
  let sortDirection = 1;
  
  if (sort.startsWith('-')) {
    sortField = sort.substring(1);
    sortDirection = -1;
  } else if (sort) {
    sortField = sort;
  }
  
  const sortOptions = {};
  sortOptions[sortField] = sortDirection;
  
  // Execute query
  const countries = await CountryProfile.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit, 10));
  
  // Get total count
  const total = await CountryProfile.countDocuments(query);
  
  res.json({
    success: true,
    count: countries.length,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
    data: countries
  });
});

/**
 * @desc    Get country profile by code
 * @route   GET /api/immigration/countries/code/:code
 * @access  Public
 */
const getCountryByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;
  
  const country = await CountryProfile.findOne({ code: code.toUpperCase() });
  
  if (!country) {
    res.status(404);
    throw new Error(`Country not found with code: ${code}`);
  }
  
  res.json({
    success: true,
    data: country
  });
});

/**
 * @desc    Get country profile by name
 * @route   GET /api/immigration/countries/:name
 * @access  Public
 */
const getCountryByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  
  const country = await CountryProfile.findOne({
    name: { $regex: new RegExp(name, 'i') }
  });
  
  if (!country) {
    res.status(404);
    throw new Error(`Country not found: ${name}`);
  }
  
  res.json({
    success: true,
    data: country
  });
});

/**
 * @desc    Get countries by region
 * @route   GET /api/immigration/countries/region/:region
 * @access  Public
 */
const getCountriesByRegion = asyncHandler(async (req, res) => {
  const { region } = req.params;
  
  const countries = await CountryProfile.find({
    region: { $regex: new RegExp(region, 'i') }
  }).sort({ name: 1 });
  
  if (countries.length === 0) {
    res.status(404);
    throw new Error(`No countries found in region: ${region}`);
  }
  
  res.json({
    success: true,
    count: countries.length,
    data: countries
  });
});

/**
 * @desc    Get available regions
 * @route   GET /api/immigration/countries/regions
 * @access  Public
 */
const getRegions = asyncHandler(async (req, res) => {
  const regions = await CountryProfile.distinct('region');
  
  res.json({
    success: true,
    count: regions.length,
    data: regions
  });
});

/**
 * @desc    Get top immigration countries
 * @route   GET /api/immigration/countries/top
 * @access  Public
 */
const getTopCountries = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const countries = await CountryProfile.find({})
    .sort({ globalRanking: 1 })
    .limit(parseInt(limit, 10));
  
  res.json({
    success: true,
    count: countries.length,
    data: countries
  });
});

/**
 * @desc    Search country profiles
 * @route   GET /api/immigration/countries/search
 * @access  Public
 */
const searchCountries = asyncHandler(async (req, res) => {
  const { query, limit = 10 } = req.query;
  
  if (!query) {
    res.status(400);
    throw new Error('Search query is required');
  }
  
  const countries = await CountryProfile.find({
    $or: [
      { name: { $regex: new RegExp(query, 'i') } },
      { region: { $regex: new RegExp(query, 'i') } },
      { 'immigrationSystem.systemType': { $regex: new RegExp(query, 'i') } }
    ]
  })
    .limit(parseInt(limit, 10))
    .sort({ name: 1 });
  
  res.json({
    success: true,
    count: countries.length,
    data: countries
  });
});

module.exports = {
  getAllCountries,
  getCountryByCode,
  getCountryByName,
  getCountriesByRegion,
  getRegions,
  getTopCountries,
  searchCountries
};
