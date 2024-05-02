/**
 * Babel config
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  plugins: ['@babel/plugin-syntax-import-attributes'],
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
