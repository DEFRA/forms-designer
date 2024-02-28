const { BABEL_ENV = 'node' } = process.env

/**
 * Babel config
 *
 * @satisfies {import('@babel/core').TransformOptions}
 */
module.exports = {
  presets: [
    '@babel/typescript',
    [
      '@babel/preset-env',
      {
        browserslistEnv: BABEL_ENV,
        bugfixes: true
      }
    ]
  ],
  sourceMaps: true
}
