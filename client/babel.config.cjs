const pkg = require('../package.json')

const { NODE_ENV } = process.env

/**
 * Babel config
 * @type {TransformOptions}
 */
module.exports = {
  browserslistEnv: 'javascripts',
  plugins: [
    [
      'module-resolver',
      NODE_ENV === 'test'
        ? {
            // Relative to project
            root: ['../../'],
            alias: { '~': './designer/client' }
          }
        : {
            // Relative to workspace
            root: ['./client'],
            alias: { '~': './client' }
          }
    ]
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        // Apply bug fixes to avoid transforms
        bugfixes: true,

        // Apply smaller "loose" transforms for browsers
        loose: true,

        // Apply ES module transforms for Jest
        // https://jestjs.io/docs/ecmascript-modules
        modules: NODE_ENV === 'test' ? 'auto' : false,

        // Add polyfills by Browserslist environment
        corejs: pkg.devDependencies['core-js'],
        shippedProposals: true,
        useBuiltIns: 'usage'
      }
    ],
    [
      '@babel/preset-react',
      {
        development: NODE_ENV === 'development',
        runtime: 'automatic',
        useBuiltIns: true
      }
    ],
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true
      }
    ]
  ],
  sourceType: 'unambiguous',
  env: {
    test: {
      plugins: [
        [
          'replace-import-extension',
          {
            extMapping: {
              '.cjs': '',
              '.js': '',
              '.jsx': ''
            }
          }
        ]
      ]
    }
  }
}

/**
 * @import { TransformOptions } from '@babel/core'
 */
