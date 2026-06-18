// eslint-disable-next-line no-restricted-imports
import { projectDefaults } from '../../jest.config.mjs'

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

  // Configure mocks for JavaScript imports
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/mocks/webpack/stylesheet.cjs',
    '\\.(ico|png|svg)$': '<rootDir>/test/mocks/webpack/image.cjs',
    // The real UMD bundle throws "Automatic publicPath is not supported in
    // this browser" under jsdom, so stub it out for all client tests. The
    // draw-ml plugin has its own stub (matched first) so it can be asserted
    // independently of the other interactive-map factories.
    '^@defra/interactive-map/plugins/draw-ml$':
      '<rootDir>/test/mocks/interactive-map-draw-ml.cjs',
    '^@defra/interactive-map(/.*)?$': '<rootDir>/test/mocks/interactive-map.cjs'
  },

  // Enable Babel transforms for node_modules
  // See: https://jestjs.io/docs/ecmascript-modules
  transformIgnorePatterns: [
    `node_modules/(?!${[
      '@xgovformbuilder/govuk-react-jsx/.*',
      'nanoid', // Supports ESM only
      'slug', // Supports ESM only
      '@defra/forms-engine-plugin',
      '@defra/forms-model',
      'geodesy' // Supports ESM only
    ].join('|')}/)`
  ]
}
