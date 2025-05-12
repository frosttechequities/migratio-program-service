/**
 * Script to run the research data import
 */
const path = require('path');
const { importAllResearchData } = require('./importResearchData');

// Set the research directory path
process.env.RESEARCH_DIR = process.env.RESEARCH_DIR || path.resolve(__dirname, '../../..', 'Scout Research');

// Run the import
importAllResearchData()
  .then(result => {
    console.log('Import completed successfully');
    console.log('Imported records:');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
  });
