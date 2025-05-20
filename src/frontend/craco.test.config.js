// Custom craco config for testing
const path = require('path');

module.exports = {
  // Extend the default craco config
  ...require('./craco.config.js'),
  
  // Add Jest configuration
  jest: {
    configure: {
      // Transform all files except node_modules
      transformIgnorePatterns: [
        '/node_modules/(?!axios)/'
      ],
      
      // Map modules for testing
      moduleNameMapper: {
        '^axios$': require.resolve('axios')
      }
    }
  }
};
