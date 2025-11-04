// @see https://stackoverflow.com/questions/51002460/is-it-possible-to-use-jest-with-multiple-presets-at-the-same-time/52622141#52622141
const merge = require('merge')
const ts_preset = require('ts-jest/jest-preset')

module.exports = merge.recursive(ts_preset, {
  moduleNameMapper: {
    '^@faker-js/faker$': '<rootDir>/testlibraries/mocks/faker.js'
  }
});
