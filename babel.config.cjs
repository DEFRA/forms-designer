/**
 * Babel config
 *
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        browserslistEnv: 'node',
        bugfixes: true
      }
    ]
  ]
}
