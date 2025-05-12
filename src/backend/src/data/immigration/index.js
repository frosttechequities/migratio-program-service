/**
 * Immigration Data Service
 *
 * Main entry point for immigration data collection and management.
 * Uses real-world immigration program data from official government sources.
 */

const { logger } = require('../../utils/logger');
const ImmigrationProgram = require('../../models/immigration-program.model');
const ImmigrationProgramProcessor = require('./processors/program-processor');

// Import real-world program data
const { allPrograms, canadaPrograms, australiaPrograms, ukPrograms } = require('./programs');

class ImmigrationDataService {
  constructor() {
    this.processor = new ImmigrationProgramProcessor();
    this.programData = {
      'Canada': canadaPrograms,
      'Australia': australiaPrograms,
      'United Kingdom': ukPrograms
    };
  }

  /**
   * Initialize the service
   */
  async initialize() {
    logger.info('Initializing immigration data service');

    try {
      // Check if we need to seed the database with initial data
      const count = await ImmigrationProgram.countDocuments();

      if (count === 0) {
        logger.info('No immigration programs found in database, seeding with initial data');
        await this.seedDatabase();
      } else {
        logger.info(`Found ${count} immigration programs in database`);
      }

      logger.info('Immigration data service initialized');
    } catch (error) {
      logger.error(`Error initializing immigration data service: ${error.message}`);
      throw error;
    }
  }

  /**
   * Seed the database with initial immigration program data
   */
  async seedDatabase() {
    try {
      logger.info('Seeding database with immigration program data');

      // Process and save all programs
      for (const [country, programs] of Object.entries(this.programData)) {
        logger.info(`Processing ${programs.length} programs for ${country}`);

        const processedData = {
          country,
          programs,
          lastUpdated: new Date()
        };

        await this.saveToDatabase(processedData);
      }

      logger.info('Database seeded successfully');
    } catch (error) {
      logger.error(`Error seeding database: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update data for a specific country
   * @param {string} country - Country name
   * @returns {Promise<Object>} - Update result
   */
  async updateCountry(country) {
    try {
      logger.info(`Updating immigration data for ${country}`);

      const programs = this.programData[country];
      if (!programs) {
        throw new Error(`No program data found for ${country}`);
      }

      // Process data
      const processedData = {
        country,
        programs,
        lastUpdated: new Date()
      };

      // Save to database
      const result = await this.saveToDatabase(processedData);

      logger.info(`Updated ${result.updated} and added ${result.added} programs for ${country}`);

      return {
        country,
        added: result.added,
        updated: result.updated,
        total: result.total,
        errors: result.errors
      };
    } catch (error) {
      logger.error(`Error updating immigration data for ${country}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update data for all countries
   * @returns {Promise<Object>} - Update result
   */
  async updateAllCountries() {
    try {
      logger.info('Updating immigration data for all countries');

      const results = [];
      const errors = [];

      for (const country of Object.keys(this.programData)) {
        try {
          const result = await this.updateCountry(country);
          results.push(result);
        } catch (error) {
          logger.error(`Error updating ${country}: ${error.message}`);
          errors.push({
            country,
            message: error.message
          });
        }
      }

      // Calculate totals
      const totalAdded = results.reduce((sum, result) => sum + result.added, 0);
      const totalUpdated = results.reduce((sum, result) => sum + result.updated, 0);
      const totalPrograms = results.reduce((sum, result) => sum + result.total, 0);

      logger.info(`Updated ${totalUpdated} and added ${totalAdded} programs across ${results.length} countries`);

      return {
        countries: results,
        totalAdded,
        totalUpdated,
        totalPrograms,
        errors
      };
    } catch (error) {
      logger.error(`Error updating all countries: ${error.message}`);
      throw error;
    }
  }

  /**
   * Perform a full refresh of all data
   * @returns {Promise<Object>} - Refresh result
   */
  async fullRefresh() {
    try {
      logger.info('Performing full refresh of immigration data');

      // Clear existing data
      await ImmigrationProgram.deleteMany({});
      logger.info('Cleared existing immigration data');

      // Update all countries
      const result = await this.updateAllCountries();

      logger.info(`Full refresh completed: added ${result.totalAdded} programs across ${result.countries.length} countries`);

      return result;
    } catch (error) {
      logger.error(`Error performing full refresh: ${error.message}`);
      throw error;
    }
  }

  /**
   * Save processed data to database
   * @param {Object} data - Processed data
   * @returns {Promise<Object>} - Save result
   */
  async saveToDatabase(data) {
    try {
      logger.info(`Saving ${data.programs.length} programs for ${data.country} to database`);

      let added = 0;
      let updated = 0;
      const errors = [];

      for (const program of data.programs) {
        try {
          // Check if program already exists
          const existingProgram = await ImmigrationProgram.findOne({ programId: program.programId });

          if (existingProgram) {
            // Update existing program
            await ImmigrationProgram.updateOne(
              { programId: program.programId },
              {
                $set: {
                  ...program,
                  lastDataUpdate: new Date()
                }
              }
            );
            updated++;
          } else {
            // Create new program
            await ImmigrationProgram.create({
              ...program,
              createdAt: new Date(),
              updatedAt: new Date(),
              lastDataUpdate: new Date()
            });
            added++;
          }
        } catch (error) {
          logger.error(`Error saving program ${program.programId}: ${error.message}`);
          errors.push({
            programId: program.programId,
            message: error.message
          });
        }
      }

      logger.info(`Saved ${added + updated} programs for ${data.country} to database`);

      return {
        added,
        updated,
        total: added + updated,
        errors
      };
    } catch (error) {
      logger.error(`Error saving data to database: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all programs
   * @returns {Promise<Array>} - All programs
   */
  async getAllPrograms() {
    return ImmigrationProgram.find({ active: true });
  }

  /**
   * Get programs by country
   * @param {string} country - Country code
   * @returns {Promise<Array>} - Programs for the country
   */
  async getProgramsByCountry(country) {
    return ImmigrationProgram.findByCountry(country);
  }

  /**
   * Get programs by category
   * @param {string} category - Program category
   * @returns {Promise<Array>} - Programs in the category
   */
  async getProgramsByCategory(category) {
    return ImmigrationProgram.findByCategory(category);
  }

  /**
   * Get programs with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} - Filtered programs
   */
  async getProgramsWithFilters(filters) {
    return ImmigrationProgram.findWithFilters(filters);
  }

  /**
   * Get program by ID
   * @param {string} programId - Program ID
   * @returns {Promise<Object>} - Program
   */
  async getProgramById(programId) {
    return ImmigrationProgram.findOne({ programId, active: true });
  }

  /**
   * Search programs by keyword
   * @param {string} keyword - Search keyword
   * @returns {Promise<Array>} - Search results
   */
  async searchPrograms(keyword) {
    return ImmigrationProgram.searchByKeyword(keyword);
  }
}

module.exports = ImmigrationDataService;
