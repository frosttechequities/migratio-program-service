/**
 * Seed Immigration Data
 * 
 * This script seeds the database with immigration program data.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ImmigrationDataService = require('../data/immigration');
const { logger } = require('../utils/logger');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/**
 * Seed immigration data
 */
async function seedImmigrationData() {
  try {
    console.log('Seeding immigration data...');
    
    // Initialize immigration data service
    const immigrationDataService = new ImmigrationDataService();
    
    // Initialize the service (this will seed the database if it's empty)
    await immigrationDataService.initialize();
    
    // Check if we need to force a full refresh
    const forceRefresh = process.argv.includes('--force');
    
    if (forceRefresh) {
      console.log('Forcing full refresh of immigration data...');
      const result = await immigrationDataService.fullRefresh();
      
      console.log('Immigration data refreshed successfully:');
      console.log(`- Added: ${result.totalAdded}`);
      console.log(`- Updated: ${result.totalUpdated}`);
      console.log(`- Total programs: ${result.totalPrograms}`);
      console.log(`- Countries: ${result.countries.length}`);
    } else {
      console.log('Immigration data seeded successfully.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding immigration data:', error);
    process.exit(1);
  }
}

// Run the script
seedImmigrationData();
