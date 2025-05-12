/**
 * Immigration Data Update Scheduler
 * 
 * Schedules regular updates of immigration program data.
 */

const cron = require('node-cron');
const { logger } = require('../../utils/logger');
const ImmigrationDataService = require('./index');

class ImmigrationDataScheduler {
  constructor() {
    this.dataService = new ImmigrationDataService();
    this.isRunning = false;
  }

  /**
   * Initialize the scheduler
   */
  initialize() {
    logger.info('Initializing immigration data scheduler');
    
    // Schedule daily update at 2:00 AM
    cron.schedule('0 2 * * *', () => {
      this.runUpdate();
    });
    
    // Schedule weekly full refresh on Sunday at 3:00 AM
    cron.schedule('0 3 * * 0', () => {
      this.runFullRefresh();
    });
    
    logger.info('Immigration data scheduler initialized');
  }

  /**
   * Run a data update
   */
  async runUpdate() {
    if (this.isRunning) {
      logger.warn('Immigration data update already in progress');
      return;
    }
    
    this.isRunning = true;
    
    try {
      logger.info('Starting immigration data update');
      
      const startTime = Date.now();
      const result = await this.dataService.updateAllCountries();
      const duration = (Date.now() - startTime) / 1000;
      
      logger.info(`Immigration data update completed in ${duration.toFixed(2)} seconds`);
      logger.info(`Updated ${result.totalPrograms} programs from ${result.countries.length} countries`);
      
      // Log any errors
      if (result.errors.length > 0) {
        logger.warn(`Encountered ${result.errors.length} errors during update`);
        result.errors.forEach(error => {
          logger.error(`Error updating ${error.country}: ${error.message}`);
        });
      }
    } catch (error) {
      logger.error(`Error running immigration data update: ${error.message}`);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Run a full data refresh
   */
  async runFullRefresh() {
    if (this.isRunning) {
      logger.warn('Immigration data update already in progress');
      return;
    }
    
    this.isRunning = true;
    
    try {
      logger.info('Starting full immigration data refresh');
      
      const startTime = Date.now();
      const result = await this.dataService.fullRefresh();
      const duration = (Date.now() - startTime) / 1000;
      
      logger.info(`Full immigration data refresh completed in ${duration.toFixed(2)} seconds`);
      logger.info(`Refreshed ${result.totalPrograms} programs from ${result.countries.length} countries`);
      
      // Log any errors
      if (result.errors.length > 0) {
        logger.warn(`Encountered ${result.errors.length} errors during refresh`);
        result.errors.forEach(error => {
          logger.error(`Error refreshing ${error.country}: ${error.message}`);
        });
      }
    } catch (error) {
      logger.error(`Error running full immigration data refresh: ${error.message}`);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Run a manual update
   */
  async runManualUpdate() {
    if (this.isRunning) {
      logger.warn('Immigration data update already in progress');
      return false;
    }
    
    try {
      await this.runUpdate();
      return true;
    } catch (error) {
      logger.error(`Error running manual immigration data update: ${error.message}`);
      return false;
    }
  }
}

module.exports = new ImmigrationDataScheduler();
