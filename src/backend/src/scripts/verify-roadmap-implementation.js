/**
 * This script verifies that the roadmap implementation files exist and have the expected structure.
 * It doesn't require any external dependencies or database connection.
 */

const fs = require('fs');
const path = require('path');

// Files to check
const filesToCheck = [
  {
    path: 'src/services/roadmap.service.js',
    requiredMethods: [
      'generateRoadmap',
      'getRoadmaps',
      'getRoadmap'
    ]
  },
  {
    path: 'src/services/roadmap-template.service.js',
    requiredMethods: [
      'createTemplate',
      'getTemplates',
      'getTemplate',
      'createRoadmapFromTemplate',
      'updateTemplate',
      'deleteTemplate'
    ]
  },
  {
    path: 'src/controllers/roadmap.controller.js',
    requiredMethods: [
      'generateRoadmap',
      'getRoadmaps',
      'getRoadmap',
      'updateRoadmap',
      'deleteRoadmap',
      'updateMilestoneStatus',
      'updateTaskStatus',
      'generateRoadmapPDF',
      'shareRoadmap',
      'getTemplates',
      'getTemplate',
      'createTemplate',
      'updateTemplate',
      'deleteTemplate',
      'createRoadmapFromTemplate'
    ]
  },
  {
    path: 'src/routes/roadmap.routes.js',
    requiredPatterns: [
      'router.post(\'/',
      'router.get(\'/',
      'router.get(\'/:roadmapId',
      'router.put(\'/:roadmapId',
      'router.delete(\'/:roadmapId',
      'router.get(\'/:roadmapId/pdf',
      'router.post(\'/:roadmapId/share',
      'router.get(\'/templates',
      'router.post(\'/templates',
      'router.put(\'/templates/:templateId',
      'router.delete(\'/templates/:templateId',
      'router.post(\'/templates/:templateId/create'
    ]
  }
];

// Check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Check if a file contains required methods
function fileContainsMethods(filePath, methods) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return methods.every(method => {
      const pattern = new RegExp(`\\b${method}\\b`);
      return pattern.test(content);
    });
  } catch (error) {
    return false;
  }
}

// Check if a file contains required patterns
function fileContainsPatterns(filePath, patterns) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return patterns.every(pattern => content.includes(pattern));
  } catch (error) {
    return false;
  }
}

// Main verification function
function verifyImplementation() {
  console.log('Verifying Roadmap Implementation...\n');
  
  let allPassed = true;
  
  filesToCheck.forEach(file => {
    const fullPath = path.join(__dirname, '..', file.path);
    console.log(`Checking ${file.path}...`);
    
    // Check if file exists
    if (!fileExists(fullPath)) {
      console.log(`❌ File not found: ${file.path}`);
      allPassed = false;
      return;
    }
    
    // Check for required methods
    if (file.requiredMethods) {
      const containsMethods = fileContainsMethods(fullPath, file.requiredMethods);
      if (!containsMethods) {
        console.log(`❌ File does not contain all required methods: ${file.path}`);
        allPassed = false;
        return;
      }
    }
    
    // Check for required patterns
    if (file.requiredPatterns) {
      const containsPatterns = fileContainsPatterns(fullPath, file.requiredPatterns);
      if (!containsPatterns) {
        console.log(`❌ File does not contain all required patterns: ${file.path}`);
        allPassed = false;
        return;
      }
    }
    
    console.log(`✅ ${file.path} passed verification`);
  });
  
  if (allPassed) {
    console.log('\n✅ All files passed verification!');
    console.log('The Roadmap Generation system has been successfully implemented.');
  } else {
    console.log('\n❌ Some files failed verification.');
    console.log('Please check the implementation and try again.');
  }
}

// Run verification
verifyImplementation();
