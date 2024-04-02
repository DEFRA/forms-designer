import { projectDefaults } from '../jest.config.js'

/**
 * Jest project config
 *
 * @type {typeof projectDefaults}
 */
export default {
  ...projectDefaults,
  displayName: '@defra/forms-queue-model',

  // Configure test files and coverage
  testMatch: ['<rootDir>/**/*.test.{cjs,js,mjs,ts}'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{cjs,js,mjs,ts}']
}
