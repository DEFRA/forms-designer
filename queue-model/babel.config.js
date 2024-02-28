/**
 * Babel config
 *
 * @satisfies {import('@babel/core').TransformOptions}
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
  ],
  sourceMaps: true
}
