const { NODE_ENV } = process.env

/**
 * Babel config
 * @type {TransformOptions}
 */
module.exports = {
  browserslistEnv: 'node',
  plugins: [
    [
      'module-resolver',
      NODE_ENV === 'test'
        ? {
            // Relative to project
            root: ['../'],
            alias: { '~': './model' }
          }
        : {
            // Relative to workspace
            root: ['./'],
            alias: { '~': '.' }
          }
    ]
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        // Apply bug fixes to avoid transforms
        bugfixes: true,

        // Apply ES module transforms for Jest
        // https://jestjs.io/docs/ecmascript-modules
        modules: NODE_ENV === 'test' ? 'auto' : false
      }
    ],
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true
      }
    ]
  ],
  env: {
    test: {
      plugins: [
        [
          'replace-import-extension',
          {
            extMapping: {
              '.cjs': '',
              '.js': ''
            }
          }
        ],
        'babel-plugin-transform-import-meta'
      ]
    }
  }
}

/**
 * @import { TransformOptions } from '@babel/core'
 */
