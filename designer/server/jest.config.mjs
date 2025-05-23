// eslint-disable-next-line no-restricted-imports
import { projectDefaults } from '../../jest.config.mjs'

/**
 * Jest project config
 * @type {typeof projectDefaults}
 */
export default {
  ...projectDefaults,
  displayName: '@defra/forms-designer (server)',

  // Configure test files and coverage
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/**/*.test.{cjs,js,mjs,ts}'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{cjs,js,mjs,ts}'],

  // Configure Node.js environment
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  setupFilesAfterEnv: ['<rootDir>/jest.environment.js']
}
