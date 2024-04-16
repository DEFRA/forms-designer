/**
 * Jest config defaults
 * @type {Partial<import('@jest/types').Config.InitialOptions>}
 */
export const defaults = {
  maxWorkers: '50%',
  reporters: ['default', ['github-actions', { silent: false }], 'summary'],
  silent: true
}

/**
 * Jest project config defaults
 * @type {Partial<import('@jest/types').Config.InitialProjectOptions>}
 */
export const projectDefaults = {
  clearMocks: true,
  coverageDirectory: '<rootDir>/coverage',
  modulePathIgnorePatterns: ['<rootDir>/coverage/', '<rootDir>/dist/'],
  resetModules: true,
  restoreMocks: true,
  transform: {
    '^.+\\.(cjs|js|jsx|mjs|ts|tsx)$': [
      'babel-jest',
      {
        rootMode: 'upward'
      }
    ]
  }
}

/**
 * Jest config
 * @type {import('@jest/types').Config.InitialOptions}
 */
export default {
  ...defaults,
  projects: [
    '<rootDir>/designer/client',
    '<rootDir>/designer/server',
    '<rootDir>/model'
  ]
}
