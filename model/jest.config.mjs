// eslint-disable-next-line no-restricted-imports
import { projectDefaults } from '../jest.config.mjs'

/**
 * Jest project config
 * @type {typeof projectDefaults}
 */
export default {
  ...projectDefaults,
  displayName: '@defra/forms-model',

  // Configure test files and coverage
  testMatch: ['<rootDir>/**/*.test.{cjs,js,mjs,ts}'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{cjs,js,mjs,ts}']
}
