/**
 * Jest config defaults
 * @type {Partial<Config>}
 */
export const defaults = {
  coverageProvider: 'v8',
  maxWorkers: '50%',
  reporters: ['default', ['github-actions', { silent: false }], 'summary'],
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
  }
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
