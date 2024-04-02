const { NODE_ENV } = process.env

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
            alias: { '~': './queue-model' }
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
        browserslistEnv: 'node',
        bugfixes: true
      }
    ]
  ]
}
