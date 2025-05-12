const { execSync } = require('child_process');
const path = require('path');

// Define test files
const testFiles = [
  'roadmap.service.test.js',
  'roadmap-template.service.test.js',
  'roadmap.routes.test.js'
];

// Run tests
console.log('Running Roadmap Generation System Tests...\n');

try {
  testFiles.forEach(testFile => {
    const testPath = path.join(__dirname, testFile);
    console.log(`Running tests in ${testFile}...`);
    
    try {
      execSync(`npx jest ${testPath} --verbose`, { stdio: 'inherit' });
      console.log(`✅ Tests in ${testFile} passed!\n`);
    } catch (error) {
      console.error(`❌ Tests in ${testFile} failed!`);
      process.exit(1);
    }
  });
  
  console.log('All Roadmap Generation System Tests passed! ✅');
} catch (error) {
  console.error('Error running tests:', error);
  process.exit(1);
}
