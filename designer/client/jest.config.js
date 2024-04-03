import { projectDefaults } from '../../jest.config.js'

/**
 * Jest project config
 * @type {typeof projectDefaults}
 */
export default {
  ...projectDefaults,
  displayName: '@defra/forms-designer (client)',

  // Configure test files and coverage
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: ['<rootDir>/**/*.test.{cjs,js,mjs,ts,tsx}'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{cjs,js,mjs,ts}'],

  // Configure mock browser environment for React
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  setupFilesAfterEnv: ['<rootDir>/jest.environment.js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { customExportConditions: [''] },

  // Configure mocks for JavaScript imports
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/mocks/webpack/stylesheet.cjs',
    '\\.(ico|png|svg)$': '<rootDir>/test/mocks/webpack/image.cjs'
  },

  // Transform React components to fix missing file extensions etc
  transformIgnorePatterns: [
    '/node_modules/(?!@xgovformbuilder/govuk-react-jsx/.*)'
  ]
}
