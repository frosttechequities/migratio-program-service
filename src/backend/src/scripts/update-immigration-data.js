/**
 * Update Immigration Data Script
 * 
 * This script manually updates immigration program data from official sources.
 * 
 * Usage: node update-immigration-data.js [--full-refresh]
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ImmigrationDataService = require('../data/immigration');
const { logger } = require('../utils/logger');

// Check for full refresh flag
const fullRefresh = process.argv.includes('--full-refresh');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    logger.info('Connected to MongoDB');
    
    try {
      // Initialize data service
      const dataService = new ImmigrationDataService();
      await dataService.initialize();
      
      // Run update or full refresh
      if (fullRefresh) {
        logger.info('Starting full refresh of immigration data');
        const result = await dataService.fullRefresh();
        logger.info(`Full refresh completed: added ${result.totalAdded} programs across ${result.countries.length} countries`);
      } else {
        logger.info('Starting update of immigration data');
        const result = await dataService.updateAllCountries();
        logger.info(`Update completed: updated ${result.totalUpdated} and added ${result.totalAdded} programs across ${result.countries.length} countries`);
      }
      
      // Disconnect from MongoDB
      await mongoose.disconnect();
      logger.info('Disconnected from MongoDB');
      process.exit(0);
    } catch (error) {
      logger.error(`Error updating immigration data: ${error.message}`);
      await mongoose.disconnect();
      process.exit(1);
    }
  })
  .catch((error) => {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  });
