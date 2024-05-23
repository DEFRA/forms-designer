const { BABEL_ENV = 'node', NODE_ENV } = process.env

/**
 * Babel config
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  assumptions: {
    enumerableModuleMeta: true
  },
  browserslistEnv: BABEL_ENV,
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
        // Apply bug fixes to avoid transforms
        bugfixes: true,

        // Apply ES module transforms for Jest
        // https://jestjs.io/docs/ecmascript-modules
        modules: NODE_ENV === 'test' ? 'auto' : false
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
