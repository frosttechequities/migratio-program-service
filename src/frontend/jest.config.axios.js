module.exports = {
  // Use the existing Jest config as a base
  ...require('./jest.config.js'),
  
  // Add specific transformIgnorePatterns to handle Axios
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/'
  ],
  
  // Add moduleNameMapper to force Jest to use the CommonJS version of Axios
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  }
};
