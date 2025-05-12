const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/programs
 * @desc    Get all active programs
 * @access  Public
 */
router.get('/', programController.getAllPrograms);

/**
 * @route   GET /api/programs/categories
 * @desc    Get program categories
 * @access  Public
 */
router.get('/categories', programController.getProgramCategories);

/**
 * @route   GET /api/programs/countries
 * @desc    Get program countries
 * @access  Public
 */
router.get('/countries', programController.getProgramCountries);

/**
 * @route   GET /api/programs/:id
 * @desc    Get program by ID
 * @access  Public
 */
router.get('/:id', programController.getProgramById);

/**
 * @route   POST /api/programs
 * @desc    Create a new program
 * @access  Admin
 */
router.post('/', authenticate, isAdmin, programController.createProgram);

/**
 * @route   PUT /api/programs/:id
 * @desc    Update a program
 * @access  Admin
 */
router.put('/:id', authenticate, isAdmin, programController.updateProgram);

/**
 * @route   DELETE /api/programs/:id
 * @desc    Delete a program
 * @access  Admin
 */
router.delete('/:id', authenticate, isAdmin, programController.deleteProgram);

module.exports = router;
