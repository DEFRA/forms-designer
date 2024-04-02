const { BABEL_ENV = 'node' } = process.env

/**
 * Babel config
 *
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  assumptions: {
    enumerableModuleMeta: true
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '~': '.'
        }
      }
    ]
  ],
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        browserslistEnv: BABEL_ENV,
        bugfixes: true,
        modules: BABEL_ENV === 'node' ? 'auto' : 'umd'
      }
    ]
  ],
  sourceMaps: true
}
