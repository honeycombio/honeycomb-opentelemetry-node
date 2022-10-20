/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...require('../../jest.base.config.js'),
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['^.+\\.js$'],
  preset: 'ts-jest/presets/js-with-ts',
};
