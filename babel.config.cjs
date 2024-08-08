/**
 * Babel config
 * @type {TransformOptions}
 */
module.exports = {
  browserslistEnv: 'node',
  plugins: ['@babel/plugin-syntax-import-attributes'],
  presets: [
    [
      '@babel/preset-env',
      {
        // Apply bug fixes to avoid transforms
        bugfixes: true
      }
    ]
  ]
}

/**
 * @import { TransformOptions } from '@babel/core'
 */
