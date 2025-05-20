module.exports = {
  // The root directory that Jest should scan for tests and modules
  rootDir: './',

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/features/dashboard/__tests__/DashboardSecurity.test.js'
  ],

  // An array of regexp pattern strings that are matched against all test paths
  // Tests that match these patterns will be skipped
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/'
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.js' }]
  },

  // An array of regexp pattern strings that are matched against all source file paths
  // Files that match these patterns will not be transformed
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/'
  ],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],

  // A map from regular expressions to module names that allow to stub out resources
  moduleNameMapper: {
    // Force Jest to use the CommonJS version of Axios
    '^axios$': '<rootDir>/node_modules/axios/dist/node/axios.cjs',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>/src'
  ],

  // The paths to modules that run some code to configure or set up the testing environment
  setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    '<rootDir>/src/setupTests.js'
  ],

  // The maximum amount of workers used to run your tests
  maxWorkers: '50%',

  // Watchman configuration
  watchman: false,

  // Prevent Haste module naming collisions
  modulePathIgnorePatterns: [
    // Ignore VS Code extensions
    '.*\\.vscode.*',
    // Ignore other projects in the user's directory
    '.*\\Desktop.*',
    '.*\\Documents.*(?<!Migratio).*',
    '.*\\AppData.*'
  ],

  // Explicitly set the test environment to jsdom
  testEnvironment: 'jsdom',

  // Explicitly set the babel config file
  globals: {
    'babel-jest': {
      babelrcFile: './babel.config.js'
    }
  }
};