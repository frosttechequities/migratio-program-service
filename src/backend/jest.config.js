module.exports = {
  // The root directory that Jest should scan for tests and modules
  rootDir: './',
  
  // The test environment that will be used for testing
  testEnvironment: 'node',
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/tests/**/*.test.js',
    '**/src/tests/**/*.test.js'
  ],
  
  // An array of regexp pattern strings that are matched against all test paths
  // Tests that match these patterns will be skipped
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  
  // An array of regexp pattern strings that are matched against all source file paths
  // Files that match these patterns will be transformed
  transform: {},
  
  // An array of regexp pattern strings that are matched against all source file paths
  // Files that match these patterns will not be transformed
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$'
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
  moduleNameMapper: {},
  
  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>/src'
  ],
  
  // The paths to modules that run some code to configure or set up the testing environment
  setupFiles: [],
  
  // A list of paths to modules that run some code to configure or set up the testing framework
  setupFilesAfterEnv: [],
  
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
  ]
};
