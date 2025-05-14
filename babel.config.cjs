/**
 * Babel config
 * @type {TransformOptions}
 */
module.exports = {
  browserslistEnv: 'node',
  plugins: ['@babel/plugin-syntax-import-attributes'],
  presets: [['@babel/preset-env', {}]]
}

/**
 * @import { TransformOptions } from '@babel/core'
 */
