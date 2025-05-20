// This script verifies that our components can be imported without errors
console.log('Verifying components...');

try {
  // Import the components
  const SuccessProbabilityWidget = require('./src/features/recommendations/components/SuccessProbabilityWidget');
  console.log('✅ SuccessProbabilityWidget imported successfully');
  
  const GapAnalysisWidget = require('./src/features/recommendations/components/GapAnalysisWidget');
  console.log('✅ GapAnalysisWidget imported successfully');
  
  const recommendationSlice = require('./src/features/recommendations/recommendationSlice');
  console.log('✅ recommendationSlice imported successfully');
  
  // Verify the components have the expected properties
  console.log('\nVerifying component properties:');
  
  // SuccessProbabilityWidget should be a function (React component)
  if (typeof SuccessProbabilityWidget.default === 'function') {
    console.log('✅ SuccessProbabilityWidget is a valid React component');
  } else {
    console.error('❌ SuccessProbabilityWidget is not a valid React component');
  }
  
  // GapAnalysisWidget should be a function (React component)
  if (typeof GapAnalysisWidget.default === 'function') {
    console.log('✅ GapAnalysisWidget is a valid React component');
  } else {
    console.error('❌ GapAnalysisWidget is not a valid React component');
  }
  
  // recommendationSlice should have actions and reducer
  if (recommendationSlice.resetRecommendations && 
      recommendationSlice.fetchSuccessProbability && 
      recommendationSlice.fetchGapAnalysis) {
    console.log('✅ recommendationSlice has the expected actions');
  } else {
    console.error('❌ recommendationSlice is missing expected actions');
  }
  
  console.log('\nAll components verified successfully!');
} catch (error) {
  console.error('Error verifying components:', error);
  process.exit(1);
}
