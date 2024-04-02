const { NODE_ENV } = process.env

/**
 * Babel config
 *
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: ['./server'],
        alias: {
          '~': './server'
        }
      }
    ]
  ],
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        browserslistEnv: 'node',
        bugfixes: true,
        modules: NODE_ENV === 'test' ? 'auto' : false
      }
    ]
  ]
}
