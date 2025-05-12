/**
 * Script to import all research data into the database
 */
const mongoose = require('mongoose');
const path = require('path');
const { importCountryProfiles } = require('../utils/importCountryProfiles');
const { importImmigrationPrograms } = require('../utils/importImmigrationPrograms');
const { importPointsSystems } = require('../utils/importPointsSystems');
const { importProcessingData } = require('../utils/importProcessingData');
const { importImmigrationCosts } = require('../utils/importImmigrationCosts');
const { importDataSources } = require('../utils/importDataSources');
const config = require('../config/config');

/**
 * Main function to import all research data
 */
async function importAllResearchData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Path to research directory
    const researchDir = path.resolve(process.env.RESEARCH_DIR || '../../Scout Research');
    console.log(`Using research directory: ${researchDir}`);
    
    // Import data sources first
    console.log('\n--- Importing Data Sources ---');
    const dataSources = await importDataSources(researchDir);
    console.log(`Imported ${dataSources.length} data sources`);
    
    // Import country profiles
    console.log('\n--- Importing Country Profiles ---');
    const countryProfiles = await importCountryProfiles(researchDir);
    console.log(`Imported ${countryProfiles.length} country profiles`);
    
    // Import immigration programs
    console.log('\n--- Importing Immigration Programs ---');
    const immigrationPrograms = await importImmigrationPrograms(researchDir);
    console.log(`Imported ${immigrationPrograms.length} immigration programs`);
    
    // Import points systems
    console.log('\n--- Importing Points Systems ---');
    const pointsSystems = await importPointsSystems(researchDir);
    console.log(`Imported ${pointsSystems.length} points systems`);
    
    // Import processing data
    console.log('\n--- Importing Processing Data ---');
    const processingData = await importProcessingData(researchDir);
    console.log(`Imported ${processingData.length} processing data records`);
    
    // Import immigration costs
    console.log('\n--- Importing Immigration Costs ---');
    const immigrationCosts = await importImmigrationCosts(researchDir);
    console.log(`Imported ${immigrationCosts.length} immigration cost records`);
    
    console.log('\n--- Import Complete ---');
    console.log(`Total imported records:
      - Data Sources: ${dataSources.length}
      - Country Profiles: ${countryProfiles.length}
      - Immigration Programs: ${immigrationPrograms.length}
      - Points Systems: ${pointsSystems.length}
      - Processing Data: ${processingData.length}
      - Immigration Costs: ${immigrationCosts.length}
    `);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    return {
      dataSources: dataSources.length,
      countryProfiles: countryProfiles.length,
      immigrationPrograms: immigrationPrograms.length,
      pointsSystems: pointsSystems.length,
      processingData: processingData.length,
      immigrationCosts: immigrationCosts.length
    };
  } catch (error) {
    console.error('Error importing research data:', error);
    
    // Disconnect from MongoDB
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
    
    throw error;
  }
}

// Run the import if this script is executed directly
if (require.main === module) {
  importAllResearchData()
    .then(result => {
      console.log('Import completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}

module.exports = {
  importAllResearchData
};
