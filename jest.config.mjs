const { CI } = process.env

/**
 * Jest config defaults
 * @type {Partial<Config>}
 */
export const defaults = {
  maxWorkers: '50%',
  reporters: CI
    ? [['github-actions', { silent: false }], 'summary']
    : ['default', 'summary'],
  silent: true
}

/**
 * Jest project config defaults
 * @type {Exclude<NonNullable<Config['projects']>[0], string>}
 */
export const projectDefaults = {
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{cjs,js,jsx,mjs,ts,tsx}'],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/test/'
  ],
  modulePathIgnorePatterns: ['<rootDir>/coverage/', '<rootDir>/dist/'],
  resetModules: true,
  restoreMocks: true,
  transform: {
    '^.+\\.(cjs|js|jsx|mjs|ts|tsx)$': [
      'babel-jest',
      {
        browserslistEnv: 'node',
        plugins: ['transform-import-meta'],
        rootMode: 'upward'
      }
    ]
  },

  // Enable Babel transforms for node_modules
  // See: https://jestjs.io/docs/ecmascript-modules
  transformIgnorePatterns: [
    `node_modules/(?!${[
      'nanoid', // Supports ESM only
      'slug', // Supports ESM only,
      '@defra/hapi-tracing', // Supports ESM only|
      '@defra/forms-engine-plugin',
      '@defra/forms-model'
    ].join('|')}/)`
  ]
}

/**
 * Jest config
 * @type {Config}
 */
export default {
  ...defaults,
  displayName: '@defra/forms-designer (project)',
  projects: [
    '<rootDir>/designer/client',
    '<rootDir>/designer/server',
    '<rootDir>/model',
    '<rootDir>' // Allow tests at project root
  ],
  // But ignore tests handled by `projects` option
  testPathIgnorePatterns: [
    '<rootDir>/designer/client',
    '<rootDir>/designer/server',
    '<rootDir>/model'
  ]
}

/**
 * @import { Config } from 'jest'
 */
