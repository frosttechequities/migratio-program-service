module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "^axios$": "<rootDir>/node_modules/axios/dist/node/axios.cjs"
      },
      setupFilesAfterEnv: [
        "<rootDir>/src/setupTests.js"
      ],
      transformIgnorePatterns: [
        "/node_modules/(?!axios)/"
      ]
    }
  },
};
