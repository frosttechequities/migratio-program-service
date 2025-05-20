const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the test files to run
const testFiles = [
  'src/features/recommendations/components/__tests__/SuccessProbabilityWidget.test.js',
  'src/features/recommendations/components/__tests__/GapAnalysisWidget.test.js',
  'src/features/recommendations/__tests__/recommendationSlice.test.js'
];

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Function to run a test file
function runTest(testFile) {
  console.log(`\n\n========== Running tests for ${testFile} ==========\n`);
  
  const fullPath = path.resolve(testFile);
  
  if (!fileExists(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return false;
  }
  
  try {
    // Run the test using Jest directly
    execSync(`npx jest ${testFile} --no-cache --testTimeout=30000`, { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' }
    });
    console.log(`\n✅ Tests passed for ${testFile}`);
    return true;
  } catch (error) {
    console.error(`\n❌ Tests failed for ${testFile}`);
    console.error(error.message);
    return false;
  }
}

// Run all tests
console.log('Starting tests...');
let passedCount = 0;
let failedCount = 0;

testFiles.forEach(testFile => {
  const passed = runTest(testFile);
  if (passed) {
    passedCount++;
  } else {
    failedCount++;
  }
});

console.log('\n\n========== Test Summary ==========');
console.log(`Total test files: ${testFiles.length}`);
console.log(`Passed: ${passedCount}`);
console.log(`Failed: ${failedCount}`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
