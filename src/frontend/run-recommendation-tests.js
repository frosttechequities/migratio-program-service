const { execSync } = require('child_process');
const path = require('path');

// Define the test files to run
const testFiles = [
  'src/features/recommendations/components/__tests__/SuccessProbabilityWidget.test.js',
  'src/features/recommendations/components/__tests__/GapAnalysisWidget.test.js',
  'src/features/recommendations/__tests__/recommendationSlice.test.js'
];

// Join the test files with a space
const testFilesString = testFiles.join(' ');

// Run the tests using our custom Jest config
try {
  console.log('Running recommendation tests with custom Jest config...');
  
  // Use the custom Jest config to handle Axios ESM imports
  execSync(`npx jest --config=jest.config.axios.js ${testFilesString} --no-cache --testTimeout=30000`, { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'test' }
  });
  
  console.log('\n✅ All tests passed!');
} catch (error) {
  console.error('\n❌ Tests failed');
  process.exit(1);
}
