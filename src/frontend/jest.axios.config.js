module.exports = {
  // Root directory
  rootDir: './',

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.js',
    '<rootDir>/src/**/*.test.js'
  ],

  // An array of regexp pattern strings that are matched against all test paths
  // Tests that match these patterns will be skipped
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/'
  ],

  // This is the key fix for Axios 1.x
  moduleNameMapper: {
    // Force Jest to use the CommonJS version of Axios
    '^axios$': '<rootDir>/node_modules/axios/dist/node/axios.cjs',

    // Keep existing mappers
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },

  // Transform all files except node_modules (but include axios)
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/'
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  // Setup files
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    '<rootDir>/jest.setup.js'
  ],

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>/src'
  ],

  // Verbose output
  verbose: true
};
