/**
 * Routes for immigration data
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const immigrationProgramController = require('../controllers/immigrationProgramController');
const countryProfileController = require('../controllers/countryProfileController');
const pointsSystemController = require('../controllers/pointsSystemController');

// Immigration Programs Routes
router.get('/programs', immigrationProgramController.getAllPrograms);
router.get('/programs/types', immigrationProgramController.getProgramTypes);
router.get('/programs/countries', immigrationProgramController.getProgramCountries);
router.get('/programs/search', immigrationProgramController.searchPrograms);
router.get('/programs/id/:id', immigrationProgramController.getProgramById);
router.get('/programs/:country', immigrationProgramController.getProgramsByCountry);
router.get('/programs/:country/:name', immigrationProgramController.getProgramByName);

// Country Profiles Routes
router.get('/countries', countryProfileController.getAllCountries);
router.get('/countries/regions', countryProfileController.getRegions);
router.get('/countries/top', countryProfileController.getTopCountries);
router.get('/countries/search', countryProfileController.searchCountries);
router.get('/countries/code/:code', countryProfileController.getCountryByCode);
router.get('/countries/region/:region', countryProfileController.getCountriesByRegion);
router.get('/countries/:name', countryProfileController.getCountryByName);

// Points Systems Routes
router.get('/points-systems', pointsSystemController.getAllPointsSystems);
router.get('/points-systems/id/:id', pointsSystemController.getPointsSystemById);
router.get('/points-systems/compare', pointsSystemController.comparePointsSystems);
router.get('/points-systems/country/:country', pointsSystemController.getPointsSystemsByCountry);
router.get('/points-systems/:country/:program', pointsSystemController.getPointsSystemByProgram);
router.post('/points-systems/:id/calculate', pointsSystemController.calculatePoints);

module.exports = router;
