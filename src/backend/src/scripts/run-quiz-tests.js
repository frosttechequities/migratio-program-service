/**
 * Script to verify quiz engine test file
 */
const path = require('path');
const fs = require('fs');

// Run verification
console.log('Verifying Quiz Engine Service Test File...\n');

// Get the absolute path to the test file
const testFilePath = path.resolve(__dirname, '../tests/quiz-engine.service.test.js');

// Check if the test file exists
if (fs.existsSync(testFilePath)) {
  console.log(`✅ Test file exists: ${testFilePath}`);

  // Read the first few lines of the file to verify content
  const content = fs.readFileSync(testFilePath, 'utf8').split('\n').slice(0, 10).join('\n');
  console.log('\nFirst 10 lines of the test file:');
  console.log('-----------------------------------');
  console.log(content);
  console.log('-----------------------------------');

  console.log('\n✅ Quiz Engine Service test file is ready to be run with:');
  console.log(`npx jest "${testFilePath}" --verbose`);
} else {
  console.error(`❌ Test file not found: ${testFilePath}`);
  process.exit(1);
}
