const { BABEL_ENV = 'node', NODE_ENV } = process.env

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
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        browserslistEnv: BABEL_ENV,
        bugfixes: true,
        modules: BABEL_ENV === 'node' ? 'auto' : 'umd'
      }
    ]
  ]
}
