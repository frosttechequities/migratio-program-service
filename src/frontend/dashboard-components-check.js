/**
 * Dashboard Components Check
 * 
 * This script checks if all required components for the Dashboard Experience Optimization
 * are present in the codebase.
 */

const fs = require('fs');
const path = require('path');

// Define the components to check
const componentsToCheck = [
  // Enhanced Visual Roadmap Components
  {
    name: 'InteractiveTimeline',
    path: 'src/frontend/src/features/roadmap/components/InteractiveTimeline.js',
    category: 'Enhanced Visual Roadmap'
  },
  {
    name: 'TimelineVisualization',
    path: 'src/frontend/src/features/roadmap/components/TimelineVisualization.js',
    category: 'Enhanced Visual Roadmap'
  },
  {
    name: 'MilestoneTracker',
    path: 'src/frontend/src/features/roadmap/components/MilestoneTracker.js',
    category: 'Enhanced Visual Roadmap'
  },
  {
    name: 'StepGuidance',
    path: 'src/frontend/src/features/roadmap/components/StepGuidance.js',
    category: 'Enhanced Visual Roadmap'
  },
  {
    name: 'RoadmapProgress',
    path: 'src/frontend/src/features/roadmap/components/RoadmapProgress.js',
    category: 'Enhanced Visual Roadmap'
  },
  
  // Improved Recommendation Display Components
  {
    name: 'ProgramComparisonView',
    path: 'src/frontend/src/features/recommendations/components/ProgramComparisonView.js',
    category: 'Improved Recommendation Display'
  },
  {
    name: 'RecommendationSummaryWidget',
    path: 'src/frontend/src/features/dashboard/components/RecommendationSummaryWidget.js',
    category: 'Improved Recommendation Display'
  },
  {
    name: 'SuccessProbabilityWidget',
    path: 'src/frontend/src/features/recommendations/components/SuccessProbabilityWidget.js',
    category: 'Improved Recommendation Display'
  },
  {
    name: 'ActionRecommendations',
    path: 'src/frontend/src/features/recommendations/components/ActionRecommendations.js',
    category: 'Improved Recommendation Display'
  },
  {
    name: 'GapAnalysisWidget',
    path: 'src/frontend/src/features/recommendations/components/GapAnalysisWidget.js',
    category: 'Improved Recommendation Display'
  }
];

// Check if components exist
const checkComponents = () => {
  const results = {
    enhancedVisualRoadmap: {},
    improvedRecommendationDisplay: {}
  };
  
  componentsToCheck.forEach(component => {
    const fullPath = path.resolve(__dirname, '..', component.path.replace('src/frontend/', ''));
    const exists = fs.existsSync(fullPath);
    
    if (component.category === 'Enhanced Visual Roadmap') {
      results.enhancedVisualRoadmap[component.name] = exists;
    } else if (component.category === 'Improved Recommendation Display') {
      results.improvedRecommendationDisplay[component.name] = exists;
    }
  });
  
  return results;
};

// Format results for display
const formatResults = (results) => {
  let output = '# Dashboard Experience Optimization Components Check\n\n';
  
  // Enhanced Visual Roadmap Components
  output += `## Enhanced Visual Roadmap Components\n\n`;
  Object.entries(results.enhancedVisualRoadmap).forEach(([component, exists]) => {
    output += `- ${component}: ${exists ? '✅' : '❌'}\n`;
  });
  
  // Improved Recommendation Display Components
  output += `\n## Improved Recommendation Display Components\n\n`;
  Object.entries(results.improvedRecommendationDisplay).forEach(([component, exists]) => {
    output += `- ${component}: ${exists ? '✅' : '❌'}\n`;
  });
  
  return output;
};

// Run the check
const results = checkComponents();
console.log(formatResults(results));

// Export for use in other files
module.exports = {
  checkComponents,
  formatResults
};
